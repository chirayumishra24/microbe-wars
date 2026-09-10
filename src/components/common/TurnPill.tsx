'use client';

import React from 'react';
import { Compass, Shield, Sprout } from 'lucide-react';

interface TurnPillProps {
  currentTeam: 'teamA' | 'teamB';
  teamACount?: number;
  teamBCount?: number;
  labelPrefix?: string;
  className?: string;
}

export const TurnPill: React.FC<TurnPillProps> = ({
  currentTeam,
  teamACount,
  teamBCount,
  labelPrefix = 'TURN',
  className = '',
}) => {
  const isA = currentTeam === 'teamA';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-all duration-300 ${
          isA
            ? 'bg-blue-600 text-white ring-4 ring-blue-200'
            : 'bg-orange-500 text-white ring-4 ring-orange-200'
        }`}
      >
        {isA ? (
          <>
            <Compass className="w-4 h-4 text-white" />
            <span>{labelPrefix}: The Explorers (Team A)</span>
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 text-white" />
            <span>{labelPrefix}: The Guardians (Team B)</span>
          </>
        )}
      </span>

      {(teamACount !== undefined || teamBCount !== undefined) && (
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isA
              ? `${teamACount ?? 0} sunflowers in garden`
              : `${teamBCount ?? 0} corn in garden`}
          </span>
        </span>
      )}
    </div>
  );
};
