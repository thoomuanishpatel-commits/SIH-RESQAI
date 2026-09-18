'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, FileCheck2, Scale, AlertOctagon } from 'lucide-react';

export const TrustSection = () => {
  const sources = [
    {
      name: 'NDMA India',
      fullName: 'National Disaster Management Authority (Govt. of India)',
      role: 'National SOPs for Earthquake, Flood, Cyclone, Chemical & Heatwave guidelines',
      url: 'https://ndma.gov.in'
    },
    {
      name: 'USGS Earthquake Hazards',
      fullName: 'United States Geological Survey',
      role: 'Drop, Cover, and Hold On scientific seismology research and physics data',
      url: 'https://www.usgs.gov'
    },
    {
      name: 'IMD & CWC',
      fullName: 'India Meteorological Dept. & Central Water Commission',
      role: 'Hydro-meteorological alerts, cyclone tracking, and river flood gauge benchmarks',
      url: 'https://mausam.imd.gov.in'
    },
    {
      name: 'INCOIS',
      fullName: 'Indian National Centre for Ocean Information Services',
      role: 'Indian Ocean Tsunami Early Warning System (ITEWS) evacuation distances',
      url: 'https://incois.gov.in'
    },
    {
      name: 'FEMA & Ready.gov',
      fullName: 'Federal Emergency Management Agency',
      role: '72-hour emergency supply kit standardization and family communication protocols',
      url: 'https://www.ready.gov'
    },
    {
      name: 'World Health Organization',
      fullName: 'WHO Health Emergencies Programme',
      role: 'Biological hazard containment, CBRN de-escalation, and mass casualty first-aid',
      url: 'https://www.who.int'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            AUTHORITATIVE BENCHMARKS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            TRUSTED SAFETY INFORMATION SOURCES
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Every step and recommendation in the ResQAI Safety Center is cross-verified against official national and global disaster management doctrines.
          </p>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sources.map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition">
                    {s.name}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                </div>
                <p className="text-[11px] font-semibold text-slate-300 mb-1">
                  {s.fullName}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.role}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400">
                Official Guidance Source ➔
              </div>
            </a>
          ))}
        </div>

        {/* Life-Safety Legal Disclaimer */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start gap-3.5 text-xs text-slate-400">
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-slate-300 font-mono">
              LIFE-SAFETY DISCLAIMER & CIVIC DRILL DIRECTIVE
            </span>
            <p className="leading-relaxed">
              The ResQAI Safety Center is an educational preparedness tool and rapid visual reference. In the event of an active life-threatening catastrophe, follow mandatory evacuation orders issued by local magistrates and law enforcement, and contact <strong>ERSS 112 (Police, Fire, Ambulance)</strong> immediately. Do not endanger your personal safety to consult digital guides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
