'use client';

import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

interface EmergencyTopBarProps {
  dict?: {
    call112Bar?: string;
    call112Text?: string;
    call112Button?: string;
  };
}

const DEFAULT_BANNER_DICT = {
  call112Bar: '🚨 REAL EMERGENCY? CALL 112',
  call112Text: "If you or someone else is in immediate danger, contact emergency services first. 112 is India's pan-India Emergency Response Support System for Police, Fire, and Health.",
  call112Button: 'CALL 112'
};

export const EmergencyTopBar = ({ dict }: EmergencyTopBarProps) => {
  const { portalMode } = useEmergency();
  const [collapsed, setCollapsed] = useState(false);
  const barTitle = dict?.call112Bar || DEFAULT_BANNER_DICT.call112Bar;
  const barText = dict?.call112Text || DEFAULT_BANNER_DICT.call112Text;
  const barButton = dict?.call112Button || DEFAULT_BANNER_DICT.call112Button;

  // In Admin EOC command mode, keep 100% viewport space for the tactical command system
  if (portalMode === 'ADMIN') return null;

  return (
    <>
      {/* Desktop & Tablet Persistent Top Alert Bar */}
      {!collapsed && (
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-b border-red-500/40 text-white px-4 py-2.5 relative z-40 shadow-lg shadow-red-950/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider uppercase text-red-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-300" />
                  {barTitle}
                </span>
                <span className="hidden lg:inline text-red-200/80 font-normal">
                  — {barText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs md:text-sm tracking-wide shadow-md hover:shadow-red-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                <span>{barButton} (ERSS)</span>
              </a>

              <button
                onClick={() => setCollapsed(true)}
                title="Dismiss banner"
                className="text-red-300 hover:text-white p-1 rounded hover:bg-red-800/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Call 112 Button for Mobile Users (positioned safely above bottom app dock) */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <a
          href="tel:112"
          className="flex items-center gap-2 bg-red-600/95 hover:bg-red-500 text-white px-3.5 py-2.5 rounded-full shadow-2xl shadow-red-600/60 font-bold text-xs tracking-wide border border-white/20 active:scale-95 transition"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <PhoneCall className="w-3.5 h-3.5" />
          <span>CALL 112</span>
        </a>
      </div>
    </>
  );
};
