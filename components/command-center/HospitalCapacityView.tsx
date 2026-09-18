'use client';

import React from 'react';
import { Building, Activity, HeartPulse, Wind, Phone, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const HospitalCapacityView: React.FC = () => {
  const { hospitals } = useEmergency();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            REGIONAL TRAUMA NETWORK STATUS ({hospitals.length} FACILITIES)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time emergency & critical care bed telemetries.</p>
        </div>
        <TrustSafetyBadge type="LIVE_DATA" label="HOSPITAL EOC TELEMETRY" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map(hosp => {
          const isAtCapacity = hosp.status === 'AT_CAPACITY';
          const isCriticalOnly = hosp.status === 'CRITICAL_ONLY';
          const occupancyPct = Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100);

          return (
            <div
              key={hosp.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-lg ${
                isAtCapacity
                  ? 'border-rose-900/80 bg-rose-950/10'
                  : isCriticalOnly
                  ? 'border-amber-900/80 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {hosp.traumaLevel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{hosp.location.zone}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{hosp.name}</h4>
                  <p className="text-xs text-slate-400">{hosp.location.address}</p>
                </div>

                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
                    hosp.status === 'ACCEPTING'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : isCriticalOnly
                      ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                      : 'bg-rose-950/80 text-rose-400 border-rose-800'
                  }`}
                >
                  {hosp.status.replace('_', ' ')}
                </span>
              </div>

              {/* Resource grid */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Building className="w-3 h-3 text-blue-400" />
                    <span>EMERGENCY</span>
                  </div>
                  <div className="text-base font-bold text-white mt-1">
                    {hosp.availableBeds} <span className="text-xs text-slate-500 font-normal">/ {hosp.totalBeds}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">{occupancyPct}% Occupied</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <HeartPulse className="w-3 h-3 text-rose-400" />
                    <span>ICU BEDS</span>
                  </div>
                  <div className={`text-base font-bold mt-1 ${hosp.icuAvailable > 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hosp.icuAvailable} <span className="text-xs text-slate-500 font-normal">/ {hosp.icuTotal}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">Critical Care</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span>VENTILATORS</span>
                  </div>
                  <div className="text-base font-bold text-white mt-1">
                    {hosp.ventilatorsAvailable} <span className="text-xs text-slate-500 font-normal">/ {hosp.ventilatorsTotal}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">Respiratory</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                <span className="font-mono">ER Hotline: {hosp.phone}</span>
                <a
                  href={`tel:${hosp.phone}`}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition"
                >
                  Direct Patch
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
