'use client';

import React, { useState, useEffect } from 'react';
import { Users, Save, Printer, Download, CheckCircle2, Shield, MapPin, Phone, HeartPulse } from 'lucide-react';

interface FamilyPlanData {
  primaryMeeting: string;
  secondaryMeeting: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  localHospital: string;
  medicalNotes: string;
  specialNeeds: string;
}

const DEFAULT_PLAN: FamilyPlanData = {
  primaryMeeting: 'Neighborhood Community Park (Open lawn area)',
  secondaryMeeting: 'District Municipal Stadium / High School Ground',
  emergencyContactName: 'Aunt / Uncle (Out-of-city contact)',
  emergencyContactPhone: '+91 98765 43210',
  localHospital: 'District Government General Hospital / Trauma Center',
  medicalNotes: 'Inhaler for child, BP medicine 10 days supply in kit',
  specialNeeds: 'Senior citizen wheelchair assistance required for staircase evacuation'
};

export const FamilyPlanGenerator = () => {
  const [plan, setPlan] = useState<FamilyPlanData>(DEFAULT_PLAN);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('resqai_family_plan');
      if (saved) {
        setPlan(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for family plan');
    }
  }, []);

  const handleChange = (field: keyof FamilyPlanData, value: string) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('resqai_family_plan', JSON.stringify(plan));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.warn('Failed to save plan');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="family-plan-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm print:bg-white print:text-black print:border-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8 print:border-b-2 print:border-black">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2 print:text-black">
              <Users className="w-4 h-4" />
              CIVIC ACTION PROTOCOL
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 print:text-black">
              My Family Disaster Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-gray-700">
              Personalized contingency plan stored locally on your device. Zero login or server storage.
            </p>
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Plan Saved!' : 'Save Locally'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs tracking-wide transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Meeting Point */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 print:text-black">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Primary Meeting Point (Immediate Vicinity)
            </label>
            <input
              type="text"
              value={plan.primaryMeeting}
              onChange={(e) => handleChange('primaryMeeting', e.target.value)}
              placeholder="e.g. Front yard tree, community park gate"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
            />
            <p className="text-[11px] text-slate-400 print:text-gray-600">
              Where everyone gathers immediately outside the residence during an evacuation.
            </p>
          </div>

          {/* Secondary Meeting Point */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 print:text-black">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Secondary Meeting Point (Out of Neighborhood)
            </label>
            <input
              type="text"
              value={plan.secondaryMeeting}
              onChange={(e) => handleChange('secondaryMeeting', e.target.value)}
              placeholder="e.g. Town Hall, relative house 3km away"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
            />
            <p className="text-[11px] text-slate-400 print:text-gray-600">
              In case access to the home neighborhood is blocked by flood or road damage.
            </p>
          </div>

          {/* Out-of-Area Emergency Contact */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 print:text-black">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Out-of-Area Emergency Contact
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={plan.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                placeholder="Relative / Friend name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
              />
              <input
                type="text"
                value={plan.emergencyContactPhone}
                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                placeholder="Phone number"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 print:text-gray-600">
              Long-distance contacts are often easier to reach when local cellular towers are congested.
            </p>
          </div>

          {/* Local Hospital & Trauma Node */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 print:text-black">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              Designated Emergency Hospital
            </label>
            <input
              type="text"
              value={plan.localHospital}
              onChange={(e) => handleChange('localHospital', e.target.value)}
              placeholder="e.g. Apollo / City General Hospital"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
            />
            <p className="text-[11px] text-slate-400 print:text-gray-600">
              Nearest Level-1 or Government Trauma Center with 24/7 emergency care.
            </p>
          </div>

          {/* Medical Notes & Prescriptions */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 print:text-black">
              Family Medical & Prescription Needs
            </label>
            <textarea
              rows={2}
              value={plan.medicalNotes}
              onChange={(e) => handleChange('medicalNotes', e.target.value)}
              placeholder="List daily critical medications, insulin, blood groups..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
            />
          </div>

          {/* Mobility & Special Needs */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 print:text-black">
              Mobility Devices / Infants / Pets
            </label>
            <textarea
              rows={2}
              value={plan.specialNeeds}
              onChange={(e) => handleChange('specialNeeds', e.target.value)}
              placeholder="Infant milk powder, pet carrier, wheelchair assistance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-400"
            />
          </div>
        </div>

        {/* Footer print prompt */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between print:border-t-2 print:border-black print:text-black">
          <span>ResQAI Safety Protocol • Emergency Helpline: Pan-India 112</span>
          <span>Keep a physical printed copy inside your 72-Hour Survival Kit.</span>
        </div>
      </div>
    </div>
  );
};
