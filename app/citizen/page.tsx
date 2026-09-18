import { Metadata } from 'next';
import { CitizenPortalView } from '@/components/citizen/CitizenPortalView';

export const metadata: Metadata = {
  title: 'Citizen Emergency & SOS Safety Portal | TSDMA ResQAI',
  description: 'Instant disaster SOS reporting with Google Gemini 2.5 Flash Vision verification, real-time live GPS detection, and public evacuation mapping.'
};

interface CitizenPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CitizenPage({ searchParams }: CitizenPageProps) {
  const incidentParam = searchParams.incident;
  const initialIncidentId = typeof incidentParam === 'string' ? incidentParam : null;

  return <CitizenPortalView initialIncidentId={initialIncidentId} />;
}
