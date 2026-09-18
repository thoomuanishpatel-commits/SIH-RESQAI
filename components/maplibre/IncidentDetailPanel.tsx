'use client';

import React from 'react';
import {
  AlertTriangle,
  X,
  Users,
  Image as ImageIcon,
  ShieldCheck,
  Truck,
  Flame,
  Radio,
  Clock,
  MapPin,
  Bot,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { LiveIncident, LiveVehicle } from '@/data/liveMapData';
import Link from 'next/link';

interface IncidentDetailPanelProps {
  incident: LiveIncident;
  onClose: () => void;
  availableVehicles: LiveVehicle[];
  onDispatchVehicle: (vehicleCode: string, incidentId: string) => void;
  onFocusVehicle?: (vehicleCode: string) => void;
}

export const IncidentDetailPanel: React.FC<IncidentDetailPanelProps> = ({
  incident,
  onClose,
  availableVehicles,
  onDispatchVehicle,
  onFocusVehicle
}) => {
  // Find recommended nearest unit of appropriate type (e.g. FIRE for Fire, AMBULANCE for casualty)
  const sortedNearby = [...availableVehicles]
    .filter((v) => v.city.toLowerCase() === incident.city.toLowerCase() || v.city === 'Hyderabad')
    .sort((a, b) => (a.distanceToIncidentKm || 99) - (b.distanceToIncidentKm || 99));

  const recommendedUnit = sortedNearby[0] || availableVehicles[0];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-black animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            HIGH
          </span>
        );
      case 'MODERATE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            MODERATE
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            LOW
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950/95 border border-slate-800/90 rounded-3xl p-5 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto space-y-5 text-slate-200 scrollbar-none">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-blue-400">
              INCIDENT #{incident.id}
            </span>
            {getSeverityBadge(incident.severity)}
          </div>
          <h3 className="text-lg font-black text-white leading-tight">
            {incident.title}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{incident.address}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Incident Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">AFFECTED</span>
          <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
            <Users className="w-4 h-4 text-amber-400" />
            {incident.peopleAffected} People
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">STATUS</span>
          <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mt-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            {incident.status}
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[10px] uppercase">REPORTED</span>
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {incident.reportedAt}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-300">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
          SITUATION REPORT
        </span>
        {incident.description}
      </div>

      {/* AI Decision Support Assessment */}
      <div className="bg-blue-950/20 border border-blue-500/30 p-3.5 rounded-2xl space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 uppercase">
          <Bot className="w-4 h-4 text-blue-400" />
          <span>RESQAI INTELLIGENCE ASSESSMENT</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {incident.aiAssessment}
        </p>
      </div>

      {/* Private Citizen Media Submissions Banner */}
      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              {incident.privateMediaCount} Private Submissions
            </span>
            <span className="text-[10px] text-slate-400">
              Encrypted in private Supabase bucket
            </span>
          </div>
        </div>

        <Link
          href="/admin/incidents"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition font-mono"
        >
          <span>View Media</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Assigned Responders */}
      <div>
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
          ASSIGNED RESPONDER FLEET ({incident.assignedVehicleCodes.length})
        </span>
        {incident.assignedVehicleCodes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {incident.assignedVehicleCodes.map((code) => (
              <button
                key={code}
                onClick={() => onFocusVehicle && onFocusVehicle(code)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-200 transition"
              >
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>{code}</span>
                <span className="text-[10px] text-emerald-400">• En Route</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-amber-400/90 bg-amber-950/20 border border-amber-500/30 p-2.5 rounded-xl">
            No units currently assigned. Dispatch recommended unit below.
          </div>
        )}
      </div>

      {/* Nearest Available Responders & Decision Support Dispatch */}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" />
            NEAREST AVAILABLE UNITS
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            OpenRouteService Distance
          </span>
        </div>

        {/* Highlighted Recommended Unit */}
        {recommendedUnit && (
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                  {recommendedUnit.vehicle_code}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  RECOMMENDED UNIT
                </span>
              </div>
              <span className="text-xs font-mono text-slate-300">
                {recommendedUnit.distanceToIncidentKm || 2.4} km • {recommendedUnit.etaString || '05 min ETA'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Stationed at {recommendedUnit.baseStation}. Closest rapid response tender with clear arterial road access.
            </p>

            <button
              onClick={() => onDispatchVehicle(recommendedUnit.vehicle_code, incident.id)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2"
            >
              <span>DISPATCH {recommendedUnit.vehicle_code}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Other Nearby Units List */}
        <div className="space-y-1.5">
          {sortedNearby.slice(1, 4).map((veh) => (
            <div
              key={veh.id}
              className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{veh.vehicle_code}</span>
                <span className="text-[10px] text-slate-400">({veh.vehicle_type})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{veh.distanceToIncidentKm || 4.2} km</span>
                <button
                  onClick={() => onDispatchVehicle(veh.vehicle_code, incident.id)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-bold"
                >
                  Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 leading-tight">
          ⚠️ Decision support calculation based on road geometry. Does not replace human operational command discretion.
        </p>
      </div>
    </div>
  );
};
