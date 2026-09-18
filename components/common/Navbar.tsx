'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Radio,
  Navigation,
  Compass,
  FileText,
  Activity,
  Menu,
  X,
  Layers,
  Sparkles,
  Lock,
  LogOut,
  Truck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useEmergency, AppView } from '@/context/EmergencyContext';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setSosModalOpen,
    audioMuted,
    toggleAudio,
    isOffline,
    toggleOfflineMode,
    incidents,
    portalMode,
    setPortalMode,
    isAdminAuthenticated,
    setAdminAuthModalOpen,
    logoutAdmin
  } = useEmergency();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const handleAdminPortalClick = () => {
    if (isAdminAuthenticated) {
      setPortalMode('ADMIN');
      setActiveView('COMMAND');
    } else {
      setAdminAuthModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const handleUserPortalClick = () => {
    setPortalMode('USER');
    setActiveView('CITIZEN');
    setMobileMenuOpen(false);
  };

  // If in ADMIN mode and authenticated, the Palantir EOC Command Center provides its own full-screen tactical interface
  if ((portalMode as string) === 'ADMIN' && isAdminAuthenticated) {
    return <AdminAuthModal />;
  }

  return (
    <>
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        portalMode === 'ADMIN'
          ? 'bg-slate-950/95 border-red-900/60'
          : 'bg-slate-950/90 border-slate-800/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick(portalMode === 'ADMIN' ? 'COMMAND' : 'LANDING')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-rose-500 rounded p-1 cursor-pointer"
              aria-label="ResQAI Home"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border ${
                portalMode === 'ADMIN'
                  ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-950/60 border-red-500/40'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-950/50 border-blue-500/40'
              }`}>
                {portalMode === 'ADMIN' ? (
                  <Activity className="w-5 h-5 text-white" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-lg text-white font-mono">RESQAI</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Operational" />
                </div>
                <p className={`text-[9px] font-mono tracking-wider uppercase font-bold ${
                  portalMode === 'ADMIN' ? 'text-red-400' : 'text-cyan-400'
                }`}>
                  {portalMode === 'ADMIN' ? '🛡️ EOC COMMAND PORTAL' : 'PUBLIC CITIZEN PORTAL'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {portalMode === 'USER' ? (
              /* CITIZEN / USER PORTAL NAVIGATION (NO CREDENTIALS NEEDED) */
              <>
                <button
                  onClick={() => handleNavClick('CITIZEN')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                    activeView === 'CITIZEN'
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Disaster Overview &amp; Report</span>
                </button>

                <button
                  onClick={() => handleNavClick('TRACK')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                    activeView === 'TRACK'
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Track Emergency SOS</span>
                </button>

                <Link
                  href="/disaster-guide"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Safety Guidelines</span>
                </Link>

                <Link
                  href="/live-map"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/70 hover:border-cyan-400 shadow-sm transition-all ml-1"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  <span>PUBLIC LIVE MAP</span>
                </Link>
              </>
            ) : (
              /* EOC ADMIN PORTAL NAVIGATION (AUTHENTICATED) */
              <>
                <button
                  onClick={() => handleNavClick('COMMAND')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                    activeView === 'COMMAND'
                      ? 'bg-red-900/60 text-white border border-red-700 shadow-md ring-1 ring-red-600/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Command Center</span>
                  {activeIncidentsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-500/30 text-red-200 border border-red-500/40 font-bold">
                      {activeIncidentsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('RESPONDER')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                    activeView === 'RESPONDER'
                      ? 'bg-blue-900/60 text-white border border-blue-700 shadow-md ring-1 ring-blue-600/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Fleet &amp; Vehicles Motion</span>
                </button>

                <Link
                  href="/live-map"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/70 hover:border-cyan-400 shadow-sm transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 shrink-0" />
                  <span>Tactical 3D EOC Map</span>
                </Link>

                <Link
                  href="/disaster-guide"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold text-slate-300 hover:text-white hover:bg-slate-900/90 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Safety Guidelines</span>
                </Link>

                <button
                  onClick={() => handleNavClick('SIMULATION')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                    activeView === 'SIMULATION'
                      ? 'bg-purple-900/60 text-white border border-purple-700 shadow-md ring-1 ring-purple-600/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Disaster Sim</span>
                </button>
              </>
            )}
          </nav>

          {/* Action Controls & Portal Auth Switcher */}
          <div className="flex items-center gap-2">
            {/* Audio toggle */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title={audioMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
              aria-label="Toggle Sound Effects"
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Portal Switcher Button */}
            {portalMode === 'USER' ? (
              <button
                onClick={handleAdminPortalClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-red-600/20 hover:from-amber-600/30 hover:to-red-600/30 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
                title="Restricted EOC Commander Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">EOC Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUserPortalClick}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title="Switch to Public User View"
                >
                  <span>User View</span>
                </button>

                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-500/50 text-xs font-mono font-bold transition shadow cursor-pointer"
                  title="Logout from EOC Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}

            {/* Primary Citizen SOS Button */}
            {portalMode === 'USER' && (
              <button
                onClick={() => setSosModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold font-mono tracking-wide shadow-lg shadow-rose-900/40 border border-rose-400/40 transition-transform active:scale-95 cursor-pointer"
                aria-label="Trigger Emergency SOS"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>SOS</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold px-2">
              ACTIVE PORTAL: {portalMode === 'ADMIN' ? 'EOC COMMANDER' : 'PUBLIC CITIZEN'}
            </div>

            <div className="space-y-1">
              {portalMode === 'USER' ? (
                <>
                  <button
                    onClick={() => handleNavClick('CITIZEN')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Disaster Overview &amp; Report</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('TRACK')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Track Emergency SOS</span>
                  </button>

                  <Link
                    href="/disaster-guide"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Safety Guidelines</span>
                  </Link>

                  <Link
                    href="/live-map"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-slate-900"
                  >
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    <span>Public Live Map</span>
                  </Link>

                  <div className="pt-2">
                    <button
                      onClick={handleAdminPortalClick}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Log in to EOC Admin Portal</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('COMMAND')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <Activity className="w-4 h-4 text-red-400" />
                    <span>Command Center Overview</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('RESPONDER')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span>Fleet &amp; Vehicles Movement</span>
                  </button>

                  <Link
                    href="/live-map"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-slate-900"
                  >
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    <span>Tactical 3D EOC Map</span>
                  </Link>

                  <Link
                    href="/disaster-guide"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-900"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Safety Guidelines</span>
                  </Link>

                  <div className="pt-2">
                    <button
                      onClick={logoutAdmin}
                      className="w-full py-2.5 px-3 rounded-xl bg-red-950 border border-red-500 text-red-300 font-mono text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Logout from EOC Admin</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global EOC Admin Authentication Modal */}
      <AdminAuthModal />

      {/* NATIVE APP BOTTOM NAVIGATION DOCK (Visible on Mobile & Tablet < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {portalMode === 'USER' ? (
            <>
              {/* Citizen Disasters View */}
              <button
                onClick={() => handleNavClick('CITIZEN')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'CITIZEN' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeView === 'CITIZEN' ? 'bg-rose-950/80 border border-rose-500/40' : ''}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Report</span>
              </button>

              {/* Citizen Track Ambulances / Responders */}
              <button
                onClick={() => handleNavClick('TRACK')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'TRACK' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeView === 'TRACK' ? 'bg-blue-950/80 border border-blue-500/40' : ''}`}>
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Track</span>
              </button>

              {/* Center Prominent SOS App Button */}
              <button
                onClick={() => setSosModalOpen(true)}
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
                aria-label="One-Touch Emergency SOS"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/80 border-2 border-white/40 group-active:scale-95 transition">
                  <span className="text-white font-black text-xs font-mono tracking-wider">SOS</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-rose-400 mt-1 uppercase">DISTRESS</span>
              </button>

              {/* Public Live Map */}
              <Link
                href="/live-map"
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Live Map</span>
              </Link>

              {/* Safety Guidelines */}
              <Link
                href="/disaster-guide"
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
              >
                <div className="p-1 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Safety</span>
              </Link>
            </>
          ) : (
            /* EOC ADMIN PORTAL BOTTOM DOCK */
            <>
              {/* Command Center */}
              <button
                onClick={() => handleNavClick('COMMAND')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'COMMAND' ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeView === 'COMMAND' ? 'bg-red-950/80 border border-red-500/40' : ''}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Command</span>
              </button>

              {/* Fleet & Vehicles Movement */}
              <button
                onClick={() => handleNavClick('RESPONDER')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'RESPONDER' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeView === 'RESPONDER' ? 'bg-blue-950/80 border border-blue-500/40' : ''}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Fleet</span>
              </button>

              {/* Tactical 3D Map */}
              <Link
                href="/live-map"
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Tactical Map</span>
              </Link>

              {/* Disaster Simulator */}
              <button
                onClick={() => handleNavClick('SIMULATION')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'SIMULATION' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${activeView === 'SIMULATION' ? 'bg-purple-950/80 border border-purple-500/40' : ''}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Simulate</span>
              </button>

              {/* Exit Admin */}
              <button
                onClick={logoutAdmin}
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-red-950/50 border border-red-500/30">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Exit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
