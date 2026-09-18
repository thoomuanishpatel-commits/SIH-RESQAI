'use client';

import React, { useState } from 'react';
import {
  Truck,
  Navigation,
  CheckCircle2,
  AlertOctagon,
  Users,
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  Flame,
  PhoneCall,
  Volume2,
  AlertTriangle
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const ResponderMobileView: React.FC = () => {
  const {
    units,
    incidents,
    selectedResponderUnit,
    updateUnitStatus,
    updateIncidentStatus,
    resolveIncident,
    setActiveView
  } = useEmergency();

  const [activeUnit, setActiveUnit] = useState(units[0]);
  const [arrived, setArrived] = useState(false);
  const [backupRequested, setBackupRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeIncident = incidents.find(i => i.id === activeUnit.assignedIncidentId) || incidents[0];

  const handleArrived = () => {
    setArrived(true);
    updateUnitStatus(activeUnit.id, 'ON_SCENE');
    updateIncidentStatus(activeIncident.id, 'ON_SCENE');
    setStatusMessage('Status updated to ON SCENE. EOC notified.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRequestBackup = () => {
    setBackupRequested(true);
    setStatusMessage('URGENT: Secondary EMS and Heavy Rescue backup broadcast to Command Center.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResolve = () => {
    resolveIncident(activeIncident.id);
    updateUnitStatus(activeUnit.id, 'AVAILABLE');
    setStatusMessage('Incident marked RESOLVED. Unit returned to AVAILABLE.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white p-4 max-w-lg mx-auto flex flex-col justify-between space-y-4">
      
      {/* Top Unit Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400">FIELD OPERATOR TERMINAL</div>
              <h2 className="text-base font-black font-mono text-white tracking-wide">
                {activeUnit.callsign}
              </h2>
              <div className="text-[11px] font-mono text-cyan-400">
                {activeUnit.modelName} • {activeUnit.plateNumber}
              </div>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
              arrived
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-blue-950 text-blue-300 border-blue-700'
            }`}
          >
            {arrived ? 'ON SCENE' : 'EN ROUTE'}
          </span>
        </div>

        {/* Vehicle Telemetry Gauge Bar */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 font-mono text-center">
          <div>
            <span className="text-[9px] text-slate-500 block">CREW</span>
            <span className="text-xs font-bold text-slate-200">{activeUnit.crewCount} Pers</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">FUEL TANK</span>
            <span className="text-xs font-bold text-amber-400">{activeUnit.fuelPercent || 85}%</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">
              {activeUnit.waterTankLiters ? 'WATER' : activeUnit.oxygenLevelPercent ? 'O2' : 'SPEED'}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {activeUnit.waterTankLiters
                ? `${(activeUnit.waterTankLiters / 1000).toFixed(1)}k L`
                : activeUnit.oxygenLevelPercent
                ? `${activeUnit.oxygenLevelPercent}%`
                : `${activeUnit.speedKmh || 45} km/h`}
            </span>
          </div>
        </div>

        {/* Switch unit for demo */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>Active Fleet: {units.length} Units</span>
          <select
            value={activeUnit.id}
            onChange={e => {
              const u = units.find(unit => unit.id === e.target.value);
              if (u) setActiveUnit(u);
            }}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-blue-500 max-w-[210px] truncate"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>
                {u.callsign.split(' ')[0]} • {u.modelName ? u.modelName.split(' ')[0] : u.type} ({u.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Incident Alert Banner */}
      <div className="bg-rose-950/40 border-2 border-rose-600/60 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs font-mono font-black text-rose-400 tracking-wider">
              ASSIGNED DISPATCH: {activeIncident.id}
            </span>
          </div>
          <TrustSafetyBadge type="LIVE_DATA" label="HIGH PRIORITY" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">{activeIncident.title}</h3>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{activeIncident.location.address} ({activeIncident.location.zone})</span>
          </p>
        </div>

        {/* Tactical Key Telemetry */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">DISTANCE</span>
            <span className="text-2xl font-black text-white">{activeUnit.distanceKm || '1.8'} km</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">ESTIMATED ARRIVAL</span>
            <span className="text-2xl font-black text-blue-400">
              {arrived ? '0 min' : `${activeUnit.etaMinutes || '4'} min`}
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">REPORTED VICTIMS</span>
            <span className="text-2xl font-black text-amber-300">{activeIncident.estimatedCasualties}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">POSSIBLE TRAPPED</span>
            <span className="text-2xl font-black text-rose-400">{activeIncident.trappedCount || 2}</span>
          </div>
        </div>

        {/* Hazard Note */}
        {activeIncident.aiAnalysis && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <div className="font-mono text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>HAZARD BRIEFING</span>
            </div>
            <p>{activeIncident.aiAnalysis.reasoning}</p>
          </div>
        )}
      </div>

      {/* Broadcast Message alert if triggered */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-blue-600 text-white text-xs font-mono font-bold text-center animate-bounce shadow-lg">
          {statusMessage}
        </div>
      )}

      {/* HUGE TACTICAL BUTTONS DESIGNED FOR GLOVED / STRESSED OPERATION */}
      <div className="space-y-3 pt-2">
        
        {/* NAVIGATE BUTTON */}
        <a
          href={`https://maps.google.com/?q=${activeIncident.location.lat},${activeIncident.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black font-mono text-base tracking-wider flex items-center justify-center gap-3 shadow-xl transition active:scale-95"
        >
          <Navigation className="w-6 h-6" />
          <span>START NAVIGATION (GPS)</span>
        </a>

        {/* ARRIVED & BACKUP IN A 2-BUTTON ROW */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleArrived}
            className={`py-4 px-4 rounded-2xl font-black font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95 border ${
              arrived
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-600/40'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{arrived ? 'ARRIVED ✓' : 'MARK ARRIVED'}</span>
          </button>

          <button
            onClick={handleRequestBackup}
            className={`py-4 px-4 rounded-2xl font-black font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95 border ${
              backupRequested
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border-rose-600/40'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span>{backupRequested ? 'BACKUP SENT' : 'REQ BACKUP'}</span>
          </button>
        </div>

        {/* RESOLVE BUTTON */}
        <button
          onClick={handleResolve}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-black font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>RESOLVE & CLEAR SCENE</span>
        </button>
      </div>

    </div>
  );
};
