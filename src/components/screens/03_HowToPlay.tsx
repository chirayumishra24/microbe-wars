'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { Gamepad2, Brain, Trophy, ArrowRight, Sprout } from 'lucide-react';
import { sounds } from '@/utils/audio';

export const HowToPlayScreen: React.FC = () => {
  const { setStage } = useGame();

  const handleLetsGo = () => {
    sounds.playCorrect();
    setStage('map');
  };

  const steps = [
    {
      icon: <Gamepad2 className="w-8 h-8 text-teal-600" />,
      title: 'Complete Mini-Games',
      desc: 'Investigate microscopic organisms, sort classifications, connect food chains, and solve decomposition mysteries.',
      badge: 'Interactive Challenges',
    },
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: 'Answer Quizzes',
      desc: 'Test your scientific knowledge in True/False challenges, Rapid Fire timed rounds, and high-stakes Risk wagers.',
      badge: 'Scientific Logic',
    },
    {
      icon: <Sprout className="w-8 h-8 text-emerald-600" />,
      title: 'Grow Your Team’s Crops',
      desc: 'Every correct answer feeds your 3D garden plot! The team with more right answers grows taller, healthier, blooming crops.',
      badge: 'Live 3D Crop Growth',
    },
    {
      icon: <Trophy className="w-8 h-8 text-amber-600" />,
      title: 'Beat The Opposing Team',
      desc: 'Team A (The Explorers) vs Team B (The Guardians). Highest score and healthiest garden wins the Microbe Wars crown!',
      badge: 'Victory Fanfare',
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col items-center text-center z-10 my-auto">
        
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <span className="clay-pill px-3.5 py-1 text-[11px] font-black tracking-widest text-emerald-900 uppercase">
            Rules & Mechanics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 font-heading tracking-tight">
            HOW TO PLAY
          </h2>
          <p className="text-slate-700 font-bold text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            Simple rules, thrilling science competition! Complete the zones to grow your crops, heal the ecosystem, and take home the crown.
          </p>
        </div>

        {/* 4 Clay Cards Grid - 4 Columns Across Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full mb-3.5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="clay-card p-4 sm:p-5 text-left flex flex-col justify-between hover:scale-102 transition-transform shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    {step.icon}
                  </div>
                  <span className="clay-pill text-[10px] font-black px-2.5 py-0.5 text-slate-700">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading mb-1.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Strict Tournament Rule: Questions Do Not Repeat */}
        <div className="clay-card w-full p-3 sm:p-3.5 mb-3.5 border-2 border-amber-400 bg-amber-50/95 flex items-center gap-3 text-left shadow-sm">
          <div className="p-2 rounded-xl bg-amber-500 text-white font-black text-lg flex-shrink-0 shadow-xs">
            🔒
          </div>
          <div className="flex-1">
            <div className="font-heading text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5">
              <span>CRITICAL TOURNAMENT RULE: Questions Never Repeat!</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900 font-semibold mt-0.5 leading-normal">
              Every specimen mystery, classification puzzle, food web link, and quiz question is unique and will <b className="text-amber-950 font-black underline">NEVER repeat</b> during the tournament. Once played, each challenge is permanently locked!
            </p>
          </div>
        </div>

        {/* Bottom Bar: Points Breakdown + Primary CTA */}
        <div className="clay-card w-full p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
          {/* Point Breakdown */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs font-bold text-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-xs" />
              <span>Lab: <b className="text-slate-900 font-black">+100 pts</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <span>Chains & Webs: <b className="text-slate-900 font-black">+150-200 pts</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
              <span>Rapid Fire: <b className="text-slate-900 font-black">+50 pts/ea</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
              <span>Final Challenge: <b className="text-slate-900 font-black">+500 pts</b></span>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleLetsGo}
            className="clay-btn-emerald px-8 py-2.5 sm:px-10 sm:py-3 text-sm sm:text-base font-black flex items-center gap-2 font-heading tracking-wide flex-shrink-0 shadow-lg hover:scale-103"
          >
            <span>LET’S GO!</span>
            <ArrowRight className="w-4 h-4 sm:w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
