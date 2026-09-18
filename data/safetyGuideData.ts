export type Language = 'en' | 'hi' | 'te';

export interface ActionStep {
  step: string;
  title: string;
  shortDesc: string;
  explanation: string;
  iconName: string;
  illustrationType: string;
  imageUrl?: string;
}

export interface DoDontItem {
  type: 'do' | 'dont';
  title: string;
  description: string;
  reason: string;
  iconName: string;
}

export interface ContextSituation {
  situation: string; // e.g. 'Indoors', 'Outdoors', 'In Vehicle', 'In Bed', 'Wheelchair / Mobility Device'
  action: string;
  tip: string;
}

export interface PhaseGuidance {
  phase: 'before' | 'during' | 'after';
  headline: string;
  items: string[];
}

export interface QuizQuestion {
  id: string;
  disasterId: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface DisasterGuide {
  id: string;
  name: string;
  category: 'geological' | 'weather' | 'fire' | 'hazardous' | 'complex';
  shortTag: string;
  tagline: string;
  color: string;
  accentBg: string;
  badgeBorder: string;
  source: string;
  sourceUrl: string;
  lastReviewed: string;
  quickActionTitle: string;
  quickActionSteps: string[];
  visualSequence: ActionStep[];
  doDonts: DoDontItem[];
  phases: PhaseGuidance[];
  specialSituations: ContextSituation[];
  evacuationTriggers: string[];
  call112Advice: string;
  kitHighlights: string[];
}

export const DISASTERS_DATA: DisasterGuide[] = [
  {
    id: 'earthquake',
    name: 'Earthquake',
    category: 'geological',
    shortTag: 'DROP • COVER • HOLD ON',
    tagline: 'Sudden rapid shaking caused by tectonic fault displacement.',
    color: '#f43f5e',
    accentBg: 'bg-rose-500/10 text-rose-400',
    badgeBorder: 'border-rose-500/30',
    source: 'National Disaster Management Authority (NDMA) & USGS Earthquake Hazards',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'September 2026',
    quickActionTitle: 'DROP ➔ COVER ➔ HOLD ON',
    quickActionSteps: [
      'DROP down onto your hands and knees to prevent falling.',
      'COVER your head and neck under sturdy furniture or against an interior wall.',
      'HOLD ON to your shelter until violent shaking completely stops.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'DROP IMMEDIATELY',
        shortDesc: 'Get down on hands & knees.',
        explanation: 'Do not attempt to run while ground is violently oscillating. Dropping prevents fall injuries and keeps you low below flying objects.',
        iconName: 'ArrowDown',
        illustrationType: 'earthquake-drop',
        imageUrl: '/images/disasters/earthquake/step1-drop.jpg'
      },
      {
        step: '02',
        title: 'COVER HEAD & NECK',
        shortDesc: 'Shelter under sturdy table/desk.',
        explanation: 'Position yourself under heavy furniture. If no table is near, crouch against an interior wall away from windows, ceiling fans, and heavy glass.',
        iconName: 'Shield',
        illustrationType: 'earthquake-cover',
        imageUrl: '/images/disasters/earthquake/step2-cover.png'
      },
      {
        step: '03',
        title: 'HOLD ON TO SHELTER',
        shortDesc: 'Hold tight until shaking ends.',
        explanation: 'Grip table legs firmly with both hands. Furniture can slide across tiled floors; move with your shelter until tremors cease.',
        iconName: 'Hand',
        illustrationType: 'earthquake-hold',
        imageUrl: '/images/disasters/earthquake/step3-hold.png'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Take cover under sturdy furniture',
        description: 'Position your entire body beneath a solid desk or dining table.',
        reason: 'Prevents falling light fixtures, ceiling plaster, and fans from causing fatal impact.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT run outside during shaking',
        description: 'Never sprint through doorways, staircases, or down building corridors while shaking.',
        reason: 'Over 80% of urban earthquake injuries occur from falling masonry and exterior glass near building exits.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Cover head with pillow if in bed',
        description: 'Stay in bed, turn face down, and hold a thick pillow firmly over head and neck.',
        reason: 'Broken glass on dark floors causes severe lacerations if you attempt to jump out in the dark.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT stand in doorways',
        description: 'Avoid doorways in modern buildings. They are rarely reinforced and doors can slam shut violently.',
        reason: 'In modern framed structures, doorways are no stronger than interior walls and offer zero protection from flying debris.',
        iconName: 'X'
      },
      {
        type: 'dont',
        title: 'Do NOT use elevators',
        description: 'Never step into an elevator shaft during or immediately following an earthquake.',
        reason: 'Power failure or twisted elevator hoist rails will trap passengers in dark shafts with smoke risk.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Secure Heavy Furniture & Map Safe Spots',
        items: [
          'Fasten tall bookshelves, water heaters, and heavy almirahs to wall studs using metal L-brackets.',
          'Identify sturdy tables in every room where family members can drop and take shelter.',
          'Never hang heavy framed glass paintings, mirrors, or loose ceiling shelves directly above beds.',
          'Keep sturdy shoes and a flashlight with fresh batteries right beside your bed at all times.'
        ]
      },
      {
        phase: 'during',
        headline: 'Drop, Cover, Hold On & Protect Head',
        items: [
          'If indoors: stay inside until shaking stops. Do not rush for exits or crowd stairwells.',
          'If in kitchen: turn off cooking gas burners immediately if reachable, then drop under table.',
          'If outdoors: move into open areas away from buildings, overhead electrical wires, and streetlights.',
          'If in vehicle: pull over safely away from overpasses, bridges, and power lines, set parking brake.'
        ]
      },
      {
        phase: 'after',
        headline: 'Inspect Gas, Water & Beware Aftershocks',
        items: [
          'Expect secondary tremors (aftershocks). Be prepared to Drop, Cover, and Hold On repeatedly.',
          'Sniff for cooking gas (LPG) leaks. If smelled, do not strike matches or flip electrical switches. Evacuate immediately.',
          'Check family members for injuries. Apply pressure to severe bleeding before moving non-ambulatory persons.',
          'Use stairs only. Inspect building facades for loose hanging plaster before walking outside.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Wheelchair / Mobility Device',
        action: 'Lock wheels immediately. Bend forward from waist, cover head and neck with arms, thick notebook, or bag until shaking stops.',
        tip: 'Ensure wheelchair brakes are serviced regularly so they do not slip on vibrating floor surfaces.'
      },
      {
        situation: 'In a Moving Vehicle',
        action: 'Gently slow down and pull over to curb away from flyovers, utility poles, and steep hillsides. Remain inside vehicle with seatbelt buckled.',
        tip: 'The car suspension absorbs seismic vibrations; staying inside protects from falling cables.'
      },
      {
        situation: 'In a Crowded Public Hall / Mall',
        action: 'Do not rush for the main glass exits. Drop to floor beside seating rows or structural columns and shield head.',
        tip: 'Stampedes at exit doors injure more people than the earthquake itself in public venues.'
      },
      {
        situation: 'In High-Rise Building',
        action: 'Drop and Cover under interior desks. Do not panic if fire alarms or water sprinklers trigger automatically.',
        tip: 'High-rise structures are engineered to sway gently; avoid running into elevator lobbies.'
      }
    ],
    evacuationTriggers: [
      'Visual structural cracks wider than 1/4 inch across load-bearing pillars or beams.',
      'Smell of escaping LPG gas or visible severed electrical conduit sparking.',
      'Building tilting, jammed doors/windows indicating structural frame skewing.'
    ],
    call112Advice: 'Call 112 only if people are trapped under collapsed debris or suffering severe life-threatening trauma. Keep phone lines open for coordinated rescue dispatch.',
    kitHighlights: ['Sturdy leather gloves', 'Whistle to signal search teams', 'Dust mask (N95)', 'Heavy shoes']
  },
  {
    id: 'flood',
    name: 'Flood & Inundation',
    category: 'weather',
    shortTag: 'MOVE TO HIGH GROUND • NEVER CROSS WATER',
    tagline: 'Rapid water accumulation submerging roads, structures, and low-lying basins.',
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
    source: 'National Disaster Management Authority (NDMA) & Central Water Commission (CWC)',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'MOVE TO HIGHER GROUND IMMEDIATELY',
    quickActionSteps: [
      'MOVE to upper floors or designated elevated high ground before water reaches knees.',
      'AVOID walking, wading, or swimming in moving floodwaters.',
      'NEVER attempt to drive a motorcycle, car, or bus through water over 6 inches deep.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'SEEK HIGH GROUND',
        shortDesc: 'Evacuate low areas early.',
        explanation: 'Move your family and vulnerable neighbors to higher ground before drainage basins flood and escape roads become impassable.',
        iconName: 'ArrowUpRight',
        illustrationType: 'flood-highground'
      },
      {
        step: '02',
        title: 'AVOID MOVING WATER',
        shortDesc: '6 inches of water knocks you down.',
        explanation: 'Just 15 cm (6 inches) of rushing water can sweep an adult off their feet. Fast water conceals missing manhole lids and live electric cables.',
        iconName: 'AlertTriangle',
        illustrationType: 'flood-avoidwater'
      },
      {
        step: '03',
        title: 'TURN OFF POWER MAINS',
        shortDesc: 'Cut main breaker before water enters.',
        explanation: 'Switch off the main electrical MCB breaker and shut off gas cylinders before floodwater reaches electrical outlets to prevent electrocution.',
        iconName: 'ZapOff',
        illustrationType: 'flood-powercut'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Follow official CWC/NDMA flood alerts',
        description: 'Monitor state disaster authority sirens, WhatsApp broadcasts, and radio flood bulletin levels.',
        reason: 'Upstream dam gates can release thousands of cusecs suddenly without local rainfall overhead.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT drive through flooded roads',
        description: 'Never attempt to drive a two-wheeler or four-wheeler through water whose depth is unknown.',
        reason: 'Most flood-related fatalities occur in submerged vehicles. 30 cm (1 foot) of water floats most cars.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Boil all drinking water for 1 minute',
        description: 'Consume only boiled or chlorination-treated bottled water during and after flood events.',
        reason: 'Flood runoff contaminates municipal pipelines and groundwater wells with raw sewage and pathogens.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT touch electrical appliances when wet',
        description: 'Never handle plugged appliances or step into water-logged rooms with live circuit panels.',
        reason: 'Water conducts electrical current rapidly, leading to instantaneous fatal heart stoppage.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Clear Drains, Waterproof Docs & Prepare Go-Bags',
        items: [
          'Pack Aadhaar cards, property papers, insurance, and medical records inside double zip-lock waterproof pouches.',
          'Elevate major electrical appliances, inverter batteries, and furniture above historical water marks.',
          'Stock 3 days of clean drinking water, dry food (biscuits, roasted grams), and personal prescription medicines.',
          'Learn the official municipal elevation contour map and locate your nearest high-ground relief shelter.'
        ]
      },
      {
        phase: 'during',
        headline: 'Switch Off Mains & Evacuate Before Trapped',
        items: [
          'Disconnect electricity at the main distribution panel before water reaches the ground floor switchboards.',
          'If ordered to evacuate by district administration, leave immediately; do not delay to save belongings.',
          'Do not walk near drainage culverts, open manholes, or submerged railway underpasses.',
          'If trapped inside rising home, move to upper roof. Do not climb into enclosed unventilated attics without roof exits.'
        ]
      },
      {
        phase: 'after',
        headline: 'Disinfect Living Areas & Avoid Standing Water',
        items: [
          'Return home only when local authorities give the all-clear notification.',
          'Beware of snakes and dangerous reptiles seeking refuge on elevated furniture, stairs, or dry shelves.',
          'Discard all food, medicines, and water that came into contact with floodwater.',
          'Take photographs of water level stains and structural damage for relief compensation claims.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Trapped Inside a Stalled Vehicle',
        action: 'If water is rising around stalled vehicle, unbuckle seatbelt immediately, roll down window, exit through window and get onto vehicle roof.',
        tip: 'Water pressure will make car doors impossible to push open until water level equalizes.'
      },
      {
        situation: 'Bedridden or Elderly Family Member',
        action: 'Evacuate them at the first amber warning stage before waters enter neighborhood streets; do not wait for red alerts.',
        tip: 'Specialist ambulances and rescue boats cannot navigate narrow inundated alleys at peak flood.'
      },
      {
        situation: 'Flash Flood in Hilly Terrain',
        action: 'Immediately climb slopes perpendicular to stream bed. Do not attempt to cross streams even if water looks shallow.',
        tip: 'Mountain flash floods carry massive boulder debris and hit with sudden walls of water.'
      }
    ],
    evacuationTriggers: [
      'Official red alert warning from district collector / municipal commissioner.',
      'Water level rising steadily past the ground floor threshold (10 cm/hr).',
      'Report of upstream dam breach or embankment collapse within 15 km.'
    ],
    call112Advice: 'Dial 112 if water has breached the upper floor or persons are stranded on rooftops in fast current. Provide exact building landmark and victim count.',
    kitHighlights: ['Water purification tablets', 'Waterproof pouch for phones/IDs', 'Whistle', 'Long rope (10m)']
  },
  {
    id: 'cyclone',
    name: 'Cyclone & Severe Storm',
    category: 'weather',
    shortTag: 'STAY INDOORS • STAY CLEAR OF WINDOWS',
    tagline: 'Intense tropical vortex with destructive gale winds, storm surges, and torrential downpours.',
    color: '#3b82f6',
    accentBg: 'bg-blue-500/10 text-blue-400',
    badgeBorder: 'border-blue-500/30',
    source: 'India Meteorological Department (IMD) & NDMA Tropical Cyclone Guidelines',
    sourceUrl: 'https://mausam.imd.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'STAY IN SAFE PUCCA ROOM AWAY FROM WINDOWS',
    quickActionSteps: [
      'REMAIN inside a concrete (pucca) house in an interior windowless room.',
      'SECURE or bring inside loose outdoor objects, metal sheets, and potted plants.',
      'DO NOT venture out during the temporary calm eye of the storm.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'SECURE OUTDOORS',
        shortDesc: 'Anchor loose tin sheets & plants.',
        explanation: 'High gale winds turn untethered corrugated sheets and terrace pots into deadly flying missiles.',
        iconName: 'Layers',
        illustrationType: 'cyclone-secure'
      },
      {
        step: '02',
        title: 'SHELTER INTERIOR ROOM',
        shortDesc: 'Stay away from glass windows.',
        explanation: 'Take shelter in the strongest ground-level room (such as a reinforced corridor or bathroom) away from external glass panes.',
        iconName: 'Shield',
        illustrationType: 'cyclone-shelter'
      },
      {
        step: '03',
        title: 'BEWARE THE STORM EYE',
        shortDesc: 'Calm winds do not mean it is over.',
        explanation: 'When the cyclone eye passes overhead, winds drop suddenly to near calm. Violent hurricane-force winds will return abruptly from the opposite direction.',
        iconName: 'Clock',
        illustrationType: 'cyclone-eye'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Tape large glass windows with diagonal X',
        description: 'Apply strong adhesive tape diagonally across glass panels and shutter external windows.',
        reason: 'Prevents flying glass shards from scattering inward if wind pressure implodes the window.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT step outside when winds stop briefly',
        description: 'Never go outside to inspect roof damage during a lull in cyclone winds.',
        reason: 'The center eye is passing; the trailing eyewall strikes within 20 minutes with reversed destructive force.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Keep battery radio tuned to All India Radio',
        description: 'Rely on battery-powered radios for IMD cyclone bulletins when cell towers collapse.',
        reason: 'High-speed winds frequently topple cellular base transceivers; terrestrial AM/FM radio survives.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT touch severed power lines',
        description: 'Treat all downed overhead cables and metal fences touching wires as live and lethal.',
        reason: 'Substation automated switches or localized generators can re-energize cables without warning.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Trim Overhanging Trees & Relocate from Kutcha Houses',
        items: [
          'If living in a thatched (kutcha) or asbestos-sheet roof dwelling, move to a designated concrete cyclone shelter.',
          'Trim dead branches from trees near your roofline that could collapse under 120+ km/h winds.',
          'Fully charge power banks, rechargeable emergency lanterns, and mobile phones.',
          'Store adequate clean water in closed overhead and ground tanks as municipal pumps will lose grid power.'
        ]
      },
      {
        phase: 'during',
        headline: 'Unplug Electronics & Remain in Central Room',
        items: [
          'Turn off main electrical breakers to protect appliances from lightning surges and severed live wires.',
          'Keep windows tightly latched; do not crack windows open on the leeward side during cyclone landfall.',
          'Listen to official IMD updates on radio. Follow district collector evacuation directives without argument.'
        ]
      },
      {
        phase: 'after',
        headline: 'Watch for Snapped Cables & Flooded Debris',
        items: [
          'Wait until district authorities officially broadcast that the storm has completely dissipated.',
          'Report broken gas mains or sparking wires to municipal disaster control rooms or 112.',
          'Wear tough rubber boots when clearing garden debris to guard against concealed glass, nails, and snakes.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Coastal Lowland Resident',
        action: 'Evacuate 3 km inland to elevated cyclone shelters immediately upon storm surge warning issuance.',
        tip: 'Storm surges can push seawater 4 to 6 meters above normal tide levels, flooding coastal towns in minutes.'
      },
      {
        situation: 'Living in Asbestos/Tin Roof House',
        action: 'Do not attempt to weigh down tin sheets with bricks during winds. Evacuate to a school/community pucca shelter.',
        tip: 'Bricks placed on tin roofs turn into heavy projectiles when sheets are torn by wind gusts.'
      }
    ],
    evacuationTriggers: [
      'IMD Red Cyclone Warning for landfall within 12 hours with expected storm surge > 2 meters.',
      'Residence within 1 km of coastline or in low-lying river estuary.',
      'Dwelling structure is not pucca concrete.'
    ],
    call112Advice: 'Call 112 if roof has collapsed or storm surge is entering the room. State whether elderly or infants are present.',
    kitHighlights: ['Battery-operated AM/FM radio', 'Spare batteries', 'Waterproof matchbox / lighter', 'Tarpaulin sheet']
  },
  {
    id: 'fire',
    name: 'Building & Domestic Fire',
    category: 'fire',
    shortTag: 'GET OUT • STAY LOW • NEVER USE ELEVATOR',
    tagline: 'Rapid thermal combustion producing toxic asphyxiating smoke, heat, and structural breach.',
    color: '#f97316',
    accentBg: 'bg-orange-500/10 text-orange-400',
    badgeBorder: 'border-orange-500/30',
    source: 'National Building Code of India (NBC) & Delhi Fire Service / NDMA Fire Guidelines',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'July 2026',
    quickActionTitle: 'ALERT ➔ CRAWL LOW ➔ EXIT SAFELY',
    quickActionSteps: [
      'ALERT everyone nearby by shouting and pulling manual call points.',
      'CRAWL LOW under smoke toward the nearest fire stairwell exit.',
      'NEVER take an elevator. NEVER re-enter a burning building for belongings.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'ALERT & EVACUATE',
        shortDesc: 'Shout "FIRE!" & trigger alarm.',
        explanation: 'Warn roommates and neighbors immediately. Every 30 seconds a small room fire doubles in intensity.',
        iconName: 'Siren',
        illustrationType: 'fire-alert'
      },
      {
        step: '02',
        title: 'CRAWL UNDER SMOKE',
        shortDesc: 'Clean air is 12 inches off floor.',
        explanation: 'Toxic carbon monoxide and heated gases rise to the ceiling. Crawling on hands and knees keeps your mouth in the cool, breathable layer.',
        iconName: 'ArrowDown',
        illustrationType: 'fire-crawllow'
      },
      {
        step: '03',
        title: 'TAKE STAIRS ONLY',
        shortDesc: 'Never use building elevators.',
        explanation: 'Elevator power cables fail quickly, converting cabs into incinerating traps. Stairwells are pressurized fire exits.',
        iconName: 'Footprints',
        illustrationType: 'fire-stairs'
      },
      {
        step: '04',
        title: 'STOP, DROP & ROLL',
        shortDesc: 'If clothing catches fire.',
        explanation: 'Do not run. Drop immediately to the ground, cover face with hands, and roll back and forth to smother flames.',
        iconName: 'RotateCw',
        illustrationType: 'fire-stopdroproll'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Feel closed door with back of hand before opening',
        description: 'Touch metal door handle and upper door with back of hand. If hot, do not open.',
        reason: 'Opening a hot door introduces fresh oxygen, causing a lethal flashover explosion into your face.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT use elevators during building fires',
        description: 'Never press elevator buttons to evacuate high-rise floors.',
        reason: 'Elevator shaft acts as a chimney pulling toxic smoke; power cuts leave you trapped between burning floors.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Close doors behind you as you evacuate',
        description: 'Close every room and corridor door behind you without locking them.',
        reason: 'Compartmentalizes the fire, starving it of oxygen and slowing flame progression by 10 to 20 minutes.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT go back inside for valuables or pets',
        description: 'Once outside at designated assembly point, remain outside.',
        reason: 'Flashover temperatures exceed 600°C; breathing superheated smoke twice can sear lung alveoli fatally.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Install Smoke Alarms & Practice 2 Exit Paths',
        items: [
          'Know two clear escape routes from every bedroom and living space in your home.',
          'Keep common staircases, building fire escapes, and corridor pathways free of bicycles and shoe racks.',
          'Keep an ABC-type dry powder fire extinguisher in the kitchen area and learn the PASS method (Pull, Aim, Squeeze, Sweep).',
          'Check electrical wiring annually to prevent circuit overloads, particularly for AC units and heavy heating coils.'
        ]
      },
      {
        phase: 'during',
        headline: 'Crawl Low, Exit Rapidly & Call 112 from Outside',
        items: [
          'If exit is blocked by heavy flames, retreat into room, seal door gaps with wet towels or bedsheets, and signal from window.',
          'Call 112 / 101 immediately once safely outside, giving building number, floor, and known trapped persons count.',
          'Never jump from upper floors (above 2nd floor); wait for fire brigade snorkel ladders.'
        ]
      },
      {
        phase: 'after',
        headline: 'Await Fire Official Clearance & Treat Burns with Cool Water',
        items: [
          'Do not re-enter burned premises until Chief Fire Officer explicitly certifies structural safety.',
          'Cool thermal skin burns with gentle running tap water for 15 minutes; do not apply ghee, toothpaste, or turmeric.',
          'Inform fire department personnel immediately if any pet or occupant remains unaccounted for.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Trapped in High-Rise Room',
        action: 'Close all doors between you and smoke. Place damp bedsheets along door seams. Open window slightly for fresh air, wave bright cloth to signal ground fire crews.',
        tip: 'Never break window glass completely, as smoke from lower burning windows can be drawn inside.'
      },
      {
        situation: 'LPG Gas Cylinder Leak Fire',
        action: 'Do not throw water on LPG fires. Cover cylinder valve with a large soaking wet cotton bedsheet or gunny sack to cut oxygen supply, and turn off regulator knob.',
        tip: 'If cylinder is whistling loudly, evacuate 100 meters away immediately; boiling liquid expanding vapor explosion (BLEVE) is imminent.'
      }
    ],
    evacuationTriggers: [
      'Any uncontained flame spreading beyond a small wastebasket.',
      'Sound of building fire alarm horn or smoke detector.',
      'Heavy acrid black smoke entering ventilation ducts or corridor.'
    ],
    call112Advice: 'Call 112 or 101 from outside the building. State floor number, stairwell location, and whether hazardous cylinders are present.',
    kitHighlights: ['Smoke escape hood (filter mask)', 'Small tactical torch', 'Whistle', 'Fire-retardant emergency blanket']
  },
  {
    id: 'lightning',
    name: 'Lightning & Thunderstorm',
    category: 'weather',
    shortTag: 'WHEN THUNDER ROARS, GO INDOORS',
    tagline: 'Massive atmospheric electrostatic discharge capable of fatal cardiac arrest.',
    color: '#eab308',
    accentBg: 'bg-yellow-500/10 text-yellow-400',
    badgeBorder: 'border-yellow-500/30',
    source: 'National Disaster Management Authority (NDMA) & Lightning Resilient India Campaign',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'WHEN THUNDER ROARS, GO INDOORS',
    quickActionSteps: [
      'SEEK SHELTER inside a substantial enclosed building or hard-topped metal vehicle.',
      'NEVER stand under isolated trees, metal sheds, or in open agricultural fields.',
      'STAY INDOORS for at least 30 minutes after the last clap of thunder.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'HEAR THUNDER? MOVE',
        shortDesc: 'Thunder means lightning is close.',
        explanation: 'If you can hear thunder, you are within striking distance of the storm cell (within 15 km), even under partly clear skies.',
        iconName: 'Volume2',
        illustrationType: 'lightning-hear'
      },
      {
        step: '02',
        title: 'ENTER SUBSTANTIAL SHELTER',
        shortDesc: 'Pucca house or hard-top car.',
        explanation: 'A fully enclosed concrete building with plumbing and wiring conducts lightning current safely into ground.',
        iconName: 'Home',
        illustrationType: 'lightning-shelter'
      },
      {
        step: '03',
        title: 'CROUCH IF STRANDED',
        shortDesc: 'Feet touching, hands over ears.',
        explanation: 'If caught in open field with zero shelter: crouch low on balls of feet, touch heels together, tuck head between knees. Do NOT lie flat on ground.',
        iconName: 'UserCheck',
        illustrationType: 'lightning-crouch'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Seek shelter in fully enclosed buildings',
        description: 'Enter a brick/concrete structure with four walls, roof, and electrical grounding.',
        reason: 'The plumbing and structural rebar safely disperse 300 million volts away from interior occupants.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT stand under isolated tall trees',
        description: 'Never take refuge beneath an isolated banyan, palm, or eucalyptus tree during rain.',
        reason: 'Trees attract strikes; ground current and side-flash arcs jump from tree trunk directly to nearby humans.',
        iconName: 'X'
      },
      {
        type: 'dont',
        title: 'Do NOT lie flat on the ground',
        description: 'Never lie down on open soil, agricultural fields, or lawns during a thunderstorm.',
        reason: 'Ground current spreads horizontally across soil; lying flat maximizes surface contact with deadly voltage gradient.',
        iconName: 'X'
      },
      {
        type: 'dont',
        title: 'Do NOT use corded phones or take showers',
        description: 'Avoid landline corded handsets and bathing/washing utensils during lightning.',
        reason: 'Lightning traveling down utility cables or metal water pipes can energize plumbing fixtures.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Monitor Damini / IMD Lightning Alerts & Plan Outdoor Work',
        items: [
          'Check Damini app (IITM-IMD) before farming, sports, or construction activities in monsoon season.',
          'Install a certified lightning arrester (Franklin rod) on rooftops in rural and semi-urban dwellings.',
          'Bring outdoor pets inside and unplug high-value electronic equipment before storm arrives.'
        ]
      },
      {
        phase: 'during',
        headline: 'Stay Away from Windows & Metal Handrails',
        items: [
          'Stay off terraces, open balconies, and metal tin sheds in fields.',
          'If in a car: keep windows rolled up fully and avoid touching metal door handles; car body acts as a Faraday cage.',
          'Wait 30 full minutes after the final thunder rumble before resuming outdoor activities.'
        ]
      },
      {
        phase: 'after',
        headline: 'Provide Immediate CPR to Strike Victims',
        items: [
          'Lightning strike victims carry NO electrical charge; it is 100% safe to touch and help them immediately.',
          'If victim has no pulse, begin hands-only cardiopulmonary resuscitation (CPR) instantly at 100-120 compressions/minute.',
          'Call 112 immediately for emergency defibrillator (AED) ambulance dispatch.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Open Farmland Worker',
        action: 'Drop metal farming tools (sickles, spades) 10 meters away immediately. Disperse from groups; maintain 15 feet distance between workers.',
        tip: 'Group clustering increases casualty count from a single ground strike.'
      },
      {
        situation: 'Swimmer / Fisherman in Water',
        action: 'Exit water immediately. Water conducts current over wide areas.',
        tip: 'Never stay in open country boats with metal fishing rods during lightning storms.'
      }
    ],
    evacuationTriggers: [
      'Hearing thunder within 30 seconds of seeing a lightning flash (indicates storm is within 10 km).',
      'Hair standing on end or skin tingling (indicates lightning strike is imminent within seconds).'
    ],
    call112Advice: 'Call 112 immediately if a person is struck by lightning. State clearly if CPR is currently in progress.',
    kitHighlights: ['Hands-free CPR card', 'Insulated boots', 'Portable battery radio', 'Emergency contact list']
  },
  {
    id: 'landslide',
    name: 'Landslide & Debris Flow',
    category: 'geological',
    shortTag: 'WATCH CRACKS • MOVE LATERALLY AWAY',
    tagline: 'Mass downward movement of rock, earth, and debris along saturated mountain slopes.',
    color: '#84cc16',
    accentBg: 'bg-lime-500/10 text-lime-400',
    badgeBorder: 'border-lime-500/30',
    source: 'Geological Survey of India (GSI) & NDMA Landslide Risk Management Guidelines',
    sourceUrl: 'https://www.gsi.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'MOVE OUT OF THE PATH LATERALLY',
    quickActionSteps: [
      'MOVE AWAY from the slope path laterally (to the side), not straight downhill.',
      'WATCH for warning signs: tilting trees, new ground fissures, and sudden muddy stream color.',
      'DO NOT cross roads covered in fresh loose mud and debris.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'IDENTIFY EARLY SIGNS',
        shortDesc: 'New cracks in walls & ground.',
        explanation: 'Doors jamming, retaining wall bulges, tilting telephone poles, and sudden bubbling springs are telltale slope failure warnings.',
        iconName: 'Eye',
        illustrationType: 'landslide-warning'
      },
      {
        step: '02',
        title: 'ESCAPE LATERALLY',
        shortDesc: 'Run to side, never downhill.',
        explanation: 'Debris flows travel downhill at 40-70 km/h, far faster than human running speed. Move sideways away from the channel axis.',
        iconName: 'ArrowRight',
        illustrationType: 'landslide-lateral'
      },
      {
        step: '03',
        title: 'CURL INTO BALL IF TRAPPED',
        shortDesc: 'Protect head with arms.',
        explanation: 'If escape is impossible, curl into a tight fetal ball against an interior structural wall and protect your skull with both hands.',
        iconName: 'Shield',
        illustrationType: 'landslide-curl'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Move sideways away from the slide axis',
        description: 'Evacuate laterally across the slope away from the main gully or debris chute.',
        reason: 'Debris moves with concentrated momentum along natural drainage valleys.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT run downhill ahead of a mudflow',
        description: 'Never attempt to outrun falling soil and rock down the slope gradient.',
        reason: 'Saturated mudflows accelerate downhill and bury everything in their forward path.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Listen for unusual rumbling sounds',
        description: 'Pay attention to sounds like freight trains or snapping tree trunks in heavy mountain rain.',
        reason: 'Provides a 10 to 30 second warning window to scramble up or sideways before impact.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT drive across fresh landslide deposits',
        description: 'Never drive onto roads covered with fresh rock scree or muddy silt.',
        reason: 'Road edges are often undercut; vehicle weight triggers secondary catastrophic slope shear.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Maintain Slope Drainage & Plant Deep-Rooted Vegetation',
        items: [
          'Never block mountain hill drainage channels with construction debris or plastic waste.',
          'Inspect retaining walls for fresh weep-hole clogging or bowing cracks after continuous rain.',
          'Evacuate early if residing near toe of steep slopes during heavy monsoon spells (> 150 mm/day).'
        ]
      },
      {
        phase: 'during',
        headline: 'Evacuate Laterally & Seek Solid Bedrock Ground',
        items: [
          'Move away from the slide path without stopping for heavy luggage.',
          'Stay awake and alert during intense nighttime downpours in hill stations; many fatalities occur while asleep.',
          'Warn downslope neighbors if you observe sudden cracking or stream damming above them.'
        ]
      },
      {
        phase: 'after',
        headline: 'Stay Away from Slide Perimeter & Beware Secondary Collapses',
        items: [
          'Do not approach the active landslide edge; slope faces remain unstable for days after rain.',
          'Check for injured or trapped persons around the perimeter without entering the direct slide zone.',
          'Report broken water mains, gas pipelines, and road blockages to district emergency control room.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Mountain Highway Traveler',
        action: 'Watch for falling pebbles on road surface. If small rocks are falling, reverse vehicle immediately and retreat to a road section under solid cliff overhang or tunnel.',
        tip: 'Small pebble drops are the immediate prelude to massive rockfall.'
      }
    ],
    evacuationTriggers: [
      'Sudden rapid decrease or increase in stream water flow with thick brown mud discoloration.',
      'Visible tension fissures opening in patio, road, or hillside soil.',
      'Continuous torrential rainfall exceeding 200 mm over 24 hours in vulnerable ghat regions.'
    ],
    call112Advice: 'Dial 112 to report blocked national highways or buried structures. State the exact kilometer stone marker.',
    kitHighlights: ['Sturdy mountain boots', 'High-decibel whistle', 'Waterproof headlamp', 'First-aid tourniquet']
  },
  {
    id: 'tsunami',
    name: 'Tsunami & Coastal Surge',
    category: 'geological',
    shortTag: 'FEEL SHAKING? MOVE INLAND & UPWARD',
    tagline: 'Series of immense ocean waves generated by submarine earthquake, volcanic eruption, or landslide.',
    color: '#0284c7',
    accentBg: 'bg-sky-500/10 text-sky-400',
    badgeBorder: 'border-sky-500/30',
    source: 'Indian National Centre for Ocean Information Services (INCOIS) & NDMA Tsunami Guidelines',
    sourceUrl: 'https://incois.gov.in',
    lastReviewed: 'July 2026',
    quickActionTitle: 'EVACUATE INLAND / 30 METERS HIGH IMMEDIATELY',
    quickActionSteps: [
      'If you feel strong coastal shaking or see ocean receding: RUN INLAND IMMEDIATELY.',
      'CLIMB to at least 30 meters above sea level or 3 km inland.',
      'NEVER go to the beach to watch the receding tide or incoming wave.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'NATURE\'S WARNING',
        shortDesc: 'Shaking or receding ocean.',
        explanation: 'A strong coastal earthquake lasting > 20 seconds, or ocean water suddenly pulling back exposing sea floor, is nature\'s immediate tsunami alarm.',
        iconName: 'AlertTriangle',
        illustrationType: 'tsunami-warning'
      },
      {
        step: '02',
        title: 'RUN INLAND & UP',
        shortDesc: 'Reach 30m elevation / 3km inland.',
        explanation: 'Do not wait for official siren confirmations. Seconds count. Evacuate on foot; roads will rapidly bottleneck with gridlocked cars.',
        iconName: 'ArrowUp',
        illustrationType: 'tsunami-evacuate'
      },
      {
        step: '03',
        title: 'EXPECT MULTIPLE WAVES',
        shortDesc: 'First wave is rarely the largest.',
        explanation: 'Tsunamis are a train of waves arriving hours apart. The second, third, or fourth surge is frequently larger and more destructive than the first.',
        iconName: 'Repeat',
        illustrationType: 'tsunami-multiple'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Evacuate on foot to higher ground immediately',
        description: 'Climb elevated hills, ridges, or multi-story reinforced concrete structures.',
        reason: 'Vehicles create catastrophic traffic jams on narrow coastal causeways, trapping occupants.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'NEVER go to the shore to watch waves',
        description: 'Never walk onto exposed seafloor to collect fish or take selfies.',
        reason: 'Tsunami waves travel at jet-engine speeds (500+ km/h in deep water, 40+ km/h near shore); you cannot outrun it once seen.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Stay in safe elevated zone for at least 6 hours',
        description: 'Remain at high elevation until INCOIS / NDMA issues official cancellation notice.',
        reason: 'Wave reflections and basin oscillations keep bays dangerous for many hours after initial impact.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT return after the first wave recedes',
        description: 'Never walk back down to check boats or damaged coastal shops after wave 1.',
        reason: 'Subsequent wave surges are often much taller and carry crushed debris that acts as a battering ram.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Know Coastal Evacuation Signs & Safe High Ground Routes',
        items: [
          'Locate the blue-and-white Tsunami Evacuation Route signs in your coastal panchayat or ward.',
          'Identify sturdy 4+ story reinforced concrete structures designated as vertical evacuation towers.',
          'Practice walking the evacuation path with children and family at night.'
        ]
      },
      {
        phase: 'during',
        headline: 'Run Upward, Leave Belongings & Tune to INCOIS Bulletins',
        items: [
          'If in coastal waters on a boat: move into deep open water (> 100 meters depth). Tsunamis are harmless swells in deep sea.',
          'If on shore: drop all heavy gear and walk/run rapidly to minimum 30 meters elevation or 2-3 km inland.',
          'Help neighbors who are walking, but do not sacrifice evacuation speed for material goods.'
        ]
      },
      {
        phase: 'after',
        headline: 'Await Official All-Clear from INCOIS Coastal Network',
        items: [
          'Stay away from coastal debris piles; broken wood, rebar, and industrial drums pose hazard.',
          'Use text messaging or battery radio to check on relatives to conserve mobile network capacity.',
          'Avoid drinking open well water in coastal strips as saltwater intrusion and sewage contamination will be extreme.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Deep Sea Fishermen',
        action: 'If far out at sea (> 100m water depth), do NOT return to coastal harbor; stay in deep water until official all-clear is broadcast.',
        tip: 'In deep water, tsunami waves have heights under 1 meter and pass unnoticed under ship hulls.'
      },
      {
        situation: 'Trapped in Flat Coastal Plain with No Hills',
        action: 'Climb to 3rd floor or roof of a heavily built reinforced concrete public building (hotel, hospital, municipal office).',
        tip: 'Vertical evacuation into concrete frame buildings is the only survival option where high ground is too far to walk.'
      }
    ],
    evacuationTriggers: [
      'Ground shaking felt along coast lasting longer than 20 seconds.',
      'Ocean water suddenly receding dramatically below low-tide mark.',
      'Loud roaring sound from ocean resembling low-flying jet aircraft or freight train.',
      'Official INCOIS Tsunami Warning broadcast.'
    ],
    call112Advice: 'Call 112 from safe high ground only. Do not tie up phone lines while running for elevation.',
    kitHighlights: ['Life jacket / personal flotation vest', 'Waterproof survival whistle', 'Emergency IDs', 'Drinking water']
  },
  {
    id: 'heatwave',
    name: 'Severe Heat Wave',
    category: 'weather',
    shortTag: 'HYDRATE • SEEK SHADE • WATCH HEATSTROKE',
    tagline: 'Abnormally elevated ambient temperatures exceeding physiological thermal regulation thresholds.',
    color: '#ef4444',
    accentBg: 'bg-red-500/10 text-red-400',
    badgeBorder: 'border-red-500/30',
    source: 'National Disaster Management Authority (NDMA) & IMD National Heat Action Plan',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'May 2026',
    quickActionTitle: 'DRINK WATER ➔ REST IN COOL SHADE',
    quickActionSteps: [
      'DRINK water, ORS, or buttermilk frequently, even if not feeling thirsty.',
      'AVOID direct sun exposure between 11:00 AM and 4:00 PM.',
      'RECOGNIZE HEATSTROKE: High body temp, hot dry skin, confusion ➔ Call 112 immediately.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'CONTINUOUS HYDRATION',
        shortDesc: 'Water, ORS, coconut water.',
        explanation: 'Consume oral rehydration salts (ORS), lemon water, and electrolyte fluids. Avoid alcohol, caffeinated tea, and sugary carbonated sodas which dehydrate cells.',
        iconName: 'Droplets',
        illustrationType: 'heat-hydrate'
      },
      {
        step: '02',
        title: 'LIMIT PEAK SUN HOURS',
        shortDesc: 'Stay indoors 11 AM - 4 PM.',
        explanation: 'Schedule construction, farming, and sports in early mornings (before 9:30 AM) or late evenings after sunset.',
        iconName: 'Sun',
        illustrationType: 'heat-shade'
      },
      {
        step: '03',
        title: 'COOL HEATSTROKE VICTIM',
        shortDesc: 'Ice packs & wet cloth sponges.',
        explanation: 'Heatstroke is a medical emergency. Move person to shade, loosen clothing, apply cold water sponges to neck, armpits, and groin, and call 112.',
        iconName: 'HeartPulse',
        illustrationType: 'heat-coolvictim'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Wear light-colored, loose cotton clothing',
        description: 'Use white or light pastel breathable natural fabrics, umbrellas, and cotton hats.',
        reason: 'Facilitates evaporative cooling through sweat while reflecting solar radiant heat.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'NEVER leave children or pets in parked vehicles',
        description: 'Never leave anyone inside closed cars, even for 2 minutes with cracked windows.',
        reason: 'Greenhouse effect elevates vehicle cabin temperature past 50°C in 10 minutes, causing fatal brain swelling.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Check on elderly relatives and infants twice daily',
        description: 'Verify room ventilation and hydration status of seniors and young children.',
        reason: 'Elderly sweat glands are less responsive; they can overheat severely without realizing thermal distress.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT consume alcohol or heavy protein meals in peak heat',
        description: 'Avoid spirits, deep-fried snacks, and heavy meats during heat advisories.',
        reason: 'Increases metabolic heat production and accelerates diuretic dehydration.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Prepare Cool Living Spaces & Stock Electrolyte Packets',
        items: [
          'Hang wet khus curtains or dark bamboo blinds on south- and west-facing windows.',
          'Stock oral rehydration salts (ORS) packets, glucose, and fresh lemons in your pantry.',
          'Install reflective white paint or cooling lime wash on flat roof terraces to reduce indoor heat gain by 4-6°C.'
        ]
      },
      {
        phase: 'during',
        headline: 'Sip Fluids Constantly & Protect Outdoor Workers',
        items: [
          'Mandate shaded rest breaks every 45 minutes for delivery riders and outdoor laborers.',
          'Place damp towels over the back of neck and wrists to cool core blood temperature.',
          'Provide shallow clay water bowls for neighborhood birds and stray animals.'
        ]
      },
      {
        phase: 'after',
        headline: 'Rehabilitate Heat Exhaustion & Monitor Urine Color',
        items: [
          'Monitor hydration via urine color: clear pale yellow is healthy; dark amber indicates acute dehydration.',
          'Gradually re-acclimatize body to outdoor tasks over 5 to 7 days after recovering from heat illness.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Delivery Riders & Field Workers',
        action: 'Carry minimum 3 liters of water mixed with ORS. Rest in air-cooled metro stations, banks, or temple verandas during midday.',
        tip: 'Wear wet cotton cloth under helmet to prevent scalp heat buildup.'
      }
    ],
    evacuationTriggers: [
      'Person exhibiting confusion, slurred speech, seizures, or loss of consciousness in hot environment (Heatstroke).',
      'Body temperature exceeding 40°C (104°F) with ceased sweating and hot flushed skin.'
    ],
    call112Advice: 'Call 112 immediately for suspected heatstroke. While waiting for ambulance, immerse victim in cool water or aggressively sponge armpits and groin with ice.',
    kitHighlights: ['ORS (Oral Rehydration Salts) packets', 'Insulated water thermos (2L)', 'Cotton towel', 'Wide-brim hat / umbrella']
  },
  {
    id: 'chemical',
    name: 'Chemical & Gas Leak',
    category: 'hazardous',
    shortTag: 'MOVE UPWIND • SEAL ROOM • FOLLOW OFFICIALS',
    tagline: 'Accidental or industrial atmospheric release of toxic, corrosive, or flammable gases.',
    color: '#8b5cf6',
    accentBg: 'bg-purple-500/10 text-purple-400',
    badgeBorder: 'border-purple-500/30',
    source: 'NDMA Chemical Disaster Management Guidelines & Factories Inspectorate / NDRF CBRN',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'June 2026',
    quickActionTitle: 'MOVE UPWIND ➔ COVER BREATHING WITH WET CLOTH',
    quickActionSteps: [
      'MOVE UPWIND or perpendicular to wind direction away from visible vapor plume.',
      'COVER nose and mouth with a wet folded cloth or towel immediately.',
      'SHELTER IN PLACE inside an interior room; tape all windows and door gaps tightly.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'IDENTIFY WIND DIRECTION',
        shortDesc: 'Check flags, smoke, or trees.',
        explanation: 'Toxic gases drift with atmospheric wind. Look at tree tops or chimney smoke to determine wind direction, then run across (perpendicular) or against the wind.',
        iconName: 'Compass',
        illustrationType: 'chemical-wind'
      },
      {
        step: '02',
        title: 'FILTER WITH WET CLOTH',
        shortDesc: 'Fold wet towel over nose & mouth.',
        explanation: 'Water molecules absorb and dissolve many common toxic industrial vapors (such as ammonia, chlorine, and sulfur dioxide), providing crucial escape breathing time.',
        iconName: 'ShieldCheck',
        illustrationType: 'chemical-wetcloth'
      },
      {
        step: '03',
        title: 'SHELTER IN PLACE',
        shortDesc: 'Seal doors, windows & AC vents.',
        explanation: 'If evacuation is impossible: enter an above-ground room, shut all doors/windows, turn off air conditioners/exhaust fans, and tape gaps with duct tape.',
        iconName: 'Home',
        illustrationType: 'chemical-shelter'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Evacuate perpendicular to wind direction',
        description: 'Move at a 90-degree angle across the wind to exit the plume path quickly.',
        reason: 'Moving directly downwind keeps you inside the toxic cloud; moving perpendicular exits the dispersion envelope.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT shelter in basements or low pits',
        description: 'Never take refuge in underground cellars, drains, or low depressions during a chemical leak.',
        reason: 'Most industrial toxic gases (chlorine, LPG, phosgene) are heavier than air and settle into low-lying spaces.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Wash eyes and skin with clean water for 15 mins',
        description: 'If exposed to vapor, flush open eyes with copious clean water and remove contaminated clothing.',
        reason: 'Dilutes corrosive chemical residues and minimizes chemical burn injury to corneas.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT turn on vehicle ignition or light matches',
        description: 'Avoid starting car engines, flipping wall switches, or striking lighters near leak zone.',
        reason: 'Many hazardous industrial gases are highly flammable; an engine spark can ignite fuel-air vapor explosion.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Know Local Industrial Hazards & Store Duct Tape',
        items: [
          'Identify whether industrial plants, chemical warehouses, or rail freight yards are located within 5 km of home.',
          'Keep wide plastic sheeting and heavy-duty duct tape in your emergency cupboard for shelter-in-place sealing.',
          'Learn the sound of your municipal/industrial disaster siren.'
        ]
      },
      {
        phase: 'during',
        headline: 'Cover Breathing Passages & Follow Civil Defense Alerts',
        items: [
          'Cover nose and mouth with wet multi-layered cotton cloth immediately.',
          'Turn off all split air-conditioners, kitchen exhausts, and window fans.',
          'Tune to local district collector announcements on phone or radio for designated evacuation reception centers.'
        ]
      },
      {
        phase: 'after',
        headline: 'Aerate Living Spaces Only After Official All-Clear',
        items: [
          'Do not unseal doors or open windows until district fire and Hazmat teams officially broadcast safety.',
          'Remove outer clothing before entering living quarters and bag contaminated garments in sealed plastic.',
          'Seek medical examination if experiencing throat burning, persistent coughing, or blurred vision.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Driving Near Industrial Leak',
        action: 'Roll up car windows, shut off ventilation (set AC to internal re-circulation only), and drive perpendicular to visible plume.',
        tip: 'Do not park on low highway underpasses where heavy gases accumulate.'
      }
    ],
    evacuationTriggers: [
      'Unusual chemical odor resembling rotten eggs, bleach, sweet fruit, or pungent ammonia causing eye irritation.',
      'Visible dense colored vapor plume (yellow-green chlorine, reddish-brown nitrogen oxides).',
      'Continuous factory emergency siren sounding.'
    ],
    call112Advice: 'Call 112. Report the chemical name or UN number from truck placard if visible. State wind direction and your location.',
    kitHighlights: ['Heavy-duty duct tape', 'Plastic drop-sheet roll', 'Cotton towels', 'Bottled sterile eye wash']
  },
  {
    id: 'wildfire',
    name: 'Wildfire & Forest Fire',
    category: 'fire',
    shortTag: 'EVACUATE EARLY • DRESS IN WOOL/COTTON • CLOSE VENTS',
    tagline: 'Uncontrolled vegetation fire advancing rapidly through forests, brush, and rural-urban interfaces.',
    color: '#ea580c',
    accentBg: 'bg-orange-600/10 text-orange-500',
    badgeBorder: 'border-orange-600/30',
    source: 'Forest Survey of India (FSI) & NDMA Forest Fire Guidelines',
    sourceUrl: 'https://fsi.nic.in',
    lastReviewed: 'May 2026',
    quickActionTitle: 'EVACUATE ALONG DESIGNATED CLEAR ROUTES',
    quickActionSteps: [
      'EVACUATE early before smoke reduces visibility to zero.',
      'WEAR long cotton or wool clothing; avoid synthetic nylon/polyester fabrics.',
      'CLOSE all home windows, doors, and roof attic vents to block flying embers.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'EARLY EVACUATION',
        shortDesc: 'Leave before roads are blocked.',
        explanation: 'Wildfires move rapidly with wind gusts. Evacuate family, pets, and emergency documents as soon as evacuation alerts are issued.',
        iconName: 'Truck',
        illustrationType: 'wildfire-evacuate'
      },
      {
        step: '02',
        title: 'DRESS IN NATURAL FIBERS',
        shortDesc: '100% cotton or wool only.',
        explanation: 'Synthetics (nylon, polyester) melt onto human skin when exposed to intense radiant heat. Wear heavy denim, cotton shirt, leather boots, and goggles.',
        iconName: 'Shield',
        illustrationType: 'wildfire-dress'
      },
      {
        step: '03',
        title: 'SEAL STRUCTURE FROM EMBERS',
        shortDesc: 'Shut vents & remove dry brush.',
        explanation: 'Over 90% of homes destroyed in wildfires ignite from wind-blown embers entering roof vents and dry leaves, not direct flame fronts.',
        iconName: 'Home',
        illustrationType: 'wildfire-seal'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Drive with headlights on & AC on recirculation',
        description: 'Keep vehicle headlights on low beam, hazard flashers on, and drive at moderate speed.',
        reason: 'Dense smoke reduces visibility to under 5 meters; headlights alert oncoming fire engine convoys.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT run uphill to escape a wildfire',
        description: 'Never run uphill away from an approaching fire front on a slope.',
        reason: 'Fire travels uphill substantially faster than downhill because rising heat pre-heats upward vegetation.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Clear dry pine needles and leaves 10m from walls',
        description: 'Create a 10-meter defensible perimeter around your home by clearing dry brush.',
        reason: 'Deprives ground fires of fuel within contact distance of wooden eaves and window frames.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT leave garden sprinklers running on roof when leaving',
        description: 'Do not leave hoses running when you evacuate.',
        reason: 'Drains municipal water reserves and drops water pressure needed by responding fire engines.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Create Defensible Space & Clean Roof Gutters',
        items: [
          'Maintain a 10-meter defensible fuel-free zone around house perimeter.',
          'Rake dry pine needles and leaves off roof tiles and rain gutters regularly.',
          'Install fine 1/8-inch metal mesh screening over all attic and chimney vents.'
        ]
      },
      {
        phase: 'during',
        headline: 'Load Vehicle & Evacuate Promptly via Main Highways',
        items: [
          'Back vehicle into driveway with doors unlocked and key in ignition for instant exit.',
          'Close all interior and exterior doors inside house to slow fire propagation.',
          'Follow police/forest department detour signs; do not take unpaved forest shortcut trails.'
        ]
      },
      {
        phase: 'after',
        headline: 'Inspect Roof for Smoldering Embers & Wear N95 Mask',
        items: [
          'Check roof edges, attic spaces, and timber verandas for lingering hidden sparks for 24 hours.',
          'Wear N95 particulate respirators when returning; wildfire ash contains silica, heavy metals, and carcinogenic particulates.',
          'Discard food that was subjected to intense heat and smoke odors.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Trapped by Fire on Road',
        action: 'Stay inside vehicle. Park in clear area away from heavy brush. Roll up windows, shut vents, lie on floor below window level with blanket over body until main firefront passes.',
        tip: 'Vehicle cabin provides thermal protection from short radiant heat blasts; running outside on foot results in fatal burns.'
      }
    ],
    evacuationTriggers: [
      'Official forest department evacuation order.',
      'Visible towering smoke column or glowing red embers landing on property.',
      'Wind shifting fire front directly toward your ridge.'
    ],
    call112Advice: 'Call 112 / Forest Fire Helpline. Specify nearest landmark, ridge name, and whether livestock are trapped.',
    kitHighlights: ['N95 particulate respirator masks', 'Goggles (unvented)', 'Leather work gloves', 'Emergency blanket']
  },
  {
    id: 'urbanflood',
    name: 'Urban & Flash Flood',
    category: 'weather',
    shortTag: 'AVOID UNDERPASSES • WATCH OPEN MANHOLES',
    tagline: 'Sudden high-velocity urban inundation overwhelming concrete storm-water drainage channels.',
    color: '#0ea5e9',
    accentBg: 'bg-sky-600/10 text-sky-500',
    badgeBorder: 'border-sky-600/30',
    source: 'National Disaster Management Authority (NDMA) & Municipal Corporation Flood SOP',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'July 2026',
    quickActionTitle: 'NEVER ENTER FLOODED UNDERPASSES',
    quickActionSteps: [
      'NEVER enter a submerged road underpass or basement parking garage.',
      'USE A STICK to test footing on waterlogged streets to detect open missing manholes.',
      'MOVE to upper floors of sturdy multi-story buildings if street water rises rapidly.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'AVOID UNDERPASSES',
        shortDesc: 'Underpasses fill in 5 minutes.',
        explanation: 'Urban road underpasses trap vehicles in 3+ meters of runoff within minutes. Turn around, never proceed.',
        iconName: 'AlertTriangle',
        illustrationType: 'urbanflood-underpass'
      },
      {
        step: '02',
        title: 'WATCH OPEN MANHOLES',
        shortDesc: 'Water pressure pops lids.',
        explanation: 'Storm water backpressure pushes heavy cast-iron manhole lids off street sewer chambers, creating invisible suction death traps beneath muddy water.',
        iconName: 'Eye',
        illustrationType: 'urbanflood-manhole'
      },
      {
        step: '03',
        title: 'EVACUATE BASEMENT PARKING',
        shortDesc: 'Do not try to save cars.',
        explanation: 'Basement ramps act as spillways. Automated gates fail on power cut, trapping residents trying to retrieve vehicles.',
        iconName: 'ShieldAlert',
        illustrationType: 'urbanflood-basement'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Use a walking stick to probe flooded street footing',
        description: 'If you must walk through shallow street water, probe the pavement ahead with a sturdy umbrella or wooden staff.',
        reason: 'Detects missing drain covers, submerged kerb drops, and severed electrical cables before you step.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT attempt to save vehicles from basement parking',
        description: 'Never rush into apartment cellars when street runoff begins cascading down ramps.',
        reason: 'Ramps flood to ceiling in under 8 minutes; elevator lobbies and stair doors jam from water head pressure.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Stay on elevated footbridges & high pavements',
        description: 'Remain on elevated pedestrian infrastructure until city storm drains clear the surge.',
        reason: 'Flash urban floods typically subside within 2 to 4 hours once peak cloudburst intensity eases.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT touch electrical street transformer poles',
        description: 'Keep minimum 5 meters away from roadside electric distribution boxes and junction pillars.',
        reason: 'Waterlogged junction boxes leak lethal electric currents directly into the surrounding water sheet.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Clear Apartment Sump Pits & Check Rain Deflection Walls',
        items: [
          'Inspect basement sump pump operational status and ensure backup diesel generator circuit is tested.',
          'Install flood barriers or sandbag retainers across basement entrance ramps before monsoon.',
          'Identify safe upper floor rooms in office complexes and housing societies.'
        ]
      },
      {
        phase: 'during',
        headline: 'Avoid Basements, Disconnect Inverters & Stay Put',
        items: [
          'Do not drive during torrential cloudbursts (> 50 mm/hour); park on elevated flyover ramps if safe.',
          'Disconnect ground-floor home inverters and refrigerators before water enters living room sockets.',
          'Help ground-floor residents relocate to upper floors.'
        ]
      },
      {
        phase: 'after',
        headline: 'Check for Leptospirosis & Sanitise Water Tanks',
        items: [
          'Wash legs with soap and antiseptic water immediately after wading in street water to prevent leptospirosis infection.',
          'Pump out and chlorine-bleach underground domestic drinking water sumps before refilling from municipal lines.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Two-Wheeler Commuter',
        action: 'Park motorcycle on elevated pavement or flyover shoulder. Walk safely to a shopping mall or concrete commercial building.',
        tip: 'Never ride through moving water; two-wheeler tires lose traction in just 4 inches of current.'
      }
    ],
    evacuationTriggers: [
      'Water entering building ground floor at rate > 5 cm every 10 minutes.',
      'Underpass water level gauge crossing yellow indicator mark.'
    ],
    call112Advice: 'Call 112 if people are trapped inside stranded cars or basement parking elevators. State vehicle registration number.',
    kitHighlights: ['High-visibility neon rain poncho', 'Waterproof phone case', 'Sturdy walking stick', 'Emergency torch']
  },
  {
    id: 'biological',
    name: 'Biological & Health Emergency',
    category: 'hazardous',
    shortTag: 'HYGIENE • DISTANCING • VERIFIED MEDICAL CARE',
    tagline: 'Outbreak of contagious viral or bacterial pathogen requiring community containment and personal protection.',
    color: '#14b8a6',
    accentBg: 'bg-teal-500/10 text-teal-400',
    badgeBorder: 'border-teal-500/30',
    source: 'World Health Organization (WHO) & Ministry of Health and Family Welfare (MoHFW)',
    sourceUrl: 'https://mohfw.gov.in',
    lastReviewed: 'July 2026',
    quickActionTitle: 'PROTECT AIRWAYS ➔ WASH HANDS ➔ ISOLATE',
    quickActionSteps: [
      'WEAR certified filtration mask (N95) in crowded indoor health settings.',
      'WASH hands with soap and water for 20 seconds or use 70% alcohol hand rub.',
      'ISOLATE from vulnerable family members if exhibiting fever, cough, or rash.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'PROPER MASK FIT',
        shortDesc: 'Seal over nose & chin.',
        explanation: 'Ensure mask forms an airtight seal over nose bridge and mouth. No air should escape from cheeks.',
        iconName: 'Shield',
        illustrationType: 'bio-mask'
      },
      {
        step: '02',
        title: '20-SECOND HAND WASH',
        shortDesc: 'Clean between fingers & palms.',
        explanation: 'Soap molecules disrupt lipid viral envelopes within 20 seconds of vigorous lathering.',
        iconName: 'Droplets',
        illustrationType: 'bio-handwash'
      },
      {
        step: '03',
        title: 'HOME ISOLATION',
        shortDesc: 'Ventilated separate room.',
        explanation: 'Isolate symptomatic persons in an open-window room with dedicated bathroom to prevent family transmission.',
        iconName: 'Home',
        illustrationType: 'bio-isolate'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Follow official MoHFW / ICMR clinical bulletins',
        description: 'Rely solely on verified health ministry guidance and authorized primary healthcare centers.',
        reason: 'Social media medical rumors and untested home remedies delay life-saving clinical interventions.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT self-medicate with unprescribed antibiotics',
        description: 'Never consume antibiotics or steroids without a licensed physician\'s prescription.',
        reason: 'Antibiotics do not kill viruses and improper steroid use causes severe immune suppression.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Maintain cross-ventilation in shared living spaces',
        description: 'Keep opposite windows cracked open to ensure constant air exchange.',
        reason: 'Dilutes aerosol viral concentrations significantly, reducing infectious dose risks.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT conceal contagious symptoms in public',
        description: 'Do not travel on public buses or attend office gatherings when feverish.',
        reason: 'Accelerates epidemic spread and endangers immunocompromised community members.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Maintain Immunization Schedule & Stock Basic PPE',
        items: [
          'Keep family vaccinations up to date as recommended by national health authorities.',
          'Stock 2-week supply of essential chronic illness medications (insulin, BP tablets, inhalers).',
          'Keep digital thermometer and pulse oximeter in your home medicine cabinet.'
        ]
      },
      {
        phase: 'during',
        headline: 'Monitor Oxygen Saturation & Follow Teleconsultations',
        items: [
          'Check SpO2 with pulse oximeter twice daily; seek immediate hospital triage if SpO2 drops below 94%.',
          'Utilize government tele-consultation portals (eSanjeevani) before crowding emergency hospital OPDs.',
          'Disinfect high-touch door handles, mobile phones, and taps with sanitizing wipes.'
        ]
      },
      {
        phase: 'after',
        headline: 'Complete Quarantine & Safe Clinical Disposal',
        items: [
          'Complete full clinical recovery quarantine before returning to work or school.',
          'Double-bag used PPE, masks, and rapid antigen test kits before disposing into municipal biomedical bins.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Caregiver for Infected Patient',
        action: 'Wear N95 mask and disposable gloves when entering patient room. Wash hands immediately after exiting. Maintain continuous cross-ventilation.',
        tip: 'Never share eating utensils, towels, or bedding with an actively infected person.'
      }
    ],
    evacuationTriggers: [
      'Oxygen saturation (SpO2) dropping below 93% or persistent blue tint on lips/face.',
      'Difficulty breathing, persistent chest pain, or confusion/lethargy.'
    ],
    call112Advice: 'Call 112 / 108 for advanced life support ambulance with oxygen support. Inform dispatcher of suspected infection.',
    kitHighlights: ['Pulse oximeter', 'Digital thermometer', 'N95 respirator masks (pack of 10)', 'ORS & paracetamol']
  },
  {
    id: 'collapse',
    name: 'Building & Structural Collapse',
    category: 'geological',
    shortTag: 'SURVIVAL VOID • COVER HEAD • TAP TO SIGNAL',
    tagline: 'Sudden catastrophic structural failure of multi-story concrete, brick, or bridge infrastructure.',
    color: '#e11d48',
    accentBg: 'bg-rose-600/10 text-rose-500',
    badgeBorder: 'border-rose-600/30',
    source: 'National Disaster Response Force (NDRF) Urban Search & Rescue (USAR) Doctrine',
    sourceUrl: 'https://ndrf.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'SHIELD HEAD ➔ LOCATE VOID ➔ TAP ON PIPES',
    quickActionSteps: [
      'SHIELD your head and neck immediately beside heavy solid furniture (survival void).',
      'IF TRAPPED: Cover face with cloth to filter concrete dust.',
      'TAP ON PIPES OR WALLS with metal objects at regular intervals. DO NOT shout continuously.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'LOCATE SURVIVAL VOID',
        shortDesc: 'Drop beside heavy furniture.',
        explanation: 'When floor slabs pancake, solid objects (heavy desks, bathtubs, refrigerators) crush partially, creating survivable triangular void spaces beside them.',
        iconName: 'Shield',
        illustrationType: 'collapse-void'
      },
      {
        step: '02',
        title: 'FILTER DUST',
        shortDesc: 'Breathe through cotton cloth.',
        explanation: 'Concrete silica dust causes acute suffocation. Pull shirt or cloth over mouth and nose and take slow shallow breaths.',
        iconName: 'AlertTriangle',
        illustrationType: 'collapse-dust'
      },
      {
        step: '03',
        title: 'TAP RHYTHMICALLY',
        shortDesc: 'Tap metal pipes (3 taps, pause).',
        explanation: 'Rescuers use acoustic listening sensors. Metal pipe taps carry through concrete far better than human voice, while shouting depletes oxygen and inhales toxic dust.',
        iconName: 'Volume2',
        illustrationType: 'collapse-tap'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Create rhythmic tapping sound on metal pipes',
        description: 'Use a coin, stone, or metal belt buckle to tap pipes in patterns of three (SOS rhythm).',
        reason: 'Acoustic seismic geophones used by NDRF pick up structural vibrations over 50 meters away.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT shout continuously',
        description: 'Shout only when you distinctly hear rescue teams operating directly overhead.',
        reason: 'Continuous shouting causes physical exhaustion, rapid dehydration, and inhalation of deadly silica dust.',
        iconName: 'X'
      },
      {
        type: 'dont',
        title: 'Do NOT light matches or lighters',
        description: 'Never ignite open flames inside collapsed rubble.',
        reason: 'Consumes precious confined oxygen and risks igniting broken gas pipeline leaks.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Keep moving toes and fingers gently',
        description: 'Flex extremities periodically to maintain circulation if limbs are not pinned.',
        reason: 'Prevents blood pooling and reduces severity of crush injury syndrome.',
        iconName: 'Check'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Report Structural Distress & Identify Exit Stairs',
        items: [
          'Report deep diagonal cracks in building columns, peeling concrete with exposed rusted rebar, or sagging balconies to municipal engineers.',
          'Never remove or alter load-bearing ground floor pillars during commercial interior renovations.',
          'Keep whistles and flashlights accessible in bedside nightstands.'
        ]
      },
      {
        phase: 'during',
        headline: 'Drop Next to Solid Objects & Protect Head',
        items: [
          'If collapse begins: drop beside a solid bed, heavy sofa, or in bathroom tub; protect head with pillow.',
          'If trapped: remain calm and still. Conserve energy and control breathing.',
          'Listen for the silence periods when search teams turn off heavy generators to perform acoustic listening.'
        ]
      },
      {
        phase: 'after',
        headline: 'Signal Responders During Silent Listening Breaks',
        items: [
          'Tap loudly during scheduled 15-minute search silent breaks.',
          'Once extricated, seek immediate medical evaluation for internal crush syndrome even if feeling unhurt.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Limbs Pinned Under Heavy Slab',
        action: 'Do not attempt to yank trapped limb violently. Keep calm, protect head, and tap nearby pipe. Inform rescuers of pinned location.',
        tip: 'Sudden release of heavily compressed limbs after 4+ hours requires medical tourniquet prep to prevent toxic toxin wash into bloodstream.'
      }
    ],
    evacuationTriggers: [
      'Sound of loud structural cracking or snapping rebar inside walls.',
      'Plaster and concrete chunks falling from ceiling beams.',
      'Doors and windows suddenly binding and refusing to open due to framing tilt.'
    ],
    call112Advice: 'Dial 112 immediately. Inform that heavy search and rescue (NDRF / Fire USAR) with hydraulic spreaders and acoustic search cameras is required.',
    kitHighlights: ['High-decibel survival whistle', 'N95 dust mask', 'Pocket LED torch with strobe', 'Heavy leather gloves']
  },
  {
    id: 'roadaccident',
    name: 'Road & Highway Mass Accident',
    category: 'hazardous',
    shortTag: 'DISTANCE • HAZARD LIGHTS • CALL 112 • NO UNSAFE MOVES',
    tagline: 'High-speed vehicular collision on expressway or urban corridor involving multiple vehicles and casualties.',
    color: '#64748b',
    accentBg: 'bg-slate-500/10 text-slate-400',
    badgeBorder: 'border-slate-500/30',
    source: 'Ministry of Road Transport and Highways (MoRTH) & Good Samaritan Guidelines / WHO',
    sourceUrl: 'https://morth.nic.in',
    lastReviewed: 'June 2026',
    quickActionTitle: 'PROTECT SCENE ➔ CALL 112 ➔ CONTROL BLEEDING',
    quickActionSteps: [
      'PARK at a safe distance with hazard lights on. Put up warning triangle 50m behind scene.',
      'CALL 112 IMMEDIATELY with exact highway kilometer stone or GPS pin.',
      'DO NOT pull unconscious victims from vehicles unless there is active fire danger (spinal injury risk).'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'SECURE CRASH SCENE',
        shortDesc: 'Place warning triangle 50m back.',
        explanation: 'Secondary pile-up collisions on highways kill more rescuers than the primary crash. Position warning flares or reflective triangles well ahead of the wreck.',
        iconName: 'AlertTriangle',
        illustrationType: 'accident-triangle'
      },
      {
        step: '02',
        title: 'CALL 112 WITH LOCATION',
        shortDesc: 'Cite highway KM stone marker.',
        explanation: 'State highway name (e.g. NH-44), direction of travel, nearest toll plaza or milestone marker, and number of trapped casualties.',
        iconName: 'Phone',
        illustrationType: 'accident-call'
      },
      {
        step: '03',
        title: 'IMMOBILIZE SPINE',
        shortDesc: 'Do not yank victims out.',
        explanation: 'Roughly dragging crash victims causes permanent paralysis from severed spinal cord. Stabilize head and neck in neutral position until EMTs arrive with cervical collars.',
        iconName: 'Shield',
        illustrationType: 'accident-spine'
      },
      {
        step: '04',
        title: 'DIRECT PRESSURE BLEEDING',
        shortDesc: 'Firm pressure with clean cloth.',
        explanation: 'Apply firm, continuous direct pressure on severe arterial bleeding using clean cloth. Most preventable highway deaths stem from blood loss within 10 minutes.',
        iconName: 'HeartPulse',
        illustrationType: 'accident-bleed'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Turn off vehicle ignitions on wrecked cars',
        description: 'Reach inside and switch off ignition key to eliminate electrical spark fire hazard.',
        reason: 'Ruptured fuel tanks and hot exhaust pipes cause rapid post-crash fires if electrical circuits remain live.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT move injured victims unless car is on fire',
        description: 'Never yank or pull unconscious passengers out by their arms or legs.',
        reason: 'Cervical spine fractures turn into quadriplegia if the neck bends during amateur extrication.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Remember: Good Samaritans are legally protected in India',
        description: 'Under Supreme Court Good Samaritan guidelines, helpers are protected from police harassment and civil liability.',
        reason: 'Citizens can assist trauma victims without fear of hospital detention or police questioning.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT offer water to unconscious victims',
        description: 'Never pour water into the mouth of an unconscious or dazed trauma victim.',
        reason: 'Liquid enters the trachea and lungs, causing instantaneous fatal choking and airway obstruction.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Wear Seatbelts, Helmets & Keep Reflective Vest in Car',
        items: [
          'Mandate seatbelt usage for all rear-seat passengers as well as front-seat occupants.',
          'Keep an ISI-certified reflective emergency breakdown triangle and first-aid kit inside car trunk.',
          'Install dashcams to provide objective collision evidence for police and insurance.'
        ]
      },
      {
        phase: 'during',
        headline: 'Maintain Scene Safety & Clear Emergency Vehicle Lane',
        items: [
          'Keep onlookers off expressway carriageways; gather safely on outer grass shoulder behind crash barrier.',
          'Keep clear lane on left shoulder for incoming 108/112 ambulance arrival.',
          'Speak calmly to conscious victims and assure them that professional emergency teams are en route.'
        ]
      },
      {
        phase: 'after',
        headline: 'Assist Investigating Officers & Document Damage',
        items: [
          'Provide clear factual account to responding highway patrol officers.',
          'Exchange insurance and registration details with other parties involved without engaging in physical confrontations.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Hazardous Chemical Tanker Crash',
        action: 'Look for orange diamond HAZCHEM placard on tanker rear. If leaking, evacuate upwind minimum 500 meters. Do not approach.',
        tip: 'Inform 112 dispatcher of the 4-digit UN chemical number printed on the tanker diamond placard.'
      }
    ],
    evacuationTriggers: [
      'Vehicle engine bay smoking with active flame rollout.',
      'Smell of heavy petrol/diesel pooling around passenger cabin.'
    ],
    call112Advice: 'Dial 112 immediately. State: Highway name, KM stone, direction, number of vehicles, and trapped casualty count.',
    kitHighlights: ['Reflective breakdown triangle', 'Sterile trauma pressure dressings', 'Seatbelt cutter & window punch tool', 'Latex gloves']
  },
  {
    id: 'multidisaster',
    name: 'Multi-Hazard Cascading Crisis',
    category: 'complex',
    shortTag: 'ASSESS CASCADING RISKS • SELF-PROTECTION FIRST',
    tagline: 'Simultaneous overlapping hazards (e.g. Cyclone + Flooding + Grid Collapse + Chemical Leak).',
    color: '#ec4899',
    accentBg: 'bg-pink-500/10 text-pink-400',
    badgeBorder: 'border-pink-500/30',
    source: 'NDMA National Multi-Hazard Disaster Management Framework & UN-DRR',
    sourceUrl: 'https://ndma.gov.in',
    lastReviewed: 'August 2026',
    quickActionTitle: 'PROTECT YOURSELF ➔ TRIAGE THREATS ➔ AWAIT C2',
    quickActionSteps: [
      'IDENTIFY THE IMMEDIATE LETHAL THREAT (e.g. fire/collapse takes precedence over rising water).',
      'PROTECT YOUR OWN PHYSICAL SAFETY FIRST before attempting to assist others.',
      'ESTABLISH SECURE SHELTER with independent power and emergency supplies.'
    ],
    visualSequence: [
      {
        step: '01',
        title: 'THREAT TRIAGE',
        shortDesc: 'Solve immediate life threat first.',
        explanation: 'When multiple disasters strike simultaneously: prioritize structural collapse & fire first, then water inundation, then exposure/supply rationing.',
        iconName: 'Layers',
        illustrationType: 'multi-triage'
      },
      {
        step: '02',
        title: 'SECURE INDEPENDENT POWER',
        shortDesc: 'Rely on power banks & battery radio.',
        explanation: 'During multi-disasters, electrical grid, water mains, and mobile networks collapse simultaneously. Protect your own power and potable water reserves.',
        iconName: 'Zap',
        illustrationType: 'multi-power'
      },
      {
        step: '03',
        title: 'CONNECT TO RESQAI / 112',
        shortDesc: 'Broadcast distress packet.',
        explanation: 'Send 1-tap SOS telemetry via ResQAI or call 112 once in safe position. State all active hazards concisely.',
        iconName: 'Radio',
        illustrationType: 'multi-c2'
      }
    ],
    doDonts: [
      {
        type: 'do',
        title: 'Prioritize physical survival over property protection',
        description: 'Abandon cars, appliances, and retail stock to ensure life safety of family and dependents.',
        reason: 'Compounding secondary disasters accelerate fatality rates exponentially when occupants linger.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT act as an untrained lone rescuer in hazardous zones',
        description: 'Never enter burning debris or fast flood current without specialized gear.',
        reason: 'Unprepared rescuers become secondary casualties, doubling the operational burden on emergency services.',
        iconName: 'X'
      },
      {
        type: 'do',
        title: 'Maintain community contact with offline mesh',
        description: 'Use local peer-to-peer walkie-talkies or ResQAI local mesh sync when telecommunication towers fail.',
        reason: 'Prevents isolation panic and allows coordinated community resource sharing.',
        iconName: 'Check'
      },
      {
        type: 'dont',
        title: 'Do NOT forward unverified WhatsApp panic rumors',
        description: 'Never broadcast unconfirmed bridge collapse or dam burst rumors on messaging apps.',
        reason: 'Triggers public panic stampedes and clogs evacuation corridors needed by emergency responders.',
        iconName: 'X'
      }
    ],
    phases: [
      {
        phase: 'before',
        headline: 'Build a Multi-Hazard Ready Family Plan & Redundant Supplies',
        items: [
          'Prepare for the worst-case combination: power outage + water outage + severed roads.',
          'Keep 7 days of non-perishable food, water, and essential medicines.',
          'Establish an out-of-state emergency family contact who lives outside your disaster zone.'
        ]
      },
      {
        phase: 'during',
        headline: 'Maintain Calm Discipline & Follow District EOC Orders',
        items: [
          'Listen to unified emergency operations center (EOC) directives broadcast over All India Radio.',
          'Check structural integrity of shelter before settling in for multi-day confinement.',
          'Conserve phone battery: switch device to ultra-battery saver mode and communicate via short SMS.'
        ]
      },
      {
        phase: 'after',
        headline: 'Coordinate Community Mutual Aid & Systematic Rebuilding',
        items: [
          'Organize neighborhood assistance for vulnerable seniors and children.',
          'Pool resources (water purification, dry food, first aid) with verified local disaster volunteers.',
          'Log all damage details securely into ResQAI platform for verified relief assistance.'
        ]
      }
    ],
    specialSituations: [
      {
        situation: 'Grid & Cellular Outage Simultaneous',
        action: 'Rely on All India Radio AM/FM emergency broadcasts. Send SMS rather than voice calls; SMS packets travel on control channels even when voice circuits are congested.',
        tip: 'Keep phones in airplane mode except for 5-minute periodic check-in windows.'
      }
    ],
    evacuationTriggers: [
      'Secondary hazard (fire or chemical plume) approaching flood-stranded building.',
      'Direct order from State Emergency Operations Center (SEOC).'
    ],
    call112Advice: 'Call 112. Be concise: provide GPS coordinates, list of overlapping hazards (e.g. fire + flood), and total number of trapped persons.',
    kitHighlights: ['Solar power bank with hand crank', 'Water filtration straw', 'Comprehensive trauma kit', 'Multi-tool & rope']
  }
];

// Interactive "What Would You Do?" Quiz Scenarios
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-eq-1',
    disasterId: 'earthquake',
    scenario: 'You are on the 4th floor of a concrete office building. Suddenly the floor begins to violently shake and books tumble from shelves.',
    question: 'What should be your IMMEDIATE first action?',
    options: [
      {
        id: 'a',
        text: 'Sprint down the staircase toward the front street exit',
        isCorrect: false,
        explanation: 'Dangerous: Running during shaking causes severe falls, and falling glass/masonry concentrates at building exit doorways.'
      },
      {
        id: 'b',
        text: 'Stand beneath the nearest office doorway arch',
        isCorrect: false,
        explanation: 'Outdated myth: In modern buildings, doorways are not reinforced and swinging doors can crush your fingers and face.'
      },
      {
        id: 'c',
        text: 'Drop onto hands and knees, cover head/neck under a sturdy desk, and hold on',
        isCorrect: true,
        explanation: 'Correct! Drop, Cover, and Hold On shields you from falling lighting, ceiling tiles, and flying glass.'
      },
      {
        id: 'd',
        text: 'Rush to the elevator lobby to descend quickly',
        isCorrect: false,
        explanation: 'Extremely dangerous: Elevators lose power and shaft rails warp, trapping occupants inside.'
      }
    ]
  },
  {
    id: 'q-fl-1',
    disasterId: 'flood',
    scenario: 'You are driving home during a heavy storm and encounter a section of road covered by murky floodwater that appears about 8-10 inches deep.',
    question: 'What is the safest action to take with your vehicle?',
    options: [
      {
        id: 'a',
        text: 'Accelerate in low gear to push through before the water rises further',
        isCorrect: false,
        explanation: 'Hazardous: Water hides washed-out asphalt, open manholes, and just 12 inches of moving water floats most cars.'
      },
      {
        id: 'b',
        text: 'Turn around safely and find an alternate high-ground route',
        isCorrect: true,
        explanation: 'Correct! "Turn Around, Don\'t Drown". Over 60% of flood deaths occur in stalled or swept vehicles.'
      },
      {
        id: 'c',
        text: 'Follow closely behind a heavy bus crossing the water',
        isCorrect: false,
        explanation: 'Dangerous: The heavy vehicle creates wakes that flood lower car intake manifolds, stalling your engine immediately.'
      },
      {
        id: 'd',
        text: 'Park right at the edge of the water and wait in the car with engine running',
        isCorrect: false,
        explanation: 'Unsafe: Flash waters rise rapidly and can trap or submerge your parked car within minutes.'
      }
    ]
  },
  {
    id: 'q-fr-1',
    disasterId: 'fire',
    scenario: 'You awake to smell smoke in your hallway. The closed bedroom door handle feels hot to the touch with the back of your hand.',
    question: 'What is your safest immediate response?',
    options: [
      {
        id: 'a',
        text: 'Yank the door open quickly to see where the fire is',
        isCorrect: false,
        explanation: 'Fatal risk: Opening a hot door feeds fresh oxygen into the fire, triggering a superheated backdraft explosion.'
      },
      {
        id: 'b',
        text: 'Keep door closed, seal gaps with wet cloth/bedsheets, and signal from window',
        isCorrect: true,
        explanation: 'Correct! Keeping the door shut buys up to 20 minutes of survival time while fire crews arrive.'
      },
      {
        id: 'c',
        text: 'Break the bedroom window completely and jump from the 3rd floor',
        isCorrect: false,
        explanation: 'High trauma risk: Jumping from 3rd floor causes severe spinal/pelvic fractures. Signal from window instead.'
      },
      {
        id: 'd',
        text: 'Pack your laptop and important jewelry in a backpack first',
        isCorrect: false,
        explanation: 'Never delay for belongings: Toxic smoke containing cyanide and carbon monoxide causes unconsciousness in under 2 minutes.'
      }
    ]
  },
  {
    id: 'q-lt-1',
    disasterId: 'lightning',
    scenario: 'You are playing cricket in an open park when the sky turns dark and you hear a loud rumble of thunder nearby.',
    question: 'Where is the safest place to seek shelter?',
    options: [
      {
        id: 'a',
        text: 'Under a large leafy banyan tree in the center of the park',
        isCorrect: false,
        explanation: 'Deadly: Tall isolated trees attract strikes; side-flash current jumps from the trunk directly into nearby people.'
      },
      {
        id: 'b',
        text: 'Inside an open tin-roof spectator shed with metal pillars',
        isCorrect: false,
        explanation: 'Unsafe: Open sheds lack enclosed walls and electrical grounding; lightning jumps across occupants.'
      },
      {
        id: 'c',
        text: 'Inside a nearby concrete building with closed doors and windows',
        isCorrect: true,
        explanation: 'Correct! A substantial building with plumbing and grounded wiring conducts lightning safely away.'
      },
      {
        id: 'd',
        text: 'Lie flat on the wet grass field with arms spread out',
        isCorrect: false,
        explanation: 'Dangerous: Lying flat maximizes surface contact with deadly ground currents traveling through wet soil.'
      }
    ]
  },
  {
    id: 'q-ts-1',
    disasterId: 'tsunami',
    scenario: 'You are vacationing at a beach. Following a strong earthquake, you notice the sea rapidly receding hundreds of meters, leaving stranded fish on dry sand.',
    question: 'What must you do IMMEDIATELY?',
    options: [
      {
        id: 'a',
        text: 'Walk onto the exposed seabed to collect stranded fish and take photos',
        isCorrect: false,
        explanation: 'Fatal: The receding tide is the trough of a tsunami wave. The crest strikes at 40+ km/h within minutes.'
      },
      {
        id: 'b',
        text: 'Run inland toward high ground (minimum 30m elevation) immediately',
        isCorrect: true,
        explanation: 'Correct! A rapidly receding sea is nature\'s unmistakable warning. Run inland and upward without delay.'
      },
      {
        id: 'c',
        text: 'Wait for the official beach lifeguard loudspeaker announcement',
        isCorrect: false,
        explanation: 'Dangerous delay: Natural warning signs take precedence over delayed electronic broadcasts.'
      },
      {
        id: 'd',
        text: 'Get inside your car in the beachfront parking lot and turn on the radio',
        isCorrect: false,
        explanation: 'Fatal trap: Beachfront car parks are instantly submerged by surging wave walls and floating debris.'
      }
    ]
  }
];

