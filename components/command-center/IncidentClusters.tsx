'use client';

import React from 'react';
import {
  Radar,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Radio
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const IncidentClusters: React.FC = () => {
  const { clusters, incidents, setSelectedIncident } = useEmergency();

  return (
    <div className="space-y-6">
      
      {/* Radar Threat Alert Banner */}
      <div className="bg-slate-900 border border-rose-600/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="relative w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center shrink-0">
              <Radar className="w-6 h-6 text-rose-400 radar-sweep-anim" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  RESQAI DISASTER RADAR • ACTIVE ANOMALY
                </span>
                <TrustSafetyBadge type="LIVE_DATA" label="SPATIAL CLUSTER" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                14 Incidents Detected Within 2.8 km Radius
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Possible coordinated urban flash flooding along Musi River corridor. High velocity rate of report accumulation (4.2 reports/min).
              </p>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-right font-mono shrink-0">
            <div className="text-[10px] text-slate-400 uppercase">CLUSTER THREAT INDEX</div>
            <div className="text-xl font-black text-rose-400">HIGH (88/100)</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3" />
              <span>Escalating Velocity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            DETECTED SPATIAL EVENT CLUSTERS ({clusters.length})
          </h3>
          <span className="text-xs font-mono text-slate-500">Autonomous GIS clustering enabled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map(cluster => {
            const isEscalating = cluster.status === 'ESCALATING';
            return (
              <div
                key={cluster.id}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-lg transition ${
                  isEscalating
                    ? 'border-rose-800/60 hover:border-rose-700'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {cluster.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isEscalating
                            ? 'bg-rose-950 text-rose-300 border-rose-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                        }`}
                      >
                        {cluster.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      {cluster.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Epicenter: {cluster.center.address}
                    </p>
                  </div>

                  <span className="text-2xl">
                    {cluster.rootIncidentType === 'FLOOD' ? '🌊' : '🔥'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">REPORTS</span>
                    <span className="text-base font-bold text-white">{cluster.reportCount}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RADIUS</span>
                    <span className="text-base font-bold text-white">{cluster.radiusKm} km</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">AT RISK</span>
                    <span className="text-base font-bold text-amber-300">{cluster.affectedPopulationEstimate.toLocaleString()}+</span>
                  </div>
                </div>

                {/* Threat description */}
                <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  {cluster.threatSummary}
                </p>

                {/* Associated incident chips */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                    Correlated Active Incidents:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.incidentIds.map(incId => {
                      const matched = incidents.find(i => i.id === incId);
                      return (
                        <button
                          key={incId}
                          onClick={() => matched && setSelectedIncident(matched)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1 transition"
                        >
                          <span>{incId}</span>
                          <ArrowUpRight className="w-3 h-3 text-blue-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
