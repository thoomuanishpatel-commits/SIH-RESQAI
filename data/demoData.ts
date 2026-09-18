import {
  Incident,
  IncidentCluster,
  EmergencyUnit,
  Hospital,
  ReliefShelter,
  RoadBlock,
  RiskZone,
  SimulationScenario,
  BuildingLandmark
} from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'RQ-204891',
    type: 'FIRE',
    title: 'Commercial Complex 4th Floor Fire',
    description: 'Electrical transformer explosion triggered heavy fire on 4th floor. Thick black smoke venting into stairwells.',
    severity: 'CRITICAL',
    status: 'DISPATCHED',
    location: {
      lat: 17.4483,
      lng: 78.3915, // Madhapur
      address: 'Near Cyber Towers, HITEC City Main Rd',
      zone: 'Madhapur'
    },
    reportedAt: '2026-09-16T17:18:00Z',
    reportedVia: 'SOS',
    estimatedCasualties: 8,
    trappedCount: 3,
    reporter: {
      name: 'V. Ramanathan',
      phone: '+91 98480 12345'
    },
    assignedUnits: ['UNIT-FIRE-04', 'UNIT-EMS-02'],
    aiAnalysis: {
      detectedHazards: ['Thermal flashover risk', 'Stairwell smoke inhalation', 'Structural glass breakage'],
      confidence: 0.94,
      recommendedDepartment: 'FIRE & RESCUE + HEAVY HAZMAT',
      reasoning: 'Multi-story commercial occupancy during work hours. High victim density requires hydraulic ladder and pressurized oxygen ventilation.',
      sentimentUrgency: 96
    },
    clusterId: 'CLUSTER-204',
    photoUrl: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=800&q=80',
    audioTranscript: 'Flames spreading fast on fourth floor near the north elevators! People are coughing and trapped on the terrace access!'
  },
  {
    id: 'RQ-204892',
    type: 'FLOOD',
    title: 'Musi Riverbank Inundation & Trapped Families',
    description: 'Surging river level overflowed retaining wall. Water level at 4.5 feet and rising fast.',
    severity: 'CRITICAL',
    status: 'RESPONDER_EN_ROUTE',
    location: {
      lat: 17.3712,
      lng: 78.4735, // Musi Corridor / Afzal Gunj
      address: 'Nayapul Musi Promenade, Afzal Gunj',
      zone: 'Charminar Division'
    },
    reportedAt: '2026-09-16T17:22:30Z',
    reportedVia: 'VOICE',
    estimatedCasualties: 14,
    trappedCount: 6,
    reporter: {
      name: 'Mohd. Imran',
      phone: '+91 94401 54321'
    },
    assignedUnits: ['UNIT-RESCUE-07', 'UNIT-BOAT-01'],
    aiAnalysis: {
      detectedHazards: ['Flash flood current', 'Submerged live electrical wires', 'Erosion of foundation'],
      confidence: 0.91,
      recommendedDepartment: 'DISASTER RESCUE SQUAD (SDRF)',
      reasoning: 'Water velocity exceeding 2.2 m/s. Inflatable power boats and life jacket drop required before dusk.',
      sentimentUrgency: 98
    },
    clusterId: 'CLUSTER-108',
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    audioTranscript: 'The river wall broke! Water is inside living rooms, elderly people are stranded on the rooftop!'
  },
  {
    id: 'RQ-204893',
    type: 'COLLAPSE',
    title: 'Older Masonry Building Partial Collapse',
    description: 'G+2 residential building front façade sheared off following heavy downpour. Staircase blocked.',
    severity: 'HIGH',
    status: 'DISPATCHED',
    location: {
      lat: 17.4399,
      lng: 78.4983, // Secunderabad
      address: 'M.G. Road near Clock Tower',
      zone: 'Secunderabad'
    },
    reportedAt: '2026-09-16T17:25:10Z',
    reportedVia: 'PHOTO',
    estimatedCasualties: 4,
    trappedCount: 2,
    reporter: {
      name: 'S. K. Verma',
      phone: '+91 99887 66554'
    },
    assignedUnits: ['UNIT-RESCUE-03'],
    aiAnalysis: {
      detectedHazards: ['Secondary collapse risk', 'Exposed rebar', 'Gas line rupture'],
      confidence: 0.88,
      recommendedDepartment: 'SDRF SEARCH & RESCUE',
      reasoning: 'Acoustic search detectors and shoring jacks needed to stabilize remaining wall before entering.',
      sentimentUrgency: 89
    },
    clusterId: 'CLUSTER-204'
  },
  {
    id: 'RQ-204894',
    type: 'ACCIDENT',
    title: 'Multi-Vehicle Collision on Flyover',
    description: 'Heavy truck overturned spilling cargo into 3 vehicles. Two lanes blocked.',
    severity: 'HIGH',
    status: 'ON_SCENE',
    location: {
      lat: 17.4401,
      lng: 78.3489, // Gachibowli
      address: 'Gachibowli Outer Ring Road Interchange',
      zone: 'Gachibowli'
    },
    reportedAt: '2026-09-16T17:10:00Z',
    reportedVia: 'SOS',
    estimatedCasualties: 5,
    trappedCount: 1,
    assignedUnits: ['UNIT-EMS-05', 'UNIT-POLICE-09'],
    aiAnalysis: {
      detectedHazards: ['Diesel spill', 'Crushed cabin pin', 'High speed secondary impact risk'],
      confidence: 0.95,
      recommendedDepartment: 'HIGHWAY PATROL & ADVANCED TRAUMA EMS',
      reasoning: 'Hydraulic cutters required for driver extrication. Traffic diversion required at Gachibowli flyover entrance.',
      sentimentUrgency: 85
    }
  },
  {
    id: 'RQ-204895',
    type: 'HAZARD',
    title: 'High Voltage Wire Fallen Across Waterlogged Road',
    description: 'Live 11kV line snapped and sparking into 6-inch standing water. Civilians held back.',
    severity: 'HIGH',
    status: 'REPORTED',
    location: {
      lat: 17.4947,
      lng: 78.3996, // Kukatpally
      address: 'KPHB Phase 3 Main Market Rd',
      zone: 'Kukatpally'
    },
    reportedAt: '2026-09-16T17:32:00Z',
    reportedVia: 'MANUAL',
    estimatedCasualties: 0,
    trappedCount: 0,
    assignedUnits: [],
    aiAnalysis: {
      detectedHazards: ['Electrocution in standing water', 'Pedestrian stampede risk'],
      confidence: 0.97,
      recommendedDepartment: 'DISCOM EMERGENCY GRID CREW + TRAFFIC POLICE',
      reasoning: 'Immediate remote grid tripping required at Kukatpally sub-station followed by barricading.',
      sentimentUrgency: 90
    }
  },
  {
    id: 'RQ-204896',
    type: 'MISSING_PERSON',
    title: 'Child Separated in Inundated Market Alley',
    description: '8-year-old boy in yellow raincoat separated during sudden stormwater surge evacuation.',
    severity: 'CRITICAL',
    status: 'DISPATCHED',
    location: {
      lat: 17.3916,
      lng: 78.4398, // Mehdipatnam
      address: 'Rethi Bowli Bus Junction',
      zone: 'Mehdipatnam'
    },
    reportedAt: '2026-09-16T17:35:00Z',
    reportedVia: 'SOS',
    estimatedCasualties: 1,
    assignedUnits: ['UNIT-POLICE-04'],
    aiAnalysis: {
      detectedHazards: ['Open manhole suction', 'Hypothermia / shock', 'Dense pedestrian chaos'],
      confidence: 0.92,
      recommendedDepartment: 'CIVIL POLICE + MUNICIPAL DRAINAGE TEAM',
      reasoning: 'Open stormwater drain nearby poses urgent life safety hazard. Sector search prioritized.',
      sentimentUrgency: 99
    }
  }
];