// Emergency Kit Checklist Items
export interface EmergencyKitItem {
  id: string;
  name: string;
  category: 'hydration' | 'tools' | 'medical' | 'docs' | 'food';
  quantity: string;
  essentialFor: string;
  iconName: string;
}

export const EMERGENCY_KIT_ITEMS: EmergencyKitItem[] = [
  { id: 'kit-1', name: 'Drinking Water', category: 'hydration', quantity: '3 Liters / Person / Day (3-Day Supply)', essentialFor: 'All Disasters', iconName: 'Droplets' },
  { id: 'kit-2', name: 'LED Flashlight & Batteries', category: 'tools', quantity: '1 Sturdy Torch + 2 Extra Battery Sets', essentialFor: 'Earthquake, Cyclone, Grid Outage', iconName: 'Sun' },
  { id: 'kit-3', name: 'High-Capacity Power Bank', category: 'tools', quantity: '20,000 mAh Charged with Cable', essentialFor: 'All Emergencies', iconName: 'BatteryCharging' },
  { id: 'kit-4', name: 'First Aid Kit & Bandages', category: 'medical', quantity: 'Sterile gauze, antiseptic, tourniquet, scissors', essentialFor: 'Trauma & Collapse', iconName: 'HeartPulse' },
  { id: 'kit-5', name: 'Essential Prescription Medicines', category: 'medical', quantity: '7-Day supply of chronic medications + ORS', essentialFor: 'Heat Wave, Flood, Bio', iconName: 'Pill' },
  { id: 'kit-6', name: 'Important Documents in Waterproof Pouch', category: 'docs', quantity: 'Aadhaar, Property, Insurance, Medical papers', essentialFor: 'Flood, Cyclone, Wildfire', iconName: 'FileText' },
  { id: 'kit-7', name: 'Non-Perishable Ready-to-Eat Food', category: 'food', quantity: 'Biscuits, nuts, roasted grams, energy bars (3 days)', essentialFor: 'All Disasters', iconName: 'Utensils' },
  { id: 'kit-8', name: 'Battery / Hand-Crank AM/FM Radio', category: 'tools', quantity: '1 Portable Receiver for All India Radio', essentialFor: 'Cyclone, Grid Failure', iconName: 'Radio' },
  { id: 'kit-9', name: 'Protective N95 Masks & Gloves', category: 'medical', quantity: '4 Masks / Person + 1 Pair Heavy Gloves', essentialFor: 'Earthquake, Smoke, Bio', iconName: 'Shield' },
  { id: 'kit-10', name: 'High-Decibel Rescue Whistle', category: 'tools', quantity: '1 Whistle per family member', essentialFor: 'Building Collapse, Flash Flood', iconName: 'Volume2' }
];

