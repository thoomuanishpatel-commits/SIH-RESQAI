'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Cpu,
  MapPin,
  Truck,
  Building,
  Radio,
  Satellite,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
  WifiOff,
  Flame,
  Siren,
  Users,
  Clock,
  Compass,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  LayoutGrid,
  Circle,
  Server,
  Crosshair,
  Route,
  Eye,
  Sliders,
  Database
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const SIHEcosystemSection: React.FC = () => {
  const { setActiveView } = useEmergency();

  // Active state for the circular Response Loop
  const [selectedNode, setSelectedNode] = useState<number>(0);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(true);

  // Active state for the 6 Pillars Circular Arrangement
  const [activePillar, setActivePillar] = useState<number>(0);
  const [isAutoCyclePillars, setIsAutoCyclePillars] = useState<boolean>(true);
  const [pillarViewMode, setPillarViewMode] = useState<'circle' | 'grid'>('circle');

  const loopNodes = [
    {
      id: 'citizens',
      title: 'CITIZENS',
      icon: Radio,
      color: '#f43f5e',
      tag: 'INCIDENT REPORTING',
      accentBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      activeRing: 'ring-rose-500/50',
      items: ['SOS Distress Beacon', 'Voice Report Ingestion', 'Photo / Video OCR', 'Precise GPS Coordinates'],
      description: 'Zero-form multi-channel intake captures encrypted distress packets with battery, audio, and location metadata in milliseconds.'
    },
    {
      id: 'ai',
      title: 'AI INTELLIGENCE',
      icon: Cpu,
      color: '#06b6d4',
      tag: 'NEURAL CLUSTER CORE',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      activeRing: 'ring-cyan-500/50',
      items: ['Incident Classification', 'Severity Assessment', 'Duplicate Deduplication', 'Dynamic Priority Scoring'],
      description: 'Gemini Vision and NLP evaluate scene severity, filter prank alerts, and cluster duplicate 112 distress calls into a single incident.'
    },
    {
      id: 'geo',
      title: 'GEO INTELLIGENCE',
      icon: MapPin,
      color: '#f59e0b',
      tag: 'DYNAMIC GIS LAYER',
      accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      activeRing: 'ring-amber-500/50',
      items: ['Incident Locations', 'Risk Zones & Inundation', 'Road Obstacle Detours', 'Hospitals & Relief Hubs'],
      description: 'Live spatial layers compute real-time hazard perimeters, road blockages, and nearest emergency hospital facilities.'
    },
    {
      id: 'eoc',
      title: 'EOC COMMAND',
      icon: Building,
      color: '#3b82f6',
      tag: 'UNIFIED OPERATIONAL PICTURE',
      accentBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      activeRing: 'ring-blue-500/50',
      items: ['Live Crisis Dashboard', 'Situational Awareness', 'Multi-Agency Coordination', 'Response Telemetry Logs'],
      description: 'Palantir-grade tactical interface giving NDMA, SDMA, and municipal commanders instant cross-agency clarity.'
    },
    {
      id: 'responders',
      title: 'RESPONDERS',
      icon: Truck,
      color: '#10b981',
      tag: 'TACTICAL DISPATCH',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      activeRing: 'ring-emerald-500/50',
      items: ['Police Patrol Units', 'Advanced Life Support EMS', 'Fire & Heavy Extrication', 'NDRF Relief Battalions'],
      description: 'Automated dispatch contracts push turn-by-turn danger guidance directly to frontline tablet screens with one tap.'
    },
    {
      id: 'future',
      title: 'FUTURE INTELLIGENCE',
      icon: Satellite,
      color: '#a855f7',
      tag: 'ROADMAP / NEXT-GEN',
      accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      activeRing: 'ring-purple-500/50',
      items: ['Satellite Earth Observation', 'IoT Flood & Seismic Sensors', 'Autonomous Drone Scouting', 'Environmental Telemetry'],
      description: 'Architecture ready for next-generation feeds: early flood alerts, thermal drone reconnaissance, and satellite damage estimation.'
    }
  ];

  // Auto-cycle through ecosystem nodes every 4 seconds unless user interacts
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setSelectedNode((prev) => (prev + 1) % loopNodes.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isAutoCycle, loopNodes.length]);

  // Auto-cycle through the 6 Pillars circular orbit every 4.5 seconds unless user interacts
  useEffect(() => {
    if (!isAutoCyclePillars || pillarViewMode !== 'circle') return;
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoCyclePillars, pillarViewMode]);

  const activeData = loopNodes[selectedNode];

  return (
    <section id="sih-ecosystem" className="relative space-y-24 py-12 text-slate-100">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-blue-600/10 via-teal-500/10 to-emerald-500/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      {/* 1. SECTION IDENTITY */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider backdrop-blur-md shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>AI-POWERED • REAL-TIME • GEO-INTELLIGENT • SCALABLE</span>
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans">
          ONE PLATFORM.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            EVERY EMERGENCY.
          </span>
        </h2>

        {/* Supporting Text */}
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          ResQAI transforms emergency signals into coordinated action — helping detect incidents, understand their severity, locate affected people, prioritize emergencies, coordinate responders, and monitor the response from one unified platform.
        </p>

        {/* Animated Process Line */}
        <div className="pt-2">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs font-mono text-slate-300 shadow-inner">
            {[
              { label: 'DETECT', color: 'text-rose-400' },
              { label: 'UNDERSTAND', color: 'text-cyan-400' },
              { label: 'PRIORITIZE', color: 'text-amber-400' },
              { label: 'LOCATE', color: 'text-blue-400' },
              { label: 'DISPATCH', color: 'text-orange-400' },
              { label: 'COORDINATE', color: 'text-teal-400' },
              { label: 'MONITOR', color: 'text-emerald-400' }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.label}>
                <span className={`font-bold tracking-wider ${step.color}`}>{step.label}</span>
                {idx < arr.length - 1 && (
                  <span className="text-slate-600 font-bold select-none">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUAL — "THE RESQAI RESPONSE LOOP" */}
      <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#070b14] to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header inside visualization card */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>INTERACTIVE ECOSYSTEM ARCHITECTURE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              The ResQAI Response Loop
            </h3>
          </div>

          {/* Interactive Mode Toggle Hint */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              {isAutoCycle ? 'Auto-cycling active' : 'Manual inspection'}
            </span>
            <button
              onClick={() => setIsAutoCycle(!isAutoCycle)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-[11px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
            >
              {isAutoCycle ? 'Pause Rotation' : 'Resume Auto-Flow'}
            </button>
          </div>
        </div>

        {/* Desktop Circular / Orbital Visual View (hidden < lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center py-8">
          
          {/* Left / Center 7 cols: Interactive Circular Diagram */}
          <div className="col-span-7 relative h-[480px] flex items-center justify-center select-none">
            
            {/* SVG Connecting Rings and Animated Beams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Background Concentric Radar Rings */}
              <circle cx="250" cy="250" r="185" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="120" fill="none" stroke="#0f172a" strokeWidth="1" />
              <circle cx="250" cy="250" r="65" fill="none" stroke="url(#orbitGrad)" strokeWidth="1.5" />

              {/* Connecting Beams to the 6 Outer Nodes */}
              {loopNodes.map((node, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = 250 + 185 * Math.cos(angle);
                const y = 250 + 185 * Math.sin(angle);
                const isCurrent = selectedNode === i;

                return (
                  <g key={node.id}>
                    <line
                      x1="250"
                      y1="250"
                      x2={x}
                      y2={y}
                      stroke={isCurrent ? node.color : '#334155'}
                      strokeWidth={isCurrent ? 2.5 : 1}
                      strokeDasharray={isCurrent ? 'none' : '3 3'}
                      opacity={isCurrent ? 1 : 0.4}
                      className="transition-all duration-300"
                    />
                    {isCurrent && (
                      <circle
                        cx={(250 + x) / 2}
                        cy={(250 + y) / 2}
                        r="3"
                        fill={node.color}
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Node: RESQAI AI CORE */}
            <div
              onClick={() => setIsAutoCycle(!isAutoCycle)}
              className="relative z-20 w-32 h-32 rounded-full bg-gradient-to-br from-slate-900 via-[#0a1324] to-slate-950 border-2 border-cyan-400 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_40px_rgba(6,182,212,0.35)] cursor-pointer group"
            >
              <span className="absolute -inset-2 rounded-full border border-cyan-500/30 animate-pulse pointer-events-none" />
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-[11px] font-mono font-black text-white tracking-wider">
                RESQAI
              </div>
              <div className="text-[9px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                AI CORE
              </div>
              <div className="text-[8px] font-mono text-slate-400 mt-0.5">
                DISASTER HUB
              </div>
            </div>

            {/* 6 Orbiting Ecosystem Nodes (60° interval around 185px radius) */}
            {loopNodes.map((node, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const x = 250 + 185 * Math.cos(angle) - 64; // width is 128px / 2 = 64
              const y = 250 + 185 * Math.sin(angle) - 36; // height is 72px / 2 = 36
              const isCurrent = selectedNode === i;
              const NodeIcon = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(i);
                    setIsAutoCycle(false);
                  }}
                  className={`absolute z-30 w-32 rounded-xl border p-2.5 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                    isCurrent
                      ? `bg-slate-900/95 shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-2 ${node.activeRing} scale-110`
                      : 'bg-slate-950/85 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px`, borderColor: isCurrent ? node.color : undefined }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                    style={{ backgroundColor: `${node.color}20`, border: `1px solid ${node.color}40` }}
                  >
                    <NodeIcon className="w-3.5 h-3.5" style={{ color: node.color }} />
                  </div>
                  <span className="text-[11px] font-mono font-black text-white tracking-tight leading-none">
                    {node.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-[110px]">
                    {node.items[0]}
                  </span>
                  {node.id === 'future' && (
                    <span className="text-[8px] font-mono font-bold text-purple-400 uppercase tracking-tight mt-0.5">
                      Roadmap
                    </span>
                  )}
                </div>
              );
            })}

          </div>

          {/* Right 5 cols: Active Node Live Telemetry & Inspector */}
          <div className="col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border ${activeData.accentBg}`}>
                {activeData.tag}
              </span>
              <span className="text-xs font-mono text-slate-500">
                ECOSYSTEM NODE 0{selectedNode + 1} / 06
              </span>
            </div>

            <div>
              <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <activeData.icon className="w-5 h-5" style={{ color: activeData.color }} />
                <span>{activeData.title}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                {activeData.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Integrated Data Streams:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activeData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs font-mono px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: activeData.color }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Node Navigation Tabs */}
            <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-800/80">
              {loopNodes.map((n, idx) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setSelectedNode(idx);
                    setIsAutoCycle(false);
                  }}
                  className={`h-2 flex-1 rounded-full transition-all duration-200 ${
                    selectedNode === idx ? 'bg-cyan-400' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={n.title}
                />
              ))}
            </div>

          </div>

        </div>

        {/* Mobile & Tablet Structured Ecosystem Flow (< lg) */}
        <div className="lg:hidden space-y-4 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {loopNodes.map((node, idx) => {
              const isCurrent = selectedNode === idx;
              const NodeIcon = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(idx)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                    isCurrent
                      ? 'border-cyan-400 bg-slate-900 shadow-md ring-1 ring-cyan-400'
                      : 'border-slate-800 bg-slate-950/70 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <NodeIcon className="w-4 h-4" style={{ color: node.color }} />
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white tracking-tight">
                    {node.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
                    {node.items[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Detail Card for Mobile */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${activeData.accentBg}`}>
                {activeData.tag}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Node {selectedNode + 1} of 6</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <activeData.icon className="w-4 h-4" style={{ color: activeData.color }} />
              <span>{activeData.title}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {activeData.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeData.items.map((item, idx) => (
                <div key={idx} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. 6 PILLARS OF EMERGENCY RESPONSE INTELLIGENCE (ARRANGED IN A CIRCLE) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PROVEN RESQAI CAPABILITIES • 360° RADIAL ARCHITECTURE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              6 Pillars of Emergency Response Intelligence
            </h3>
          </div>

          {/* View Switcher & Rotation Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-900/90 border border-slate-800 p-1 text-xs font-mono">
              <button
                onClick={() => setPillarViewMode('circle')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  pillarViewMode === 'circle'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Circle Orbit</span>
              </button>
              <button
                onClick={() => setPillarViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  pillarViewMode === 'grid'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>

            {pillarViewMode === 'circle' && (
              <button
                onClick={() => setIsAutoCyclePillars(!isAutoCyclePillars)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer"
                title="Toggle circular auto-rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoCyclePillars ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} style={{ animationDuration: '6s' }} />
                <span>{isAutoCyclePillars ? 'Auto' : 'Paused'}</span>
              </button>
            )}
          </div>
        </div>

        {/* VIEW MODE 1: CIRCULAR ORBIT (ARRANGED IN A CIRCLE) */}
        {pillarViewMode === 'circle' ? (
          <div className="space-y-6">
            
            {/* DESKTOP 6-PILLAR CIRCULAR ORBIT (hidden < lg) */}
            <div className="hidden lg:flex relative w-full max-w-5xl mx-auto h-[660px] items-center justify-center select-none overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/70 via-[#070b14] to-slate-950/90 shadow-2xl p-4">
              
              {/* Central Ambient Glow */}
              <div
                className="absolute w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
                style={{
                  backgroundColor: [
                    '#f43f5e',
                    '#06b6d4',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6',
                    '#a855f7'
                  ][activePillar]
                }}
              />

              {/* Circular SVG Orbit Track and Connecting Beams */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 660">
                <defs>
                  <linearGradient id="orbitCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Concentric Orbit Rings */}
                <circle cx="350" cy="330" r="260" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="350" cy="330" r="195" fill="none" stroke="#0f172a" strokeWidth="1" />
                <circle cx="350" cy="330" r="100" fill="none" stroke="url(#orbitCircleGrad)" strokeWidth="1" opacity="0.3" />

                {/* 6 Radial Connector Beams to Perimeter Nodes */}
                {[
                  { color: '#f43f5e' },
                  { color: '#06b6d4' },
                  { color: '#f59e0b' },
                  { color: '#10b981' },
                  { color: '#3b82f6' },
                  { color: '#a855f7' }
                ].map((pillar, i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x = 350 + 260 * Math.cos(angle);
                  const y = 330 + 260 * Math.sin(angle);
                  const isCurrent = activePillar === i;

                  return (
                    <g key={i}>
                      <line
                        x1="350"
                        y1="330"
                        x2={x}
                        y2={y}
                        stroke={isCurrent ? pillar.color : '#334155'}
                        strokeWidth={isCurrent ? 2.5 : 1}
                        strokeDasharray={isCurrent ? 'none' : '3 3'}
                        opacity={isCurrent ? 0.9 : 0.25}
                        className="transition-all duration-300"
                      />
                      {isCurrent && (
                        <circle
                          cx={(350 + x) / 2}
                          cy={(330 + y) / 2}
                          r="3"
                          fill={pillar.color}
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* 6 Orbiting Pillar Nodes arranged circularly at 60° intervals */}
              {[
                {
                  id: 'ai',
                  num: '01',
                  name: 'AI EMERGENCY INTELLIGENCE',
                  shortName: 'AI INTELLIGENCE',
                  color: '#f43f5e',
                  activeRing: 'ring-rose-500/60',
                  icon: Cpu,
                  pos: 'top-3 left-1/2 -translate-x-1/2' // 0: Top (12 o'clock)
                },
                {
                  id: 'map',
                  num: '02',
                  name: 'DYNAMIC DISASTER MAP',
                  shortName: 'DISASTER MAP',
                  color: '#06b6d4',
                  activeRing: 'ring-cyan-500/60',
                  icon: MapPin,
                  pos: 'top-[18%] right-4 xl:right-10' // 1: Top-Right (2 o'clock)
                },
                {
                  id: 'priority',
                  num: '03',
                  name: 'INTELLIGENT PRIORITY',
                  shortName: 'INTELLIGENT PRIORITY',
                  color: '#f59e0b',
                  activeRing: 'ring-amber-500/60',
                  icon: Layers,
                  pos: 'bottom-[18%] right-4 xl:right-10' // 2: Bottom-Right (4 o'clock)
                },
                {
                  id: 'dispatch',
                  num: '04',
                  name: 'SMART RESPONDER DISPATCH',
                  shortName: 'SMART DISPATCH',
                  color: '#10b981',
                  activeRing: 'ring-emerald-500/60',
                  icon: Truck,
                  pos: 'bottom-3 left-1/2 -translate-x-1/2' // 3: Bottom (6 o'clock)
                },
                {
                  id: 'eoc',
                  num: '05',
                  name: 'EOC COMMAND DASHBOARD',
                  shortName: 'EOC DASHBOARD',
                  color: '#3b82f6',
                  activeRing: 'ring-blue-500/60',
                  icon: Building,
                  pos: 'bottom-[18%] left-4 xl:left-10' // 4: Bottom-Left (8 o'clock)
                },
                {
                  id: 'future',
                  num: '06',
                  name: 'FUTURE-PROOF ARCHITECTURE',
                  shortName: 'FUTURE ROADMAP',
                  color: '#a855f7',
                  activeRing: 'ring-purple-500/60',
                  icon: Satellite,
                  pos: 'top-[18%] left-4 xl:left-10' // 5: Top-Left (10 o'clock)
                }
              ].map((pillar, i) => {
                const isCurrent = activePillar === i;
                const Icon = pillar.icon;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      setActivePillar(i);
                      setIsAutoCyclePillars(false);
                    }}
                    className={`absolute z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                      isCurrent
                        ? `bg-slate-900/95 shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-2 ${pillar.activeRing} scale-110 -translate-y-0.5`
                        : 'bg-slate-950/85 border-slate-800/90 hover:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                    } ${pillar.pos}`}
                    style={{ borderColor: isCurrent ? pillar.color : undefined }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0"
                      style={{
                        backgroundColor: `${pillar.color}20`,
                        border: `1px solid ${pillar.color}50`
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: pillar.color }} />
                    </div>

                    <div className="text-left font-mono">
                      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                        <span
                          className="px-1 py-0.2 rounded text-[9px] font-bold"
                          style={{
                            backgroundColor: isCurrent ? `${pillar.color}30` : '#1e293b',
                            color: isCurrent ? pillar.color : '#94a3b8'
                          }}
                        >
                          {pillar.num}
                        </span>
                        <span className="truncate max-w-[130px] text-white font-black text-xs">
                          {pillar.shortName}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span
                        className="w-2 h-2 rounded-full animate-ping ml-1 shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Center Inspection Cockpit (Inside the Circle) */}
              <div
                className="relative z-20 w-[440px] max-w-[85%] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl bg-slate-900/95 flex flex-col justify-between space-y-3.5 transition-all duration-300"
                style={{
                  borderColor: [
                    '#f43f5e',
                    '#06b6d4',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6',
                    '#a855f7'
                  ][activePillar] + '80'
                }}
              >
                {/* Header with Pillar number & navigation */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider"
                    style={{
                      backgroundColor: [
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar] + '20',
                      color: [
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar],
                      border: `1px solid ${[
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar]}40`
                    }}
                  >
                    {[
                      '01 • AI EMERGENCY INTELLIGENCE',
                      '02 • DYNAMIC DISASTER MAP',
                      '03 • INTELLIGENT PRIORITY',
                      '04 • SMART RESPONDER DISPATCH',
                      '05 • EOC COMMAND DASHBOARD',
                      '06 • FUTURE-PROOF ARCHITECTURE'
                    ][activePillar]}
                  </span>

                  {/* Navigation controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setActivePillar((prev) => (prev === 0 ? 5 : prev - 1));
                        setIsAutoCyclePillars(false);
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
                      title="Previous Pillar"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 px-1">
                      {activePillar + 1}/6
                    </span>
                    <button
                      onClick={() => {
                        setActivePillar((prev) => (prev + 1) % 6);
                        setIsAutoCyclePillars(false);
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
                      title="Next Pillar"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Headline */}
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {[
                    'Turn raw emergency reports into actionable intelligence.',
                    'See the entire emergency situation, not just a single report.',
                    'When multiple emergencies happen, ResQAI helps identify what needs attention first.',
                    'Connect incidents with nearby available responders.',
                    'One shared operational picture for coordinated response.',
                    "Built today. Designed to integrate tomorrow's disaster intelligence."
                  ][activePillar]}
                </h4>

                {/* Visual Mini-Widget */}
                <div>
                  {activePillar === 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-2">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>Photo / Voice / SOS</span>
                        <span className="text-cyan-400 font-bold">➔ AI Engine ➔</span>
                      </div>
                      <div className="text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
                        <span>COLLAPSE + STRUCTURAL</span>
                        <span>TIER 1 (99.4%)</span>
                      </div>
                    </div>
                  )}

                  {activePillar === 1 && (
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono relative overflow-hidden space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        <span>GIS TELEMETRY FEED</span>
                        <span className="text-emerald-400 font-bold">● LIVE HUD</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                        <span className="flex items-center gap-1 text-rose-400">🔥 04 Active Fires</span>
                        <span className="flex items-center gap-1 text-emerald-400">🚑 12 Ambulances</span>
                        <span className="flex items-center gap-1 text-amber-400">🚒 08 Fire Engines</span>
                        <span className="flex items-center gap-1 text-blue-400">🚓 24 Police Units</span>
                        <span className="flex items-center gap-1 text-teal-300">🏥 06 Trauma Centers</span>
                        <span className="flex items-center gap-1 text-purple-400">🏠 14 Relief Shelters</span>
                      </div>
                      <div className="text-[9px] text-amber-400/90 pt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>⚠️ Risk Zones & Inundation Roads Active</span>
                      </div>
                    </div>
                  )}

                  {activePillar === 2 && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-[11px] font-mono space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">INCIDENT #RQ-1042</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            PRIORITY: CRITICAL
                          </span>
                        </div>
                        <div className="text-slate-300 text-[10px] space-y-0.5">
                          <div>🔥 Building Fire (Upper Floors) • 18 Trapped</div>
                          <div>📍 1.2 km from Fire Station #04 • Urgent EMS</div>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-center">
                        <span className="text-slate-400 block">DECISION FORMULA:</span>
                        <span className="text-amber-300 font-semibold leading-tight block">
                          Severity + People at Risk + Location + Resources + Time
                        </span>
                      </div>
                    </div>
                  )}

                  {activePillar === 3 && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono space-y-1">
                        <div className="flex items-center justify-between text-rose-400 font-bold">
                          <span>🚨 INCIDENT #CL-882</span>
                          <span className="text-emerald-400">AUTO-DISPATCH</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-300 bg-slate-900 p-1.5 rounded border border-slate-800">
                          <span>🚒 FIRE UNIT F-12</span>
                          <span>2.4 km • Available</span>
                        </div>
                        <div className="text-emerald-400 font-bold text-center text-[10px]">
                          DYNAMIC DETOUR ROUTE SYNCED
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                        <span className="text-slate-400">REPORTED</span>
                        <span>➔</span>
                        <span className="text-cyan-400">VERIFIED</span>
                        <span>➔</span>
                        <span className="text-amber-400">DISPATCHED</span>
                        <span>➔</span>
                        <span className="text-emerald-400 font-bold">RESOLVED</span>
                      </div>
                    </div>
                  )}

                  {activePillar === 4 && (
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-blue-500/40 text-[11px] font-mono space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <span className="font-bold text-white">12 ACTIVE INCIDENTS</span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          OPERATIONAL
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                        <div className="bg-rose-950/60 border border-rose-700/50 p-1 rounded text-rose-300">🔴 Critical — 03</div>
                        <div className="bg-amber-950/60 border border-amber-700/50 p-1 rounded text-amber-300">🟠 High — 04</div>
                        <div className="bg-blue-950/60 border border-blue-700/50 p-1 rounded text-blue-300">🟡 Mod — 05</div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span className="text-slate-400 font-bold">DEPLOYED:</span>
                        <span className="space-x-1.5">
                          <span>🚓 24 Police</span>
                          <span>🚑 12 EMS</span>
                          <span>🚒 08 Fire</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {activePillar === 5 && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono space-y-1.5">
                      <div>
                        <div className="text-emerald-400 font-bold flex items-center justify-between">
                          <span>NOW • LIVE PROTOTYPE</span>
                          <span className="text-[9px] text-emerald-400 font-bold">PRODUCTION</span>
                        </div>
                        <div className="text-slate-300 text-[9px]">
                          Citizen SOS • AI Analysis • GIS Map • EOC • Dispatch
                        </div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-bold flex items-center justify-between">
                          <span>NEXT • EXTENSION API</span>
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">ROADMAP</span>
                        </div>
                        <div className="text-slate-400 text-[9px]">
                          Satellite Intelligence • IoT Sensors • Drones • Predictive Risk
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Capability Bullets */}
                <ul className="space-y-1 text-xs text-slate-300 font-normal">
                  {[
                    [
                      'AI-assisted incident classification',
                      'Zero-delay visual image & hazard analysis',
                      'Regional voice reporting transcription',
                      'Deterministic victim severity assessment'
                    ],
                    [
                      'Feels like a real command room with spatial layers',
                      'Combines incidents, active fleet positions & road detours',
                      'Hospital trauma bed capacity synchronization',
                      'Palantir-style situational map for EOC commanders'
                    ],
                    [
                      'Dynamic algorithmic threat prioritization',
                      'Calculates casualties, structural compromise & transit time',
                      'Escalates critical incidents to head of national queue',
                      'Assists human dispatchers with explainable AI evidence'
                    ],
                    [
                      'One-tap dispatch handshakes to nearest equipped teams',
                      'Real-time detour routes avoiding flooded roads',
                      'Smart city green traffic signal preemption',
                      'Eliminates verbal radio delays and misheard addresses'
                    ],
                    [
                      'Military/government-grade command interface',
                      'Replaces siloed walkie-talkies with shared operational visibility',
                      'Joint coordination between Police, NDRF, SDRF, and Hospitals',
                      'Designed for state disaster authorities and municipal commissioners'
                    ],
                    [
                      'Production prototype verified with full live workflow',
                      'Modular API endpoints ready for ISRO, IMD and IoT sensors',
                      'Seamless national grid expansion capability',
                      'Clearly delineated roadmap separating live from planned'
                    ]
                  ][activePillar].map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{
                          color: [
                            '#f43f5e',
                            '#06b6d4',
                            '#f59e0b',
                            '#10b981',
                            '#3b82f6',
                            '#a855f7'
                          ][activePillar]
                        }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Impact Statement Footer */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="truncate">
                    {[
                      'Reduces triage lag from minutes to under 42 seconds.',
                      'Palantir-style situational map for EOC commanders.',
                      'Decision-support mechanism to assist professionals.',
                      'Eliminates verbal call delays with instant dispatch contracts.',
                      'Designed for state disaster authorities and commissioners.',
                      'Modular architecture ready for ISRO, IMD, and sensor hooks.'
                    ][activePillar]}
                  </span>
                  <span
                    className="font-bold text-[10px] shrink-0 uppercase tracking-tight"
                    style={{
                      color: [
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar]
                    }}
                  >
                    VERIFIED
                  </span>
                </div>

              </div>

            </div>

            {/* MOBILE & TABLET CIRCULAR ROTARY VIEW (< lg) */}
            <div className="lg:hidden space-y-4">
              {/* Circular Node Selectors */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { num: '01', name: 'AI', color: '#f43f5e', icon: Cpu },
                  { num: '02', name: 'GIS MAP', color: '#06b6d4', icon: MapPin },
                  { num: '03', name: 'PRIORITY', color: '#f59e0b', icon: Layers },
                  { num: '04', name: 'DISPATCH', color: '#10b981', icon: Truck },
                  { num: '05', name: 'EOC', color: '#3b82f6', icon: Building },
                  { num: '06', name: 'ROADMAP', color: '#a855f7', icon: Satellite }
                ].map((p, idx) => {
                  const isCurrent = activePillar === idx;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.num}
                      onClick={() => setActivePillar(idx)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border min-w-[65px] transition cursor-pointer ${
                        isCurrent
                          ? `bg-slate-900 border-cyan-400 shadow-md ring-1 ring-cyan-400`
                          : 'bg-slate-950/70 border-slate-800 opacity-70'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${p.color}20` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-white">
                        {p.num}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Card for Mobile */}
              <div
                className="rounded-2xl border p-4 bg-slate-900/90 space-y-3 shadow-xl"
                style={{
                  borderColor: [
                    '#f43f5e',
                    '#06b6d4',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6',
                    '#a855f7'
                  ][activePillar] + '60'
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: [
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar] + '20',
                      color: [
                        '#f43f5e',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#a855f7'
                      ][activePillar]
                    }}
                  >
                    {[
                      '01 • AI EMERGENCY INTELLIGENCE',
                      '02 • DYNAMIC DISASTER MAP',
                      '03 • INTELLIGENT PRIORITY',
                      '04 • SMART RESPONDER DISPATCH',
                      '05 • EOC COMMAND DASHBOARD',
                      '06 • FUTURE-PROOF ARCHITECTURE'
                    ][activePillar]}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Pillar {activePillar + 1} of 6</span>
                </div>

                <h4 className="text-base font-bold text-white">
                  {[
                    'Turn raw emergency reports into actionable intelligence.',
                    'See the entire emergency situation, not just a single report.',
                    'When multiple emergencies happen, ResQAI helps identify what needs attention first.',
                    'Connect incidents with nearby available responders.',
                    'One shared operational picture for coordinated response.',
                    "Built today. Designed to integrate tomorrow's disaster intelligence."
                  ][activePillar]}
                </h4>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {[
                    [
                      'AI-assisted incident classification',
                      'Zero-delay visual image & hazard analysis',
                      'Regional voice reporting transcription',
                      'Deterministic victim severity assessment'
                    ],
                    [
                      'Feels like a real command room with spatial layers',
                      'Combines incidents, active fleet positions & road detours',
                      'Hospital trauma bed capacity synchronization',
                      'Palantir-style situational map for EOC commanders'
                    ],
                    [
                      'Dynamic algorithmic threat prioritization',
                      'Calculates casualties, structural compromise & transit time',
                      'Escalates critical incidents to head of national queue',
                      'Assists human dispatchers with explainable AI evidence'
                    ],
                    [
                      'One-tap dispatch handshakes to nearest equipped teams',
                      'Real-time detour routes avoiding flooded roads',
                      'Smart city green traffic signal preemption',
                      'Eliminates verbal radio delays and misheard addresses'
                    ],
                    [
                      'Military/government-grade command interface',
                      'Replaces siloed walkie-talkies with shared operational visibility',
                      'Joint coordination between Police, NDRF, SDRF, and Hospitals',
                      'Designed for state disaster authorities and municipal commissioners'
                    ],
                    [
                      'Production prototype verified with full live workflow',
                      'Modular API endpoints ready for ISRO, IMD and IoT sensors',
                      'Seamless national grid expansion capability',
                      'Clearly delineated roadmap separating live from planned'
                    ]
                  ][activePillar].map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{
                          color: [
                            '#f43f5e',
                            '#06b6d4',
                            '#f59e0b',
                            '#10b981',
                            '#3b82f6',
                            '#a855f7'
                          ][activePillar]
                        }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  {[
                    'Reduces triage lag from minutes to under 42 seconds.',
                    'Palantir-style situational map for EOC commanders.',
                    'Decision-support mechanism to assist professionals.',
                    'Eliminates verbal call delays with instant dispatch contracts.',
                    'Designed for state disaster authorities and commissioners.',
                    'Modular architecture ready for ISRO, IMD, and sensor hooks.'
                  ][activePillar]}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* VIEW MODE 2: 6-CARD GRID (Alternative View) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                name: '01 • AI EMERGENCY INTELLIGENCE',
                color: '#f43f5e',
                icon: Cpu,
                headline: 'Turn raw emergency reports into actionable intelligence.',
                bullets: [
                  'AI-assisted incident classification',
                  'Zero-delay visual image & hazard analysis',
                  'Regional voice reporting transcription',
                  'Deterministic victim severity assessment'
                ],
                footer: 'Reduces triage lag from minutes to under 42 seconds.'
              },
              {
                num: '02',
                name: '02 • DYNAMIC DISASTER MAP',
                color: '#06b6d4',
                icon: MapPin,
                headline: 'See the entire emergency situation, not just a single report.',
                bullets: [
                  'Spatial layers combining incidents and fleets',
                  'Live road detours and flood hazard zones',
                  'Hospital trauma bed capacity sync',
                  'EOC commander common operating picture'
                ],
                footer: 'Palantir-style situational map for EOC commanders.'
              },
              {
                num: '03',
                name: '03 • INTELLIGENT PRIORITY',
                color: '#f59e0b',
                icon: Layers,
                headline: 'When multiple emergencies happen, ResQAI helps identify what needs attention first.',
                bullets: [
                  'Dynamic algorithmic threat prioritization',
                  'Calculates casualties, structural compromise & transit time',
                  'Escalates critical incidents to head of national queue',
                  'Assists human dispatchers with explainable AI evidence'
                ],
                footer: 'Decision-support mechanism to assist professionals.'
              },
              {
                num: '04',
                name: '04 • SMART RESPONDER DISPATCH',
                color: '#10b981',
                icon: Truck,
                headline: 'Connect incidents with nearby available responders.',
                bullets: [
                  'One-tap dispatch handshakes to nearest equipped teams',
                  'Real-time detour routes avoiding flooded roads',
                  'Smart city green traffic signal preemption',
                  'Eliminates verbal radio delays and misheard addresses'
                ],
                footer: 'Eliminates verbal call delays with instant dispatch contracts.'
              },
              {
                num: '05',
                name: '05 • EOC COMMAND DASHBOARD',
                color: '#3b82f6',
                icon: Building,
                headline: 'One shared operational picture for coordinated response.',
                bullets: [
                  'Military/government-grade command interface',
                  'Replaces siloed walkie-talkies with shared visibility',
                  'Joint coordination between Police, NDRF, and Hospitals',
                  'Designed for state disaster authorities and commissioners'
                ],
                footer: 'Designed for state disaster authorities and municipal commissioners.'
              },
              {
                num: '06',
                name: '06 • FUTURE-PROOF ARCHITECTURE',
                color: '#a855f7',
                icon: Satellite,
                headline: "Built today. Designed to integrate tomorrow's disaster intelligence.",
                bullets: [
                  'Production prototype verified with full live workflow',
                  'Modular API endpoints ready for ISRO, IMD and sensors',
                  'Seamless national grid expansion capability',
                  'Clearly delineated roadmap separating live from planned'
                ],
                footer: 'Modular architecture ready for ISRO, IMD, and municipal sensor hookups.'
              }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="rounded-2xl border bg-gradient-to-b from-slate-900/90 via-[#070b14] to-slate-950 p-5 space-y-4 flex flex-col justify-between hover:scale-[1.01] transition shadow-lg"
                  style={{ borderColor: `${p.color}40` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: p.color }}>
                        {p.name}
                      </span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}40` }}>
                        <Icon className="w-4 h-4" style={{ color: p.color }} />
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">
                      {p.headline}
                    </h4>

                    <ul className="space-y-1.5 text-xs text-slate-300 font-normal">
                      {p.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: p.color }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    {p.footer}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SPECIAL MICRO-SECTION — "WHEN EVERY SECOND MATTERS" (Horizontal Animated Timeline) */}
      <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-r from-slate-950 via-[#0a1020] to-slate-950 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>WHEN EVERY SECOND MATTERS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              From Signal to Response: 10-Second Coordination Loop
            </h3>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO SIMULATION DATA</span>
            </div>
            <span className="text-[10.5px] font-mono text-slate-400 italic">
              * Illustrative response flow • Prototype demonstration (Simulated information, not live emergency data)
            </span>
          </div>
        </div>

        {/* Prominent Demo Clarification Banner */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs font-mono text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              PROTOTYPE DEMONSTRATION
            </span>
            <span className="text-slate-300 text-[11px]">
              This 10-second sequence is an illustrative walkthrough demonstrating system coordination logic, not actual live emergency telemetry.
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold shrink-0">
            DEMO SCENARIO • NOT LIVE DISPATCH
          </span>
        </div>

        {/* Horizontal Timeline Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { time: '00:00', label: 'Emergency Report', icon: Siren, sub: 'Citizen SOS / Voice', color: 'border-rose-500/40 text-rose-400' },
            { time: '00:02', label: 'Location Captured', icon: MapPin, sub: 'GPS Trilateration ±1.8m', color: 'border-cyan-500/40 text-cyan-400' },
            { time: '00:04', label: 'AI Classification', icon: Cpu, sub: 'Threat & Duplicate Check', color: 'border-purple-500/40 text-purple-400' },
            { time: '00:06', label: 'Priority Assessment', icon: Layers, sub: 'Decision Score: Critical', color: 'border-amber-500/40 text-amber-400' },
            { time: '00:08', label: 'Resources Identified', icon: Compass, sub: 'Battalion F-12 Locked', color: 'border-blue-500/40 text-blue-400' },
            { time: '00:10', label: 'Responder Assigned', icon: CheckCircle2, sub: 'Route Guidance Live', color: 'border-emerald-500/40 text-emerald-400' }
          ].map((t, idx) => {
            const TIcon = t.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${t.color} bg-slate-900/70 flex flex-col justify-between space-y-3 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {t.time}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-amber-400/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/50">
                    DEMO
                  </span>
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white tracking-tight">
                    {t.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 leading-tight">
                    {t.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SIMULATED RESULT: WORKFLOW IN PROGRESS WITH COMPLETE SITUATIONAL CONTEXT</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            * Illustrative benchmark demonstration • No forms • Zero lost seconds
          </span>
        </div>
      </div>

      {/* 5. OFFLINE / LOW-CONNECTIVITY ADVANTAGE */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-[#101726] to-amber-950/20 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>OFFLINE & LOW-CONNECTIVITY RESILIENCE</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              When connectivity drops, emergency response shouldn't stop.
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shrink-0">
            Architectural Design Capability
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          In severe floods or earthquakes, cellular towers frequently lose backhaul connectivity. ResQAI is architected with a local queuing bridge that guarantees distress beacons are preserved and relayed.
        </p>

        {/* Offline Architecture Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-center text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Radio className="w-4 h-4 text-rose-400 mx-auto mb-1.5" />
            <span className="text-white font-bold block">📱 User Device</span>
            <span className="text-[10px] text-slate-400">Trigger SOS</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Database className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
            <span className="text-white font-bold block">Local Data Store</span>
            <span className="text-[10px] text-slate-400">Cached in device SQLite</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Compass className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
            <span className="text-white font-bold block">GPS Coordinates</span>
            <span className="text-[10px] text-slate-400">Independent of cellular data</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
            <span className="text-white font-bold block">Queued Request</span>
            <span className="text-[10px] text-slate-400">Continuous retry loop</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <span className="text-emerald-400 font-bold block">Sync to EOC</span>
            <span className="text-[10px] text-slate-400">Auto-flushes on link restore</span>
          </div>
        </div>
      </div>

      {/* 6. DIFFERENTIATION STATEMENT (Visual High-Contrast Paradigm Shift) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            THE ARCHITECTURAL PARADIGM SHIFT
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            From Emergency Reporting To Emergency Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Why ResQAI fundamentally differs from legacy 112 phone systems and static SOS reporting portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TRADITIONAL FLOW (Left) */}
          <div className="rounded-2xl border border-rose-950 bg-slate-950/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                TRADITIONAL FLOW
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                FRAGMENTED
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-mono font-black text-slate-400 tracking-wider">
                <span>REPORT</span>
                <span className="text-slate-600">➔</span>
                <span>WAIT</span>
                <span className="text-slate-600">➔</span>
                <span>MANUAL COORDINATION</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
              <li className="flex items-center gap-2">
                <span className="text-rose-500">✕</span>
                <span>Citizen must manually describe address & road landmarks</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-500">✕</span>
                <span>100+ callers for same fire causes call-center gridlock</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-500">✕</span>
                <span>Dispatchers manually phone ambulances over walkie-talkie</span>
              </li>
            </ul>
          </div>

          {/* RESQAI FLOW (Right - Glowing High Impact) */}
          <div className="rounded-2xl border border-cyan-400/80 bg-gradient-to-b from-cyan-950/30 via-slate-900/90 to-slate-950 p-6 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                RESQAI FLOW
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                UNIFIED LOOP
              </span>
            </div>

            <div className="py-4 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-mono font-black text-cyan-300 tracking-wider leading-relaxed">
                <span className="text-rose-400">DETECT</span>
                <span className="text-slate-600">➔</span>
                <span className="text-cyan-400">UNDERSTAND</span>
                <span className="text-slate-600">➔</span>
                <span className="text-amber-400">PRIORITIZE</span>
                <span className="text-slate-600">➔</span>
                <span className="text-blue-400">LOCATE</span>
                <span className="text-slate-600">➔</span>
                <span className="text-emerald-400">DISPATCH</span>
                <span className="text-slate-600">➔</span>
                <span className="text-teal-300">COORDINATE</span>
                <span className="text-slate-600">➔</span>
                <span className="text-purple-400">MONITOR</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs font-mono text-slate-200 pt-2 border-t border-cyan-900/40">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>One-tap zero-form ingestion with GPS trilateration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AI deduplication clusters simultaneous reports instantly</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Explainable auto-dispatch syncs live route to driver HUD</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 7. IMPACT GRID (SIH Evaluation Matrix) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            SIH EVALUATION MATRIX
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Challenge vs. ResQAI Approach
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Direct comparison demonstrating concrete technical feasibility across national disaster challenges.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-1/2">DISASTER CHALLENGE</th>
                <th className="py-3 px-4 w-1/2 text-cyan-400">RESQAI APPROACH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { challenge: 'Fragmented information across departments', approach: 'Unified emergency platform with single source of truth' },
                { challenge: 'Delayed understanding of incident severity', approach: 'AI-assisted classification via computer vision and NLP' },
                { challenge: 'Manual prioritization prone to bottlenecks', approach: 'Dynamic priority engine based on risk & resource fit' },
                { challenge: 'Difficult multi-agency resource coordination', approach: 'Explainable smart responder dispatch with ETA calculation' },
                { challenge: 'Limited situational awareness on the ground', approach: 'GIS-based operational map with flood & road obstacle layers' },
                { challenge: 'Multiple response agencies operating in silos', approach: 'Shared EOC tactical view across NDRF, Police & Health' },
                { challenge: 'Network disruption in disaster ground zero', approach: 'Low-connectivity architecture with local GPS queuing' },
                { challenge: 'Future disaster intelligence integration', approach: 'Modular API designed for satellite & sensor integration' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-4 text-slate-300 font-normal">
                    <span className="text-rose-400/80 mr-2 font-bold">•</span>
                    {row.challenge}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">
                    <span className="text-emerald-400 mr-2">✓</span>
                    {row.approach}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. FINAL STATEMENT & CTAs */}
      <div className="text-center space-y-6 py-10 border-t border-slate-800/80">
        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
          BUILT FOR THE SMART INDIA HACKATHON
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto font-sans leading-tight">
          ONE EMERGENCY. <br />
          ONE SHARED PICTURE. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            ONE COORDINATED RESPONSE.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          ResQAI brings citizens, artificial intelligence, geospatial intelligence, emergency responders and command centers together to help make disaster response faster, more informed and more coordinated.
        </p>

        {/* Primary Evaluator Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('COMMAND')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-sm tracking-wider rounded-xl shadow-xl shadow-cyan-950/50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building className="w-4 h-4 text-slate-950" />
            <span>EXPLORE LIVE DEMO</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('pipeline-section') || document.getElementById('sih-ecosystem');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm tracking-wider rounded-xl border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>VIEW RESPONSE FLOW</span>
          </button>
        </div>
      </div>

    </section>
  );
};

export default SIHEcosystemSection;
