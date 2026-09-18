'use client';

import React, { useState } from 'react';
import {
  Truck,
  X,
  Compass,
  Gauge,
  Clock,
  MapPin,
  Route,
  Activity,
  History,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { LiveVehicle, LiveIncident } from '@/data/liveMapData';

interface VehicleDetailPanelProps {
  vehicle: LiveVehicle;
  onClose: () => void;
  assignedIncident?: LiveIncident;
  onFollowVehicle: (vehicle: LiveVehicle) => void;
  onViewRoute: (vehicle: LiveVehicle) => void;
  onToggleTrackHistory: (vehicle: LiveVehicle) => void;
  isShowingTrack: boolean;
  onOpenIncident?: (incidentId: string) => void;
}

export const VehicleDetailPanel: React.FC<VehicleDetailPanelProps> = ({
  vehicle,
  onClose,
  assignedIncident,
  onFollowVehicle,
  onViewRoute,
  onToggleTrackHistory,
  isShowingTrack,
  onOpenIncident
}) => {
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'FIRE':
        return '🚒';
      case 'AMBULANCE':
        return '🚑';
      case 'POLICE':
        return '🚓';
      case 'RELIEF':
        return '🛟';
      case 'DRONE':
        return '🚁';
      default:
        return '🚨';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESPONDING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            RESPONDING
          </span>
        );
      case 'ON_SCENE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ON SCENE
          </span>
        );
      case 'AVAILABLE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            AVAILABLE
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950/95 border border-slate-800/90 rounded-3xl p-5 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto space-y-5 text-slate-200 scrollbar-none">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
            {getVehicleIcon(vehicle.vehicle_type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-base font-black font-mono text-white tracking-wide">
                UNIT {vehicle.vehicle_code}
              </span>
              {getStatusBadge(vehicle.status)}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {vehicle.vehicle_type} APPARATUS • {vehicle.baseStation}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">SPEED</span>
          <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            {vehicle.speed} km/h
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">HEADING</span>
          <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            {vehicle.heading}°
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">DISTANCE</span>
          <span className="text-base font-black text-emerald-400 flex items-center gap-1 mt-0.5">
            {vehicle.distanceToIncidentKm || 2.4} km
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase">ETA</span>
          <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {vehicle.etaString || '05:00'}
          </span>
        </div>
      </div>

      {/* GPS Telemetry Fix */}
      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3 h-3 text-rose-400" />
            TELEMETRY COORDINATES
          </span>
          <span className="text-emerald-400">Updated {vehicle.last_updated}</span>
        </div>
        <div className="text-slate-300 text-[11px]">
          Lat: {vehicle.latitude.toFixed(5)}° N • Lng: {vehicle.longitude.toFixed(5)}° E
        </div>
      </div>

      {/* Assigned Incident Card */}
      {assignedIncident && (
        <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              ASSIGNED INCIDENT
            </span>
            <span className="text-xs font-mono font-bold text-white">
              #{assignedIncident.id}
            </span>
          </div>

          <h4 className="text-xs font-bold text-white">
            {assignedIncident.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
            {assignedIncident.address}
          </p>

          <button
            onClick={() => onOpenIncident && onOpenIncident(assignedIncident.id)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-mono font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>View Incident Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800 font-mono text-xs">
        <button
          onClick={() => onFollowVehicle(vehicle)}
          className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition shadow"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>FOLLOW</span>
        </button>

        <button
          onClick={() => onViewRoute(vehicle)}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border border-slate-700"
        >
          <Route className="w-3.5 h-3.5 text-emerald-400" />
          <span>VIEW ROUTE</span>
        </button>

        <button
          onClick={() => onToggleTrackHistory(vehicle)}
          className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border ${
            isShowingTrack
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>{isShowingTrack ? 'HIDE TRACK' : 'SHOW TRACK'}</span>
        </button>
      </div>

      {/* Track Details if enabled */}
      {isShowingTrack && (
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-[11px] font-mono text-slate-300 space-y-1 animate-fadeIn">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <History className="w-3 h-3" />
            <span>GPS BREADCRUMB TELEMETRY TRAIL</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Trip Start: 12 mins ago</span>
            <span>Distance: 6.8 km</span>
          </div>
          <div className="text-slate-400">
            Waypoints: {vehicle.trackHistory?.length || 4} GPS pings recorded
          </div>
        </div>
      )}
    </div>
  );
};
