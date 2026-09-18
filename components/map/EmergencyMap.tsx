'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Radio, MapPin, Building, HeartPulse } from 'lucide-react';

// Dynamically import LeafletLiveMap with SSR disabled to prevent window is not defined
const LeafletLiveMap = dynamic(
  () => import('./LeafletLiveMap').then(mod => mod.LeafletLiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[520px] bg-[#070B13] rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono">
        <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center">
          <Radio className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <div className="text-xs text-slate-300 font-bold">
          INITIALIZING TACTICAL GIS MAP ENGINE...
        </div>
        <div className="text-[11px] text-slate-500">
          Loading OpenStreetMap / Tactical GIS tiles and plotting hospital &amp; building markers...
        </div>
      </div>
    )
  }
);

import type { LeafletLiveMapProps } from './LeafletLiveMap';

export type EmergencyMapProps = LeafletLiveMapProps;

export const EmergencyMap: React.FC<EmergencyMapProps> = (props) => {
  return (
    <div className="w-full h-full min-h-[520px]">
      <LeafletLiveMap {...props} />
    </div>
  );
};