export const INITIAL_CLUSTERS: IncidentCluster[] = [
  {
    id: 'CLUSTER-108',
    name: 'Musi Basin Storm Surge Alpha',
    rootIncidentType: 'FLOOD',
    center: {
      lat: 17.3712,
      lng: 78.4735,
      address: 'Nayapul Musi Corridor',
      zone: 'Old City'
    },
    radiusKm: 2.8,
    incidentIds: ['RQ-204892', 'RQ-204896'],
    reportCount: 14,
    affectedPopulationEstimate: 1450,
    status: 'ESCALATING',
    detectedAt: '2026-09-16T17:20:00Z',
    trend: 'UP',
    threatSummary: 'Musi river retaining wall breaches causing multi-neighborhood low-lying inundation across Nayapul and Chaderghat.'
  },
  {
    id: 'CLUSTER-204',
    name: 'HITEC & West Zone Structural & Grid Hazard',
    rootIncidentType: 'FIRE',
    center: {
      lat: 17.4483,
      lng: 78.3915,
      address: 'HITEC City Core',
      zone: 'Madhapur'
    },
    radiusKm: 3.2,
    incidentIds: ['RQ-204891', 'RQ-204893', 'RQ-204894'],
    reportCount: 19,
    affectedPopulationEstimate: 3200,
    status: 'PEAK',
    detectedAt: '2026-09-16T17:15:00Z',
    trend: 'STABLE',
    threatSummary: 'Power surge cascade impacting sub-stations, high-rise alarms triggered, and arterial flyover traffic gridlock.'
  }
];

