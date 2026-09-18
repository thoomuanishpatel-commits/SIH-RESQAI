'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Incident,
  IncidentCluster,
  EmergencyUnit,
  Hospital,
  ReliefShelter,
  RoadBlock,
  RiskZone,
  SimulationScenario,
  IncidentStatus,
  ResponderStatus,
  IncidentCategory,
  IncidentSeverity,
  BuildingLandmark,
  LiveUserLocation,
  LocationCoords,
  DisasterReport,
  DisasterCategory,
  DisasterStatus
} from '@/types';
import {
  INITIAL_INCIDENTS,
  INITIAL_CLUSTERS,
  INITIAL_UNITS,
  INITIAL_HOSPITALS,
  INITIAL_SHELTERS,
  INITIAL_ROADBLOCKS,
  INITIAL_RISKZONES,
  SIMULATION_SCENARIOS,
  INITIAL_BUILDINGS,
  INITIAL_DISASTER_REPORTS
} from '@/data/demoData';
import { sounds } from '@/lib/soundEffects';
import { generateIncidentId } from '@/lib/utils';
import { reverseGeocodeCoords, HYDERABAD_FALLBACK_COORDS, getCachedLocation } from '@/lib/geocoding';
import { supabase } from '@/lib/supabaseClient';

export type AppView = 
  | 'LANDING'
  | 'CITIZEN'
  | 'COMMAND'
  | 'RESPONDER'
  | 'TRACK'
  | 'SAFETY'
  | 'NEARBY'
  | 'SIMULATION'
  | 'ANALYTICS';

interface EmergencyContextType {
  // Navigation & UI State
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  sosModalOpen: boolean;
  setSosModalOpen: (open: boolean) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  audioMuted: boolean;
  toggleAudio: () => void;

  // Domain Entities
  incidents: Incident[];
  clusters: IncidentCluster[];
  units: EmergencyUnit[];
  hospitals: Hospital[];
  shelters: ReliefShelter[];
  roadBlocks: RoadBlock[];
  riskZones: RiskZone[];
  buildings: BuildingLandmark[];
  selectedBuilding: BuildingLandmark | null;
  setSelectedBuilding: (b: BuildingLandmark | null) => void;

  // Citizen Actions
  createIncident: (incidentData: Partial<Incident>) => string;
  myActiveIncident: Incident | null;
  setMyActiveIncidentId: (id: string | null) => void;

  // Command & Responder Actions
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  dispatchUnit: (unitId: string, incidentId: string) => void;
  updateUnitStatus: (unitId: string, status: ResponderStatus) => void;
  toggleRoadBlock: (id: string) => void;
  resolveIncident: (id: string) => void;

  // Offline / Connectivity Simulation
  isOffline: boolean;
  toggleOfflineMode: () => void;
  offlineQueue: Partial<Incident>[];
  syncOfflineQueue: () => void;

  // Disaster Simulation Mode
  simulationScenario: SimulationScenario | null;
  simulationStepIndex: number;
  isSimulationRunning: boolean;
  startSimulation: (scenarioId: string) => void;
  nextSimulationStep: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;

  // Filter & Search
  filterSeverity: IncidentSeverity | 'ALL';
  setFilterSeverity: (sev: IncidentSeverity | 'ALL') => void;
  selectedResponderUnit: EmergencyUnit | null;
  setSelectedResponderUnit: (unit: EmergencyUnit | null) => void;

  // Dedicated Portals & EOC Admin Auth
  portalMode: 'USER' | 'ADMIN';
  setPortalMode: (mode: 'USER' | 'ADMIN') => void;
  isAdminAuthenticated: boolean;
  adminAuthModalOpen: boolean;
  setAdminAuthModalOpen: (open: boolean) => void;
  loginAdmin: (officerId: string, passcode: string) => boolean;
  logoutAdmin: () => void;

  // Automated Nearest-Ambulance Dispatch State
  autoDispatchedUnit: EmergencyUnit | null;

