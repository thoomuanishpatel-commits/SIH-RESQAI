'use client';

import React, { useState } from 'react';
import { Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, X, Eye, ShieldAlert } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';
import { IncidentCategory, IncidentSeverity } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PHOTOS = [
  {
    name: 'Structure Smoke & Flames',
    url: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=800&q=80',
    type: 'FIRE' as IncidentCategory,
    severity: 'CRITICAL' as IncidentSeverity,
    detected: ['Active open fire flames', 'Heavy particulate smoke plume', 'Window glass failure'],
    people: '3–5 in danger on upper floors',
    department: 'Fire & Rescue + Hydraulic Platform',
    confidence: 94
  },
  {
    name: 'Flood Water Inundation',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    type: 'FLOOD' as IncidentCategory,
    severity: 'HIGH' as IncidentSeverity,
    detected: ['Flood water depth ~1.2m', 'Submerged vehicles', 'Erosion damage'],
    people: '6–10 stranded residents',
    department: 'Disaster Relief Squad + Inflatable Powerboat',
    confidence: 91
  },
  {
    name: 'Masonry Building Collapse',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    type: 'COLLAPSE' as IncidentCategory,
    severity: 'CRITICAL' as IncidentSeverity,
    detected: ['Concrete slab failure', 'Exposed rebar', 'Severe structural collapse'],
    people: '2–4 potentially trapped in void spaces',
    department: 'Urban Search & Rescue (USAR) + K9 Unit',
    confidence: 89
  }
];

export const PhotoReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createIncident, setActiveView } = useEmergency();
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTOS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  if (!isOpen) return null;

  const handleSelectSample = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setSelectedPhoto(sample);
    setAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 900);
  };

  const handleConfirmPhotoIncident = () => {
    createIncident({
      type: selectedPhoto.type,
      title: `Photo Verified: ${selectedPhoto.name}`,
      description: `Citizen photo submission analyzed by Computer Vision. Detected: ${selectedPhoto.detected.join(', ')}.`,
      severity: selectedPhoto.severity,
      reportedVia: 'PHOTO',
      photoUrl: selectedPhoto.url,
      estimatedCasualties: 4,
      trappedCount: selectedPhoto.people.includes('trapped') ? 2 : 0,
      aiAnalysis: {
        detectedHazards: selectedPhoto.detected,
        confidence: selectedPhoto.confidence / 100,
        recommendedDepartment: selectedPhoto.department,
        reasoning: `Visual feature extraction confirmed active ${selectedPhoto.type.toLowerCase()} signatures. Priority triage applied.`,
        sentimentUrgency: 92
      }
    });

    onClose();
    setActiveView('TRACK');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-400" />
            <h2 id="photo-modal-title" className="font-mono text-sm font-bold text-white tracking-wide uppercase">
              PHOTO AI INCIDENT ANALYSIS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h3 className="text-xl font-bold text-white">Upload or Capture a Photo</h3>
            <p className="text-xs text-slate-300 mt-1">
              Select or capture a photo from the scene. ResQAI Computer Vision identifies damage severity and hazards.
            </p>
          </div>

          {/* Sample Selectors */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Choose or Simulate Disaster Photo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PHOTOS.map((sample) => {
                const isSelected = selectedPhoto.name === sample.name;
                return (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSample(sample)}
                    className={`relative rounded-lg overflow-hidden border text-left text-xs transition ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/40'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-16 object-cover"
                    />
                    <div className="p-1.5 bg-slate-950/90 text-[10px] font-medium text-slate-200 truncate">
                      {sample.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Photo Preview & Overlay */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img
              src={selectedPhoto.url}
              alt="Emergency Scene Preview"
              className="w-full h-48 object-cover"
            />
            {analyzing && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="text-xs font-mono text-blue-300">Scanning damage bounding boxes...</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <TrustSafetyBadge type="AI_ANALYSIS" />
            </div>
          </div>

          {/* AI Analysis Breakdown */}
          {analysisComplete && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  AI COMPUTER VISION DIAGNOSIS
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedPhoto.confidence}% Match
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block mb-1">DETECTED HAZARDS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPhoto.detected.map(hazard => (
                      <span
                        key={hazard}
                        className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px]"
                      >
                        {hazard}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono block">ESTIMATED SEVERITY</span>
                    <span className="font-bold text-rose-400">{selectedPhoto.severity}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono block">PEOPLE AT RISK</span>
                    <span className="font-bold text-amber-300">{selectedPhoto.people}</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">RECOMMENDED RESPONSE</span>
                  <span className="font-semibold text-blue-300">{selectedPhoto.department}</span>
                </div>
              </div>

              {/* Safety Disclaimer */}
              <div className="bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-amber-300/90 leading-tight">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> AI automated analysis provides rapid decision support for first responders and may contain misclassifications. Field commanders will verify upon arrival.
                </span>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            onClick={handleConfirmPhotoIncident}
            disabled={analyzing}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            CONFIRM & SUBMIT PHOTO REPORT
          </button>
        </div>
      </div>
    </div>
  );
};
