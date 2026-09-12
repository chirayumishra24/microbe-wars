'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { sounds } from '@/utils/audio';
import { fireScorePop } from '@/utils/confetti';
import { MicrobeCodexModal } from '@/components/common/MicrobeCodexModal';
import { HallOfFameModal } from '@/components/common/HallOfFameModal';

export const StartScreen: React.FC = () => {
  const { setStage, audioEnabled, toggleAudio } = useGame();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);

  const handleStart = () => {
    sounds.playCorrect();
    sounds.startBgm();
    fireScorePop();
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
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 select-none overflow-hidden">
      
      {/* 16:9 Responsive Canvas - Perfectly Contained Inside Viewport with Zero Scrolling */}
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] aspect-[16/9] mx-auto overflow-hidden shadow-2xl">
        
        {/* Base Cinematic Painted Landscape Artwork */}
        <Image
          src="/images/hero-start.jpg"
          alt="Microbe Wars - Small Organisms. Big Impact."
          fill
          priority
          sizes="(max-width: 1920px) 100vw, 1920px"
          className="object-contain pointer-events-none select-none"
        />

        {/* Top Right Quick Controls Bar (Volume & Fullscreen) */}
        <div className="absolute top-[3.5%] right-[3%] flex items-center gap-2 z-20">
          <button
            onClick={toggleAudio}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/85 hover:bg-white text-slate-800 border-2 border-white/90 shadow-md backdrop-blur-md flex items-center justify-center active:scale-90 transition-all hover:ring-2 hover:ring-emerald-400"
            title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/85 hover:bg-white text-slate-800 border-2 border-white/90 shadow-md backdrop-blur-md flex items-center justify-center active:scale-90 transition-all hover:ring-2 hover:ring-emerald-400"
            title="Toggle Smart Board Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* 4 Interactive Feature Hotspots */}
        {/* 1. Explore -> Microbe Codex */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowCodex(true);
          }}
          className="absolute left-[34%] top-[49%] w-[7.2%] h-[12.5%] rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-hidden"
          title="Open Microbe Codex"
        >
          <span className="sr-only">Explore Microbe Codex</span>
          <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-cyan-300 group-hover:ring-4 group-hover:ring-cyan-400/40 transition-all" />
        </button>

        {/* 2. Learn -> How to Play */}
        <button
          onClick={() => {
            sounds.playClick();
            setStage('how-to-play');
          }}
          className="absolute left-[42.7%] top-[49%] w-[7.2%] h-[12.5%] rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-hidden"
          title="How to Play"
        >
          <span className="sr-only">Learn How to Play</span>
          <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-blue-300 group-hover:ring-4 group-hover:ring-blue-400/40 transition-all" />
        </button>

        {/* 3. Compete -> Hall of Fame Tournament Leaderboard */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowHallOfFame(true);
          }}
          className="absolute left-[52.2%] top-[49%] w-[7.2%] h-[12.5%] rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-hidden"
          title="Tournament Records & Hall of Fame"
        >
          <span className="sr-only">Tournament Hall of Fame</span>
          <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-amber-300 group-hover:ring-4 group-hover:ring-amber-400/40 transition-all" />
        </button>

        {/* 4. Protect -> Ecosystem Mission Stinger */}
        <button
          onClick={() => {
            sounds.playCorrect();
            fireScorePop();
          }}
          className="absolute left-[61.5%] top-[49%] w-[7.2%] h-[12.5%] rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-hidden"
          title="Protect the Living Ecosystem"
        >
          <span className="sr-only">Protect Ecosystem</span>
          <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-emerald-300 group-hover:ring-4 group-hover:ring-emerald-400/40 transition-all" />
        </button>

        {/* Team A Mascot Touch Hotspot */}
        <button
          onClick={() => {
            sounds.playCorrect();
            fireScorePop();
          }}
          className="absolute left-[13.5%] top-[57.5%] w-[15.5%] h-[13.5%] rounded-2xl cursor-pointer transition-all hover:scale-102 active:scale-95 group focus:outline-hidden"
          title="Team A: The Explorers (Sunflowers & Bacillus)"
        >
          <span className="sr-only">Team A The Explorers</span>
          <div className="w-full h-full rounded-2xl border-2 border-transparent group-hover:border-blue-400 group-hover:ring-4 group-hover:ring-blue-300/40 transition-all" />
        </button>

        {/* Team B Mascot Touch Hotspot */}
        <button
          onClick={() => {
            sounds.playCorrect();
            fireScorePop();
          }}
          className="absolute left-[72.5%] top-[57.5%] w-[15.5%] h-[13.5%] rounded-2xl cursor-pointer transition-all hover:scale-102 active:scale-95 group focus:outline-hidden"
          title="Team B: The Guardians (Corn & Amoeba)"
        >
          <span className="sr-only">Team B The Guardians</span>
          <div className="w-full h-full rounded-2xl border-2 border-transparent group-hover:border-orange-400 group-hover:ring-4 group-hover:ring-orange-300/40 transition-all" />
        </button>

        {/* Primary Interactive START GAME Button */}
        <button
          onClick={handleStart}
          className="absolute left-[36.8%] top-[64%] w-[26.4%] h-[12%] rounded-full cursor-pointer flex items-center justify-center font-heading font-black text-white text-lg sm:text-2xl md:text-3xl tracking-wider transition-all duration-200 hover:scale-103 active:scale-96 ring-4 ring-white/40 shadow-2xl hover:ring-emerald-300 hover:shadow-emerald-500/50 group focus:outline-hidden animate-pulse"
          style={{
            background: 'linear-gradient(180deg, #34D399 0%, #059669 48%, #047857 100%)',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.85)',
          }}
        >
          <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-1.5 sm:gap-2">
            <span>START GAME</span>
            <span className="text-xl sm:text-2xl font-bold group-hover:translate-x-1 transition-transform">›</span>
          </span>
        </button>

      </div>

      {/* Microbe Codex Modal */}
      <MicrobeCodexModal isOpen={showCodex} onClose={() => setShowCodex(false)} />

      {/* Hall of Fame Tournament Modal */}
      <HallOfFameModal isOpen={showHallOfFame} onClose={() => setShowHallOfFame(false)} />

    </div>
  );
};
