'use client';

import React from 'react';
import { Home, Droplet, Utensils, ShieldCheck, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const ShelterManagementView: React.FC = () => {
  const { shelters } = useEmergency();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            EVACUATION RELIEF CENTERS ({shelters.length} ACTIVE LOCATIONS)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Monitoring bed occupancy, water rations, and medical supply reserves.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map(shelter => {
          const available = shelter.capacity - shelter.occupancy;
          const occPct = Math.round((shelter.occupancy / shelter.capacity) * 100);

          return (
            <div
              key={shelter.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">{shelter.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {shelter.isOpen ? 'ACCEPTING EVACUEES' : 'FULL'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{shelter.name}</h4>
                <p className="text-xs text-slate-400">{shelter.location.address}</p>

                {/* Capacity bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="text-white font-bold">{shelter.occupancy} / {shelter.capacity} ({available} available)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occPct > 85 ? 'bg-rose-500' : occPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                </div>

                {/* Logistics meters */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono mt-4">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                      <Utensils className="w-3 h-3 text-amber-400" />
                      <span>FOOD</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{shelter.foodSupplyPercent}%</div>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                      <Droplet className="w-3 h-3 text-blue-400" />
                      <span>WATER</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{shelter.waterSupplyPercent}%</div>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>MEDIC</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">Ready</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>In-charge: {shelter.contactNumber}</span>
                <a
                  href={`tel:${shelter.contactNumber}`}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                >
                  Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
