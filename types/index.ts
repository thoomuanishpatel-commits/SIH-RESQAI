export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type IncidentCategory = 
  | 'FIRE'
  | 'ACCIDENT'
  | 'FLOOD'
  | 'COLLAPSE'
  | 'MISSING_PERSON'
  | 'HAZARD'
  | 'MEDICAL';

export type IncidentStatus = 
  | 'REPORTED'
  | 'VERIFIED'
  | 'DISPATCHED'
  | 'RESPONDER_EN_ROUTE'
  | 'ON_SCENE'
  | 'CONTAINED'
  | 'RESOLVED';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  zone: string;
}

export interface LiveUserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  address: string;
  zone: string;
  status: 'ACQUIRING' | 'LOCKED' | 'DENIED' | 'UNSUPPORTED';
  updatedAt: string;
}

export interface Incident {
  id: string;
  type: IncidentCategory;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: LocationCoords;
  reportedAt: string; // ISO string
  reportedVia: 'SOS' | 'VOICE' | 'PHOTO' | 'MANUAL' | 'SENSOR';
  estimatedCasualties: number;
  trappedCount?: number;
  reporter?: {
    name: string;
    phone: string;
    isAnonymous?: boolean;
  };
  assignedUnits: string[]; // Unit IDs
  aiAnalysis?: {
    detectedHazards: string[];
    confidence: number;
    recommendedDepartment: string;
    reasoning: string;
    sentimentUrgency: number; // 0-100
  };
  clusterId?: string;
  photoUrl?: string;
  audioTranscript?: string;
  tokenNumber?: string;
  verificationPhotoUrl?: string;
}

export interface IncidentCluster {
  id: string;
  name: string;
  rootIncidentType: IncidentCategory;
  center: LocationCoords;
  radiusKm: number;
  incidentIds: string[];
  reportCount: number;
  affectedPopulationEstimate: number;
  status: 'FORMING' | 'ESCALATING' | 'PEAK' | 'DE-ESCALATING' | 'CONTAINED';
  detectedAt: string;
  trend: 'UP' | 'STABLE' | 'DOWN';
  threatSummary: string;
}

export type ResponderType = 'FIRE' | 'POLICE' | 'EMS' | 'RESCUE' | 'HAZMAT' | 'COMMAND_POST';
export type ResponderStatus = 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'BUSY' | 'RETURNING' | 'OFFLINE';

export type VehicleCategory = 
  | 'AMBULANCE_ALS'
  | 'AMBULANCE_BLS'
  | 'AMBULANCE_BUS'
  | 'FIRE_ENGINE'
  | 'FIRE_SKYLIFT'
  | 'FIRE_FOAM'
  | 'POLICE_PATROL'
  | 'POLICE_INTERCEPTOR'
  | 'POLICE_TACTICAL'
  | 'RESCUE_BOAT'
  | 'RESCUE_AMPHIBIOUS'
  | 'HAZMAT_DECON'
  | 'MOBILE_EOC';

export interface EmergencyUnit {
  id: string;
  callsign: string;
  type: ResponderType;
  vehicleCategory: VehicleCategory;
  modelName: string;
  plateNumber: string;
  department: string;
  status: ResponderStatus;
  location: LocationCoords;
  assignedIncidentId?: string;
  etaMinutes?: number;
  distanceKm?: number;
  crewCount: number;
  equipment: string[];
  isICUCapable?: boolean;
  heading?: number;
  speedKmh?: number;
  fuelPercent?: number;
  waterTankLiters?: number;
  oxygenLevelPercent?: number;
  driverName?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: LocationCoords;
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  ventilatorsTotal: number;
  ventilatorsAvailable: number;
  status: 'ACCEPTING' | 'CRITICAL_ONLY' | 'AT_CAPACITY' | 'DIVERTING';
  phone: string;
  traumaLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
}

export interface ReliefShelter {
  id: string;
  name: string;
  location: LocationCoords;
  capacity: number;
  occupancy: number;
  foodSupplyPercent: number;
  waterSupplyPercent: number;
  medicalFacilityAvailable: boolean;
  isOpen: boolean;
  contactNumber: string;
  safeRouteAccessible: boolean;
}

export interface RoadBlock {
  id: string;
  streetName: string;
  zone: string;
  coords: { lat: number; lng: number };
  reason: 'FLOODING' | 'STRUCTURAL_DEBRIS' | 'VEHICLE_ACCIDENT' | 'POWER_LINES_DOWN';
  severity: 'BLOCKED' | 'RESTRICTED_ACCESS' | 'CLEARING_IN_PROGRESS';
  reportedAt: string;
  detourAdvice: string;
}

export interface RiskZone {
  id: string;
  name: string;
  hazardType: 'FLOOD_INUNDATION' | 'FIRE_PERIMETER' | 'COLLAPSE_RISK' | 'TOXIC_PLUME';
  center: { lat: number; lng: number };
  radiusMeters: number;
  severity: IncidentSeverity;
  evacuationStatus: 'ORDERED' | 'WARNING' | 'MONITORING';
  polygon?: [number, number][];
}

export interface DispatchCandidate {
  unit: EmergencyUnit;
  score: number; // 0-100
  etaMinutes: number;
  distanceKm: number;
  reasons: string[];
  isRecommended: boolean;
}

export interface SimulationStep {
  timeOffset: string; // e.g. "00:00", "00:05"
  title: string;
  description: string;
  actionType: 'DETECTION' | 'CLUSTER' | 'ROAD_BLOCK' | 'DISPATCH' | 'HOSPITAL_ALERT' | 'CONTAINMENT';
  impactMetrics: {
    incidentsAdded?: number;
    unitsDispatched?: number;
    affectedCount?: number;
    roadsBlocked?: number;
  };
}

export interface SimulationScenario {
  id: string;
  title: string;
  category: IncidentCategory;
  location: string;
  description: string;
  steps: SimulationStep[];
}

export interface BuildingLandmark {
  id: string;
  name: string;
  category: 'COMMERCIAL' | 'GOVERNMENT' | 'TECH_PARK' | 'TRANSPORT' | 'RESIDENTIAL' | 'HERITAGE';
  lat: number;
  lng: number;
  address: string;
  zone: string;
  occupancyEstimate: number;
  floors: number;
  structuralStatus: 'SAFE' | 'AT_RISK' | 'EVACUATING' | 'MONITORING';
  safetyFeatures: string[];
}
