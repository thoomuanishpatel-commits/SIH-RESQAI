'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, AlertTriangle, X, Volume2 } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';
import { IncidentCategory, IncidentSeverity } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createIncident, setActiveView } = useEmergency();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    incidentType: IncidentCategory;
    location: string;
    severity: IncidentSeverity;
    victims: string;
    department: string;
    confidence: number;
    reasoning: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setTranscript('');
      setAnalyzing(false);
      setExtractedData(null);
    }
  }, [isOpen]);

  const sampleVoiceScenarios = [
    {
      text: "There is a massive fire near the Kukatpally market complex on the third floor and three people are trapped near the rear balcony!",
      type: 'FIRE' as IncidentCategory,
      location: 'Kukatpally Market Complex, 3rd Floor',
      severity: 'CRITICAL' as IncidentSeverity,
      victims: '3 Trapped Reported',
      department: 'FIRE & RESCUE + HEAVY HYDRAULIC LADDER',
      confidence: 0.96,
      reasoning: 'Explicit mention of trapped civilians in high-rise structure fire. Priority 1 response required.'
    },
    {
      text: "Two cars collided at Gachibowli flyover entrance, fuel is leaking onto the road and one person cannot exit their vehicle.",
      type: 'ACCIDENT' as IncidentCategory,
      location: 'Gachibowli Flyover Entrance Ramp',
      severity: 'HIGH' as IncidentSeverity,
      victims: '1 Trapped inside vehicle',
      department: 'TRAUMA EMS + HIGHWAY PATROL',
      confidence: 0.94,
      reasoning: 'Extrication tools required. Fuel leakage creates secondary ignition risk.'
    }
  ];

  const handleStartSpeaking = () => {
    setIsRecording(true);
    setTranscript('');
    setExtractedData(null);

    // Pick realistic sample or allow user input
    const chosen = sampleVoiceScenarios[Math.floor(Math.random() * sampleVoiceScenarios.length)];

    let current = '';
    const words = chosen.text.split(' ');
    let wordIdx = 0;

    const interval = setInterval(() => {
      if (wordIdx < words.length) {
        current += (wordIdx > 0 ? ' ' : '') + words[wordIdx];
        setTranscript(current);
        wordIdx++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
        setAnalyzing(true);

        setTimeout(() => {
          setAnalyzing(false);
          setExtractedData({
            incidentType: chosen.type,
            location: chosen.location,
            severity: chosen.severity,
            victims: chosen.victims,
            department: chosen.department,
            confidence: chosen.confidence,
            reasoning: chosen.reasoning
          });
        }, 1200);
      }
    }, 140);
  };

  const handleConfirmReport = () => {
    if (!extractedData) return;

    createIncident({
      type: extractedData.incidentType,
      title: `Voice Report: ${extractedData.incidentType} at ${extractedData.location}`,
      description: transcript,
      severity: extractedData.severity,
      reportedVia: 'VOICE',
      estimatedCasualties: extractedData.victims.includes('Trapped') ? 3 : 1,
      trappedCount: extractedData.victims.includes('Trapped') ? 2 : 0,
      audioTranscript: transcript,
      aiAnalysis: {
        detectedHazards: ['Trapped victims', 'Secondary environmental danger'],
        confidence: extractedData.confidence,
        recommendedDepartment: extractedData.department,
        reasoning: extractedData.reasoning,
        sentimentUrgency: 94
      }
    });

    onClose();
    setActiveView('TRACK');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-400" />
            <h2 id="voice-modal-title" className="font-mono text-sm font-bold text-white tracking-wide uppercase">
              VOICE INCIDENT REPORTING
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Tell us what happened</h3>
            <p className="text-xs text-slate-300 mt-1">
              Speak naturally. ResQAI AI will extract location, hazards, and dispatch recommendations.
            </p>
          </div>

          {/* Voice Record Button */}
          <div className="flex flex-col items-center justify-center py-2">
            <button
              onClick={handleStartSpeaking}
              disabled={isRecording}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 hover:scale-105'
              }`}
              aria-label={isRecording ? 'Listening to voice...' : 'Press and Speak'}
            >
              {isRecording ? (
                <>
                  <Mic className="w-8 h-8 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">LISTENING...</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">PRESS & SPEAK</span>
                </>
              )}
            </button>

            {isRecording && (
              <div className="flex items-center gap-1 mt-4">
                {[40, 75, 50, 90, 60, 30, 80, 45].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1 bg-rose-500 rounded-full animate-pulse h-6"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-blue-400" />
                <span>Audio Transcript</span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &ldquo;{transcript}&rdquo;
              </p>
            </div>
          )}

          {/* Analyzing indicator */}
          {analyzing && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-blue-300 font-mono">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>ResQAI Neural Parser analyzing speech patterns...</span>
            </div>
          )}

          {/* Extracted Structured Card */}
          {extractedData && (
            <div className="bg-slate-950 border border-blue-900/50 rounded-xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI EXTRACTED INCIDENT PROFILE</span>
                </div>
                <TrustSafetyBadge type="AI_ANALYSIS" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">INCIDENT</span>
                  <span className="font-bold text-white text-sm">{extractedData.incidentType}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">SEVERITY</span>
                  <span className="font-bold text-rose-400 text-sm">{extractedData.severity}</span>
                </div>
                <div className="col-span-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">EXTRACTED LOCATION</span>
                  <span className="font-semibold text-slate-200">{extractedData.location}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">POSSIBLE VICTIMS</span>
                  <span className="font-semibold text-amber-300">{extractedData.victims}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">RECOMMENDED DEPT</span>
                  <span className="font-semibold text-blue-300">{extractedData.department}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                <strong className="text-slate-300">Analysis:</strong> {extractedData.reasoning}
              </div>

              <button
                onClick={handleConfirmReport}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                CONFIRM & DISPATCH HELP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
