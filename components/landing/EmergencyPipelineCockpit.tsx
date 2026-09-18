'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Siren,
  Cpu,
  MapPin,
  Layers,
  Truck,
  ShieldAlert,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  Zap,
  Satellite,
  Volume2,
  Radio,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Building,
  HeartPulse
} from 'lucide-react';

export interface PipelineStage {
  step: string;
  name: string;
  shortName: string;
  category: string;
  title: string;
  headline: string;
  desc: string;
  accentColor: string;
  lineColor: string;
  threshold: number;
  icon: React.ElementType;
  specs: {
    label: string;
    value: string;
    sub: string;
  }[];
  telemetryLogs: {
    time: string;
    msg: string;
    status: 'ok' | 'warn' | 'crit' | 'info';
  }[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: '01',
    name: 'CITIZEN SOS',
    shortName: 'SOS',
    category: 'INGESTION LAYER',
    title: 'Distress Beacon Broadcast & Mesh Ingestion',
    headline: 'Instant 1-Tap Mobile SOS & Low-Bandwidth Acoustic Signal',
    desc: 'Citizens trigger an emergency distress beacon via 1-tap mobile SOS or offline mesh relay. Natural language voice audio is captured with zero signup friction, even under extreme cellular network congestion.',
    accentColor: '#f43f5e',
    lineColor: '#f43f5e',
    threshold: 0,
    icon: Siren,
    specs: [
      { label: 'Broadcast Latency', value: '< 240ms', sub: 'Instant Ingestion' },
      { label: 'Transmission Mode', value: 'Cellular + LoRa', sub: 'Mesh Auto-Fallback' },
      { label: 'Onboarding Barrier', value: 'Zero Friction', sub: 'No Sign-up Needed' }
    ],
    telemetryLogs: [
      { time: '00:00.180', msg: 'SOS Distress Beacon received from Node #IN-HYD-8492', status: 'crit' },
      { time: '00:00.210', msg: 'Carrier SNR: -62dBm | Triangulation ping acknowledged', status: 'ok' },
      { time: '00:00.240', msg: 'Audio channel open: 8.4s voice distress packet attached', status: 'info' }
    ]
  },
  {
    step: '02',
    name: 'AI VETTING',
    shortName: 'VETTING',
    category: 'NEURAL PERCEPTION',
    title: 'Multimodal AI Scene Vetting & Hazard Triage',
    headline: 'Computer Vision & Acoustic Distress Verification',
    desc: "Gemini 1.5 multimodal neural vision models analyze uploaded citizen photos, live surveillance streams, and acoustic distress signals in real time to calculate structural collapse severity, water depth, and filter out false alarms.",
    accentColor: '#06b6d4',
    lineColor: '#a855f7',
    threshold: 16,
    icon: Cpu,
    specs: [
      { label: 'Classification Confidence', value: '99.4%', sub: 'Verified True Alarm' },
      { label: 'Inference Turnaround', value: '420ms', sub: 'Gemini Multimodal' },
      { label: 'Hallucination Guardrail', value: 'Active', sub: 'Zero False Dispatches' }
    ],
    telemetryLogs: [
      { time: '00:00.680', msg: 'Inference model loaded: Gemini-1.5-Vision-Emergency-v2', status: 'info' },
      { time: '00:00.820', msg: 'Bounding boxes: StructuralDamage(99.4%), TrappedVictims(3)', status: 'crit' },
      { time: '00:00.920', msg: 'False-positive filter passed: Threat classification = CRITICAL', status: 'ok' }
    ]
  },
  {
    step: '03',
    name: 'LOCATION LOCK',
    shortName: 'GIS LOCK',
    category: 'GEOSPATIAL INTELLIGENCE',
    title: 'Precision Geospatial Trilateration & Floor Mapping',
    headline: 'Dual-Band GNSS, NavIC & Multi-Constellation Satellite Lock',
    desc: 'Combines ISRO NavIC, multi-frequency GPS, cell-tower trilateration, and 3D elevation digital terrain models to pinpoint victims within sub-2-meter accuracy, even inside multi-story collapsed buildings.',
    accentColor: '#f59e0b',
    lineColor: '#f59e0b',
    threshold: 33,
    icon: MapPin,
    specs: [
      { label: 'Spatial Radial Accuracy', value: '±1.8m', sub: 'RTK Differential' },
      { label: 'Satellite Constellation', value: '15 Sats', sub: 'NavIC (ISRO) + GPS L5' },
      { label: 'Elevation & Floor', value: 'Level -1', sub: '512m MSL Computed' }
    ],
    telemetryLogs: [
      { time: '00:01.120', msg: 'Locked 15 satellites (8 ISRO NavIC + 7 GPS L5 dual-band)', status: 'ok' },
      { time: '00:01.250', msg: 'RTK differential corrections applied: Radial delta ±1.8m', status: 'ok' },
      { time: '00:01.340', msg: 'GIS Layer Match: Musi River Inundation Polygon #FL-402', status: 'warn' }
    ]
  },
  {
    step: '04',
    name: 'PRIORITY QUEUE',
    shortName: 'TRIAGE',
    category: 'PRIORITY ENGINE',
    title: 'Dynamic Multi-Factor Algorithmic Threat Triage',
    headline: 'Continuous Threat Scoring & Dynamic Queue Positioning',
    desc: 'Dynamic scoring engine ranks emergencies using live environmental vectors: rising water speed, building structural integrity, victim vulnerability count, and hospital transit feasibility.',
    accentColor: '#a855f7',
    lineColor: '#3b82f6',
    threshold: 50,
    icon: Layers,
    specs: [
      { label: 'Composite Threat Score', value: '96.4 / 100', sub: 'Immediate Life Threat' },
      { label: 'Emergency Classification', value: 'Tier-1 Alpha', sub: 'Top-tier Priority' },
      { label: 'Queue Placement', value: 'Rank #1', sub: 'National Incident Queue' }
    ],
    telemetryLogs: [
      { time: '00:01.520', msg: 'Algorithm: [Structural 0.45] + [Victims 0.35] + [Surge 0.20]', status: 'info' },
      { time: '00:01.680', msg: 'Composite Threat Index computed: 96.4 / 100', status: 'crit' },
      { time: '00:01.750', msg: 'Dispatch escalation: Ranked #1 Immediate Life Threat Alpha', status: 'ok' }
    ]
  },
  {
    step: '05',
    name: 'AUTO DISPATCH',
    shortName: 'DISPATCH',
    category: 'AUTONOMOUS CAD',
    title: 'Automated Fleet CAD Dispatch & Smart Green Corridor',
    headline: 'Computer-Aided Dispatch & Dynamic Flood Rerouting',
    desc: 'Dispatches the nearest specialized rescue unit, delivers turnkey navigation bypassing flooded roads and roadblocks, and triggers smart city green traffic corridors for rapid response.',
    accentColor: '#f97316',
    lineColor: '#f97316',
    threshold: 66,
    icon: Truck,
    specs: [
      { label: 'Estimated Arrival (ETA)', value: '03m 48s', sub: 'Real-Time Telemetry' },
      { label: 'Assigned Rescue Unit', value: 'NDRF Bat-10', sub: 'Swiftwater Team #4' },
      { label: 'Traffic Preemption', value: '4 Intersections', sub: 'Green Wave Active' }
    ],
    telemetryLogs: [
      { time: '00:01.950', msg: 'Auto-CAD Dispatch issued to NDRF Unit #BAT10-4', status: 'ok' },
      { time: '00:02.100', msg: 'Dynamic Reroute: Bridge #4 flooded -> Rerouted via Outer Ring', status: 'warn' },
      { time: '00:02.240', msg: 'Smart City API: 4 Traffic Signals preempted to GREEN', status: 'ok' }
    ]
  },
  {
    step: '06',
    name: 'EOC OVERSIGHT',
    shortName: 'EOC GRID',
    category: 'TACTICAL COMMAND',
    title: 'EOC Inter-Agency Command & Common Operating Picture',
    headline: 'Unified C2 HUD Synchronizing Police, Fire, NDRF & Hospitals',
    desc: 'Synchronizes Police, Fire, NDRF, SDRF, and Trauma Hospitals into a single real-time HUD. Live drone video feeds, responder telemetry, and ICU bed reservations update with zero silo lag.',
    accentColor: '#38bdf8',
    lineColor: '#06b6d4',
    threshold: 83,
    icon: ShieldAlert,
    specs: [
      { label: 'Inter-Agency Sync', value: '4 Agencies', sub: 'Police, NDRF, Fire, EMS' },
      { label: 'ICU Beds Pre-Reserved', value: '4 Trauma Beds', sub: 'NIMS Emergency Hospital' },
      { label: 'Live Drone Downlink', value: '1080p IR Feed', sub: 'Thermal Optical Stream' }
    ],
    telemetryLogs: [
      { time: '00:02.510', msg: 'Common Operating Picture broadcast to State EOC Command Grid', status: 'ok' },
      { time: '00:02.720', msg: 'NIMS Trauma Center confirmed 4 ICU resuscitation bays reserved', status: 'ok' },
      { time: '00:02.890', msg: 'Recon Drone #DR-12 locked live thermal video downlink', status: 'info' }
    ]
  },
  {
    step: '07',
    name: 'RESOLUTION',
    shortName: 'RESOLVED',
    category: 'POST-INCIDENT INTEGRITY',
    title: 'Scene Cleared & Tamper-Proof Cryptographic Audit',
    headline: 'Victims Extricated & Cryptographic Forensic Incident Sealing',
    desc: 'Responders verify all victims rescued and stabilized. The complete timeline, decisions, and responder actions are hashed with SHA-256 for transparent governmental forensic reporting.',
    accentColor: '#10b981',
    lineColor: '#10b981',
    threshold: 95,
    icon: CheckCircle2,
    specs: [
      { label: 'Extrication Outcome', value: '3 / 3 Saved', sub: 'All Victims Stabilized' },
      { label: 'Total Response Cycle', value: '18m 24s', sub: 'SOS to Resolution' },
      { label: 'Cryptographic Audit', value: 'SHA-256 Sealed', sub: 'Tamper-Proof Log' }
    ],
    telemetryLogs: [
      { time: '00:18.240', msg: 'NDRF Commander confirmed all 3 victims extricated safely', status: 'ok' },
      { time: '00:18.310', msg: 'Audit trail signed: SHA-256 #e8f3a971c24b98...sealed', status: 'ok' },
      { time: '00:18.380', msg: 'Incident closed & automated NDMA post-action report archived', status: 'ok' }
    ]
  }
];

