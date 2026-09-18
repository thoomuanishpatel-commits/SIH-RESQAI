// Preloaded Emergency Incident & Vehicle Dataset for ResQAI Live Map

export type MapHazardType =
  | 'FIRE'
  | 'ACCIDENT'
  | 'FLOOD'
  | 'CYCLONE'
  | 'EARTHQUAKE'
  | 'LIGHTNING'
  | 'LANDSLIDE'
  | 'TSUNAMI'
  | 'WILDFIRE'
  | 'CHEMICAL'
  | 'COLLAPSE'
  | 'SOS';

export type MapSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type VehicleType = 'AMBULANCE' | 'FIRE' | 'POLICE' | 'RELIEF' | 'DRONE';

export type VehicleStatus = 'AVAILABLE' | 'DISPATCHED' | 'RESPONDING' | 'ON_SCENE' | 'RESOLVED';

export interface LiveIncident {
  id: string; // e.g. "RQ-1042"
  type: MapHazardType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
  severity: MapSeverity;
  status: 'REPORTED' | 'VERIFIED' | 'RESPONDING' | 'ON_SCENE' | 'RESOLVED';
  peopleAffected: number;
  privateMediaCount: number;
  privateMediaSampleUrls: string[];
  assignedVehicleCodes: string[];
  reportedAt: string;
  aiAssessment: string;
}

export interface LiveVehicle {
  id: string;
  vehicle_code: string; // e.g. "F-034"
  vehicle_type: VehicleType;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  heading: number; // 0 - 360 degrees
  speed: number; // km/h
  last_updated: string;
  assigned_incident_id: string | null;
  baseStation: string;
  city: string;
  distanceToIncidentKm?: number;
  etaString?: string;
  trackHistory?: [number, number][]; // [lng, lat]
}

export interface CityPreset {
  id: string;
  name: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  state: string;
}

export const CITIES_DATA: CityPreset[] = [
  { id: 'hyderabad', name: 'Hyderabad', center: [78.3850, 17.4450], zoom: 12.5, state: 'South Region' },
  { id: 'bengaluru', name: 'Bengaluru', center: [77.5946, 12.9716], zoom: 12.2, state: 'Karnataka' },
  { id: 'delhi', name: 'Delhi NCR', center: [77.2090, 28.6139], zoom: 12.0, state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', center: [72.8777, 19.0760], zoom: 12.0, state: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', center: [80.2707, 13.0827], zoom: 12.0, state: 'Tamil Nadu' },
  { id: 'kolkata', name: 'Kolkata', center: [88.3639, 22.5726], zoom: 12.0, state: 'West Bengal' },
  { id: 'pune', name: 'Pune', center: [73.8567, 18.5204], zoom: 12.0, state: 'Maharashtra' }
];

