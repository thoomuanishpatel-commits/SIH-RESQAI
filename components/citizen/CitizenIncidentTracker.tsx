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

  // Filtered Incidents for Tab 2
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

        {/* TAB 1: RAISE SOS REPORT */}
        {activeTab === 'SOS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* A. Emergency Type Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span>1. Emergency Category</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">Tap to select primary threat</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {(['Rescue', 'Medical', 'Fire', 'Police', 'Food', 'Water'] as const).map(cat => {
                  const Icon = categoryIcons[cat];
                  const colors = categoryColors[cat];
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition group cursor-pointer ${
                        isSelected
                          ? `${colors.activeBg} shadow-lg ring-2 ring-white/20`
                          : `${colors.bg} ${colors.border} text-slate-300 hover:text-white hover:border-white/30`
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${isSelected ? 'text-white' : colors.text}`} />
                      <span className="text-xs font-mono font-bold tracking-wide">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Live Location Detector & Map Pinning Override */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>2. LIVE LOCATION DETECTION</span>
                </div>
                <button
                  type="button"
                  onClick={handleRecalibrateLocation}
                  disabled={isLocating}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring...' : 'Detect Again / Recalibrate'}</span>
                </button>
              </div>

              {/* Map pin override indicator if citizen clicked on map */}
              {pinnedLocation ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>MAP PIN OVERRIDE ACTIVE</span>
                    </div>
                    <div className="text-xs font-mono text-white">
                      {pinnedAddress || 'Resolving reverse geocode location...'}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">
                      GPS: {pinnedLocation.lat.toFixed(5)}° N, {pinnedLocation.lng.toFixed(5)}° E (Manual Click)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClearPinnedLocation}
                    className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="Clear Pin & Return to Live GPS"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-xs text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{userLiveLocation?.address || 'Acquiring high-precision GPS satellite fix...'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span>
                      GPS: <strong className="text-cyan-300">{userLiveLocation?.lat.toFixed(5) || HYDERABAD_FALLBACK_COORDS.lat.toFixed(5)}° N</strong>, <strong className="text-cyan-300">{userLiveLocation?.lng.toFixed(5) || HYDERABAD_FALLBACK_COORDS.lng.toFixed(5)}° E</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Accuracy: <strong className="text-emerald-400">±{userLiveLocation?.accuracy || 5}m</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      Tip: Tap anywhere on map to override pin
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* C. Photo Upload with Gemini 2.5 Flash AI Verification */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>3. Photo Upload & AI Vision Verification</span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="text-[11px] font-mono text-rose-400 hover:text-rose-300 transition"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {!imagePreview ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="citizen-photo-upload"
                  />
                  <label
                    htmlFor="citizen-photo-upload"
                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/5 transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      Take Photo or Upload Distress Image
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Auto-verified by Google Gemini 2.5 Flash Vision
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-white/15 max-h-48 bg-black flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Distress upload"
                      className="object-cover w-full h-48"
                    />
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-cyan-300 font-mono text-xs">
                        <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                        <span className="font-bold">Analyzing scene with Gemini 2.5 Flash Vision...</span>
                        <span className="text-[10px] text-slate-400">Classifying threat severity & casualty markers</span>
                      </div>
                    )}
                  </div>

                  {/* Gemini AI Verification Badge */}
                  {aiAnalysis && !isAnalyzingImage && (
                    <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-2.5 ${
                      aiAnalysis.isFake
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                        : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {aiAnalysis.isFake ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="font-bold uppercase tracking-wider">
                            {aiAnalysis.isFake
                              ? '⚠️ AI Vision Warning: Non-Emergency Detected'
                              : `✅ Gemini Vision Verified: ${aiAnalysis.type}`}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white/10 text-white">
                          GEMINI 2.5 FLASH
                        </span>
                      </div>

                      {aiAnalysis.isFake ? (
                        <p className="text-[11px] text-rose-300">
                          {aiAnalysis.description || 'No active emergency detected in image. Please ensure photo captures the emergency condition.'}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-slate-200 text-xs">{aiAnalysis.description}</p>
                          
                          {/* Severity Gauge */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Threat Severity Meter:</span>
                              <strong className="text-amber-400">{aiAnalysis.severity}%</strong>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(10, aiAnalysis.severity))}%` }}
                              />
                            </div>
                          </div>

                          {/* Casualties & Resources */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[10px] text-amber-300">
                              Casualties: ~{aiAnalysis.casualtyEstimate}
                            </span>
                            {aiAnalysis.trappedCount > 0 && (
                              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-[10px] text-rose-300 font-bold">
                                Trapped: {aiAnalysis.trappedCount}
                              </span>
                            )}
                            {aiAnalysis.requiredResources?.map((res, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-[10px] text-blue-300">
                                🚒 {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {aiError && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300">
                      Notice: {aiError} (Manual report will still be processed immediately).
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* D. Distress Description & Trapped Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  4. Distress Description / Details (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Flood water rising fast on ground floor, 2 seniors need immediate boat rescue..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500 transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Trapped Count
                </label>
                <div className="flex items-center h-[62px]">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={trappedCount}
                    onChange={e => setTrappedCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* E. Large Pulsing Action Button */}
            <button
              type="button"
              onClick={handleBroadcastSOS}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl shadow-rose-950/80 border-2 border-rose-400/60 transform active:scale-98 transition duration-150 cursor-pointer animate-pulse disabled:opacity-60"
            >
              <Radio className="w-5 h-5 text-white animate-spin" />
              <span>🚨 BROADCAST EMERGENCY SOS NOW</span>
            </button>
          </div>
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

            {/* Incidents List Cards */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center text-slate-400 font-mono text-xs space-y-2">
                  <Info className="w-6 h-6 text-slate-500 mx-auto" />
                  <div>No matching emergency distress tickets found.</div>
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="text-cyan-400 underline hover:text-cyan-300 text-[11px]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredIncidents.map(inc => {
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
                })
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
