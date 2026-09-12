'use client';

import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Compass, Shield, Sparkles } from 'lucide-react';
import { sounds } from '@/utils/audio';

export const TurnClashOverlay: React.FC = () => {
  const { activeTurnTeam, teamAName, teamBName, stage } = useGame();
  const [visible, setVisible] = useState(false);
  const [team, setTeam] = useState(activeTurnTeam);

  useEffect(() => {
    // Only show during active gameplay stages, not on start/map/summary
    const gameplayStages = [
      'zone-1',
      'zone-2',
      'zone-3',
      'zone-4',
      'bonus',
      'rapid-fire',
      'risk',
      'final-challenge',
    ];
    if (!gameplayStages.includes(stage)) {
      setVisible(false);
      return;
    }

    setTeam(activeTurnTeam);
    setVisible(true);
    sounds.playEnergyWhoosh();

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [activeTurnTeam, stage]);

  if (!visible) return null;

  const isA = team === 'teamA';
  const name = isA ? teamAName : teamBName;

  const handleDismiss = () => {
    sounds.playClick();
    setVisible(false);
  };

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 cursor-pointer select-none animate-in fade-in duration-200"
    >
      <div
        className={`max-w-xl w-full p-6 sm:p-8 rounded-3xl border-4 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-white transform hover:scale-102 transition-transform ${
          isA
            ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border-blue-200 shadow-blue-500/50'
            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 border-amber-200 shadow-orange-500/50'
        }`}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 flex items-center justify-center border-2 border-white/40 shadow-inner flex-shrink-0">
          {isA ? (
            <Compass className="w-12 h-12 text-white animate-pulse" />
          ) : (
            <Shield className="w-12 h-12 text-white animate-pulse" />
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-widest text-white/90 border border-white/30 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Turn Handoff</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-wide uppercase leading-tight">
            {name}
          </h2>

          <div className="text-xs sm:text-sm font-bold text-white/90 mt-1">
            {isA ? 'Sunflowers ready! Take the stage!' : 'Corn crops primed! Step up to duel!'}
          </div>

          <div className="mt-3 inline-block text-[11px] font-black uppercase tracking-wider bg-black/25 px-3 py-1 rounded-full border border-white/20 text-white/80">
            👆 Tap anywhere to start
          </div>
        </div>
      </div>
    </div>
  );
};
