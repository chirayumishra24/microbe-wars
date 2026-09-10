'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MicrobeMascot } from '@/components/common/MicrobeMascot';
import { Compass, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '@/utils/audio';
import { fireScorePop } from '@/utils/confetti';

export const TeamSelectionScreen: React.FC = () => {
  const { setStage, selectedTeam, setSelectedTeam, setActiveTurnTeam } = useGame();
  const [confirmedTeam, setConfirmedTeam] = useState<'teamA' | 'teamB' | null>(null);

  const handleSelectTeam = (team: 'teamA' | 'teamB') => {
    sounds.playCorrect();
    setSelectedTeam(team);
    setActiveTurnTeam(team);
    setConfirmedTeam(team);
    fireScorePop();
  };

  const handleContinue = () => {
    sounds.playClick();
    setStage('how-to-play');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bio-particles">
      <div className="max-w-4xl w-full flex flex-col items-center text-center z-10">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Step 2: Dual Rivalry
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 font-heading">
            CHOOSE YOUR TEAM
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Pick your team identity to represent in the ecosystem competition!
          </p>
        </div>

        {/* Dual Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          
          {/* Team A: The Explorers */}
          <div
            onClick={() => handleSelectTeam('teamA')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col items-center relative group ${
              selectedTeam === 'teamA'
                ? 'bg-blue-950/80 border-blue-400 shadow-2xl shadow-blue-500/40 scale-102 ring-4 ring-blue-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60'
            }`}
          >
            {selectedTeam === 'teamA' && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div className="w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
              <MicrobeMascot type="teamA" size={120} />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30 mb-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Blue Identity
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
              TEAM A
            </h3>
            <div className="text-lg font-bold text-blue-300">
              THE EXPLORERS
            </div>

            <p className="text-xs text-slate-300 mt-2 text-center max-w-xs">
              Observe • Solve • Win. Pioneers unlocking the deep mysteries of the microscopic world.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTeam('teamA');
              }}
              className={`mt-6 w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
                selectedTeam === 'teamA'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
                  : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white'
              }`}
            >
              {selectedTeam === 'teamA' ? 'SELECTED' : 'SELECT TEAM A'}
            </button>
          </div>

          {/* Team B: The Guardians */}
          <div
            onClick={() => handleSelectTeam('teamB')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col items-center relative group ${
              selectedTeam === 'teamB'
                ? 'bg-orange-950/80 border-orange-400 shadow-2xl shadow-orange-500/40 scale-102 ring-4 ring-orange-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/60'
            }`}
          >
            {selectedTeam === 'teamB' && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div className="w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
              <MicrobeMascot type="teamB" size={120} />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-950/80 px-3 py-1 rounded-full border border-orange-500/30 mb-2">
              <Shield className="w-4 h-4 text-orange-400" />
              Orange Identity
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
              TEAM B
            </h3>
            <div className="text-lg font-bold text-orange-300">
              THE GUARDIANS
            </div>

            <p className="text-xs text-slate-300 mt-2 text-center max-w-xs">
              Learn • Compete • Lead. Protectors championing ecological balance and species preservation.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTeam('teamB');
              }}
              className={`mt-6 w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
                selectedTeam === 'teamB'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40'
                  : 'bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white'
              }`}
            >
              {selectedTeam === 'teamB' ? 'SELECTED' : 'SELECT TEAM B'}
            </button>
          </div>

        </div>

        {/* Celebratory Ready Alert Banner */}
        {confirmedTeam && (
          <div className="mb-6 p-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 flex items-center gap-3 animate-bounce">
            <span className="text-2xl">🎉</span>
            <span className="font-extrabold text-white text-base">
              {confirmedTeam === 'teamA' ? 'TEAM A READY!' : 'TEAM B READY!'}
            </span>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-heading"
        >
          <span>CONTINUE TO RULES</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
