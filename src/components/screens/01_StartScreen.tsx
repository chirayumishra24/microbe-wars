'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MicrobeScene } from '@/components/3d/MicrobeScene';
import { Play, Sparkles, Shield, Compass, Sprout, Volume2, VolumeX, Maximize, Minimize, Zap } from 'lucide-react';
import { sounds } from '@/utils/audio';

export const StartScreen: React.FC = () => {
  const { setStage, audioEnabled, toggleAudio } = useGame();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleStart = () => {
    sounds.playCorrect();
    sounds.startBgm();
    setStage('team-selection');
  };

  const toggleFullscreen = async () => {
    sounds.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden">
      
      {/* Top Floating Utility Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-20">
        <div className="clay-pill px-3 py-1 text-emerald-950 text-xs font-black flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Classroom Science Tournament</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border-2 border-emerald-100 shadow-sm flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border-2 border-emerald-100 shadow-sm flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-emerald-600" /> : <Maximize className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Main Unified Center Game Card */}
      <div className="my-auto z-20 w-full max-w-3xl lg:max-w-4xl flex flex-col items-center px-3 sm:px-6">
        
        <div className="w-full bg-white/95 backdrop-blur-xl border-4 border-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-9 flex flex-col items-center text-center relative ring-4 ring-emerald-500/10">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <span className="text-4xl sm:text-5xl lg:text-6xl animate-bounce">🦠</span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 font-heading leading-none drop-shadow-xs">
              MICROBE WARS
            </h1>
          </div>
          
          <p className="text-base sm:text-xl lg:text-2xl font-extrabold text-emerald-900 font-heading mb-5">
            Small Organisms. <span className="text-emerald-600 underline decoration-emerald-500/50 decoration-wavy">Big Impact.</span>
          </p>

          {/* Teams Face-off Banner with Micro Live Previews */}
          <div className="w-full grid grid-cols-11 items-center bg-slate-100/90 rounded-2xl p-3 sm:p-4 border border-slate-200/80 mb-4 shadow-inner">
            
            {/* Team A */}
            <div className="col-span-5 flex items-center gap-2.5 sm:gap-3.5 text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-slate-950 border-3 border-blue-400 shadow-md flex-shrink-0 relative">
                <MicrobeScene type="bacteria" color="#34D399" className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base lg:text-xl font-black text-blue-950 font-heading truncate flex items-center gap-1.5">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">The Explorers</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-700 mt-1 flex items-center gap-1">
                  <span>🌻 Sunflowers</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Live Bacillus</span>
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-xs sm:text-sm lg:text-base flex items-center justify-center shadow-md rotate-6 border-2 border-white">
                VS
              </div>
            </div>

            {/* Team B */}
            <div className="col-span-5 flex items-center justify-end gap-2.5 sm:gap-3.5 text-right">
              <div className="min-w-0">
                <div className="text-sm sm:text-base lg:text-xl font-black text-orange-950 font-heading truncate flex items-center justify-end gap-1.5">
                  <span className="truncate">The Guardians</span>
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-orange-700 mt-1 flex items-center justify-end gap-1">
                  <span className="text-slate-500">Live Amoeba</span>
                  <span className="text-slate-400">•</span>
                  <span>🌽 Corn Stalks</span>
                </div>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-slate-950 border-3 border-orange-400 shadow-md flex-shrink-0 relative">
                <MicrobeScene type="amoeba" color="#F97316" className="w-full h-full" />
              </div>
            </div>

          </div>

          {/* Key Game Features Callouts */}
          <div className="grid grid-cols-2 gap-3 w-full mb-5 text-left">
            <div className="flex items-center gap-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 px-3.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm leading-tight">
                <span className="font-black text-amber-950">No Repeats: </span>
                <span className="text-amber-900 font-medium">Questions appear once.</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-2.5 px-3.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm leading-tight">
                <span className="font-black text-emerald-950">3D Garden: </span>
                <span className="text-emerald-900 font-medium">Answers grow live crops!</span>
              </div>
            </div>
          </div>

          {/* Master Tactile Play Button */}
          <button
            onClick={handleStart}
            className="w-full max-w-md clay-btn-emerald py-3.5 sm:py-4 px-8 text-xl sm:text-2xl font-black flex items-center justify-center gap-3 font-heading tracking-wide shadow-xl active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>START GAME</span>
          </button>
          
          <div className="text-xs sm:text-sm text-slate-500 font-bold mt-2">
            Classroom Interactive Smart Board Edition
          </div>

        </div>

      </div>

      {/* Bottom Arenas Floating Pill */}
      <div className="z-20 w-full flex justify-center pb-0.5">
        <div className="clay-card py-1 px-3 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-800 shadow-sm border border-white/80">
          <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider">5 Arenas:</span>
          <span>🔬 Micro Lab</span>
          <span>•</span>
          <span>🌱 Food Chains</span>
          <span>•</span>
          <span>🍂 Decay</span>
          <span>•</span>
          <span>🕸️ Food Web</span>
          <span>•</span>
          <span>🥣 Food Factory</span>
        </div>
      </div>

    </div>
  );
};
