'use client';

import React from 'react';
import {
  Layers,
  Flame,
  Truck,
  Building2,
  Shield,
  Hospital,
  Home,
  AlertTriangle,
  Route,
  Activity
} from 'lucide-react';

export interface MapLayerState {
  incidents: boolean;
  vehicles: boolean;
  fireStations: boolean;
  policeStations: boolean;
  hospitals: boolean;
  reliefCenters: boolean;
  hazardZones: boolean;
  evacuationRoutes: boolean;
  heatmap: boolean;
  vehicleRoutes: boolean;
}

interface MapLayerControlProps {
  layers: MapLayerState;
  onToggleLayer: (key: keyof MapLayerState) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const MapLayerControl: React.FC<MapLayerControlProps> = ({
  layers,
  onToggleLayer,
  isOpen,
  onToggleOpen
}) => {
  const layerItems: { key: keyof MapLayerState; label: string; icon: any; color: string }[] = [
    { key: 'incidents', label: 'Incidents & SOS', icon: Flame, color: 'text-rose-400' },
    { key: 'vehicles', label: 'Responder Fleet', icon: Truck, color: 'text-blue-400' },
    { key: 'fireStations', label: 'Fire Stations', icon: Building2, color: 'text-amber-400' },
    { key: 'policeStations', label: 'Police Stations', icon: Shield, color: 'text-indigo-400' },
    { key: 'hospitals', label: 'Hospitals & Trauma', icon: Hospital, color: 'text-emerald-400' },
    { key: 'reliefCenters', label: 'Relief Centers', icon: Home, color: 'text-cyan-400' },
    { key: 'hazardZones', label: 'Hazard Polygons (Demo)', icon: AlertTriangle, color: 'text-red-400' },
    { key: 'evacuationRoutes', label: 'Evacuation Corridors', icon: Route, color: 'text-teal-400' },
    { key: 'heatmap', label: 'Incident Density Heatmap', icon: Activity, color: 'text-purple-400' },
    { key: 'vehicleRoutes', label: 'Live Vehicle Routes', icon: Route, color: 'text-emerald-400' }
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggleOpen}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition shadow-lg backdrop-blur-md border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-500 shadow-blue-900/40'
            : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>MAP LAYERS</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-slate-950/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-30 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
              EOC TACTICAL OVERLAYS
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Independent Toggles
            </span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1 scrollbar-none">
            {layerItems.map((item) => {
              const Icon = item.icon;
              const active = layers[item.key];
              return (
                <label
                  key={item.key}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono cursor-pointer transition ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className="font-semibold text-[11px]">{item.label}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggleLayer(item.key)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                </label>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-2 text-[10px] font-mono text-slate-400 text-center">
            OpenFreeMap WebGL Vector Render
          </div>
        </div>
      )}
    </div>
  );
};