export const INITIAL_UNITS: EmergencyUnit[] = [
  // --- AMBULANCES (EMS) ---
  {
    id: 'UNIT-EMS-02',
    callsign: 'Apollo ALS Mobile ICU 2',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_ALS',
    modelName: 'Mercedes-Benz Sprinter 416 CDI Mobile ICU',
    plateNumber: 'TS 09 Z 1082',
    department: '108 GVK EMRI Advanced Critical Care',
    status: 'EN_ROUTE',
    location: {
      lat: 17.4450,
      lng: 78.3750,
      address: 'En route via Inorbit Mall bypass',
      zone: 'Madhapur'
    },
    assignedIncidentId: 'RQ-204891',
    etaMinutes: 4.2,
    distanceKm: 2.1,
    crewCount: 3,
    equipment: ['Hamilton T1 Transport Ventilator', 'Zoll X-Series Defibrillator', 'Burn Trauma Kit', 'Syringe Infusion Pumps'],
    isICUCapable: true,
    heading: 90,
    speedKmh: 58,
    fuelPercent: 88,
    oxygenLevelPercent: 94,
    driverName: 'Paramedic K. Venkat'
  },
  {
    id: 'UNIT-EMS-05',
    callsign: 'Care Trauma Mobile 5',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_ALS',
    modelName: 'Force Traveller T1 Advanced Trauma Life Support',
    plateNumber: 'TS 09 Z 1085',
    department: '108 Advanced Emergency Medical Response',
    status: 'ON_SCENE',
    location: {
      lat: 17.4401,
      lng: 78.3489,
      address: 'Gachibowli Flyover Interchange',
      zone: 'Gachibowli'
    },
    assignedIncidentId: 'RQ-204894',
    etaMinutes: 0,
    distanceKm: 0,
    crewCount: 4,
    equipment: ['Lucas 3 Mechanical Chest Compression', 'Hydraulic Extrication Spreader', 'Spine Immobilizer', 'Pediatric Pack'],
    isICUCapable: true,
    heading: 210,
    speedKmh: 0,
    fuelPercent: 74,
    oxygenLevelPercent: 82,
    driverName: 'Medic R. Sharma'
  },
  {
    id: 'UNIT-EMS-08',
    callsign: 'KIMS Standby Medic 8',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_BLS',
    modelName: 'Tata Winger Emergency Medical Transport',
    plateNumber: 'TS 09 Z 1088',
    department: '108 Emergency State Network',
    status: 'AVAILABLE',
    location: {
      lat: 17.4430,
      lng: 78.4680,
      address: 'Begumpet Standby Post',
      zone: 'Begumpet'
    },
    crewCount: 3,
    equipment: ['AED Automated Defibrillator', 'Oxygen Tank 40L', 'Multi-Position Stretcher', 'Basic Splint Kit'],
    isICUCapable: true,
    heading: 0,
    speedKmh: 0,
    fuelPercent: 95,
    oxygenLevelPercent: 100,
    driverName: 'Paramedic M. Chary'
  },
  {
    id: 'UNIT-EMS-11',
    callsign: 'Somajiguda Pediatric ICU 11',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_ALS',
    modelName: 'Mercedes-Benz Sprinter Neonatal Intensive Care',
    plateNumber: 'TS 09 Z 1101',
    department: 'Yashoda Emergency Pediatric Transport',
    status: 'AVAILABLE',
    location: {
      lat: 17.4265,
      lng: 78.4589,
      address: 'Somajiguda Trauma Corridor',
      zone: 'Somajiguda'
    },
    crewCount: 3,
    equipment: ['Dräger Transport Incubator', 'Babylog VN500 Ventilator', 'Nitric Oxide Delivery System', 'Pediatric Monitor'],
    isICUCapable: true,
    heading: 140,
    speedKmh: 0,
    fuelPercent: 84,
    oxygenLevelPercent: 96,
    driverName: 'Nurse Specialist A. Roy'
  },
  {
    id: 'UNIT-EMS-14',
    callsign: 'GHMC Mass-Casualty Bus 14',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_BUS',
    modelName: 'Ashok Leyland 12-Stretcher Disaster Evacuation Bus',
    plateNumber: 'TS 09 Z 9914',
    department: 'Greater Hyderabad Disaster Management Wing',
    status: 'AVAILABLE',
    location: {
      lat: 17.4225,
      lng: 78.4526,
      address: 'NIMS Regional Trauma Reserve Depot',
      zone: 'Punjagutta'
    },
    crewCount: 8,
    equipment: ['12 Heavy-Duty Trauma Stretchers', 'Central O2 Pipeline Matrix', '12x Vital Signs Monitors', 'Mass Decon Rations'],
    isICUCapable: true,
    heading: 90,
    speedKmh: 0,
    fuelPercent: 91,
    oxygenLevelPercent: 98,
    driverName: 'Capt. V. Prabhakar'
  },
  {
    id: 'UNIT-EMS-19',
    callsign: 'Osmania Rapid Triage 19',
    type: 'EMS',
    vehicleCategory: 'AMBULANCE_BLS',
    modelName: 'Force Urbania Rapid Field Triage',
    plateNumber: 'TS 09 Z 1019',
    department: 'Osmania General Emergency Wing',
    status: 'EN_ROUTE',
    location: {
      lat: 17.3753,
      lng: 78.4740,
      address: 'Afzal Gunj approach, Old City',
      zone: 'Old City'
    },
    assignedIncidentId: 'RQ-204892',
    etaMinutes: 3.0,
    distanceKm: 1.1,
    crewCount: 3,
    equipment: ['Triage Matrix Kit', 'Foldable Spine Boards 6x', 'Pulse Oximeter Bank', 'Thermal Hypothermia Blankets'],
    isICUCapable: false,
    heading: 180,
    speedKmh: 46,
    fuelPercent: 68,
    oxygenLevelPercent: 85,
    driverName: 'Medic S. Farooq'
  },

  // --- FIRE TRUCKS & AERIAL TENDERS (FIRE) ---
  {
    id: 'UNIT-FIRE-04',
    callsign: 'Bravo-4 Bronto Skylift 54M',
    type: 'FIRE',
    vehicleCategory: 'FIRE_SKYLIFT',
    modelName: 'Volvo FM420 Bronto Skylift F54RLX (54m Aerial Platform)',
    plateNumber: 'TS 09 F 0054',
    department: 'Telangana State Disaster Response & Fire Services',
    status: 'EN_ROUTE',
    location: {
      lat: 17.4420,
      lng: 78.3880,
      address: 'HITEC City Main Arterial towards Cyber Towers',
      zone: 'Madhapur'
    },
    assignedIncidentId: 'RQ-204891',
    etaMinutes: 3.5,
    distanceKm: 1.4,
    crewCount: 6,
    equipment: ['54m Hydraulic Articulated Aerial Ladder', '4000 LPM Cage Water Cannon', 'Thermal Imaging Drone', 'Rescue Cage Winch'],
    isICUCapable: false,
    heading: 35,
    speedKmh: 42,
    fuelPercent: 80,
    waterTankLiters: 3200,
    driverName: 'Sub-Officer D. Sanjeev'
  },
  {
    id: 'UNIT-FIRE-01',
    callsign: 'Central Heavy Foam Tender 01',
    type: 'FIRE',
    vehicleCategory: 'FIRE_FOAM',
    modelName: 'Tata Prima 2828.K Heavy Foam & Water Cannon Engine',
    plateNumber: 'TS 09 F 0001',
    department: 'Hyderabad Central Fire Command',
    status: 'AVAILABLE',
    location: {
      lat: 17.4116,
      lng: 78.4716,
      address: 'Secretariat State Fire Post',
      zone: 'Central Command'
    },
    crewCount: 5,
    equipment: ['10,000L Water Tank', '1,500L AFFF Chemical Foam', 'Roof-Mounted 6000 LPM Turret', 'High-Pressure Fog Nozzles'],
    isICUCapable: false,
    heading: 270,
    speedKmh: 0,
    fuelPercent: 92,
    waterTankLiters: 10000,
    driverName: 'Station Officer N. Rao'
  },
  {
    id: 'UNIT-FIRE-09',
    callsign: 'Secunderabad Water Tender 09',
    type: 'FIRE',
    vehicleCategory: 'FIRE_ENGINE',
    modelName: 'Ashok Leyland Captain Multi-Purpose Fire Tender',
    plateNumber: 'TS 09 F 0009',
    department: 'Secunderabad Fire Division',
    status: 'EN_ROUTE',
    location: {
      lat: 17.4399,
      lng: 78.4983,
      address: 'M.G. Road Clock Tower Corridor',
      zone: 'Secunderabad'
    },
    assignedIncidentId: 'RQ-204893',
    etaMinutes: 5.2,
    distanceKm: 1.9,
    crewCount: 6,
    equipment: ['5,000L Water Tank', 'Two-Stage Centrifugal Fire Pump', 'SCBA Breathing Apparatus 8x', 'High-Output Positive Pressure Ventilator'],
    isICUCapable: false,
    heading: 45,
    speedKmh: 50,
    fuelPercent: 85,
    waterTankLiters: 5000,
    driverName: 'Leading Fireman T. Srinivas'
  },
  {
    id: 'UNIT-FIRE-12',
    callsign: 'HITEC Chemical Foam Master 12',
    type: 'FIRE',
    vehicleCategory: 'FIRE_FOAM',
    modelName: 'Scania P410 High-Expansion Chemical Foam Unit',
    plateNumber: 'TS 09 F 0012',
    department: 'Cyberabad Industrial Fire Wing',
    status: 'AVAILABLE',
    location: {
      lat: 17.4483,
      lng: 78.3915,
      address: 'Cyber Gateway Standby Bay',
      zone: 'Madhapur'
    },
    crewCount: 4,
    equipment: ['High-Expansion Foam Generator', 'Class-D Chemical Powder Cannons', 'Acid-Resistant Suction Hoses', 'Thermal Gas Sensor'],
    isICUCapable: false,
    heading: 120,
    speedKmh: 0,
    fuelPercent: 76,
    waterTankLiters: 4500,
    driverName: 'Operator K. Anand'
  },
  {
    id: 'UNIT-FIRE-15',
    callsign: 'Kukatpally Rapid Mist 15',
    type: 'FIRE',
    vehicleCategory: 'FIRE_ENGINE',
    modelName: 'Isuzu D-Max 4x4 High-Pressure Ultra-Mist Unit',
    plateNumber: 'TS 09 F 0015',
    department: 'Kukatpally Rapid Response Post',
    status: 'AVAILABLE',
    location: {
      lat: 17.4947,
      lng: 78.3996,
      address: 'KPHB Phase 3 Depot',
      zone: 'Kukatpally'
    },
    crewCount: 3,
    equipment: ['300 Bar Water Mist Gun', '600L Water Tank', 'CAFS Compressed Air Foam System', 'Hydraulic Spreader'],
    isICUCapable: false,
    heading: 0,
    speedKmh: 0,
    fuelPercent: 88,
    waterTankLiters: 600,
    driverName: 'Driver-Operator B. Lingam'
  },

  // --- POLICE & TACTICAL INTERCEPTORS (POLICE) ---
  {
    id: 'UNIT-POLICE-09',
    callsign: 'Cyberabad Hawk-9 Patrol',
    type: 'POLICE',
    vehicleCategory: 'POLICE_INTERCEPTOR',
    modelName: 'Toyota Innova Crysta 2.8D High-Speed Highway Interceptor',
    plateNumber: 'TS 09 P 0009',
    department: 'Cyberabad Police Commissionerate',
    status: 'ON_SCENE',
    location: {
      lat: 17.4401,
      lng: 78.3489,
      address: 'Gachibowli Outer Ring Road Flyover Crest',
      zone: 'Gachibowli'
    },
    assignedIncidentId: 'RQ-204894',
    crewCount: 2,
    equipment: ['Dual-Strobe LED Emergency Bar', 'ANPR Speed Camera Radar', 'Traffic Perimeter Flares', 'Heavy-Duty Crowd Barrier Ribbon'],
    heading: 190,
    speedKmh: 0,
    fuelPercent: 70,
    driverName: 'Sub-Inspector G. Mahesh'
  },
  {
    id: 'UNIT-POLICE-04',
    callsign: 'South Eagle-4 Interceptor',
    type: 'POLICE',
    vehicleCategory: 'POLICE_PATROL',
    modelName: 'Mahindra Scorpio-N 4x4 Emergency Interceptor',
    plateNumber: 'TS 09 P 0004',
    department: 'Hyderabad South Zone Police',
    status: 'EN_ROUTE',
    location: {
      lat: 17.3950,
      lng: 78.4410,
      address: 'Mehdipatnam PVNR Expressway Approach',
      zone: 'Mehdipatnam'
    },
    assignedIncidentId: 'RQ-204896',
    etaMinutes: 2.5,
    distanceKm: 0.9,
    crewCount: 3,
    equipment: ['100W Megaphone PA', '1,000,000 Candlepower Night Searchlight', 'Tactical Trauma Kit', 'Real-Time Telemetry Radio'],
    heading: 220,
    speedKmh: 64,
    fuelPercent: 84,
    driverName: 'Constable M. Pasha'
  },
  {
    id: 'UNIT-POLICE-11',
    callsign: 'Traffic Green Corridor 11',
    type: 'POLICE',
    vehicleCategory: 'POLICE_INTERCEPTOR',
    modelName: 'Mahindra Bolero Neo Traffic Clearing Interceptor',
    plateNumber: 'TS 09 P 0011',
    department: 'Hyderabad Traffic Police Flying Squad',
    status: 'AVAILABLE',
    location: {
      lat: 17.4447,
      lng: 78.4664,
      address: 'Begumpet Flyover Hub',
      zone: 'Begumpet'
    },
    crewCount: 2,
    equipment: ['Traffic Signal Priority Transmitter', 'Automated Expandable Spikes', 'Road Hazard Caution Cones', 'Multi-Radio Patch Console'],
    heading: 90,
    speedKmh: 0,
    fuelPercent: 90,
    driverName: 'Traffic Officer P. Naidu'
  },
  {
    id: 'UNIT-POLICE-16',
    callsign: 'Old City Vajra Tactical 16',
    type: 'POLICE',
    vehicleCategory: 'POLICE_TACTICAL',
    modelName: 'Ashok Leyland Armored Riot & Emergency Carrier',
    plateNumber: 'TS 09 P 0016',
    department: 'City Armed Reserve & Quick Reaction Team',
    status: 'AVAILABLE',
    location: {
      lat: 17.3616,
      lng: 78.4747,
      address: 'Charminar Civic Protection Outpost',
      zone: 'Old City'
    },
    crewCount: 6,
    equipment: ['Run-Flat Ballistic Tires', 'High-Decibel Long Range Acoustic Device (LRAD)', 'Emergency Barricade Deployer', 'Tear Gas Filtration'],
    heading: 0,
    speedKmh: 0,
    fuelPercent: 95,
    driverName: 'Inspector A. R. Qureshi'
  },
  {
    id: 'UNIT-POLICE-20',
    callsign: 'North Cobra-20 Surveillance Van',
    type: 'POLICE',
    vehicleCategory: 'POLICE_TACTICAL',
    modelName: 'Force Traveller Mobile Drone & PTZ Camera Surveillance Mast',
    plateNumber: 'TS 09 P 0020',
    department: 'Hyderabad Police Cyber & Drone Command',
    status: 'AVAILABLE',
    location: {
      lat: 17.4334,
      lng: 78.5017,
      address: 'Secunderabad Central Station Square',
      zone: 'Secunderabad'
    },
    crewCount: 3,
    equipment: ['12m Pneumatic Mast with 360° 4K Thermal Camera', '2x Autel Alpha Rescue Search Drones', 'Starlink High-Bandwidth Uplink', 'Facial Rec AI Station'],
    heading: 310,
    speedKmh: 0,
    fuelPercent: 86,
    driverName: 'Tech Specialist K. Swamy'
  },

  // --- SDRF / NDRF & DISASTER RESCUE SQUADS (RESCUE) ---
  {
    id: 'UNIT-RESCUE-07',
    callsign: 'SDRF Rapid Zodiac Boat 7',
    type: 'RESCUE',
    vehicleCategory: 'RESCUE_BOAT',
    modelName: 'Zodiac Milpro Grand Raid 470 Inflatable Powerboat Carrier',
    plateNumber: 'TS 09 R 0007',
    department: 'State Disaster Response Force (SDRF Flood Cell)',
    status: 'EN_ROUTE',
    location: {
      lat: 17.3800,
      lng: 78.4700,
      address: 'Afzal Gunj bridge approach towards Musi riverbed',
      zone: 'Charminar'
    },
    assignedIncidentId: 'RQ-204892',
    etaMinutes: 5.0,
    distanceKm: 1.8,
    crewCount: 8,
    equipment: ['Inflatable Gemini Boat (40HP Yamaha Outboard)', '40x Life Jackets & Throw Bags', 'Underwater Sonar Pod', 'Power Winch & Pulley Kit'],
    isICUCapable: false,
    heading: 180,
    speedKmh: 36,
    fuelPercent: 82,
    driverName: 'SDRF Commander J. Varma'
  },
  {
    id: 'UNIT-RESCUE-03',
    callsign: 'GHMC Heavy Extrication Cell 3',
    type: 'RESCUE',
    vehicleCategory: 'RESCUE_AMPHIBIOUS',
    modelName: 'MAN TGM 18.290 Heavy Structural Collapse Rescue Truck',
    plateNumber: 'TS 09 R 0003',
    department: 'Greater Hyderabad Disaster Management Wing',
    status: 'EN_ROUTE',
    location: {
      lat: 17.4410,
      lng: 78.4900,
      address: 'Secunderabad Station Rd approaching M.G. Road',
      zone: 'Secunderabad'
    },
    assignedIncidentId: 'RQ-204893',
    etaMinutes: 6.0,
    distanceKm: 2.3,
    crewCount: 6,
    equipment: ['Holmatro Core Hydraulic Cutters', 'Concrete Diamond Chain Saws', 'Paratech Heavy Pneumatic Lifting Bags', 'Snake-Eye Fiber Camera'],
    heading: 75,
    speedKmh: 42,
    fuelPercent: 78,
    driverName: 'Rescue Specialist B. Mohan'
  },
  {
    id: 'UNIT-RESCUE-10',
    callsign: 'NDRF K9 Search Unit 10',
    type: 'RESCUE',
    vehicleCategory: 'RESCUE_AMPHIBIOUS',
    modelName: 'Tata Xenon 4x4 Heavy Disaster Canine Squad',
    plateNumber: 'TS 09 R 0010',
    department: '10th Battalion NDRF Vijayawada-Hyderabad Command',
    status: 'AVAILABLE',
    location: {
      lat: 17.3507,
      lng: 78.5522,
      address: 'LB Nagar Regional Disaster Outpost',
      zone: 'LB Nagar'
    },
    crewCount: 4,
    equipment: ['2x Belgian Malinois Search & Rescue Dogs', 'Seismic Listening Vibration Sensors', 'GPS Dog Tracking Harnesses', 'Rapid Shoring Jacks'],
    heading: 280,
    speedKmh: 0,
    fuelPercent: 91,
    driverName: 'Sub-Inspector R. K. Yadav'
  },
  {
    id: 'UNIT-RESCUE-18',
    callsign: 'SDRF Tatra Amphibian 18',
    type: 'RESCUE',
    vehicleCategory: 'RESCUE_AMPHIBIOUS',
    modelName: 'Tatra 8x8 All-Terrain High-Water Evacuation Carrier',
    plateNumber: 'TS 09 R 0018',
    department: 'State Disaster Response Force Heavy Unit',
    status: 'AVAILABLE',
    location: {
      lat: 17.3712,
      lng: 78.4735,
      address: 'Chaderghat Flood Mitigation Staging Bay',
      zone: 'Chaderghat'
    },
    crewCount: 6,
    equipment: ['1.5m Fording Depth Capabilities', '30-Person Evac Deck', '20-Ton Self-Recovery Winch', 'High-Intensity Marine Floodlights'],
    heading: 100,
    speedKmh: 0,
    fuelPercent: 88,
    driverName: 'Havildar S. N. Reddy'
  },

  // --- HAZMAT & MOBILE COMMAND POSTS (HAZMAT & COMMAND_POST) ---
  {
    id: 'UNIT-HAZMAT-01',
    callsign: 'State Hazmat Decon Rig 01',
    type: 'HAZMAT',
    vehicleCategory: 'HAZMAT_DECON',
    modelName: 'BharatBenz 1617 Toxic Plume Decontamination Vehicle',
    plateNumber: 'TS 09 H 0001',
    department: 'Telangana Industrial Safety & Hazmat Command',
    status: 'AVAILABLE',
    location: {
      lat: 17.4490,
      lng: 78.3890,
      address: 'Cyber Towers Underpass Staging Bay',
      zone: 'Madhapur'
    },
    crewCount: 5,
    equipment: ['Inflatable Multi-Person Decon Shower', 'Level-A Gas-Tight Biohazard Suits', 'Gas Chromatograph Spectrometer', 'Neutralizing Chemical Agents'],
    heading: 180,
    speedKmh: 0,
    fuelPercent: 88,
    driverName: 'Hazmat Lead Dr. M. Joshi'
  },
  {
    id: 'UNIT-CMD-01',
    callsign: 'Telangana Mobile EOC Bus 01',
    type: 'COMMAND_POST',
    vehicleCategory: 'MOBILE_EOC',
    modelName: 'Volvo 9600 Custom Mobile Emergency Operations Center',
    plateNumber: 'TS 09 C 0001',
    department: 'State Disaster Management Authority (SDMA)',
    status: 'AVAILABLE',
    location: {
      lat: 17.4116,
      lng: 78.4716,
      address: 'Central Secretariat Main Grounds',
      zone: 'Central Command'
    },
    crewCount: 8,
    equipment: ['Auto-Tracking KU-Band Satellite Uplink', '6-Screen Tactical Video Wall', 'Motorola TETRA Repeater', 'Autonomous Drone Launchpad'],
    heading: 0,
    speedKmh: 0,
    fuelPercent: 96,
    driverName: 'Joint Director S. K. Raman'
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-01',
    name: 'Osmania General Government Hospital',
    location: {
      lat: 17.3753,
      lng: 78.4740,
      address: 'Afzal Gunj, Musi River Road',
      zone: 'Old City'
    },
    totalBeds: 1100,
    availableBeds: 48,
    icuTotal: 85,
    icuAvailable: 4,
    ventilatorsTotal: 40,
    ventilatorsAvailable: 2,
    status: 'CRITICAL_ONLY',
    phone: '+91 40 2460 0121',
    traumaLevel: 'LEVEL_1'
  },
  {
    id: 'HOSP-02',
    name: 'NIMS (Nizam’s Institute of Medical Sciences)',
    location: {
      lat: 17.4225,
      lng: 78.4526,
      address: 'Punjagutta Main Rd',
      zone: 'Punjagutta'
    },
    totalBeds: 1400,
    availableBeds: 180,
    icuTotal: 120,
    icuAvailable: 19,
    ventilatorsTotal: 70,
    ventilatorsAvailable: 11,
    status: 'ACCEPTING',
    phone: '+91 40 2348 9000',
    traumaLevel: 'LEVEL_1'
  },
  {
    id: 'HOSP-03',
    name: 'Continental Hospitals Financial District',
    location: {
      lat: 17.4285,
      lng: 78.3412,
      address: 'Plot No. 3, IT & Financial Park, Nanakramguda',
      zone: 'Gachibowli'
    },
    totalBeds: 750,
    availableBeds: 92,
    icuTotal: 65,
    icuAvailable: 12,
    ventilatorsTotal: 35,
    ventilatorsAvailable: 8,
    status: 'ACCEPTING',
    phone: '+91 40 6700 0000',
    traumaLevel: 'LEVEL_1'
  },
  {
    id: 'HOSP-04',
    name: 'Gandhi Hospital Musheerabad',
    location: {
      lat: 17.4258,
      lng: 78.5034,
      address: 'Bhoiguda, Musheerabad',
      zone: 'Secunderabad'
    },
    totalBeds: 1200,
    availableBeds: 14,
    icuTotal: 90,
    icuAvailable: 1,
    ventilatorsTotal: 50,
    ventilatorsAvailable: 0,
    status: 'AT_CAPACITY',
    phone: '+91 40 2750 5566',
    traumaLevel: 'LEVEL_1'
  },
  {
    id: 'HOSP-05',
    name: 'Medicover Hospitals HITEC City',
    location: {
      lat: 17.4501,
      lng: 78.3802,
      address: 'Behind Cyber Towers, Madhapur',
      zone: 'Madhapur'
    },
    totalBeds: 450,
    availableBeds: 38,
    icuTotal: 40,
    icuAvailable: 7,
    ventilatorsTotal: 25,
    ventilatorsAvailable: 4,
    status: 'ACCEPTING',
    phone: '+91 40 6833 4455',
    traumaLevel: 'LEVEL_2'
  }
];

