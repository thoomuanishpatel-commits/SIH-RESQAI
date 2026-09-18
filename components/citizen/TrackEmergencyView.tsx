'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  Truck,
  Building,
  ShieldCheck,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Navigation,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { formatTimestamp } from '@/lib/utils';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const TrackEmergencyView: React.FC = () => {
  const { incidents, myActiveIncident, units, hospitals, setActiveView, autoDispatchedUnit } = useEmergency();
  const [searchId, setSearchId] = useState(myActiveIncident ? myActiveIncident.id : 'RQ-204891');
  const [currentIncident, setCurrentIncident] = useState(myActiveIncident || incidents[0]);
  const [etaSeconds, setEtaSeconds] = useState(272); // 4m 32s

  useEffect(() => {
    if (myActiveIncident) {
      setCurrentIncident(myActiveIncident);
      setSearchId(myActiveIncident.id);
    }
  }, [myActiveIncident]);

  // Countdown timer for ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = incidents.find(i => i.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setCurrentIncident(found);
    }
  };

  const assignedUnit = autoDispatchedUnit || units.find(u => currentIncident.assignedUnits.includes(u.id)) || units[0];
  const nearestHospital = hospitals[0];

  const timelineSteps = [
    { time: '17:18:00', label: 'SOS Received', desc: 'Emergency signal received & logged', done: true },
    { time: '17:18:24', label: 'Location Confirmed', desc: 'GPS pinpointed to 4m accuracy', done: true },
    { time: '17:19:10', label: 'AI Triage Completed', desc: 'Classified as Priority 1 (CRITICAL)', done: true },
    { time: '17:20:00', label: 'Responder Assigned', desc: `${assignedUnit.callsign} designated`, done: true },
    { time: '17:21:40', label: 'Responder On Route', desc: `In transit (${assignedUnit.distanceKm || 1.4} km away)`, done: currentIncident.status === 'RESPONDER_EN_ROUTE' || currentIncident.status === 'ON_SCENE' || currentIncident.status === 'RESOLVED' },
    { time: '17:26:00', label: 'Responder Arrived On Scene', desc: 'Active rescue & stabilization', done: currentIncident.status === 'ON_SCENE' || currentIncident.status === 'RESOLVED' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">CITIZEN STATUS RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Track My Emergency</h1>
          <p className="text-xs text-slate-300 mt-0.5">Real-time GPS telemetry from Emergency Operations Command.</p>
        </div>

        {/* Lookup Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value.toUpperCase())}
              placeholder="e.g. RQ-204891"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold transition"
          >
            Track
          </button>
        </form>
      </div>

      {currentIncident ? (
        <div className="space-y-6">
          
          {/* Main Status Headline Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <TrustSafetyBadge type="LIVE_DATA" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ETA Display */}
              <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  ESTIMATED ARRIVAL (ETA)
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-wider my-1">
                  {currentIncident.status === 'ON_SCENE' ? 'ON SCENE' : formatEta(etaSeconds)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Optimal clear path confirmed by traffic AI</span>
                </div>
              </div>

              {/* Responder Info */}
              <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  ASSIGNED RESPONDER UNIT
                </span>
                <div className="text-xl font-black text-white mt-1">
                  {assignedUnit.callsign}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {assignedUnit.department}
                </div>
                <div className="mt-2 text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/60 inline-flex items-center gap-1 w-fit">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Equipped: {assignedUnit.equipment[0]}</span>
                </div>
              </div>

              {/* Destination Hospital */}
              <div className="flex flex-col justify-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  DESIGNATED TRAUMA HOSPITAL
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {nearestHospital.name}
                </div>
                <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Trauma Level 1 • ICU Beds Ready</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Emergency: {nearestHospital.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Schematic Route & Mini Map Graphic */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-400" />
                <span>Active Route Topology: Unit → Citizen Location → Trauma Hospital</span>
              </div>
              <Link
                href="/live-map"
                className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Full Map View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-28 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-between px-8 sm:px-14 overflow-hidden">
              {/* Background grid line */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-rose-500 to-emerald-500 opacity-40" />

              {/* Node 1: Unit */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-300 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-blue-300 font-bold mt-2">Unit 07</span>
                <span className="text-[10px] text-slate-400">1.4 km</span>
              </div>

              {/* Intermediate motion dots */}
              <div className="hidden sm:flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">Priority Corridor</span>
              </div>

              {/* Node 2: Citizen */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-rose-300 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-rose-300 font-bold mt-2">You (Citizen)</span>
                <span className="text-[10px] text-slate-400">{currentIncident.location.zone}</span>
              </div>

              {/* Node 3: Hospital */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-300 text-white flex items-center justify-center shadow-lg">
                  <Building className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-emerald-300 font-bold mt-2">Osmania Gen</span>
                <span className="text-[10px] text-slate-400">Pre-Alerted</span>
              </div>
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Incident Response Timeline ({currentIncident.id})</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {timelineSteps.map((step, idx) => (
                <div key={step.label} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      step.done
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{step.time}</span>
                      <span className={`text-xs font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          <AlertCircle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
          <p className="text-sm font-medium text-white">Incident ID not found</p>
          <p className="text-xs text-slate-400 mt-1">Please double check your 6-digit RQ token or return to citizen home.</p>
        </div>
      )}
    </div>
  );
};
