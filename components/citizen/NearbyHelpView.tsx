'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Shield,
  Flame,
  Home,
  Navigation,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';

type HelpFilter = 'ALL' | 'HOSPITAL' | 'POLICE' | 'FIRE' | 'SHELTER';

export const NearbyHelpView: React.FC = () => {
  const { hospitals, shelters, units } = useEmergency();
  const [filter, setFilter] = useState<HelpFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine resources into uniform items
  const allFacilities = [
    ...hospitals.map(h => ({
      id: h.id,
      name: h.name,
      type: 'HOSPITAL' as const,
      address: h.location.address,
      zone: h.location.zone,
      distanceKm: (Math.random() * 2.5 + 1.1).toFixed(1),
      status: h.status === 'ACCEPTING' ? 'Open & Accepting' : h.status === 'CRITICAL_ONLY' ? 'Critical Cases Only' : 'At Capacity',
      capacityDetail: `${h.availableBeds} beds available (${h.icuAvailable} ICU)`,
      phone: h.phone,
      isOpen: h.status !== 'AT_CAPACITY',
      icon: Building,
      accent: 'text-rose-400 border-rose-800 bg-rose-950/20'
    })),
    ...shelters.map(s => ({
      id: s.id,
      name: s.name,
      type: 'SHELTER' as const,
      address: s.location.address,
      zone: s.location.zone,
      distanceKm: (Math.random() * 3.2 + 0.8).toFixed(1),
      status: s.isOpen ? 'Open Relief Center' : 'Temporarily Full',
      capacityDetail: `${s.capacity - s.occupancy} spaces available (${s.foodSupplyPercent}% Food / ${s.waterSupplyPercent}% Water)`,
      phone: s.contactNumber,
      isOpen: s.isOpen,
      icon: Home,
      accent: 'text-emerald-400 border-emerald-800 bg-emerald-950/20'
    })),
    {
      id: 'PS-01',
      name: 'Madhapur Police Station & Cyberabad Control',
      type: 'POLICE' as const,
      address: 'Near Durgam Cheruvu, Hitec City',
      zone: 'Madhapur',
      distanceKm: '1.2',
      status: 'Open 24/7',
      capacityDetail: 'Armed emergency response & patrol active',
      phone: '+91 40 2785 2400',
      isOpen: true,
      icon: Shield,
      accent: 'text-blue-400 border-blue-800 bg-blue-950/20'
    },
    {
      id: 'FS-01',
      name: 'HITEC City Fire Station (Disaster Response Post)',
      type: 'FIRE' as const,
      address: 'Behind Cyber Towers, Madhapur',
      zone: 'Madhapur',
      distanceKm: '1.5',
      status: 'Ready for Deployment',
      capacityDetail: '2 Fire Engines & 1 Hydraulic Tower on standby',
      phone: '+91 40 2311 0101',
      isOpen: true,
      icon: Flame,
      accent: 'text-amber-400 border-amber-800 bg-amber-950/20'
    }
  ];

  const filteredFacilities = allFacilities.filter(f => {
    if (filter !== 'ALL' && f.type !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.zone.toLowerCase().includes(q) || f.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            COMMUNITY SAFETY RESOURCES
          </span>
        </div>
        <h1 className="text-3xl font-black text-white">Find Nearby Help</h1>
        <p className="text-xs text-slate-300 mt-1">
          Verified directory of local trauma centers, police outposts, fire stations, and emergency relief shelters.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', 'HOSPITAL', 'SHELTER', 'POLICE', 'FIRE'] as HelpFilter[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                filter === tab
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'ALL SERVICES' : `${tab}S`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by neighborhood..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacilities.map(facility => {
          const Icon = facility.icon;
          return (
            <div
              key={facility.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border ${facility.accent} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{facility.type}</span>
                      <span className="text-xs font-mono font-bold text-blue-400">{facility.distanceKm} km away</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">{facility.name}</h3>
                    <p className="text-xs text-slate-400">{facility.address}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                    facility.isOpen
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950/80 text-rose-400 border-rose-800'
                  }`}
                >
                  {facility.status}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 font-mono flex items-center justify-between">
                <span>Capacity:</span>
                <span className="font-semibold text-white">{facility.capacityDetail}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${facility.phone}`}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700/60"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {facility.phone.slice(-10)}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
