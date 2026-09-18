'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ShieldCheck, RefreshCw, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { EMERGENCY_KIT_ITEMS } from '@/data/safetyGuideData';

interface EmergencyKitBuilderProps {
  dict: {
    buildKit: string;
    kitProgress: string;
  };
}

export const EmergencyKitBuilder = ({ dict }: EmergencyKitBuilderProps) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resqai_kit_checklist');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for kit builder');
    }
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('resqai_kit_checklist', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save kit items');
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const all = EMERGENCY_KIT_ITEMS.map((item) => item.id);
    setCheckedItems(all);
    try {
      localStorage.setItem('resqai_kit_checklist', JSON.stringify(all));
    } catch (e) {}
  };

  const handleClearAll = () => {
    setCheckedItems([]);
    try {
      localStorage.removeItem('resqai_kit_checklist');
    } catch (e) {}
  };

  const completedCount = checkedItems.length;
  const totalCount = EMERGENCY_KIT_ITEMS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div id="kit-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        {/* Header with Progress Ring */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              72-HOUR SURVIVAL PREPAREDNESS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              {dict.buildKit}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              NDMA guidelines recommend maintaining an emergency supply bag capable of sustaining your family for a minimum of 72 hours.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            {/* Circular representation */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500 transition-all duration-500 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-white font-mono">
                {percentage}%
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                KIT READINESS
              </span>
              <span className="text-xl font-black text-white">
                {completedCount} / {totalCount} {dict.kitProgress}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={handleSelectAll}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Check All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={handleClearAll}
                  className="text-[11px] text-slate-400 hover:text-slate-300 font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {EMERGENCY_KIT_ITEMS.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition duration-150 flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-blue-950/20 border-blue-500/40 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 transition ${
                    isChecked ? 'text-blue-400' : 'text-slate-500'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-blue-500/20 text-blue-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h5
                      className={`text-sm font-black ${
                        isChecked ? 'text-white line-through opacity-80' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    <span className="text-blue-300 font-semibold">{item.quantity}</span> — {item.essentialFor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Readiness advice banner */}
        {percentage === 100 && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold animate-fadeIn">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Congratulations! Your 72-Hour Emergency Kit checklist is complete. Keep this backpack by the entrance of your home in an easily accessible location.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
