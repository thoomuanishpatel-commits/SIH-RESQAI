'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
}

export const DisasterIcon = ({ id, className = "w-6 h-6" }: { id: string; className?: string }) => {
  switch (id) {
    case 'earthquake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m2 14 3-3 3 3 4-4 4 4 6-6" />
          <path d="m2 20 4-4 4 4 4-4 4 4 4-4" />
          <path d="M12 2v6" />
          <path d="m9 5 3-3 3 3" />
        </svg>
      );
    case 'flood':
    case 'urban-flood':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 10c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
          <path d="M2 15c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
          <path d="M2 20c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
          <path d="M12 2v4" />
          <path d="M12 6c-2 0-3 1.5-3 3h6c0-1.5-1-3-3-3z" />
        </svg>
      );
    case 'cyclone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12" />
          <path d="M12 6a6 6 0 0 1 6 6 6 6 0 0 1-6 6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'fire':
    case 'forest-fire':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'lightning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'landslide':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 22 14 6l8 16H2z" />
          <path d="m14 11 3 3" />
          <path d="m16 17 2 2" />
          <circle cx="9" cy="14" r="1.5" fill="currentColor" />
          <circle cx="7" cy="18" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'tsunami':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 16c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
          <path d="M2 20c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
          <path d="M2 12c4-8 10-8 14-4 2 2 3 5 4 8" />
          <path d="M14 6a3 3 0 0 1 3 3" />
        </svg>
      );
    case 'heatwave':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case 'chemical-leak':
    case 'biological':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a6 6 0 0 0-5.196 9" />
          <path d="M17.196 11a6 6 0 0 0-5.196-9" />
          <path d="M6 14a6 6 0 0 0 10.392 3" />
          <path d="M18 14a6 6 0 0 1-10.392 3" />
        </svg>
      );
    case 'building-collapse':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="m4 10 5 2-3 4 8-1 4 4" strokeDasharray="2 2" />
          <path d="M9 6h.01" />
          <path d="M15 6h.01" />
        </svg>
      );
    case 'road-accident':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M5 17h10" />
          <path d="m14 4 2 2-2 2" />
        </svg>
      );
    case 'multi-disaster':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
};