export const INITIAL_SHELTERS: ReliefShelter[] = [
  {
    id: 'SHELTER-01',
    name: 'Kotla Vijaya Bhaskara Reddy Indoor Stadium',
    location: {
      lat: 17.4320,
      lng: 78.4350,
      address: 'Yousufguda Main Rd',
      zone: 'Yousufguda'
    },
    capacity: 1200,
    occupancy: 420,
    foodSupplyPercent: 88,
    waterSupplyPercent: 92,
    medicalFacilityAvailable: true,
    isOpen: true,
    contactNumber: '+91 40 2374 1122',
    safeRouteAccessible: true
  },
  {
    id: 'SHELTER-02',
    name: 'Chaderghat Government Boys High School Ground',
    location: {
      lat: 17.3780,
      lng: 78.4890,
      address: 'Chaderghat Riverbank Elevation',
      zone: 'Chaderghat'
    },
    capacity: 650,
    occupancy: 590,
    foodSupplyPercent: 45,
    waterSupplyPercent: 38,
    medicalFacilityAvailable: true,
    isOpen: true,
    contactNumber: '+91 40 2451 9988',
    safeRouteAccessible: false
  },
  {
    id: 'SHELTER-03',
    name: 'Gachibowli Sports Complex Athletic Dormitory',
    location: {
      lat: 17.4470,
      lng: 78.3510,
      address: 'Old Mumbai Highway, Gachibowli',
      zone: 'Gachibowli'
    },
    capacity: 2500,
    occupancy: 710,
    foodSupplyPercent: 95,
    waterSupplyPercent: 98,
    medicalFacilityAvailable: true,
    isOpen: true,
    contactNumber: '+91 40 2300 0555',
    safeRouteAccessible: true
  }
];

