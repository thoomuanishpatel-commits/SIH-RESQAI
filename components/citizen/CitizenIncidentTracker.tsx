'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  CarFront,
  Waves,
  Building2,
  UserX,
  AlertTriangle,
  Camera,
  MapPin,
  Compass,
  PhoneCall,
  ShieldCheck,
  Clock,
  ArrowRight,
  HeartPulse,
  Truck,
  CheckCircle2,
  Activity,
  Navigation,
  RefreshCw,
  Search,
  Copy,
  Check,
  Share2,
  Sparkles,
  Users,
  Building,
  ShieldAlert,
  Radio,
  ExternalLink,
  Info,
  Layers,
  X
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { Incident, IncidentCategory, IncidentSeverity, EmergencyUnit } from '@/types';
import { analyzeEmergencyImageWithGemini, GeminiDisasterAnalysis } from '@/lib/geminiVision';
import { reverseGeocodeCoords, HYDERABAD_FALLBACK_COORDS } from '@/lib/geocoding';
import { CitizenReportWizard } from './CitizenReportWizard';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface CitizenIncidentTrackerProps {
  pinnedLocation: { lat: number; lng: number } | null;
  onClearPinnedLocation: () => void;
  initialIncidentId?: string | null;
}

export const CitizenIncidentTracker: React.FC<CitizenIncidentTrackerProps> = ({
  pinnedLocation,
  onClearPinnedLocation,
  initialIncidentId
}) => {
  const {
    createIncident,
    incidents,
    disasterReports,
    units,
    shelters,
    userLiveLocation,
    refreshUserLocation,
    selectedIncident,
    setSelectedIncident,
    myActiveIncident,
    autoDispatchedUnit
  } = useEmergency();

  // Active Tab: 'SOS' or 'TRACK'
  const [activeTab, setActiveTab] = useState<'SOS' | 'TRACK'>('SOS');

  // Tab 1: Raise SOS Report state
  const [selectedCategory, setSelectedCategory] = useState<'Rescue' | 'Medical' | 'Fire' | 'Police' | 'Food' | 'Water'>('Rescue');
  const [description, setDescription] = useState('');
  const [trappedCount, setTrappedCount] = useState<number>(0);
  const [isLocating, setIsLocating] = useState(false);
  const [pinnedAddress, setPinnedAddress] = useState<string | null>(null);

  // Photo & Gemini Vision AI State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<GeminiDisasterAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submitting state & Success toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  // Tab 2: Track My Ticket state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [copiedIncidentId, setCopiedIncidentId] = useState<string | null>(null);

  // Update reverse geocode when pinnedLocation changes
  useEffect(() => {
    if (pinnedLocation) {
      reverseGeocodeCoords(pinnedLocation.lat, pinnedLocation.lng).then(res => {
        setPinnedAddress(res.address);
      });
    } else {
      setPinnedAddress(null);
    }
  }, [pinnedLocation]);

  // If initialIncidentId is given from URL query param (?incident=...), switch to TRACK tab
  useEffect(() => {
    if (initialIncidentId) {
      setActiveTab('TRACK');
      setSearchQuery(initialIncidentId);
      const matched = incidents.find(i => i.id.toLowerCase() === initialIncidentId.toLowerCase());
      if (matched) {
        setSelectedIncident(matched);
      }
    }
  }, [initialIncidentId, incidents, setSelectedIncident]);

  // Handle Photo Selection and Gemini Vision Scan
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setAiAnalysis(null);
    setAiError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      // Trigger real-time Gemini Vision analysis
      setIsAnalyzingImage(true);
      try {
        const analysis = await analyzeEmergencyImageWithGemini(base64);
        setAiAnalysis(analysis);
        if (analysis.trappedCount > 0) {
          setTrappedCount(analysis.trappedCount);
        }
        if (!description && analysis.description) {
          setDescription(analysis.description);
        }
      } catch (err: any) {
        console.error('Gemini vision error:', err);
        setAiError(err?.message || 'Failed to scan image with AI.');
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setImageFile(null);
    setImagePreview(null);
    setAiAnalysis(null);
    setAiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Recalibrate live location
  const handleRecalibrateLocation = async () => {
    setIsLocating(true);
    try {
      await refreshUserLocation();
    } finally {
      setIsLocating(false);
    }
  };

  // Category mapping
  const categoryTypes: Record<string, IncidentCategory> = {
    Rescue: 'COLLAPSE',
    Medical: 'ACCIDENT',
    Fire: 'FIRE',
    Police: 'HAZARD',
    Food: 'FLOOD',
    Water: 'FLOOD'
  };

  const categoryIcons: Record<string, any> = {
    Rescue: ShieldAlert,
    Medical: HeartPulse,
    Fire: Flame,
    Police: ShieldCheck,
    Food: Users,
    Water: Waves
  };

  const categoryColors: Record<string, { bg: string; activeBg: string; text: string; border: string }> = {
    Rescue: { bg: 'bg-orange-500/10', activeBg: 'bg-orange-500/25 border-orange-400 text-orange-300', text: 'text-orange-400', border: 'border-orange-500/30' },
    Medical: { bg: 'bg-rose-500/10', activeBg: 'bg-rose-500/25 border-rose-400 text-rose-300', text: 'text-rose-400', border: 'border-rose-500/30' },
    Fire: { bg: 'bg-red-500/10', activeBg: 'bg-red-500/25 border-red-400 text-red-300', text: 'text-red-400', border: 'border-red-500/30' },
    Police: { bg: 'bg-blue-500/10', activeBg: 'bg-blue-500/25 border-blue-400 text-blue-300', text: 'text-blue-400', border: 'border-blue-500/30' },
    Food: { bg: 'bg-amber-500/10', activeBg: 'bg-amber-500/25 border-amber-400 text-amber-300', text: 'text-amber-400', border: 'border-amber-500/30' },
    Water: { bg: 'bg-cyan-500/10', activeBg: 'bg-cyan-500/25 border-cyan-400 text-cyan-300', text: 'text-cyan-400', border: 'border-cyan-500/30' }
  };

  // Submit SOS Report
  const handleBroadcastSOS = () => {
    setIsSubmitting(true);

    const activeCoords = pinnedLocation ? {
      lat: pinnedLocation.lat,
      lng: pinnedLocation.lng,
      address: pinnedAddress || `Manual Pin: ${pinnedLocation.lat.toFixed(5)}° N, ${pinnedLocation.lng.toFixed(5)}° E`,
      zone: 'Pinned Emergency Grid'
    } : userLiveLocation ? {
      lat: userLiveLocation.lat,
      lng: userLiveLocation.lng,
      address: userLiveLocation.address,
      zone: userLiveLocation.zone
    } : {
      lat: HYDERABAD_FALLBACK_COORDS.lat,
      lng: HYDERABAD_FALLBACK_COORDS.lng,
      address: HYDERABAD_FALLBACK_COORDS.address,
      zone: HYDERABAD_FALLBACK_COORDS.zone
    };

    const incidentType = categoryTypes[selectedCategory] || 'HAZARD';
    const severity: IncidentSeverity = (aiAnalysis && !aiAnalysis.isFake && aiAnalysis.severity > 75)
      ? 'CRITICAL'
      : (aiAnalysis && !aiAnalysis.isFake && aiAnalysis.severity > 40)
      ? 'HIGH'
      : 'HIGH';

    const newId = createIncident({
      type: incidentType,
      title: `${selectedCategory.toUpperCase()} EMERGENCY: ${activeCoords.address.split(',')[0]}`,
      description: description || `Citizen reported distress: ${selectedCategory} assistance required immediately.`,
      severity: severity,
      reportedVia: 'SOS',
      estimatedCasualties: (aiAnalysis && !aiAnalysis.isFake) ? aiAnalysis.casualtyEstimate : 1,
      trappedCount: trappedCount || (aiAnalysis && !aiAnalysis.isFake ? aiAnalysis.trappedCount : 0),
      photoUrl: imagePreview || undefined,
      verificationPhotoUrl: imagePreview || undefined,
      location: activeCoords,
      aiAnalysis: aiAnalysis && !aiAnalysis.isFake ? {
        detectedHazards: [aiAnalysis.type, ...aiAnalysis.requiredResources],
        confidence: 0.96,
        recommendedDepartment: aiAnalysis.type === 'Fire' ? 'FIRE BRIGADE' : aiAnalysis.type === 'Medical Emergency' ? 'EMERGENCY MEDICAL SERVICE' : 'DISASTER RESCUE SQUAD',
        reasoning: aiAnalysis.description,
        sentimentUrgency: aiAnalysis.severity
      } : undefined
    });

    setJustCreatedId(newId);
    setIsSubmitting(false);

    // Reset Form fields
    setDescription('');
    handleClearPhoto();
    if (pinnedLocation) {
      onClearPinnedLocation();
    }

    // Switch to tracking tab to track newly created ticket
    setActiveTab('TRACK');
    setSearchQuery(newId);
  };

  // Copy shareable ticket link
  const handleCopyTicketLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/citizen?incident=${id}`;
      try {
        navigator.clipboard.writeText(url);
        setCopiedIncidentId(id);
        setTimeout(() => setCopiedIncidentId(null), 2500);
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    }
  };

  // Filtered Incidents & Disaster Reports for Tab 2
  const filteredDisasterReports = disasterReports.filter(rep => {
    const matchesQuery = searchQuery.trim() === '' ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'ACTIVE') {
      return matchesQuery && rep.status !== 'RESOLVED' && rep.status !== 'REJECTED' && rep.status !== 'FALSE_REPORT';
    }
    if (statusFilter === 'RESOLVED') {
      return matchesQuery && (rep.status === 'RESOLVED' || rep.status === 'REJECTED' || rep.status === 'FALSE_REPORT');
    }
    return matchesQuery;
  });

  const filteredIncidents = incidents.filter(inc => {
    // Search query matching
    const matchesQuery = searchQuery.trim() === '' ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    if (statusFilter === 'ACTIVE') {
      return matchesQuery && inc.status !== 'RESOLVED';
    }
    if (statusFilter === 'RESOLVED') {
      return matchesQuery && inc.status === 'RESOLVED';
    }
    return matchesQuery;
  });

  // Helper to get nearest/assigned unit for an incident
  const getAssignedResponder = (inc: Incident): { unit: EmergencyUnit | null; distanceKm: number; etaMins: number } => {
    if (autoDispatchedUnit && inc.id === myActiveIncident?.id) {
      const dist = calculateDistanceKm(
        autoDispatchedUnit.location.lat,
        autoDispatchedUnit.location.lng,
        inc.location.lat,
        inc.location.lng
      );
      return {
        unit: autoDispatchedUnit,
        distanceKm: dist,
        etaMins: autoDispatchedUnit.etaMinutes || Math.max(1, Math.round(dist * 2.5))
      };
    }

    // Find assigned unit from units list
    const assignedId = inc.assignedUnits?.[0];
    let unit = units.find(u => u.id === assignedId);
    if (!unit) {
      // Find nearest unit of matching or EMS type
      const suitableUnits = units.filter(u => u.status === 'EN_ROUTE' || u.status === 'ON_SCENE' || u.status === 'AVAILABLE');
      if (suitableUnits.length > 0) {
        unit = suitableUnits[0];
      }
    }

    if (unit) {
      const dist = calculateDistanceKm(unit.location.lat, unit.location.lng, inc.location.lat, inc.location.lng);
      return {
        unit,
        distanceKm: dist,
        etaMins: unit.etaMinutes || Math.max(1, Math.round(dist * 2.2))
      };
    }

    return { unit: null, distanceKm: 0, etaMins: 0 };
  };

  // 4-stage pipeline status helper
  const getStatusStepIndex = (status: string): number => {
    switch (status) {
      case 'REPORTED': return 0;
      case 'VERIFIED':
      case 'DISPATCHED': return 1;
      case 'ON_SCENE': return 2;
      case 'RESOLVED': return 3;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast banner when a new ticket is submitted */}
      {justCreatedId && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-3 text-white animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-mono font-bold text-emerald-300">
                DISTRESS SOS BROADCAST TRANSMITTED
              </div>
              <div className="text-sm font-bold">
                Ticket ID: <span className="font-mono text-cyan-300">{justCreatedId}</span>
              </div>
              <div className="text-xs text-slate-300">
                Live responder units notified. Tracking activated below.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleCopyTicketLink(justCreatedId)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow transition"
          >
            {copiedIncidentId === justCreatedId ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE TICKET</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Dual-Tabbed Interactive Card */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Tab Switcher Headers */}
        <div className="grid grid-cols-2 p-1.5 bg-black/50 border border-white/10 rounded-2xl gap-1.5">
          <button
            onClick={() => setActiveTab('SOS')}
            className={`py-3 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'SOS'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/40 border border-rose-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>RAISE SOS REPORT</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACK')}
            className={`py-3 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'TRACK'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>TRACK MY TICKET ({incidents.filter(i => i.status !== 'RESOLVED').length})</span>
          </button>
        </div>

        {/* TAB 1: RAISE DISASTER / SOS REPORT (Modern 6-step Wizard with Legal Notice, Face Privacy & Safety Guides) */}
        {activeTab === 'SOS' && (
          <CitizenReportWizard
            pinnedLocation={pinnedLocation}
            onClearPinnedLocation={onClearPinnedLocation}
            onNavigateToTrack={(reportId) => {
              setActiveTab('TRACK');
              setSearchQuery(reportId);
            }}
          />
        )}


        {/* TAB 2: TRACK MY TICKET */}
        {activeTab === 'TRACK' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Omnibar search & Filter Pills */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Lookup ticket by ID (e.g. RQ-204891) or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500/70"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 font-bold">Filter:</span>
                {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      statusFilter === f
                        ? 'bg-cyan-500 text-black shadow'
                        : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Incidents & Disaster Reports List Cards */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredDisasterReports.length === 0 && filteredIncidents.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center text-slate-400 font-mono text-xs space-y-2">
                  <Info className="w-6 h-6 text-slate-500 mx-auto" />
                  <div>No matching emergency distress reports found.</div>
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="text-cyan-400 underline hover:text-cyan-300 text-[11px]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Verified Disaster Reports */}
                  {filteredDisasterReports.map(rep => {
                    const statusColors: Record<string, string> = {
                      SUBMITTED: 'bg-blue-950/80 border-blue-600/50 text-blue-300',
                      UNDER_VERIFICATION: 'bg-amber-950/80 border-amber-600/50 text-amber-300',
                      VERIFIED: 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300',
                      DISPATCHED: 'bg-indigo-950/80 border-indigo-600/50 text-indigo-300',
                      RESOLVED: 'bg-zinc-800/80 border-zinc-600/50 text-slate-300',
                      REJECTED: 'bg-zinc-900/80 border-zinc-700 text-slate-500',
                      FALSE_REPORT: 'bg-rose-950/80 border-rose-600/70 text-rose-300'
                    };

                    return (
                      <div
                        key={rep.id}
                        className="p-4 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-300">
                              {rep.id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                              statusColors[rep.status] || 'bg-slate-800 text-slate-300'
                            }`}>
                              {rep.status.replace('_', ' ')}
                            </span>
                            {rep.faceMetadata?.faceDetected ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-600/40 text-blue-300 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Faces Protected</span>
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTicketLink(rep.id);
                            }}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1 transition"
                            title="Copy report ID"
                          >
                            {copiedIncidentId === rep.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3 text-slate-400" />
                                <span>SHARE</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{rep.category.toUpperCase()} DISASTER REPORT</span>
                            {rep.aiAnalysis && (
                              <span className="text-[10px] font-mono text-emerald-400 font-normal">
                                (AI Match: {rep.aiAnalysis.confidence}%)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 font-mono mt-1 line-clamp-2">
                            {rep.description}
                          </p>
                          <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{rep.location.address}</span>
                          </div>
                        </div>

                        {rep.status === 'FALSE_REPORT' && rep.adminVerification?.penaltyNoticeAmount && (
                          <div className="p-2 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs font-mono text-rose-300">
                            ⚠️ Classified as Unsubstantiated Report. Statutory warning recorded (Demo Penalty: ₹{rep.adminVerification.penaltyNoticeAmount.toLocaleString('en-IN')}).
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredIncidents.map(inc => {
                    const isSelected = selectedIncident?.id === inc.id;
                    const resp = getAssignedResponder(inc);
                    const stepIndex = getStatusStepIndex(inc.status);

                    return (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                          isSelected
                            ? 'bg-cyan-950/30 border-cyan-500/60 shadow-xl ring-1 ring-cyan-500/40'
                            : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Card Header: Type Badge & Severity Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-300">
                              {inc.id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              inc.severity === 'CRITICAL'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {inc.type} • {inc.severity}
                            </span>
                          </div>

                          {/* Share ticket button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTicketLink(inc.id);
                            }}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1 transition"
                            title="Copy direct shareable link"
                          >
                            {copiedIncidentId === inc.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3 text-slate-400" />
                                <span>SHARE</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Title & Location */}
                        <div>
                          <div className="text-sm font-bold text-white">{inc.title}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{inc.location.address}</span>
                          </div>
                        </div>

                        {/* Live 4-Stage Responder Status Pipeline */}
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                            Responder Status Pipeline
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                            {(['REPORTED', 'DISPATCHED', 'AT SCENE', 'RESOLVED'] as const).map((stage, i) => {
                              const isDone = i <= stepIndex;
                              const isCurrent = i === stepIndex;

                              return (
                                <div
                                  key={stage}
                                  className={`py-1 px-1 rounded font-bold border transition ${
                                    isCurrent
                                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                                      : isDone
                                      ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400'
                                      : 'bg-black/30 border-white/5 text-slate-600'
                                  }`}
                                >
                                  {stage}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Assigned Responder Details (Ambulance / Fire / Police) */}
                        {resp.unit && (
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-200">
                                  {resp.unit.callsign} ({resp.unit.type})
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Crew: {resp.unit.crewMembers?.slice(0, 2).join(', ') || resp.unit.driverName || 'TSDMA Squad'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400">DISTANCE & ETA</div>
                              <div className="font-bold text-cyan-300">
                                {resp.distanceKm} km • <strong className="text-emerald-400">{resp.etaMins}m ETA</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voluntary Relief Shelters Directory */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>VOLUNTARY RELIEF SHELTERS DIRECTORY</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {shelters.filter(s => s.isOpen).length} OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
          {shelters.map(shelter => {
            const vacantBeds = Math.max(0, shelter.capacity - shelter.occupancy);
            const occupancyPct = Math.round((shelter.occupancy / shelter.capacity) * 100);

            return (
              <div
                key={shelter.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 hover:border-emerald-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-white">{shelter.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{shelter.location.address}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                    shelter.isOpen
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {shelter.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                {/* Vacant Beds Gauge */}
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bed Availability:</span>
                    <strong className="text-emerald-400 font-bold">
                      {vacantBeds} / {shelter.capacity} Vacant
                    </strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {shelter.contactNumber && (
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Helpline:</span>
                    <a
                      href={`tel:${shelter.contactNumber.replace(/[^0-9+]/g, '')}`}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{shelter.contactNumber}</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Helpline Directory (One-Click Dialing) */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <PhoneCall className="w-4 h-4 text-rose-400" />
          <span>Emergency Helpline Directory (One-Click Dialing)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <a
            href="tel:1070"
            className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 text-amber-300 transition flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <span className="text-base font-black font-mono">📞 1070</span>
            <span className="text-[10px] font-mono text-slate-300 mt-1 uppercase font-bold">
              National Disaster
            </span>
            <span className="text-[9px] text-amber-400 group-hover:underline">Tap to Call</span>
          </a>

          <a
            href="tel:108"
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-400 text-rose-300 transition flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <span className="text-base font-black font-mono">🚑 108</span>
            <span className="text-[10px] font-mono text-slate-300 mt-1 uppercase font-bold">
              Ambulance SOS
            </span>
            <span className="text-[9px] text-rose-400 group-hover:underline">Tap to Call</span>
          </a>

          <a
            href="tel:101"
            className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-400 text-red-300 transition flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <span className="text-base font-black font-mono">🚒 101</span>
            <span className="text-[10px] font-mono text-slate-300 mt-1 uppercase font-bold">
              Fire Control
            </span>
            <span className="text-[9px] text-red-400 group-hover:underline">Tap to Call</span>
          </a>

          <a
            href="tel:100"
            className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400 text-blue-300 transition flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <span className="text-base font-black font-mono">🚓 100</span>
            <span className="text-[10px] font-mono text-slate-300 mt-1 uppercase font-bold">
              Police Control
            </span>
            <span className="text-[9px] text-blue-400 group-hover:underline">Tap to Call</span>
          </a>
        </div>
      </div>

    </div>
  );
};
