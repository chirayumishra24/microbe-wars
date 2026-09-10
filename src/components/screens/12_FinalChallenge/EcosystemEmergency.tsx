'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { FINAL_EMERGENCY_STEPS, FinalEmergencyStep } from '@/data/questions';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight, Trees } from 'lucide-react';
import { TurnPill } from '@/components/common/TurnPill';

export const EcosystemEmergency: React.FC = () => {
  const { addScore, markZoneComplete, setStage, teamACorrectCount, teamBCorrectCount } = useGame();

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Turn alternates per emergency stage
  const currentTeam: 'teamA' | 'teamB' = stepIdx % 2 === 0 ? 'teamA' : 'teamB';
  const teamName = currentTeam === 'teamA' ? 'The Explorers' : 'The Guardians';

  const currentStep: FinalEmergencyStep = FINAL_EMERGENCY_STEPS[stepIdx];
  const totalSteps = FINAL_EMERGENCY_STEPS.length;
  const healthPercent = Math.round(((stepIdx + (isCompleted ? 1 : 0)) / totalSteps) * 100);

  const handleAnswer = (choiceIdx: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIdx);

    const isCorrect = choiceIdx === currentStep.correctIndex;

    if (isCorrect) {
      sounds.playEnergyWhoosh();
      fireScorePop();
      addScore(100, currentTeam); // 100 pts per stage + crops grow for current team!
      const cropText = currentTeam === 'teamA' ? 'Sunflowers Surge!' : 'Corn Crops Surge!';
      setStepFeedback(`✓ HEALING INITIATED! (+100 PTS to ${teamName} • ${cropText}) ${currentStep.restorationEffect}`);
    } else {
      sounds.playIncorrect();
      setStepFeedback(`✕ Not the optimal restoration response! Please analyze how microorganisms support this specific layer.`);
    }
  };

  const handleNextStep = () => {
    sounds.playClick();
    if (stepIdx + 1 < totalSteps) {
      setStepIdx(stepIdx + 1);
      setSelectedChoice(null);
      setStepFeedback(null);
    } else {
      sounds.playFanfare();
      fireCelebrationConfetti();
      addScore(250, 'teamA');
      addScore(250, 'teamB'); // Grand finale bonus shared!
      markZoneComplete('finalChallenge');
      setIsCompleted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>FINAL CLIMAX • SAVE THE ECOSYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5">
              ECOSYSTEM EMERGENCY 🚨
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <TurnPill currentTeam={currentTeam} teamACount={teamACorrectCount} teamBCount={teamBCorrectCount} />
            <span className="clay-pill text-xs font-black text-amber-800 bg-amber-100 border border-amber-300">
              Phase {stepIdx + 1} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Dynamic Environment Visual Canvas (Damaged ➔ Restored Transition) */}
        <div className="clay-card rounded-3xl overflow-hidden mb-8 border-2 border-emerald-200">
          
          {/* Environment Scenic Backdrop */}
          <div
            className="h-44 sm:h-56 w-full relative flex items-center justify-center transition-all duration-1000"
            style={{
              background: healthPercent >= 80
                ? 'linear-gradient(to bottom, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)' // Lush vibrant nature
                : healthPercent >= 40
                ? 'linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 50%, #BAE6FD 100%)' // Partially healing
                : 'linear-gradient(to bottom, #FEE2E2 0%, #FED7AA 50%, #E2E8F0 100%)' // Murky damaged crisis
            }}
          >
            {/* Visual Nature Elements reacting to restoration */}
            <div className="flex items-center gap-4 sm:gap-8 z-10 text-center px-4">
              
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl transition-transform duration-700 hover:scale-110">
                  {healthPercent >= 60 ? '🌳' : healthPercent >= 20 ? '🌲' : '🪵'}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1">Flora</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl transition-transform duration-700 hover:scale-110">
                  {healthPercent >= 80 ? '🦌' : healthPercent >= 40 ? '🐇' : '🥀'}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1">Fauna</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl transition-transform duration-700 hover:scale-110">
                  {healthPercent >= 60 ? '🐟' : healthPercent >= 30 ? '🐸' : '☣️'}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1">Water Quality</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl transition-transform duration-700 hover:scale-110">
                  {healthPercent >= 40 ? '🦠' : '⚠️'}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1">Microbe Loam</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl transition-transform duration-700 hover:scale-110">
                  {healthPercent >= 100 ? '🦅' : healthPercent >= 80 ? '🐦' : '💨'}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1">Apex Trophic</span>
              </div>

            </div>

            {/* Environmental Status Floating Badge */}
            <div className="absolute top-3 left-4 clay-pill px-3 py-1 bg-white/90 border border-slate-300 text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-sm">
              <span>Status:</span>
              <span className={healthPercent >= 80 ? 'text-emerald-700 font-black' : healthPercent >= 40 ? 'text-teal-700 font-black' : 'text-rose-600 font-black'}>
                {healthPercent >= 100 ? 'PRISTINE & HEALTHY' : healthPercent >= 40 ? 'PARTIALLY RESTORED' : 'DAMAGED ECOSYSTEM'}
              </span>
            </div>
          </div>

          {/* Environmental Health Level Bar */}
          <div className="p-4 bg-emerald-50/80 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-600" />
              <span>Biotic Recovery Health:</span>
              <span className="text-emerald-800 font-mono text-sm">{healthPercent}%</span>
            </div>

            <div className="w-full sm:w-64 bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-700"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Phase Questions Console */}
        {!isCompleted ? (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="mb-4">
              <span className="clay-pill text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300">
                {currentStep.title}
              </span>
            </div>

            {/* Problem Brief */}
            <div className="clay-card p-4 rounded-2xl bg-rose-50 border border-rose-300 mb-6 text-xs sm:text-sm text-rose-950 font-semibold">
              <b className="text-rose-700">🚨 Ecological Threat:</b> {currentStep.problem}
            </div>

            {/* Question */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mb-6">
              {currentStep.question}
            </h3>

            {/* Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentStep.options.map((opt, idx) => {
                const isSelected = selectedChoice === idx;
                const isCorrect = idx === currentStep.correctIndex;

                return (
                  <button
                    key={idx}
                    disabled={selectedChoice !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-2xl text-left font-black text-xs sm:text-sm transition-all flex items-center justify-between ${
                      selectedChoice === null
                        ? 'clay-btn-white text-slate-800 hover:border-emerald-400'
                        : isCorrect
                        ? 'clay-card border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-black'
                        : isSelected
                        ? 'clay-card border-2 border-rose-400 bg-rose-50 text-rose-950 font-black'
                        : 'clay-card opacity-50 bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedChoice !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />}
                    {selectedChoice === idx && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Proceed Button */}
            {stepFeedback && (
              <div className="clay-card p-4 rounded-2xl text-slate-800 text-xs sm:text-sm font-semibold">
                <p>{stepFeedback}</p>
                {selectedChoice === currentStep.correctIndex && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleNextStep}
                      className="clay-btn-emerald px-6 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      <span>{stepIdx + 1 < totalSteps ? 'Proceed to Next Crisis' : 'Unlock Final Restoration!'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-emerald-400 text-center max-w-2xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🌍
            </div>

            <span className="clay-pill text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 border border-emerald-300">
              Badge Unlocked: Savior of Nature (+500 PTS)
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              ECOSYSTEM FULLY SAVED!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto leading-relaxed">
              Through microbial soil enrichment, trophic level realignment, and nutrient cycle restoration, the biosphere is thriving in harmonious balance!
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setStage('final-score')}
                className="clay-btn-orange px-10 py-4 rounded-3xl text-white font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3 font-heading"
              >
                <span>REVEAL FINAL SCOREBOARD & CHAMPION</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
