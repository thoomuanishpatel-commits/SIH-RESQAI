'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  Polyline,
  Polygon,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Building,
  HeartPulse,
  Flame,
  Waves,
  CarFront,
  Building2,
  Truck,
  AlertTriangle,
  Home,
  Layers,
  MapPin,
  Shield,
  Phone,
  CheckCircle2,
  Navigation,
  Eye,
  Radio,
  Sparkles
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { Incident, Hospital, BuildingLandmark, EmergencyUnit, ReliefShelter, RoadBlock } from '@/types';

// Map auto-panner to smoothly fly to selected entity
const MapFlyTo: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 14), { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
};

// Create custom HTML divIcons for Leaflet
const createHospitalIcon = (hosp: Hospital) => {
  const isFull = hosp.status === 'AT_CAPACITY';
  const isCriticalOnly = hosp.status === 'CRITICAL_ONLY';
  const bg = isFull ? 'bg-rose-600' : isCriticalOnly ? 'bg-amber-500' : 'bg-blue-600';
  const ring = isFull ? 'ring-rose-400/50' : isCriticalOnly ? 'ring-amber-400/50' : 'ring-blue-400/50';

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="w-8 h-8 rounded-xl ${bg} text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ${ring} transform transition-transform hover:scale-125">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 6v12"/><path d="M6 12h12"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 -right-1 bg-slate-950 text-[9px] font-mono font-bold text-white px-1 py-0.2 rounded border border-slate-700">
          ${hosp.icuAvailable} ICU
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createBuildingIcon = (bld: BuildingLandmark) => {
  const isAtRisk = bld.structuralStatus === 'AT_RISK';
  const isEvac = bld.structuralStatus === 'EVACUATING';
  const border = isAtRisk ? 'border-rose-500 ring-rose-500/40' : isEvac ? 'border-amber-500 ring-amber-500/40' : 'border-indigo-400 ring-indigo-500/30';
  const bg = isAtRisk ? 'bg-rose-950/90' : isEvac ? 'bg-amber-950/90' : 'bg-slate-900/90';

  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="w-7 h-7 rounded-lg ${bg} ${border} border-2 text-indigo-300 flex items-center justify-center shadow-lg ring-2 transform transition-transform hover:scale-125">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
          </svg>
        </div>
        ${isAtRisk ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>' : ''}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

const createIncidentIcon = (inc: Incident, isSelected: boolean) => {
  const isCritical = inc.severity === 'CRITICAL';
  const bg = isCritical ? 'bg-rose-600' : 'bg-amber-500';
  const pingColor = isCritical ? 'bg-rose-500' : 'bg-amber-400';

  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="absolute -inset-2 rounded-full ${pingColor} opacity-40 animate-ping"></div>
        <div class="w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center shadow-2xl border-2 ${isSelected ? 'border-white ring-4 ring-rose-400 scale-125' : 'border-slate-900'} transform transition-transform hover:scale-125">
          <span class="text-xs font-black">!</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createUnitIcon = (unit: EmergencyUnit) => {
  const isEnRoute = unit.status === 'EN_ROUTE';
  const isOnScene = unit.status === 'ON_SCENE';
  const cat = unit.vehicleCategory || (unit.type === 'EMS' ? 'AMBULANCE_ALS' : unit.type === 'FIRE' ? 'FIRE_ENGINE' : unit.type === 'POLICE' ? 'POLICE_PATROL' : 'RESCUE_BOAT');

  let borderColor = '#3b82f6';
  let bgColor = '#172554';
  let badgeColor = '#60a5fa';
  let iconSvg = '';
  let vehicleBadge = 'UNIT';
  let pingEffect = '';

  if (cat.startsWith('AMBULANCE')) {
    borderColor = '#ef4444';
    bgColor = '#450a0a';
    badgeColor = '#f87171';
    vehicleBadge = cat === 'AMBULANCE_BUS' ? 'BUS' : cat === 'AMBULANCE_ALS' ? 'ALS' : 'BLS';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="M8 7v6"/></svg>`;
    if (isEnRoute || isOnScene) {
      pingEffect = `<div class="absolute -inset-2.5 rounded-full bg-rose-500 opacity-60 animate-ping"></div>`;
    }
  } else if (cat.startsWith('FIRE')) {
    borderColor = '#f97316';
    bgColor = '#431407';
    badgeColor = '#fb923c';
    vehicleBadge = cat === 'FIRE_SKYLIFT' ? 'LADDER' : cat === 'FIRE_FOAM' ? 'FOAM' : 'PUMPER';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
    if (isEnRoute || isOnScene) {
      pingEffect = `<div class="absolute -inset-2.5 rounded-full bg-amber-500 opacity-60 animate-ping"></div>`;
    }
  } else if (cat.startsWith('POLICE')) {
    borderColor = '#38bdf8';
    bgColor = '#082f49';
    badgeColor = '#7dd3fc';
    vehicleBadge = cat === 'POLICE_TACTICAL' ? 'SWAT' : 'COP';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    if (isEnRoute || isOnScene) {
      pingEffect = `
        <div class="absolute -inset-2.5 rounded-full bg-sky-500 opacity-60 animate-ping"></div>
        <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
        <div class="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
      `;
    }
  } else if (cat.startsWith('RESCUE')) {
    borderColor = '#10b981';
    bgColor = '#022c22';
    badgeColor = '#34d399';
    vehicleBadge = cat === 'RESCUE_BOAT' ? 'BOAT' : 'RESCUE';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>`;
    if (isEnRoute || isOnScene) {
      pingEffect = `<div class="absolute -inset-2.5 rounded-full bg-emerald-500 opacity-60 animate-ping"></div>`;
    }
  } else if (cat === 'HAZMAT_DECON') {
    borderColor = '#eab308';
    bgColor = '#422006';
    badgeColor = '#fde047';
    vehicleBadge = 'HAZMAT';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>`;
  } else {
    borderColor = '#a855f7';
    bgColor = '#3b0764';
    badgeColor = '#d8b4fe';
    vehicleBadge = 'EOC';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-leaflet-unit',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none group">
        ${pingEffect}
        <div class="w-8 h-8 rounded-xl border-2 flex items-center justify-center shadow-2xl transform hover:scale-125 transition-transform" style="background-color: ${bgColor}; border-color: ${borderColor}; box-shadow: 0 0 12px ${borderColor}50">
          ${iconSvg}
        </div>
        <div class="absolute -top-3.5 px-1 py-0.2 rounded text-[7px] font-mono font-bold whitespace-nowrap border shadow" style="background-color: #09090b; border-color: ${borderColor}80; color: ${badgeColor}">
          ${vehicleBadge}: ${unit.callsign.split(' ')[0]}
        </div>
        ${unit.speedKmh ? `<div class="absolute -bottom-3 px-1 rounded text-[6px] font-mono bg-black/90 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">${unit.speedKmh} km/h</div>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createRoadBlockIcon = (rb: RoadBlock) => {
  const isBlocked = rb.severity === 'BLOCKED';
  return L.divIcon({
    className: 'custom-roadblock-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="w-7 h-7 rounded-lg ${isBlocked ? 'bg-rose-700' : 'bg-amber-600'} border-2 border-white text-white flex items-center justify-center shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

const createShelterIcon = (shelter: ReliefShelter) => {
  return L.divIcon({
    className: 'custom-shelter-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="w-7 h-7 rounded-xl bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

const createUserLiveLocationIcon = () => {
  return L.divIcon({
    className: 'custom-citizen-live-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="absolute -inset-3 rounded-full bg-cyan-400 opacity-50 animate-ping"></div>
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-cyan-500/50 transform hover:scale-125 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="absolute -bottom-2 bg-slate-950 text-[9px] font-mono font-bold text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/70 shadow whitespace-nowrap">
          YOUR REAL GPS
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

type TileSource = 'DARK' | 'SATELLITE' | 'STREET';

export const LeafletLiveMap: React.FC = () => {
  const {
    incidents,
    units,
    hospitals,
    shelters,
    roadBlocks,
    riskZones,
    buildings,
    selectedIncident,
    setSelectedIncident,
    selectedBuilding,
    setSelectedBuilding,
    dispatchUnit,
    userLiveLocation
  } = useEmergency();

  const [tileType, setTileType] = useState<TileSource>('DARK');
  const [layersOpen, setLayersOpen] = useState(false);

  // Layer toggles
  const [showHospitals, setShowHospitals] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [showRoadblocks, setShowRoadblocks] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  // Vehicle category filter
  const [vehicleFilter, setVehicleFilter] = useState<'ALL' | 'EMS' | 'FIRE' | 'POLICE' | 'RESCUE' | 'HAZMAT'>('ALL');

  // Filtered units based on vehicle category
  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      if (vehicleFilter === 'ALL') return true;
      if (vehicleFilter === 'EMS') return u.vehicleCategory?.startsWith('AMBULANCE') || u.type === 'EMS';
      if (vehicleFilter === 'FIRE') return u.vehicleCategory?.startsWith('FIRE') || u.type === 'FIRE';
      if (vehicleFilter === 'POLICE') return u.vehicleCategory?.startsWith('POLICE') || u.type === 'POLICE';
      if (vehicleFilter === 'RESCUE') return u.vehicleCategory?.startsWith('RESCUE') || u.type === 'RESCUE';
      if (vehicleFilter === 'HAZMAT') return u.vehicleCategory === 'HAZMAT_DECON' || u.vehicleCategory === 'MOBILE_EOC';
      return true;
    });
  }, [units, vehicleFilter]);

  // Active fly-to coordinate tracking
  const [flyCoords, setFlyCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (selectedIncident) {
      setFlyCoords([selectedIncident.location.lat, selectedIncident.location.lng]);
    }
  }, [selectedIncident]);

  useEffect(() => {
    if (selectedBuilding) {
      setFlyCoords([selectedBuilding.lat, selectedBuilding.lng]);
    }
  }, [selectedBuilding]);

  // Center of Hyderabad (HITEC City / Jubilee Hills focus)
  const defaultCenter: [number, number] = [17.4350, 78.4150];

  interface TileConfig {
    url: string;
    attr: string;
    subdomains?: string;
    maxNativeZoom: number;
    maxZoom: number;
  }

  const tileUrls: Record<TileSource, TileConfig> = {
    DARK: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attr: '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
      subdomains: 'abc',
      maxNativeZoom: 19,
      maxZoom: 20
    },
    SATELLITE: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attr: '&copy; Esri, Maxar, Earthstar Geographics',
      maxNativeZoom: 18,
      maxZoom: 20
    },
    STREET: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attr: '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
      subdomains: 'abc',
      maxNativeZoom: 19,
      maxZoom: 20
    }
  };

  // Active routing path computation
  const activeUnit = units.find(u => u.status === 'EN_ROUTE') || units[0];
  const targetIncident = selectedIncident || incidents[0];
  const isRoadBlocked = roadBlocks.some(rb => rb.severity === 'BLOCKED');

  // Real route polyline coordinates with detour around Cyber Towers if blocked
  const routePoints: [number, number][] = useMemo(() => {
    if (!activeUnit || !targetIncident) return [];
    const start: [number, number] = [activeUnit.location.lat, activeUnit.location.lng];
    const end: [number, number] = [targetIncident.location.lat, targetIncident.location.lng];

    if (isRoadBlocked) {
      // Detour bypass coordinates via Inorbit / Durgam Cheruvu cable bridge
      const detourMid: [number, number] = [17.4330, 78.3850];
      const detourMid2: [number, number] = [17.4390, 78.3870];
      return [start, detourMid, detourMid2, end];
    } else {
      return [start, end];
    }
  }, [activeUnit, targetIncident, isRoadBlocked]);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090D16] isolate">
      
      {/* Top Left Floating Bar: GIS Status & Layer Toggles */}
      <div className="absolute top-4 left-4 z-[800] flex items-center gap-2">
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            LIVE GIS MAP • ALL-INDIA CRISIS GRID
          </span>
          <span className="text-[10px] font-mono text-slate-400 border-l border-slate-700 pl-2">
            OSM / Esri
          </span>
        </div>

        {/* Layer toggle popover */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono font-bold shadow-xl transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>LAYERS & TILES</span>
          </button>

          {layersOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl p-3.5 shadow-2xl space-y-3 z-[850] text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                  Base Tile Style
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['DARK', 'SATELLITE', 'STREET'] as TileSource[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTileType(t)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                        tileType === t
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  Interactive Features
                </div>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Hospitals ({hospitals.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showHospitals}
                    onChange={e => setShowHospitals(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>Buildings & Hubs ({buildings.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showBuildings}
                    onChange={e => setShowBuildings(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Emergency Incidents</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showIncidents}
                    onChange={e => setShowIncidents(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Responder Units ({units.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showUnits}
                    onChange={e => setShowUnits(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span>Road Closures</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showRoadblocks}
                    onChange={e => setShowRoadblocks(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Relief Shelters</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showShelters}
                    onChange={e => setShowShelters(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Fleet Filter Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl text-xs font-mono">
          {[
            { id: 'ALL', label: `All Fleet (${units.length})` },
            { id: 'EMS', label: '🚑 Ambulances' },
            { id: 'FIRE', label: '🚒 Fire' },
            { id: 'POLICE', label: '🚓 Police' },
            { id: 'RESCUE', label: '🚤 Rescue' },
            { id: 'HAZMAT', label: '☣️ Hazmat/EOC' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setVehicleFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                vehicleFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Road Block Detour Overlay Notice */}
      {isRoadBlocked && (
        <div className="absolute bottom-10 left-4 z-[750] bg-rose-950/90 border border-rose-600/80 text-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2.5 max-w-sm animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-white">DYNAMIC DETOUR ENGAGED</div>
            <div className="text-[11px] text-rose-300">
              Cyber Towers underpass blocked. Rerouted via Cable Bridge bypass.
            </div>
          </div>
        </div>
      )}

      {/* Actual React-Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        minZoom={4}
        maxZoom={20}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapFlyTo coords={flyCoords} />

        <TileLayer
          key={`${tileType}-${tileUrls[tileType].url}`}
          attribution={tileUrls[tileType].attr}
          url={tileUrls[tileType].url}
          subdomains={tileUrls[tileType].subdomains || 'abc'}
          maxNativeZoom={tileUrls[tileType].maxNativeZoom}
          maxZoom={tileUrls[tileType].maxZoom}
        />

        {/* HAZARD ZONES: Inundation & Thermal perimeters */}
        {showHazards && riskZones.map(rz => (
          <Circle
            key={rz.id}
            center={[rz.center.lat, rz.center.lng]}
            radius={rz.radiusMeters}
            pathOptions={{
              color: rz.hazardType === 'FLOOD_INUNDATION' ? '#0284C7' : '#EF4444',
              fillColor: rz.hazardType === 'FLOOD_INUNDATION' ? '#38BDF8' : '#F87171',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '6, 6'
            }}
          >
            <Tooltip permanent={false} direction="top">
              <div className="text-xs font-mono">
                <strong>{rz.name}</strong> ({rz.evacuationStatus})
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* DYNAMIC RESPONDER ROUTE LINE */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: isRoadBlocked ? '#F59E0B' : '#3B82F6',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9
            }}
          >
            <Tooltip permanent={false} direction="center">
              <div className="text-xs font-mono">
                {isRoadBlocked ? 'DETOUR ROUTE (ETA: 5m)' : 'DIRECT RAPID TRANSIT (ETA: 4m)'}
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 0. CITIZEN REAL-TIME LIVE GPS BEACON */}
        {userLiveLocation && (
          <Marker
            position={[userLiveLocation.lat, userLiveLocation.lng]}
            icon={createUserLiveLocationIcon()}
          >
            <Tooltip direction="top" offset={[0, -20]} permanent={false}>
              <div className="font-mono text-xs text-slate-900 font-bold">
                📍 YOUR REAL GPS LOCATION (±{userLiveLocation.accuracy || 4}m)
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans space-y-1.5 min-w-[220px]">
                <div className="flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Real Device GPS Locked</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{userLiveLocation.address}</p>
                <div className="text-[11px] font-mono text-emerald-400">
                  {userLiveLocation.lat.toFixed(5)}° N, {userLiveLocation.lng.toFixed(5)}° E
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Accuracy: ±{userLiveLocation.accuracy || 4}m • Auto-attached to SOS
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 1. POINTING HOSPITALS */}
        {showHospitals && hospitals.map(hosp => (
          <Marker
            key={hosp.id}
            position={[hosp.location.lat, hosp.location.lng]}
            icon={createHospitalIcon(hosp)}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
              <div className="font-mono text-xs text-slate-900 font-bold">
                🏥 {hosp.name} • {hosp.icuAvailable} ICU Beds
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold">
                    {hosp.traumaLevel}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      hosp.status === 'ACCEPTING'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {hosp.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{hosp.name}</h4>
                  <p className="text-[11px] text-slate-400">{hosp.location.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-2 rounded-lg font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">EMERGENCY BEDS</span>
                    <span className="font-bold text-white">{hosp.availableBeds} / {hosp.totalBeds}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">ICU CAPACITY</span>
                    <span className="font-bold text-rose-400">{hosp.icuAvailable} / {hosp.icuTotal}</span>
                  </div>
                </div>

                <div className="pt-1 flex gap-1.5">
                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-center text-xs font-mono font-semibold transition"
                  >
                    Call ER
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${hosp.location.lat},${hosp.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-center text-xs font-mono font-bold transition"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 2. POINTING BUILDINGS & KEY INFRASTRUCTURE */}
        {showBuildings && buildings.map(bld => (
          <Marker
            key={bld.id}
            position={[bld.lat, bld.lng]}
            icon={createBuildingIcon(bld)}
            eventHandlers={{
              click: () => setSelectedBuilding(bld)
            }}
          >
            <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
              <div className="font-mono text-xs text-slate-900 font-bold">
                🏢 {bld.name} ({bld.floors} Flrs)
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans space-y-2 min-w-[230px]">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {bld.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      bld.structuralStatus === 'AT_RISK'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : bld.structuralStatus === 'EVACUATING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {bld.structuralStatus}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{bld.name}</h4>
                  <p className="text-[11px] text-slate-400">{bld.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-2 rounded-lg font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">FLOORS</span>
                    <span className="font-bold text-white">{bld.floors} Stories</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">OCCUPANCY</span>
                    <span className="font-bold text-amber-300">~{bld.occupancyEstimate.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-300">
                  <span className="text-slate-500 block">SAFETY PROTOCOLS:</span>
                  <span>{bld.safetyFeatures.join(', ')}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. POINTING INCIDENTS */}
        {showIncidents && incidents.map(inc => {
          if (inc.status === 'RESOLVED') return null;
          const isSelected = selectedIncident?.id === inc.id;
          return (
            <Marker
              key={inc.id}
              position={[inc.location.lat, inc.location.lng]}
              icon={createIncidentIcon(inc, isSelected)}
              eventHandlers={{
                click: () => setSelectedIncident(inc)
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                <div className="font-mono text-xs text-slate-900 font-bold">
                  ⚠️ {inc.id}: {inc.title}
                </div>
              </Tooltip>
              <Popup className="custom-leaflet-popup">
                <div className="p-3 font-sans space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="text-xs font-mono font-bold text-rose-400">{inc.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      {inc.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-400">{inc.location.address}</p>
                  <div className="text-xs font-mono text-amber-300">
                    Casualties: {inc.estimatedCasualties} • Trapped: {inc.trappedCount || 0}
                  </div>
                  <button
                    onClick={() => setSelectedIncident(inc)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold transition mt-1"
                  >
                    Select for Smart Dispatch
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. POINTING RESPONDER UNITS */}
        {showUnits && filteredUnits.map(unit => {
          const isAmbulance = unit.vehicleCategory?.startsWith('AMBULANCE') || unit.type === 'EMS';
          const isFire = unit.vehicleCategory?.startsWith('FIRE') || unit.type === 'FIRE';
          const isPolice = unit.vehicleCategory?.startsWith('POLICE') || unit.type === 'POLICE';
          const isBoat = unit.vehicleCategory === 'RESCUE_BOAT';
          const isHazmat = unit.vehicleCategory === 'HAZMAT_DECON';
          const isEOC = unit.vehicleCategory === 'MOBILE_EOC';

          const iconEmoji = isBoat ? '🚤' : isFire ? '🚒' : isAmbulance ? '🚑' : isPolice ? '🚓' : isHazmat ? '☣️' : isEOC ? '📡' : '🚨';

          return (
            <Marker
              key={unit.id}
              position={[unit.location.lat, unit.location.lng]}
              icon={createUnitIcon(unit)}
            >
              <Tooltip direction="top" offset={[0, -20]}>
                <div className="font-mono text-xs text-slate-900 font-bold">
                  {iconEmoji} {unit.callsign} ({unit.status})
                  {unit.speedKmh ? ` • ${unit.speedKmh} km/h` : ''}
                </div>
              </Tooltip>
              <Popup className="custom-leaflet-popup">
                <div className="p-3 bg-slate-950 text-white font-mono space-y-2 min-w-[270px] rounded-xl border border-slate-800 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{iconEmoji}</span>
                      <span className="text-xs font-black text-white">{unit.callsign}</span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                      unit.status === 'EN_ROUTE'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : unit.status === 'ON_SCENE'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}>
                      {unit.status}
                    </span>
                  </div>

                  {/* Vehicle Spec & Plate */}
                  <div className="text-[10px] space-y-0.5">
                    <div className="text-slate-400 text-[8px] uppercase tracking-wider font-semibold">VEHICLE CLASS & MODEL</div>
                    <div className="text-slate-100 font-bold text-xs">{unit.modelName || `${unit.type} Specialized Vehicle`}</div>
                    <div className="text-sky-400 text-[9px] font-mono">REG: {unit.plateNumber || 'TS-09-POLICE'} • {unit.department}</div>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[9px] text-center font-mono">
                    <div>
                      <span className="text-slate-500 block text-[8px]">SPEED</span>
                      <span className={`font-bold ${unit.speedKmh ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {unit.speedKmh || 0} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">CREW</span>
                      <span className="font-bold text-cyan-300">{unit.crewCount} Pers</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">FUEL</span>
                      <span className="font-bold text-amber-400">{unit.fuelPercent || 85}%</span>
                    </div>
                  </div>

                  {/* Resource Gauges */}
                  {unit.waterTankLiters ? (
                    <div className="flex justify-between items-center text-[9px] bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 text-amber-300">
                      <span>💧 WATER TANK RESERVE:</span>
                      <span className="font-bold">{unit.waterTankLiters.toLocaleString()} Liters</span>
                    </div>
                  ) : null}

                  {unit.oxygenLevelPercent ? (
                    <div className="flex justify-between items-center text-[9px] bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40 text-rose-300">
                      <span>🫁 MEDICAL O2 RESERVE:</span>
                      <span className="font-bold">{unit.oxygenLevelPercent}% PSI</span>
                    </div>
                  ) : null}

                  {/* Driver / Crew Officer */}
                  <div className="text-[9px] text-slate-400 border-t border-slate-900 pt-1.5 flex justify-between">
                    <span className="text-slate-500">Command Lead:</span>
                    <span className="text-slate-200 font-semibold">{unit.driverName || 'Officer On Duty'}</span>
                  </div>

                  {/* Equipment */}
                  <div className="text-[9px] text-slate-400">
                    <span className="text-slate-500">Gear:</span>{' '}
                    <span className="text-slate-300">{unit.equipment.slice(0, 2).join(', ')}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex gap-1.5">
                    {targetIncident && (
                      <button
                        onClick={() => {
                          dispatchUnit(unit.id, targetIncident.id);
                        }}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-mono font-bold transition shadow"
                      >
                        Dispatch to {targetIncident.id}
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 5. POINTING ROAD CLOSURES */}
        {showRoadblocks && roadBlocks.map(rb => (
          <Marker
            key={rb.id}
            position={[rb.coords.lat, rb.coords.lng]}
            icon={createRoadBlockIcon(rb)}
          >
            <Tooltip direction="top" offset={[0, -18]}>
              <div className="font-mono text-xs text-slate-900 font-bold">
                🚫 {rb.streetName} (CLOSED)
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans space-y-1.5 min-w-[200px]">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  {rb.severity}
                </span>
                <h4 className="text-sm font-bold text-white">{rb.streetName}</h4>
                <p className="text-xs text-rose-300">Reason: {rb.reason.replace('_', ' ')}</p>
                <p className="text-xs text-slate-400 pt-1">{rb.detourAdvice}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 6. POINTING RELIEF SHELTERS */}
        {showShelters && shelters.map(s => (
          <Marker
            key={s.id}
            position={[s.location.lat, s.location.lng]}
            icon={createShelterIcon(s)}
          >
            <Tooltip direction="top" offset={[0, -18]}>
              <div className="font-mono text-xs text-slate-900 font-bold">
                ⛺ {s.name} ({s.capacity - s.occupancy} open)
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 font-sans space-y-1.5 min-w-[200px]">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  RELIEF SHELTER
                </span>
                <h4 className="text-sm font-bold text-white">{s.name}</h4>
                <div className="text-xs font-mono text-slate-300">
                  Available: {s.capacity - s.occupancy} of {s.capacity} beds
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Food: {s.foodSupplyPercent}% • Water: {s.waterSupplyPercent}%
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Bottom Map Legend Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-400 z-[700]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-200">🏥 Hospitals (ICU Pointers)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-indigo-500" />
            <span className="text-slate-200">🏢 Key Buildings & Tech Parks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-200">⚠️ Incidents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-200">🚒 Responders</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-red-600" />
            <span className="text-slate-200">🚫 Road Blocks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-200">⛺ Shelters</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 hidden sm:block">
          Click any Hospital or Building marker for real-time occupancy & capacity
        </div>
      </div>
    </div>
  );
};
