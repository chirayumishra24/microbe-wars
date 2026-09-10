'use client';

import React, { createContext, useContext, useState } from 'react';
import { sounds } from '@/utils/audio';

export type GameStage =
  | 'start'
  | 'how-to-play'
  | 'map'
  | 'zone-1'
  | 'zone-2'
  | 'zone-3'
  | 'zone-4'
  | 'bonus'
  | 'rapid-fire'
  | 'risk'
  | 'final-challenge'
  | 'final-score'
  | 'summary';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

interface GameContextType {
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  teamAScore: number;
  teamBScore: number;
  teamACorrectCount: number;
  teamBCorrectCount: number;
  selectedTeam: 'teamA' | 'teamB' | null;
  setSelectedTeam: (team: 'teamA' | 'teamB') => void;
  activeTurnTeam: 'teamA' | 'teamB';
  setActiveTurnTeam: (team: 'teamA' | 'teamB') => void;
  switchTurn: () => void;
  addScore: (points: number, targetTeam?: 'teamA' | 'teamB') => void;
  deductScore: (points: number, targetTeam?: 'teamA' | 'teamB') => void;
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  completedZones: {
    zone1: boolean;
    zone2: boolean;
    zone3: boolean;
    zone4: boolean;
    bonus: boolean;
    rapidFire: boolean;
    risk: boolean;
    finalChallenge: boolean;
  };
  markZoneComplete: (zone: keyof GameContextType['completedZones']) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  toggleAudio: () => void;
  resetGame: () => void;
}

const INITIAL_BADGES: Badge[] = [
  { id: 'b_zone1', name: 'Microbe Detective', icon: '🔬', description: 'Mastered microbe identification', unlocked: false },
  { id: 'b_zone2', name: 'Trophic Master', icon: '🌱', description: 'Built complete food chains and webs', unlocked: false },
  { id: 'b_zone3', name: 'Decay Sleuth', icon: '🍂', description: 'Cracked the secrets of decomposition', unlocked: false },
  { id: 'b_zone4', name: 'Forest Guardian', icon: '🕸️', description: 'Safeguarded food web stability', unlocked: false },
  { id: 'b_bonus', name: 'Master Fermenter', icon: '🥣', description: 'Tapped the power of food microbes', unlocked: false },
  { id: 'b_final', name: 'Savior of Nature', icon: '🏆', description: 'Successfully healed the ecosystem', unlocked: false },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStageState] = useState<GameStage>('start');
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [teamACorrectCount, setTeamACorrectCount] = useState<number>(0);
  const [teamBCorrectCount, setTeamBCorrectCount] = useState<number>(0);
  const [selectedTeam, setSelectedTeam] = useState<'teamA' | 'teamB' | null>('teamA');
  const [activeTurnTeam, setActiveTurnTeam] = useState<'teamA' | 'teamB'>('teamA');
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [audioEnabled, setAudioEnabledState] = useState<boolean>(true);

  const [completedZones, setCompletedZones] = useState({
    zone1: false,
    zone2: false,
    zone3: false,
    zone4: false,
    bonus: false,
    rapidFire: false,
    risk: false,
    finalChallenge: false,
  });

  const setStage = (newStage: GameStage) => {
    sounds.playClick();
    setStageState(newStage);
  };

  const switchTurn = () => {
    setActiveTurnTeam((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
  };

  const addScore = (points: number, targetTeam?: 'teamA' | 'teamB') => {
    const team = targetTeam || activeTurnTeam;
    if (team === 'teamA') {
      setTeamAScore((prev) => Math.max(0, prev + points));
      setTeamACorrectCount((prev) => prev + 1);
    } else {
      setTeamBScore((prev) => Math.max(0, prev + points));
      setTeamBCorrectCount((prev) => prev + 1);
    }
  };

  const deductScore = (points: number, targetTeam?: 'teamA' | 'teamB') => {
    const team = targetTeam || activeTurnTeam;
    if (team === 'teamA') {
      setTeamAScore((prev) => Math.max(0, prev - points));
    } else {
      setTeamBScore((prev) => Math.max(0, prev - points));
    }
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b))
    );
  };

  const markZoneComplete = (zone: keyof typeof completedZones) => {
    setCompletedZones((prev) => ({ ...prev, [zone]: true }));
    if (zone === 'zone1') unlockBadge('b_zone1');
    if (zone === 'zone2') unlockBadge('b_zone2');
    if (zone === 'zone3') unlockBadge('b_zone3');
    if (zone === 'zone4') unlockBadge('b_zone4');
    if (zone === 'bonus') unlockBadge('b_bonus');
    if (zone === 'finalChallenge') unlockBadge('b_final');
  };

  const setAudioEnabled = (enabled: boolean) => {
    setAudioEnabledState(enabled);
    sounds.setEnabled(enabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setTeamACorrectCount(0);
    setTeamBCorrectCount(0);
    setSelectedTeam('teamA');
    setActiveTurnTeam('teamA');
    setBadges(INITIAL_BADGES);
    setCompletedZones({
      zone1: false,
      zone2: false,
      zone3: false,
      zone4: false,
      bonus: false,
      rapidFire: false,
      risk: false,
      finalChallenge: false,
    });
    setStageState('start');
  };

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,
        teamAScore,
        teamBScore,
        teamACorrectCount,
        teamBCorrectCount,
        selectedTeam,
        setSelectedTeam,
        activeTurnTeam,
        setActiveTurnTeam,
        switchTurn,
        addScore,
        deductScore,
        badges,
        unlockBadge,
        completedZones,
        markZoneComplete,
        audioEnabled,
        setAudioEnabled,
        toggleAudio,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