export const INITIAL_ROADBLOCKS: RoadBlock[] = [
  {
    id: 'RB-01',
    streetName: 'Nayapul Cause-way & Salar Jung Bridge',
    zone: 'Charminar Division',
    coords: { lat: 17.3725, lng: 78.4720 },
    reason: 'FLOODING',
    severity: 'BLOCKED',
    reportedAt: '2026-09-16T17:12:00Z',
    detourAdvice: 'Divert traffic via Afzal Gunj Elevated Viaduct to Chaderghat New Bridge.'
  },
  {
    id: 'RB-02',
    streetName: 'Cyber Towers Underpass',
    zone: 'Madhapur',
    coords: { lat: 17.4490, lng: 78.3890 },
    reason: 'STRUCTURAL_DEBRIS',
    severity: 'RESTRICTED_ACCESS',
    reportedAt: '2026-09-16T17:21:00Z',
    detourAdvice: 'Use overhead flyover ramp toward Inorbit Mall. Underpass closed for emergency staging.'
  },
  {
    id: 'RB-03',
    streetName: 'Mehdipatnam to Tolichowki PVNR Expressway Ramp 2',
    zone: 'Mehdipatnam',
    coords: { lat: 17.3940, lng: 78.4350 },
    reason: 'VEHICLE_ACCIDENT',
    severity: 'BLOCKED',
    reportedAt: '2026-09-16T17:28:00Z',
    detourAdvice: 'Surface road open; expressway ramp entry blocked by recovery crane.'
  }
];