  // Real Live User GPS Location
  userLiveLocation: LiveUserLocation | null;
  refreshUserLocation: () => Promise<LiveUserLocation | null>;

  // Formal Disaster Reports
  disasterReports: DisasterReport[];
  submitDisasterReport: (data: Omit<DisasterReport, 'id' | 'status' | 'reportedAt' | 'statusHistory'>) => DisasterReport;
  updateReportVerification: (reportId: string, decision: DisasterStatus, notes?: string, adminId?: string) => void;
  getReportById: (id: string) => DisasterReport | undefined;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('LANDING');
  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Entities
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [clusters, setClusters] = useState<IncidentCluster[]>(INITIAL_CLUSTERS);
  const [units, setUnits] = useState<EmergencyUnit[]>(INITIAL_UNITS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [shelters, setShelters] = useState<ReliefShelter[]>(INITIAL_SHELTERS);
  const [roadBlocks, setRoadBlocks] = useState<RoadBlock[]>(INITIAL_ROADBLOCKS);
  const [riskZones, setRiskZones] = useState<RiskZone[]>(INITIAL_RISKZONES);
  const [buildings, setBuildings] = useState<BuildingLandmark[]>(INITIAL_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingLandmark | null>(null);

  // Citizen specific tracking
  const [myActiveIncidentId, setMyActiveIncidentId] = useState<string | null>('RQ-204891');
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'ALL'>('ALL');
  const [selectedResponderUnit, setSelectedResponderUnit] = useState<EmergencyUnit | null>(INITIAL_UNITS[0]);

  // Dedicated Portals & EOC Admin Auth State
  const [portalMode, setPortalMode] = useState<'USER' | 'ADMIN'>('USER');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState<boolean>(false);
  const [autoDispatchedUnit, setAutoDispatchedUnit] = useState<EmergencyUnit | null>(null);
  const ambulanceMovementRef = useRef<NodeJS.Timeout | null>(null);

  // Real-Time Live User GPS Location State
  const [userLiveLocation, setUserLiveLocation] = useState<LiveUserLocation | null>(null);

  // High-precision live location acquisition
  const refreshUserLocation = useCallback((): Promise<LiveUserLocation | null> => {
    return new Promise((resolve) => {
      const cached = getCachedLocation();
      const defaultLat = cached?.lat || HYDERABAD_FALLBACK_COORDS.lat;
      const defaultLng = cached?.lng || HYDERABAD_FALLBACK_COORDS.lng;
      const defaultAddr = cached?.address || HYDERABAD_FALLBACK_COORDS.address;
      const defaultZone = cached?.zone || HYDERABAD_FALLBACK_COORDS.zone;

      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        const fallbackLoc: LiveUserLocation = {
          lat: defaultLat,
          lng: defaultLng,
          accuracy: 10,
          address: defaultAddr,
          zone: defaultZone,
          status: 'UNSUPPORTED',
          updatedAt: new Date().toLocaleTimeString()
        };
        setUserLiveLocation(fallbackLoc);
        resolve(fallbackLoc);
        return;
      }

      setUserLiveLocation(prev => prev ? { ...prev, status: 'ACQUIRING' } : {
        lat: defaultLat,
        lng: defaultLng,
        accuracy: 10,
        address: 'Acquiring high-precision GPS satellite fix...',
        zone: 'Detecting Location...',
        status: 'ACQUIRING',
        updatedAt: new Date().toLocaleTimeString()
      });

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const geo = await reverseGeocodeCoords(latitude, longitude);
          const liveLoc: LiveUserLocation = {
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy || 4),
            address: geo.address,
            zone: geo.zone,
            status: 'LOCKED',
            updatedAt: new Date().toLocaleTimeString()
          };
          setUserLiveLocation(liveLoc);
          resolve(liveLoc);
        },
        (err) => {
          console.warn('Live geolocation failed or denied, using sector baseline:', err.message);
          const fallbackLoc: LiveUserLocation = {
            lat: defaultLat,
            lng: defaultLng,
            accuracy: 12,
            address: defaultAddr,
            zone: defaultZone,
            status: err.code === 1 ? 'DENIED' : 'UNSUPPORTED',
            updatedAt: new Date().toLocaleTimeString()
          };
          setUserLiveLocation(fallbackLoc);
          resolve(fallbackLoc);
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
      );
    });
  }, []);

  // Initialize live location on client mount and set continuous watcher
  useEffect(() => {
    refreshUserLocation();

    let watchId: number | null = null;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            setUserLiveLocation(prev => {
              if (!prev || Math.abs(prev.lat - latitude) > 0.00008 || Math.abs(prev.lng - longitude) > 0.00008) {
                return {
                  lat: latitude,
                  lng: longitude,
                  accuracy: Math.round(accuracy || 3),
                  address: prev?.address && prev.address.includes(',') ? prev.address : `Live GPS: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`,
                  zone: prev?.zone || 'Live Citizen GPS Zone',
                  status: 'LOCKED',
                  updatedAt: new Date().toLocaleTimeString()
                };
              }
              return prev;
            });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 4000, timeout: 10000 }
        );
      } catch (e) {
        console.warn('Geolocation watch error:', e);
      }
    }

    return () => {
      if (watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [refreshUserLocation]);

  // Restore persisted auth session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resqai_admin_auth');
      if (stored === 'true') {
        setIsAdminAuthenticated(true);
      }
    }
  }, []);

  const loginAdmin = useCallback((officerId: string, passcode: string): boolean => {
    const validId = officerId.trim().toLowerCase();
    const validPass = passcode.trim();
    // Authorized EOC personnel or demo credentials
    if (
      (validId === 'commander@resqai.gov.in' || validId === 'admin' || validId === 'officer' || validId === 'eoc') &&
      (validPass === 'resqai112' || validPass === 'admin' || validPass === '7709' || validPass === '112')
    ) {
      setIsAdminAuthenticated(true);
      setPortalMode('ADMIN');
      setActiveView('COMMAND');
      setAdminAuthModalOpen(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('resqai_admin_auth', 'true');
      }
      sounds.playSuccessTone();
      return true;
    }
    sounds.playCriticalAlert();
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    setPortalMode('USER');
    setActiveView('CITIZEN');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resqai_admin_auth');
    }
    sounds.playSuccessTone();
  }, []);

  // Offline mode
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Partial<Incident>[]>([]);

  // Simulation state
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario | null>(SIMULATION_SCENARIOS[0]);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);

  const toggleAudio = useCallback(() => {
    setAudioMuted(prev => {
      sounds.muted = !prev;
      return !prev;
    });
  }, []);

  const toggleOfflineMode = useCallback(() => {
    setIsOffline(prev => !prev);
  }, []);

  // Automated Ambulance Dispatch Engine: finds nearest available unit and moves along road towards disaster
  const dispatchAmbulanceToLocation = useCallback((targetIncidentId: string, destLat: number, destLng: number) => {
    setUnits(prevUnits => {
      const ambulances = prevUnits.filter(u => (u.type === 'EMS' || u.department.toLowerCase().includes('ambulance') || u.department.toLowerCase().includes('medical')) && u.status !== 'OFFLINE');
      let targetAmbulance = ambulances.find(u => u.status === 'AVAILABLE') || ambulances[0] || prevUnits[0];

      let minDistance = Infinity;
      for (const amb of ambulances) {
        const dLat = amb.location.lat - destLat;
        const dLng = amb.location.lng - destLng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < minDistance) {
          minDistance = dist;
          targetAmbulance = amb;
        }
      }

      if (!targetAmbulance) return prevUnits;

      const unitId = targetAmbulance.id;
      const updatedUnit: EmergencyUnit = {
        ...targetAmbulance,
        status: 'EN_ROUTE',
        assignedIncidentId: targetIncidentId,
        etaMinutes: 3
      };

      setAutoDispatchedUnit(updatedUnit);

      // Smooth step-by-step road movement towards incident
      if (ambulanceMovementRef.current) {
        clearInterval(ambulanceMovementRef.current);
      }

      let step = 0;
      const totalSteps = 15;
      const startLat = targetAmbulance.location.lat;
      const startLng = targetAmbulance.location.lng;

      ambulanceMovementRef.current = setInterval(() => {
        step++;
        const progress = Math.min(step / totalSteps, 1);
        // Realistic intermediate coordinates with road curve variance
        const currentLat = startLat + (destLat - startLat) * progress + (Math.random() - 0.5) * 0.0002 * (1 - progress);
        const currentLng = startLng + (destLng - startLng) * progress + (Math.random() - 0.5) * 0.0002 * (1 - progress);
        const remainingEta = Math.max(1, Math.ceil(3 * (1 - progress)));

        setUnits(curr => curr.map(u => {
          if (u.id === unitId) {
            return {
              ...u,
              status: progress >= 1 ? 'ON_SCENE' : 'EN_ROUTE',
              etaMinutes: remainingEta,
              location: {
                ...u.location,
                lat: currentLat,
                lng: currentLng
              }
            };
          }
          return u;
        }));

        setAutoDispatchedUnit(curr => curr && curr.id === unitId ? {
          ...curr,
          status: progress >= 1 ? 'ON_SCENE' : 'EN_ROUTE',
          etaMinutes: remainingEta,
          location: {
            ...curr.location,
            lat: currentLat,
            lng: currentLng
          }
        } : curr);

        if (progress >= 1) {
          if (ambulanceMovementRef.current) {
            clearInterval(ambulanceMovementRef.current);
          }
          setIncidents(curr => curr.map(inc => inc.id === targetIncidentId ? { ...inc, status: 'ON_SCENE' } : inc));
          sounds.playSuccessTone();
        }
      }, 1500);

      return prevUnits.map(u => u.id === unitId ? updatedUnit : u);
    });

    setIncidents(curr => curr.map(inc => {
      if (inc.id === targetIncidentId) {
        return {
          ...inc,
          status: 'DISPATCHED'
        };
      }
      return inc;
    }));
  }, []);

  const createIncident = useCallback((data: Partial<Incident>): string => {
    const newId = data.id || generateIncidentId();

    // Automatically resolve to real live user GPS coordinates
    const resolvedLocation: LocationCoords = data.location || (
      userLiveLocation && userLiveLocation.lat
        ? {
            lat: userLiveLocation.lat,
            lng: userLiveLocation.lng,
            address: userLiveLocation.address,
            zone: userLiveLocation.zone
          }
        : {
            lat: 17.4430 + (Math.random() - 0.5) * 0.04,
            lng: 78.3850 + (Math.random() - 0.5) * 0.04,
            address: 'Live Citizen Geolocation Pin, Hyderabad Sector',
            zone: 'Madhapur'
          }
    );

    const newIncident: Incident = {
      id: newId,
      tokenNumber: data.tokenNumber || newId,
      type: data.type || 'HAZARD',
      title: data.title || 'Reported Emergency',
      description: data.description || 'Emergency assistance requested immediately.',
      severity: data.severity || 'HIGH',
      status: 'REPORTED',
      location: resolvedLocation,
      reportedAt: new Date().toISOString(),
      reportedVia: data.reportedVia || 'SOS',
      estimatedCasualties: data.estimatedCasualties || 1,
      trappedCount: data.trappedCount || 0,
      assignedUnits: [],
      aiAnalysis: data.aiAnalysis || {
        detectedHazards: ['Urgent life safety flag', 'Real-time GPS lock verified'],
        confidence: 0.98,
        recommendedDepartment: 'FIRST RESPONSE COMBINED SQUAD',
        reasoning: `Immediate real-time GPS distress beacon acquired at ${resolvedLocation.lat.toFixed(5)}° N, ${resolvedLocation.lng.toFixed(5)}° E (${resolvedLocation.address}). Automated ambulance dispatch routed immediately.`,
        sentimentUrgency: 98
      },
      reporter: data.reporter,
      photoUrl: data.photoUrl || data.verificationPhotoUrl,
      verificationPhotoUrl: data.verificationPhotoUrl || data.photoUrl,
      audioTranscript: data.audioTranscript
    };

    if (isOffline) {
      setOfflineQueue(prev => [...prev, newIncident]);
      setMyActiveIncidentId(newId);
      return newId;
    }

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    setMyActiveIncidentId(newId);
    sounds.playSosSent();

    // Bi-Directional Database Sync with Supabase Realtime
    try {
      if (supabase) {
        Promise.resolve(
          supabase
            .from('incidents')
            .insert([
              {
                id: newId,
                title: newIncident.title,
                description: newIncident.description,
                type: newIncident.type,
                severity: newIncident.severity,
                status: newIncident.status,
                latitude: resolvedLocation.lat,
                longitude: resolvedLocation.lng,
                address: resolvedLocation.address,
                trapped_count: newIncident.trappedCount,
                photo_url: newIncident.photoUrl,
                reported_at: newIncident.reportedAt
              }
            ])
        )
          .then((res: any) => {
            if (res?.error) console.info('Supabase sync info:', res.error.message);
          })
          .catch((err: any) => {
            console.info('Supabase sync catch:', err);
          });
      }
    } catch (e) {
      console.warn('Supabase sync notice (in-memory active):', e);
    }

    // Trigger automated nearest ambulance dispatch flow immediately
    setTimeout(() => {
      dispatchAmbulanceToLocation(newId, newIncident.location.lat, newIncident.location.lng);
      sounds.playCriticalAlert();
    }, 600);

    return newId;
  }, [isOffline, dispatchAmbulanceToLocation, userLiveLocation]);

  const syncOfflineQueue = useCallback(() => {
    if (offlineQueue.length === 0) return;
    const synced = offlineQueue.map(item => ({
      ...item,
      status: 'VERIFIED' as IncidentStatus,
      reportedAt: new Date().toISOString()
    } as Incident));

    setIncidents(prev => [...synced, ...prev]);
    setOfflineQueue([]);
    setIsOffline(false);
    sounds.playSuccessTone();
  }, [offlineQueue]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, status } : null);
    }
    sounds.playSuccessTone();
  }, [selectedIncident]);

  const resolveIncident = useCallback((id: string) => {
    updateIncidentStatus(id, 'RESOLVED');
  }, [updateIncidentStatus]);

  const dispatchUnit = useCallback((unitId: string, incidentId: string) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          status: 'EN_ROUTE',
          assignedIncidentId: incidentId,
          etaMinutes: Math.floor(Math.random() * 4) + 3
        };
      }
      return unit;
    }));

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const assigned = inc.assignedUnits.includes(unitId) ? inc.assignedUnits : [...inc.assignedUnits, unitId];
        return {
          ...inc,
          assignedUnits: assigned,
          status: 'DISPATCHED'
        };
      }
      return inc;
    }));

    sounds.playCriticalAlert();
  }, []);

  const updateUnitStatus = useCallback((unitId: string, status: ResponderStatus) => {
    setUnits(prev => prev.map(unit => unit.id === unitId ? { ...unit, status } : unit));
    sounds.playSuccessTone();
  }, []);

  const toggleRoadBlock = useCallback((id: string) => {
    setRoadBlocks(prev => prev.map(rb => {
      if (rb.id === id) {
        const nextStatus = rb.severity === 'BLOCKED' ? 'CLEARING_IN_PROGRESS' : 'BLOCKED';
        return { ...rb, severity: nextStatus };
      }
      return rb;
    }));
    sounds.playCriticalAlert();
  }, []);

  // Simulation Engine controls
  const startSimulation = useCallback((scenarioId: string) => {
    const scenario = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    setSimulationScenario(scenario);
    setSimulationStepIndex(0);
    setIsSimulationRunning(true);
    sounds.playCriticalAlert();
  }, []);

  const nextSimulationStep = useCallback(() => {
    if (!simulationScenario) return;
    setSimulationStepIndex(curr => {
      const next = curr + 1;
      if (next >= simulationScenario.steps.length) {
        setIsSimulationRunning(false);
        return curr;
      }
      const step = simulationScenario.steps[next];
      if (step.actionType === 'ROAD_BLOCK') {
        // Toggle roadblock
        setRoadBlocks(rbList => rbList.map((rb, idx) => idx === 0 ? { ...rb, severity: 'BLOCKED' } : rb));
      }
      sounds.playCriticalAlert();
      return next;
    });
  }, [simulationScenario]);

  const pauseSimulation = useCallback(() => setIsSimulationRunning(false), []);
  const resumeSimulation = useCallback(() => setIsSimulationRunning(true), []);
  const resetSimulation = useCallback(() => {
    setSimulationStepIndex(0);
    setIsSimulationRunning(false);
  }, []);

  // Simulation timer tick
  useEffect(() => {
    if (!isSimulationRunning || !simulationScenario) return;
    const timer = setInterval(() => {
      setSimulationStepIndex(curr => {
        if (curr >= simulationScenario.steps.length - 1) {
          setIsSimulationRunning(false);
          return curr;
        }
        return curr + 1;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [isSimulationRunning, simulationScenario]);

  // Formal Disaster Reports State & Supabase Persistence
  const [disasterReports, setDisasterReports] = useState<DisasterReport[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('resqai_disaster_reports');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('LocalStorage load error for disaster reports:', e);
      }
    }
    return INITIAL_DISASTER_REPORTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('resqai_disaster_reports', JSON.stringify(disasterReports));
      } catch (e) {
        console.warn('LocalStorage save error for disaster reports:', e);
      }
    }
  }, [disasterReports]);

  const submitDisasterReport = useCallback((data: Omit<DisasterReport, 'id' | 'status' | 'reportedAt' | 'statusHistory'>): DisasterReport => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `RSQ-2026-${randomNum}`;
    const now = new Date().toISOString();

    const newReport: DisasterReport = {
      ...data,
      id: newId,
      status: 'UNDER_VERIFICATION',
      reportedAt: now,
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          actor: data.userId || 'CITIZEN',
          notes: 'Disaster report submitted via verified citizen portal'
        },
        {
          status: 'UNDER_VERIFICATION',
          timestamp: now,
          actor: 'SYSTEM_EOC_TRIAGE',
          notes: 'Queued for human verification at EOC operations desk'
        }
      ]
    };

    setDisasterReports(prev => [newReport, ...prev]);

    // Mirror to active incidents so maps, CAD, and responder fleets see it immediately
    const mappedCategory = (
      data.category === 'FIRE' ? 'FIRE' :
      data.category === 'ROAD_ACCIDENT' ? 'ACCIDENT' :
      data.category === 'FLOOD' ? 'FLOOD' :
      data.category === 'BUILDING_COLLAPSE' ? 'COLLAPSE' :
      data.category === 'GAS_LEAK' ? 'HAZARD' :
      data.category === 'LANDSLIDE' ? 'HAZARD' :
      data.category === 'SEVERE_STORM' ? 'FLOOD' : 'HAZARD'
    ) as IncidentCategory;

    createIncident({
      id: newId,
      type: mappedCategory,
      title: data.title || `${data.category.replace('_', ' ')} EMERGENCY: ${data.location.address.split(',')[0]}`,
      description: data.description,
      severity: data.severity,
      status: 'REPORTED',
      location: {
        lat: data.location.lat,
        lng: data.location.lng,
        address: data.location.address,
        zone: data.location.zone || 'Citizen Reported Sector'
      },
      photoUrl: data.evidence?.anonymizedPreviewUrl || data.evidence?.previewUrl,
      reportedVia: 'PHOTO'
    });

    // Sync to Supabase table 'disaster_reports'
    try {
      if (supabase) {
        Promise.resolve(
          supabase.from('disaster_reports').insert([
            {
              id: newId,
              category: newReport.category,
              title: newReport.title,
              description: newReport.description,
              severity: newReport.severity,
              status: newReport.status,
              latitude: newReport.location.lat,
              longitude: newReport.location.lng,
              address: newReport.location.address,
              user_id: newReport.userId,
              evidence_path: newReport.evidence?.imagePath,
              ai_confidence: newReport.aiAnalysis?.confidence,
              face_detected: newReport.faceMetadata?.faceDetected,
              reported_at: now
            }
          ])
        ).catch(err => {
          console.info('Supabase disaster_reports insert note:', err);
        });
      }
    } catch (e) {
      console.warn('Supabase sync notice:', e);
    }

    return newReport;
  }, [createIncident]);

  const updateReportVerification = useCallback((
    reportId: string,
    decision: DisasterStatus,
    notes?: string,
    adminId: string = 'EOC_OFFICER_HYD'
  ) => {
    const now = new Date().toISOString();

    setDisasterReports(prev =>
      prev.map(r => {
        if (r.id !== reportId) return r;

        const isFalse = decision === 'FALSE_REPORT';
        const updatedHistory = [
          ...r.statusHistory,
          {
            status: decision,
            timestamp: now,
            actor: adminId,
            notes: notes || `Admin updated status to ${decision}`
          }
        ];

        return {
          ...r,
          status: decision,
          adminVerification: {
            adminId,
            verifiedAt: now,
            decision,
            notes,
            penaltyNoticeDisplayed: isFalse,
            penaltyNoticeAmount: isFalse ? 5000 : 0
          },
          statusHistory: updatedHistory
        };
      })
    );

    // Sync with corresponding incident status
    if (decision === 'VERIFIED') {
      updateIncidentStatus(reportId, 'VERIFIED');
    } else if (decision === 'DISPATCHED') {
      updateIncidentStatus(reportId, 'DISPATCHED');
    } else if (decision === 'RESOLVED' || decision === 'REJECTED' || decision === 'FALSE_REPORT') {
      resolveIncident(reportId);
    }

    // Sync to Supabase
    try {
      if (supabase) {
        Promise.resolve(
          supabase
            .from('disaster_reports')
            .update({
              status: decision,
              verified_by: adminId,
              verification_notes: notes,
              verified_at: now
            })
            .eq('id', reportId)
        ).catch(err => {
          console.info('Supabase verification update note:', err);
        });
      }
    } catch (e) {
      console.warn('Supabase sync note:', e);
    }
  }, [updateIncidentStatus, resolveIncident]);

  const getReportById = useCallback((id: string): DisasterReport | undefined => {
    return disasterReports.find(r => r.id.toLowerCase() === id.toLowerCase());
  }, [disasterReports]);

  const myActiveIncident = incidents.find(inc => inc.id === myActiveIncidentId) || null;

  return (
    <EmergencyContext.Provider
      value={{
        activeView,
        setActiveView,
        sosModalOpen,
        setSosModalOpen,
        selectedIncident,
        setSelectedIncident,
        audioMuted,
        toggleAudio,
        incidents,
        clusters,
        units,
        hospitals,
        shelters,
        roadBlocks,
        riskZones,
        buildings,
        selectedBuilding,
        setSelectedBuilding,
        createIncident,
        myActiveIncident,
        setMyActiveIncidentId,
        updateIncidentStatus,
        dispatchUnit,
        updateUnitStatus,
        toggleRoadBlock,
        resolveIncident,
        isOffline,
        toggleOfflineMode,
        offlineQueue,
        syncOfflineQueue,
        simulationScenario,
        simulationStepIndex,
        isSimulationRunning,
        startSimulation,
        nextSimulationStep,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        filterSeverity,
        setFilterSeverity,
        selectedResponderUnit,
        setSelectedResponderUnit,
        portalMode,
        setPortalMode,
        isAdminAuthenticated,
        adminAuthModalOpen,
        setAdminAuthModalOpen,
        loginAdmin,
        logoutAdmin,
        autoDispatchedUnit,
        userLiveLocation,
        refreshUserLocation,
        disasterReports,
        submitDisasterReport,
        updateReportVerification,
        getReportById
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
