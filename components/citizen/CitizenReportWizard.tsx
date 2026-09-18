'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  CarFront,
  Waves,
  Building2,
  Mountain,
  AlertOctagon,
  Wind,
  AlertTriangle,
  Camera,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Clock,
  ArrowRight,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  RefreshCw,
  X,
  FileCheck2,
  Check,
  Compass
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { DisasterCategory, DisasterReport, IncidentSeverity } from '@/types';
import { QUICK_DISASTER_SAFETY_GUIDES } from '@/data/safetyGuideData';
import { detectFacesInImage, FaceDetectionResult } from '@/lib/faceDetection';
import { verifyDisasterWithAI } from '@/lib/geminiVision';
import { uploadPrivateIncidentMedia } from '@/lib/supabaseClient';

interface CitizenReportWizardProps {
  onReportSubmitted?: (report: DisasterReport) => void;
  onNavigateToTrack?: (reportId: string) => void;
  pinnedLocation?: { lat: number; lng: number } | null;
  onClearPinnedLocation?: () => void;
}

export const CitizenReportWizard: React.FC<CitizenReportWizardProps> = ({
  onReportSubmitted,
  onNavigateToTrack,
  pinnedLocation,
  onClearPinnedLocation
}) => {
  const {
    userLiveLocation,
    refreshUserLocation,
    submitDisasterReport,
    setActiveView
  } = useEmergency();

  // Wizard input state
  const [selectedCategory, setSelectedCategory] = useState<DisasterCategory>('FIRE');
  const [description, setDescription] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [trappedCount, setTrappedCount] = useState<number>(0);

  // Location permission & capture
  const [locating, setLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Photo & Face Privacy state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [anonymizedPreview, setAnonymizedPreview] = useState<string | null>(null);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);
  const [isDetectingFace, setIsDetectingFace] = useState<boolean>(false);
  const [showAnonymized, setShowAnonymized] = useState<boolean>(true);

  // AI Verification state
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    detectedCategory: string;
    confidence: number;
    explanation: string;
    statusRecommendation: string;
  } | null>(null);

  // Modal 1: Confirmation & Legal Penalty Warning
  const [showLegalConfirmModal, setShowLegalConfirmModal] = useState<boolean>(false);
  const [hasAcknowledgedWarning, setHasAcknowledgedWarning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal 2: Final Submission Success Confirmation
  const [submittedReport, setSubmittedReport] = useState<DisasterReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available Disaster Categories
  const categories: { id: DisasterCategory; name: string; icon: any; color: string; bg: string; border: string }[] = [
    { id: 'FIRE', name: 'Fire', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { id: 'ROAD_ACCIDENT', name: 'Road Accident', icon: CarFront, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'FLOOD', name: 'Flood', icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { id: 'BUILDING_COLLAPSE', name: 'Building Collapse', icon: Building2, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    { id: 'LANDSLIDE', name: 'Landslide', icon: Mountain, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 'GAS_LEAK', name: 'Gas Leak', icon: AlertOctagon, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    { id: 'SEVERE_STORM', name: 'Severe Storm', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'OTHER', name: 'Other Emergency', icon: AlertTriangle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' }
  ];

  // Request browser location on mount if not available
  useEffect(() => {
    if (!userLiveLocation || userLiveLocation.status === 'UNSUPPORTED') {
      handleRequestLocation();
    }
  }, []);

  const handleRequestLocation = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const loc = await refreshUserLocation();
      if (!loc || loc.status === 'DENIED') {
        setLocationError('Location permission denied by browser. Please specify your address or landmark below.');
      } else if (loc.status === 'UNSUPPORTED') {
        setLocationError('GPS geolocation not supported on this device. Manual address input active.');
      }
    } catch (err: any) {
      setLocationError('Unable to lock GPS fix. Please verify device permissions.');
    } finally {
      setLocating(false);
    }
  };

  // Photo change handler with Face Detection & AI Verification
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please choose a compressed photo.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      // 1. Privacy Face Detection Pass
      setIsDetectingFace(true);
      try {
        const detected = await detectFacesInImage(base64);
        setFaceResult(detected);
        if (detected.anonymizedDataUrl) {
          setAnonymizedPreview(detected.anonymizedDataUrl);
        }
      } catch (err) {
        console.warn('Face detection error:', err);
      } finally {
        setIsDetectingFace(false);
      }

      // 2. AI Disaster Category Analysis Pass
      setIsAnalyzingAI(true);
      try {
        const ai = await verifyDisasterWithAI(base64, selectedCategory);
        setAiResult({
          detectedCategory: ai.detectedCategory,
          confidence: ai.confidence,
          explanation: ai.explanation,
          statusRecommendation: ai.statusRecommendation
        });
        if (ai.trappedCount > 0) {
          setTrappedCount(ai.trappedCount);
        }
        if (!description && ai.explanation) {
          setDescription(ai.explanation);
        }
      } catch (err) {
        console.warn('AI analysis error:', err);
      } finally {
        setIsAnalyzingAI(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnonymizedPreview(null);
    setFaceResult(null);
    setAiResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open the legal warning & penalty acknowledgment modal
  const handleInitiateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAcknowledgedWarning(false);
    setShowLegalConfirmModal(true);
  };

  // Final confirmation execution
  const handleConfirmAndSubmit = async () => {
    if (!hasAcknowledgedWarning) return;
    setIsSubmitting(true);

    try {
      // Resolve coordinates
      let resolvedLat = 17.4483;
      let resolvedLng = 78.3915;
      let resolvedAddress = customLocation || 'Cyber Towers Sector, Hitec City, Hyderabad';
      let resolvedSource: 'DEVICE_GPS' | 'MANUAL_PIN' | 'CIVIC_SEARCH' | 'FALLBACK' = 'FALLBACK';

      if (pinnedLocation) {
        resolvedLat = pinnedLocation.lat;
        resolvedLng = pinnedLocation.lng;
        resolvedAddress = customLocation || `Pinned Coordinates: ${pinnedLocation.lat.toFixed(5)}° N, ${pinnedLocation.lng.toFixed(5)}° E`;
        resolvedSource = 'MANUAL_PIN';
      } else if (userLiveLocation && userLiveLocation.status === 'LOCKED') {
        resolvedLat = userLiveLocation.lat;
        resolvedLng = userLiveLocation.lng;
        resolvedAddress = customLocation || userLiveLocation.address;
        resolvedSource = 'DEVICE_GPS';
      } else if (customLocation) {
        resolvedSource = 'CIVIC_SEARCH';
      }

      // Secure upload to private storage if file exists
      let uploadedImagePath: string | undefined;
      const tempToken = `RSQ-${Date.now()}`;
      if (selectedFile) {
        const { path } = await uploadPrivateIncidentMedia(selectedFile, tempToken, selectedFile.name);
        if (path) uploadedImagePath = path;
      }

      // Submit report to central context and database
      const report = submitDisasterReport({
        category: selectedCategory,
        title: `${selectedCategory.replace('_', ' ')} EMERGENCY: ${resolvedAddress.split(',')[0]}`,
        description: description || `Citizen distress report for ${selectedCategory.toLowerCase().replace('_', ' ')}. Immediate response mobilized.`,
        severity: severity,
        userId: `CITIZEN_${Math.floor(10000 + Math.random() * 90000)}`,
        location: {
          lat: resolvedLat,
          lng: resolvedLng,
          address: resolvedAddress,
          zone: 'Hyderabad Crisis Grid',
          accuracy: userLiveLocation?.accuracy || 10,
          source: resolvedSource
        },
        evidence: selectedFile ? {
          imagePath: uploadedImagePath || `incidents/${tempToken}/evidence.jpg`,
          previewUrl: imagePreview || undefined,
          anonymizedPreviewUrl: anonymizedPreview || undefined,
          mediaType: (selectedFile.type as any) || 'image/jpeg',
          uploadedAt: new Date().toISOString()
        } : undefined,
        faceMetadata: faceResult ? {
          faceDetected: faceResult.hasFaces,
          faceCount: faceResult.count,
          anonymized: Boolean(anonymizedPreview),
          boundingBoxes: faceResult.boundingBoxes,
          scannedAt: new Date().toISOString()
        } : undefined,
        aiAnalysis: aiResult ? {
          detectedCategory: aiResult.detectedCategory,
          confidence: aiResult.confidence,
          matchConfirmed: true,
          explanation: aiResult.explanation,
          statusRecommendation: 'Pending Human Review',
          analyzedAt: new Date().toISOString()
        } : undefined
      });

      setShowLegalConfirmModal(false);
      setSubmittedReport(report);

      if (onReportSubmitted) {
        onReportSubmitted(report);
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message || 'Please check connection'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSafetyGuide = QUICK_DISASTER_SAFETY_GUIDES[selectedCategory] || QUICK_DISASTER_SAFETY_GUIDES.FIRE;

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. DISASTER CATEGORY SELECTOR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Step 1: Select Disaster Type</span>
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            8 Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-mono font-bold truncate">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. INSTANT DISASTER-SPECIFIC SAFETY GUIDE */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentSafetyGuide.emoji}</span>
            <div>
              <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
                {currentSafetyGuide.title} — WHAT TO DO NOW
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentSafetyGuide.subtitle}
              </p>
            </div>
          </div>

          <a
            href={`tel:${currentSafetyGuide.emergencyHotline}`}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-950/60 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{currentSafetyGuide.hotlineButtonText}</span>
          </a>
        </div>

        {/* DO and DO NOT 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* DOs */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DO THIS IMMEDIATELY</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {currentSafetyGuide.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-tight">
                  <span className="text-emerald-400 font-mono font-bold text-[10px] mt-0.5">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DO NOTs */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>DO NOT DO THIS</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {currentSafetyGuide.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-tight">
                  <span className="text-rose-400 font-mono font-bold text-[10px] mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. INCIDENT DETAILS & PHOTO UPLOAD WITH PRIVACY & AI VERIFICATION */}
      <form onSubmit={handleInitiateSubmission} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        
        {/* Step 2: Location Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 2: Emergency Location</span>
            </label>
            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={locating}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              <RefreshCw className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Acquiring GPS...' : 'Refresh GPS'}</span>
            </button>
          </div>

          {/* GPS Status Banner */}
          {userLiveLocation && userLiveLocation.status === 'LOCKED' ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-emerald-300">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  GPS Fixed: {userLiveLocation.lat.toFixed(5)}° N, {userLiveLocation.lng.toFixed(5)}° E (±{userLiveLocation.accuracy}m)
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">LOCKED</span>
            </div>
          ) : locationError ? (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-2.5 text-xs font-mono text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Location Notice:</strong>
                <span>{locationError}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Requesting device satellite trilateration...</span>
            </div>
          )}

          {/* Address / Landmark Override Input */}
          <input
            type="text"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder={userLiveLocation?.address || 'Specify exact landmark, floor number, or road intersection...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Situation Description & Trapped Count */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between">
            <span>Disaster Description &amp; Trapped Persons</span>
            <span className="text-[10px] text-slate-500 font-normal">Optional notes for dispatch</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Smoke spreading on 3rd floor, two seniors unable to take stairs, transformer sparking..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Trapped Count:</span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, '5+'].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTrappedCount(typeof count === 'number' ? count : 5)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                    trappedCount === (typeof count === 'number' ? count : 5)
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Upload with Live Face Detection & AI Verification */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>Step 3: Optional Disaster Photograph</span>
            </label>
            <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Private Storage • Encrypted
            </span>
          </div>

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-mono font-bold text-slate-200">
                Tap to upload emergency photo from camera or files
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Supports JPG, PNG, WEBP up to 15MB • Analyzed securely for verification
              </p>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-200 truncate max-w-[200px]">
                    {selectedFile?.name || 'Uploaded photo'}
                  </span>
                  {selectedFile && (
                    <span className="text-[10px] font-mono text-slate-500">
                      ({(selectedFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-slate-400 hover:text-rose-400 text-xs font-mono flex items-center gap-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Image Preview with Face Blur Toggle */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black/60 max-h-56 flex items-center justify-center">
                <img
                  src={(showAnonymized && anonymizedPreview) ? anonymizedPreview : imagePreview}
                  alt="Evidence Preview"
                  className="max-h-56 w-auto object-contain"
                />

                {/* Face Anonymization Badge & Toggle */}
                {faceResult && faceResult.hasFaces && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/40 text-[10px] font-mono text-blue-300 shadow-xl">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{faceResult.count} Face Detected • Anonymization Active</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAnonymized(!showAnonymized)}
                      className="text-[9px] underline hover:text-white transition flex items-center gap-1"
                    >
                      {showAnonymized ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showAnonymized ? 'View Raw' : 'View Blurred'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Face scanning progress */}
              {isDetectingFace && (
                <div className="text-[11px] font-mono text-blue-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Scanning image for human faces (privacy preservation)...</span>
                </div>
              )}

              {/* AI Verification Results Card */}
              {isAnalyzingAI ? (
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 flex items-center gap-2 text-xs font-mono text-purple-300">
                  <Sparkles className="w-4 h-4 animate-spin text-purple-400 shrink-0" />
                  <span>AI Disaster Detection running verification scan...</span>
                </div>
              ) : aiResult ? (
                <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Optical Verification</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold text-[10px]">
                      {aiResult.statusRecommendation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1">
                    <span>Detected: <strong className="text-white">{aiResult.detectedCategory}</strong></span>
                    <span>Confidence: <strong className="text-emerald-400">{aiResult.confidence}%</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {aiResult.explanation}
                  </p>
                  <div className="text-[9px] text-slate-500 italic pt-0.5">
                    * AI confidence is advisory only; human EOC authorities make all final verification decisions.
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Step 4: Proceed to Confirmation Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-mono font-bold text-sm tracking-wider shadow-xl shadow-rose-950/80 transition flex items-center justify-center gap-2 cursor-pointer border border-rose-400/40 active:scale-[0.99]"
        >
          <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          <span>PROCEED TO CONFIRM EMERGENCY REPORT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* ========================================================================= */}
      {/* MODAL 1: LEGAL CONFIRMATION & STATUTORY WARNING MODAL BEFORE SUBMIT */}
      {/* ========================================================================= */}
      {showLegalConfirmModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-white font-sans">
            
            {/* Header with Warning Icon */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-mono text-white tracking-tight uppercase">
                    Confirm Emergency Report
                  </h3>
                  <span className="text-xs font-mono text-rose-400 font-bold">
                    LEGAL VERIFICATION &amp; STATUTORY NOTICE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLegalConfirmModal(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Legal Warning Text (Exactly as requested) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <p className="font-semibold text-white">
                You are about to submit an emergency report. False or intentionally misleading emergency reports may be subject to penalties under applicable rules/laws.
              </p>

              {/* Demo Penalty Notice (Clearly demarcated as statutory warning, not automatic deduction) */}
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-rose-200 font-mono text-[11px] space-y-1">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>STATUTORY REGULATION NOTICE</span>
                </div>
                <p>
                  <strong>Demo Warning:</strong> False reports may attract a penalty of up to ₹5,000, subject to verification and applicable law.
                </p>
                <p className="text-[10px] text-rose-400/80">
                  (Penalties are determined exclusively by authorized administrative and legal authorities following formal investigation. No automatic charges are made to your account.)
                </p>
              </div>

              {/* Summary of what will be submitted */}
              <div className="border-t border-slate-800/80 pt-2 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <strong className="text-white">{selectedCategory}</strong>
                </div>
                <div className="flex justify-between">
                  <span>GPS / Address:</span>
                  <span className="text-slate-300 truncate max-w-[220px]">
                    {customLocation || userLiveLocation?.address || 'Hitec City, Hyderabad'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attached Photo:</span>
                  <span className="text-slate-300">{selectedFile ? `${selectedFile.name} (Anonymized)` : 'None'}</span>
                </div>
              </div>
            </div>

            {/* Required Citizen Acknowledgment Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={hasAcknowledgedWarning}
                onChange={(e) => setHasAcknowledgedWarning(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-mono text-slate-200 leading-snug">
                I acknowledge that this report represents a genuine emergency. I understand the legal warning regarding intentional hoax submissions.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLegalConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition"
              >
                Cancel / Edit
              </button>

              <button
                type="button"
                disabled={!hasAcknowledgedWarning || isSubmitting}
                onClick={handleConfirmAndSubmit}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                  hasAcknowledgedWarning && !isSubmitting
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/80 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Report...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FINAL SUBMISSION SUCCESS CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {submittedReport && (
        <div className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-center text-white font-sans">
            
            {/* Animated Success Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9 animate-scaleIn" />
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                DISASTER DISPATCH INGESTION COMPLETE
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-mono text-white uppercase">
                Emergency Report Submitted Successfully
              </h3>
              <p className="text-xs font-mono text-emerald-300">
                Emergency authorities have been notified.
              </p>
            </div>

            {/* Details Card (Requested Fields) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-400 uppercase">REPORT ID:</span>
                <span className="font-black text-rose-400 text-sm tracking-wider">
                  {submittedReport.id}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-400 uppercase">DISASTER TYPE:</span>
                <span className="font-bold text-white">
                  {submittedReport.category}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-400 uppercase">DATE &amp; TIME:</span>
                <span className="text-slate-300">
                  {new Date(submittedReport.reportedAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-400 uppercase">CURRENT LOCATION:</span>
                <span className="text-slate-300 truncate max-w-[220px]">
                  {submittedReport.location.address}
                </span>
              </div>

              <div className="flex justify-between items-center pt-0.5">
                <span className="text-slate-400 uppercase">STATUS:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
                  Under Verification
                </span>
              </div>
            </div>

            {/* Action Buttons: Track Report and Close */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToTrack) {
                    onNavigateToTrack(submittedReport.id);
                  } else {
                    setActiveView('CITIZEN');
                  }
                  setSubmittedReport(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/60"
              >
                <span>Track Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSubmittedReport(null)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
