'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2, ChevronRight, Truck, Flame, Radio } from 'lucide-react';

interface SihDemoControllerProps {
  currentStepIndex: number;
  isRunning: boolean;
  onStartDemo: () => void;
  onPauseDemo: () => void;
  onResetDemo: () => void;
  onStepClick: (index: number) => void;
}

export const SIH_DEMO_STEPS = [
  { id: 1, label: 'Citizen Reports Fire', desc: 'Distress call received via citizen mobile portal' },
  { id: 2, label: 'Incident Mapped with Pulse', desc: 'Sub-meter coordinates plotted on OpenFreeMap EOC view' },
  { id: 3, label: 'EOC Operator Inspects', desc: 'Incident #RQ-1042 opened on central tactical screen' },
  { id: 4, label: 'Private Media & AI Triage', desc: 'Encrypted citizen photos verified; AI elevates to CRITICAL' },
  { id: 5, label: 'Nearest Unit Found', desc: 'Decision support ranks Tender F-034 at 2.4 km away' },
  { id: 6, label: 'Dispatch Triggered', desc: 'OpenRouteService calculates street-level road trajectory' },
  { id: 7, label: 'Smooth Road Animation', desc: 'Vehicle F-034 navigates street network with live ETA' },
  { id: 8, label: 'On Scene & Resolved', desc: 'Unit reaches site, extinguishes blaze, incident marked RESOLVED' }
];

export const SihDemoController: React.FC<SihDemoControllerProps> = ({
  currentStepIndex,
  isRunning,
  onStartDemo,
  onPauseDemo,
  onResetDemo,
  onStepClick
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-xl max-w-sm w-full font-mono text-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            60-SEC SIH DEMONSTRATION
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-slate-400 hover:text-white"
        >
          {expanded ? 'Collapse' : 'Timeline'}
        </button>
      </div>

      {/* Progress pill indicator */}
      <div className="flex items-center gap-1.5 mb-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
          {currentStepIndex + 1}
        </div>
        <div className="flex-1 truncate">
          <div className="font-bold text-white text-[11px] truncate">
            {SIH_DEMO_STEPS[currentStepIndex]?.label}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {SIH_DEMO_STEPS[currentStepIndex]?.desc}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={isRunning ? onPauseDemo : onStartDemo}
          className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-white text-xs ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/40'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause Demo' : 'Run 60s Demo'}</span>
        </button>

        <button
          onClick={onResetDemo}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          title="Reset Demo to Step 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Timeline Step List */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
          {SIH_DEMO_STEPS.map((step, idx) => {
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(idx)}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-[10px] transition ${
                  isCurrent
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                    : isPassed
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold border border-slate-700 shrink-0">
                  {isPassed ? '✓' : idx + 1}
                </span>
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
