'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { MicrobeScene } from '@/components/3d/MicrobeScene';
import { Play, Sparkles, Shield, Compass, Sprout, Rotate3D } from 'lucide-react';
import { sounds } from '@/utils/audio';

export const StartScreen: React.FC = () => {
  const { setStage } = useGame();

  const handleStart = () => {
    sounds.playCorrect();
    sounds.startBgm();
    setStage('team-selection');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="max-w-4xl w-full flex flex-col items-center text-center z-10">
        
        {/* Mascots Face-off Banner with Live 3D Biological Models */}
        <div className="flex items-center justify-center gap-6 sm:gap-14 mb-6 sm:mb-8">
          
          {/* Team A 3D Model Card */}
          <div className="flex flex-col items-center animate-float">
            <div className="clay-card-blue p-3.5 sm:p-4 flex flex-col items-center">
              <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden bg-slate-950 border-4 border-white shadow-2xl flex items-center justify-center relative ring-4 ring-blue-300">
                <MicrobeScene type="bacteria" color="#34D399" className="w-full h-full" />
              </div>
            </div>
            <div className="clay-pill mt-3 px-3.5 py-1 text-xs font-black text-blue-800 uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>The Explorers</span>
            </div>
            <span className="text-[10px] font-bold text-blue-700/90 mt-1 flex items-center gap-1">
              <Rotate3D className="w-3 h-3 text-blue-600 inline" />
              <span>3D Live Bacillus</span>
            </span>
          </div>

          {/* VS Clay Clash Emblem */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25 text-white font-black text-2xl sm:text-3xl rotate-6 animate-pulse border-2 border-white/60">
              VS
            </div>
            <div className="clay-pill mt-3 px-2.5 py-0.5 text-[10px] font-black text-amber-800 uppercase tracking-widest">
              Garden Duel
            </div>
          </div>

          {/* Team B 3D Model Card */}
          <div className="flex flex-col items-center animate-float-delayed">
            <div className="clay-card-orange p-3.5 sm:p-4 flex flex-col items-center">
              <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden bg-slate-950 border-4 border-white shadow-2xl flex items-center justify-center relative ring-4 ring-orange-300">
                <MicrobeScene type="amoeba" color="#F97316" className="w-full h-full" />
              </div>
            </div>
            <div className="clay-pill mt-3 px-3.5 py-1 text-xs font-black text-orange-800 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-orange-600" />
              <span>The Guardians</span>
            </div>
            <span className="text-[10px] font-bold text-orange-700/90 mt-1 flex items-center gap-1">
              <Rotate3D className="w-3 h-3 text-orange-600 inline" />
              <span>3D Live Amoeba</span>
            </span>
          </div>

        </div>

        {/* High-Contrast Claymorphic Title Block */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="clay-pill inline-flex items-center gap-2 px-4 py-1.5 text-emerald-900 text-xs sm:text-sm font-black">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Competitive Classroom Science Adventure
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 font-heading drop-shadow-sm">
            MICROBE WARS
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-900 font-heading">
            Small Organisms. <span className="text-emerald-600 underline decoration-emerald-500/60 decoration-wavy">Big Impact.</span>
          </p>

          <p className="text-base sm:text-lg text-slate-800 font-bold max-w-xl mx-auto">
            Explore • Learn • Compete • Protect the Ecosystem
          </p>
        </div>

        {/* Important High-Stakes Rule: Questions Will Not Repeat */}
        <div className="clay-card mb-4 p-4 px-6 flex items-start gap-3.5 text-xs sm:text-sm font-bold text-slate-800 max-w-xl text-left border-2 border-amber-300 bg-amber-50/95 shadow-sm">
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-base font-black shadow-xs">
            ⚡
          </div>
          <div>
            <div className="font-heading text-amber-950 font-black flex items-center gap-1.5 text-sm">
              <span>CRITICAL TOURNAMENT RULE:</span>
              <span className="text-red-700 bg-red-100 text-[10px] px-2 py-0.5 rounded-full uppercase font-black border border-red-200">
                Questions Will NOT Repeat!
              </span>
            </div>
            <p className="text-amber-900 text-xs mt-1 font-semibold leading-relaxed">
              Every mystery specimen, classification puzzle, and rapid-fire challenge appears <b>only once</b>. Once answered, that opportunity is locked — choose wisely to grow your team’s crops!
            </p>
          </div>
        </div>

        {/* 3D Crop Growth Callout Badge */}
        <div className="clay-card mb-8 p-4 px-6 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 max-w-xl text-left">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
            <Sprout className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <b className="text-emerald-900 font-black">3D Living Garden Engine:</b>
            <p className="text-slate-600 text-xs mt-0.5">
              Both teams have crops planted in the 3D garden behind you. Whichever team gives the most correct answers will grow their crops faster, taller, and healthier!
            </p>
          </div>
        </div>

        {/* Primary Tactile Clay CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleStart}
            className="clay-btn-emerald px-12 py-4 sm:px-16 sm:py-5 text-xl sm:text-2xl font-black flex items-center gap-3 font-heading tracking-wide"
          >
            <Play className="w-7 h-7 fill-current" />
            <span>START GAME</span>
          </button>
        </div>

        {/* 5 Topic Badges Footer */}
        <div className="mt-10 sm:mt-14 pt-6 w-full">
          <div className="text-xs text-slate-600 uppercase font-black tracking-wider mb-3">
            5 Core Curriculum Arenas
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-800">
            <span className="clay-pill px-3.5 py-1.5">🔬 Microorganism Lab</span>
            <span className="clay-pill px-3.5 py-1.5">🌱 Food Chains & Webs</span>
            <span className="clay-pill px-3.5 py-1.5">🍂 Decay & Recycling</span>
            <span className="clay-pill px-3.5 py-1.5">🕸️ Food Web Forest</span>
            <span className="clay-pill px-3.5 py-1.5">🥣 Food Factory</span>
          </div>
        </div>

      </div>
    </div>
  );
};
