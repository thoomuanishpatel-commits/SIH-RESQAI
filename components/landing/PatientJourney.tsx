'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CalendarCheck,
  MapPin,
  Stethoscope,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Check,
  ArrowRight,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

interface StepItem {
  num: string;
  title: string;
  description: string;
  perk: string;
  icon: React.ElementType;
  threshold: number;
}

const STEPS: StepItem[] = [
  {
    num: '01',
    title: 'Book Appointment',
    description: 'Call or request online to secure your preferred day and time.',
    perk: 'Instant WhatsApp Confirmation',
    icon: CalendarCheck,
    threshold: 0
  },
  {
    num: '02',
    title: 'Visit the Clinic',
    description: 'Arrive at our clinic; reception completes quick intake.',
    perk: 'Zero-Wait Registration',
    icon: MapPin,
    threshold: 22
  },
  {
    num: '03',
    title: 'Dental Consultation',
    description: 'Doctor examines teeth, gums, and listens to your concerns.',
    perk: 'Unhurried Examination',
    icon: Stethoscope,
    threshold: 45
  },
  {
    num: '04',
    title: 'Diagnosis & Plan',
    description: 'We explain our findings and discuss treatment choices transparently.',
    perk: 'Clear Cost Transparency',
    icon: FileCheck2,
    threshold: 68
  },
  {
    num: '05',
    title: 'Begin Treatment',
    description: 'Gentle, comfortable procedure with personalized post-care tips.',
    perk: 'Gentle Aftercare Support',
    icon: Sparkles,
    threshold: 90
  }
];

export const PatientJourney: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const navOffset = 68; // height of top navigation

      if (window.innerWidth >= 1024) {
        // Desktop Sticky Scroll Math
        const scrollableDistance = rect.height - (window.innerHeight - navOffset);
        const currentScroll = navOffset - rect.top;
        const rawProgress = scrollableDistance > 0 ? (currentScroll / scrollableDistance) * 100 : 0;
        const clampedProgress = Math.min(100, Math.max(0, rawProgress));
        setProgress(clampedProgress);
      } else {
        // Mobile / Tablet: Viewport Entry Calculation
        const windowHeight = window.innerHeight;
        const startOffset = windowHeight * 0.85; // starts filling as element enters lower screen
        const endOffset = windowHeight * 0.15;   // finishes as it passes top
        const totalDistance = rect.height + (startOffset - endOffset);
        const currentDistance = startOffset - rect.top;
        const rawMobileProgress = (currentDistance / totalDistance) * 100;
        const clampedMobileProgress = Math.min(100, Math.max(0, rawMobileProgress));
        setProgress(clampedMobileProgress);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll(); // Initial measure

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Determine the active milestone index (highest step threshold passed)
  const activeMilestoneIndex = STEPS.reduce((acc, step, index) => {
    return progress >= step.threshold ? index : acc;
  }, 0);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-slate-50 text-slate-900 lg:h-[250vh]"
      id="patient-journey"
    >
      {/* Sticky Container for Desktop / Fluid Wrapper for Mobile */}
      <div className="w-full lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] flex flex-col justify-between py-10 lg:py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto overflow-hidden">
        
        {/* Background Soft Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-100/60 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-cyan-100/50 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-6 lg:mb-4 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs mb-3 text-blue-700 font-semibold text-xs tracking-wide">
            <HeartPulse className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>PATIENT-FIRST CARE PATHWAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Your Seamless <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Patient Journey</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto font-normal">
            From initial booking to personalized aftercare—discover every milestone designed for comfort, clarity, and unhurried clinical excellence.
          </p>
        </div>

        {/* 2. DESKTOP TIMELINE HEADER & PROGRESS BEAM (Hidden on mobile, visible lg+) */}
        <div className="hidden lg:block relative w-full my-4 px-2 select-none shrink-0">
          <div className="relative w-full h-12 flex items-center">
            
            {/* Background Base Track Line (Spans between 10% and 90% across 5 nodes) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-1.5 bg-slate-200/90 rounded-full" />

            {/* Glowing Gradient Active Fill Line */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-[10%] h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_20px_rgba(37,99,235,0.75)]"
              style={{
                width: `${(progress / 100) * 80}%`,
                maxWidth: '80%'
              }}
            />

            {/* Moving Glowing Beacon Dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150 ease-out pointer-events-none z-20"
              style={{
                left: `${10 + (progress / 100) * 80}%`
              }}
            >
              {/* Outer pulsing ring */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-cyan-400/40 animate-ping" />
                <span className="relative w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 ring-2 ring-white shadow-lg flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>
            </div>

            {/* 5 Milestone Nodes Spaced Evenly */}
            <div className="relative w-full grid grid-cols-5 z-10">
              {STEPS.map((step, idx) => {
                const isPassed = progress >= step.threshold;
                const isCurrent = activeMilestoneIndex === idx;

                return (
                  <div key={step.num} className="flex flex-col items-center justify-center group">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 relative shadow-sm ${
                        isPassed
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-blue-500/25'
                          : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                      }`}
                    >
                      {/* Active beacon ping on the currently active step */}
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full border-2 border-cyan-400 animate-pulse" />
                      )}

                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{step.num}</span>
                      )}
                    </div>

                    {/* Step Title Label below node */}
                    <span
                      className={`mt-2 text-xs font-semibold tracking-tight transition-colors duration-200 ${
                        isPassed ? 'text-blue-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar (Visible < lg) */}
        <div className="lg:hidden w-full mb-6 px-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>CARE PROGRESS</span>
            <span className="text-blue-600 font-mono font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 3. 5-COLUMN INTERACTIVE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3.5 my-auto">
          {STEPS.map((step, idx) => {
            const isActive = progress >= step.threshold;
            const isCurrent = activeMilestoneIndex === idx;
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`relative flex flex-col justify-between p-5 rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 select-none overflow-hidden ${
                  isActive
                    ? 'border-blue-300/90 shadow-[0_14px_34px_-10px_rgba(37,99,235,0.18)] lg:-translate-y-2 ring-1 ring-blue-400/20'
                    : 'border-slate-200/80 shadow-xs hover:border-slate-300 opacity-90 lg:opacity-75'
                }`}
              >
                {/* Top Accent Gradient Bar when active */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 animate-in fade-in duration-300" />
                )}

                {/* Card Upper Segment: Icon + Counter Pill */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                      )}
                      <span
                        className={`text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        Step {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-base font-bold tracking-tight mb-2 transition-colors duration-200 ${
                      isActive ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Card Bottom Segment: Perk Badge */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl w-full transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-700 border border-blue-200/60'
                        : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                    }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{step.perk}</span>
                  </div>
                </div>

                {/* Subtle active status indicator dot at bottom right */}
                {isCurrent && (
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        {/* 4. FOOTER / SCROLL HINT (Desktop) */}
        <div className="hidden lg:flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-slate-200/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>INTERACTIVE TIMELINE LOCK</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Scroll down to advance journey milestones</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
          </div>

          <div className="text-right">
            <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
            <span className="text-slate-400"> / 100% COMPLETED</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PatientJourney;
