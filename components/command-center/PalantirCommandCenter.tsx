'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  Radio,
  Activity,
  Truck,
  Building,
  Users,
  AlertTriangle,
  Flame,
  Search,
  Bot,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Play,
  Pause,
  LogOut,
  Send,
  CheckCircle2,
  X,
  Compass,
  ArrowRight,
  RefreshCw,
  Clock,
  ExternalLink,
  Lock,
  UserCheck,
  FileText,
  Sliders,
  Sun,
  Moon,
  Database,
  Terminal,
  Volume2,
  VolumeX,
  MapPin,
  HeartPulse,
  Share2,
  Download
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { Incident, EmergencyUnit, Hospital, ReliefShelter, RoadBlock, IncidentSeverity } from '@/types';

// Dynamic import of Tactical Map with SSR disabled for Leaflet canvas compatibility
const PalantirTacticalMap = dynamic(
  () => import('./PalantirTacticalMap').then(mod => mod.PalantirTacticalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center font-mono text-cyan-400 gap-3">
        <Radio className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-xs uppercase tracking-widest">INITIALIZING PALANTIR GIS ENGINE...</span>
      </div>
    )
  }
);

type SidebarTab = 
  | 'dispatch'
  | 'archive'
  | 'analyzer'
  | 'sos'
  | 'risk'
  | 'chat'
  | 'analytics'
  | 'reports';

interface LogNotification {
  id: string;
  message: string;
  type: 'emergency' | 'warning' | 'success' | 'info';
  timestamp: string;
}