export const ActionIllustration = ({ type, className = "w-full h-44" }: { type: string; className?: string }) => {
  switch (type) {
    // ----------------------------------------------------
    // EARTHQUAKE (3 steps)
    // ----------------------------------------------------
    case 'earthquake-drop':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          <path d="M20 140 H280" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" />
          <path d="M80 140 L100 135 L120 142 L150 138" stroke="#ef4444" strokeWidth="2" />
          <circle cx="130" cy="80" r="14" fill="#38bdf8" />
          <path d="M130 94 L150 115 L175 115 L190 138" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M140 102 L120 120 L110 138" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M210 50 L210 90 M195 75 L210 90 L225 75" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="20" y="30" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="0.05em">ACTION 01: DROP LOW</text>
          <text x="210" y="115" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">HANDS & KNEES</text>
        </svg>
      );

    case 'earthquake-cover':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          <path d="M20 140 H280" stroke="#334155" strokeWidth="3" />
          <path d="M90 75 H210 M110 75 V140 M190 75 V140" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="100" r="12" fill="#38bdf8" />
          <path d="M150 112 L145 130 L165 138" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M145 112 L158 100 L168 108" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M150 25 L150 55" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
          <path d="M140 30 L148 45 L135 50" stroke="#ef4444" strokeWidth="2" />
          <text x="20" y="30" fill="#94a3b8" fontSize="11" fontWeight="700">ACTION 02: SHELTER UNDER</text>
          <text x="150" y="152" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600">PROTECT HEAD & VITALS</text>
        </svg>
      );

    case 'earthquake-hold':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          <path d="M20 140 H280" stroke="#334155" strokeWidth="3" />
          <path d="M120 40 V140" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
          <rect x="110" y="80" width="20" height="24" rx="4" fill="#38bdf8" />
          <rect x="110" y="108" width="20" height="24" rx="4" fill="#38bdf8" />
          <path d="M80 60 L85 65 L80 70 M70 80 L75 85 L70 90" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <path d="M230 60 L225 65 L230 70 M240 80 L235 85 L240 90" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="30" fill="#94a3b8" fontSize="11" fontWeight="700">ACTION 03: HOLD ON TIGHT</text>
          <text x="190" y="95" fill="#22c55e" fontSize="12" fontWeight="700">HOLD TABLE LEG</text>
          <text x="190" y="112" fill="#94a3b8" fontSize="10">UNTIL SHAKING STOPS</text>
        </svg>
      );

    // ----------------------------------------------------
    // FIRE (4 steps - user uploaded screenshot!)
    // ----------------------------------------------------
    case 'fire-alert':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Fire alarm pull station */}
          <rect x="60" y="45" width="60" height="80" rx="8" fill="#dc2626" stroke="#f87171" strokeWidth="3" />
          <rect x="75" y="70" width="30" height="30" rx="4" fill="#7f1d1d" />
          <path d="M90 75 V95 M80 85 H100" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          {/* Sound waves pulsing */}
          <path d="M140 65 C150 75 150 95 140 105" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M155 55 C175 72 175 98 155 115" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M170 45 C200 68 200 102 170 125" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          {/* Alert badge */}
          <rect x="180" y="25" width="105" height="26" rx="6" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="232" y="42" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="800">SHOUT "FIRE!"</text>
          <text x="20" y="25" fill="#f87171" fontSize="11" fontWeight="700">STEP 01: ALERT & EVACUATE</text>
          <text x="220" y="90" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">PULL ALARM LEVER</text>
          <text x="220" y="108" textAnchor="middle" fill="#94a3b8" fontSize="10">TRIGGER 112 / BUILDING EVAC</text>
        </svg>
      );

    case 'fire-crawllow':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Dense smoke layer at ceiling */}
          <rect x="15" y="15" width="270" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <path d="M25 40 Q80 25 140 40 T260 35" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <text x="150" y="45" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="700">TOXIC SMOKE & GAS LAYER (&gt;150°C)</text>
          {/* Floor line */}
          <line x1="20" y1="135" x2="280" y2="135" stroke="#475569" strokeWidth="2" />
          {/* Person crawling below 12 inches */}
          <circle cx="85" cy="115" r="9" fill="#22c55e" />
          <path d="M85 124 L105 128 L130 128 L145 134" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
          <path d="M97 126 L94 134" stroke="#22c55e" strokeWidth="4" />
          {/* Clean air arrow */}
          <path d="M165 118 H260 M245 110 L260 118 L245 126" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="210" y="105" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700">CLEAN AIR ZONE (&lt;12 INCHES)</text>
          <text x="20" y="152" fill="#22c55e" fontSize="10" fontWeight="700">STEP 02: CRAWL LOW UNDER SMOKE</text>
        </svg>
      );

    case 'fire-stairs':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Elevator box with red X */}
          <rect x="40" y="45" width="70" height="85" rx="6" stroke="#ef4444" strokeWidth="2" fill="#1e293b" />
          <line x1="75" y1="45" x2="75" y2="130" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="75" cy="85" r="24" stroke="#ef4444" strokeWidth="4" fill="#ef4444" fillOpacity="0.15" />
          <line x1="58" y1="68" x2="92" y2="102" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <text x="75" y="32" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="800">NO ELEVATOR</text>
          {/* Fire escape stairs with green runner figure */}
          <path d="M160 125 H185 V105 H210 V85 H235 V65 H260 V45" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="210" cy="45" r="7" fill="#22c55e" />
          <path d="M210 52 L205 65 L215 72" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="210" y="148" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="700">USE PRESSURIZED STAIRWELL</text>
          <text x="20" y="22" fill="#94a3b8" fontSize="10" fontWeight="700">STEP 03: TAKE STAIRS ONLY</text>
        </svg>
      );

    case 'fire-stopdroproll':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Ground */}
          <line x1="20" y1="135" x2="280" y2="135" stroke="#334155" strokeWidth="2" />
          {/* 1. STOP */}
          <g>
            <circle cx="65" cy="65" r="9" fill="#f59e0b" />
            <line x1="65" y1="74" x2="65" y2="110" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <line x1="65" y1="110" x2="55" y2="135" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <line x1="65" y1="110" x2="75" y2="135" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <text x="65" y="45" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="800">1. STOP</text>
          </g>
          {/* Arrow */}
          <path d="M95 90 H115 M110 85 L115 90 L110 95" stroke="#64748b" strokeWidth="2" />
          {/* 2. DROP */}
          <g>
            <circle cx="145" cy="95" r="9" fill="#38bdf8" />
            <path d="M145 104 L135 125 L120 135" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <path d="M140 110 L160 135" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <text x="145" y="75" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="800">2. DROP</text>
          </g>
          {/* Arrow */}
          <path d="M175 105 H195 M190 100 L195 105 L190 110" stroke="#64748b" strokeWidth="2" />
          {/* 3. ROLL */}
          <g>
            <rect x="215" y="118" width="55" height="16" rx="8" fill="#22c55e" />
            <circle cx="270" cy="126" r="7" fill="#22c55e" />
            {/* Rotation roll arrows */}
            <path d="M235 100 C250 95 260 105 250 115" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
            <polygon points="255,115 250,115 250,110" fill="#22c55e" />
            <text x="242" y="85" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">3. ROLL</text>
          </g>
          <text x="20" y="22" fill="#f59e0b" fontSize="10" fontWeight="700">STEP 04: STOP, DROP & ROLL (SMOTHER FLAMES)</text>
        </svg>
      );

    // ----------------------------------------------------
    // FLOOD (3 steps)
    // ----------------------------------------------------
    case 'flood-highground':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Multi-story building */}
          <rect x="50" y="35" width="110" height="105" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="70" x2="160" y2="70" stroke="#475569" strokeWidth="1" />
          <line x1="50" y1="100" x2="160" y2="100" stroke="#475569" strokeWidth="1" />
          {/* Water rising below */}
          <path d="M20 120 Q60 110 100 120 T180 120 T280 120 V150 H20 Z" fill="#0284c7" fillOpacity="0.4" />
          <path d="M20 130 Q70 120 120 130 T220 130 T280 130 V150 H20 Z" fill="#0369a1" fillOpacity="0.7" />
          {/* Person safely on rooftop */}
          <circle cx="105" cy="25" r="7" fill="#22c55e" />
          <path d="M105 32 V42" stroke="#22c55e" strokeWidth="3" />
          {/* Upward arrow */}
          <path d="M210 120 V45 M195 60 L210 45 L225 60" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="20" y="20" fill="#38bdf8" fontSize="10" fontWeight="700">STEP 01: SEEK HIGH GROUND</text>
          <text x="210" y="140" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700">UPPER FLOORS / ROOFTOP</text>
        </svg>
      );

    case 'flood-avoidwater':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Flooded road with submerged car */}
          <path d="M20 115 Q80 105 150 115 T280 115 V150 H20 Z" fill="#0284c7" fillOpacity="0.5" />
          <rect x="90" y="90" width="70" height="30" rx="6" fill="#475569" />
          <circle cx="108" cy="120" r="9" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
          <circle cx="142" cy="120" r="9" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
          {/* Giant DO NOT ENTER slash */}
          <circle cx="215" cy="70" r="30" stroke="#ef4444" strokeWidth="5" fill="#ef4444" fillOpacity="0.15" />
          <line x1="193" y1="48" x2="237" y2="92" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 02: NEVER DRIVE OR WALK IN FLOODWATER</text>
          <text x="20" y="40" fill="#94a3b8" fontSize="9">6 INCHES OF WATER STALLS CARS • 12 INCHES SWEEPS CAR AWAY</text>
        </svg>
      );

    case 'flood-powercut':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Main electrical panel board */}
          <rect x="80" y="40" width="90" height="95" rx="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          <text x="125" y="60" textAnchor="middle" fill="#eab308" fontSize="9" fontWeight="800">MAIN BREAKER</text>
          {/* Switch turned to OFF */}
          <rect x="110" y="70" width="30" height="40" rx="4" fill="#0f172a" />
          <line x1="125" y1="75" x2="125" y2="105" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <text x="125" y="125" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="800">OFF</text>
          {/* Electric spark prevention badge */}
          <circle cx="220" cy="85" r="28" fill="#22c55e" fillOpacity="0.1" stroke="#22c55e" strokeWidth="2" />
          <path d="M215 75 L225 85 L215 95" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="220" y="130" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="700">PREVENT ELECTROCUTION</text>
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 03: CUT MAIN POWER & GAS</text>
        </svg>
      );

    // ----------------------------------------------------
    // CYCLONE (3 steps)
    // ----------------------------------------------------
    case 'cyclone-secure':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* House with plywood boarded windows */}
          <path d="M60 80 L120 40 L180 80 V135 H60 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <rect x="85" y="85" width="25" height="30" fill="#78350f" stroke="#b45309" strokeWidth="2" />
          <line x1="85" y1="85" x2="110" y2="115" stroke="#d97706" strokeWidth="2" />
          <rect x="130" y="85" width="25" height="30" fill="#78350f" stroke="#b45309" strokeWidth="2" />
          <line x1="130" y1="85" x2="155" y2="115" stroke="#d97706" strokeWidth="2" />
          {/* Wind vortex deflected */}
          <path d="M260 50 C230 40 210 70 240 85 C270 100 230 130 200 120" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="22" fill="#06b6d4" fontSize="10" fontWeight="700">STEP 01: BOARD WINDOWS & SECURE LOOSE ITEMS</text>
          <text x="235" y="145" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700">STORM SHUTTERS LOCKED</text>
        </svg>
      );

    case 'cyclone-shelter':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Central windowless concrete room */}
          <rect x="90" y="45" width="120" height="85" rx="6" fill="#1e293b" stroke="#22c55e" strokeWidth="3" />
          <text x="150" y="70" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">INTERIOR ROOM</text>
          <circle cx="150" cy="95" r="9" fill="#38bdf8" />
          <path d="M150 104 V120 M142 112 H158" stroke="#38bdf8" strokeWidth="3" />
          {/* Exterior walls taking the gale */}
          <path d="M40 30 C50 60 30 100 50 130" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 3" />
          <path d="M260 30 C250 60 270 100 250 130" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 3" />
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">STEP 02: SHELTER IN WINDOWLESS INTERIOR ROOM</text>
          <text x="150" y="148" textAnchor="middle" fill="#94a3b8" fontSize="9">AWAY FROM FLYING GLASS</text>
        </svg>
      );

    case 'cyclone-eye':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Cyclone eye concentric rings */}
          <circle cx="150" cy="85" r="45" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 4" />
          <circle cx="150" cy="85" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="150" y="82" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="800">EYE</text>
          <text x="150" y="93" textAnchor="middle" fill="#94a3b8" fontSize="7">(CALM)</text>
          {/* Warning sign */}
          <rect x="70" y="125" width="160" height="24" rx="4" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
          <text x="150" y="141" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="800">DO NOT GO OUTSIDE! EYEWALL WILL RETURN</text>
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 03: BEWARE OF CYCLONE EYE TRAP</text>
        </svg>
      );

    // ----------------------------------------------------
    // LIGHTNING (3 steps)
    // ----------------------------------------------------
    case 'lightning-hear':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Thundercloud + flash */}
          <path d="M50 60 C50 45 65 35 80 40 C95 30 120 35 125 50 C140 50 150 65 140 80 H50 Z" fill="#334155" />
          <polygon points="90,75 80,95 95,95 85,120 115,90 100,90 108,75" fill="#f59e0b" />
          {/* 30/30 rule graphic */}
          <circle cx="210" cy="80" r="32" fill="#1e293b" stroke="#eab308" strokeWidth="3" />
          <text x="210" y="75" textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="900">30 / 30</text>
          <text x="210" y="90" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="700">RULE</text>
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 01: WHEN THUNDER ROARS, GO INDOORS</text>
          <text x="210" y="130" textAnchor="middle" fill="#38bdf8" fontSize="9">SEEK SUBSTANTIAL SHELTER</text>
        </svg>
      );

    case 'lightning-shelter':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Tree with lightning and red X */}
          <path d="M70 135 V85 M70 85 C55 75 55 55 70 45 C85 55 85 75 70 85 Z" stroke="#eab308" strokeWidth="2" fill="#1e293b" />
          <path d="M70 20 L77 45 L67 52 L80 75" stroke="#ef4444" strokeWidth="3" />
          <circle cx="70" cy="85" r="28" stroke="#ef4444" strokeWidth="4" />
          <line x1="50" y1="65" x2="90" y2="105" stroke="#ef4444" strokeWidth="4" />
          <text x="70" y="150" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="800">NO TREES</text>
          {/* Enclosed building with green check */}
          <rect x="170" y="50" width="85" height="85" rx="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <circle cx="212" cy="70" r="10" fill="#22c55e" fillOpacity="0.2" />
          <path d="M208 70 L211 73 L217 67" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <text x="212" y="95" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">ENCLOSED BUILDING</text>
          <text x="212" y="110" textAnchor="middle" fill="#94a3b8" fontSize="8">OR HARDTOP VEHICLE</text>
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">STEP 02: SHELTER SAFELY INSIDE</text>
        </svg>
      );

    case 'lightning-crouch':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Ground */}
          <line x1="20" y1="135" x2="280" y2="135" stroke="#475569" strokeWidth="2" />
          {/* Figure in lightning crouch position */}
          <circle cx="150" cy="80" r="11" fill="#38bdf8" />
          <path d="M150 91 L145 110 L155 125 L150 133" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Hands over ears */}
          <path d="M142 80 H136 M158 80 H164" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          {/* Minimal contact indicator on balls of feet */}
          <ellipse cx="150" cy="134" rx="12" ry="3" fill="#22c55e" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">STEP 03: EMERGENCY CROUCH (IF TRAPPED IN OPEN)</text>
          <text x="150" y="150" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700">SQUAT ON BALLS OF FEET • HEELS TOUCHING • HEAD TUCKED</text>
        </svg>
      );

    // ----------------------------------------------------
    // TSUNAMI (3 steps)
    // ----------------------------------------------------
    case 'tsunami-warning':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Ocean receding rapidly */}
          <path d="M20 120 H120 L280 135" stroke="#06b6d4" strokeWidth="3" />
          <path d="M120 120 L160 135 H280" stroke="#0891b2" strokeWidth="2" strokeDasharray="3 3" />
          <text x="80" y="110" fill="#06b6d4" fontSize="9" fontWeight="700">NORMAL SHORELINE</text>
          <text x="200" y="150" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="800">WATER RECEDES EXPOSING REEF</text>
          <path d="M180 100 L180 125 M173 118 L180 125 L187 118" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="22" fill="#06b6d4" fontSize="10" fontWeight="700">STEP 01: NATURAL TSUNAMI WARNING SIGNS</text>
        </svg>
      );

    case 'tsunami-evacuate':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Giant Tsunami wave */}
          <path d="M20 135 C60 135 70 80 80 50 C60 50 40 70 20 80" stroke="#06b6d4" strokeWidth="4" fill="#0891b2" fillOpacity="0.4" />
          {/* Rising slope */}
          <path d="M100 135 L180 90 L270 45" stroke="#475569" strokeWidth="3" />
          {/* Person running uphill */}
          <circle cx="210" cy="65" r="8" fill="#22c55e" />
          <path d="M210 73 L205 85 L215 90" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">STEP 02: MOVE 2+ KM INLAND / 30M UP IMMEDIATELY</text>
          <text x="230" y="35" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">HIGH GROUND (+30M)</text>
        </svg>
      );

    case 'tsunami-multiple':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Wave series 1, 2, 3 */}
          <path d="M30 120 C50 60 70 60 90 120 C110 30 140 30 170 120 C190 70 210 70 240 120 H280" stroke="#0284c7" strokeWidth="3" fill="#0284c7" fillOpacity="0.2" />
          <text x="60" y="80" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="700">WAVE 1</text>
          <text x="130" y="50" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="800">WAVE 2 (LARGER)</text>
          <text x="205" y="80" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="700">WAVE 3</text>
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 03: FIRST WAVE IS RARELY THE LARGEST</text>
          <text x="150" y="145" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="700">STAY ON HIGH GROUND FOR 6+ HOURS</text>
        </svg>
      );

    // ----------------------------------------------------
    // LANDSLIDE (3 steps)
    // ----------------------------------------------------
    case 'landslide-warning':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Hillside with tension crack */}
          <path d="M30 135 L120 100 L200 60 L270 30" stroke="#78350f" strokeWidth="4" />
          <path d="M130 90 L145 105" stroke="#ef4444" strokeWidth="3" strokeDasharray="2 2" />
          {/* Tilting pole / tree */}
          <line x1="160" y1="75" x2="185" y2="40" stroke="#eab308" strokeWidth="3" />
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 01: RECOGNIZE EARLY SLOPE DEFORMATION</text>
          <text x="150" y="140" textAnchor="middle" fill="#fca5a5" fontSize="9">TILTING POLES • CRACKING FOUNDATIONS</text>
        </svg>
      );

    case 'landslide-lateral':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Downslope debris flow arrow */}
          <path d="M80 30 V130 M70 115 L80 130 L90 115" stroke="#ef4444" strokeWidth="4" />
          <text x="80" y="20" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="800">SLOPE PATH</text>
          {/* 90-degree escape vector */}
          <path d="M80 80 H220 M205 70 L220 80 L205 90" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
          <circle cx="240" cy="80" r="10" fill="#22c55e" />
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">STEP 02: RUN PERPENDICULAR (90°) TO FLOW PATH</text>
          <text x="160" y="115" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">LATERAL ESCAPE</text>
        </svg>
      );

    case 'landslide-curl':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Curled person */}
          <circle cx="150" cy="85" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="150" cy="80" r="10" fill="#38bdf8" />
          <path d="M140 85 C140 100 160 100 160 85" stroke="#38bdf8" strokeWidth="3" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">STEP 03: CURL INTO A TIGHT BALL IF TRAPPED</text>
          <text x="150" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="9">LOCK ARMS AROUND HEAD • PROTECT VITALS</text>
        </svg>
      );

    // ----------------------------------------------------
    // HEATWAVE (3 steps)
    // ----------------------------------------------------
    case 'heat-hydrate':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Water glass / bottle + ORS */}
          <rect x="70" y="55" width="40" height="65" rx="6" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <path d="M70 85 H110" stroke="#38bdf8" strokeWidth="2" />
          {/* ORS packet */}
          <rect x="135" y="65" width="45" height="55" rx="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="157" y="95" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="900">ORS</text>
          <circle cx="230" cy="75" r="24" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="2" />
          <path d="M230 60 V90 M215 75 H245" stroke="#f59e0b" strokeWidth="3" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">STEP 01: DRINK WATER FREQUENTLY (EVEN BEFORE THIRST)</text>
          <text x="150" y="145" textAnchor="middle" fill="#94a3b8" fontSize="9">REPLENISH ELECTROLYTES • AVOID ALCOHOL &amp; COFFEE</text>
        </svg>
      );

    case 'heat-shade':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Blazing sun + umbrella shade */}
          <circle cx="70" cy="50" r="16" fill="#f59e0b" />
          <path d="M140 130 V75 C140 55 180 55 180 75 V130" stroke="#38bdf8" strokeWidth="3" />
          <path d="M120 75 C120 50 200 50 200 75 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="160" cy="95" r="7" fill="#22c55e" />
          <text x="20" y="22" fill="#f59e0b" fontSize="10" fontWeight="700">STEP 02: AVOID 11:00 AM – 4:00 PM DIRECT SUN</text>
          <text x="160" y="148" textAnchor="middle" fill="#22c55e" fontSize="9">REST IN VENTILATED SHADE</text>
        </svg>
      );

    case 'heat-coolvictim':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Person lying with legs elevated */}
          <circle cx="75" cy="100" r="8" fill="#38bdf8" />
          <line x1="85" y1="105" x2="140" y2="105" stroke="#38bdf8" strokeWidth="4" />
          <line x1="140" y1="105" x2="175" y2="85" stroke="#38bdf8" strokeWidth="4" />
          {/* Ice pack / wet cloth on forehead */}
          <rect x="68" y="88" width="14" height="6" rx="2" fill="#06b6d4" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 03: RAPID COOLING FOR HEATSTROKE (DIAL 112)</text>
          <text x="150" y="140" textAnchor="middle" fill="#38bdf8" fontSize="9">APPLY COLD WATER SPONGING TO ARMPITS &amp; NECK</text>
        </svg>
      );

    // ----------------------------------------------------
    // CHEMICAL / BIO / INDUSTRIAL HAZARDS
    // ----------------------------------------------------
    case 'chemical-wind':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Gas plume */}
          <path d="M40 120 C50 80 80 70 110 80 C140 90 170 50 200 60" stroke="#eab308" strokeWidth="4" strokeDasharray="3 3" />
          <text x="70" y="60" fill="#eab308" fontSize="9" fontWeight="800">TOXIC PLUME</text>
          {/* Upwind arrow */}
          <path d="M220 120 V50 M205 65 L220 50 L235 65" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 01: MOVE UPWIND &amp; UPHILL</text>
          <text x="220" y="140" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="800">RUN UPWIND</text>
        </svg>
      );

    case 'chemical-wetcloth':
    case 'bio-mask':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Face profile with N95 mask / wet cloth */}
          <circle cx="150" cy="75" r="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <path d="M140 70 Q165 75 170 95 Q145 105 135 90 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <path d="M140 70 L125 78 M140 95 L125 90" stroke="#38bdf8" strokeWidth="2" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">PROTECTIVE RESPIRATORY SEAL</text>
          <text x="150" y="140" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">N95 / WET CLOTH OVER NOSE &amp; MOUTH</text>
        </svg>
      );

    case 'chemical-shelter':
    case 'wildfire-seal':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Sealed room with duct tape */}
          <rect x="80" y="40" width="140" height="95" rx="6" fill="#1e293b" stroke="#22c55e" strokeWidth="3" />
          <line x1="80" y1="40" x2="220" y2="40" stroke="#f59e0b" strokeWidth="4" />
          <line x1="80" y1="135" x2="220" y2="135" stroke="#f59e0b" strokeWidth="4" />
          <text x="150" y="80" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="800">SEAL IN PLACE</text>
          <text x="150" y="98" textAnchor="middle" fill="#94a3b8" fontSize="9">TAPE AIR VENTS &amp; SHUT HVAC</text>
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">SEAL ROOM AGAINST TOXIC INGRESS</text>
        </svg>
      );

    // ----------------------------------------------------
    // ROAD ACCIDENT (4 steps)
    // ----------------------------------------------------
    case 'accident-triangle':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Reflective red hazard warning triangle */}
          <polygon points="150,45 100,125 200,125" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="150,65 120,115 180,115" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <circle cx="150" cy="95" r="4" fill="#ffffff" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 01: SECURE THE SCENE (HAZARDS &amp; TRIANGLE)</text>
          <text x="150" y="148" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="800">PLACE TRIANGLE 50M BEHIND VEHICLE</text>
        </svg>
      );

    case 'accident-call':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Phone dialing 112 */}
          <rect x="115" y="40" width="70" height="95" rx="10" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <circle cx="150" cy="120" r="5" fill="#64748b" />
          <text x="150" y="70" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="900">112</text>
          <text x="150" y="85" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="700">GPS / CASUALTY COUNT</text>
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 02: CALL 112 WITH EXACT LANDMARKS</text>
        </svg>
      );

    case 'accident-spine':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Patient spine immobilization */}
          <circle cx="70" cy="85" r="9" fill="#38bdf8" />
          <line x1="80" y1="85" x2="210" y2="85" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
          {/* Hands holding head steady */}
          <path d="M60 75 H80 M60 95 H80" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 03: DO NOT MOVE VICTIM (SPINAL IMMOBILIZATION)</text>
          <text x="150" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="800">KEEP HEAD &amp; NECK INLINE</text>
        </svg>
      );

    case 'accident-bleed':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Pressure dressing */}
          <rect x="110" y="60" width="80" height="50" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <path d="M120 70 H180 M120 85 H180 M120 100 H180" stroke="#f87171" strokeWidth="2" />
          <path d="M150 40 V60 M140 50 L150 60 L160 50" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 04: CONTROL MASSIVE BLEEDING</text>
          <text x="150" y="135" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">DIRECT CONTINUOUS FIRM PRESSURE</text>
        </svg>
      );

    // ----------------------------------------------------
    // BUILDING COLLAPSE (3 steps)
    // ----------------------------------------------------
    case 'collapse-void':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Heavy beam resting on sturdy object creating void */}
          <rect x="60" y="80" width="60" height="55" rx="4" fill="#334155" />
          <line x1="50" y1="65" x2="230" y2="135" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
          <circle cx="100" cy="115" r="8" fill="#22c55e" />
          <text x="20" y="22" fill="#22c55e" fontSize="10" fontWeight="700">STEP 01: LOCATE SURVIVAL VOID NEXT TO STURDY BULK</text>
          <text x="175" y="95" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="800">TRIANGLE OF VOID</text>
        </svg>
      );

    case 'collapse-dust':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          <circle cx="150" cy="75" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <rect x="135" y="70" width="30" height="20" rx="4" fill="#0284c7" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">STEP 02: FILTER INHALED AIR WITH CLOTH</text>
          <text x="150" y="135" textAnchor="middle" fill="#94a3b8" fontSize="10">PROTECT LUNGS FROM CONCRETE DUST</text>
        </svg>
      );

    case 'collapse-tap':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Metal pipe + tapping acoustic soundwaves */}
          <line x1="40" y1="90" x2="260" y2="90" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="120" cy="90" r="14" fill="#f59e0b" />
          <path d="M150 70 C165 80 165 100 150 110" stroke="#f59e0b" strokeWidth="3" />
          <path d="M170 60 C195 75 195 105 170 120" stroke="#f59e0b" strokeWidth="3" />
          <text x="20" y="22" fill="#f59e0b" fontSize="10" fontWeight="700">STEP 03: RHYTHMIC ACOUSTIC SIGNALING</text>
          <text x="150" y="140" textAnchor="middle" fill="#eab308" fontSize="10" fontWeight="800">TAP 3 TIMES ON METAL PIPES</text>
        </svg>
      );

    // ----------------------------------------------------
    // URBAN FLOOD (3 steps)
    // ----------------------------------------------------
    case 'urbanflood-underpass':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Submerged underpass bridge */}
          <path d="M40 70 H110 V130 H190 V70 H260" stroke="#64748b" strokeWidth="4" />
          <path d="M110 95 H190 V130 H110 Z" fill="#0284c7" fillOpacity="0.6" />
          <circle cx="150" cy="70" r="22" stroke="#ef4444" strokeWidth="4" fill="#ef4444" fillOpacity="0.1" />
          <line x1="135" y1="55" x2="165" y2="85" stroke="#ef4444" strokeWidth="4" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 01: NEVER ENTER FLOODED UNDERPASSES</text>
          <text x="150" y="145" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="800">RAPID SUBMERSION TRAP</text>
        </svg>
      );

    case 'urbanflood-manhole':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Open storm drain swirl */}
          <ellipse cx="150" cy="115" rx="35" ry="15" fill="#0284c7" stroke="#ef4444" strokeWidth="3" />
          <path d="M130 115 C145 105 155 125 170 115" stroke="#38bdf8" strokeWidth="2" />
          <line x1="100" y1="60" x2="135" y2="115" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="20" y="22" fill="#eab308" fontSize="10" fontWeight="700">STEP 02: PROBE PATH WITH STICK FOR OPEN MANHOLES</text>
          <text x="150" y="148" textAnchor="middle" fill="#fca5a5" fontSize="9">HIGH RISK OF UNSEEN SEWER VACUUM</text>
        </svg>
      );

    case 'urbanflood-basement':
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Basement stairs taking water */}
          <path d="M60 50 H90 V70 H120 V90 H150 V110 H180 V130" stroke="#94a3b8" strokeWidth="3" />
          <path d="M120 90 L180 130 H60 Z" fill="#0284c7" fillOpacity="0.5" />
          <circle cx="215" cy="80" r="26" stroke="#ef4444" strokeWidth="4" />
          <line x1="197" y1="62" x2="233" y2="98" stroke="#ef4444" strokeWidth="4" />
          <text x="20" y="22" fill="#ef4444" fontSize="10" fontWeight="700">STEP 03: EVACUATE BASEMENTS &amp; UNDERGROUND PARKING</text>
          <text x="215" y="130" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="800">NO BASEMENT ACCESS</text>
        </svg>
      );

    // ----------------------------------------------------
    // MULTI-HAZARD / GENERIC PROTOCOL
    // ----------------------------------------------------
    case 'multi-triage':
    case 'multi-power':
    case 'multi-c2':
    default:
      return (
        <svg viewBox="0 0 300 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="160" rx="12" fill="#0f172a" />
          {/* Verified safety shield */}
          <circle cx="150" cy="75" r="42" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M150 45 L175 56 V80 C175 98 150 110 150 110 C150 110 125 98 125 80 V56 L150 45 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M141 77 L147 83 L161 69" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="20" y="22" fill="#38bdf8" fontSize="10" fontWeight="700">RESQAI PROTOCOL DRILL</text>
          <text x="150" y="138" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">VERIFIED NDMA &amp; ERSS 112 STANDARD</text>
        </svg>
      );
  }
};

