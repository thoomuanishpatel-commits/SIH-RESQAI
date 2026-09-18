'use client';

import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, toggleOfflineMode, offlineQueue, syncOfflineQueue } = useEmergency();

  if (!isOffline && offlineQueue.length === 0) return null;

  return (
    <div
      role="alert"
      className="bg-amber-950/90 border-b border-amber-600/50 text-amber-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-50 sticky top-0"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <div>
          <span className="font-semibold text-amber-100">
            {isOffline ? '⚠ LOW CONNECTIVITY / OFFLINE MODE ACTIVE' : 'NETWORK RESTORED'}
          </span>
          <span className="ml-2 text-amber-300/80">
            {isOffline
              ? 'Local GPS emergency queue enabled. SOS reports will safely buffer locally.'
              : `${offlineQueue.length} pending emergency report(s) ready to synchronize.`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {offlineQueue.length > 0 && (
          <span className="bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded text-[11px] font-mono border border-amber-700/60">
            {offlineQueue.length} queued
          </span>
        )}

        {isOffline ? (
          <button
            onClick={toggleOfflineMode}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded transition flex items-center gap-1 text-[11px]"
          >
            Simulate Online
          </button>
        ) : (
          <button
            onClick={syncOfflineQueue}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded transition flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};
