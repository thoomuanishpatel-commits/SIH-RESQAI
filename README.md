# SIH-RESQAI
### AI-Powered Disaster Response & Emergency Coordination Platform

**Smart India Hackathon (SIH)** — Unified crisis management grid connecting distressed citizens, AI incident triage, Emergency Operations Centers (EOC), and frontline responders in real time.

---

## 🌟 Key Pillars & Architecture

1. **Citizen SOS & Multi-Modal Reporting**:
   - 1-tap zero-form emergency distress beacon with instant GPS trilateration.
   - Voice AI reporting with real-time waveform visualizer and structured incident intent extraction.
   - Computer Vision damage assessment with automated casualty estimation and hazard tagging.
   - Actionable DO/DO NOT emergency safety guides and nearby trauma center locator.

2. **Emergency Operations Center (EOC) Command Center**:
   - DEFCON threat posture monitoring, live casualty counters, and hospital bed availability.
   - Smart Dispatch Engine with transparent "WHY?" explainability reasoning.
   - Dynamic road closure and roadblock detour calculation.
   - Real-time hazard perimeter overlays (flood inundation zones, fire flashover perimeters).

3. **Live GIS Interactive Grid (CartoDB / Esri / OSM)**:
   - Real-time pointing for all major hospitals with live ICU bed capacity callouts.
   - Key landmark and civic infrastructure pointing with structural integrity and occupancy metrics.
   - 22 specialized disaster management vehicles across 6 operational categories with live telemetry.

4. **Frontline Responder Mobile Terminal**:
   - Real-time HUD with route distance, ETA, and priority dispatch alerts.
   - Vehicle telemetry dashboard displaying fuel %, crew count, and water/O2 tank levels.
   - 1-tap status updates: `[ START NAVIGATION ]`, `[ MARK ARRIVED ]`, `[ REQ BACKUP ]`, `[ RESOLVE ]`.

5. **Autonomous Disaster Simulation Engine**:
   - Multi-stage scenarios (*Musi River Urban Flash Flood* and *HITEC City High-Rise Fire*).
   - Scrubbable timelines with real-time map reactions, hospital diverts, and automated squad mobilization.

---

## 🚒 Specialized Disaster Management Fleet (22 Units)

- **Ambulances (6 Units)**: Mobile ICU (ALS), Cardiac Care, BLS, Pediatric ICU (PICU), Mass Evacuation Bus (12 Stretchers), Off-Road 4x4 Rural EMS.
- **Fire Tenders (5 Units)**: Volvo Bronto Skylift 54M Articulated Platform, Heavy Foam Tender (10,000L), High-Volume Pumper, Heavy Rescue Tender, Ultra-High Pressure Mist Unit.
- **Police & Tactical (5 Units)**: Traffic Interceptor, Urban Patrol, Marksman Armored Tactical SWAT, Quick Reaction Team (QRT), Drone Surveillance Van.
- **Disaster Rescue & Watercraft (4 Units)**: Zodiac Inflatable Powerboats, 4x4 High-Water Evacuation Trucks, Tatra 8x8 Heavy Amphibians, NDRF K-9 USAR Squads.
- **Hazmat & Mobile Command (2 Units)**: Chemical Decontamination Unit, Mobile EOC Command Bus.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/thoomuanishpatel-commits/SIH-RESQAI.git
cd SIH-RESQAI

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **GIS / Mapping**: Leaflet, React-Leaflet, CartoDB Dark Matter, Esri Satellite, OpenStreetMap
- **State Management**: React Context with LocalStorage offline bridge