export const PalantirCommandCenter: React.FC = () => {
  const {
    incidents,
    units,
    hospitals,
    shelters,
    roadBlocks,
    selectedIncident,
    setSelectedIncident,
    resolveIncident,
    dispatchUnit,
    updateUnitStatus,
    toggleRoadBlock,
    createIncident,
    setActiveView,
    setPortalMode,
    logoutAdmin,
    isAdminAuthenticated,
    setAdminAuthModalOpen
  } = useEmergency();

  // 1. Theme & UI State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('dispatch');
  const [rightDrawerOpen, setRightDrawerOpen] = useState<boolean>(true);
  const [rightDrawerWidth, setRightDrawerWidth] = useState<number>(440);
  const isResizingRef = useRef(false);

  // 2. Simulation & Autopilot State
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [elapsedHours, setElapsedHours] = useState<number>(3.4);
  const [isAutopilotEngaged, setIsAutopilotEngaged] = useState<boolean>(true);
  const [forecastHours, setForecastHours] = useState<number>(4);

  // 3. Officer Role Switcher
  const [officerRole, setOfficerRole] = useState<string>('Administrator');
  const officerRoles = [
    'Administrator',
    'Department Official',
    'Emergency Coordinator',
    'Incident Operator',
    'Field Officer',
    'Project Examiner'
  ];

  // 4. Command Palette (Ctrl+K)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');

  // 5. Sign Out Confirmation Modal
  const [signOutModalOpen, setSignOutModalOpen] = useState<boolean>(false);

  // 6. Manual SOS Injector State
  const [newSosTitle, setNewSosTitle] = useState<string>('');
  const [newSosCategory, setNewSosCategory] = useState<string>('FIRE');
  const [newSosSeverity, setNewSosSeverity] = useState<IncidentSeverity>('HIGH');

  // 7. Tactical Copilot Chat
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotChat, setCopilotChat] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Palantir Crisis Copilot online. Telemetry cross-referenced across national sectors. Ready for tactical routing.',
      time: '15:15'
    }
  ]);

  // 8. Ticker Notifications Log
  const [tickerLogs, setTickerLogs] = useState<LogNotification[]>([
    { id: '1', type: 'emergency', message: 'CRITICAL ALERT: Musi River water level surpassed warning mark (514.2m).', timestamp: '15:12:04' },
    { id: '2', type: 'warning', message: 'TRAFFIC DETOUR: Cyber Towers underpass blocked. Bypass routing active.', timestamp: '15:13:30' },
    { id: '3', type: 'info', message: 'DISPATCH UPDATE: EMS Unit Alpha-1 assigned to Incident #RQ-204891.', timestamp: '15:14:12' },
    { id: '4', type: 'success', message: 'RESCUE COMPLETE: 4 civilians evacuated from HiTech City commercial terrace.', timestamp: '15:14:55' }
  ]);

  // Real-time clock string
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulation time-step ticker
  useEffect(() => {
    if (!isSimRunning) return;
    const interval = setInterval(() => {
      setElapsedHours(prev => Number((prev + 0.1).toFixed(1)));
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimRunning]);

  // Automatically broadcast incoming citizen disasters directly to Admin Marquee & Ticker
  const prevIncidentCountRef = useRef(incidents.length);
  useEffect(() => {
    if (incidents.length > prevIncidentCountRef.current) {
      const latest = incidents[0];
      setTickerLogs(prev => [
        {
          id: Date.now().toString(),
          type: 'emergency',
          message: `NEW CITIZEN DISASTER REPORTED: [${latest.id}] ${latest.title} (${latest.location.address})`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        },
        ...prev.slice(0, 24)
      ]);
      setSelectedIncident(latest);
    }
    prevIncidentCountRef.current = incidents.length;
  }, [incidents, setSelectedIncident]);

  // Automated Autopilot Matcher: Matches available nearest unit to critical unassigned incidents
  useEffect(() => {
    if (!isAutopilotEngaged) return;
    const pendingCritical = incidents.find(i => i.status === 'REPORTED' || i.status === 'VERIFIED');
    if (pendingCritical) {
      const availUnit = units.find(u => u.status === 'AVAILABLE');
      if (availUnit) {
        dispatchUnit(availUnit.id, pendingCritical.id);
        setTickerLogs(prev => [
          {
            id: Date.now().toString(),
            type: 'info',
            message: `AUTOPILOT: Automatically dispatched ${availUnit.callsign} to Incident #${pendingCritical.id}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
          },
          ...prev.slice(0, 19)
        ]);
      }
    }
  }, [incidents, units, isAutopilotEngaged, dispatchUnit]);

  // Resizable drawer drag handlers
  const handleMouseDownResize = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMoveResize);
    document.addEventListener('mouseup', handleMouseUpResize);
  };

  const handleMouseMoveResize = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 320 && newWidth <= 720) {
      setRightDrawerWidth(newWidth);
    }
  };

  const handleMouseUpResize = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMoveResize);
    document.removeEventListener('mouseup', handleMouseUpResize);
  };

  // Telemetry Aggregates
  const activeEmergenciesCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const citizensRescuedTotal = 84 + incidents.reduce((sum, i) => sum + (i.trappedCount || 0), 0);
  const pendingSosIntakeCount = incidents.filter(i => i.status === 'REPORTED').length;

  const emsCount = units.filter(u => u.type === 'EMS').length;
  const fireCount = units.filter(u => u.type === 'FIRE').length;
  const policeCount = units.filter(u => u.type === 'POLICE').length;
  const ndrfCount = units.filter(u => u.type === 'RESCUE').length;

  // Command Runner
  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === '/autopilot') {
      setIsAutopilotEngaged(!isAutopilotEngaged);
    } else if (trimmed === '/clear') {
      setTickerLogs([]);
    } else if (trimmed.startsWith('/sos')) {
      const type = trimmed.includes('fire') ? 'FIRE' : trimmed.includes('flood') ? 'FLOOD' : 'COLLAPSE';
      createIncident({
        type: type as any,
        title: `Simulated High-Priority ${type} Incident`,
        description: 'Auto-injected emergency alert from Command Palette.',
        severity: 'CRITICAL',
        estimatedCasualties: 4
      });
    } else if (trimmed.startsWith('/view')) {
      const tab = trimmed.split(' ')[1] as SidebarTab;
      if (['dispatch', 'archive', 'analyzer', 'sos', 'risk', 'chat', 'analytics', 'reports'].includes(tab)) {
        setActiveTab(tab);
        setRightDrawerOpen(true);
      }
    }
    setCommandPaletteOpen(false);
    setCommandInput('');
  };

  // Copilot query responder
  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: copilotQuery,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    let reply = `Command acknowledgment. Telemetry confirmed. Nearest unit is Unit C (Apollo ALS Medic 2) with clear trajectory.`;
    const q = copilotQuery.toLowerCase();
    if (q.includes('icu') || q.includes('hospital')) {
      reply = `Trauma Network Audit: Apollo Hospitals has 18 ICU beds open; Care Banjara has 6 available. All triage corridors optimal.`;
    } else if (q.includes('flood') || q.includes('river')) {
      reply = `Musi River gauge telemetry indicates peak swell expected in +${forecastHours}h. Evacuation centers Shelter-North & South have 320 beds capacity.`;
    } else if (q.includes('dispatch') || q.includes('unit')) {
      reply = `Autopilot engine has mapped fastest bypass around Cyber Towers underpass via Durgam Cheruvu bridge (ETA: 4.8 mins).`;
    }

    const aiMsg = {
      sender: 'ai' as const,
      text: reply,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setCopilotChat(prev => [...prev, userMsg, aiMsg]);
    setCopilotQuery('');
  };

  // If not authenticated, render restricted authentication screen
  if (!isAdminAuthenticated) {
    return (
      <div className="h-screen w-screen bg-black text-slate-100 flex items-center justify-center p-6 select-none font-mono">
        <div className="max-w-md w-full bg-zinc-950 border border-red-500/60 rounded-2xl p-8 text-center space-y-5 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="w-16 h-16 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">
              RESTRICTED TACTICAL GRID
            </span>
            <h2 className="text-xl font-black text-white">EOC ADMIN PORTAL</h2>
            <p className="text-xs text-zinc-400">
              Authorized credential session required to access live Palantir emergency coordination canvas.
            </p>
          </div>
          <div className="p-3 bg-black/80 rounded-xl border border-zinc-800 text-left text-xs space-y-1">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">Officer Demo Account:</div>
            <div>Badge ID: <strong className="text-white">commander@resqai.gov.in</strong></div>
            <div>Passcode: <strong className="text-white">resqai112</strong></div>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setAdminAuthModalOpen(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              Sign In to Command Portal
            </button>
            <button
              onClick={() => {
                setPortalMode('USER');
                setActiveView('CITIZEN');
              }}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Return to Public Citizen Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen overflow-hidden select-none font-mono relative flex flex-col ${
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-black text-slate-100'
    }`}>

      {/* ============================================================ */}
      {/* 1. TOP FLOATING TELEMETRY HUD & CONTROLS                     */}
      {/* ============================================================ */}
      <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Clock & Status Telemetry Card */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black tracking-wider text-white">EOC: ACTIVE</span>
          </div>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-400">{currentTime || 'SYNCING GPS CLOCK...'}</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">SYSTEMS: 100% OK</span>
        </div>

        {/* Center: KPI Metric Cards (Glassmorphism) */}
        <div className="pointer-events-auto hidden xl:flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-zinc-400">ACTIVE:</span>
            <span className="text-xs font-black text-red-400">{activeEmergenciesCount}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-zinc-400">RESCUED:</span>
            <span className="text-xs font-black text-emerald-400">{citizensRescuedTotal}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-zinc-400">PENDING SOS:</span>
            <span className="text-xs font-black text-amber-400">{pendingSosIntakeCount}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-zinc-400">EMS FLEET:</span>
            <span className="text-xs font-bold text-cyan-300">[{emsCount}A | {fireCount}F | {policeCount}P]</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-zinc-400">NDRF SQUADS:</span>
            <span className="text-xs font-bold text-blue-400">{ndrfCount}</span>
          </div>
        </div>

        {/* Right: Operational Switchers & Command Palette Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Autopilot Button */}
          <button
            onClick={() => setIsAutopilotEngaged(!isAutopilotEngaged)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-xl ${
              isAutopilotEngaged
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-700'
            }`}
            title="Toggle Autonomous Dispatch Agent"
          >
            <Zap className={`w-3.5 h-3.5 ${isAutopilotEngaged ? 'text-cyan-400 animate-pulse' : 'text-zinc-500'}`} />
            <span className="hidden sm:inline">AUTOPILOT:</span>
            <span>{isAutopilotEngaged ? 'ENGAGED' : 'OFFLINE'}</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-xl ${
              isSimRunning
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : 'bg-zinc-900/90 text-amber-400 border-amber-500/40'
            }`}
            title="Toggle Operational Time-Step Simulation"
          >
            {isSimRunning ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span className="hidden md:inline">Sim: {isSimRunning ? 'RUNNING' : 'PAUSED'}</span>
            <span className="text-[10px] text-zinc-400">({elapsedHours}h)</span>
          </button>

          {/* Command Palette Ctrl+K */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-950/90 border border-white/15 hover:border-cyan-500/50 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xl"
            title="Open Command Runner (Ctrl+K)"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <kbd className="text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">Ctrl+K</kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-zinc-950/90 border border-white/15 text-zinc-300 hover:text-white transition shadow-xl"
            title="Switch Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Toggle Right Operations Console */}
          <button
            onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
            className={`p-2 rounded-xl border transition shadow-xl ${
              rightDrawerOpen
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                : 'bg-zinc-950/90 border-white/15 text-zinc-400'
            }`}
            title="Toggle Right Operations Console"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN VIEWPORT (FULL-SCREEN MAP + FLOATING SIDEBAR + DRAWER)*/}
      {/* ============================================================ */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        
        {/* Full-Screen Leaflet Tactical Map Canvas Base */}
        <div className="absolute inset-0 z-0">
          <PalantirTacticalMap
            incidents={incidents}
            units={units}
            hospitals={hospitals}
            shelters={shelters}
            roadBlocks={roadBlocks}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setActiveTab('dispatch');
              setRightDrawerOpen(true);
            }}
            forecastHours={forecastHours}
            theme={theme}
            onToggleRoadBlock={toggleRoadBlock}
          />
        </div>

        {/* COLLAPSIBLE LEFT TACTICAL SIDEBAR */}
        <aside
          className={`absolute top-16 bottom-12 left-3 z-20 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
            sidebarExpanded ? 'w-60' : 'w-16'
          }`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {/* Top Logo & Expand Toggle */}
          <div>
            <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-cyan-950/80 shrink-0">
                  RQ
                </div>
                {sidebarExpanded && (
                  <div className="overflow-hidden whitespace-nowrap">
                    <div className="text-xs font-black text-white tracking-wider">TSDMA RESQAI</div>
                    <div className="text-[8px] text-cyan-400">TACTICAL COMMAND</div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-zinc-500 hover:text-white p-1"
              >
                {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="p-2 space-y-1">
              {[
                { id: 'dispatch' as SidebarTab, label: 'Tactical Logistics', icon: Truck, badge: units.filter(u => u.status === 'EN_ROUTE').length },
                { id: 'archive' as SidebarTab, label: 'Spatial Registry', icon: Database },
                { id: 'analyzer' as SidebarTab, label: 'AI Incident Scanner', icon: Search },
                { id: 'sos' as SidebarTab, label: 'Citizen SOS Board', icon: ShieldAlert, badge: pendingSosIntakeCount, badgeColor: 'bg-rose-600 text-white' },
                { id: 'risk' as SidebarTab, label: 'Risk Forecast', icon: Sliders },
                { id: 'chat' as SidebarTab, label: 'Crisis Copilot AI', icon: Bot },
                { id: 'analytics' as SidebarTab, label: 'Analytics Dashboard', icon: Activity },
                { id: 'reports' as SidebarTab, label: 'Briefing Reports', icon: FileText },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setRightDrawerOpen(true);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                    {sidebarExpanded && (
                      <span className="truncate flex-1 text-left">{tab.label}</span>
                    )}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        tab.badgeColor || (isActive ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300')
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Officer Profile & Switchers */}
          <div className="p-2.5 border-t border-zinc-800/80 space-y-2 bg-zinc-950/90">
            {sidebarExpanded && (
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Officer Profile:</div>
                <select
                  value={officerRole}
                  onChange={(e) => setOfficerRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-[11px] font-mono outline-none"
                >
                  {officerRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Back to Citizen Portal */}
            <button
              onClick={() => {
                setPortalMode('USER');
                setActiveView('CITIZEN');
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition"
              title="Return to Public Citizen Portal"
            >
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              {sidebarExpanded && <span className="truncate">Citizen View</span>}
            </button>

            {/* Secure Sign Out */}
            <button
              onClick={() => setSignOutModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-500/30 transition"
              title="Secure EOC Sign Out"
            >
              <LogOut className="w-4 h-4 text-red-400 shrink-0" />
              {sidebarExpanded && <span className="truncate">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* RESIZABLE RIGHT OPERATIONS DRAWER */}
        {rightDrawerOpen && (
          <aside
            style={{ width: `${rightDrawerWidth}px` }}
            className="absolute top-16 bottom-12 right-3 z-20 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200"
          >
            {/* Draggable Resizer Bar on Left Edge */}
            <div
              onMouseDown={handleMouseDownResize}
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-cyan-500/50 transition z-30"
              title="Drag to resize panel width"
            />

            {/* Drawer Header */}
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  {activeTab === 'dispatch' && 'Tactical Dispatch Console'}
                  {activeTab === 'archive' && 'Spatial Registry & Audit Logs'}
                  {activeTab === 'analyzer' && 'AI Incident Scanner'}
                  {activeTab === 'sos' && 'Citizen SOS Distress Board'}
                  {activeTab === 'risk' && 'Musi Surge & Risk Forecast'}
                  {activeTab === 'chat' && 'Tactical Copilot Assistant'}
                  {activeTab === 'analytics' && 'Operational Analytics'}
                  {activeTab === 'reports' && 'Automated SITREP Generator'}
                </span>
              </div>
              <button
                onClick={() => setRightDrawerOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: TACTICAL DISPATCH CONSOLE */}
              {activeTab === 'dispatch' && (
                <div className="space-y-4">
                  {/* Active Incident Queue (Citizen reports immediately appear here) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-400">
                      <span>Live Citizen Disasters Queue ({incidents.filter(i => i.status !== 'RESOLVED').length}):</span>
                      <span className="text-cyan-400 font-mono">100% Synced</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {incidents.filter(i => i.status !== 'RESOLVED').map(inc => {
                        const isSelected = selectedIncident?.id === inc.id;
                        return (
                          <div
                            key={inc.id}
                            onClick={() => setSelectedIncident(inc)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-cyan-950/80 border-cyan-500 shadow-md ring-1 ring-cyan-500/40 text-white'
                                : 'bg-zinc-900/90 border-zinc-800/90 hover:border-zinc-700 text-zinc-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${inc.severity === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`} />
                                <span className="text-xs font-bold font-mono text-cyan-300 truncate">{inc.id}</span>
                                <span className="text-[10px] text-zinc-400 font-mono">• {inc.type}</span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-200 truncate mt-0.5">{inc.title}</p>
                              <p className="text-[10px] text-zinc-400 truncate">📍 {inc.location.address}</p>
                            </div>

                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                              inc.status === 'DISPATCHED' || inc.status === 'ON_SCENE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {inc.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedIncident ? (
                    <div className="space-y-3 pt-2 border-t border-zinc-800">
                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-400">{selectedIncident.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase font-bold">
                            {selectedIncident.severity}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{selectedIncident.title}</h3>
                        <p className="text-xs text-zinc-300">{selectedIncident.description}</p>
                        <div className="text-[10px] text-cyan-300 font-mono">
                          📍 {selectedIncident.location.address}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Reported: {new Date(selectedIncident.reportedAt).toLocaleTimeString()} • Casualties: {selectedIncident.estimatedCasualties}
                        </div>
                      </div>

                      {/* Recommend Nearest Vehicle */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          Recommended Tactical Units:
                        </span>
                        {units.slice(0, 3).map(u => (
                          <div
                            key={u.id}
                            className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/50 flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{u.callsign}</span>
                                <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-cyan-300">{u.type}</span>
                              </div>
                              <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                                Status: <strong className="text-emerald-400">{u.status}</strong> • ETA: {u.etaMinutes || 3}m
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                dispatchUnit(u.id, selectedIncident.id);
                                setTickerLogs(prev => [
                                  {
                                    id: Date.now().toString(),
                                    type: 'info',
                                    message: `DISPATCHED: ${u.callsign} assigned to ${selectedIncident.id}`,
                                    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
                                  },
                                  ...prev
                                ]);
                              }}
                              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold uppercase transition cursor-pointer"
                            >
                              Dispatch
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => resolveIncident(selectedIncident.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                      >
                        Mark Incident Resolved
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-zinc-400 space-y-2 border border-dashed border-zinc-800 rounded-xl">
                      <Truck className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-xs">Click any reported incident from the list above or on the map to dispatch units.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CITIZEN SOS DISTRESS BOARD */}
              {activeTab === 'sos' && (
                <div className="space-y-4">
                  {/* Manual SOS Creator Form */}
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                    <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Inject Manual Citizen Distress Signal</span>
                    </span>
                    <input
                      type="text"
                      value={newSosTitle}
                      onChange={(e) => setNewSosTitle(e.target.value)}
                      placeholder="Emergency description (e.g., Trapped in basement water)"
                      className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newSosCategory}
                        onChange={(e) => setNewSosCategory(e.target.value)}
                        className="flex-1 bg-black border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300 outline-none"
                      >
                        <option value="FIRE">FIRE</option>
                        <option value="FLOOD">FLOOD</option>
                        <option value="COLLAPSE">COLLAPSE</option>
                        <option value="ACCIDENT">ACCIDENT</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSosTitle.trim()) return;
                          createIncident({
                            type: newSosCategory as any,
                            title: newSosTitle,
                            description: 'Citizen SOS distress beacon transmitted to EOC grid.',
                            severity: newSosSeverity,
                            estimatedCasualties: 2
                          });
                          setNewSosTitle('');
                        }}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase transition"
                      >
                        Send SOS
                      </button>
                    </div>
                  </div>

                  {/* Incoming Distress Feed */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Active Distress Tickets:</span>
                    {incidents.filter(i => i.status !== 'RESOLVED').map(inc => (
                      <div
                        key={inc.id}
                        className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-zinc-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-400">{inc.id}</span>
                          <span className="text-[10px] text-zinc-400">{inc.type}</span>
                        </div>
                        <p className="text-xs font-semibold text-white">{inc.title}</p>
                        
                        {/* Severity Gradient Bar (0-100%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400">
                            <span>Severity Index:</span>
                            <span className="text-rose-400 font-bold">{inc.severity === 'CRITICAL' ? '95%' : '75%'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
                              style={{ width: inc.severity === 'CRITICAL' ? '95%' : '75%' }}
                            />
                          </div>
                        </div>

                        {/* Police Pager & Verification Actions */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedIncident(inc);
                              setActiveTab('dispatch');
                            }}
                            className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold uppercase transition"
                          >
                            Pager Dispatch
                          </button>
                          <button
                            onClick={() => resolveIncident(inc.id)}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded-lg text-[11px] font-bold uppercase transition"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RISK & MUSI SURGE FORECAST */}
              {activeTab === 'risk' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 uppercase">Operational Forecast Timeline:</span>
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">
                        +{forecastHours}h Ahead
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={24}
                      value={forecastHours}
                      onChange={(e) => setForecastHours(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>+1 Hour</span>
                      <span>+12 Hours</span>
                      <span>+24 Hours</span>
                    </div>

                    <p className="text-[11px] text-zinc-300">
                      Adjusting this timeline dynamically expands the Musi River inundation hazard polygons and recomputes hospital ICU bed stress.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Hospital ICU Bed Stress Projection:</span>
                    {hospitals.map(h => (
                      <div key={h.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-850">
                        <span className="text-zinc-300">{h.name}</span>
                        <span className="font-bold text-emerald-400">{h.icuAvailable} Beds Avail</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CRISIS COPILOT AI */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[520px] justify-between">
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {copilotChat.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          msg.sender === 'user'
                            ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-100 ml-6'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-200 mr-6'
                        }`}
                      >
                        <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                          <span>{msg.sender === 'user' ? 'OFFICER' : 'COPILOT AI'}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCopilotSubmit} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      value={copilotQuery}
                      onChange={(e) => setCopilotQuery(e.target.value)}
                      placeholder="Ask tactical copilot for route ETA or ICU status..."
                      className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7 & 8: ANALYTICS & SITREP */}
              {(activeTab === 'analytics' || activeTab === 'reports') && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-cyan-400">Response Latency Benchmark:</span>
                    <div className="text-2xl font-black text-white">4m 12s</div>
                    <p className="text-zinc-400 text-[11px]">Average emergency dispatch reaction speed across Hyderabad EOC grid.</p>
                  </div>

                  <button
                    onClick={() => alert('Exporting full tactical SITREP situation report (PDF)...')}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Automated SITREP (PDF)</span>
                  </button>
                </div>
              )}

              {/* TAB 2 & 3: ARCHIVE & SCANNER */}
              {(activeTab === 'archive' || activeTab === 'analyzer') && (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Historical Coordinate Registry:</span>
                  <p className="text-[11px] text-zinc-400">Permanent spatial audit logs recorded with SHA-256 telemetry seals.</p>
                  <div className="space-y-1 font-mono text-[10px] text-zinc-400">
                    <div>• 17.4483° N, 78.3915° E (HITEC Cyber Gateway)</div>
                    <div>• 17.4280° N, 78.4110° E (Jubilee Hills Road 36)</div>
                    <div>• 17.3753° N, 78.4744° E (Charminar South Station)</div>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* ============================================================ */}
      {/* 3. FLOATING BOTTOM MARQUEE TICKER (COMMAND LOGS)             */}
      {/* ============================================================ */}
      <footer className="h-10 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-4 z-30 relative overflow-hidden select-none">
        
        {/* Left Ticker Label */}
        <div className="flex items-center gap-2 pr-4 border-r border-zinc-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
            EOC LIVE TICKER:
          </span>
        </div>

        {/* Center Marquee with Hover Pause & Gradient Fade Masks */}
        <div className="flex-1 overflow-hidden relative mx-2 h-full flex items-center group">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] text-xs">
            {tickerLogs.map(log => (
              <div key={log.id} className="inline-flex items-center gap-2">
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  log.type === 'emergency' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  log.type === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  log.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}>
                  [{log.type}]
                </span>
                <span className="text-zinc-300">{log.message}</span>
                <span className="text-[10px] text-zinc-500 font-mono">({log.timestamp})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Logs Action */}
        <div className="pl-3 border-l border-zinc-800 shrink-0">
          <button
            onClick={() => setTickerLogs([])}
            className="text-[10px] text-zinc-400 hover:text-white transition uppercase font-bold"
          >
            Clear
          </button>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. COMMAND PALETTE MODAL (Ctrl+K)                           */}
      {/* ============================================================ */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3.5 border-b border-zinc-800 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runCommand(commandInput);
                }}
                placeholder="Type command: /autopilot, /clear, /sos fire, /view sos..."
                className="w-full bg-transparent text-sm text-white outline-none font-mono placeholder:text-zinc-600"
              />
              <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">ESC</kbd>
            </div>
            <div className="p-3 space-y-1 text-xs font-mono text-zinc-400">
              <div className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-1">Quick Suggestions:</div>
              <button
                onClick={() => runCommand('/autopilot')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-900 hover:text-white flex items-center justify-between"
              >
                <span>/autopilot</span>
                <span className="text-zinc-500 text-[10px]">Toggle automated dispatch</span>
              </button>
              <button
                onClick={() => runCommand('/sos flood')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-900 hover:text-white flex items-center justify-between"
              >
                <span>/sos flood</span>
                <span className="text-zinc-500 text-[10px]">Inject simulated Musi flood emergency</span>
              </button>
              <button
                onClick={() => runCommand('/view sos')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-900 hover:text-white flex items-center justify-between"
              >
                <span>/view sos</span>
                <span className="text-zinc-500 text-[10px]">Switch to Citizen SOS Board</span>
              </button>
              <button
                onClick={() => runCommand('/clear')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-900 hover:text-white flex items-center justify-between"
              >
                <span>/clear</span>
                <span className="text-zinc-500 text-[10px]">Flush marquee logs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SECURE SIGN OUT CONFIRMATION MODAL                        */}
      {/* ============================================================ */}
      {signOutModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-zinc-950 border border-red-500/60 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">Sign Out from EOC Grid?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to end your active Commander session? You will be returned to the Public Citizen Portal.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setSignOutModalOpen(false)}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSignOutModalOpen(false);
                  logoutAdmin();
                  setPortalMode('USER');
                  setActiveView('CITIZEN');
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase transition"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
