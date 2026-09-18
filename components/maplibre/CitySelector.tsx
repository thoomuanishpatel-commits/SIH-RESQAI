'use client';

import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, Compass } from 'lucide-react';
import { CITIES_DATA, CityPreset } from '@/data/liveMapData';

interface CitySelectorProps {
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onSelectCity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = CITIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono font-bold transition shadow-lg backdrop-blur-md"
      >
        <MapPin className="w-3.5 h-3.5 text-rose-400" />
        <span>{selectedCity.name}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
          DEMO DATA
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-12 w-64 bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-30 space-y-2 animate-fadeIn">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search City / Region..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Cities list */}
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-none">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-mono transition text-left ${
                  selectedCity.id === city.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold">{city.name}</div>
                  <div className="text-[10px] text-slate-400">{city.state}</div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {city.center[1].toFixed(2)}°N
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-2 text-[10px] font-mono text-slate-400 text-center">
            Pluggable Geocoder Interface
          </div>
        </div>
      )}
    </div>
  );
};
