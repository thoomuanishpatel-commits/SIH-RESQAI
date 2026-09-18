'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Radio,
  Sun,
  Moon,
  Home,
  Shield,
  MapPin,
  AlertTriangle,
  HeartPulse,
  Building,
  Activity,
  Waves,
  Eye,
  Crosshair,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { CitizenIncidentTracker } from './CitizenIncidentTracker';

interface CitizenPortalViewProps {
  initialIncidentId?: string | null;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({ initialIncidentId }) => {
  const { setActiveView, incidents, hospitals, riskZones } = useEmergency();

  // Theme state (Dark by default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize theme from document or localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('resqai_theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      console.warn('Theme storage access warning:', err);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('resqai_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('resqai_theme', 'light');
        }
      } catch (err) {
        console.warn('Theme storage save warning:', err);
      }
      return next;
    });
  };

  // Map Click Handler for coordinate pinning override
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPinnedLocation({ lat, lng });
  }, []);

  const handleClearPinnedLocation = useCallback(() => {
    setPinnedLocation(null);
  }, []);

  // Quick stats
  const totalBeds = hospitals.reduce((acc, h) => acc + h.icuAvailable, 0);
  const floodZonesCount = riskZones.filter(z => z.hazardType === 'FLOOD_INUNDATION').length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-100 text-slate-900'} font-sans`}>
      
      {/* 3A. NAVIGATION HEADER */}
      <nav className={`sticky top-0 z-40 px-4 sm:px-6 py-3 border-b backdrop-blur-xl transition-colors ${
        isDarkMode ? 'bg-zinc-950/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo badge & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center font-mono font-black text-white text-base shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40">
              RQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">TSDMA ResQAI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Public Channel</span>
                </span>
              </div>
              <p className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Citizen Distress &amp; Safety Portal
              </p>
            </div>
          </div>

          {/* Action Buttons: Go Back Home, Admin Panel, Theme Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Go Back Home */}
            <button
              onClick={() => setActiveView('LANDING')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Go Back Home</span>
            </button>

            {/* Admin Panel Shortcut */}
            <button
              onClick={() => setActiveView('COMMAND')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 border border-blue-400/30 transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

            {/* Light/Dark theme switch */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 3A. EMERGENCY BROADCAST TICKER */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-black px-4 py-2 font-mono text-xs font-bold shadow-md">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
              <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
            </div>
            <span className="tracking-tight truncate">
              🚨 HYDERABAD METEOROLOGICAL ALERT: Flood water watermarks registered at Musi River Basin. Avoid low-lying corridors.
            </span>
          </div>
          <span className="hidden md:inline text-[10px] px-2 py-0.5 rounded bg-black/20 uppercase font-black shrink-0">
            TSDMA CRISIS BULLETIN
          </span>
        </div>
      </div>

      {/* MAIN CONTENT AREA: TWO-COLUMN LAYOUT */}
      <main className="max-w-[1800px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (5/12 width): Citizen Incident Tracker & SOS Console */}
          <div className="lg:col-span-5 space-y-6">
            <CitizenIncidentTracker
              pinnedLocation={pinnedLocation}
              onClearPinnedLocation={handleClearPinnedLocation}
              initialIncidentId={initialIncidentId}
            />
          </div>

          {/* RIGHT COLUMN (7/12 width): Public Evacuation Map with Operational Security Filter */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Map Header Card */}
            <div className={`p-4 rounded-3xl border backdrop-blur-xl ${
              isDarkMode ? 'bg-zinc-950/80 border-white/10' : 'bg-white border-slate-200 shadow-md'
            } flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold tracking-tight">
                      Public Evacuation &amp; Safety Map
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                      Interactive GIS
                    </span>
                  </div>
                  <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Open shelters • Emergency Hospitals • Musi Flood Hazard Perimeters
                  </p>
                </div>
              </div>

              {/* Pin notice instruction */}
              <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Crosshair className="w-3.5 h-3.5 animate-pulse" />
                <span>Click map to pin emergency location</span>
              </div>
            </div>

            {/* Interactive Leaflet Map Canvas */}
            <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <EmergencyMap
                isPublicEvacuationMap={true}
                onMapClick={handleMapClick}
                pinnedLocation={pinnedLocation}
              />
            </div>

            {/* Quick Public Safety Telemetry Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Emergency Bed Stats */}
              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-950/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              } flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Citywide ICU Beds
                  </div>
                  <div className="text-sm font-black font-mono text-blue-400">
                    {totalBeds} ICU Available
                  </div>
                </div>
              </div>

              {/* Musi Flood Alert Level */}
              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-950/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              } flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Musi Basin Flood Risk
                  </div>
                  <div className="text-sm font-black font-mono text-amber-400">
                    {floodZonesCount} Danger Perimeters
                  </div>
                </div>
              </div>

              {/* OPSEC Shield Status */}
              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-950/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              } flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Public OPSEC Filter
                  </div>
                  <div className="text-sm font-black font-mono text-emerald-400">
                    Active (Vectors Masked)
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
};
