'use client';

import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Activity,
  Flame,
  Truck,
  MapPin,
  Radio,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const LandingHero: React.FC = () => {
  const { setActiveView, setSosModalOpen } = useEmergency();

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center border-b border-slate-800 bg-[#070B13] py-10 sm:py-14">
      
      {/* Background Animated GIS Schematic Visualizer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
          {/* Subtle Grid */}
          <pattern id="hero-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
          </pattern>
          <rect width="1000" height="600" fill="url(#hero-grid)" />

          {/* Animated Route Line */}
          <path
            d="M 200,450 Q 500,200 800,320"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />

          {/* Incident Node Ping */}
          <circle cx="800" cy="320" r="30" fill="#EF4444" opacity="0.2" className="animate-ping" />
          <circle cx="800" cy="320" r="10" fill="#EF4444" />

          {/* Responder Node */}
          <circle cx="200" cy="450" r="12" fill="#3B82F6" stroke="#93C5FD" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 my-auto w-full">
        
        {/* Top Operational Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-mono shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">RESQAI AUTONOMOUS CRISIS ENGINE</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-bold">PAN-INDIA NATIONAL GRID LIVE</span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-sans leading-none">
            AI-POWERED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400">
              DISASTER RESPONSE
            </span>
          </h1>

          <div className="text-lg sm:text-2xl font-mono text-slate-300 font-bold tracking-widest flex items-center justify-center gap-3 sm:gap-6 pt-2">
            <span>Detect.</span>
            <span className="text-rose-500">•</span>
            <span>Understand.</span>
            <span className="text-amber-500">•</span>
            <span>Respond.</span>
            <span className="text-blue-500">•</span>
            <span>Recover.</span>
          </div>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
            A unified crisis coordination platform connecting citizens in distress with AI incident intelligence, Emergency Operations Centers, and frontline responders in real time.
          </p>
        </div>

        {/* Triple Action CTAs (Preserving user requirements) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-xl mx-auto">
          
          {/* Primary CTA: SEND SOS */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-mono font-black text-sm tracking-wider shadow-xl shadow-rose-950/70 border border-rose-400/40 transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>SEND SOS</span>
          </button>

          {/* Secondary CTA: REPORT AN EMERGENCY */}
          <button
            onClick={() => setActiveView('CITIZEN')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm tracking-wide border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-2"
          >
            <span>REPORT AN EMERGENCY</span>
          </button>

          {/* Third CTA: ENTER COMMAND CENTER */}
          <button
            onClick={() => setActiveView('COMMAND')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-mono font-bold text-sm tracking-wide border border-blue-400/30 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50"
          >
            <Activity className="w-4 h-4" />
            <span>ENTER COMMAND CENTER</span>
          </button>
        </div>

        {/* Live System Throughput Badges */}
        <div className="pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono">
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block">SOS BEACON LATENCY</span>
            <span className="text-sm font-bold text-emerald-400">&lt; 250 ms</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block">AI TRIAGE TIME</span>
            <span className="text-sm font-bold text-blue-400">42 seconds</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block">GIS ROUTE DETOUR</span>
            <span className="text-sm font-bold text-amber-400">Autonomous</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block">OFFLINE PROTOCOL</span>
            <span className="text-sm font-bold text-purple-400">Mesh &amp; Local Buffer</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-2 sm:pt-4 flex justify-center">
          <a
            href="#mission-philosophy"
            className="inline-flex flex-col items-center text-slate-500 hover:text-slate-300 transition-colors group cursor-pointer"
            aria-label="Scroll to Mission and Philosophy"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-slate-400">
              Explore Mission
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce mt-1 text-slate-500 group-hover:text-slate-300" />
          </a>
        </div>

      </div>
    </section>
  );
};