export const INITIAL_RISKZONES: RiskZone[] = [
  {
    id: 'RZ-01',
    name: 'Musi Inundation Sector Alpha',
    hazardType: 'FLOOD_INUNDATION',
    center: { lat: 17.3712, lng: 78.4735 },
    radiusMeters: 1400,
    severity: 'CRITICAL',
    evacuationStatus: 'ORDERED'
  },
  {
    id: 'RZ-02',
    name: 'Cyber Towers Thermal Flashover Perimeter',
    hazardType: 'FIRE_PERIMETER',
    center: { lat: 17.4483, lng: 78.3915 },
    radiusMeters: 450,
    severity: 'HIGH',
    evacuationStatus: 'WARNING'
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'SCENARIO-FLASH-FLOOD',
    title: 'Musi River Extreme Flash Inundation',
    category: 'FLOOD',
    location: 'Nayapul - Chaderghat Corridor',
    description: 'Catastrophic cloudburst upstream forces sudden floodgates opening at Osmansagar & Himayatsagar. Water surge enters dense urban settlement within minutes.',
    steps: [
      {
        timeOffset: '00:00',
        title: 'Sensor Spike & Surge Alert',
        description: 'Ultrasonic river gauge at Nayapul exceeds Danger Level (DL +1.8m). Hydrology warning broadcasted.',
        actionType: 'DETECTION',
        impactMetrics: { incidentsAdded: 1, affectedCount: 200 }
      },
      {
        timeOffset: '00:05',
        title: 'Mass Citizen SOS Surge',
        description: '14 citizen SOS reports received within 3 minutes from riverbank tenements. Multiple ground-floor inundations.',
        actionType: 'CLUSTER',
        impactMetrics: { incidentsAdded: 6, affectedCount: 950 }
      },
      {
        timeOffset: '00:10',
        title: 'AI Cluster #108 Formed & Risk Zone Expanded',
        description: 'ResQAI detects high density spatial grouping. Automatically raises alert to CRITICAL and creates 2.8 km exclusion polygon.',
        actionType: 'CLUSTER',
        impactMetrics: { affectedCount: 1450 }
      },
      {
        timeOffset: '00:15',
        title: 'Major Roadway Breached',
        description: 'Nayapul causeway submerged. ResQAI detects route severance and locks RB-01.',
        actionType: 'ROAD_BLOCK',
        impactMetrics: { roadsBlocked: 1 }
      },
      {
        timeOffset: '00:20',
        title: 'Autonomous Smart Dispatch Triggered',
        description: 'ResQAI dispatches SDRF Rapid Zodiac-7 power boats and Apollo ALS Medic 2. Alternative route generated bypassing flooded underpass.',
        actionType: 'DISPATCH',
        impactMetrics: { unitsDispatched: 3 }
      },
      {
        timeOffset: '00:25',
        title: 'Hospital Trauma Ward Pre-Alerted',
        description: 'Osmania General Hospital received automated victim influx telemetry. 15 ICU beds reserved, triage tents activated.',
        actionType: 'HOSPITAL_ALERT',
        impactMetrics: { affectedCount: 1450 }
      },
      {
        timeOffset: '00:30',
        title: 'Rescue Operations On Scene & Evacuation Directed',
        description: '78 residents evacuated to Yousufguda Indoor Stadium relief shelter. Zero casualties reported in first response window.',
        actionType: 'CONTAINMENT',
        impactMetrics: { affectedCount: 1450 }
      }
    ]
  },
  {
    id: 'SCENARIO-FIRE-CASCADE',
    title: 'HITEC City Commercial High-Rise Multi-Alarm Fire',
    category: 'FIRE',
    location: 'Cyber Gateway & Main Arterial Corridor',
    description: '4th floor server room battery fire causes dense smoke propagation through HVAC ducts, trapping workers on upper floors.',
    steps: [
      {
        timeOffset: '00:00',
        title: 'Smoke Detector Optical Trigger',
        description: 'Building telemetry triggers automatic IoT alarm. 911 citizen call confirms visible flames venting.',
        actionType: 'DETECTION',
        impactMetrics: { incidentsAdded: 1, affectedCount: 120 }
      },
      {
        timeOffset: '00:05',
        title: 'Thermal Plume Expansion & Citizen Photo AI Verification',
        description: 'Citizens submit photos. ResQAI Computer Vision identifies 4th-floor structural envelope compromise and 3-5 trapped victims on balcony.',
        actionType: 'DETECTION',
        impactMetrics: { affectedCount: 300 }
      },
      {
        timeOffset: '00:12',
        title: 'Multi-Agency Smart Dispatch (Skylift + ALS)',
        description: 'ResQAI scores Unit Bravo-4 Bronto Skylift (54m hydraulic ladder) as top match. Unit dispatched with traffic signal override priority.',
        actionType: 'DISPATCH',
        impactMetrics: { unitsDispatched: 2 }
      },
      {
        timeOffset: '00:18',
        title: 'Detour Re-Routing Around Gridlocked Flyover',
        description: 'Incident creates rubbernecking traffic jam. ResQAI automatically re-routes ALS Medic via back bypass, saving 4 minutes.',
        actionType: 'ROAD_BLOCK',
        impactMetrics: { roadsBlocked: 1 }
      },
      {
        timeOffset: '00:28',
        title: 'Terrace Rescue Completed & Fire Contained',
        description: 'All 8 victims extricated via aerial ladder. Smoke clearance fans activated. Casualty count held to zero fatalities.',
        actionType: 'CONTAINMENT',
        impactMetrics: { affectedCount: 300 }
      }
    ]
  }
];