export const INITIAL_INCIDENTS: LiveIncident[] = [
  {
    id: 'RQ-1042',
    type: 'FIRE',
    title: 'Commercial Complex Structural Fire',
    description: 'Blaze originated on 4th floor server room. Thick acrid smoke spreading through elevator shafts. 18 occupants evacuated to terrace.',
    latitude: 17.4435,
    longitude: 78.3772,
    city: 'Hyderabad',
    address: 'Hitec City Main Road, Cyber Towers Junction, Hyderabad',
    severity: 'CRITICAL',
    status: 'RESPONDING',
    peopleAffected: 18,
    privateMediaCount: 5,
    privateMediaSampleUrls: [
      'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80'
    ],
    assignedVehicleCodes: ['F-034', 'A-102'],
    reportedAt: '10 mins ago',
    aiAssessment: 'CRITICAL HAZARD: Thermal expansion detected. Potential flashover within 8 minutes. High priority fire foam suppression and terrace evacuation recommended.'
  },
  {
    id: 'RQ-1043',
    type: 'ACCIDENT',
    title: 'Multi-Vehicle Highway Collision',
    description: '3 passenger cars and a light commercial truck collided near flyover ramp. 4 casualties with severe entrapment.',
    latitude: 17.4320,
    longitude: 78.3610,
    city: 'Hyderabad',
    address: 'Outer Ring Road (ORR) Exit 19, Gachibowli, Hyderabad',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 6,
    privateMediaCount: 3,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['P-401', 'A-101'],
    reportedAt: '14 mins ago',
    aiAssessment: 'HYDRAULIC SPREADER REQUIRED: Fuel leakage detected on asphalt. Traffic diversion initiated.'
  },
  {
    id: 'RQ-1044',
    type: 'FLOOD',
    title: 'Urban Flash Flood & Road Inundation',
    description: 'Cloudburst caused Musi tributary overflow. 3.5 feet water stagnation trapping 12 vehicles.',
    latitude: 17.3688,
    longitude: 78.4735,
    city: 'Hyderabad',
    address: 'Moosarambagh Cause-Way, Old City, Hyderabad',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 24,
    privateMediaCount: 4,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['R-201'],
    reportedAt: '25 mins ago',
    aiAssessment: 'RAPID INUNDATION: Stagnation level rising at 4 cm/hour. High-clearance inflatable rescue boats dispatched.'
  },
  {
    id: 'RQ-1045',
    type: 'CHEMICAL',
    title: 'Industrial Ammonia Vapor Leak',
    description: 'Flange rupture in cold storage plant releasing toxic ammonia gas. Residents experiencing respiratory distress.',
    latitude: 17.5120,
    longitude: 78.4350,
    city: 'Hyderabad',
    address: 'Balanagar Industrial Area, Phase II, Hyderabad',
    severity: 'CRITICAL',
    status: 'REPORTED',
    peopleAffected: 45,
    privateMediaCount: 2,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['F-021'],
    reportedAt: '8 mins ago',
    aiAssessment: 'TOXIC PLUME THREAT: Plume moving Northeast at 12 km/h. Evacuation of downwind sectors within 800m initiated.'
  },
  {
    id: 'RQ-1046',
    type: 'COLLAPSE',
    title: 'Old Residential Building Wall Collapse',
    description: 'Weakened foundation gave way following continuous monsoon rain. 2 people reported trapped under masonry debris.',
    latitude: 17.3820,
    longitude: 78.4810,
    city: 'Hyderabad',
    address: 'Chaderghat Road, Hyderabad',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 7,
    privateMediaCount: 2,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['F-056'],
    reportedAt: '35 mins ago',
    aiAssessment: 'CANINE SEARCH & ACOUSTIC LISTENING: Unstable adjoining pillar requires shoring before manual excavation.'
  },
  {
    id: 'RQ-1047',
    type: 'SOS',
    title: 'Senior Citizen Medical SOS',
    description: 'Acute respiratory cardiac distress reported via citizen mobile SOS button. Power outage in apartment elevator.',
    latitude: 17.4150,
    longitude: 78.4280,
    city: 'Hyderabad',
    address: 'Banjara Hills Road No. 12, Hyderabad',
    severity: 'CRITICAL',
    status: 'RESPONDING',
    peopleAffected: 1,
    privateMediaCount: 1,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['A-102'],
    reportedAt: '4 mins ago',
    aiAssessment: 'CRITICAL CARDIAC: Advanced Life Support (ALS) paramedic dispatched. Stair stretcher team requested.'
  },
  {
    id: 'RQ-1048',
    type: 'LIGHTNING',
    title: 'Lightning Strike on Electrical Substation',
    description: 'Direct bolt caused transformer explosion and localized spot fire. Surrounding colony without power.',
    latitude: 17.4780,
    longitude: 78.3120,
    city: 'Hyderabad',
    address: 'Miyapur Substation, Hyderabad',
    severity: 'MODERATE',
    status: 'VERIFIED',
    peopleAffected: 120,
    privateMediaCount: 1,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['P-402'],
    reportedAt: '42 mins ago',
    aiAssessment: 'GRID ISOLATION COMPLETED: Fire tenders damping residual transformer oil blaze.'
  },
  {
    id: 'RQ-1049',
    type: 'WILDFIRE',
    title: 'Dry Scrub & Forest Fringe Fire',
    description: 'High winds fanning brush fire near university campus perimeter.',
    latitude: 17.3450,
    longitude: 78.3240,
    city: 'Hyderabad',
    address: 'Chilkur Reserve Forest Fringe, Hyderabad',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 0,
    privateMediaCount: 3,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: ['F-021', 'D-01'],
    reportedAt: '50 mins ago',
    aiAssessment: 'AERIAL DRONE MAPPING: 1.4 hectare perimeter burn line. Foam retardant containment barrier created.'
  },
  // Other Cities
  {
    id: 'RQ-2001',
    type: 'FLOOD',
    title: 'Bellandur Lake Overflow & Road Stagnation',
    description: 'Heavy precipitation caused lake breach, inundating outer ring road.',
    latitude: 12.9340,
    longitude: 77.6740,
    city: 'Bengaluru',
    address: 'Outer Ring Road, Bellandur, Bengaluru',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 80,
    privateMediaCount: 4,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '1 hour ago',
    aiAssessment: 'PUMPING SQUADS DEPLOYED: Major arterial traffic diverted to Sarjapur road.'
  },
  {
    id: 'RQ-3001',
    type: 'ACCIDENT',
    title: 'Tunnel Pile-up on Eastern Freeway',
    description: 'Collision involving delivery van and city transit bus inside tunnel.',
    latitude: 19.0120,
    longitude: 72.8550,
    city: 'Mumbai',
    address: 'Eastern Freeway Northbound, Mumbai',
    severity: 'CRITICAL',
    status: 'RESPONDING',
    peopleAffected: 14,
    privateMediaCount: 5,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '12 mins ago',
    aiAssessment: 'TUNNEL VENTILATION ENGAGED: Fire exhaust systems operating at full capacity.'
  },
  {
    id: 'RQ-4001',
    type: 'FIRE',
    title: 'Warehouse Fire in Industrial Estate',
    description: 'Cardboard and solvent packaging unit catching fire. Dense black smoke.',
    latitude: 28.6720,
    longitude: 77.1210,
    city: 'Delhi',
    address: 'Mayapuri Industrial Area Phase 1, New Delhi',
    severity: 'CRITICAL',
    status: 'RESPONDING',
    peopleAffected: 10,
    privateMediaCount: 6,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '18 mins ago',
    aiAssessment: 'HAZMAT PROTOCOL: Category B foam extinguishers required for solvent drums.'
  },
  {
    id: 'RQ-5001',
    type: 'CYCLONE',
    title: 'Coastal Storm Surge & Wind Gusts',
    description: 'Squall line pushing 70 km/h wind gusts, downing trees along Marina stretch.',
    latitude: 13.0510,
    longitude: 80.2820,
    city: 'Chennai',
    address: 'Marina Beach Road, Mylapore, Chennai',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 35,
    privateMediaCount: 2,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '30 mins ago',
    aiAssessment: 'COASTAL EVACUATION: Fishermen shelters alerted. Clearing fallen electrical lines.'
  },
  {
    id: 'RQ-6001',
    type: 'LANDSLIDE',
    title: 'Western Ghats Road Cut Debris Fall',
    description: 'Continuous downpour loosened rocks onto highway corridor.',
    latitude: 18.7520,
    longitude: 73.4110,
    city: 'Pune',
    address: 'Pune-Mumbai Expressway Ghat Section, Khandala',
    severity: 'HIGH',
    status: 'VERIFIED',
    peopleAffected: 0,
    privateMediaCount: 3,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '45 mins ago',
    aiAssessment: 'HEAVY EARTHMOVERS ACTIVE: Rock barrier installation underway.'
  },
  {
    id: 'RQ-7001',
    type: 'EARTHQUAKE',
    title: 'Tremor Felt - Masonry Crack Inspection',
    description: 'Magnitude 4.2 seismic shock detected. Structural integrity survey ongoing.',
    latitude: 22.5640,
    longitude: 88.3510,
    city: 'Kolkata',
    address: 'BBD Bagh Heritage District, Kolkata',
    severity: 'MODERATE',
    status: 'VERIFIED',
    peopleAffected: 12,
    privateMediaCount: 1,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '1 hour ago',
    aiAssessment: 'SEISMIC DATA REVIEWED: No secondary collapse risk detected on main structures.'
  },
  {
    id: 'RQ-8001',
    type: 'TSUNAMI',
    title: 'Simulated Ocean Surge Monitoring Node',
    description: 'Automated deep-sea pressure gauge drill test. Coastal sirens tested.',
    latitude: 13.1120,
    longitude: 80.3120,
    city: 'Chennai',
    address: 'Ennore Port Sensor Array, Chennai',
    severity: 'LOW',
    status: 'RESOLVED',
    peopleAffected: 0,
    privateMediaCount: 0,
    privateMediaSampleUrls: [],
    assignedVehicleCodes: [],
    reportedAt: '2 hours ago',
    aiAssessment: 'DEMO TELEMETRY DRILL: All sirens and coastal broadcast towers verified operational.'
  }
];

