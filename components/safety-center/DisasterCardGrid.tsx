'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { DISASTERS_DATA, DisasterGuide } from '@/data/safetyGuideData';
import { DisasterIcon } from './SafetyIllustrations';

interface DisasterCardGridProps {
  selectedDisasterId: string;
  onSelectDisaster: (id: string) => void;
  dict: {
    chooseSituation: string;
    chooseSubtitle: string;
    searchPlaceholder: string;
    allCategories: string;
  };
}

export const DisasterCardGrid = ({
  selectedDisasterId,
  onSelectDisaster,
  dict
}: DisasterCardGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: dict.allCategories },
    { id: 'geological', label: 'Geological' },
    { id: 'weather', label: 'Weather & Hydro' },
    { id: 'fire', label: 'Fire & Wildfire' },
    { id: 'hazardous', label: 'Industrial & Bio' },
    { id: 'complex', label: 'Complex & Urban' }
  ];

  const filteredDisasters = useMemo(() => {
    return DISASTERS_DATA.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.shortTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
          SURVIVAL INTELLIGENCE DIRECTORY
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          {dict.chooseSituation}
        </h2>
        <p className="text-sm text-slate-400 font-normal">
          {dict.chooseSubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 15 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDisasters.map((disaster) => {
          const isSelected = selectedDisasterId === disaster.id;
          return (
            <div
              key={disaster.id}
              onClick={() => onSelectDisaster(disaster.id)}
              className={`group cursor-pointer rounded-2xl p-5 border transition duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top badge and icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${disaster.badgeBorder} ${disaster.accentBg}`}
                  >
                    {disaster.category}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition group-hover:scale-105"
                    style={{ backgroundColor: `${disaster.color}18`, color: disaster.color }}
                  >
                    <DisasterIcon id={disaster.id} className="w-5 h-5" />
                  </div>
                </div>

                {/* Name & Tagline */}
                <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition mb-1 flex items-center gap-2">
                  <span>{disaster.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-4">
                  {disaster.tagline}
                </p>

                {/* Quick Action Sequence Snapshot */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-blue-400 uppercase font-mono">
                      <Zap className="w-3 h-3" />
                      Priority Action
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {disaster.shortTag}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {disaster.quickActionSteps.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                        <span className="text-emerald-400 font-bold shrink-0">➔</span>
                        <span className="line-clamp-1">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  {disaster.visualSequence.length} Step Drill
                </span>
                <span
                  className={`font-bold flex items-center gap-1 transition ${
                    isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  <span>{isSelected ? 'Viewing Guide' : 'Open Drill'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDisasters.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No disasters found matching "{searchTerm}". Try another search query.
        </div>
      )}
    </div>
  );
};
