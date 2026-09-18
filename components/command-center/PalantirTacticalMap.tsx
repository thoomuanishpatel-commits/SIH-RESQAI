'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  Polygon,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Incident,
  EmergencyUnit,
  Hospital,
  ReliefShelter,
  RoadBlock,
  VehicleCategory
} from '@/types';

// Helper component to pan smoothly when selecting an entity
const MapPanner: React.FC<{ targetCoords: [number, number] | null }> = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, Math.max(map.getZoom(), 14), { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
};

// Tactical Icon for Incidents
const createTacticalIncidentIcon = (inc: Incident, isSelected: boolean) => {
  const isCritical = inc.severity === 'CRITICAL';
  const color = isCritical ? '#ef4444' : '#f59e0b';

  return L.divIcon({
    className: 'custom-palantir-incident',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none">
        <div class="absolute -inset-3 rounded-full opacity-60 animate-ping" style="background-color: ${color}"></div>
        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform hover:scale-125" style="background-color: ${isCritical ? '#450a0a' : '#451a03'}; border-color: ${color}; box-shadow: 0 0 14px ${color}80">
          <span class="text-xs font-black text-white">!</span>
        </div>
        <div class="absolute -top-3.5 bg-black/90 px-1 py-0.2 rounded text-[8px] font-mono font-bold whitespace-nowrap border" style="border-color: ${color}60; color: ${color}">
          ${inc.id}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

// High-Tech Specialized Vehicle Icon Creator
const createTacticalUnitIcon = (unit: EmergencyUnit) => {
  const isEnRoute = unit.status === 'EN_ROUTE';
  const isOnScene = unit.status === 'ON_SCENE';
  const cat = unit.vehicleCategory || (unit.type === 'EMS' ? 'AMBULANCE_ALS' : unit.type === 'FIRE' ? 'FIRE_ENGINE' : unit.type === 'POLICE' ? 'POLICE_PATROL' : 'RESCUE_BOAT');

  let borderColor = '#06b6d4';
  let bgColor = '#083344';
  let badgeColor = '#22d3ee';
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
    className: 'custom-palantir-unit',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none group">
        ${pingEffect}
        <div class="w-8 h-8 rounded-xl border-2 flex items-center justify-center shadow-2xl transform hover:scale-125 transition-transform" style="background-color: ${bgColor}; border-color: ${borderColor}; box-shadow: 0 0 14px ${borderColor}60">
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

// Tactical Icon for Hospitals
const createTacticalHospitalIcon = (hosp: Hospital) => {
  const isFull = hosp.status === 'AT_CAPACITY';
  const color = isFull ? '#ef4444' : '#10b981';

  return L.divIcon({
    className: 'custom-palantir-hospital',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none">
        <div class="w-7 h-7 rounded-md bg-zinc-950 border border-emerald-500/60 flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
          <span class="text-xs font-bold text-emerald-400">H</span>
        </div>
        <div class="absolute -bottom-3 bg-black/90 px-1 rounded text-[7px] font-mono border border-emerald-500/30 text-emerald-300 whitespace-nowrap">
          ${hosp.icuAvailable} ICU
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Tactical Icon for Shelters
const createTacticalShelterIcon = (shelter: ReliefShelter) => {
  return L.divIcon({
    className: 'custom-palantir-shelter',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer select-none">
        <div class="w-7 h-7 rounded-md bg-zinc-950 border border-blue-500/60 flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
          <span class="text-xs text-blue-400">⛺</span>
        </div>
        <div class="absolute -bottom-3 bg-black/90 px-1 rounded text-[7px] font-mono border border-blue-500/30 text-blue-300 whitespace-nowrap">
          ${shelter.capacity - shelter.occupancy} BEDS
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

interface PalantirTacticalMapProps {
  incidents: Incident[];
  units: EmergencyUnit[];
  hospitals: Hospital[];
  shelters: ReliefShelter[];
  roadBlocks: RoadBlock[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  forecastHours: number;
  theme: 'dark' | 'light';
  onToggleRoadBlock: (id: string) => void;
}

export const PalantirTacticalMap: React.FC<PalantirTacticalMapProps> = ({
  incidents,
  units,
  hospitals,
  shelters,
  roadBlocks,
  selectedIncident,
  onSelectIncident,
  forecastHours,
  theme,
  onToggleRoadBlock
}) => {
  // Center of Hyderabad Metro Disaster Grid
  const centerCoords: [number, number] = [17.4350, 78.4150];

  // Vehicle Category Filter State
  const [vehicleFilter, setVehicleFilter] = useState<'ALL' | 'EMS' | 'FIRE' | 'POLICE' | 'RESCUE' | 'HAZMAT'>('ALL');
  const [patrolActive, setPatrolActive] = useState<boolean>(true);
  const [animatedUnits, setAnimatedUnits] = useState<EmergencyUnit[]>(units);

  // Synchronize and gently animate live patrol vehicles when patrolActive is true
  useEffect(() => {
    setAnimatedUnits(units);
  }, [units]);

  useEffect(() => {
    if (!patrolActive) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      setAnimatedUnits(prev =>
        prev.map(u => {
          if (u.status === 'EN_ROUTE' || (patrolActive && u.speedKmh && u.speedKmh > 0)) {
            // Subtle real-time drift along heading
            const driftLat = Math.sin(step + u.id.length) * 0.00015;
            const driftLng = Math.cos(step + u.id.length) * 0.00015;
            return {
              ...u,
              location: {
                ...u.location,
                lat: u.location.lat + driftLat,
                lng: u.location.lng + driftLng
              }
            };
          }
          return u;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [patrolActive]);

  // Filtered unit list
  const filteredUnits = useMemo(() => {
    if (vehicleFilter === 'ALL') return animatedUnits;
    if (vehicleFilter === 'EMS') return animatedUnits.filter(u => u.type === 'EMS');
    if (vehicleFilter === 'FIRE') return animatedUnits.filter(u => u.type === 'FIRE');
    if (vehicleFilter === 'POLICE') return animatedUnits.filter(u => u.type === 'POLICE');
    if (vehicleFilter === 'RESCUE') return animatedUnits.filter(u => u.type === 'RESCUE');
    if (vehicleFilter === 'HAZMAT') return animatedUnits.filter(u => u.type === 'HAZMAT' || u.type === 'COMMAND_POST');
    return animatedUnits;
  }, [animatedUnits, vehicleFilter]);

  // Vehicle counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: animatedUnits.length,
      ems: animatedUnits.filter(u => u.type === 'EMS').length,
      fire: animatedUnits.filter(u => u.type === 'FIRE').length,
      police: animatedUnits.filter(u => u.type === 'POLICE').length,
      rescue: animatedUnits.filter(u => u.type === 'RESCUE').length,
      hazmat: animatedUnits.filter(u => u.type === 'HAZMAT' || u.type === 'COMMAND_POST').length
    };
  }, [animatedUnits]);

  // Dynamic Musi River flood projection polygon that expands dynamically with forecastHours slider
  const dynamicFloodZone = useMemo(() => {
    const expansionOffset = (forecastHours - 1) * 0.0006;
    return [
      [17.3750 - expansionOffset, 78.4350 - expansionOffset],
      [17.3780 + expansionOffset, 78.4600],
      [17.3820 + expansionOffset, 78.4850 + expansionOffset],
      [17.3770 + expansionOffset, 78.5100 + expansionOffset],
      [17.3690 - expansionOffset, 78.5080],
      [17.3650 - expansionOffset, 78.4720],
      [17.3680 - expansionOffset, 78.4420 - expansionOffset]
    ] as [number, number][];
  }, [forecastHours]);

  // Active emergency dispatch trajectory
  const activeUnit = animatedUnits.find(u => u.status === 'EN_ROUTE') || animatedUnits[0];
  const targetIncident = selectedIncident || incidents[0];
  const isAnyBlocked = roadBlocks.some(rb => rb.severity === 'BLOCKED');

  const dynamicRoute: [number, number][] = useMemo(() => {
    if (!activeUnit || !targetIncident) return [];
    const start: [number, number] = [activeUnit.location.lat, activeUnit.location.lng];
    const end: [number, number] = [targetIncident.location.lat, targetIncident.location.lng];

    if (isAnyBlocked) {
      const mid1: [number, number] = [17.4330, 78.3850];
      const mid2: [number, number] = [17.4390, 78.3870];
      return [start, mid1, mid2, end];
    }
    return [start, end];
  }, [activeUnit, targetIncident, isAnyBlocked]);

  const tileUrl = theme === 'light'
    ? 'https://tiles.openfreemap.org/styles/positron'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';

  return (
    <div className="relative w-full h-full bg-[#05070c] overflow-hidden select-none flex flex-col">
      
      {/* TACTICAL VEHICLE FLEET CONTROLLER BAR */}
      <div className="absolute top-3 left-3 right-3 z-[800] pointer-events-none flex flex-wrap items-center justify-between gap-2">
        {/* Category Filters */}
        <div className="pointer-events-auto bg-zinc-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-1 shadow-2xl flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'ALL', label: 'All Fleet', emoji: '🚨', count: counts.all },
            { id: 'EMS', label: 'Ambulances', emoji: '🚑', count: counts.ems },
            { id: 'FIRE', label: 'Fire Tenders', emoji: '🚒', count: counts.fire },
            { id: 'POLICE', label: 'Police', emoji: '🚓', count: counts.police },
            { id: 'RESCUE', label: 'Rescue & Boats', emoji: '🚤', count: counts.rescue },
            { id: 'HAZMAT', label: 'Hazmat & EOC', emoji: '☣️', count: counts.hazmat }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setVehicleFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                vehicleFilter === tab.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${vehicleFilter === tab.id ? 'bg-black/30 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Patrol Simulation Toggle */}
        <div className="pointer-events-auto bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-xl px-3 py-1 shadow-xl flex items-center gap-2">
          <button
            onClick={() => setPatrolActive(!patrolActive)}
            className={`flex items-center gap-1.5 text-[10px] font-mono font-bold transition ${
              patrolActive ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${patrolActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            <span>{patrolActive ? 'LIVE PATROL GRID ON' : 'PATROL DRIFT OFF'}</span>
          </button>
        </div>
      </div>

      <MapContainer
        center={centerCoords}
        zoom={13}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: theme === 'light' ? '#f1f5f9' : '#030712' }}
      >
        <MapPanner targetCoords={selectedIncident ? [selectedIncident.location.lat, selectedIncident.location.lng] : null} />

        <TileLayer
          url={tileUrl}
          subdomains="abc"
          maxNativeZoom={19}
          maxZoom={20}
          attribution={tileAttribution}
        />

        {/* DYNAMIC MUSI RIVER FLOOD PREDICTION POLYGON */}
        <Polygon
          positions={dynamicFloodZone}
          pathOptions={{
            color: '#06b6d4',
            fillColor: '#0284c7',
            fillOpacity: 0.25 + Math.min(forecastHours * 0.015, 0.35),
            weight: 2,
            dashArray: '4, 4'
          }}
        >
          <Tooltip direction="top" opacity={0.9}>
            <div className="font-mono text-xs bg-zinc-950 text-cyan-400 p-1 border border-cyan-500/40">
              🌊 Musi Basin Inundation (+{forecastHours}h Forecast)
            </div>
          </Tooltip>
        </Polygon>

        {/* DISPATCH ROUTING VECTOR */}
        {dynamicRoute.length > 0 && (
          <Polyline
            positions={dynamicRoute}
            pathOptions={{
              color: isAnyBlocked ? '#f59e0b' : '#06b6d4',
              weight: 4,
              dashArray: '6, 6',
              opacity: 0.85
            }}
          />
        )}

        {/* INCIDENTS */}
        {incidents.map(inc => (
          <Marker
            key={inc.id}
            position={[inc.location.lat, inc.location.lng]}
            icon={createTacticalIncidentIcon(inc, selectedIncident?.id === inc.id)}
            eventHandlers={{
              click: () => onSelectIncident(inc)
            }}
          >
            <Tooltip direction="top" offset={[0, -20]}>
              <div className="font-mono text-xs bg-zinc-950 text-rose-300 p-1 rounded border border-rose-500/40">
                ⚠️ {inc.id}: {inc.title} ({inc.severity})
              </div>
            </Tooltip>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 bg-zinc-950 text-white font-mono space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                  <span className="text-xs font-bold text-rose-400">{inc.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {inc.severity}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{inc.title}</h4>
                <p className="text-[11px] text-zinc-400">{inc.location.address}</p>
                <div className="text-[10px] text-amber-400">
                  Casualties: {inc.estimatedCasualties} • Status: {inc.status}
                </div>
                <button
                  onClick={() => onSelectIncident(inc)}
                  className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-bold transition mt-1"
                >
                  Select for Tactical Dispatch
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* SPECIALIZED FLEET RESPONDER VEHICLES */}
        {filteredUnits.map(unit => {
          const isAmbulance = unit.type === 'EMS';
          const isFire = unit.type === 'FIRE';
          const isPolice = unit.type === 'POLICE';
          const isRescue = unit.type === 'RESCUE';
          const isHazmat = unit.type === 'HAZMAT';
          const iconEmoji = isAmbulance ? '🚑' : isFire ? '🚒' : isPolice ? '🚓' : isRescue ? '🚤' : isHazmat ? '☣️' : '📡';
          
          return (
            <Marker
              key={unit.id}
              position={[unit.location.lat, unit.location.lng]}
              icon={createTacticalUnitIcon(unit)}
            >
              <Tooltip direction="top" offset={[0, -20]}>
                <div className="font-mono text-xs bg-zinc-950 text-cyan-300 p-1 rounded border border-cyan-500/40 flex items-center gap-1.5">
                  <span>{iconEmoji}</span>
                  <span>{unit.callsign}</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-emerald-400">{unit.status}</span>
                </div>
              </Tooltip>
              <Popup className="custom-leaflet-popup">
                <div className="p-3 bg-zinc-950 text-white font-mono space-y-2 min-w-[260px] rounded-lg border border-zinc-800 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{iconEmoji}</span>
                      <span className="text-xs font-bold text-white">{unit.callsign}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
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
                    <div className="text-zinc-500 text-[8px] uppercase">VEHICLE CLASS & MODEL</div>
                    <div className="text-zinc-200 font-bold">{unit.modelName}</div>
                    <div className="text-cyan-400 text-[9px] font-mono">REG: {unit.plateNumber} • {unit.department}</div>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-1 bg-zinc-900/90 p-2 rounded border border-zinc-800 text-[9px] text-center font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[8px]">SPEED</span>
                      <span className={`font-bold ${unit.speedKmh ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {unit.speedKmh || 0} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[8px]">CREW</span>
                      <span className="font-bold text-cyan-300">{unit.crewCount} Pers</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[8px]">FUEL</span>
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
                  <div className="text-[9px] text-zinc-400 border-t border-zinc-900 pt-1.5">
                    <span className="text-zinc-500">Command Lead:</span> <span className="text-zinc-300 font-semibold">{unit.driverName || 'Officer On Duty'}</span>
                  </div>

                  {/* Equipment */}
                  <div className="text-[9px] text-zinc-400">
                    <span className="text-zinc-500">On-board Gear:</span>{' '}
                    <span className="text-zinc-300">{unit.equipment.slice(0, 2).join(', ')}</span>
                  </div>

                  {/* Tactical Action */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        if (targetIncident) {
                          alert(`Tactical Dispatch: Unit ${unit.callsign} reassigned to Incident ${targetIncident.id}`);
                        }
                      }}
                      className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-[10px] font-mono font-bold transition shadow"
                    >
                      Dispatch To Active Incident ({targetIncident?.id || 'RQ-204891'})
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* HOSPITALS */}
        {hospitals.map(hosp => (
          <Marker
            key={hosp.id}
            position={[hosp.location.lat, hosp.location.lng]}
            icon={createTacticalHospitalIcon(hosp)}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              <div className="font-mono text-xs bg-zinc-950 text-emerald-300 p-1 rounded border border-emerald-500/40">
                🏥 {hosp.name} • {hosp.icuAvailable} ICU Beds
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* RELIEF SHELTERS */}
        {shelters.map(shelter => (
          <Marker
            key={shelter.id}
            position={[shelter.location.lat, shelter.location.lng]}
            icon={createTacticalShelterIcon(shelter)}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              <div className="font-mono text-xs bg-zinc-950 text-blue-300 p-1 rounded border border-blue-500/40">
                ⛺ {shelter.name} ({shelter.capacity - shelter.occupancy} beds open)
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* ROAD CLOSURES */}
        {roadBlocks.map(rb => {
          const isBlocked = rb.severity === 'BLOCKED';
          const roadIcon = L.divIcon({
            className: 'custom-palantir-roadblock',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer select-none">
                <div class="w-6 h-6 rounded bg-black border ${isBlocked ? 'border-rose-500' : 'border-amber-500'} flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
                  <span class="text-xs">${isBlocked ? '🚫' : '⚠️'}</span>
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
          });

          return (
            <Marker
              key={rb.id}
              position={[rb.coords.lat, rb.coords.lng]}
              icon={roadIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 bg-zinc-950 text-white font-mono space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                    <span className="text-xs font-bold text-rose-400">{rb.id}</span>
                    <span className="text-[10px] px-1 rounded bg-zinc-800 text-zinc-300">
                      {rb.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{rb.streetName}</h4>
                  <p className="text-[10px] text-zinc-400">{rb.reason} — {rb.detourAdvice}</p>
                  <button
                    onClick={() => onToggleRoadBlock(rb.id)}
                    className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 rounded text-[10px] font-mono font-bold transition mt-1"
                  >
                    Toggle Road Clearance
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
