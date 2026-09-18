'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const IncidentReplayView: React.FC = () => {
  const { incidents } = useEmergency();
  const [currentStep, setCurrentStep] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const replayEvents = [
    { time: '17:18:00', title: 'Citizen SOS Beacon Initiated', detail: 'Distress ping received from HITEC City 4th floor.', lat: 17.4483, lng: 78.3915, status: 'DETECTION' },
    { time: '17:18:42', title: 'AI Automated Triage Completed', detail: 'Identified as CRITICAL high-rise structure fire with 3 trapped.', lat: 17.4483, lng: 78.3915, status: 'AI_TRIAGE' },
    { time: '17:19:30', title: 'Smart Dispatch Orders Transmitted', detail: 'Assigned Unit Bravo-4 Bronto Skylift and Apollo ALS Medic 2.', lat: 17.4420, lng: 78.3880, status: 'DISPATCH' },
    { time: '17:21:10', title: 'Road Block Encountered & Detour Computed', detail: 'Cyber Towers underpass blocked. Rerouted via overhead ramp.', lat: 17.4490, lng: 78.3890, status: 'REROUTE' },
    { time: '17:24:00', title: 'First Responders Arrived On Scene', detail: 'Hydraulic ladder deployed. 3 civilians evacuated from terrace.', lat: 17.4483, lng: 78.3915, status: 'ON_SCENE' },
    { time: '17:35:00', title: 'Flames Quenched & Site Handed to USAR', detail: 'Incident marked CONTAINED with zero fatalities.', lat: 17.4483, lng: 78.3915, status: 'RESOLVED' }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep(curr => {
        if (curr >= replayEvents.length - 1) {
          setIsPlaying(false);
          return curr;
        }
        return curr + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [isPlaying, replayEvents.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            TEMPORAL REPLAY & TRAJECTORY ANALYSIS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step forensic recreation of response actions for Incident RQ-204891.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-md">
          <button
            onClick={() => setCurrentStep(0)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY REPLAY'}</span>
          </button>
          <button
            onClick={() => setCurrentStep(curr => Math.min(curr + 1, replayEvents.length - 1))}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Step Forward"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubbable Timeline Track */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Time Elapsed: {replayEvents[currentStep].time}</span>
          <span className="text-blue-400 font-bold">Step {currentStep + 1} of {replayEvents.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / replayEvents.length) * 100}%` }}
          />
        </div>

        {/* Active Step Card */}
        <div className="bg-slate-950/80 border border-blue-900/40 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {replayEvents[currentStep].status}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {replayEvents[currentStep].time}
            </span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">
            {replayEvents[currentStep].title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {replayEvents[currentStep].detail}
          </p>
        </div>

        {/* Events list */}
        <div className="space-y-3 pt-2">
          {replayEvents.map((evt, idx) => {
            const isCurrent = idx === currentStep;
            const isPassed = idx < currentStep;
            return (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition ${
                  isCurrent
                    ? 'bg-blue-950/40 border border-blue-600/50 text-white'
                    : 'hover:bg-slate-950/50 text-slate-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    isPassed
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isPassed ? '✓' : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{evt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{evt.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
