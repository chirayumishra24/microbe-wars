'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { DECAY_TIMELINE, DECAY_INVESTIGATION_CLUES } from '@/data/decayStages';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const Zone3Container: React.FC = () => {
  const { addScore, markZoneComplete, setStage } = useGame();

  const [currentDayIndex, setCurrentDayIndex] = useState(0); // 0 = Day 1, 1 = Day 3, 2 = Day 7, 3 = Day 14
  const currentStep = DECAY_TIMELINE[currentDayIndex];

  // Stage in investigation: 'timeline' | 'quiz1' | 'quiz2' | 'clues' | 'complete'
  const [investigationStage, setInvestigationStage] = useState<'timeline' | 'quiz1' | 'quiz2' | 'clues' | 'complete'>('timeline');

  // Quiz 1: What is causing the decay?
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q1Feedback, setQ1Feedback] = useState<string | null>(null);

  // Quiz 2: Which microorganisms are involved?
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [q2Feedback, setQ2Feedback] = useState<string | null>(null);

  // Clues revealed state
  const [revealedClues, setRevealedClues] = useState<number[]>([1]);

  const handleTimelineChange = (idx: number) => {
    sounds.playClick();
    setCurrentDayIndex(idx);
  };

  const handleAnswerQ1 = (idx: number) => {
    if (q1Answer !== null) return;
    setQ1Answer(idx);

    if (idx === 0) {
      // Microorganisms (Bacteria & Fungi)
      sounds.playCorrect();
      fireScorePop();
      addScore(100);
      setQ1Feedback('✓ CORRECT! (+100 PTS) Decomposition is actively driven by bacteria and fungi secreting digestive enzymes to break down organic compounds.');
    } else {
      sounds.playIncorrect();
      setQ1Feedback('✕ Incorrect! While weather contributes moisture and heat, microscopic bacteria and fungi do the actual biochemical decomposition.');
    }
  };

  const handleAnswerQ2 = (idx: number) => {
    if (q2Answer !== null) return;
    setQ2Answer(idx);

    if (idx === 1) {
      // Bacteria & Fungi
      sounds.playCorrect();
      fireScorePop();
      addScore(100);
      setQ2Feedback('✓ SPOT ON! (+100 PTS) Bacteria and fungal mold are the primary decomposers on land, unlocking trapped minerals and feeding the soil!');
    } else {
      sounds.playIncorrect();
      setQ2Feedback('✕ Not quite! Bacteria and Fungi are the true microscopic recyclers responsible for organic decay.');
    }
  };

  const handleRevealClue = (id: number) => {
    sounds.playClick();
    if (!revealedClues.includes(id)) {
      setRevealedClues([...revealedClues, id]);
    }
  };

  const handleFinishInvestigation = () => {
    sounds.playFanfare();
    fireCelebrationConfetti();
    addScore(200);
    markZoneComplete('zone3');
    setInvestigationStage('complete');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>ZONE 3</span>
              <span>•</span>
              <span>MICROORGANISMS & DECAY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5">
              DECAY DETECTIVE
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setInvestigationStage('timeline')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                investigationStage === 'timeline'
                  ? 'clay-btn-orange text-white'
                  : 'clay-btn-white text-slate-700'
              }`}
            >
              1. Decay Time-Lapse
            </button>
            <button
              onClick={() => setInvestigationStage('quiz1')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                investigationStage === 'quiz1' || investigationStage === 'quiz2'
                  ? 'clay-btn-orange text-white'
                  : 'clay-btn-white text-slate-700'
              }`}
            >
              2. Scientific Questions
            </button>
            <button
              onClick={() => setInvestigationStage('clues')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                investigationStage === 'clues'
                  ? 'clay-btn-orange text-white'
                  : 'clay-btn-white text-slate-700'
              }`}
            >
              3. Detective Clues
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* STEP 1: INTERACTIVE TIMELINE SCRUBBER */}
        {/* ---------------------------------------------------- */}
        {investigationStage === 'timeline' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  TIME-LAPSE INVESTIGATION
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Drag or click the days below to watch how microorganisms break down an apple left in an outdoor forest.
                </p>
              </div>
              <span className="clay-pill text-xs font-black text-amber-800 bg-amber-100 border border-amber-300">
                Observational Science
              </span>
            </div>

            {/* Timeline Slider Buttons */}
            <div className="clay-card flex items-center justify-between gap-2 max-w-xl mx-auto my-6 p-2 rounded-2xl bg-amber-50/60">
              {DECAY_TIMELINE.map((step, idx) => (
                <button
                  key={step.day}
                  onClick={() => handleTimelineChange(idx)}
                  className={`flex-1 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                    currentDayIndex === idx
                      ? 'clay-btn-orange text-white scale-102'
                      : 'clay-btn-white text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Day {step.day}</span>
                </button>
              ))}
            </div>

            {/* Time-Lapse Apple Visual Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
              
              {/* Illustrated Decaying Apple SVG */}
              <div className="clay-card flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-200 relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  
                  {/* Apple Stem & Leaf */}
                  <div className="absolute top-2 w-2.5 h-10 bg-amber-900 rounded-t-full -rotate-12" />
                  {currentStep.day < 7 && (
                    <div className="absolute top-3 left-28 w-8 h-4 bg-emerald-500 rounded-full rotate-45 shadow-sm" />
                  )}

                  {/* Apple Body Shape - Morphs color and wrinkles with days */}
                  <div
                    className="w-36 h-36 rounded-full transition-all duration-700 relative shadow-clay overflow-hidden"
                    style={{
                      backgroundColor: currentStep.appleVisual.color,
                      transform: `scale(${1 - currentDayIndex * 0.08})`,
                      borderRadius: currentDayIndex === 3 ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '50%'
                    }}
                  >
                    {/* Mold patches */}
                    {currentStep.appleVisual.moldCoverage > 0 && (
                      <div
                        className="absolute inset-0 bg-emerald-950/40 transition-opacity duration-700 flex flex-wrap gap-1 p-2 items-center justify-center"
                        style={{ opacity: currentStep.appleVisual.moldCoverage / 100 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-600/70 blur-xs" />
                        <div className="w-10 h-10 rounded-full bg-teal-500/60 blur-xs" />
                        <div className="w-6 h-6 rounded-full bg-slate-200/80 blur-xs" />
                        {currentStep.appleVisual.sporesVisible && (
                          <span className="text-xs">🍄 🦠</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-base font-black text-slate-900 font-heading">
                    {currentStep.title}
                  </div>
                  <div className="text-xs text-amber-700 font-black mt-0.5">
                    Texture: {currentStep.appleVisual.softness} • Mold: {currentStep.appleVisual.moldCoverage}%
                  </div>
                </div>
              </div>

              {/* Biological Observations */}
              <div className="space-y-4">
                <div className="clay-card p-4 rounded-2xl bg-white/90">
                  <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">
                    Visual Observation
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                <div className="clay-card p-4 rounded-2xl bg-white/90">
                  <div className="text-xs font-black text-teal-700 uppercase tracking-wider mb-1">
                    Microscopic Activity
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    {currentStep.microbeActivity}
                  </p>
                </div>

                <div className="clay-card p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300">
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
                    Nutrient Return To Soil
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                    {currentStep.soilImpact}
                  </p>
                </div>
              </div>

            </div>

            {/* Next Action */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setInvestigationStage('quiz1')}
                className="clay-btn-orange px-7 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 font-heading"
              >
                <span>Proceed to Investigation Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 2: INVESTIGATION QUESTIONS */}
        {/* ---------------------------------------------------- */}
        {(investigationStage === 'quiz1' || investigationStage === 'quiz2') && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-4">
              <span className="clay-pill text-xs font-black text-amber-800 bg-amber-100 border border-amber-300">
                {investigationStage === 'quiz1' ? 'Question 1 of 2' : 'Question 2 of 2'}
              </span>
              <span className="clay-pill text-xs font-black text-amber-800 bg-amber-100">+100 Points</span>
            </div>

            {investigationStage === 'quiz1' ? (
              <div className="max-w-2xl mx-auto py-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading text-center mb-6">
                  What is the primary cause of the apple’s decay?
                </h3>

                <div className="space-y-3 mb-6">
                  {[
                    'Microorganisms (Bacteria and Fungi) digesting the organic tissue',
                    'Wind blowing the apple skin away',
                    'Sunlight burning the apple into charcoal',
                    'Pure water evaporation with no living organisms'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={q1Answer !== null}
                      onClick={() => handleAnswerQ1(idx)}
                      className={`w-full p-4 rounded-2xl text-left font-black text-sm transition-all flex items-center justify-between ${
                        q1Answer === null
                          ? 'clay-btn-white text-slate-800 hover:border-amber-400'
                          : idx === 0
                          ? 'clay-card border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                          : q1Answer === idx
                          ? 'clay-card border-2 border-red-400 bg-red-50 text-red-950'
                          : 'clay-card opacity-50 bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {q1Answer !== null && idx === 0 && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {q1Answer === idx && idx !== 0 && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                  ))}
                </div>

                {q1Feedback && (
                  <div className="clay-card p-4 rounded-2xl text-slate-800 text-xs sm:text-sm font-semibold">
                    <p>{q1Feedback}</p>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => setInvestigationStage('quiz2')}
                        className="clay-btn-orange px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto py-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading text-center mb-6">
                  Which specific microorganisms are mainly involved in this decomposition?
                </h3>

                <div className="space-y-3 mb-6">
                  {[
                    'Only Viruses that cause plant diseases',
                    'Decomposing Bacteria and Fungi (Mold/Mildew)',
                    'Micro-algae performing photosynthesis',
                    'Marine rotifers only'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={q2Answer !== null}
                      onClick={() => handleAnswerQ2(idx)}
                      className={`w-full p-4 rounded-2xl text-left font-black text-sm transition-all flex items-center justify-between ${
                        q2Answer === null
                          ? 'clay-btn-white text-slate-800 hover:border-amber-400'
                          : idx === 1
                          ? 'clay-card border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                          : q2Answer === idx
                          ? 'clay-card border-2 border-red-400 bg-red-50 text-red-950'
                          : 'clay-card opacity-50 bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {q2Answer !== null && idx === 1 && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {q2Answer === idx && idx !== 1 && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                  ))}
                </div>

                {q2Feedback && (
                  <div className="clay-card p-4 rounded-2xl text-slate-800 text-xs sm:text-sm font-semibold">
                    <p>{q2Feedback}</p>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => setInvestigationStage('clues')}
                        className="clay-btn-orange px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <span>Continue to Clue Analysis</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: DECAY INVESTIGATION CLUES */}
        {/* ---------------------------------------------------- */}
        {investigationStage === 'clues' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  DETECTIVE CASE SUMMARY: DECOMPOSERS IDENTIFIED
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Review the forensic environmental evidence gathered during decomposition.
                </p>
              </div>
              <span className="clay-pill text-xs font-black text-amber-700 bg-amber-100">+200 Points Bonus</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {DECAY_INVESTIGATION_CLUES.map((clue) => {
                const isRevealed = revealedClues.includes(clue.id);

                return (
                  <div
                    key={clue.id}
                    onClick={() => handleRevealClue(clue.id)}
                    className={`clay-card p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      isRevealed
                        ? 'border-2 border-amber-400 bg-amber-50/80 text-slate-900'
                        : 'border-2 border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{clue.icon}</span>
                    <div>
                      <div className="text-xs font-black text-amber-700 uppercase">
                        Evidence #{clue.id} {isRevealed ? '• VERIFIED' : '• UNVERIFIED'}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold mt-1 text-slate-800">
                        {isRevealed ? clue.clueText : 'Click to inspect forensic laboratory sample.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="clay-card p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-xs sm:text-sm text-emerald-950 leading-relaxed mb-6 font-semibold">
              <span className="font-black text-emerald-900 block mb-1">🔍 Key Scientific Conclusion:</span>
              Microorganisms are the indispensable clean-up crew of our biosphere. Through decay, complex dead organic compounds are dismantled into elemental nitrates, phosphates, and humus, allowing new generations of plants to flourish!
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFinishInvestigation}
                className="clay-btn-orange px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center gap-2 font-heading"
              >
                <span>Complete Zone 3</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ZONE 3 COMPLETED CELEBRATION */}
        {/* ---------------------------------------------------- */}
        {investigationStage === 'complete' && (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-amber-400 text-center max-w-2xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🍂
            </div>

            <span className="clay-pill text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300">
              Badge Unlocked: Decay Sleuth
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              ZONE 3 COMPLETED!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
              Your team solved the decay mystery and demonstrated how microorganisms recycle nutrients back into living soil!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStage('zone-4')}
                className="w-full sm:w-auto clay-btn-emerald px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 font-heading"
              >
                <span>ENTER ZONE 4: FOOD WEB FOREST</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setStage('map')}
                className="w-full sm:w-auto clay-btn-white px-6 py-3.5 rounded-2xl text-slate-800 font-black text-base"
              >
                View Game Map
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
