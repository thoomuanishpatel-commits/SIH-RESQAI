'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Navigation, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const RoadConditionsView: React.FC = () => {
  const { roadBlocks, toggleRoadBlock } = useEmergency();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            ROAD INFRASTRUCTURE & ROUTE OBSTRUCTIONS ({roadBlocks.length} MONITORED SECTORS)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle road blockage states below to inspect live dynamic route recalculation across first responder units.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {roadBlocks.map(rb => {
          const isBlocked = rb.severity === 'BLOCKED';
          return (
            <div
              key={rb.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isBlocked ? 'border-rose-800/80 bg-rose-950/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-400">{rb.id}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isBlocked
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}
                  >
                    {rb.severity.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{rb.zone}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{rb.streetName}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <strong className="text-slate-400">Trigger:</strong> {rb.reason.replace('_', ' ')}
                </div>
                <div className="text-xs text-blue-300/90 font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800 flex items-start gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>AI Detour Guidance:</strong> {rb.detourAdvice}</span>
                </div>
              </div>

              {/* Action Button to toggle road block */}
              <div className="shrink-0 flex sm:flex-col gap-2">
                <button
                  onClick={() => toggleRoadBlock(rb.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                    isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isBlocked ? 'CLEAR OBSTRUCTION' : 'BLOCK ROAD (SIMULATE)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
