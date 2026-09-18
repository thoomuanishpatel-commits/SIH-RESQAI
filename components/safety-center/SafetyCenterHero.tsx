'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, AlertOctagon, ShieldCheck, Volume2, Globe, Sparkles, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/data/safetyGuideData';
import { SafetyHeroGraphic } from './SafetyIllustrations';

interface SafetyCenterHeroProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onEmergencyClick: () => void;
  onScrollToCatalog: () => void;
  onScrollToKit: () => void;
}

export const SafetyCenterHero = ({
  language,
  onLanguageChange,
  onEmergencyClick,
  onScrollToCatalog,
  onScrollToKit
}: SafetyCenterHeroProps) => {
  const dict = TRANSLATIONS[language];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 border-b border-slate-800/80">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top bar: Breadcrumb + Language Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-slate-400">
              {dict.badgeText}
            </span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-sm">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                language === 'hi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                language === 'te'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Hero Grid: Left Content + Right Interactive Vector Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
                {dict.heroHeadline}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                {dict.heroSubheadline}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{dict.startTraining}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onEmergencyClick}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border-2 border-rose-500 font-black text-sm tracking-wide transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-rose-950/40"
              >
                <AlertOctagon className="w-4 h-4 animate-pulse text-rose-400 group-hover:text-white" />
                <span>{dict.inEmergency}</span>
              </button>

              <button
                onClick={onScrollToKit}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>Emergency Kit Builder</span>
              </button>
            </div>

            {/* Value Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>15 Hazards Covered</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>NDMA / USGS Sourced</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Voice Audio Guides</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Offline Savable</span>
              </div>
            </div>
          </div>

          {/* Right Vector Visual Ecosystem Card */}
          <div className="lg:col-span-5">
            <SafetyHeroGraphic />
          </div>
        </div>
      </div>
    </div>
  );
};
