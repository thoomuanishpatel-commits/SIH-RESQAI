'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const AdminAuthModal: React.FC = () => {
  const {
    adminAuthModalOpen,
    setAdminAuthModalOpen,
    loginAdmin
  } = useEmergency();

  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!adminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = loginAdmin(officerId, passcode);
      setIsSubmitting(false);
      if (!success) {
        setErrorMsg('Invalid Officer ID or Passcode. Please check your credentials or use the 1-Tap Demo button.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setOfficerId('commander@resqai.gov.in');
    setPasscode('resqai112');
    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      loginAdmin('commander@resqai.gov.in', 'resqai112');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/70 rounded-3xl shadow-2xl shadow-red-950/80 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/30 border border-red-400/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-200" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider">
                EOC COMMANDER LOGIN
              </h3>
              <p className="text-[11px] text-red-100 font-mono">
                RESTRICTED INCIDENT COMMAND PORTAL
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminAuthModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/30 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Statutory warning */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This portal is restricted to authorized <strong>Emergency Operations Center (EOC) Command Personnel</strong>. Unauthorized access is logged under IT Act 2000.
            </p>
          </div>

          {/* Quick 1-Tap Demo Credentials Card for Evaluators */}
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                EVALUATOR DEMO CREDENTIALS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                OFFICIAL DEMO
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-0.5 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <div><strong className="text-slate-400">Officer ID:</strong> <span className="text-cyan-300">commander@resqai.gov.in</span></div>
              <div><strong className="text-slate-400">Passcode:</strong> <span className="text-cyan-300">resqai112</span></div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>1-Tap Demo Login as EOC Commander</span>
            </button>
          </div>

          {/* Credential Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>OFFICER ID / BADGE CALLSIGN</span>
              </label>
              <input
                type="text"
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="commander@resqai.gov.in"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl text-xs text-white font-mono placeholder:text-slate-600 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>SECURITY PASSCODE / PIN</span>
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl text-xs text-white font-mono placeholder:text-slate-600 outline-none transition"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAdminAuthModalOpen(false)}
                className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel (Return)
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/60 transition disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Authorize EOC'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
