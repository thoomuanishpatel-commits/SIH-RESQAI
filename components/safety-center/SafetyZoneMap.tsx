'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Shield, Building2, Hospital, Home, AlertCircle, Compass } from 'lucide-react';

interface EmergencyFacility {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'erss' | 'fire';
  distance: string;
  address: string;
  phone: string;
  capacity?: string;
  elevation?: string;
}

const DEMO_FACILITIES: EmergencyFacility[] = [
  {
    id: 'f1',
    name: 'District General Hospital & Trauma Center',
    type: 'hospital',
    distance: '1.4 km',
    address: 'Ring Road Sector 4, Civil Lines',
    phone: '102 / 112',
    capacity: '140 ICU Beds • 24/7 Blood Bank'
  },
  {
    id: 'f2',
    name: 'ERSS 112 Unified Police & Fire Control Substation',
    type: 'erss',
    distance: '2.1 km',
    address: 'Central Station Road',
    phone: '112',
    capacity: '6 Fast Response Units Stationed'
  },
  {
    id: 'f3',
    name: 'Designated High-Elevation Cyclone & Flood Shelter',
    type: 'shelter',
    distance: '3.2 km',
    address: 'Government Higher Secondary School Campus',
    phone: '011-23438252',
    capacity: 'Capacity: 1,200 Persons • Solar Power & RO Water',
    elevation: '+28m above MSL'
  },
  {
    id: 'f4',
    name: 'Municipal Fire Brigade & HAZMAT Unit',
    type: 'fire',
    distance: '2.8 km',
    address: 'Industrial Belt Gate 2',
    phone: '101 / 112',
    capacity: '4 Water Tenders • Chemical Foam Unit'
  }
];

export const SafetyZoneMap = () => {
  const [locationStatus, setLocationStatus] = useState<string>('Defaulting to nearest metro region');
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLocationStatus(`Active coordinates: ${pos.coords.latitude.toFixed(3)}° N, ${pos.coords.longitude.toFixed(3)}° E`);
      },
      () => {
        setIsLocating(false);
        setLocationStatus('Permission denied. Displaying verified regional safety points.');
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="w-5 h-5 text-emerald-400" />;
      case 'erss':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'shelter':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'fire':
      default:
        return <Building2 className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                LOCAL CRISIS INFRASTRUCTURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                DEMO / STATIC SIMULATION
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Your Emergency Safety Zone
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              Locate verified emergency shelters, 24/7 trauma hospitals, and ERSS dispatch nodes near your coordinates.
            </p>
          </div>

          {/* Location button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Detect My Safety Zone'}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {locationStatus}
            </span>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_FACILITIES.map((f) => (
            <div
              key={f.id}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {getIcon(f.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white leading-snug">
                        {f.name}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {f.distance} away • {f.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 my-3 text-xs text-slate-300">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase font-mono mb-0.5">
                    FACILITY READINESS
                  </span>
                  <span>{f.capacity}</span>
                  {f.elevation && (
                    <span className="block text-emerald-400 text-[11px] font-semibold mt-1">
                      Elevation: {f.elevation} (Safe from category 4 storm surge)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <a
                  href={`tel:${f.phone.split('/')[0].trim()}`}
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {f.phone}</span>
                </a>
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
                  Status: Operational
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