export const INITIAL_VEHICLES: LiveVehicle[] = [
  // ================= HYDERABAD CRISIS RESPONSE FLEET =================
  // --- FIRE & RESCUE ---
  {
    id: 'veh-1',
    vehicle_code: 'F-034',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 17.4360,
    longitude: 78.3690,
    heading: 48,
    speed: 42,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1042',
    baseStation: 'Madhapur Fire Station No. 4',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.8,
    etaString: '04 min',
    trackHistory: [
      [78.3650, 17.4320],
      [78.3670, 17.4340],
      [78.3690, 17.4360]
    ]
  },
  {
    id: 'veh-f-54',
    vehicle_code: 'F-054',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 17.4490,
    longitude: 78.3840,
    heading: 215,
    speed: 36,
    last_updated: '3s ago',
    assigned_incident_id: 'RQ-1042',
    baseStation: 'Cyberabad Central 54M Skylift Bay',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.2,
    etaString: '03 min'
  },
  {
    id: 'veh-3',
    vehicle_code: 'F-021',
    vehicle_type: 'FIRE',
    status: 'AVAILABLE',
    latitude: 17.4650,
    longitude: 78.3580,
    heading: 180,
    speed: 0,
    last_updated: '12s ago',
    assigned_incident_id: null,
    baseStation: 'Kondapur Fire Depot',
    city: 'Hyderabad',
    distanceToIncidentKm: 3.5
  },
  {
    id: 'veh-4',
    vehicle_code: 'F-056',
    vehicle_type: 'FIRE',
    status: 'AVAILABLE',
    latitude: 17.4220,
    longitude: 78.4050,
    heading: 90,
    speed: 0,
    last_updated: '20s ago',
    assigned_incident_id: null,
    baseStation: 'Jubilee Hills Disaster Unit',
    city: 'Hyderabad',
    distanceToIncidentKm: 4.8
  },
  {
    id: 'veh-f-09',
    vehicle_code: 'F-009',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 17.4420,
    longitude: 78.4980,
    heading: 175,
    speed: 45,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1046',
    baseStation: 'Secunderabad Fire Division',
    city: 'Hyderabad',
    distanceToIncidentKm: 2.1,
    etaString: '05 min'
  },
  {
    id: 'veh-f-12',
    vehicle_code: 'F-012',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 17.4680,
    longitude: 78.4480,
    heading: 195,
    speed: 38,
    last_updated: '4s ago',
    assigned_incident_id: 'RQ-1045',
    baseStation: 'Sanathnagar Chemical Safety Post',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.4,
    etaString: '03 min'
  },
  {
    id: 'veh-f-15',
    vehicle_code: 'F-015',
    vehicle_type: 'FIRE',
    status: 'AVAILABLE',
    latitude: 17.4980,
    longitude: 78.3950,
    heading: 130,
    speed: 0,
    last_updated: '18s ago',
    assigned_incident_id: null,
    baseStation: 'Kukatpally Rapid Response Post',
    city: 'Hyderabad'
  },
  {
    id: 'veh-f-28',
    vehicle_code: 'F-028',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 17.3380,
    longitude: 78.3280,
    heading: 320,
    speed: 32,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1049',
    baseStation: 'Chilkur Forest Outpost',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.1,
    etaString: '03 min'
  },
  {
    id: 'veh-f-42',
    vehicle_code: 'F-042',
    vehicle_type: 'FIRE',
    status: 'AVAILABLE',
    latitude: 17.4120,
    longitude: 78.4420,
    heading: 85,
    speed: 0,
    last_updated: '25s ago',
    assigned_incident_id: null,
    baseStation: 'Banjara Hills Fire Command',
    city: 'Hyderabad'
  },
  {
    id: 'veh-f-77',
    vehicle_code: 'F-077',
    vehicle_type: 'FIRE',
    status: 'AVAILABLE',
    latitude: 17.3620,
    longitude: 78.4720,
    heading: 0,
    speed: 0,
    last_updated: '15s ago',
    assigned_incident_id: null,
    baseStation: 'Charminar Heavy Tender Hub',
    city: 'Hyderabad'
  },

  // --- AMBULANCES & MOBILE ICU UNITS ---
  {
    id: 'veh-2',
    vehicle_code: 'A-102',
    vehicle_type: 'AMBULANCE',
    status: 'RESPONDING',
    latitude: 17.4410,
    longitude: 78.3890,
    heading: 260,
    speed: 46,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1042',
    baseStation: 'Apollo Emergency Trauma Hub',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.2,
    etaString: '03 min',
    trackHistory: [
      [78.3950, 17.4400],
      [78.3920, 17.4405],
      [78.3890, 17.4410]
    ]
  },
  {
    id: 'veh-5',
    vehicle_code: 'A-101',
    vehicle_type: 'AMBULANCE',
    status: 'RESPONDING',
    latitude: 17.4300,
    longitude: 78.3650,
    heading: 220,
    speed: 39,
    last_updated: '3s ago',
    assigned_incident_id: 'RQ-1043',
    baseStation: 'Care Hospital Gachibowli',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.7,
    etaString: '02 min'
  },
  {
    id: 'veh-a-108',
    vehicle_code: 'A-108',
    vehicle_type: 'AMBULANCE',
    status: 'RESPONDING',
    latitude: 17.4190,
    longitude: 78.4520,
    heading: 10,
    speed: 48,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1047',
    baseStation: 'NIMS Emergency Medical Wing',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.5,
    etaString: '01 min'
  },
  {
    id: 'veh-a-112',
    vehicle_code: 'A-112',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 17.3710,
    longitude: 78.4800,
    heading: 45,
    speed: 0,
    last_updated: '10s ago',
    assigned_incident_id: null,
    baseStation: 'Osmania General Trauma Wing',
    city: 'Hyderabad'
  },
  {
    id: 'veh-a-115',
    vehicle_code: 'A-115',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 17.4280,
    longitude: 78.4580,
    heading: 180,
    speed: 0,
    last_updated: '14s ago',
    assigned_incident_id: null,
    baseStation: 'Yashoda Critical Care Somajiguda',
    city: 'Hyderabad'
  },
  {
    id: 'veh-a-120',
    vehicle_code: 'A-120',
    vehicle_type: 'AMBULANCE',
    status: 'RESPONDING',
    latitude: 17.4580,
    longitude: 78.4590,
    heading: 265,
    speed: 40,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1045',
    baseStation: 'Gandhi Mass Casualty Evacuation Wing',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.6,
    etaString: '04 min'
  },
  {
    id: 'veh-a-125',
    vehicle_code: 'A-125',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 17.4150,
    longitude: 78.3480,
    heading: 90,
    speed: 0,
    last_updated: '22s ago',
    assigned_incident_id: null,
    baseStation: 'Continental Trauma Hub Financial District',
    city: 'Hyderabad'
  },
  {
    id: 'veh-a-130',
    vehicle_code: 'A-130',
    vehicle_type: 'AMBULANCE',
    status: 'ON_SCENE',
    latitude: 17.4440,
    longitude: 78.3760,
    heading: 0,
    speed: 0,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1042',
    baseStation: 'MaxCure Emergency Madhapur',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.1,
    etaString: 'ON SITE'
  },
  {
    id: 'veh-a-135',
    vehicle_code: 'A-135',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 17.4450,
    longitude: 78.4720,
    heading: 340,
    speed: 0,
    last_updated: '16s ago',
    assigned_incident_id: null,
    baseStation: 'KIMS Intensive Care Unit Begumpet',
    city: 'Hyderabad'
  },
  {
    id: 'veh-a-140',
    vehicle_code: 'A-140',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 17.4920,
    longitude: 78.3380,
    heading: 120,
    speed: 0,
    last_updated: '30s ago',
    assigned_incident_id: null,
    baseStation: 'Miyapur Emergency Outpost',
    city: 'Hyderabad'
  },

  // --- POLICE & TACTICAL INTERCEPTORS ---
  {
    id: 'veh-6',
    vehicle_code: 'P-401',
    vehicle_type: 'POLICE',
    status: 'ON_SCENE',
    latitude: 17.4320,
    longitude: 78.3610,
    heading: 15,
    speed: 0,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1043',
    baseStation: 'Cyberabad Police Commissionerate',
    city: 'Hyderabad'
  },
  {
    id: 'veh-7',
    vehicle_code: 'P-402',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 17.4650,
    longitude: 78.3410,
    heading: 310,
    speed: 25,
    last_updated: '5s ago',
    assigned_incident_id: null,
    baseStation: 'Miyapur Patrol Division',
    city: 'Hyderabad'
  },
  {
    id: 'veh-8',
    vehicle_code: 'P-405',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 17.4010,
    longitude: 78.4410,
    heading: 120,
    speed: 20,
    last_updated: '15s ago',
    assigned_incident_id: null,
    baseStation: 'Banjara Traffic Sector',
    city: 'Hyderabad'
  },
  {
    id: 'veh-p-408',
    vehicle_code: 'P-408',
    vehicle_type: 'POLICE',
    status: 'RESPONDING',
    latitude: 17.4610,
    longitude: 78.4490,
    heading: 160,
    speed: 44,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1045',
    baseStation: 'QRT Police Command Reserve',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.8,
    etaString: '02 min'
  },
  {
    id: 'veh-p-412',
    vehicle_code: 'P-412',
    vehicle_type: 'POLICE',
    status: 'RESPONDING',
    latitude: 17.4200,
    longitude: 78.4530,
    heading: 25,
    speed: 52,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1047',
    baseStation: 'Begumpet Green Corridor Flying Squad',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.4,
    etaString: '01 min'
  },
  {
    id: 'veh-p-415',
    vehicle_code: 'P-415',
    vehicle_type: 'POLICE',
    status: 'RESPONDING',
    latitude: 17.3710,
    longitude: 78.4710,
    heading: 110,
    speed: 34,
    last_updated: '3s ago',
    assigned_incident_id: 'RQ-1044',
    baseStation: 'Moosarambagh Traffic Post',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.6,
    etaString: '02 min'
  },
  {
    id: 'veh-p-420',
    vehicle_code: 'P-420',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 17.3650,
    longitude: 78.4750,
    heading: 270,
    speed: 15,
    last_updated: '8s ago',
    assigned_incident_id: null,
    baseStation: 'Charminar Sector Command',
    city: 'Hyderabad'
  },
  {
    id: 'veh-p-425',
    vehicle_code: 'P-425',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 17.4380,
    longitude: 78.3520,
    heading: 80,
    speed: 0,
    last_updated: '18s ago',
    assigned_incident_id: null,
    baseStation: 'Gachibowli Stadium Mobile Post',
    city: 'Hyderabad'
  },

  // --- SDRF & NDRF RELIEF, AMBI-BOATS & RESCUE ---
  {
    id: 'veh-9',
    vehicle_code: 'R-201',
    vehicle_type: 'RELIEF',
    status: 'RESPONDING',
    latitude: 17.3750,
    longitude: 78.4680,
    heading: 140,
    speed: 30,
    last_updated: '3s ago',
    assigned_incident_id: 'RQ-1044',
    baseStation: 'SDRF Central Store Depot (Inflatable Rescue Boat)',
    city: 'Hyderabad',
    distanceToIncidentKm: 1.1,
    etaString: '03 min'
  },
  {
    id: 'veh-10',
    vehicle_code: 'R-202',
    vehicle_type: 'RELIEF',
    status: 'AVAILABLE',
    latitude: 17.3910,
    longitude: 78.4320,
    heading: 0,
    speed: 0,
    last_updated: '30s ago',
    assigned_incident_id: null,
    baseStation: 'Red Cross Relief Depot',
    city: 'Hyderabad'
  },
  {
    id: 'veh-r-205',
    vehicle_code: 'R-205',
    vehicle_type: 'RELIEF',
    status: 'RESPONDING',
    latitude: 17.3880,
    longitude: 78.4840,
    heading: 165,
    speed: 35,
    last_updated: '2s ago',
    assigned_incident_id: 'RQ-1046',
    baseStation: 'Heavy Structural Collapse Rig 01',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.9,
    etaString: '02 min'
  },
  {
    id: 'veh-r-208',
    vehicle_code: 'R-208',
    vehicle_type: 'RELIEF',
    status: 'RESPONDING',
    latitude: 17.3870,
    longitude: 78.4850,
    heading: 180,
    speed: 28,
    last_updated: '3s ago',
    assigned_incident_id: 'RQ-1046',
    baseStation: 'NDRF 10th Battalion Sensor Squad',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.7,
    etaString: '02 min'
  },
  {
    id: 'veh-r-212',
    vehicle_code: 'R-212',
    vehicle_type: 'RELIEF',
    status: 'RESPONDING',
    latitude: 17.3690,
    longitude: 78.4760,
    heading: 290,
    speed: 24,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1044',
    baseStation: 'Musi Inundation Rescue Boat Carrier',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.5,
    etaString: '01 min'
  },
  {
    id: 'veh-r-215',
    vehicle_code: 'R-215',
    vehicle_type: 'RELIEF',
    status: 'AVAILABLE',
    latitude: 17.3520,
    longitude: 78.5320,
    heading: 45,
    speed: 0,
    last_updated: '24s ago',
    assigned_incident_id: null,
    baseStation: 'LB Nagar Emergency Logistics Warehouse',
    city: 'Hyderabad'
  },

  // --- DISASTER RECON DRONES ---
  {
    id: 'veh-11',
    vehicle_code: 'D-01',
    vehicle_type: 'DRONE',
    status: 'ON_SCENE',
    latitude: 17.3460,
    longitude: 78.3250,
    heading: 95,
    speed: 52,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1049',
    baseStation: 'Forest Surveillance Base',
    city: 'Hyderabad'
  },
  {
    id: 'veh-12',
    vehicle_code: 'D-02',
    vehicle_type: 'DRONE',
    status: 'AVAILABLE',
    latitude: 17.4470,
    longitude: 78.3750,
    heading: 0,
    speed: 0,
    last_updated: '10s ago',
    assigned_incident_id: null,
    baseStation: 'Hitec City Rapid Drone Pad',
    city: 'Hyderabad'
  },
  {
    id: 'veh-d-03',
    vehicle_code: 'D-03',
    vehicle_type: 'DRONE',
    status: 'ON_SCENE',
    latitude: 17.4630,
    longitude: 78.4530,
    heading: 45,
    speed: 48,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1045',
    baseStation: 'Balanagar Plume Sniffer Drone Pad',
    city: 'Hyderabad'
  },
  {
    id: 'veh-d-04',
    vehicle_code: 'D-04',
    vehicle_type: 'DRONE',
    status: 'RESPONDING',
    latitude: 17.3700,
    longitude: 78.4720,
    heading: 135,
    speed: 56,
    last_updated: '1s ago',
    assigned_incident_id: 'RQ-1044',
    baseStation: 'Hussain Sagar Aerial Station',
    city: 'Hyderabad',
    distanceToIncidentKm: 0.4,
    etaString: '01 min'
  },

  // ================= BENGALURU FLEET =================
  {
    id: 'veh-blr-1',
    vehicle_code: 'BLR-F01',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 12.9750,
    longitude: 77.6020,
    heading: 90,
    speed: 45,
    last_updated: '5s ago',
    assigned_incident_id: null,
    baseStation: 'MG Road Central Fire Station',
    city: 'Bengaluru'
  },
  {
    id: 'veh-blr-2',
    vehicle_code: 'BLR-A01',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 12.9350,
    longitude: 77.6180,
    heading: 0,
    speed: 0,
    last_updated: '12s ago',
    assigned_incident_id: null,
    baseStation: 'Koramangala Emergency Hub',
    city: 'Bengaluru'
  },
  {
    id: 'veh-blr-3',
    vehicle_code: 'BLR-P01',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 12.9850,
    longitude: 77.5850,
    heading: 180,
    speed: 20,
    last_updated: '8s ago',
    assigned_incident_id: null,
    baseStation: 'Cubbon Park Police Flying Squad',
    city: 'Bengaluru'
  },
  {
    id: 'veh-blr-4',
    vehicle_code: 'BLR-R01',
    vehicle_type: 'RELIEF',
    status: 'AVAILABLE',
    latitude: 12.9200,
    longitude: 77.6850,
    heading: 0,
    speed: 0,
    last_updated: '15s ago',
    assigned_incident_id: null,
    baseStation: 'Bellandur Lake Flood Rescue Unit',
    city: 'Bengaluru'
  },
  {
    id: 'veh-blr-5',
    vehicle_code: 'BLR-D01',
    vehicle_type: 'DRONE',
    status: 'AVAILABLE',
    latitude: 12.9900,
    longitude: 77.6500,
    heading: 45,
    speed: 0,
    last_updated: '20s ago',
    assigned_incident_id: null,
    baseStation: 'Indiranagar Drone Base',
    city: 'Bengaluru'
  },

  // ================= DELHI NCR FLEET =================
  {
    id: 'veh-del-1',
    vehicle_code: 'DEL-F01',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 28.6150,
    longitude: 77.2150,
    heading: 75,
    speed: 50,
    last_updated: '3s ago',
    assigned_incident_id: null,
    baseStation: 'Connaught Place Central Fire HQ',
    city: 'Delhi NCR'
  },
  {
    id: 'veh-del-2',
    vehicle_code: 'DEL-A01',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 28.5670,
    longitude: 77.2100,
    heading: 0,
    speed: 0,
    last_updated: '8s ago',
    assigned_incident_id: null,
    baseStation: 'AIIMS Emergency Trauma Centre',
    city: 'Delhi NCR'
  },
  {
    id: 'veh-del-3',
    vehicle_code: 'DEL-P01',
    vehicle_type: 'POLICE',
    status: 'AVAILABLE',
    latitude: 28.6300,
    longitude: 77.2200,
    heading: 140,
    speed: 25,
    last_updated: '10s ago',
    assigned_incident_id: null,
    baseStation: 'Delhi Police PCR Flying Patrol',
    city: 'Delhi NCR'
  },
  {
    id: 'veh-del-4',
    vehicle_code: 'DEL-R01',
    vehicle_type: 'RELIEF',
    status: 'AVAILABLE',
    latitude: 28.6850,
    longitude: 77.2300,
    heading: 0,
    speed: 0,
    last_updated: '15s ago',
    assigned_incident_id: null,
    baseStation: 'Yamuna Flood Relief Command',
    city: 'Delhi NCR'
  },

  // ================= MUMBAI FLEET =================
  {
    id: 'veh-mum-1',
    vehicle_code: 'MUM-F01',
    vehicle_type: 'FIRE',
    status: 'RESPONDING',
    latitude: 19.0750,
    longitude: 72.8750,
    heading: 180,
    speed: 40,
    last_updated: '4s ago',
    assigned_incident_id: null,
    baseStation: 'Bandra Kurla Fire Command',
    city: 'Mumbai'
  },
  {
    id: 'veh-mum-2',
    vehicle_code: 'MUM-A01',
    vehicle_type: 'AMBULANCE',
    status: 'AVAILABLE',
    latitude: 19.0200,
    longitude: 72.8400,
    heading: 0,
    speed: 0,
    last_updated: '10s ago',
    assigned_incident_id: null,
    baseStation: 'KEM Hospital Emergency Unit',
    city: 'Mumbai'
  },
  {
    id: 'veh-mum-3',
    vehicle_code: 'MUM-R01',
    vehicle_type: 'RELIEF',
    status: 'AVAILABLE',
    latitude: 19.1000,
    longitude: 72.8250,
    heading: 0,
    speed: 0,
    last_updated: '18s ago',
    assigned_incident_id: null,
    baseStation: 'Coastal Disaster Rescue Squad',
    city: 'Mumbai'
  }
];

