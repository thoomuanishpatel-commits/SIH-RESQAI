import React from 'react';
import { ShieldCheck, Sparkles, Radio, Database, AlertCircle } from 'lucide-react';

export type TrustTag = 'LIVE_DATA' | 'SIMULATION' | 'AI_ANALYSIS' | 'CITIZEN_REPORT' | 'VERIFIED';

interface Props {
  type: TrustTag;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export const TrustSafetyBadge: React.FC<Props> = ({ type, label, className = '', showIcon = true }) => {
  const configs = {
    LIVE_DATA: {
      text: label || 'LIVE OPERATIONAL DATA',
      icon: Radio,
      classes: 'bg-emerald-950/70 text-emerald-400 border-emerald-600/40',
      dot: 'bg-emerald-400'
    },
    SIMULATION: {
      text: label || 'SCENARIO SIMULATION MODE',
      icon: Database,
      classes: 'bg-amber-950/70 text-amber-400 border-amber-600/40',
      dot: 'bg-amber-400'
    },
    AI_ANALYSIS: {
      text: label || 'AI-ASSISTED TRIAGE (VERIFICATION REQUIRED)',
      icon: Sparkles,
      classes: 'bg-blue-950/70 text-blue-400 border-blue-600/40',
      dot: 'bg-blue-400'
    },
    CITIZEN_REPORT: {
      text: label || 'UNCONFIRMED CITIZEN SOS',
      icon: AlertCircle,
      classes: 'bg-rose-950/70 text-rose-400 border-rose-600/40',
      dot: 'bg-rose-400'
    },
    VERIFIED: {
      text: label || 'AUTHORITY VERIFIED',
      icon: ShieldCheck,
      classes: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
      dot: 'bg-cyan-400'
    }
  };

  const current = configs[type];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide border ${current.classes} ${className}`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{current.text}</span>
    </span>
  );
};
