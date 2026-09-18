'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { CitizenReportWizard } from '@/components/citizen/CitizenReportWizard';

export default function CitizenReportPage() {
  const router = useRouter();

  const handleNavigateToTrack = (reportId: string) => {
    router.push(`/citizen?incident=${reportId}`);
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-850 pb-4">
        <Link
          href="/live-map"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Map</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/citizen"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 transition"
          >
            Citizen Portal
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 transition"
          >
            EOC Home
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>OFFICIAL CITIZEN CRISIS INTAKE • RESQAI VERIFICATION GRID</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
          REPORT EMERGENCY &amp; DISASTER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Select a disaster category to view instant life-safety guidelines, capture verified location coordinates, and submit encrypted evidence directly to Emergency Operations Center dispatchers.
        </p>
      </div>

      {/* Main Wizard Flow */}
      <CitizenReportWizard onNavigateToTrack={handleNavigateToTrack} />

    </div>
  );
}