export const SAFETY_GUIDES = [
  {
    id: 'fire',
    category: 'FIRE',
    title: 'Structure Fire & Smoke',
    icon: 'Flame',
    tagline: 'Get out, stay low, never use elevators.',
    dos: [
      'Crawl low under smoke — clean air is closest to the floor.',
      'Touch doors with the back of your hand before opening. If hot, use an alternate escape route.',
      'Close doors behind you to slow flame and smoke progression.',
      'Once outside, stay outside at the designated assembly point.',
      'Call emergency services or trigger ResQAI SOS immediately.'
    ],
    donts: [
      'DO NOT use elevators under any circumstances.',
      'DO NOT re-enter a burning building to retrieve belongings or pets.',
      'DO NOT open windows unless instructed — oxygen accelerates flashovers.',
      'DO NOT inhale dense smoke — cover mouth with wet fabric if available.'
    ]
  },
  {
    id: 'flood',
    category: 'FLOOD',
    title: 'Flash Flood & Urban Inundation',
    icon: 'Waves',
    tagline: 'Turn around, don’t drown. Seek high ground immediately.',
    dos: [
      'Move to higher ground or upper floor immediately if water begins rising.',
      'Disconnect electrical appliances and main breaker if safe to do so.',
      'Keep your phone battery conserved and activate ResQAI SOS with location locked.',
      'Signal for help from the roof or top window using a bright cloth or flashlight.'
    ],
    donts: [
      'DO NOT walk, swim, or drive through moving flood waters (just 6 inches can knock you down).',
      'DO NOT touch fallen power lines or water touching electrical poles.',
      'DO NOT enter basements or underground parking garages during flood warnings.',
      'DO NOT drink tap or flood water until declared safe by health authorities.'
    ]
  },
  {
    id: 'earthquake',
    category: 'COLLAPSE',
    title: 'Earthquake & Tremor',
    icon: 'Activity',
    tagline: 'Drop, Cover, and Hold On.',
    dos: [
      'DROP to your hands and knees immediately.',
      'COVER your head and neck under a sturdy table, desk, or against an interior wall.',
      'HOLD ON until shaking stops, protecting your head with your arms.',
      'If outdoors, move away from buildings, power lines, and flyovers.'
    ],
    donts: [
      'DO NOT stand under doorways — they do not protect against flying debris.',
      'DO NOT run outside while shaking is occurring; most injuries happen from falling glass/parapets.',
      'DO NOT light matches or lighters — gas pipes may have ruptured.'
    ]
  },
  {
    id: 'accident',
    category: 'ACCIDENT',
    title: 'Major Highway / Vehicle Collision',
    icon: 'CarFront',
    tagline: 'Protect scene safety first before rendering aid.',
    dos: [
      'Turn on hazard warning lights and place safety triangles 50m upstream if safe.',
      'Call 108 or activate ResQAI SOS with estimated victim count.',
      'Check if victims are conscious and breathing without moving their neck/spine.',
      'Turn off ignitions of damaged vehicles to eliminate fire sparks.'
    ],
    donts: [
      'DO NOT move an injured victim unless there is an imminent fire or explosion threat.',
      'DO NOT remove motorcycle helmets from unconscious riders.',
      'DO NOT stand in active traffic lanes on high-speed flyovers.'
    ]
  },
  {
    id: 'collapse',
    category: 'COLLAPSE',
    title: 'Structural Building Collapse',
    icon: 'Building2',
    tagline: 'Shield yourself, conserve oxygen, signal rhythmically.',
    dos: [
      'Create a void space next to heavy, solid furniture (the triangle of life).',
      'Cover your nose and mouth with cloth to filter toxic concrete dust.',
      'Tap on metal pipes or masonry in rhythmic 3-beat pulses so acoustic sensors can locate you.',
      'Shout only when you hear rescue crews nearby to conserve energy and oxygen.'
    ],
    donts: [
      'DO NOT panic or make wild movements that could kick up dust or cause secondary collapse.',
      'DO NOT use open flames or matches due to potential ruptured cooking gas.',
      'DO NOT attempt to pull heavy concrete beams by yourself.'
    ]
  }
];

