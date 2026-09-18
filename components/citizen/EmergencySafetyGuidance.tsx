'use client';

import React, { useState } from 'react';
import {
  Flame,
  Waves,
  Activity,
  CarFront,
  Building2,
  Wind,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { SAFETY_GUIDES } from '@/data/demoData';

export const EmergencySafetyGuidance: React.FC = () => {
  const [selectedGuideId, setSelectedGuideId] = useState(SAFETY_GUIDES[0].id);

  const activeGuide = SAFETY_GUIDES.find(g => g.id === selectedGuideId) || SAFETY_GUIDES[0];

  const iconMap: Record<string, React.ElementType> = {
    Flame: Flame,
    Waves: Waves,
    Activity: Activity,
    CarFront: CarFront,
    Building2: Building2,
    Wind: Wind
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            CITIZEN FIRST ACTION PROTOCOLS
          </span>
        </div>
        <h1 className="text-3xl font-black text-white">What should I do right now?</h1>
        <p className="text-xs text-slate-300 mt-1">
          Clear, immediate life-safety rules. Read the bullet points below and follow immediately.
        </p>
      </div>

      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {SAFETY_GUIDES.map(guide => {
          const Icon = iconMap[guide.icon] || Flame;
          const isSelected = guide.id === activeGuide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{guide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Guidance Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Title banner */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {activeGuide.category} EMERGENCY GUIDE
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              {activeGuide.title}
            </h2>
          </div>
          <p className="text-sm font-semibold text-amber-300 font-mono italic">
            &ldquo;{activeGuide.tagline}&rdquo;
          </p>
        </div>

        {/* Two-column DO vs DO NOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DO Column */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm tracking-wide">
              <CheckCircle2 className="w-5 h-5" />
              <span>DO IMMEDIATELY</span>
            </div>
            <ul className="space-y-3">
              {activeGuide.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DO NOT Column */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm tracking-wide">
              <XCircle className="w-5 h-5" />
              <span>DO NOT DO</span>
            </div>
            <ul className="space-y-3">
              {activeGuide.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Need immediate rescue prompt */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Trapped or injured right now?</h4>
          <p className="text-xs text-slate-400">Transmit an encrypted GPS distress beacon directly to the Emergency Command Center.</p>
        </div>
        <a
          href="tel:112"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold shrink-0 transition"
        >
          CALL 112 NOW
        </a>
      </div>

    </div>
  );
};
