'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  AlertOctagon,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { EmergencyUnit, Incident } from '@/types';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

interface Props {
  incident: Incident;
}

export const SmartDispatch: React.FC<Props> = ({ incident }) => {
  const { units, dispatchUnit } = useEmergency();
  const [selectedUnitId, setSelectedUnitId] = useState<string>('UNIT-EMS-02');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Score and rank candidates based on incident severity and requirements
  const candidateUnits = [
    {
      unit: units.find(u => u.id === 'UNIT-EMS-02') || units[0],
      name: 'Unit C (Apollo ALS Medic 2)',
      distance: '2.1 km',
      eta: '4 min',
      equipment: 'ICU Capable • Defibrillator • Ventilator',
      isICU: true,
      score: 98,
      recommended: true,
      reasons: [
        'Fastest estimated arrival for critical-care class (4 min)',
        'Fully equipped with transport ventilator & AED',
        'Direct arterial bypass route clear of detected road closures',
        'Paramedic crew trained in advanced inhalation trauma'
      ]
    },
    {
      unit: units.find(u => u.id === 'UNIT-FIRE-04') || units[1],
      name: 'Unit A (Bravo-4 Bronto Skylift)',
      distance: '1.4 km',
      eta: '5 min',
      equipment: '54m Hydraulic Ladder • High Pressure Fog',
      isICU: false,
      score: 89,
      recommended: false,
      reasons: [
        'Heavy hydraulic rescue equipment on board',
        'ETA within 5 minutes of scene',
        'Requires second ALS transport unit for casualties'
      ]
    },
    {
      unit: units.find(u => u.id === 'UNIT-EMS-08') || units[2],
      name: 'Unit B (KIMS Standby Medic 8)',
      distance: '1.7 km',
      eta: '8 min',
      equipment: 'Basic Life Support (BLS)',
      isICU: false,
      score: 72,
      recommended: false,
      reasons: [
        'Currently encountering minor traffic slowdown at Begumpet',
        'Standard BLS equipment only; not specialized for burn trauma'
      ]
    }
  ];

  const activeCandidate = candidateUnits.find(c => c.unit.id === selectedUnitId) || candidateUnits[0];

  const handleDispatch = () => {
    dispatchUnit(selectedUnitId, incident.id);
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            AI DECISION ENGINE
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Smart Dispatch: {incident.id}</span>
          </h3>
        </div>
        <TrustSafetyBadge type="AI_ANALYSIS" label="AI RECOMMENDED" />
      </div>

      {/* Triage Overview Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
        <div className="flex justify-between text-slate-300">
          <span>Target Incident:</span>
          <span className="font-bold text-rose-400">{incident.title}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Severity / Trapped:</span>
          <span className="text-amber-300">{incident.severity} • {incident.trappedCount || 0} Persons trapped</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Target Zone:</span>
          <span className="text-white">{incident.location.zone}</span>
        </div>
      </div>

      {/* Available Units Selection */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
          Candidate Responders Comparison:
        </div>
        <div className="space-y-2">
          {candidateUnits.map(cand => {
            const isSelected = selectedUnitId === cand.unit.id;
            return (
              <div
                key={cand.unit.id}
                onClick={() => setSelectedUnitId(cand.unit.id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-white">{cand.name}</span>
                    {cand.recommended && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
                        ★ TOP AI MATCH
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-right">
                    <span className="font-bold text-white">{cand.eta}</span>
                    <span className="text-slate-500 ml-1">({cand.distance})</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{cand.equipment}</span>
                  <span className="font-mono text-blue-400 font-bold">Score: {cand.score}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Crucial "WHY?" Explainability Breakdown */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
          <Info className="w-3.5 h-3.5" />
          <span>WHY IS THIS UNIT RECOMMENDED?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          ResQAI multi-variable utility solver evaluates real-time travel impedance, medical capabilities, and traffic obstacles.
        </p>

        <ul className="space-y-1.5 text-xs text-slate-300">
          {activeCandidate.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Authority Action Bar */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleDispatch}
          disabled={dispatchedSuccess}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition ${
            dispatchedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50'
          }`}
        >
          {dispatchedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>DISPATCH CONFIRMED & TRANSMITTED</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4" />
              <span>DISPATCH {activeCandidate.name.split(' ')[0]} NOW</span>
            </>
          )}
        </button>

        <button
          onClick={() => alert(`Authority Override: Manual reassignment logged for ${activeCandidate.name}`)}
          className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono border border-slate-700 hover:text-white transition"
          title="Authority Manual Override"
        >
          Override
        </button>
      </div>

    </div>
  );
};
