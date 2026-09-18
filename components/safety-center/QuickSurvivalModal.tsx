'use client';

import React, { useState } from 'react';
import { X, AlertOctagon, PhoneCall, ShieldAlert, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { DISASTERS_DATA } from '@/data/safetyGuideData';
import { DisasterIcon } from './SafetyIllustrations';

interface QuickSurvivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDisasterId?: string;
  language?: string;
}

export const QuickSurvivalModal = ({
  isOpen,
  onClose,
  initialDisasterId = 'earthquake'
}: QuickSurvivalModalProps) => {
  const [selectedId, setSelectedId] = useState<string>(initialDisasterId);

  if (!isOpen) return null;

  const current = DISASTERS_DATA.find((d) => d.id === selectedId) || DISASTERS_DATA[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-950/60 overflow-hidden my-8">
        {/* Header alert strip */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-7 h-7 text-white shrink-0 animate-pulse" />
            <div>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider">
                60-SECOND SURVIVAL GUIDE
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Immediate life-saving priority actions. Read in 10 seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-700 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Disaster Switcher Pills */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {DISASTERS_DATA.slice(0, 8).map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedId === d.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <DisasterIcon id={d.id} className="w-3.5 h-3.5" />
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        {/* Modal Core Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                CRITICAL EMERGENCY RESPONSE
              </span>
              <h3 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>{current.name}</span>
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {current.shortTag}
                </span>
              </h3>
            </div>

            <a
              href="tel:112"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl shadow-lg transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>DIAL 112</span>
            </a>
          </div>

          {/* Immediate 3 Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              WHAT TO DO RIGHT NOW (SECONDS 0-60)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {current.quickActionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl relative overflow-hidden"
                >
                  <span className="absolute -bottom-2 -right-1 text-5xl font-black text-slate-700/25 select-none">
                    0{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs mb-2">
                    0{idx + 1}
                  </div>
                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Do vs Don't Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                DO THIS IMMEDIATELY
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {current.doDonts
                  .filter((item) => item.type === 'do')
                  .slice(0, 2)
                  .map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        <strong className="text-emerald-200">{d.title}:</strong> {d.description}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl">
              <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                AVOID AT ALL COSTS
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {current.doDonts
                  .filter((item) => item.type === 'dont')
                  .slice(0, 2)
                  .map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>
                        <strong className="text-red-200">{d.title}:</strong> {d.description}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Call 112 note */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="text-slate-300">
              <span className="font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                When to call 112:
              </span>
              <span>{current.call112Advice}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs shrink-0 self-end md:self-auto"
            >
              Continue to Full Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
