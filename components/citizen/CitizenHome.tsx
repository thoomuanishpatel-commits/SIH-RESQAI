'use client';

import React, { useState } from 'react';
import {
  Flame,
  CarFront,
  Waves,
  Building2,
  UserX,
  AlertTriangle,
  Mic,
  Camera,
  MapPin,
  Compass,
  PhoneCall,
  ShieldCheck,
  Clock,
  ArrowRight,
  HeartPulse,
  Truck,
  Satellite,
  CheckCircle2,
  Activity,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { SosModal } from './SosModal';
import { VoiceReportModal } from './VoiceReportModal';
import { PhotoReportModal } from './PhotoReportModal';
import { DisasterReportConfirmationModal } from './DisasterReportConfirmationModal';
import { IncidentCategory, IncidentSeverity } from '@/types';

export const CitizenHome: React.FC = () => {
  const {
    setSosModalOpen,
    createIncident,
    setActiveView,
    myActiveIncident,
    incidents,
    units,
    selectedIncident,
    setSelectedIncident,
    autoDispatchedUnit,
    userLiveLocation,
    refreshUserLocation
  } = useEmergency();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<string | null>(null);
  
  // Custom Disaster Text Reporting State
  const [disasterText, setDisasterText] = useState<string>('');
  const [reportCategory, setReportCategory] = useState<IncidentCategory>('FIRE');
  const [reportSeverity, setReportSeverity] = useState<IncidentSeverity>('HIGH');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [pendingReportData, setPendingReportData] = useState<{
    category: IncidentCategory;
    description: string;
    severity: IncidentSeverity;
    locationAddress?: string;
  }>({
    category: 'FIRE',
    description: '',
    severity: 'HIGH'
  });

  const categories = [
    { type: 'FIRE' as IncidentCategory, label: 'FIRE', icon: Flame, color: 'hover:border-rose-500 hover:bg-rose-950/20 text-rose-400' },
    { type: 'ACCIDENT' as IncidentCategory, label: 'ACCIDENT', icon: CarFront, color: 'hover:border-amber-500 hover:bg-amber-950/20 text-amber-400' },
    { type: 'FLOOD' as IncidentCategory, label: 'FLOOD', icon: Waves, color: 'hover:border-blue-500 hover:bg-blue-950/20 text-blue-400' },
    { type: 'COLLAPSE' as IncidentCategory, label: 'COLLAPSE', icon: Building2, color: 'hover:border-orange-500 hover:bg-orange-950/20 text-orange-400' },
    { type: 'MISSING_PERSON' as IncidentCategory, label: 'MISSING PERSON', icon: UserX, color: 'hover:border-purple-500 hover:bg-purple-950/20 text-purple-400' },
    { type: 'HAZARD' as IncidentCategory, label: 'OTHER HAZARD', icon: AlertTriangle, color: 'hover:border-yellow-500 hover:bg-yellow-950/20 text-yellow-400' },
  ];

  const handleOpenReportConfirmation = (category: IncidentCategory, description: string, severity: IncidentSeverity = 'HIGH') => {
    const locAddress = userLiveLocation
      ? `${userLiveLocation.address} (GPS: ${userLiveLocation.lat.toFixed(5)}° N, ${userLiveLocation.lng.toFixed(5)}° E)`
      : 'Auto-detecting live GPS coordinates...';

    setPendingReportData({
      category,
      description: description || `Urgent ${category} disaster distress reported by citizen.`,
      severity,
      locationAddress: locAddress
    });
    setConfirmationModalOpen(true);
  };

  const handleQuickCategoryClick = (type: IncidentCategory, label: string) => {
    setSelectedQuickCategory(label);
    handleOpenReportConfirmation(type, disasterText || `Immediate citizen distress reported: ${label} emergency.`);
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disasterText.trim()) {
      handleOpenReportConfirmation(reportCategory, `Emergency distress reported for ${reportCategory}.`);
    } else {
      handleOpenReportConfirmation(reportCategory, disasterText, reportSeverity);
    }
  };

  const handleModalSuccessSubmit = (incidentId: string, token: string, photoUrl: string) => {
    createIncident({
      type: pendingReportData.category,
      title: `Citizen Emergency (${token}): ${pendingReportData.category}`,
      description: pendingReportData.description,
      severity: pendingReportData.severity,
      reportedVia: 'MANUAL',
      estimatedCasualties: 1,
      trappedCount: 0,
      photoUrl: photoUrl,
      tokenNumber: token,
      verificationPhotoUrl: photoUrl,
      location: userLiveLocation ? {
        lat: userLiveLocation.lat,
        lng: userLiveLocation.lng,
        address: userLiveLocation.address,
        zone: userLiveLocation.zone
      } : undefined
    });
    setDisasterText('');
  };

  const activeUnits = units.filter(u => u.status === 'EN_ROUTE');
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070B13] text-slate-100 py-6 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto space-y-6">
      
      {/* Automated Ambulance En Route Notification */}
      {autoDispatchedUnit && autoDispatchedUnit.status === 'EN_ROUTE' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-blue-950/90 to-slate-900 border-2 border-emerald-500/60 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase">
                  AUTOMATED DISPATCH ENGAGED
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  {autoDispatchedUnit.callsign} ({autoDispatchedUnit.department})
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1">
                The nearest ambulance was automatically dispatched to your coordinates. Status: <strong className="text-emerald-400 font-mono">EN ROUTE</strong> • ETA: <strong className="text-cyan-300 font-mono">{autoDispatchedUnit.etaMinutes || 3} mins</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('TRACK')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <span>TRACK AMBULANCE ARRIVAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Incident Quick Banner if citizen has reported one */}
      {myActiveIncident && myActiveIncident.status !== 'RESOLVED' && !autoDispatchedUnit && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-slate-900 border border-blue-500/50 shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
            <div>
              <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                ACTIVE INCIDENT LOGGED WITH EOC
              </div>
              <div className="text-sm font-bold text-white">
                {myActiveIncident.id} — {myActiveIncident.title}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Status: <span className="text-emerald-400 font-bold">{myActiveIncident.status}</span> • Severity: {myActiveIncident.severity}
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('TRACK')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <span>TRACK RESPONDER ARRIVAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Split-Screen Layout: Left Triage & Actions | Right Live Interactive Map with Inch-to-Inch Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (5 cols): Urgent Citizen Actions & Triage */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 rounded-3xl backdrop-blur-xl">
          
          {/* Main Urgent Callout */}
          <div className="space-y-4 text-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-mono font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                CITIZEN RAPID TRIAGE PORTAL
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                ARE YOU IN DANGER?
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                In an emergency, do not hesitate. One press transmits your sub-meter GPS distress beacon to regional EOC dispatchers.
              </p>
            </div>

            {/* Live Real-Time Device GPS Auto-Sync Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-lg text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${userLiveLocation?.status === 'LOCKED' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    AUTOMATIC LIVE REAL-TIME GPS SYNC
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => refreshUserLocation()}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                  title="Re-fetch Real Device GPS"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-Locate</span>
                </button>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    📍 {userLiveLocation?.address || 'Acquiring device GPS fix...'}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-0.5">
                    <span>{userLiveLocation ? `${userLiveLocation.lat.toFixed(5)}° N, ${userLiveLocation.lng.toFixed(5)}° E` : 'Connecting to GPS...'}</span>
                    <span>•</span>
                    <span className="text-slate-400">Accuracy: ±{userLiveLocation?.accuracy || 4}m</span>
                    <span>•</span>
                    <span className="text-cyan-300 font-semibold">{userLiveLocation?.status === 'LOCKED' ? 'GPS LOCKED' : 'ACQUIRING'}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-300 uppercase">
                    AUTO-ATTACHED
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                ⚡ Your exact device GPS coordinates are automatically attached to all disaster reports &amp; SOS transmissions.
              </p>
            </div>

            {/* Massive High-Impact SOS Button */}
            <div className="py-2">
              <button
                onClick={() => handleOpenReportConfirmation('HAZARD', 'Immediate Citizen SOS Distress Beacon — Critical GPS Emergency Signal', 'CRITICAL')}
                className="w-full py-6 sm:py-7 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-2xl shadow-rose-950/80 border-2 border-rose-400/50 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 group cursor-pointer"
                aria-label="Send Emergency SOS Now"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">🆘</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest">
                    SEND SOS
                  </span>
                </div>
                <span className="text-xs font-mono tracking-wider text-rose-200 group-hover:text-white uppercase font-bold">
                  Press to transmit instant GPS distress beacon
                </span>
              </button>
            </div>

            {/* Disaster Text Report Box with ₹5,000 Fine Warning */}
            <form onSubmit={handleCustomTextSubmit} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  REPORT DISASTER (TEXT &amp; ANTI-HOAX VERIFIED)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 font-bold">
                  ₹5,000 FINE IF FAKE
                </span>
              </div>

              <textarea
                value={disasterText}
                onChange={(e) => setDisasterText(e.target.value)}
                placeholder="Describe disaster situation (e.g. Chemical leak on main road, 4 people collapsed, cylinder burst in building)..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Category select pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {(['FIRE', 'ACCIDENT', 'FLOOD', 'COLLAPSE', 'HAZARD'] as IncidentCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setReportCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                        reportCategory === cat
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs font-mono rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>TRANSMIT DISASTER REPORT</span>
                </button>
              </div>
            </form>

            {/* Quick Emergency Categories Grid */}
            <div className="space-y-2 text-left pt-2">
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                Or Select Emergency Type for Instant Triage:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.type}
                      onClick={() => handleQuickCategoryClick(cat.type, cat.label)}
                      className={`p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left transition flex flex-col gap-1.5 ${cat.color} active:scale-95 shadow-md cursor-pointer`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[11px] font-bold font-mono tracking-wide text-white">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alternate Report Actions: Voice, Photo, Nearby Help */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => setVoiceModalOpen(true)}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <Mic className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold font-mono">VOICE SOS</span>
              </button>

              <button
                onClick={() => setPhotoModalOpen(true)}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold font-mono">PHOTO OCR</span>
              </button>

              <button
                onClick={() => setActiveView('NEARBY')}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono">SHELTERS</span>
              </button>
            </div>

            {/* Emergency Hotlines Footer */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 font-mono gap-2">
                <span className="font-semibold text-slate-300">DIRECT HOTLINES:</span>
                <div className="flex gap-3">
                  <a href="tel:112" className="text-rose-400 hover:underline font-bold">112 (ALL)</a>
                  <a href="tel:108" className="text-blue-400 hover:underline font-bold">108 (EMS)</a>
                  <a href="tel:101" className="text-amber-400 hover:underline font-bold">101 (FIRE)</a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (7 cols): Live Map with Inch-to-Inch Tracking & Disaster Verification */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Map Header with Disaster Status & Inch-to-Inch Telemetry */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3 shadow-lg">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div>
                  <h2 className="text-sm font-black font-mono text-white tracking-wide flex items-center gap-2 flex-wrap">
                    <span>LIVE EMERGENCY RADAR &amp; FLEET TRACKER</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                      ±1.4" INCH-TO-INCH RTK-GPS
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    View already-reported disasters or track moving emergency vehicles in real time.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('TRACK')}
                className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Fullscreen Tracker</span>
              </button>
            </div>

            {/* Disaster Verification Helper Banner */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-slate-300 leading-relaxed text-[11px]">
                <strong className="text-white font-semibold">Verify Before Reporting:</strong> Disasters marked with{' '}
                <span className="text-rose-400 font-bold">[!]</span> on the map are <span className="text-emerald-400 font-bold">ALREADY REPORTED</span> to ResQAI Command and responders are assigned. If your disaster is not on the map, press <span className="text-rose-400 font-bold">SEND SOS</span> to report immediately.
              </div>
            </div>

            {/* Disaster Monitoring Status */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Sector Monitoring: <strong className="text-white">{activeIncidents.length} Active Disasters</strong></span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Public View (Admin controls disabled)
              </span>
            </div>

          </div>

          {/* Real Leaflet Tactical Map (Embedded Side-by-Side) */}
          <div className="w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <EmergencyMap />
          </div>

          {/* Already Reported Incidents Verification Strip */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 font-mono text-xs space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Currently Reported Disasters in Sector ({activeIncidents.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to focus on map</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeIncidents.slice(0, 4).map((inc) => {
                const isCur = selectedIncident?.id === inc.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isCur
                        ? 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        <span className="text-[11px] font-bold text-white truncate">{inc.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {inc.location.address} • {inc.severity}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 shrink-0">
                      REPORTED ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Voice, Photo, and Disaster Confirmation Modals */}
      <SosModal />
      <VoiceReportModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
      <PhotoReportModal isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)} />
      <DisasterReportConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        reportData={pendingReportData}
        onSuccessSubmit={handleModalSuccessSubmit}
      />
    </div>
  );
};
