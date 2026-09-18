'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Waves,
  Flame,
  AlertTriangle,
  Building,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { SIMULATION_SCENARIOS } from '@/data/demoData';
import { EmergencyMap } from '../map/EmergencyMap';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

export const DisasterSimulator: React.FC = () => {
  const {
    simulationScenario,
    simulationStepIndex,
    isSimulationRunning,
    startSimulation,
    nextSimulationStep,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setActiveView
  } = useEmergency();

  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0].id);

  const activeScenario = simulationScenario || SIMULATION_SCENARIOS[0];
  const currentStep = activeScenario.steps[simulationStepIndex] || activeScenario.steps[0];

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    startSimulation(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Simulation Header Banner */}
      <div className="bg-slate-900 border border-amber-600/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrustSafetyBadge type="SIMULATION" label="RESQAI RESPONSE ENGINE • SIMULATION LAB" />
              <span className="text-xs font-mono text-slate-400">Deterministic Scenario Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Disaster Response Simulation Mode
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Observe ResQAI autonomous emergency response lifecycle in action: from initial sensor trigger through AI clustering, dynamic rerouting, multi-agency dispatch, and hospital trauma load-balancing.
            </p>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {SIMULATION_SCENARIOS.map(sc => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {sc.category === 'FLOOD' ? <Waves className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                  <span>{sc.title.split(' ')[0]} {sc.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isSimulationRunning) pauseSimulation();
                else resumeSimulation();
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-mono font-black tracking-wider flex items-center gap-2 shadow-lg transition"
            >
              {isSimulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulationRunning ? 'PAUSE SCENARIO' : 'RUN SIMULATION'}</span>
            </button>

            <button
              onClick={nextSimulationStep}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition border border-slate-700"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>NEXT STAGE</span>
            </button>

            <button
              onClick={resetSimulation}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-slate-800"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Scenario Timestamp: <strong className="text-white font-bold">{currentStep.timeOffset}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Stage {simulationStepIndex + 1} of {activeScenario.steps.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Simulation Step Details + Live GIS Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stage Progression & AI Narrative */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Current Step Card */}
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                STAGE {simulationStepIndex + 1}: {currentStep.actionType}
              </span>
              <span className="text-xs font-mono text-slate-400">{currentStep.timeOffset} ELAPSED</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">{currentStep.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">POPULATION AT RISK</span>
                <span className="text-lg font-black text-amber-300">
                  {currentStep.impactMetrics.affectedCount ? currentStep.impactMetrics.affectedCount.toLocaleString() : '1,450'}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">UNITS DISPATCHED</span>
                <span className="text-lg font-black text-blue-400">
                  {currentStep.impactMetrics.unitsDispatched || 2} Teams
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Scenario Sequence Milestones:
            </div>

            <div className="space-y-2.5">
              {activeScenario.steps.map((step, idx) => {
                const isCurrent = idx === simulationStepIndex;
                const isPassed = idx < simulationStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition ${
                      isCurrent
                        ? 'bg-amber-950/40 border border-amber-600/60 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{step.timeOffset}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Live GIS Map Reaction */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <EmergencyMap />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
            <span>Map automatically updates hazards, roadblocks, and units as scenario advances.</span>
            <button
              onClick={() => setActiveView('COMMAND')}
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect in Full Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
