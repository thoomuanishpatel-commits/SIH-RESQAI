'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LiveIncident,
  LiveVehicle,
  CityPreset,
  DEMO_HAZARD_ZONES
} from '@/data/liveMapData';
import { DEFAULT_MAP_STYLE, OPENFREEMAP_STYLES, INSTANT_TACTICAL_DARK_STYLE, OSM_ATTRIBUTION, MAP_LAYER_IDS } from '@/lib/openFreeMapStyles';
import { MapLayerState } from './MapLayerControl';
import { Box, Layers, RotateCcw, AlertTriangle, Compass } from 'lucide-react';

interface LiveResponseMapProps {
  selectedCity: CityPreset;
  incidents: LiveIncident[];
  vehicles: LiveVehicle[];
  selectedIncident: LiveIncident | null;
  selectedVehicle: LiveVehicle | null;
  activeRouteCoordinates: [number, number][] | null;
  trackCoordinates: [number, number][] | null;
  layers: MapLayerState;
  onSelectIncident: (incident: LiveIncident) => void;
  onSelectVehicle: (vehicle: LiveVehicle) => void;
}

export const LiveResponseMap: React.FC<LiveResponseMapProps> = ({
  selectedCity,
  incidents,
  vehicles,
  selectedIncident,
  selectedVehicle,
  activeRouteCoordinates,
  trackCoordinates,
  layers,
  onSelectIncident,
  onSelectVehicle
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const incidentMarkersRef = useRef<Map<string, MapLibreMarker>>(new Map());
  const vehicleMarkersRef = useRef<Map<string, MapLibreMarker>>(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [currentStyle, setCurrentStyle] = useState<string>(DEFAULT_MAP_STYLE);

  // Switch MapLibre style dynamically
  const handleSwitchStyle = (styleUrl: string) => {
    if (!mapInstanceRef.current) return;
    setCurrentStyle(styleUrl);
    const styleTarget = styleUrl === 'instant-dark' ? INSTANT_TACTICAL_DARK_STYLE : styleUrl;
    mapInstanceRef.current.setStyle(styleTarget);
    mapInstanceRef.current.once('styledata', () => {
      if (mapInstanceRef.current) {
        setupMapLayers(mapInstanceRef.current);
      }
    });
  };

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    // Prevent duplicate WebGL context creation on React StrictMode dev mounts
    if (mapInstanceRef.current) {
      mapInstanceRef.current.resize();
      return;
    }

    let map: MapLibreMap;
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;

    const handleResize = () => {
      if (map) map.resize();
    };

    const initMap = async () => {
      try {
        const initialStyle = currentStyle === 'instant-dark' ? INSTANT_TACTICAL_DARK_STYLE : currentStyle;

        map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: initialStyle,
          center: selectedCity.center,
          zoom: selectedCity.zoom,
          pitch: 45,
          bearing: -12,
          attributionControl: false,
          maxPitch: 75
        });

        // Add attribution control with OpenFreeMap and OpenStreetMap
        map.addControl(
          new maplibregl.AttributionControl({
            customAttribution: OSM_ATTRIBUTION,
            compact: true
          }),
          'bottom-right'
        );

        // Native Navigation Controls
        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: true,
            showCompass: true,
            showZoom: true
          }),
          'top-right'
        );

        // Geolocation Control
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
          }),
          'top-right'
        );

        // Fullscreen Control
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');

        // Scale bar in km
        map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

        mapInstanceRef.current = map;

        let layersSetup = false;
        const ensureReady = () => {
          setMapLoaded(true);
          if (!layersSetup && map.isStyleLoaded()) {
            layersSetup = true;
            setupMapLayers(map);
          }
          map.resize();
        };

        map.on('styledata', ensureReady);
        map.on('load', ensureReady);

        // Immediate unlock: within 350ms, mark map active so canvas, markers, and layers render without delay
        const unlockTimer = setTimeout(() => {
          ensureReady();
        }, 350);

        map.on('error', (e) => {
          console.warn('MapLibre event error:', e);
        });

        // Trigger resize periodically to avoid blank canvas in dynamic flexbox layouts
        t1 = setTimeout(() => map.resize(), 100);
        t2 = setTimeout(() => map.resize(), 400);
        t3 = setTimeout(() => map.resize(), 1000);

        window.addEventListener('resize', handleResize);
      } catch (err: any) {
        console.error('Failed to initialize WebGL MapLibre map:', err);
        setMapError('MAP SERVICE TEMPORARILY UNAVAILABLE (WebGL or tile connection failed)');
      }
    };

    initMap();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      incidentMarkersRef.current.clear();
      vehicleMarkersRef.current.clear();
    };
  }, []);

  // Fly to city when city preset changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    mapInstanceRef.current.flyTo({
      center: selectedCity.center,
      zoom: selectedCity.zoom,
      essential: true,
      duration: 2000
    });
  }, [selectedCity, mapLoaded]);

  // Toggle 2D / 3D camera
  const handleToggle3D = () => {
    if (!mapInstanceRef.current) return;
    const next = !is3DMode;
    setIs3DMode(next);
    mapInstanceRef.current.easeTo({
      pitch: next ? 50 : 0,
      bearing: next ? -15 : 0,
      duration: 1000
    });
  };

  // Setup GeoJSON Sources and Layers (Hazard polygons, Heatmap, Road Routes)
  const setupMapLayers = (map: MapLibreMap) => {
    try {
      // 1. Hazard Zones GeoJSON Source & Polygon Fill/Line Layers
      if (!map.getSource('hazard-zones-source')) {
        map.addSource('hazard-zones-source', {
          type: 'geojson',
          data: DEMO_HAZARD_ZONES
        });

        map.addLayer({
          id: MAP_LAYER_IDS.HAZARD_ZONES_FILL,
          type: 'fill',
          source: 'hazard-zones-source',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': ['get', 'fillOpacity']
          }
        });

        map.addLayer({
          id: MAP_LAYER_IDS.HAZARD_ZONES_LINE,
          type: 'line',
          source: 'hazard-zones-source',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-dasharray': [3, 2]
          }
        });
      }

      // 2. Road Route Line Source & Layer
      if (!map.getSource('route-source')) {
        map.addSource('route-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: [] }
          }
        });

        // Route casing / glow
        map.addLayer({
          id: MAP_LAYER_IDS.VEHICLE_ROUTE_CASING,
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#0284c7',
            'line-width': 8,
            'line-opacity': 0.4
          }
        });

        // Inner route dashed line
        map.addLayer({
          id: MAP_LAYER_IDS.VEHICLE_ROUTE_LINE,
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#38bdf8',
            'line-width': 4,
            'line-dasharray': [2, 1]
          }
        });
      }

      // 3. Track History Source & Layer
      if (!map.getSource('track-source')) {
        map.addSource('track-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: [] }
          }
        });

        map.addLayer({
          id: MAP_LAYER_IDS.VEHICLE_TRACK_HISTORY,
          type: 'line',
          source: 'track-source',
          paint: {
            'line-color': '#f59e0b',
            'line-width': 3,
            'line-opacity': 0.7,
            'line-dasharray': [4, 2]
          }
        });
      }

      // 4. Incident Heatmap Source & Layer
      if (!map.getSource('heatmap-source')) {
        const heatmapPoints: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: incidents.map((inc) => ({
            type: 'Feature',
            properties: { intensity: inc.severity === 'CRITICAL' ? 1.0 : 0.6 },
            geometry: { type: 'Point', coordinates: [inc.longitude, inc.latitude] }
          }))
        };

        map.addSource('heatmap-source', {
          type: 'geojson',
          data: heatmapPoints
        });

        map.addLayer({
          id: MAP_LAYER_IDS.INCIDENT_HEATMAP,
          type: 'heatmap',
          source: 'heatmap-source',
          paint: {
            'heatmap-weight': ['get', 'intensity'],
            'heatmap-intensity': 1.5,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(56,189,248,0.4)',
              0.5, 'rgba(234,179,8,0.7)',
              0.8, 'rgba(239,68,68,0.9)',
              1, 'rgba(255,255,255,1)'
            ],
            'heatmap-radius': 35,
            'heatmap-opacity': 0.75
          }
        });
      }
    } catch (err) {
      console.warn('Layer setup issue:', err);
    }
  };

  // Sync route coordinates to MapLibre GeoJSON source
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;
    const routeSource = map.getSource('route-source') as any;
    if (routeSource) {
      routeSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: activeRouteCoordinates && activeRouteCoordinates.length > 1 ? activeRouteCoordinates : []
        }
      });
    }
  }, [activeRouteCoordinates, mapLoaded]);

  // Sync track history coordinates to MapLibre GeoJSON source
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;
    const trackSource = map.getSource('track-source') as any;
    if (trackSource) {
      trackSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: trackCoordinates && trackCoordinates.length > 1 ? trackCoordinates : []
        }
      });
    }
  }, [trackCoordinates, mapLoaded]);

  // Sync layer visibility
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    const setLayerVisibility = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setLayerVisibility(MAP_LAYER_IDS.HAZARD_ZONES_FILL, layers.hazardZones);
    setLayerVisibility(MAP_LAYER_IDS.HAZARD_ZONES_LINE, layers.hazardZones);
    setLayerVisibility(MAP_LAYER_IDS.INCIDENT_HEATMAP, layers.heatmap);
    setLayerVisibility(MAP_LAYER_IDS.VEHICLE_ROUTE_LINE, layers.vehicleRoutes);
    setLayerVisibility(MAP_LAYER_IDS.VEHICLE_ROUTE_CASING, layers.vehicleRoutes);
  }, [layers, mapLoaded]);

  // Custom SVG Incident Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    // Clean up markers no longer in dataset or when layer is toggled off
    incidentMarkersRef.current.forEach((marker, id) => {
      if (!layers.incidents || !incidents.find((inc) => inc.id === id)) {
        marker.remove();
        incidentMarkersRef.current.delete(id);
      }
    });

    if (!layers.incidents) return;

    incidents.forEach((inc) => {
      const existingMarker = incidentMarkersRef.current.get(inc.id);

      if (!existingMarker) {
        const el = document.createElement('div');
        el.className = 'resqai-incident-marker cursor-pointer group transition-transform duration-200 hover:scale-110';
        el.innerHTML = createIncidentMarkerSvg(inc);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectIncident(inc);
          map.flyTo({
            center: [inc.longitude, inc.latitude],
            zoom: Math.max(map.getZoom(), 14),
            speed: 1.2
          });
        });

        const newMarker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.longitude, inc.latitude])
          .addTo(map);

        incidentMarkersRef.current.set(inc.id, newMarker);
      } else {
        existingMarker.setLngLat([inc.longitude, inc.latitude]);
        // Update pulse or style if selected
        if (selectedIncident?.id === inc.id) {
          existingMarker.getElement().classList.add('ring-4', 'ring-rose-500/60');
        } else {
          existingMarker.getElement().classList.remove('ring-4', 'ring-rose-500/60');
        }
      }
    });
  }, [incidents, layers.incidents, selectedIncident, mapLoaded, onSelectIncident]);

  // Custom Vehicle Markers with Heading Rotation & Smooth Interpolation
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    vehicleMarkersRef.current.forEach((marker, id) => {
      if (!layers.vehicles || !vehicles.find((v) => v.id === id)) {
        marker.remove();
        vehicleMarkersRef.current.delete(id);
      }
    });

    if (!layers.vehicles) return;

    vehicles.forEach((veh) => {
      const existingMarker = vehicleMarkersRef.current.get(veh.id);

      if (!existingMarker) {
        const el = document.createElement('div');
        el.className = 'resqai-vehicle-marker cursor-pointer transition-transform duration-300 hover:scale-110';
        el.innerHTML = createVehicleMarkerHtml(veh);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectVehicle(veh);
          map.flyTo({
            center: [veh.longitude, veh.latitude],
            zoom: Math.max(map.getZoom(), 14.5),
            speed: 1.2
          });
        });

        const newMarker = new maplibregl.Marker({ element: el })
          .setLngLat([veh.longitude, veh.latitude])
          .addTo(map);

        vehicleMarkersRef.current.set(veh.id, newMarker);
      } else {
        // Smoothly update position
        existingMarker.setLngLat([veh.longitude, veh.latitude]);
        // Update rotation heading
        const iconEl = existingMarker.getElement().querySelector('.vehicle-icon-inner') as HTMLElement;
        if (iconEl) {
          iconEl.style.transform = `rotate(${veh.heading}deg)`;
        }
        // Update status ring
        if (selectedVehicle?.id === veh.id) {
          existingMarker.getElement().classList.add('ring-4', 'ring-blue-400/70');
        } else {
          existingMarker.getElement().classList.remove('ring-4', 'ring-blue-400/70');
        }
      }
    });
  }, [vehicles, layers.vehicles, selectedVehicle, mapLoaded, onSelectVehicle]);

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-3xl bg-[#090D16] border border-slate-800">
      {/* Real WebGL Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[600px]"
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
      />

      {/* Non-blocking Streaming Status Pill */}
      {!mapLoaded && (
        <div className="absolute top-4 right-16 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Streaming Map Tiles...</span>
        </div>
      )}

      {/* 2D / 3D Perspective Toggle & Style Switcher Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={handleToggle3D}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition shadow-xl border backdrop-blur-md ${
            is3DMode
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-900/40'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
          }`}
          title="Toggle 2D / 3D Camera Pitch"
        >
          <Box className="w-3.5 h-3.5" />
          <span>{is3DMode ? '3D PITCH' : '2D FLAT'}</span>
        </button>

        {/* Vector Style Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl backdrop-blur-md shadow-xl gap-1">
          {OPENFREEMAP_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleSwitchStyle(style.url)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                currentStyle === style.url
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title={`Switch to ${style.name}`}
            >
              {style.id}
            </button>
          ))}
        </div>
      </div>

      {/* Map Error Banner */}
      {mapError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center">
          <div className="max-w-md p-6 rounded-3xl bg-red-950/50 border border-red-500/50 space-y-3">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              {mapError}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              OpenFreeMap tile server is unreachable or WebGL acceleration is disabled in this browser.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-mono transition"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom SVG Incident Marker HTML generator
function createIncidentMarkerSvg(inc: LiveIncident): string {
  const isCritical = inc.severity === 'CRITICAL';
  const color =
    inc.severity === 'CRITICAL'
      ? '#ef4444'
      : inc.severity === 'HIGH'
      ? '#f97316'
      : inc.severity === 'MODERATE'
      ? '#eab308'
      : '#38bdf8';

  const emoji = getHazardEmoji(inc.type);

  return `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      ${
        isCritical
          ? `<div style="position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border-radius: 9999px; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ''
      }
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: #0f172a;
        border: 2px solid ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
      ">
        ${emoji}
      </div>
      <div style="
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid ${color};
        border-radius: 6px;
        padding: 1px 5px;
        font-size: 9px;
        font-weight: 800;
        font-family: monospace;
        margin-top: 2px;
        white-space: nowrap;
      ">
        #${inc.id}
      </div>
    </div>
  `;
}

// Custom Vehicle Marker HTML generator
function createVehicleMarkerHtml(veh: LiveVehicle): string {
  const icon =
    veh.vehicle_type === 'FIRE'
      ? '🚒'
      : veh.vehicle_type === 'AMBULANCE'
      ? '🚑'
      : veh.vehicle_type === 'POLICE'
      ? '🚓'
      : veh.vehicle_type === 'RELIEF'
      ? '🛟'
      : '🚁';

  const isMoving = veh.speed > 0;
  const statusColor = veh.status === 'RESPONDING' ? '#38bdf8' : veh.status === 'ON_SCENE' ? '#22c55e' : '#94a3b8';

  return `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div class="vehicle-icon-inner" style="
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: #090d16;
        border: 2px solid ${statusColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.6);
        transition: transform 0.3s ease;
      ">
        ${icon}
      </div>
      <div style="
        background: #0f172a;
        color: ${statusColor};
        border: 1px solid ${statusColor};
        border-radius: 4px;
        padding: 0 4px;
        font-size: 8px;
        font-weight: 900;
        font-family: monospace;
        margin-top: 2px;
        white-space: nowrap;
      ">
        ${veh.vehicle_code}
      </div>
    </div>
  `;
}

function getHazardEmoji(type: string): string {
  switch (type) {
    case 'FIRE':
      return '🔥';
    case 'ACCIDENT':
      return '🚗';
    case 'FLOOD':
      return '🌊';
    case 'CYCLONE':
      return '🌪️';
    case 'EARTHQUAKE':
      return '🌎';
    case 'LIGHTNING':
      return '⚡';
    case 'LANDSLIDE':
      return '⛰️';
    case 'TSUNAMI':
      return '🌊';
    case 'WILDFIRE':
      return '🔥';
    case 'CHEMICAL':
      return '☣️';
    case 'SOS':
    default:
      return '🆘';
  }
}