// Interactive Visual HUD Widget rendered on the Right Side of the Cockpit
const StageSimulationWidget: React.FC<{ stage: PipelineStage }> = ({ stage }) => {
  switch (stage.step) {
    case '01':
      return (
        <div className="space-y-3.5">
          {/* Signal Header */}
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-rose-400">BEACON TRANSMISSION ACTIVE</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              PACKET #IN-HYD-8492
            </span>
          </div>

          {/* Animated Audio Waveform */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-rose-300">
                <Volume2 className="w-3.5 h-3.5" /> VOICE DISTRESS MEMO
              </span>
              <span className="text-rose-400 font-bold animate-pulse">STREAMING [00:08.4]</span>
            </div>
            <div className="h-9 flex items-center justify-center gap-1 px-2">
              {[40, 65, 85, 30, 95, 75, 45, 100, 80, 60, 90, 50, 70, 95, 40, 65, 80].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-150"
                  style={{
                    height: `${h}%`,
                    animation: `pulse 1s ease-in-out ${i * 0.08}s infinite alternate`
                  }}
                />
              ))}
            </div>
            <div className="text-[11px] font-mono text-slate-300 italic bg-rose-950/30 p-2 rounded border border-rose-900/40">
              &quot;Ground floor flooded! 3 family members trapped in rear basement, water rising fast!&quot;
            </div>
          </div>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">COORDINATES</span>
              <span className="text-white font-bold text-[11px]">17.3850° N, 78.4867° E</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CARRIER / RSSI</span>
              <span className="text-emerald-400 font-bold text-[11px]">-62 dBm (Excellent)</span>
            </div>
          </div>
        </div>
      );

    case '02':
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-mono font-bold text-cyan-400">GEMINI NEURAL VISION INFERENCE</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              CONFIDENCE 99.4%
            </span>
          </div>

          {/* Simulated Viewfinder */}
          <div className="relative bg-slate-950/90 rounded-xl p-3.5 border border-cyan-900/40 h-40 overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-70" />

            <div className="space-y-1.5 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500 text-[10px] font-mono text-rose-200 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>[DETECTED] Structural Collapse: 99.4%</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500 text-[10px] font-mono text-cyan-200 shadow-lg">
                  <span>[SURGE] Water Inundation: 1.4m Depth</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500 text-[10px] font-mono text-amber-200 shadow-lg">
                  <span>[THERMAL] Human Signatures: 3 Persons Trapped</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
              <span>HALLUCINATION FILTER: PASSED</span>
              <span>P1 CRITICAL VERIFIED</span>
            </div>
          </div>
        </div>
      );

    case '03':
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-400">GNSS TRILATERATION & 3D GIS</span>
            </div>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              RADIAL ±1.8m
            </span>
          </div>

          <div className="relative bg-slate-950/90 rounded-xl p-4 border border-amber-900/40 h-40 flex items-center justify-center overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full border border-amber-500/20" />
            <div className="absolute w-20 h-20 rounded-full border border-amber-500/30" />
            <div className="absolute w-10 h-10 rounded-full border border-amber-500/40" />
            <div className="absolute inset-x-4 h-px bg-amber-500/20" />
            <div className="absolute inset-y-4 w-px bg-amber-500/20" />

            <div className="relative z-10 flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping" />
              <span className="relative w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-white shadow-[0_0_15px_#f59e0b]" />
            </div>

            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400">
              <span>ALTITUDE: 512m MSL (BASEMENT -1)</span>
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-amber-400 font-bold">
              <span>ISRO NavIC + GPS (15 SATS)</span>
            </div>
          </div>
        </div>
      );

    case '04':
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-purple-400">DYNAMIC MULTI-FACTOR TRIAGE</span>
            </div>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
              RANK #1 IN QUEUE
            </span>
          </div>

          <div className="bg-slate-950/90 rounded-xl p-3 border border-purple-900/40 space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-300">Structural Hazard Score (0.45 weight)</span>
                <span className="text-rose-400 font-bold">96%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-300">Victim Vulnerability (0.35 weight)</span>
                <span className="text-purple-400 font-bold">94%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-300">Inundation Surge Velocity (0.20 weight)</span>
                <span className="text-cyan-400 font-bold">91%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '91%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">COMPOSITE THREAT INDEX</span>
              <span className="text-purple-400 font-black text-sm">96.4 / 100 [TIER-1 ALPHA]</span>
            </div>
          </div>
        </div>
      );

    case '05':
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-orange-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-bold text-orange-400">AUTONOMOUS CAD FLEET MOBILIZATION</span>
            </div>
            <span className="text-[11px] font-mono text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/60">
              ETA 03m 48s
            </span>
          </div>

          <div className="bg-slate-950/90 rounded-xl p-3 border border-orange-900/40 space-y-2.5">
            <div className="flex items-center justify-between p-2 bg-slate-900/90 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ASSIGNED RESCUE SQUAD</span>
                <span className="text-xs font-mono font-bold text-white">NDRF Battalion 10 Swiftwater #4</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                EN ROUTE
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-900/30">
                <span>REROUTE: Bridge #4 Submerged</span>
                <span className="font-bold">Via Outer Ring Bypass</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-900/30">
                <span>TRAFFIC PREEMPTION (GREEN WAVE)</span>
                <span className="font-bold">4 Signals Cleared</span>
              </div>
            </div>
          </div>
        </div>
      );

    case '06':
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-sky-400">UNIFIED EOC COMMAND & CONTROL</span>
            </div>
            <span className="text-[11px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
              4 AGENCIES SYNCED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">POLICE / TRAFFIC</span>
              <span className="text-sky-300 font-bold block">Perimeter Secured</span>
              <span className="text-[10px] text-slate-400">Outer cordon held</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">TRAUMA HOSPITAL</span>
              <span className="text-emerald-400 font-bold block">4 Beds Reserved</span>
              <span className="text-[10px] text-slate-400">NIMS Emergency</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">RECON DRONE</span>
              <span className="text-purple-300 font-bold block">1080p Thermal IR</span>
              <span className="text-[10px] text-slate-400">Target locked 45m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">INCIDENT TIMELINE</span>
              <span className="text-amber-300 font-bold block">Live Synchronized</span>
              <span className="text-[10px] text-slate-400">Zero latency lag</span>
            </div>
          </div>
        </div>
      );

    case '07':
    default:
      return (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">SCENE RESOLUTION & AUDIT CERTIFICATE</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              100% RESOLVED
            </span>
          </div>

          <div className="bg-slate-950/90 rounded-xl p-3 border border-emerald-900/40 space-y-2.5">
            <div className="flex items-center justify-between p-2 bg-emerald-950/40 rounded-lg border border-emerald-800/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-mono font-bold text-white block">All 3 Victims Extricated Alive</span>
                  <span className="text-[10px] font-mono text-emerald-300">Stabilized and transferred to NIMS Trauma Team</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span>TOTAL OPERATION CYCLE:</span>
                <span className="text-white font-bold">18m 24s from SOS to Hospital</span>
              </div>
              <div className="flex justify-between">
                <span>TAMPER-PROOF AUDIT HASH:</span>
                <span className="text-emerald-400 font-mono">SHA-256: e8f3a9...b7012</span>
              </div>
              <div className="flex justify-between">
                <span>NDMA COMPLIANCE REPORT:</span>
                <span className="text-cyan-400">SEALED & ARCHIVED</span>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export const EmergencyPipelineCockpit: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualStageIndex, setManualStageIndex] = useState<number | null>(null);

  // Synchronize with Page Scroll
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const navOffset = 68;

      if (window.innerWidth >= 1024) {
        // Desktop Sticky Scroll progression across the 280vh container
        const scrollableDist = rect.height - (window.innerHeight - navOffset);
        const currentScroll = navOffset - rect.top;
        const rawProgress = scrollableDist > 0 ? (currentScroll / scrollableDist) * 100 : 0;
        const clamped = Math.min(100, Math.max(0, rawProgress));
        setScrollProgress(clamped);
      } else {
        // Mobile / Tablet: Viewport progress
        const windowHeight = window.innerHeight;
        const startOffset = windowHeight * 0.85;
        const endOffset = windowHeight * 0.15;
        const totalDistance = rect.height + (startOffset - endOffset);
        const currentDistance = startOffset - rect.top;
        const rawMobile = totalDistance > 0 ? (currentDistance / totalDistance) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, rawMobile)));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Compute active stage from scroll, unless manual selection was clicked
  const activeFromScroll = PIPELINE_STAGES.reduce((acc, step, index) => {
    return scrollProgress >= step.threshold ? index : acc;
  }, 0);

  const currentStageIdx = manualStageIndex !== null ? manualStageIndex : activeFromScroll;
  const currentStage = PIPELINE_STAGES[currentStageIdx];

  const jumpToStage = (idx: number) => {
    setManualStageIndex(idx);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const navOffset = 68;
      const scrollableDist = rect.height - (window.innerHeight - navOffset);
      const targetScroll = (PIPELINE_STAGES[idx].threshold / 100) * scrollableDist;
      const targetPageY = window.scrollY + rect.top - navOffset + targetScroll;
      window.scrollTo({ top: targetPageY, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, currentStageIdx - 1);
    jumpToStage(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(PIPELINE_STAGES.length - 1, currentStageIdx + 1);
    jumpToStage(nextIdx);
  };

  const StageIcon = currentStage.icon;

  return (
    <section
      ref={containerRef}
      id="emergency-pipeline"
      className="relative lg:h-[280vh] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 select-none scroll-mt-20"
    >
      {/* Sticky Viewport Container (Locks in place on scroll) */}
      <div className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] flex flex-col justify-between py-3 sm:py-5 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] blur-[160px] pointer-events-none -z-10 rounded-full transition-all duration-700 opacity-25"
          style={{ backgroundColor: currentStage.accentColor }}
        />

        {/* Section Header (Compact & Impactful) */}
        <div className="text-center max-w-3xl mx-auto space-y-1 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>CLOSED-LOOP COORDINATION ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-sans">
            THE RESQAI EMERGENCY PIPELINE
          </h2>

          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed hidden sm:block">
            Watch real-time disaster telemetry propagate seamlessly from initial citizen distress beacon to full cryptographic scene resolution.
          </p>
        </div>

        {/* 7-PHASE CONNECTED COMMAND RAIL (Top Timeline Bar) */}
        <div className="w-full my-2 px-1 sm:px-4 shrink-0">
          <div className="relative flex items-center justify-between gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md overflow-x-auto no-scrollbar">
            
            {PIPELINE_STAGES.map((st, idx) => {
              const isPassed = scrollProgress >= st.threshold;
              const isCurrent = currentStageIdx === idx;
              const Icon = st.icon;

              return (
                <button
                  key={st.step}
                  onClick={() => jumpToStage(idx)}
                  className={`relative flex-1 min-w-[85px] sm:min-w-0 py-2 px-1.5 sm:px-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 group cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800/95 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50 scale-[1.02]'
                      : isPassed
                      ? 'bg-slate-900/60 border border-emerald-500/40 hover:border-emerald-400/70 hover:bg-slate-800/50'
                      : 'bg-slate-950/40 border border-slate-800/60 opacity-60 hover:opacity-90 hover:border-slate-700'
                  }`}
                >
                  {/* Top Active Beacon Indicator */}
                  {isCurrent && (
                    <span
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full shadow-[0_0_10px_currentColor]"
                      style={{ backgroundColor: st.accentColor, color: st.accentColor }}
                    />
                  )}

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold transition-transform duration-200 ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> : st.step}
                    </span>

                    <Icon
                      className="w-3.5 h-3.5 transition-colors duration-200"
                      style={{ color: isCurrent ? st.accentColor : isPassed ? '#10b981' : '#94a3b8' }}
                    />
                  </div>

                  <span
                    className={`text-[9px] sm:text-[10.5px] font-mono tracking-tight font-bold transition-colors duration-200 truncate ${
                      isCurrent ? 'text-white' : isPassed ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  >
                    <span className="hidden md:inline">{st.name}</span>
                    <span className="md:hidden">{st.shortName}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTRAL COMMAND COCKPIT (Spacious 2-column console) */}
        <div className="w-full my-auto py-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, ${currentStage.accentColor}, #06b6d4, #10b981)`
              }}
            />

            {/* LEFT COLUMN: TACTICAL INTELLIGENCE DOSSIER (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              
              {/* Header Badges & Title */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${currentStage.accentColor}20`,
                      color: currentStage.accentColor,
                      border: `1px solid ${currentStage.accentColor}50`
                    }}
                  >
                    PHASE {currentStage.step} / 07 • {currentStage.category}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    LIVE PIPELINE PROTOCOL
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight font-sans">
                  {currentStage.title}
                </h3>

                <div
                  className="text-xs sm:text-sm font-mono font-bold tracking-tight"
                  style={{ color: currentStage.accentColor }}
                >
                  {currentStage.headline}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {currentStage.desc}
                </p>
              </div>

              {/* 3 High-Density Telemetry Stat Chips */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 py-0.5">
                {currentStage.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-left space-y-0.5 hover:border-slate-700 transition"
                  >
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      {spec.label}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-mono font-black block tracking-tight truncate"
                      style={{ color: i === 0 ? currentStage.accentColor : '#ffffff' }}
                    >
                      {spec.value}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 block truncate">
                      {spec.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live Terminal Protocol Stream */}
              <div className="bg-slate-950/90 rounded-xl border border-slate-800/90 p-2.5 space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-slate-900 pb-1">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>REAL-TIME PROTOCOL TELEMETRY STREAM</span>
                  </span>
                  <span className="text-emerald-400 animate-pulse">● LIVE</span>
                </div>
                {currentStage.telemetryLogs.map((log, logIdx) => (
                  <div key={logIdx} className="flex items-start gap-2 leading-tight">
                    <span className="text-slate-500 select-none text-[10px] shrink-0 font-mono">[{log.time}]</span>
                    <span
                      className={`text-[10.5px] truncate ${
                        log.status === 'crit'
                          ? 'text-rose-400 font-bold'
                          : log.status === 'warn'
                          ? 'text-amber-400'
                          : log.status === 'ok'
                          ? 'text-emerald-300'
                          : 'text-cyan-300'
                      }`}
                    >
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStageIdx === 0}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono font-bold text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentStageIdx === PIPELINE_STAGES.length - 1}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono font-bold text-white transition flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-900/40"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Step {currentStageIdx + 1} of 7 • Auto-syncs on scroll
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN: LIVE SIMULATION & HUD MONITOR (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 relative overflow-hidden shadow-inner">
              
              {/* Background HUD Grid Lines */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
                  backgroundSize: '16px 16px'
                }}
              />

              <div className="relative z-10 space-y-3">
                {/* HUD Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${currentStage.accentColor}20`,
                        border: `1px solid ${currentStage.accentColor}60`
                      }}
                    >
                      <StageIcon className="w-3.5 h-3.5" style={{ color: currentStage.accentColor }} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block">TACTICAL HUD</span>
                      <span className="text-xs font-mono font-black text-white tracking-wider">
                        {currentStage.name} MONITOR
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                    STATUS: ACTIVE
                  </span>
                </div>

                {/* Stage Simulation Visual Widget */}
                <StageSimulationWidget stage={currentStage} />
              </div>

              {/* Interactive Prompt Footer */}
              <div className="relative z-10 pt-2 border-t border-slate-800/70 mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Interactive Pipeline Simulation</span>
                </span>
                <span className="text-cyan-400 font-bold hover:underline cursor-pointer">
                  PHASE {currentStage.step} ACTIVE ➔
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM SCRUB & STATUS BAR */}
        <div className="w-full shrink-0 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">END-TO-END PIPELINE TIMELINE LOCK</span>
            <span className="sm:hidden">PIPELINE TIMELINE</span>
          </div>

          {/* Continuous Progress Fill Line */}
          <div className="w-28 sm:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-3">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-cyan-400 to-emerald-400 transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress)}%` }}
            />
          </div>

          <div className="font-bold text-emerald-400">
            {Math.round(scrollProgress)}% COMPLETED
          </div>
        </div>

      </div>
    </section>
  );
};
