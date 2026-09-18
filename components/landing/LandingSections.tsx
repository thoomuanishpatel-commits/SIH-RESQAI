'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Radio,
  Cpu,
  Truck,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  WifiOff,
  BarChart3,
  Layers,
  HeartPulse,
  Navigation,
  HelpCircle,
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  Zap,
  Crosshair,
  Compass,
  Search,
  Satellite,
  Gauge,
  Eye,
  Check,
  Siren
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { SIHEcosystemSection } from './SIHEcosystemSection';

export const LandingSections: React.FC = () => {
  const { setActiveView } = useEmergency();

  return (
    <div className="space-y-24 py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* SECTION 1: WHAT IS RESQAI */}
      <section id="mission-philosophy" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-mt-20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Mission & Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            In an emergency, the user should not have to think.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            ResQAI replaces slow, fragmented dispatch queues with a unified intelligence grid. Whether a citizen is trapped in a flash flood or a high-rise fire, assistance is mobilized with zero unnecessary forms.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
            <div className="border-l-2 border-rose-500 pl-3">
              <span className="text-white font-bold block">100% Intuitive</span>
              <span className="text-slate-400">Tested for extreme citizen distress</span>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <span className="text-white font-bold block">Palantir-Grade EOC</span>
              <span className="text-slate-400">Complete multi-agency GIS control</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
            <span className="text-slate-400 uppercase">ResQAI Operating Principles</span>
            <span className="text-emerald-400 font-bold">PRODUCTION VERIFIED</span>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { title: 'Simplicity First', desc: 'Emergency actions are visually prominent and accessible within seconds.' },
              { title: 'Explainable AI', desc: 'Every dispatch recommendation provides transparent "WHY" evidence.' },
              { title: 'Dynamic Rerouting', desc: 'Real-time road block detection immediately recomputes fastest path.' },
              { title: 'Offline Resiliency', desc: 'Operates in low connectivity with local GPS queuing and synchronization.' }
            ].map((p, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">{p.title}:</strong>{' '}
                  <span className="text-slate-300">{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 3: SIH EVALUATOR ECOSYSTEM SHOWCASE */}
      <SIHEcosystemSection />

      {/* SECTION 4: SIGNATURE SIMULATION & RESPONSE ENGINE CALLOUT */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>SIGNATURE FEATURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Test ResQAI Response Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trigger realistic disaster simulations (Musi River Flash Flooding, HITEC High-Rise Fire) and observe automated AI triage, spatial clustering, roadblock reroutes, and trauma center alerts in real-time.
            </p>
          </div>

          <button
            onClick={() => setActiveView('SIMULATION')}
            className="shrink-0 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-mono font-black text-sm tracking-wider shadow-xl transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>START LIVE SIMULATION</span>
          </button>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA BANNER */}
      <section className="text-center space-y-6 py-12 border-t border-slate-800/80">
        <div className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest">
          WHEN EVERY SECOND MATTERS,
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
          INTELLIGENCE SHOULD MOVE WITH IT.
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Built to protect communities, assist first responders, and give emergency authorities complete clarity in moments of crisis.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveView('CITIZEN')}
            className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-mono font-bold text-sm tracking-wider shadow-xl shadow-rose-950/60 transition"
          >
            ENTER RESQAI
          </button>

          <button
            onClick={() => setActiveView('COMMAND')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono font-bold text-sm tracking-wider border border-slate-700 transition"
          >
            OPEN COMMAND CENTER
          </button>
        </div>
      </section>

    </div>
  );
};
