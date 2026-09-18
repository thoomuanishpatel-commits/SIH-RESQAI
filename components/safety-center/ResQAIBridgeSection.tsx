'use client';

import React from 'react';
import { ArrowRight, BookOpen, Radio, Cpu, Network, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export const ResQAIBridgeSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Citizen Preparedness',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      desc: 'Visual drills, 72-hour survival kits, and family evacuation planning via the Safety Center.',
      badge: 'You Are Here'
    },
    {
      num: '02',
      title: 'Incident Detection',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
      desc: 'Multimodal citizen SOS, IoT flood sensors, and satellite heat anomaly detection.',
      badge: 'Early Warning'
    },
    {
      num: '03',
      title: 'ResQAI Intelligence',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      desc: 'Autonomous severity triage, geospatial clustering, and triage prioritization.',
      badge: 'AI Core'
    },
    {
      num: '04',
      title: 'EOC & 112 Dispatch',
      icon: <Network className="w-5 h-5 text-rose-400" />,
      desc: 'Unified Emergency Operations Center links to Pan-India ERSS 112 dispatch nodes.',
      badge: 'ERSS Link'
    },
    {
      num: '05',
      title: 'Responder Execution',
      icon: <Truck className="w-5 h-5 text-purple-400" />,
      desc: 'NDRF, SDRF, and civil defense rescue teams navigate directly to geotagged victims.',
      badge: 'Ground Action'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          THE RESQAI CONNECTED ECOSYSTEM
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          FROM CITIZEN READINESS TO RAPID RESCUE
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          The Safety Center is the front line of disaster resilience. Educated citizens reduce emergency system overload by 40% and know exactly when and how to trigger coordinated response.
        </p>
      </div>

      {/* 5-Step Loop Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border flex flex-col justify-between transition relative ${
              idx === 0
                ? 'bg-emerald-950/20 border-emerald-500/40 ring-2 ring-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-black text-slate-400">
                  {step.num}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    idx === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {step.badge}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3">
                {step.icon}
              </div>

              <h4 className="text-base font-black text-white mb-1.5">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA to dashboard */}
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold tracking-wide transition shadow-lg"
        >
          <span>Explore Live ResQAI Command Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
