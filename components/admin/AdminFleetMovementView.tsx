'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Flame,
  Radio,
  Activity,
  Shield,
  Navigation,
  Compass,
  Battery,
  Fuel,
  Siren,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { EmergencyUnit, ResponderStatus } from '@/types';
import Link from 'next/link';

export const AdminFleetMovementView: React.FC = () => {
  const {
    units,
    incidents,
    updateUnitStatus,
    dispatchUnit,
    autoDispatchedUnit,
    setActiveView
  } = useEmergency();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<EmergencyUnit | null>(units[0] || null);

  const filteredUnits = selectedType === 'ALL'
    ? units
    : units.filter(u => u.type === selectedType);

  const enRouteUnits = units.filter(u => u.status === 'EN_ROUTE');
  const onSceneUnits = units.filter(u => u.status === 'ON_SCENE');
  const availableUnits = units.filter(u => u.status === 'AVAILABLE');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                REAL-TIME VEHICLE TELEMETRY ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">EOC FLEET GRID</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wide">
              FLEET &amp; RESPONDER VEHICLES MOVEMENT
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Continuous GPS tracking, heading telemetry, road velocity, and automated dispatch routing for all ambulances, fire engines, police units, and relief squads.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/live-map"
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/50 transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Open 3D Tactical Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setActiveView('COMMAND')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold transition"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Command Center</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Fleet Active</span>
            <span className="text-2xl font-black font-mono text-white">{units.length}</span>
            <span className="text-[10px] text-cyan-400 block mt-0.5">100% telemetry synced</span>
          </div>

          <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              En Route (In Motion)
            </span>
            <span className="text-2xl font-black font-mono text-blue-300">{enRouteUnits.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Automated highway routing</span>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block">On Scene Operating</span>
            <span className="text-2xl font-black font-mono text-emerald-300">{onSceneUnits.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Triage &amp; rescue engaged</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Available on Standby</span>
            <span className="text-2xl font-black font-mono text-slate-200">{availableUnits.length}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Ready for instant dispatch</span>
          </div>
        </div>
      </div>

      {/* Automated Dispatch Active Banner (if a unit was just auto-dispatched to citizen incident) */}
      {autoDispatchedUnit && autoDispatchedUnit.status === 'EN_ROUTE' && (
        <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-blue-950/90 border-2 border-blue-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-300 shrink-0">
              <Siren className="w-6 h-6 text-blue-400 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase">
                  AUTOMATED DISPATCH ENGAGED
                </span>
                <span className="text-xs font-mono text-blue-300 font-bold">
                  {autoDispatchedUnit.callsign} ({autoDispatchedUnit.department})
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Responding to Citizen Report #{autoDispatchedUnit.assignedIncidentId} • ETA: <strong className="text-emerald-400 font-mono">{autoDispatchedUnit.etaMinutes || 3} mins</strong> • Speed: <span className="font-mono text-cyan-300">54 km/h</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setSelectedUnit(autoDispatchedUnit)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 shadow"
            >
              <span>Track Unit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: Fleet Filter & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Vehicle Cards List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            {['ALL', 'EMS', 'FIRE', 'POLICE', 'RESCUE'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {type === 'ALL' ? 'All Units' : type === 'EMS' ? 'Ambulance (EMS)' : type}
              </button>
            ))}
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredUnits.map((veh) => {
              const isSelected = selectedUnit?.id === veh.id;
              const isMoving = veh.status === 'EN_ROUTE';

              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedUnit(veh)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border font-bold ${
                        veh.type === 'EMS'
                          ? 'bg-red-950/60 border-red-500/40 text-red-300'
                          : veh.type === 'FIRE'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : veh.type === 'POLICE'
                          ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                          : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      }`}>
                        {veh.type === 'EMS' && <Activity className="w-4 h-4" />}
                        {veh.type === 'FIRE' && <Flame className="w-4 h-4" />}
                        {veh.type === 'POLICE' && <Shield className="w-4 h-4" />}
                        {veh.type === 'RESCUE' && <Truck className="w-4 h-4" />}
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-white tracking-wide">
                          {veh.callsign}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {veh.department} • {veh.type}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                      veh.status === 'EN_ROUTE'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse'
                        : veh.status === 'ON_SCENE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {veh.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Real-time Movement Telemetry */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{veh.location.lat.toFixed(4)}°, {veh.location.lng.toFixed(4)}°</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{veh.etaMinutes ? `ETA ${veh.etaMinutes}m` : 'On Standby'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Battery className="w-3 h-3 text-yellow-400 shrink-0" />
                      <span>{veh.crewCount} Crew Active</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>Speed: {isMoving ? '48 km/h' : '0 km/h'}</span>
                    </div>
                  </div>

                  {/* Assigned incident badge */}
                  {veh.assignedIncidentId && (
                    <div className="text-[10px] font-mono text-amber-300 flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span>ASSIGNED TO: #{veh.assignedIncidentId}</span>
                      <span className="text-emerald-400 font-bold">ACTIVE SIREN</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Unit Command & Live Control Panel */}
        <div className="space-y-4">
          {selectedUnit ? (
            <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                    UNIT COMMAND &amp; OVERRIDE
                  </span>
                  <h3 className="text-base font-black font-mono text-white">
                    {selectedUnit.callsign}
                  </h3>
                </div>

                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {selectedUnit.department}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Operational State</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      selectedUnit.status === 'EN_ROUTE' ? 'bg-blue-400 animate-ping' : 'bg-emerald-400'
                    }`} />
                    {selectedUnit.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-cyan-300">
                    {selectedUnit.etaMinutes ? `ETA: ${selectedUnit.etaMinutes} mins` : 'Available'}
                  </span>
                </div>
              </div>

              {/* Live Coordinates Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Live GPS Coordinates</span>
                <div className="p-3 bg-slate-950 font-mono text-xs text-emerald-300 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span>{selectedUnit.location.lat.toFixed(6)}° N</span>
                  <span>{selectedUnit.location.lng.toFixed(6)}° E</span>
                </div>
              </div>

              {/* Manual Commander Status Overrides */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Commander Override Status</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateUnitStatus(selectedUnit.id, 'EN_ROUTE')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition ${
                      selectedUnit.status === 'EN_ROUTE'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Force En Route
                  </button>

                  <button
                    onClick={() => updateUnitStatus(selectedUnit.id, 'ON_SCENE')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition ${
                      selectedUnit.status === 'ON_SCENE'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Mark On Scene
                  </button>

                  <button
                    onClick={() => updateUnitStatus(selectedUnit.id, 'AVAILABLE')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition ${
                      selectedUnit.status === 'AVAILABLE'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Set Standby
                  </button>

                  <button
                    onClick={() => updateUnitStatus(selectedUnit.id, 'RETURNING')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition ${
                      selectedUnit.status === 'RETURNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Recall to Base
                  </button>
                </div>
              </div>

              {/* Direct Link to full tactical map */}
              <Link
                href="/live-map"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <span>View on Live Response Map</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 font-mono text-xs">
              Select a responder unit from the fleet grid to inspect real-time telemetry and dispatch controls.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
