'use client';

import React, { useState } from 'react';
import { useGame, GameStage } from '@/context/GameContext';
import { ArrowLeft, CheckCircle2, Lock, Play, Sparkles, ChevronRight, Trophy } from 'lucide-react';
import { sounds } from '@/utils/audio';
import { GardenStatusWidget } from '@/components/common/GardenStatusWidget';
import { HallOfFameModal } from '@/components/common/HallOfFameModal';

interface MapZone {
  id: string;
  stageKey: GameStage;
  num: string;
  title: string;
  topic: string;
  icon: string;
  points: string;
  completed: boolean;
  unlocked: boolean;
}

export const GameMapScreen: React.FC = () => {
  const { setStage, completedZones, goBack } = useGame();
  const [showHallOfFame, setShowHallOfFame] = useState(false);

  const zones: MapZone[] = [
    {
      id: 'z1',
      stageKey: 'zone-1',
      num: '1',
      title: 'Microorganism Lab',
      topic: 'Microbes in Environment',
      icon: '🔬',
      points: '+100 pts/game',
      completed: completedZones.zone1,
      unlocked: true,
    },
    {
      id: 'z2',
      stageKey: 'zone-2',
      num: '2',
      title: 'Food Chain Arena',
      topic: 'Trophic Levels & Energy',
      icon: '🌱',
      points: '+150-200 pts',
      completed: completedZones.zone2,
      unlocked: completedZones.zone1,
    },
    {
      id: 'z3',
      stageKey: 'zone-3',
      num: '3',
      title: 'Decay Zone',
      topic: 'Decomposition & Humus',
      icon: '🍂',
      points: '+200 pts',
      completed: completedZones.zone3,
      unlocked: completedZones.zone2,
    },
    {
      id: 'z4',
      stageKey: 'zone-4',
      num: '4',
      title: 'Food Web Forest',
      topic: 'Ecosystem Stability',
      icon: '🕸️',
      points: '+200 pts',
      completed: completedZones.zone4,
      unlocked: completedZones.zone3,
    },
    {
      id: 'bonus',
      stageKey: 'bonus',
      num: '★',
      title: 'Food Factory',
      topic: 'Fermentation & Foods',
      icon: '🥣',
      points: '+100 pts',
      completed: completedZones.bonus,
      unlocked: completedZones.zone4,
    },
    {
      id: 'rapid',
      stageKey: 'rapid-fire',
      num: '⚡',
      title: 'Rapid Fire Quiz',
      topic: '30s Speed Challenge',
      icon: '⏱️',
      points: '+50 pts/ea',
      completed: completedZones.rapidFire,
      unlocked: completedZones.bonus,
    },
    {
      id: 'risk',
      stageKey: 'risk',
      num: '🎲',
      title: 'Risk Round',
      topic: 'Double or Lose Wager',
      icon: '🪙',
      points: 'Double Coins',
      completed: completedZones.risk,
      unlocked: completedZones.rapidFire,
    },
    {
      id: 'final',
      stageKey: 'final-challenge',
      num: '🏆',
      title: 'Save The Ecosystem',
      topic: 'Final Emergency Climax',
      icon: '🌍',
      points: '+500 pts',
      completed: completedZones.finalChallenge,
      unlocked: completedZones.risk,
    }
  ];

  const handleEnterZone = (z: MapZone) => {
    if (!z.unlocked && !z.completed) {
      sounds.playIncorrect();
      return;
    }
    sounds.playClick();
    setStage(z.stageKey);
  };

  const nextPlayable = zones.find(z => !z.completed && z.unlocked) || zones[0];

  return (
    <div className="relative min-h-[calc(100vh-65px)] p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        
        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="clay-pill inline-flex items-center gap-2 px-4 py-1 text-emerald-900 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Interactive Learning Journey
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading">
            ECOSYSTEM ADVENTURE MAP
          </h2>
          <p className="text-slate-700 font-bold text-xs sm:text-sm mt-1 max-w-lg mx-auto mb-3">
            Travel sequentially through 4 core learning zones, bonus rounds, and the final ecosystem climax!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full clay-pill bg-white text-slate-800 border border-slate-300 text-xs font-black hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
              <span>Back to How to Play</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowHallOfFame(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full clay-pill bg-amber-50 text-amber-900 border border-amber-300 text-xs font-black hover:bg-amber-100 transition-all shadow-xs cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Classroom Hall of Fame</span>
            </button>
          </div>
        </div>

        {/* Live 3D Garden Status Widget */}
        <GardenStatusWidget className="mb-6" />

        {/* Next Playable Launch Clay Banner */}
        <div className="clay-card mb-8 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/25 text-white border-2 border-white/60">
              {nextPlayable.icon}
            </div>
            <div>
              <div className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                Up Next In Journey
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {nextPlayable.title}
              </div>
              <div className="text-xs text-slate-600 font-bold mt-0.5">
                Topic: {nextPlayable.topic} • <span className="text-amber-600 font-black">{nextPlayable.points}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleEnterZone(nextPlayable)}
            className="clay-btn-emerald w-full sm:w-auto px-8 py-4 font-black text-base flex items-center justify-center gap-2 font-heading"
          >
            <span>START JOURNEY</span>
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Visual Path Grid with Clay Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {zones.map((z) => {
            const isClickable = z.unlocked || z.completed;

            return (
              <div
                key={z.id}
                onClick={() => handleEnterZone(z)}
                className={`clay-card p-6 flex flex-col justify-between transition-all cursor-pointer ${
                  z.completed
                    ? 'border-emerald-300 ring-4 ring-emerald-300/40 hover:scale-102'
                    : z.unlocked
                    ? 'hover:scale-102 hover:border-emerald-400'
                    : 'opacity-60 cursor-not-allowed filter grayscale'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm ${
                      z.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : z.unlocked
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {z.num}
                    </div>

                    <div>
                      {z.completed ? (
                        <div className="clay-pill flex items-center gap-1 text-xs font-black text-emerald-800 px-2.5 py-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>DONE</span>
                        </div>
                      ) : !z.unlocked ? (
                        <div className="clay-pill flex items-center gap-1 text-xs font-bold text-slate-500 px-2.5 py-0.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED</span>
                        </div>
                      ) : (
                        <div className="clay-pill flex items-center gap-1 text-xs font-black text-emerald-700 px-2.5 py-0.5 animate-pulse">
                          <span>READY</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-5xl my-3 text-center py-1">
                    {z.icon}
                  </div>

                  <h3 className="font-heading text-xl font-black text-slate-900 text-center mt-1">
                    {z.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-semibold text-center mt-1">
                    {z.topic}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600">
                    {z.points}
                  </span>

                  <div className={`text-xs font-black flex items-center gap-1 ${
                    isClickable ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    <span>{z.completed ? 'Replay' : z.unlocked ? 'Enter' : 'Locked'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Classroom Hall of Fame Modal */}
      <HallOfFameModal isOpen={showHallOfFame} onClose={() => setShowHallOfFame(false)} />
    </div>
  );
};
