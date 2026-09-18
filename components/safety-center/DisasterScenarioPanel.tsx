'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Clock,
  Navigation,
  Accessibility,
  Car,
  Home,
  Sun,
  Maximize2,
  X
} from 'lucide-react';
import { DisasterGuide, Language, TRANSLATIONS } from '@/data/safetyGuideData';
import { ActionIllustration, DisasterIcon } from './SafetyIllustrations';

interface DisasterScenarioPanelProps {
  disaster: DisasterGuide;
  language: Language;
}

export const DisasterScenarioPanel = ({
  disaster,
  language
}: DisasterScenarioPanelProps) => {
  const dict = TRANSLATIONS[language];
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('during');
  const [activeSituationIndex, setActiveSituationIndex] = useState<number>(0);
  const [visualTrainingMode, setVisualTrainingMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; title: string } | null>(null);

  // Stop speech when disaster changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [disaster.id]);

  // Audio TTS handling
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(dict.speechUnavailable);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Build speech text from current steps and do/donts
    const textToRead = [
      `${disaster.name} emergency safety instructions.`,
      `Immediate priority: ${disaster.quickActionTitle}.`,
      ...disaster.visualSequence.map((step) => `Step ${step.step}: ${step.title}. ${step.explanation}`),
      `Do this: ${disaster.doDonts.filter(d => d.type === 'do').map(d => d.title).join('. ')}.`,
      `Avoid this: ${disaster.doDonts.filter(d => d.type === 'dont').map(d => d.title).join('. ')}.`
    ].join(' ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    if (language === 'hi') {
      const hiVoice = voices.find((v) => v.lang.includes('hi'));
      if (hiVoice) utterance.voice = hiVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const currentPhaseData = disaster.phases.find((p) => p.phase === activePhase) || disaster.phases[1];

  const getSituationIcon = (situation: string) => {
    const s = situation.toLowerCase();
    if (s.includes('wheelchair') || s.includes('mobility')) return <Accessibility className="w-4 h-4" />;
    if (s.includes('vehicle') || s.includes('car')) return <Car className="w-4 h-4" />;
    if (s.includes('indoor') || s.includes('home') || s.includes('bed')) return <Home className="w-4 h-4" />;
    if (s.includes('outdoor') || s.includes('open')) return <Sun className="w-4 h-4" />;
    return <Navigation className="w-4 h-4" />;
  };

  return (
    <div
      id="scenario-panel"
      className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all ${
        visualTrainingMode
          ? 'bg-slate-950 border-4 border-amber-400/80 rounded-3xl p-6 shadow-2xl ring-4 ring-amber-400/20'
          : ''
      }`}
    >
      {/* Panel Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${disaster.badgeBorder} ${disaster.accentBg}`}
              >
                {disaster.category} HAZARD PROTOCOL
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Reviewed: {disaster.lastReviewed}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${disaster.color}20`, color: disaster.color }}
              >
                <DisasterIcon id={disaster.id} className="w-6 h-6" />
              </div>
              <span>{disaster.name}</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 font-normal">
              {disaster.tagline}
            </p>
          </div>

          {/* Action Bar: Audio TTS + Visual Mode + Official Source */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Audio Speech Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isSpeaking ? 'Stop Audio' : dict.listenToGuide}</span>
            </button>

            {/* Visual Training Mode Toggle */}
            <button
              onClick={() => setVisualTrainingMode(!visualTrainingMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                visualTrainingMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{visualTrainingMode ? dict.normalMode : dict.visualTrainingMode}</span>
            </button>

            {/* Official Source Link */}
            <a
              href={disaster.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-blue-400 bg-slate-950 border border-slate-800 transition"
            >
              <span>Source: NDMA</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Visual Training Mode Banner */}
        {visualTrainingMode && (
          <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/40 rounded-xl flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              VISUAL TRAINING MODE ACTIVE: Enlarged illustrations and bold simplified steps designed for high-stress situations.
            </span>
          </div>
        )}
      </div>

      {/* PHASE TABS: BEFORE / DURING / AFTER */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <span className="text-xs font-mono font-bold uppercase text-slate-400 mr-2">
          CRISIS TIMELINE:
        </span>
        {(['before', 'during', 'after'] as const).map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition ${
              activePhase === phase
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {dict[phase]}
          </button>
        ))}
      </div>

      {/* PHASE GUIDANCE BANNER */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl mb-8">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
          <ShieldAlert className="w-4 h-4" />
          <span>{currentPhaseData.headline}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentPhaseData.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN STEP SEQUENCE WITH ACTION ILLUSTRATIONS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              CORE PROTOCOL DRILL
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              {disaster.quickActionTitle}
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {disaster.visualSequence.length} Critical Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {disaster.visualSequence.map((step) => (
            <div
              key={step.step}
              className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition duration-200 flex flex-col justify-between ${
                visualTrainingMode ? 'ring-2 ring-amber-400/40 bg-slate-900' : ''
              }`}
            >
              {/* Graphic Action Scene */}
              <div className="relative bg-slate-950 border-b border-slate-800 overflow-hidden group">
                {step.imageUrl ? (
                  <div
                    onClick={() => setEnlargedImage({ url: step.imageUrl!, title: step.title })}
                    className="relative w-full h-48 sm:h-52 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
                    title="Click to view full image"
                  >
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 border border-slate-700">
                      <Maximize2 className="w-3 h-3 text-cyan-400" />
                      <span>Expand</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <ActionIllustration
                      type={step.illustrationType}
                      className="w-full h-44 object-contain"
                    />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white font-black text-xs px-2.5 py-1 rounded-md font-mono shadow-md border border-blue-400/30">
                  STEP {step.step}
                </span>
              </div>

              {/* Step text content */}
              <div className="p-5 space-y-2 flex-1">
                <h4
                  className={`font-black uppercase tracking-tight ${
                    visualTrainingMode
                      ? 'text-xl text-amber-300'
                      : 'text-base sm:text-lg text-white'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs font-semibold text-emerald-400">
                  {step.shortDesc}
                </p>
                <p
                  className={`text-slate-300 leading-relaxed ${
                    visualTrainingMode ? 'text-sm font-medium' : 'text-xs'
                  }`}
                >
                  {step.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DO THIS vs AVOID THIS (GREEN vs RED SPLIT COMPARISON) */}
      <div className="mb-12">
        <div className="mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            RAPID DECISION RULES
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            DO THIS vs AVOID THIS
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GREEN: DO THIS */}
          <div className="bg-gradient-to-b from-emerald-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-emerald-400 font-black text-base uppercase tracking-wider mb-4 pb-3 border-b border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{dict.doThis} (Life-Saving)</span>
            </div>

            <div className="space-y-4">
              {disaster.doDonts
                .filter((item) => item.type === 'do')
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/20"
                  >
                    <h5 className="text-sm font-bold text-emerald-200 mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{item.title}</span>
                    </h5>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-emerald-300/80 bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                      <strong className="text-emerald-300 font-semibold">Why: </strong>
                      {item.reason}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* RED: AVOID THIS */}
          <div className="bg-gradient-to-b from-red-950/20 to-slate-900 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-red-400 font-black text-base uppercase tracking-wider mb-4 pb-3 border-b border-red-500/20">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>{dict.avoidThis} (Fatal Traps)</span>
            </div>

            <div className="space-y-4">
              {disaster.doDonts
                .filter((item) => item.type === 'dont')
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 p-4 rounded-xl border border-red-500/20"
                  >
                    <h5 className="text-sm font-bold text-red-200 mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>{item.title}</span>
                    </h5>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-red-300/80 bg-red-950/40 px-2.5 py-1 rounded-lg">
                      <strong className="text-red-300 font-semibold">Danger: </strong>
                      {item.reason}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL CONTEXTS & SITUATIONS (Indoors, Outdoors, In Vehicle, Bed, Wheelchair) */}
      <div className="mb-12">
        <div className="mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            WHERE ARE YOU RIGHT NOW?
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            CONTEXT-SPECIFIC INSTRUCTIONS
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Situation Tabs */}
          <div className="flex items-center gap-1 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none">
            {disaster.specialSituations.map((sit, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSituationIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeSituationIndex === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {getSituationIcon(sit.situation)}
                <span>{sit.situation}</span>
              </button>
            ))}
          </div>

          {/* Active Situation Content */}
          <div className="p-6">
            {disaster.specialSituations[activeSituationIndex] && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    {getSituationIcon(disaster.specialSituations[activeSituationIndex].situation)}
                  </span>
                  <div>
                    <h4 className="text-lg font-black text-white">
                      Action for: {disaster.specialSituations[activeSituationIndex].situation}
                    </h4>
                    <span className="text-xs text-slate-400">Contextual immediate survival response</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-sm font-semibold text-slate-100 mb-2">
                    {disaster.specialSituations[activeSituationIndex].action}
                  </p>
                  <p className="text-xs text-amber-300/90 font-medium">
                    💡 <strong>Pro Tip:</strong> {disaster.specialSituations[activeSituationIndex].tip}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EVACUATION CRITERIA & EMERGENCY CALL 112 ADVICE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evacuation Triggers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>WHEN TO EVACUATE</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {disaster.evacuationTriggers.map((trig, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-rose-400 font-bold">•</span>
                <span>{trig}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 112 Advice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider font-mono">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>WHEN TO CALL 112</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            {disaster.call112Advice}
          </p>
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>DIAL 112 NOW (ERSS INDIA)</span>
          </a>
        </div>

        {/* Kit Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider font-mono">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>KIT HIGHLIGHTS</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {disaster.kitHighlights.map((kitItem, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 font-medium"
              >
                {kitItem}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Enlarged Image Lightbox Modal */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {enlargedImage.title}
              </span>
              <button
                onClick={() => setEnlargedImage(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 overflow-auto max-h-[80vh] flex items-center justify-center bg-black/60">
              <img
                src={enlargedImage.url}
                alt={enlargedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