// Multilingual Translations Dictionary
export const TRANSLATIONS: Record<Language, {
  pageTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  badgeText: string;
  startTraining: string;
  inEmergency: string;
  call112Bar: string;
  call112Text: string;
  call112Button: string;
  chooseSituation: string;
  chooseSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  doThis: string;
  avoidThis: string;
  before: string;
  during: string;
  after: string;
  visualTrainingMode: string;
  normalMode: string;
  whatWouldYouDo: string;
  safetyScore: string;
  buildKit: string;
  kitProgress: string;
  makeFamilyPlan: string;
  savePlan: string;
  printPlan: string;
  trustedSources: string;
  listenToGuide: string;
  speechUnavailable: string;
  sixtySecondGuide: string;
  close: string;
}> = {
  en: {
    pageTitle: 'RESQAI SAFETY CENTER',
    heroHeadline: 'KNOW WHAT TO DO BEFORE YOU NEED TO.',
    heroSubheadline: 'Learn the safest immediate actions for earthquakes, floods, cyclones, fires, lightning, landslides, tsunamis, heat waves and other emergencies — through simple visual, step-by-step guidance.',
    badgeText: 'LEARN • PRACTICE • RESPOND',
    startTraining: 'START SAFETY TRAINING',
    inEmergency: 'I AM IN AN EMERGENCY',
    call112Bar: '🚨 REAL EMERGENCY? CALL 112',
    call112Text: 'If you or someone else is in immediate danger, contact emergency services first. 112 is India’s pan-India Emergency Response Support System for Police, Fire, and Health.',
    call112Button: 'CALL 112',
    chooseSituation: 'CHOOSE A SITUATION',
    chooseSubtitle: 'Different disasters require different actions. Select a scenario to learn what to do in seconds.',
    searchPlaceholder: 'Search a disaster (e.g. Earthquake, Flood, Fire, Cyclone)...',
    allCategories: 'All Emergencies',
    doThis: 'DO THIS',
    avoidThis: 'AVOID THIS',
    before: 'BEFORE',
    during: 'DURING',
    after: 'AFTER',
    visualTrainingMode: 'VISUAL TRAINING MODE',
    normalMode: 'DETAILED VIEW',
    whatWouldYouDo: 'WHAT WOULD YOU DO? — SCENARIO SIMULATOR',
    safetyScore: 'YOUR SAFETY PREPAREDNESS SCORE',
    buildKit: 'BUILD YOUR EMERGENCY KIT',
    kitProgress: 'Items Ready',
    makeFamilyPlan: 'MAKE YOUR DISASTER PLAN',
    savePlan: 'SAVE PLAN LOCALLY',
    printPlan: 'PRINT / EXPORT PLAN',
    trustedSources: 'SAFETY INFORMATION YOU CAN TRUST',
    listenToGuide: 'LISTEN TO THIS GUIDE',
    speechUnavailable: 'Audio speech is currently unsupported in this browser.',
    sixtySecondGuide: '60 SECONDS THAT COULD MATTER',
    close: 'Close'
  },
  hi: {
    pageTitle: 'रेस्क्यूएआई सुरक्षा केंद्र',
    heroHeadline: 'जरूरत पड़ने से पहले जानें कि क्या करना है।',
    heroSubheadline: 'भूकंप, बाढ़, चक्रवात, आग, आकाशीय बिजली, भूस्खलन, सुनामी, लू और अन्य आपात स्थितियों के लिए सबसे सुरक्षित तत्काल कार्रवाई सीखें — सरल दृश्य और चरण-दर-चरण मार्गदर्शन द्वारा।',
    badgeText: 'सीखें • अभ्यास करें • प्रतिक्रिया दें',
    startTraining: 'सुरक्षा प्रशिक्षण शुरू करें',
    inEmergency: 'मैं आपात स्थिति में हूँ',
    call112Bar: '🚨 वास्तविक आपातकाल? 112 डायल करें',
    call112Text: 'यदि आप या कोई अन्य तत्काल खतरे में है, तो पहले आपातकालीन सेवाओं से संपर्क करें। 112 भारत की पुलिस, अग्निशमन और स्वास्थ्य सेवाओं के लिए एकल आपातकालीन हेल्पलाइन है।',
    call112Button: '112 पर कॉल करें',
    chooseSituation: 'स्थिति चुनें',
    chooseSubtitle: 'विभिन्न आपदाओं के लिए अलग-अलग कार्रवाइयों की आवश्यकता होती है। सेकंडों में जानने के लिए एक आपदा चुनें।',
    searchPlaceholder: 'आपदा खोजें (जैसे भूकंप, बाढ़, आग, चक्रवात)...',
    allCategories: 'सभी आपदाएं',
    doThis: 'यह करें',
    avoidThis: 'यह न करें',
    before: 'आपदा से पहले',
    during: 'आपदा के दौरान',
    after: 'आपदा के बाद',
    visualTrainingMode: 'दृश्य प्रशिक्षण मोड',
    normalMode: 'विस्तृत विवरण',
    whatWouldYouDo: 'आप क्या करेंगे? — आपदा सिम्युलेटर',
    safetyScore: 'आपका सुरक्षा तैयारी स्कोर',
    buildKit: 'अपनी आपातकालीन किट तैयार करें',
    kitProgress: 'वस्तुएं तैयार',
    makeFamilyPlan: 'पारिवारिक आपदा योजना बनाएं',
    savePlan: 'योजना सहेजें',
    printPlan: 'योजना प्रिंट करें',
    trustedSources: 'विश्वसनीय सुरक्षा जानकारी स्रोत',
    listenToGuide: 'यह निर्देश सुनें',
    speechUnavailable: 'इस ब्राउज़र में ऑडियो समर्थित नहीं है।',
    sixtySecondGuide: '60 सेकंड जो जीवन बचा सकते हैं',
    close: 'बंद करें'
  },
  te: {
    pageTitle: 'రెస్క్యూఏఐ భద్రతా కేంద్రం',
    heroHeadline: 'అవసరం రాకముందే ఏమి చేయాలో తెలుసుకోండి.',
    heroSubheadline: 'భూకంపాలు, వరదలు, తుఫానులు, అగ్ని ప్రమాదాలు, పిడుగులు, కొండచరియలు, సునామీ, వడగాల్పులు వంటి విపత్తులలో తీసుకోవలసిన తక్షణ రక్షణ చర్యలను సులభమైన దృశ్యరూపంలో నేర్చుకోండి.',
    badgeText: 'నేర్చుకోండి • సాధన చేయండి • స్పందించండి',
    startTraining: 'భద్రతా శిక్షణ ప్రారంభించండి',
    inEmergency: 'నేను ప్రమాదంలో ఉన్నాను',
    call112Bar: '🚨 అత్యవసర పరిస్థితా? 112 కు కాల్ చేయండి',
    call112Text: 'మీరు లేదా ఇతరులు తక్షణ ప్రమాదంలో ఉంటే, మొదట 112 అత్యవసర సేవలను సంప్రదించండి. 112 భారతదేశపు ఏకీకృత అత్యవసర హెల్ప్‌లైన్ (పోలీస్, ఫైర్, మెడికల్).',
    call112Button: '112 కు కాల్ చేయండి',
    chooseSituation: 'పరిస్థితిని ఎంచుకోండి',
    chooseSubtitle: 'వేర్వేరు విపత్తులకు వేర్వేరు రక్షణ చర్యలు అవసరం. సెకన్లలో తెలుసుకోవడానికి ఒక విపత్తును ఎంచుకోండి.',
    searchPlaceholder: 'విపత్తును వెతకండి (ఉదా: భూకంపం, వరద, అగ్ని, తుఫాను)...',
    allCategories: 'అన్ని విపత్తులు',
    doThis: 'ఇది చేయండి',
    avoidThis: 'ఇది చేయవద్దు',
    before: 'విపత్తుకు ముందు',
    during: 'విపత్తు సమయంలో',
    after: 'విపత్తు తరువాత',
    visualTrainingMode: 'విజువల్ ట్రైనింగ్ మోడ్',
    normalMode: 'పూర్తి వివరాలు',
    whatWouldYouDo: 'మీరైతే ఏమి చేస్తారు? — సిమ్యులేటర్',
    safetyScore: 'మీ భద్రతా సంసిద్ధత స్కోరు',
    buildKit: 'అత్యవసర కిట్‌ను సిద్ధం చేసుకోండి',
    kitProgress: 'వస్తువులు సిద్ధం',
    makeFamilyPlan: 'కుటుంబ విపత్తు ప్రణాళికను తయారు చేయండి',
    savePlan: 'ప్లాన్ సేవ్ చేయండి',
    printPlan: 'ప్లాన్ ప్రింట్ చేయండి',
    trustedSources: 'అధికారిక భద్రతా సమాచార వనరులు',
    listenToGuide: 'ఈ మార్గదర్శకాన్ని వినండి',
    speechUnavailable: 'ఈ బ్రౌజర్‌లో ఆడియో అందుబాటులో లేదు.',
    sixtySecondGuide: 'ప్రాణాలు కాపాడే 60 సెకన్లు',
    close: 'మూసివేయండి'
  }
};
