import type { Metadata } from 'next';
import { SafetyCenterView } from '@/components/safety-center/SafetyCenterView';

export const metadata: Metadata = {
  title: 'RESQAI SAFETY CENTER — Interactive Disaster Preparedness & Survival Training',
  description: 'Know what to do before you need to. Interactive visual disaster-preparedness and survival training center for earthquakes, floods, fires, cyclones, and 15 catastrophic emergencies. Pan-India 112 emergency reference.',
};

export default function DisasterGuidePage() {
  return <SafetyCenterView />;
}
