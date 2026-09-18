'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/data/safetyGuideData';

interface SafetyQuizSimulatorProps {
  dict: {
    whatWouldYouDo: string;
    safetyScore: string;
  };
}

export const SafetyQuizSimulator = ({ dict }: SafetyQuizSimulatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId) return; // Prevent changing after answer
    setSelectedOptionId(optionId);
    setAnsweredCount((prev) => prev + 1);

    const option = currentQ.options.find((o) => o.id === optionId);
    if (option?.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setShowSummary(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setAnsweredCount(0);
    setShowSummary(false);
  };

  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              INTERACTIVE DECISION DRILL
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              {dict.whatWouldYouDo}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {!showSummary ? (
          <div className="space-y-6">
            {/* Scenario Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
                SCENARIO BRIEFING
              </span>
              <p className="text-sm font-semibold text-slate-200 mb-3 leading-relaxed">
                "{currentQ.scenario}"
              </p>
              <h4 className="text-base sm:text-lg font-black text-white">
                {currentQ.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850';

                if (selectedOptionId) {
                  if (opt.isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50';
                  } else if (isSelected && !opt.isCorrect) {
                    optStyle = 'bg-red-950/40 border-red-500 text-red-100 ring-1 ring-red-500/50';
                  } else {
                    optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={selectedOptionId !== null}
                    className={`w-full text-left p-4 rounded-xl border font-semibold text-xs sm:text-sm transition flex items-start justify-between gap-3 ${optStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs font-bold shrink-0 text-slate-300">
                        {opt.id.toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {selectedOptionId && (
                      <span className="shrink-0 pt-0.5">
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback message upon selection */}
            {selectedOptionId && selectedOption && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-fadeIn ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/30 border-red-500/40 text-red-200'
                }`}
              >
                <div className="font-black uppercase tracking-wider flex items-center gap-2">
                  {selectedOption.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>EXCELLENT DECISION! (CORRECT)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>HAZARDOUS CHOICE! (INCORRECT)</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedOption.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition"
                  >
                    <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Safety Score'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SUMMARY SCORE SCREEN */
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-500/40 mx-auto flex items-center justify-center text-blue-400">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                {dict.safetyScore}
              </span>
              <h4 className="text-4xl font-black text-white">
                {score} / {QUIZ_QUESTIONS.length}
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {score === QUIZ_QUESTIONS.length
                  ? 'Outstanding! You demonstrated flawless instinct under simulated disaster pressure.'
                  : score >= QUIZ_QUESTIONS.length / 2
                  ? 'Good situational awareness! Review the disaster guides to reinforce weaker areas.'
                  : 'Critical gaps detected in emergency decision-making. Please study the step-by-step guides above.'}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-lg mx-auto text-xs text-slate-400 flex items-start gap-2.5 text-left">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Simulation Only:</strong> This drill tests basic NDMA/FEMA citizen safety guidelines. It does not qualify the participant for professional civil defense or paramedic operations.
              </span>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wide transition border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Drill Simulator</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
