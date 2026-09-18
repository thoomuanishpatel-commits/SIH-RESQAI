'use client';

import React from 'react';
import { Clock, ShieldCheck, Users, AlertTriangle, Sparkles, CheckCircle2, TrendingUp, BarChart3, FileSpreadsheet } from 'lucide-react';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const AfterActionReportView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              POST-INCIDENT POST-MORTEM
            </span>
            <TrustSafetyBadge type="AI_ANALYSIS" label="AI-ASSISTED AUDIT" />
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            After-Action Report: Incident #RQ-204891
          </h2>
          <p className="text-xs text-slate-400">
            Audit evaluation for HITEC City Commercial 4th Floor Fire.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full EOC incident ledger PDF...')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold border border-slate-700 flex items-center gap-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>EXPORT LEDGER (PDF/CSV)</span>
        </button>
      </div>

      {/* Primary KPI Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Detection Time</div>
          <div className="text-2xl font-black font-mono text-emerald-400">42 sec</div>
          <div className="text-[10px] text-slate-500">Autonomous IoT + SOS</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Response Time</div>
          <div className="text-2xl font-black font-mono text-blue-400">6m 24s</div>
          <div className="text-[10px] text-emerald-400">18% faster than benchmark</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Victims Assisted</div>
          <div className="text-2xl font-black font-mono text-white">17</div>
          <div className="text-[10px] text-slate-500">Zero fatalities</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Roads Blocked</div>
          <div className="text-2xl font-black font-mono text-amber-400">3</div>
          <div className="text-[10px] text-slate-500">Dynamic reroutes applied</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Resources Used</div>
          <div className="text-2xl font-black font-mono text-purple-400">5 Units</div>
          <div className="text-[10px] text-slate-500">2 Fire, 2 EMS, 1 Police</div>
        </div>
      </div>

      {/* AI Qualitative Response Analysis Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              AI RESPONSE ANALYSIS & BOTTLENECK DISCOVERY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Confidence: 93%</span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-amber-300">
              Primary Bottleneck Identified:
            </div>
            <p>
              &ldquo;The primary response delay of 1 minute 40 seconds occurred because of unexpected traffic congestion at the Cyber Towers underpass approach. ResQAI automated rerouting dynamically bypassed the congestion via the elevated flyover ramp, successfully recovering approximately 2 minutes 15 seconds of transit time.&rdquo;
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-300">
              Equipment Matching Efficiency:
            </div>
            <p>
              &ldquo;Dispatching Unit Bravo-4 Bronto Skylift (54m hydraulic ladder) directly in tandem with Apollo ALS Medic 2 prevented the need for a secondary triage callout, enabling simultaneous upper terrace evacuation and oxygen stabilization.&rdquo;
            </p>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-300/90 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> This after-action assessment is generated by machine learning models analyzing dispatch timestamps and GPS logs. It provides decision support for operational debriefs and is subject to departmental review.
          </span>
        </div>
      </div>

    </div>
  );
};