// GeoJSON Polygons for Demo Hazard Zones
// CRITICAL: Strictly labeled DEMO HAZARD ZONE for the SIH prototype
export const DEMO_HAZARD_ZONES: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'zone-flood-musi',
        name: 'DEMO HAZARD ZONE: Musi River Inundation Area',
        hazardType: 'FLOOD',
        color: '#0284c7',
        fillOpacity: 0.25,
        riskLevel: 'HIGH',
        description: 'Low-lying riparian zone susceptible to flash water stagnation exceeding 2 meters.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.4600, 17.3650],
            [78.4900, 17.3700],
            [78.5100, 17.3680],
            [78.5080, 17.3600],
            [78.4850, 17.3610],
            [78.4610, 17.3580],
            [78.4600, 17.3650]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'zone-chem-balanagar',
        name: 'DEMO HAZARD ZONE: Chemical Vapor Dispersion Perimeter',
        hazardType: 'CHEMICAL',
        color: '#eab308',
        fillOpacity: 0.2,
        riskLevel: 'CRITICAL',
        description: 'Atmospheric ammonia plume simulation downwind of Balanagar Phase II.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.4300, 17.5100],
            [78.4420, 17.5250],
            [78.4550, 17.5200],
            [78.4450, 17.5050],
            [78.4300, 17.5100]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'zone-fire-scrub',
        name: 'DEMO HAZARD ZONE: Forest Fringe Brushfire Containment Buffer',
        hazardType: 'WILDFIRE',
        color: '#ef4444',
        fillOpacity: 0.25,
        riskLevel: 'HIGH',
        description: 'Wildfire active ember line buffer area under drone thermographic surveillance.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.3200, 17.3400],
            [78.3320, 17.3520],
            [78.3380, 17.3440],
            [78.3260, 17.3350],
            [78.3200, 17.3400]
          ]
        ]
      }
    }
  ]
};
