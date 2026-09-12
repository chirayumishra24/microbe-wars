'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MicrobeScene } from '@/components/3d/MicrobeScene';
import { Compass, Shield, CheckCircle2, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { sounds } from '@/utils/audio';
import { fireScorePop } from '@/utils/confetti';

const PRESET_NAMES_A = [
  'The Explorers',
  'Sprout Squad',
  'Bio-Hawks',
  'Nano Force',
  'Bacillus Bosses',
];

const PRESET_NAMES_B = [
  'The Guardians',
  'Eco-Titans',
  'Amoeba Army',
  'Cell Protectors',
  'Green Giants',
];

const MASCOT_OPTIONS: { id: 'bacteria' | 'amoeba' | 'fungi' | 'algae' | 'virus'; label: string; icon: string }[] = [
  { id: 'bacteria', label: 'Bacillus', icon: '🔬' },
  { id: 'amoeba', label: 'Amoeba', icon: '🦠' },
  { id: 'fungi', label: 'Yeast', icon: '🥣' },
  { id: 'algae', label: 'Micro-Alga', icon: '🌱' },
  { id: 'virus', label: 'Phage', icon: '⚡' },
];

export const TeamSelectionScreen: React.FC = () => {
  const {
    setStage,
    teamAName,
    setTeamAName,
    teamBName,
    setTeamBName,
    teamAMascot,
    setTeamAMascot,
    teamBMascot,
    setTeamBMascot,
  } = useGame();

  const [activeEditing, setActiveEditing] = useState<'teamA' | 'teamB'>('teamA');

  const handleSelectPreset = (team: 'teamA' | 'teamB', name: string) => {
    sounds.playClick();
    if (team === 'teamA') {
      setTeamAName(name);
    } else {
      setTeamBName(name);
    }
    fireScorePop();
  };

  const handleSelectMascot = (team: 'teamA' | 'teamB', mascotId: string) => {
    sounds.playCorrect();
    if (team === 'teamA') {
      setTeamAMascot(mascotId);
    } else {
      setTeamBMascot(mascotId);
    }
  };

  const handleContinue = () => {
    sounds.playCorrect();
    setStage('how-to-play');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="max-w-5xl w-full flex flex-col items-center text-center z-10 my-auto">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="clay-pill inline-flex items-center gap-2 px-4 py-1 text-emerald-900 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Classroom Tournament Setup
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            CUSTOMIZE YOUR TEAMS
          </h2>
          <p className="text-slate-700 font-bold text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Tap a quick smart board preset name or choose your 3D microbe mascot!
          </p>
        </div>

        {/* Dual Team Customizer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mb-6">
          
          {/* Team A Customizer */}
          <div
            onClick={() => setActiveEditing('teamA')}
            className={`clay-card-blue p-5 sm:p-6 flex flex-col items-center relative transition-all ${
              activeEditing === 'teamA' ? 'ring-4 ring-blue-400 scale-102 shadow-xl' : 'opacity-95'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="clay-pill px-3 py-1 text-xs font-black text-blue-900 uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                Team A Identity
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                🌻 Sunflowers
              </span>
            </div>

            {/* Live 3D Specimen Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-950 border-4 border-white shadow-xl mb-3 relative ring-4 ring-blue-300 flex-shrink-0">
              <MicrobeScene
                type={teamAMascot as any}
                color="#34D399"
                className="w-full h-full"
              />
            </div>

            {/* Team Name Input with Presets */}
            <div className="w-full mb-3">
              <label className="block text-[11px] font-black text-blue-950 uppercase tracking-wider mb-1 text-left">
                Team A Name:
              </label>
              <input
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-blue-300 text-slate-900 font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="Enter team name..."
              />
            </div>

            {/* Smart Board 1-Tap Preset Name Chips */}
            <div className="w-full mb-4 text-left">
              <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Wand2 className="w-3 h-3" /> Quick Presets (1-Tap):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_NAMES_A.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset('teamA', preset)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      teamAName === preset
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'bg-white/90 text-blue-900 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot Selector */}
            <div className="w-full text-left">
              <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block mb-1.5">
                Choose 3D Mascot:
              </span>
              <div className="grid grid-cols-5 gap-1 w-full">
                {MASCOT_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMascot('teamA', m.id)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
                      teamAMascot === m.id
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="text-[9px] font-bold truncate max-w-full">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Team B Customizer */}
          <div
            onClick={() => setActiveEditing('teamB')}
            className={`clay-card-orange p-5 sm:p-6 flex flex-col items-center relative transition-all ${
              activeEditing === 'teamB' ? 'ring-4 ring-orange-400 scale-102 shadow-xl' : 'opacity-95'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="clay-pill px-3 py-1 text-xs font-black text-orange-900 uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                Team B Identity
              </span>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                🌽 Corn Stalks
              </span>
            </div>

            {/* Live 3D Specimen Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-950 border-4 border-white shadow-xl mb-3 relative ring-4 ring-orange-300 flex-shrink-0">
              <MicrobeScene
                type={teamBMascot as any}
                color="#F97316"
                className="w-full h-full"
              />
            </div>

            {/* Team Name Input with Presets */}
            <div className="w-full mb-3">
              <label className="block text-[11px] font-black text-orange-950 uppercase tracking-wider mb-1 text-left">
                Team B Name:
              </label>
              <input
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-orange-300 text-slate-900 font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
                placeholder="Enter team name..."
              />
            </div>

            {/* Smart Board 1-Tap Preset Name Chips */}
            <div className="w-full mb-4 text-left">
              <span className="text-[10px] font-black text-orange-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Wand2 className="w-3 h-3" /> Quick Presets (1-Tap):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_NAMES_B.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset('teamB', preset)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      teamBName === preset
                        ? 'bg-orange-600 text-white shadow-xs font-black'
                        : 'bg-white/90 text-orange-900 border border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot Selector */}
            <div className="w-full text-left">
              <span className="text-[10px] font-black text-orange-800 uppercase tracking-wider block mb-1.5">
                Choose 3D Mascot:
              </span>
              <div className="grid grid-cols-5 gap-1 w-full">
                {MASCOT_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMascot('teamB', m.id)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
                      teamBMascot === m.id
                        ? 'bg-orange-600 text-white border-orange-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="text-[9px] font-bold truncate max-w-full">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Ready Action Button */}
        <button
          onClick={handleContinue}
          className="clay-btn-emerald px-10 py-4 text-lg sm:text-xl font-black flex items-center gap-2 font-heading tracking-wide"
        >
          <span>CONFIRM TEAMS & CONTINUE</span>
          <ArrowRight className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
};
