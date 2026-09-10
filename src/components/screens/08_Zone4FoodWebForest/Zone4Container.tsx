'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti } from '@/utils/confetti';
import { ArrowRight, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { TurnPill } from '@/components/common/TurnPill';

export const Zone4Container: React.FC = () => {
  const { addScore, markZoneComplete, setStage, teamACorrectCount, teamBCorrectCount } = useGame();

  const [screenStage, setScreenStage] = useState<'cycle' | 'scenario' | 'complete'>('cycle');
  const [cycleTurn, setCycleTurn] = useState<'teamA' | 'teamB'>('teamA');

  // Interactive Nutrient Cycle Highlighted Node
  const [activeCycleStep, setActiveCycleStep] = useState<number>(0);

  const cycleNodes = [
    { title: '1. Producers (Plants & Trees)', desc: 'Harness sunlight and soil nutrients to generate living plant biomass.', icon: '🌿' },
    { title: '2. Herbivores (Insects & Rabbits)', desc: 'Graze upon primary producers to acquire fuel and body tissue.', icon: '🐇' },
    { title: '3. Predators (Frogs, Birds & Eagles)', desc: 'Consume herbivores and regulate population balances across trophic tiers.', icon: '🦅' },
    { title: '4. Decomposers (Bacteria & Fungi)', desc: 'Dismantle fallen leaves, feces, and deceased organisms into mineral building blocks.', icon: '🦠' },
    { title: '5. Soil Nutrients (Nitrates & Minerals)', desc: 'Mineralized organic matter is reabsorbed by plant root systems to restart the loop.', icon: '🌱' }
  ];

  // Multi-select Scenario: "What happens if decomposers disappear?"
  const scenarioOptions = [
    { id: 'c1', text: 'Dead material accumulates and piles up across forests and waters', isCorrect: true },
    { id: 'c2', text: 'Nutrient recycling halts, leading to exhausted soil devoid of nitrates', isCorrect: true },
    { id: 'c3', text: 'Plants receive fewer nutrients and begin withering', isCorrect: true },
    { id: 'c4', text: 'The entire ecosystem becomes severely unbalanced and collapses', isCorrect: true },
    { id: 'c5', text: 'Plants miraculously grow twice as large without any soil minerals', isCorrect: false },
    { id: 'c6', text: 'All animals instantly become photosynthetic like trees', isCorrect: false }
  ];

  const [selectedConsequences, setSelectedConsequences] = useState<string[]>([]);
  const [scenarioFeedback, setScenarioFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const toggleConsequence = (id: string) => {
    sounds.playClick();
    if (selectedConsequences.includes(id)) {
      setSelectedConsequences(selectedConsequences.filter(c => c !== id));
    } else {
      setSelectedConsequences([...selectedConsequences, id]);
      setCycleTurn(prev => (prev === 'teamA' ? 'teamB' : 'teamA'));
    }
  };

  const handleSelectCycleNode = (idx: number) => {
    sounds.playClick();
    setActiveCycleStep(idx);
    addScore(20, cycleTurn);
    setCycleTurn(prev => (prev === 'teamA' ? 'teamB' : 'teamA'));
  };

  const handleVerifyScenario = () => {
    const correctIds = scenarioOptions.filter(o => o.isCorrect).map(o => o.id);
    const selectedCorrect = selectedConsequences.filter(id => correctIds.includes(id));
    const selectedIncorrect = selectedConsequences.filter(id => !correctIds.includes(id));

    if (selectedCorrect.length === correctIds.length && selectedIncorrect.length === 0) {
      sounds.playFanfare();
      fireCelebrationConfetti();
      addScore(100, 'teamA');
      addScore(100, 'teamB');
      markZoneComplete('zone4');
      setScenarioFeedback({
        success: true,
        text: '✓ OUTSTANDING ECOLOGICAL DEDUCTION! (+100 PTS to both teams! Crops thrive!) Decomposers are the foundational linchpins of planetary nutrient cycling!'
      });
      setTimeout(() => {
        setScreenStage('complete');
      }, 1800);
    } else {
      sounds.playIncorrect();
      setScenarioFeedback({
        success: false,
        text: '✕ Not quite all selected! Please check all 4 actual ecological catastrophes that occur when decomposers vanish (avoid false assumptions!).'
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>ZONE 4</span>
              <span>•</span>
              <span>MICROORGANISMS IN FOOD WEBS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5">
              FOOD WEB FOREST
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <TurnPill currentTeam={cycleTurn} teamACount={teamACorrectCount} teamBCount={teamBCorrectCount} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreenStage('cycle')}
                className={`px-4 py-2 rounded-2xl font-black transition-all ${
                  screenStage === 'cycle'
                    ? 'clay-btn-emerald text-white'
                    : 'clay-btn-white text-slate-700'
                }`}
              >
                1. Closed Nutrient Cycle
              </button>
              <button
                onClick={() => setScreenStage('scenario')}
                className={`px-4 py-2 rounded-2xl font-black transition-all ${
                  screenStage === 'scenario'
                    ? 'clay-btn-emerald text-white'
                    : 'clay-btn-white text-slate-700'
                }`}
              >
                2. Extinction Scenario
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* PART 1: COMPLETE ECOSYSTEM CLOSED NUTRIENT LOOP */}
        {/* ---------------------------------------------------- */}
        {screenStage === 'cycle' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  THE COMPLETE CIRCLE OF LIFE
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Click any stage in the nutrient loop to see how microorganisms link life and death.
                </p>
              </div>
              <span className="clay-pill text-xs font-black text-teal-800 bg-teal-100 border border-teal-300">
                +20 Pts Per Node
              </span>
            </div>

            {/* Cycle Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
              {cycleNodes.map((node, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCycleNode(idx)}
                  className={`clay-card p-4 rounded-2xl transition-all flex flex-col items-center text-center ${
                    activeCycleStep === idx
                      ? 'border-2 border-teal-500 ring-4 ring-teal-300 scale-105 bg-teal-50/90'
                      : 'bg-white/80 text-slate-700 hover:scale-102'
                  }`}
                >
                  <span className="text-4xl mb-2">{node.icon}</span>
                  <span className="font-black text-xs text-slate-900 leading-tight">{node.title}</span>
                </button>
              ))}
            </div>

            {/* Active Highlight Info Panel */}
            <div className="clay-card p-6 rounded-3xl bg-teal-50/90 border border-teal-300 my-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">{cycleNodes[activeCycleStep].icon}</span>
                <div>
                  <h4 className="text-lg font-black text-slate-900 font-heading">
                    {cycleNodes[activeCycleStep].title}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-teal-950 mt-1">
                    {cycleNodes[activeCycleStep].desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setScreenStage('scenario')}
                className="clay-btn-emerald px-7 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 font-heading"
              >
                <span>Enter Extinction Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PART 2: EXTINCTION SCENARIO (WHAT HAPPENS IF DECOMPOSERS DISAPPEAR?) */}
        {/* ---------------------------------------------------- */}
        {screenStage === 'scenario' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl clay-card bg-rose-100 text-rose-600 border border-rose-300">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    ECOSYSTEM SCENARIO SIMULATION
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    “What happens if all decomposers (bacteria and fungi) disappear from the ecosystem?”
                  </p>
                </div>
              </div>
              <span className="clay-pill text-xs font-black text-amber-800 bg-amber-100">+200 Points</span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-4">
              Select <b>ALL likely real-world consequences</b> that will occur:
            </p>

            <div className="space-y-3 mb-6">
              {scenarioOptions.map((opt) => {
                const isChecked = selectedConsequences.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleConsequence(opt.id)}
                    className={`clay-card p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
                      isChecked
                        ? 'border-2 border-teal-500 bg-teal-50/90 text-teal-950 font-black'
                        : 'bg-white/80 text-slate-800 font-bold hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {scenarioFeedback && (
              <div className={`clay-card p-4 rounded-2xl text-xs sm:text-sm font-semibold mb-6 ${
                scenarioFeedback.success
                  ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-2 border-rose-400 bg-rose-50 text-rose-950'
              }`}>
                {scenarioFeedback.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleVerifyScenario}
                className="clay-btn-emerald px-8 py-3.5 rounded-2xl text-white font-black text-base font-heading"
              >
                Verify Ecological Consequences
              </button>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ZONE 4 COMPLETED CELEBRATION */}
        {/* ---------------------------------------------------- */}
        {screenStage === 'complete' && (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-teal-400 text-center max-w-2xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-teal-100 text-teal-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🕸️
            </div>

            <span className="clay-pill text-xs font-black text-teal-800 uppercase tracking-widest bg-teal-100 border border-teal-300">
              Badge Unlocked: Forest Guardian
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              ZONE 4 COMPLETED!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
              Your team mastered food web dynamics, nutrient cycling loops, and the vital stabilizing power of decomposers!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStage('bonus')}
                className="w-full sm:w-auto clay-btn-emerald px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 font-heading"
              >
                <span>ENTER BONUS ROUND: FOOD FACTORY</span>
                <ArrowRight className="w-4 h-4" />
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
