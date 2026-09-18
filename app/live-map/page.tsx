'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  Radio,
  Truck,
  Flame,
  Activity,
  Layers,
  Sparkles,
  PhoneCall,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Play,
  RotateCcw,
  Bot
} from 'lucide-react';
import {
  INITIAL_INCIDENTS,
  INITIAL_VEHICLES,
  CITIES_DATA,
  LiveIncident,
  LiveVehicle,
  CityPreset
} from '@/data/liveMapData';
import { getRoadRoute, RouteResult } from '@/lib/openRouteService';
import { IncidentDetailPanel } from '@/components/maplibre/IncidentDetailPanel';
import { VehicleDetailPanel } from '@/components/maplibre/VehicleDetailPanel';
import { MapLayerControl, MapLayerState } from '@/components/maplibre/MapLayerControl';
import { CitySelector } from '@/components/maplibre/CitySelector';
import { SihDemoController, SIH_DEMO_STEPS } from '@/components/maplibre/SihDemoController';
import Link from 'next/link';

// Dynamically import WebGL MapLibre component to avoid SSR window errors
const LiveResponseMap = dynamic(
  () =>
    import('@/components/maplibre/LiveResponseMap').then(
      (mod) => mod.LiveResponseMap
    ),
  { ssr: false, loading: () => <MapLoadingSkeleton /> }
);

function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[600px] rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <div className="text-sm font-mono font-bold text-slate-300">
        INITIALIZING OPENFREEMAP GL WEBGL ENGINE...
      </div>
      <div className="text-xs text-slate-400 font-mono">
        Loading OpenStreetMap vector styles &amp; incident layers
      </div>
    </div>
  );
}