export const INITIAL_BUILDINGS: BuildingLandmark[] = [
  {
    id: 'BLD-01',
    name: 'Cyber Towers Landmark',
    category: 'TECH_PARK',
    lat: 17.4504,
    lng: 78.3808,
    address: 'HITEC City Junction, Madhapur',
    zone: 'Madhapur',
    occupancyEstimate: 4200,
    floors: 10,
    structuralStatus: 'AT_RISK',
    safetyFeatures: ['Helipad', 'Emergency Sprinklers', 'Pressurized Stairwells']
  },
  {
    id: 'BLD-02',
    name: 'T-Hub 2.0 Innovation Complex',
    category: 'TECH_PARK',
    lat: 17.4330,
    lng: 78.3780,
    address: 'Raidurgam Knowledge City',
    zone: 'Gachibowli',
    occupancyEstimate: 2800,
    floors: 10,
    structuralStatus: 'SAFE',
    safetyFeatures: ['Automated Fire Curtains', 'Dual Backup Generators']
  },
  {
    id: 'BLD-03',
    name: 'Inorbit Mega Mall Complex',
    category: 'COMMERCIAL',
    lat: 17.4344,
    lng: 78.3867,
    address: 'APIIC Software Layout, Mindspace',
    zone: 'Madhapur',
    occupancyEstimate: 6500,
    floors: 6,
    structuralStatus: 'MONITORING',
    safetyFeatures: ['Wide Smoke Vents', '8 Exterior Emergency Exits']
  },
  {
    id: 'BLD-04',
    name: 'National Disaster Management Secretariat (NDMA Command Hub)',
    category: 'GOVERNMENT',
    lat: 17.4116,
    lng: 78.4716,
    address: 'Central Secretariat Promenade',
    zone: 'Central Command Zone',
    occupancyEstimate: 3500,
    floors: 7,
    structuralStatus: 'SAFE',
    safetyFeatures: ['Command Bunker', 'Disaster Radio Mast', 'Dedicated Triage Bay']
  },
  {
    id: 'BLD-05',
    name: 'Greater Hyderabad Municipal Corporation (GHMC HQ)',
    category: 'GOVERNMENT',
    lat: 17.4087,
    lng: 78.4720,
    address: 'Tank Bund Rd, Liberty Junction',
    zone: 'Central Zone',
    occupancyEstimate: 1800,
    floors: 5,
    structuralStatus: 'SAFE',
    safetyFeatures: ['EOC Relay Antenna', 'Underground Emergency Operations Room']
  },
  {
    id: 'BLD-06',
    name: 'Secunderabad Central Railway Junction Terminal',
    category: 'TRANSPORT',
    lat: 17.4334,
    lng: 78.5017,
    address: 'Station Rd, Secunderabad',
    zone: 'Secunderabad',
    occupancyEstimate: 14000,
    floors: 3,
    structuralStatus: 'SAFE',
    safetyFeatures: ['Emergency Public Address', 'Mass Evacuation Concourses']
  },
  {
    id: 'BLD-07',
    name: 'Historic Charminar Civic Plaza',
    category: 'HERITAGE',
    lat: 17.3616,
    lng: 78.4747,
    address: 'Char Kaman, Old City',
    zone: 'Old City',
    occupancyEstimate: 8500,
    floors: 4,
    structuralStatus: 'MONITORING',
    safetyFeatures: ['Crowd Evacuation Lanes', 'Police Emergency Outpost']
  },
  {
    id: 'BLD-08',
    name: 'DLF Cyber City Complex',
    category: 'TECH_PARK',
    lat: 17.4485,
    lng: 78.3582,
    address: 'Gachibowli High-Tech Corridor',
    zone: 'Gachibowli',
    occupancyEstimate: 5200,
    floors: 12,
    structuralStatus: 'SAFE',
    safetyFeatures: ['Fire Hydrant Network', 'Emergency Medical Post']
  }
];
