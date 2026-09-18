'use client';

import React, { useState } from 'react';
import { DISASTERS_DATA, Language, TRANSLATIONS } from '@/data/safetyGuideData';
import { EmergencyTopBar } from './EmergencyTopBar';
import { SafetyCenterHero } from './SafetyCenterHero';
import { QuickSurvivalModal } from './QuickSurvivalModal';
import { DisasterCardGrid } from './DisasterCardGrid';
import { DisasterScenarioPanel } from './DisasterScenarioPanel';
import { SafetyQuizSimulator } from './SafetyQuizSimulator';
import { EmergencyKitBuilder } from './EmergencyKitBuilder';
import { FamilyPlanGenerator } from './FamilyPlanGenerator';
import { SafetyZoneMap } from './SafetyZoneMap';
import { ResQAIBridgeSection } from './ResQAIBridgeSection';
import { TrustSection } from './TrustSection';

export const SafetyCenterView = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>('earthquake');
  const [quickModalOpen, setQuickModalOpen] = useState<boolean>(false);

  const dict = TRANSLATIONS[language];
  const activeDisaster =
    DISASTERS_DATA.find((d) => d.id === selectedDisasterId) || DISASTERS_DATA[0];

  const handleSelectDisaster = (id: string) => {
    setSelectedDisasterId(id);
    // Smooth scroll to scenario panel
    const el = document.getElementById('scenario-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToKit = () => {
    const el = document.getElementById('kit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* 1. Hero Section */}
      <SafetyCenterHero
        language={language}
        onLanguageChange={setLanguage}
        onEmergencyClick={() => setQuickModalOpen(true)}
        onScrollToCatalog={handleScrollToCatalog}
        onScrollToKit={handleScrollToKit}
      />

      {/* 3. Filterable Disaster Catalog Grid (15 Disasters) */}
      <DisasterCardGrid
        selectedDisasterId={selectedDisasterId}
        onSelectDisaster={handleSelectDisaster}
        dict={dict}
      />

      {/* 4. Immersive Scenario & Drill Panel */}
      <DisasterScenarioPanel
        disaster={activeDisaster}
        language={language}
      />

      {/* 5. "What Would You Do?" Scenario Simulator */}
      <SafetyQuizSimulator dict={dict} />

      {/* 6. 72-Hour Survival Kit Builder */}
      <EmergencyKitBuilder dict={dict} />

      {/* 7. Family Disaster Plan Generator */}
      <FamilyPlanGenerator />

      {/* 8. Local Emergency Safety Zone Infrastructure Map */}
      <SafetyZoneMap />

      {/* 9. ResQAI Connected Ecosystem Bridge */}
      <ResQAIBridgeSection />

      {/* 10. Authoritative Sources & NDMA/USGS Citations */}
      <TrustSection />

      {/* 60-Second Survival Priority Modal */}
      <QuickSurvivalModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        initialDisasterId={selectedDisasterId}
        language={language}
      />
    </div>
  );
};