export const SafetyHeroGraphic = ({ className = "w-full h-auto" }: IllustrationProps) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 p-6 border border-slate-800 ${className}`}>
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <svg viewBox="0 0 700 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="350" cy="160" r="140" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="350" cy="160" r="95" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
        <circle cx="350" cy="160" r="50" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />

        {/* Central Hub: ResQAI Safety Intelligence */}
        <g>
          <circle cx="350" cy="160" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="350" cy="160" r="24" fill="#0284c7" fillOpacity="0.2" />
          <path d="M350 144 L362 153 V168 C362 178 350 184 350 184 C350 184 338 178 338 168 V153 L350 144 Z" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <path d="M346 163 L349 166 L356 158" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="350" y="208" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700" letterSpacing="0.08em">RESQAI INTEL</text>
        </g>

        {/* Node 1: Citizen */}
        <g>
          <line x1="324" y1="140" x2="200" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="190" cy="75" r="28" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
          <circle cx="190" cy="68" r="7" fill="#22c55e" />
          <path d="M178 84 C178 77 184 75 190 75 C196 75 202 77 202 84" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <text x="190" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">CITIZEN SAFETY</text>
          <text x="190" y="132" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700">DROP • COVER • HOLD</text>
        </g>

        {/* Node 2: ERSS 112 Command */}
        <g>
          <line x1="376" y1="140" x2="510" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="520" cy="75" r="28" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
          <rect x="508" y="65" width="24" height="20" rx="4" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" />
          <path d="M515 72 H525 M515 78 H521" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <text x="520" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">PAN-INDIA 112</text>
          <text x="520" y="132" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">POLICE • FIRE • MEDICAL</text>
        </g>

        {/* Node 3: Early Warning & Weather */}
        <g>
          <line x1="324" y1="180" x2="190" y2="240" stroke="#eab308" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="180" cy="245" r="28" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
          <circle cx="180" cy="245" r="10" stroke="#eab308" strokeWidth="2" />
          <path d="M180 230 V234 M180 256 V260 M165 245 H169 M191 245 H195" stroke="#eab308" strokeWidth="2" />
          <text x="180" y="287" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">NDMA & IMD RADAR</text>
          <text x="180" y="301" textAnchor="middle" fill="#eab308" fontSize="9" fontWeight="700">EARLY TRIGGER ALERTS</text>
        </g>

        {/* Node 4: Responders & Field Teams */}
        <g>
          <line x1="376" y1="180" x2="520" y2="240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="530" cy="245" r="28" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <path d="M518 252 L530 238 L542 252" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M524 252 V258 H536 V252" stroke="#3b82f6" strokeWidth="2" />
          <text x="530" y="287" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">NDRF & SDRF TEAMS</text>
          <text x="530" y="301" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="700">RAPID DEPLOYMENT</text>
        </g>
      </svg>
    </div>
  );
};
