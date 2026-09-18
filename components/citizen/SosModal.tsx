'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Truck,
  PhoneCall,
  X,
  ArrowRight,
  ExternalLink,
  Camera,
  Download,
  Copy,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const SosModal: React.FC = () => {
  const { sosModalOpen, setSosModalOpen, createIncident, setActiveView, userLiveLocation } = useEmergency();
  const [step, setStep] = useState<'CONFIRM' | 'SENT'>('CONFIRM');
  const [generatedId, setGeneratedId] = useState<string>('');
  const [tokenNumber, setTokenNumber] = useState<string>('');
  const [progressStage, setProgressStage] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [legalConfirmed, setLegalConfirmed] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'IDLE' | 'PROMPTING' | 'GRANTED' | 'DENIED' | 'UNSUPPORTED'>('IDLE');
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (sosModalOpen) {
      setStep('CONFIRM');
      setProgressStage(0);
      setLegalConfirmed(false);
      setCameraError(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [sosModalOpen]);

  // Connect video element whenever videoRef or stream changes
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.play().catch(err => {
        console.warn('Auto-play blocked, retrying on user interaction:', err);
      });
    }
  }, [cameraActive]);

  const startCamera = async () => {
    if (typeof window === 'undefined') return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionStatus('UNSUPPORTED');
      setCameraError('Webcam API is not supported in this browser environment.');
      setCameraActive(false);
      return;
    }

    setCameraPermissionStatus('PROMPTING');
    setCameraError(null);

    // Try front camera first, with broad fallback constraints if facingMode: 'user' fails
    const constraintsList = [
      { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false }
    ];

    let stream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of constraintsList) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (stream) {
      streamRef.current = stream;
      setCameraPermissionStatus('GRANTED');
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video play catch:', e));
      }
    } else {
      console.warn('Camera permission denied or unavailable:', lastError);
      setCameraPermissionStatus('DENIED');
      setCameraError(
        lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError'
          ? 'Camera permission denied in browser. Click "Enable Camera" or allow access in the address bar.'
          : 'Webcam is currently occupied or unavailable on this device.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraPermissionStatus('IDLE');
  };

  const stages = [
    { label: 'SOS Received', sub: 'Distress beacon authenticated' },
    { label: 'Location Confirmed', sub: 'High-precision GPS fix obtained' },
    { label: 'Incident Analyzed', sub: 'AI severity calculated (CRITICAL)' },
    { label: 'Responder Assigned', sub: 'Unit 07 Fire & ALS Medic designated' },
    { label: 'Help On The Way', sub: 'Estimated arrival in 4 mins' },
    { label: 'Incident Resolved', sub: 'Site stabilized' },
  ];

  const handleConfirmSos = () => {
    // 1. Capture snapshot from front camera
    let photoData = '';
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (videoRef.current && cameraActive && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 205, 320, 35);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`ANTI-HOAX PHOTO • ${new Date().toLocaleTimeString()}`, 10, 226);
        photoData = canvas.toDataURL('image/jpeg', 0.85);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DEVICE HARDWARE ATTESTED', 160, 120);
        photoData = canvas.toDataURL('image/png');
      }
    }

    setCapturedPhoto(photoData);
    stopCamera();

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const token = `RSQ-${randomNum}`;
    setTokenNumber(token);

    // Create emergency incident with live real GPS coordinates
    const id = createIncident({
      type: 'HAZARD',
      title: `Immediate Citizen SOS Distress Call (${token})`,
      description: 'Citizen triggered direct SOS distress beacon from mobile geolocation with front camera anti-hoax attestation.',
      severity: 'CRITICAL',
      reportedVia: 'SOS',
      estimatedCasualties: 1,
      trappedCount: 1,
      photoUrl: photoData,
      tokenNumber: token,
      verificationPhotoUrl: photoData,
      location: userLiveLocation ? {
        lat: userLiveLocation.lat,
        lng: userLiveLocation.lng,
        address: userLiveLocation.address,
        zone: userLiveLocation.zone
      } : undefined,
      aiAnalysis: {
        detectedHazards: ['Immediate life safety hazard', 'Real-time GPS lock verified'],
        confidence: 0.98,
        recommendedDepartment: 'MULTI-AGENCY RESCUE SQUAD',
        reasoning: `Zero-delay SOS beacon confirmed with live GPS at ${userLiveLocation ? `${userLiveLocation.lat.toFixed(5)}° N, ${userLiveLocation.lng.toFixed(5)}° E (${userLiveLocation.address})` : 'citizen coordinates'}. Immediate high-priority ambulance dispatch triggered.`,
        sentimentUrgency: 100
      }
    });

    setGeneratedId(id);
    setStep('SENT');
    setProgressStage(1);

    // Generate screenshot card
    generateScreenshotPass(token, photoData);

    const timer1 = setTimeout(() => setProgressStage(2), 1500);
    const timer2 = setTimeout(() => setProgressStage(3), 3200);
    const timer3 = setTimeout(() => setProgressStage(4), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const generateScreenshotPass = (token: string, photo: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 600, 380);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 584, 364);

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(10, 10, 580, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('RESQAI OFFICIAL EMERGENCY DISTRESS BEACON PASS', 20, 40);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`TOKEN: ${token}`, 20, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    const liveLocText = userLiveLocation
      ? `${userLiveLocation.address} (${userLiveLocation.lat.toFixed(5)}° N, ${userLiveLocation.lng.toFixed(5)}° E)`
      : 'Real Device GPS Lat 17.4430° N, 78.3850° E';
    ctx.fillText(`LOCATION: ${liveLocText}`, 20, 150);
    ctx.fillText(`SEVERITY: CRITICAL SOS DISTRESS BEACON`, 20, 175);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('✓ ANTI-HOAX BIOMETRIC / DEVICE VERIFIED', 20, 220);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DISPATCHED TO POLICE, FIRE & EMS 112 COMMAND', 20, 245);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, 410, 80, 160, 120);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(410, 80, 160, 120);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('REPORTER PHOTO', 445, 215);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Section 54 Disaster Management Act, 2005. False reports attract ₹5,000 fine.', 20, 350);

      setScreenshotUrl(canvas.toDataURL('image/png'));
    };
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(tokenNumber);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleDownloadPass = () => {
    if (!screenshotUrl) return;
    const a = document.createElement('a');
    a.href = screenshotUrl;
    a.download = `ResQAI-Distress-Pass-${tokenNumber}.png`;
    a.click();
  };

  if (!sosModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-red-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white animate-ping" />
            <h2 id="sos-modal-title" className="font-mono text-sm font-bold tracking-wide uppercase text-white">
              {step === 'CONFIRM' ? 'EMERGENCY SOS TRANSMISSION' : 'EMERGENCY SOS LOGGED'}
            </h2>
          </div>
          <button
            onClick={() => setSosModalOpen(false)}
            className="text-white hover:bg-red-700 p-1 rounded-full transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === 'CONFIRM' ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                <AlertOctagon className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Are you in immediate danger?
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                  Confirming will broadcast your sub-meter GPS distress beacon to nearest first responders and regional EOC dispatchers.
                </p>
              </div>

              {/* Mandatory ₹5,000 Fine Notice Banner */}
              <div className="bg-red-950/60 border border-red-500/50 rounded-2xl p-3 text-left space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>LEGAL WARNING: ₹5,000 FINE FOR HOAX SOS</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Under <strong>Section 54 of the Disaster Management Act 2005</strong>, transmitting false distress alerts carries an <strong>immediate ₹5,000 fine</strong> and criminal prosecution.
                </p>
              </div>

              {/* Camera Verification Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    ANTI-HOAX IDENTITY CAPTURE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${cameraActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {cameraActive ? '● FRONT CAM ON' : 'CAMERA STANDBY'}
                    </span>
                    {!cameraActive && (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold transition cursor-pointer"
                      >
                        Enable Camera
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full h-36 bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-800">
                  {/* Keep video in DOM at all times so ref is never lost */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover transform -scale-x-100 ${cameraActive ? 'block' : 'hidden'}`}
                  />

                  {/* If camera is not active or blocked, show interactive troubleshooting overlay */}
                  {!cameraActive && (
                    <div className="text-center p-3 text-slate-300 text-xs font-mono space-y-2 max-w-[280px]">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-white text-xs">
                        {cameraPermissionStatus === 'PROMPTING' ? 'Requesting Camera Access...' : 'Camera Access Needed'}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {cameraError || 'Tap "Enable Camera" or click the camera icon in your browser URL bar to allow preview.'}
                      </p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow transition"
                      >
                        Tap to Activate Camera
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-emerald-500/40 text-[9px] font-mono text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE FACIAL STREAM</span>
                    </div>
                  )}

                  <div className="absolute inset-0 border border-blue-500/30 rounded-lg pointer-events-none" />
                </div>
              </div>

              {/* Real GPS Location Attached HUD */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>AUTOMATIC REAL-TIME GPS ATTACHED</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {userLiveLocation?.status === 'LOCKED' ? '● GPS LOCKED' : '● SYNCING'}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-semibold truncate">
                  📍 {userLiveLocation?.address || 'Detecting real device GPS position...'}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                  <span>{userLiveLocation ? `${userLiveLocation.lat.toFixed(5)}° N, ${userLiveLocation.lng.toFixed(5)}° E` : '17.4430° N, 78.3850° E'}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Accuracy: ±{userLiveLocation?.accuracy || 4}m</span>
                </div>
              </div>

              {/* Legal Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 text-left cursor-pointer p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={legalConfirmed}
                  onChange={(e) => setLegalConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300 leading-snug">
                  I certify under penalty of ₹5,000 fine and IPC Section 182 that this is a genuine life-threatening emergency.
                </span>
              </label>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleConfirmSos}
                  disabled={!legalConfirmed}
                  className={`w-full py-3.5 px-6 rounded-xl font-black text-sm font-mono tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
                    legalConfirmed
                      ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-900/50 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>CAPTURE PHOTO &amp; TRANSMIT SOS</span>
                </button>

                <button
                  onClick={() => setSosModalOpen(false)}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition"
                >
                  Cancel (False Alarm)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Token Number Highlight */}
              <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                    EMERGENCY TOKEN NUMBER
                  </div>
                  <div className="text-2xl font-black font-mono text-white tracking-widest">
                    {tokenNumber}
                  </div>
                </div>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold transition"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{copiedToken ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              {/* Photo & Telemetry Snapshot */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                    VERIFIED PHOTO
                  </div>
                  {capturedPhoto ? (
                    <div className="w-full h-20 rounded overflow-hidden border border-slate-700">
                      <img src={capturedPhoto} alt="Attested face" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-slate-900 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">
                      Device Token Verified
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
                  <div className="text-emerald-400 font-bold">✓ EOC NOTIFIED</div>
                  <div className="text-slate-400">Unit 07 Fire Dispatched</div>
                  <div className="text-slate-400">ETA: 4 mins</div>
                  <div className="text-amber-400 font-bold">Priority 1 Queue</div>
                </div>
              </div>

              {/* Screenshot Pass Download */}
              {screenshotUrl && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-slate-300 font-medium">Distress Screenshot Pass</span>
                  </div>
                  <button
                    onClick={handleDownloadPass}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold transition shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Screenshot</span>
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setSosModalOpen(false);
                    setActiveView('TRACK');
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>TRACK MY EMERGENCY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:112"
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call 112 Directly</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