export default function LiveMapPage() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES_DATA[0]);
  const [incidents, setIncidents] = useState<LiveIncident[]>(INITIAL_INCIDENTS);
  const [vehicles, setVehicles] = useState<LiveVehicle[]>(INITIAL_VEHICLES);
  const [selectedIncident, setSelectedIncident] = useState<LiveIncident | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Layer toggles
  const [layers, setLayers] = useState<MapLayerState>({
    incidents: true,
    vehicles: true,
    fireStations: true,
    policeStations: true,
    hospitals: true,
    reliefCenters: true,
    hazardZones: true,
    evacuationRoutes: true,
    heatmap: false,
    vehicleRoutes: true
  });
  const [layerControlOpen, setLayerControlOpen] = useState<boolean>(false);

  // Active road route & track history
  const [activeRouteCoords, setActiveRouteCoords] = useState<[number, number][] | null>(null);
  const [trackHistoryCoords, setTrackHistoryCoords] = useState<[number, number][] | null>(null);
  const [isShowingTrack, setIsShowingTrack] = useState<boolean>(false);

  // 60-Second SIH Demo Sequence State
  const [sihDemoStep, setSihDemoStep] = useState<number>(0);
  const [sihDemoRunning, setSihDemoRunning] = useState<boolean>(false);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter incidents for active city
  const cityIncidents = incidents.filter(
    (i) => i.city.toLowerCase() === selectedCity.name.toLowerCase()
  );

  // Filter vehicles for active city
  const cityVehicles = vehicles.filter(
    (v) => v.city.toLowerCase() === selectedCity.name.toLowerCase()
  );

  const handleToggleLayer = (key: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dispatch Action: Calculate Road Route & Smoothly Animate Vehicle
  const handleDispatchVehicle = async (vehicleCode: string, incidentId: string) => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    const targetVehicle = vehicles.find((v) => v.vehicle_code === vehicleCode);
    if (!targetIncident || !targetVehicle) return;

    // Update status to RESPONDING
    setVehicles((prev) =>
      prev.map((v) =>
        v.vehicle_code === vehicleCode
          ? { ...v, status: 'RESPONDING', assigned_incident_id: incidentId }
          : v
      )
    );

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'RESPONDING',
              assignedVehicleCodes: Array.from(new Set([...i.assignedVehicleCodes, vehicleCode]))
            }
          : i
      )
    );

    // 1. Fetch street road route from OpenRouteService
    const startLngLat: [number, number] = [targetVehicle.longitude, targetVehicle.latitude];
    const endLngLat: [number, number] = [targetIncident.longitude, targetIncident.latitude];
    const routeRes: RouteResult = await getRoadRoute(startLngLat, endLngLat);

    setActiveRouteCoords(routeRes.coordinates);

    // 2. Smoothly animate vehicle along route waypoints (no teleportation)
    animateVehicleAlongRoute(vehicleCode, routeRes.coordinates, incidentId);
  };

  const animateVehicleAlongRoute = (
    vehicleCode: string,
    waypoints: [number, number][],
    incidentId: string
  ) => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    let currentIndex = 0;
    const totalPoints = waypoints.length;

    animationIntervalRef.current = setInterval(() => {
      if (currentIndex >= totalPoints) {
        if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

        // Reached scene!
        setVehicles((prev) =>
          prev.map((v) =>
            v.vehicle_code === vehicleCode
              ? { ...v, status: 'ON_SCENE', speed: 0, etaString: '00:00' }
              : v
          )
        );

        setIncidents((prev) =>
          prev.map((i) =>
            i.id === incidentId ? { ...i, status: 'ON_SCENE' } : i
          )
        );
        return;
      }

      const [lng, lat] = waypoints[currentIndex];
      const nextPoint = waypoints[currentIndex + 1] || waypoints[currentIndex];
      const heading = calculateHeading([lng, lat], nextPoint);

      setVehicles((prev) =>
        prev.map((v) =>
          v.vehicle_code === vehicleCode
            ? {
                ...v,
                latitude: lat,
                longitude: lng,
                heading,
                speed: 42,
                last_updated: 'Just now'
              }
            : v
        )
      );

      currentIndex++;
    }, 1200);
  };

  // Calculate cardinal heading
  const calculateHeading = (from: [number, number], to: [number, number]) => {
    const dLon = to[0] - from[0];
    const dLat = to[1] - from[1];
    let angle = (Math.atan2(dLon, dLat) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  };

  // Follow vehicle camera focus
  const handleFollowVehicle = (vehicle: LiveVehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedIncident(null);
  };

  // View entire route bounds
  const handleViewRoute = async (vehicle: LiveVehicle) => {
    if (!vehicle.assigned_incident_id) return;
    const inc = incidents.find((i) => i.id === vehicle.assigned_incident_id);
    if (!inc) return;

    const route = await getRoadRoute(
      [vehicle.longitude, vehicle.latitude],
      [inc.longitude, inc.latitude]
    );
    setActiveRouteCoords(route.coordinates);
  };

  // Toggle breadcrumbs trail
  const handleToggleTrackHistory = (vehicle: LiveVehicle) => {
    if (isShowingTrack) {
      setIsShowingTrack(false);
      setTrackHistoryCoords(null);
    } else {
      setIsShowingTrack(true);
      const coords = vehicle.trackHistory || [
        [vehicle.longitude - 0.005, vehicle.latitude - 0.005],
        [vehicle.longitude - 0.002, vehicle.latitude - 0.003],
        [vehicle.longitude, vehicle.latitude]
      ];
      setTrackHistoryCoords(coords);
    }
  };

  // Run 60-Second Automated SIH Demo Flow
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sihDemoRunning) {
      timer = setInterval(() => {
        setSihDemoStep((prev) => {
          const next = prev + 1;
          if (next >= SIH_DEMO_STEPS.length) {
            setSihDemoRunning(false);
            return prev;
          }
          executeDemoStep(next);
          return next;
        });
      }, 7500);
    }
    return () => clearInterval(timer);
  }, [sihDemoRunning]);

  const executeDemoStep = (stepIdx: number) => {
    const fireIncident = incidents.find((i) => i.id === 'RQ-1042');
    const fireTender = vehicles.find((v) => v.vehicle_code === 'F-034');

    switch (stepIdx) {
      case 1: // Incident Mapped
        if (fireIncident) setSelectedIncident(fireIncident);
        break;
      case 2: // EOC Operator Inspects
        if (fireIncident) setSelectedIncident(fireIncident);
        break;
      case 3: // AI Triage
        setIncidents((prev) =>
          prev.map((i) => (i.id === 'RQ-1042' ? { ...i, severity: 'CRITICAL' } : i))
        );
        break;
      case 4: // Nearest Unit Found F-034
        if (fireIncident) setSelectedIncident(fireIncident);
        break;
      case 5: // Dispatch Triggered
        handleDispatchVehicle('F-034', 'RQ-1042');
        break;
      case 6: // Smooth Road Animation
        if (fireTender) setSelectedVehicle(fireTender);
        break;
      case 7: // On Scene & Resolved
        setIncidents((prev) =>
          prev.map((i) => (i.id === 'RQ-1042' ? { ...i, status: 'RESOLVED' } : i))
        );
        setVehicles((prev) =>
          prev.map((v) => (v.vehicle_code === 'F-034' ? { ...v, status: 'ON_SCENE' } : v))
        );
        break;
    }
  };

  const handleResetDemo = () => {
    setSihDemoRunning(false);
    setSihDemoStep(0);
    setIncidents(INITIAL_INCIDENTS);
    setVehicles(INITIAL_VEHICLES);
    setActiveRouteCoords(null);
    setTrackHistoryCoords(null);
    setSelectedIncident(null);
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top EOC Command Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3.5 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <Link
                href="/"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition"
                title="Return to ResQAI Operations Dashboard"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>EOC Home</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                RESQAI LIVE RESPONSE MAP
              </h1>
              {/* Mode Badge */}
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase border transition ${
                  isDemoMode
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {isDemoMode ? '● DEMO SIMULATION' : '● LIVE DATA'}
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ONE MAP. EVERY INCIDENT. EVERY RESPONDER. — OpenFreeMap &amp; OpenRouteService
            </p>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <CitySelector
              selectedCity={selectedCity}
              onSelectCity={(city) => {
                setSelectedCity(city);
                setSelectedIncident(null);
                setSelectedVehicle(null);
              }}
            />

            <MapLayerControl
              layers={layers}
              onToggleLayer={handleToggleLayer}
              isOpen={layerControlOpen}
              onToggleOpen={() => setLayerControlOpen(!layerControlOpen)}
            />

            <Link
              href="/report"
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>CITIZEN REPORT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Map Workspace Layout */}
      <div className="flex-1 relative flex overflow-hidden p-3 sm:p-4 gap-4 h-[calc(100vh-5.5rem)] min-h-[600px]">
        {/* Left Floating Incident Triage Drawer */}
        <div className="hidden lg:flex flex-col w-80 bg-slate-950/90 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl z-10 space-y-3 shrink-0 max-h-[calc(100vh-8.5rem)] overflow-y-auto scrollbar-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ACTIVE INCIDENTS ({cityIncidents.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedCity.name}
            </span>
          </div>

          <div className="space-y-2">
            {cityIncidents.map((inc) => {
              const isSel = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setSelectedVehicle(null);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    isSel
                      ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/20 shadow-lg'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-black text-white">
                      #{inc.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.2 rounded font-bold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                    {inc.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{inc.type}</span>
                    <span>{inc.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* City Vehicle Fleet summary */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">
              FLEET STATUS ({cityVehicles.length} UNITS)
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              {cityVehicles.slice(0, 6).map((veh) => (
                <button
                  key={veh.id}
                  onClick={() => {
                    setSelectedVehicle(veh);
                    setSelectedIncident(null);
                  }}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-left truncate text-slate-300 transition"
                >
                  <span className="font-bold text-white">{veh.vehicle_code}</span> • {veh.status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Central WebGL Map Component */}
        <div className="flex-1 relative h-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <LiveResponseMap
            selectedCity={selectedCity}
            incidents={cityIncidents}
            vehicles={cityVehicles}
            selectedIncident={selectedIncident}
            selectedVehicle={selectedVehicle}
            activeRouteCoordinates={activeRouteCoords}
            trackCoordinates={trackHistoryCoords}
            layers={layers}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setSelectedVehicle(null);
            }}
            onSelectVehicle={(veh) => {
              setSelectedVehicle(veh);
              setSelectedIncident(null);
            }}
          />

          {/* Floating 60-Second SIH Demo Controller (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-20">
            <SihDemoController
              currentStepIndex={sihDemoStep}
              isRunning={sihDemoRunning}
              onStartDemo={() => setSihDemoRunning(true)}
              onPauseDemo={() => setSihDemoRunning(false)}
              onResetDemo={handleResetDemo}
              onStepClick={(idx) => {
                setSihDemoStep(idx);
                executeDemoStep(idx);
              }}
            />
          </div>
        </div>

        {/* Right Floating Details Panel (Selected Incident or Vehicle) */}
        {(selectedIncident || selectedVehicle) && (
          <div className="w-full sm:w-96 shrink-0 z-20 animate-fadeIn">
            {selectedIncident && (
              <IncidentDetailPanel
                incident={selectedIncident}
                onClose={() => setSelectedIncident(null)}
                availableVehicles={vehicles}
                onDispatchVehicle={handleDispatchVehicle}
                onFocusVehicle={(code) => {
                  const veh = vehicles.find((v) => v.vehicle_code === code);
                  if (veh) setSelectedVehicle(veh);
                }}
              />
            )}

            {selectedVehicle && !selectedIncident && (
              <VehicleDetailPanel
                vehicle={selectedVehicle}
                onClose={() => setSelectedVehicle(null)}
                assignedIncident={
                  selectedVehicle.assigned_incident_id
                    ? incidents.find((i) => i.id === selectedVehicle.assigned_incident_id)
                    : undefined
                }
                onFollowVehicle={handleFollowVehicle}
                onViewRoute={handleViewRoute}
                onToggleTrackHistory={handleToggleTrackHistory}
                isShowingTrack={isShowingTrack}
                onOpenIncident={(incId) => {
                  const inc = incidents.find((i) => i.id === incId);
                  if (inc) setSelectedIncident(inc);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
