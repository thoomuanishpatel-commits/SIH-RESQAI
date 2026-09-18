'use client';

import React from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingSections } from '@/components/landing/LandingSections';
import { CitizenHome } from '@/components/citizen/CitizenHome';
import { CommandCenterShell } from '@/components/command-center/CommandCenterShell';
import { ResponderMobileView } from '@/components/responder/ResponderMobileView';
import { AdminFleetMovementView } from '@/components/admin/AdminFleetMovementView';
import { TrackEmergencyView } from '@/components/citizen/TrackEmergencyView';
import { SafetyCenterView } from '@/components/safety-center/SafetyCenterView';
import { NearbyHelpView } from '@/components/citizen/NearbyHelpView';
import { DisasterSimulator } from '@/components/simulation/DisasterSimulator';

export default function Home() {
  const { activeView, portalMode } = useEmergency();

  return (
    <div className="w-full min-h-full">
      {activeView === 'LANDING' && (
        <>
          <LandingHero />
          <LandingSections />
        </>
      )}

      {activeView === 'CITIZEN' && <CitizenHome />}

      {activeView === 'COMMAND' && (
        <div className="fixed inset-0 z-30 w-screen h-screen overflow-hidden">
          <CommandCenterShell />
        </div>
      )}

      {activeView === 'RESPONDER' && (
        portalMode === 'ADMIN' ? <AdminFleetMovementView /> : <ResponderMobileView />
      )}

      {activeView === 'TRACK' && <TrackEmergencyView />}

      {activeView === 'SAFETY' && <SafetyCenterView />}

      {activeView === 'NEARBY' && <NearbyHelpView />}

      {activeView === 'SIMULATION' && <DisasterSimulator />}
    </div>
  );
}
