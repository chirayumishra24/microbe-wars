'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { FOOD_FACTORY_ITEMS } from '@/data/foodFactory';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { ArrowRight, Check, ChefHat } from 'lucide-react';
import { TurnPill } from '@/components/common/TurnPill';

export const FoodFactoryGame: React.FC = () => {
  const { addScore, markZoneComplete, setStage, teamACorrectCount, teamBCorrectCount } = useGame();

  const [itemIdx, setItemIdx] = useState(0);
  const currentFood = FOOD_FACTORY_ITEMS[itemIdx];

  // Alternates turn: Recipe 0 & 2: Team A, Recipe 1 & 3: Team B
  const currentTeam: 'teamA' | 'teamB' = itemIdx % 2 === 0 ? 'teamA' : 'teamB';

  const [selectedMicrobe, setSelectedMicrobe] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [fermentingAnimation, setFermentingAnimation] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);

  const handleSelectMicrobe = (m: string) => {
    sounds.playClick();
    setSelectedMicrobe(m);
    setFeedback(null);
  };

  const handleSelectProcess = (p: string) => {
    sounds.playClick();
    setSelectedProcess(p);
    setFeedback(null);
  };

  const handleVerifyMatch = () => {
    if (!selectedMicrobe || !selectedProcess) return;

    if (selectedMicrobe === currentFood.correctMicrobe && selectedProcess === currentFood.correctProcess) {
      // Fermentation animation
      setFermentingAnimation(true);
      sounds.playBubble();
      setTimeout(() => sounds.playBubble(), 200);
      setTimeout(() => sounds.playBubble(), 400);
      setTimeout(() => sounds.playCorrect(), 600);

      fireScorePop();
      addScore(100, currentTeam);

      const teamName = currentTeam === 'teamA' ? 'The Explorers' : 'The Guardians';
      const cropText = currentTeam === 'teamA' ? 'Sunflowers Surge!' : 'Corn Crops Surge!';

      setFeedback({
        success: true,
        text: `✓ DELICIOUS SUCCESS! +100 PTS for ${teamName}! ${cropText} ${currentFood.explanation}`
      });

      setTimeout(() => {
        setFermentingAnimation(false);
      }, 1500);

      // Auto-advance after 2.4s
      setTimeout(() => {
        handleNextItem();
      }, 2400);
    } else {
      sounds.playIncorrect();
      setFeedback({
        success: false,
        text: `✕ Recipe mismatched! Try again. Hint: Which microbe thrives on ${currentFood.baseIngredient}?`
      });
    }
  };

  const handleNextItem = () => {
    sounds.playClick();
    if (itemIdx + 1 < FOOD_FACTORY_ITEMS.length) {
      setItemIdx(itemIdx + 1);
      setSelectedMicrobe(null);
      setSelectedProcess(null);
      setFeedback(null);
    } else {
      sounds.playFanfare();
      fireCelebrationConfetti();
      markZoneComplete('bonus');
      setRoundComplete(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>BONUS ROUND</span>
              <span>•</span>
              <span>BENEFICIAL MICROBES IN FOOD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5 flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-amber-600" />
              <span>THE FOOD FACTORY</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <TurnPill currentTeam={currentTeam} teamACount={teamACorrectCount} teamBCount={teamBCorrectCount} />
            <div className="clay-pill text-xs font-black text-amber-800 bg-amber-100 border border-amber-300">
              Recipe {itemIdx + 1} of {FOOD_FACTORY_ITEMS.length}
            </div>
          </div>
        </div>

        {!roundComplete ? (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            {/* Food Product Centerpiece with Fermentation Bubbles */}
            <div className="clay-card p-6 rounded-3xl bg-amber-50/60 border border-amber-200 text-center mb-8 relative overflow-hidden">
              {fermentingAnimation && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-4xl animate-bubble absolute top-10 left-1/4">🫧</span>
                  <span className="text-3xl animate-bubble absolute top-12 right-1/3">🫧</span>
                  <span className="text-5xl animate-bubble absolute top-6 left-1/2">🫧</span>
                </div>
              )}

              <div className="text-6xl sm:text-7xl mb-2 animate-float">
                {currentFood.foodIcon}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {currentFood.foodName}
              </h3>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                Raw Base: <b className="text-amber-800">{currentFood.baseIngredient}</b>
              </div>
            </div>

            {/* Step 1: Select Microorganism */}
            <div className="mb-6">
              <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-white font-black text-xs flex items-center justify-center shadow-xs">1</span>
                <span>Select Responsible Microorganism:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentFood.microbeOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSelectMicrobe(m)}
                    className={`p-4 rounded-2xl text-left font-black text-xs sm:text-sm transition-all flex items-center justify-between ${
                      selectedMicrobe === m
                        ? 'clay-card border-2 border-teal-500 bg-teal-50 text-teal-950 font-black'
                        : 'clay-btn-white text-slate-800 hover:border-teal-400'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMicrobe === m && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Biochemical Process */}
            <div className="mb-6">
              <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">2</span>
                <span>Select Transformation Process:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentFood.processOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectProcess(p)}
                    className={`p-4 rounded-2xl text-left font-black text-xs sm:text-sm transition-all flex items-center justify-between ${
                      selectedProcess === p
                        ? 'clay-card border-2 border-amber-500 bg-amber-50 text-amber-950 font-black'
                        : 'clay-btn-white text-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <span>{p}</span>
                    {selectedProcess === p && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback & Actions */}
            {feedback && (
              <div className={`clay-card p-4 rounded-2xl text-xs sm:text-sm font-semibold mb-6 ${
                feedback.success
                  ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-2 border-rose-400 bg-rose-50 text-rose-950'
              }`}>
                <p>{feedback.text}</p>
                {feedback.success && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleNextItem}
                      className="clay-btn-orange px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      <span>{itemIdx + 1 < FOOD_FACTORY_ITEMS.length ? 'Next Food Item' : 'Complete Food Factory'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {!feedback?.success && (
              <div className="flex justify-end">
                <button
                  disabled={!selectedMicrobe || !selectedProcess}
                  onClick={handleVerifyMatch}
                  className="clay-btn-orange px-8 py-3.5 rounded-2xl text-white font-black text-base disabled:opacity-50 font-heading"
                >
                  Start Fermentation Reaction
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-amber-400 text-center max-w-2xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🥣
            </div>

            <span className="clay-pill text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300">
              Badge Unlocked: Master Fermenter
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              FOOD FACTORY COMPLETED!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
              Your team mastered biotechnology, fermentation, and useful microorganisms in our daily diet!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStage('rapid-fire')}
                className="w-full sm:w-auto clay-btn-orange px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 font-heading"
              >
                <span>ENTER RAPID FIRE ROUND (30 SECONDS!)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
