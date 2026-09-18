'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Eye,
  Key,
  FileCheck,
  MapPin,
  Clock,
  Flame,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_INCIDENTS, LiveIncident } from '@/data/liveMapData';
import Link from 'next/link';

export default function AdminIncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<LiveIncident>(INITIAL_INCIDENTS[0]);
  const [signedUrlGenerated, setSignedUrlGenerated] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Security Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              AUTHENTICATED EOC CONSOLE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ROLE: EOC_COMMANDER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            RESTRICTED CITIZEN MEDIA INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Decrypted media view powered by Supabase Private Storage &amp; Row-Level Security (RLS)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition"
          >
            ← EOC Home
          </Link>
          <Link
            href="/live-map"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow self-start md:self-auto"
          >
            <span>Open Live Response Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Security Doctrine Banner */}
      <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 mb-8 flex items-start gap-3.5 text-xs text-purple-200">
        <Key className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider font-mono">
            SECURE ZERO-LEAK MEDIA ARCHITECTURE
          </span>
          <p className="text-slate-300 leading-relaxed">
            Citizen distress photographs and videos uploaded via <code className="text-purple-300 font-mono">/report</code> reside in the private bucket <code className="text-purple-300 font-mono">incident-media</code>. Public HTTP access is blocked. This view issues short-lived cryptographic signed URLs (60-minute expiry) to verified EOC responders.
          </p>
        </div>
      </div>

      {/* Main Split Console: Incident Selector | Media & Telemetry Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incidents with Media */}
        <div className="lg:col-span-4 space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">
            INCIDENTS WITH VERIFIED EVIDENCE
          </span>

          <div className="space-y-2">
            {INITIAL_INCIDENTS.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-black text-white">
                      #{inc.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                      {inc.privateMediaCount} Photos
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                    {inc.title}
                  </h4>
                  <div className="text-[10px] font-mono text-slate-400">
                    {inc.city} • {inc.severity}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Incident Evidence & Signed Media Inspection */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-rose-400">
                  INCIDENT #{selectedIncident.id}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedIncident.severity}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                {selectedIncident.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {selectedIncident.address}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                SIGNED URL TOKEN
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                VALID (EXPIRES IN 58M)
              </span>
            </div>
          </div>

          {/* Situation Briefing */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              OPERATIONAL BRIEFING
            </span>
            <p className="leading-relaxed">{selectedIncident.description}</p>
          </div>

          {/* Citizen Media Gallery (Simulating Secure Signed URLs) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" />
                PRIVATE CITIZEN SUBMISSIONS ({selectedIncident.privateMediaCount})
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                Storage: supabase://incident-media/{selectedIncident.id}/
              </span>
            </div>

            {/* Simulated secure photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 space-y-2 p-3">
                <div className="h-48 rounded-xl overflow-hidden bg-slate-900 relative">
                  <img
                    src="https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80"
                    alt="Citizen damage photo 1"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-purple-300">
                    EVIDENCE PHOTO 01
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Signed Token: sha256:7f8a...</span>
                  <span className="text-emerald-400">Verified Citizen</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 space-y-2 p-3">
                <div className="h-48 rounded-xl overflow-hidden bg-slate-900 relative">
                  <img
                    src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80"
                    alt="Citizen damage photo 2"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-purple-300">
                    EVIDENCE PHOTO 02
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Signed Token: sha256:4b19...</span>
                  <span className="text-emerald-400">Verified Citizen</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Automated Damage Extraction */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              AI VISION OCR &amp; THERMAL TRIAGE
            </span>
            <p className="text-slate-300 leading-relaxed font-mono">
              {selectedIncident.aiAssessment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
