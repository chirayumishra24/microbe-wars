'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { Sprout, Sun } from 'lucide-react';

export const GardenStatusWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { teamACorrectCount, teamBCorrectCount } = useGame();

  const growthLevelA = Math.min(100, teamACorrectCount * 12);
  const growthLevelB = Math.min(100, teamBCorrectCount * 12);

  const getStageName = (count: number) => {
    if (count >= 8) return '🌻 Fully Blossoming (Ripe Grain & Flowers)';
    if (count >= 5) return '🌿 Tall Lush Plants & Buds';
    if (count >= 3) return '🌱 Leafy Green Branches';
    if (count >= 1) return '🌱 Young Sproutling';
    return '🌰 Seed in Fertile Soil';
  };

  const isALeading = teamACorrectCount > teamBCorrectCount;
  const isBLeading = teamBCorrectCount > teamACorrectCount;

  return (
    <div className={`p-4 rounded-3xl bg-white/90 backdrop-blur-md border border-emerald-200/90 shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>3D Garden Living Crops</span>
        </div>
        <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
          <Sun className="w-3 h-3 text-amber-500" />
          <span>Right Answers = Faster & Healthier Growth</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team A Garden Plot */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isALeading ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-blue-800">
              TEAM A (EXPLORERS) GARDEN
            </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {teamACorrectCount} Right Answers
            </span>
          </div>
          <div className="text-[11px] font-semibold text-slate-600 mb-2">
            Status: <b className="text-blue-900">{getStageName(teamACorrectCount)}</b>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(8, growthLevelA)}%` }}
            />
          </div>
        </div>

        {/* Team B Garden Plot */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isBLeading ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-300' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-orange-800">
              TEAM B (GUARDIANS) GARDEN
            </span>
            <span className="text-xs font-mono font-bold text-orange-700">
              {teamBCorrectCount} Right Answers
            </span>
          </div>
          <div className="text-[11px] font-semibold text-slate-600 mb-2">
            Status: <b className="text-orange-900">{getStageName(teamBCorrectCount)}</b>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(8, growthLevelB)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
