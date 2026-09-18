import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
import { EmergencyProvider } from '@/context/EmergencyContext';
import { Navbar } from '@/components/common/Navbar';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmergencyTopBar } from '@/components/safety-center/EmergencyTopBar';
import { SosModal } from '@/components/citizen/SosModal';

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'RESQAI — AI Emergency & Disaster Response App',
  description: 'Production emergency operations center and citizen distress platform. Detect, Understand, Respond, Recover.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RESQAI'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-rose-500/30 selection:text-rose-200">
        <EmergencyProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-rose-600 focus:text-white focus:rounded-lg font-mono text-xs"
          >
            Skip to Emergency Content
          </a>
          <EmergencyTopBar />
          <OfflineBanner />
          <Navbar />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <SosModal />
        </EmergencyProvider>
      </body>
    </html>
  );
}
