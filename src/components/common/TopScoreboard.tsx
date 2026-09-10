'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { sounds } from '@/utils/audio';
import { Volume2, VolumeX, Map, Award, RefreshCw, Trophy, ArrowRightLeft, Sprout, Maximize, Minimize, Music } from 'lucide-react';

export const TopScoreboard: React.FC = () => {
  const {
    stage,
    setStage,
    teamAScore,
    teamBScore,
    teamACorrectCount,
    teamBCorrectCount,
    activeTurnTeam,
    switchTurn,
    badges,
    audioEnabled,
    toggleAudio,
    resetGame,
    completedZones
  } = useGame();

  const [showBadges, setShowBadges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    sounds.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  // Calculate zone completion percentage
  const totalZones = 6;
  const completedCount =
    (completedZones.zone1 ? 1 : 0) +
    (completedZones.zone2 ? 1 : 0) +
    (completedZones.zone3 ? 1 : 0) +
    (completedZones.zone4 ? 1 : 0) +
    (completedZones.bonus ? 1 : 0) +
    (completedZones.finalChallenge ? 1 : 0);

  const progressPercent = Math.round((completedCount / totalZones) * 100);

  const getStageTitle = () => {
    switch (stage) {
      case 'start': return 'Start Screen';
      case 'how-to-play': return 'How to Play';
      case 'map': return 'Ecosystem Map';
      case 'zone-1': return 'Zone 1: Microorganism Lab';
      case 'zone-2': return 'Zone 2: Food Chain Arena';
      case 'zone-3': return 'Zone 3: Decay Detective';
      case 'zone-4': return 'Zone 4: Food Web Forest';
      case 'bonus': return 'Bonus: Food Factory';
      case 'rapid-fire': return '⚡ Rapid Fire Round';
      case 'risk': return '🎲 Risk Round';
      case 'final-challenge': return '🚨 Final Challenge: Save Ecosystem';
      case 'final-score': return '🏆 Final Scoreboard';
      case 'summary': return 'Learning Debrief';
      default: return 'Microbe Wars';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-emerald-100 shadow-md px-3 py-2 sm:px-6 sm:py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Brand & Stage */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage('map')}
              className="flex items-center gap-2.5 group text-left hover:opacity-90 transition-opacity"
              title="Return to Game Map"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-600/30 text-white font-black text-xl border-2 border-white/80">
                🦠
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg tracking-wide text-slate-900 font-heading leading-tight">
                  MICROBE WARS
                </div>
                <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <span>{getStageTitle()}</span>
                </div>
              </div>
            </button>

            {/* Progress Bar Clay Pill */}
            <div className="hidden lg:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
              <span className="text-[10px] text-slate-500 font-black">PROGRESS:</span>
              <div className="w-24 bg-slate-200/90 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-emerald-800">{progressPercent}%</span>
            </div>
          </div>

          {/* Claymorphic Live Scores & Turn Controller */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Team A Clay Score Box */}
            <div
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border-2 transition-all ${
                activeTurnTeam === 'teamA'
                  ? 'clay-card-blue ring-3 ring-blue-400/50 scale-102'
                  : 'bg-white/90 border-slate-200 opacity-90 shadow-xs'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm border border-white/60">
                A
              </div>
              <div className="text-left">
                <div className="text-[10px] text-blue-800 font-black tracking-wider leading-none flex items-center gap-1">
                  <span>EXPLORERS</span>
                  {activeTurnTeam === 'teamA' && <span className="text-blue-600">• YOUR TURN</span>}
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none mt-1 flex items-center gap-1.5 font-heading">
                  <span className="text-amber-500">⭐</span>
                  <span>{teamAScore.toLocaleString()}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center shadow-2xs">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600 mr-0.5 inline" />
                    {teamACorrectCount} crops
                  </span>
                </div>
              </div>
            </div>

            {/* Tactile Switch Turn Button */}
            <button
              onClick={() => {
                sounds.playClick();
                switchTurn();
              }}
              className="clay-btn-white p-2 sm:px-3 sm:py-2 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              title="Pass turn to the other team"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline font-heading">Switch Turn</span>
            </button>

            {/* Team B Clay Score Box */}
            <div
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border-2 transition-all ${
                activeTurnTeam === 'teamB'
                  ? 'clay-card-orange ring-3 ring-orange-400/50 scale-102'
                  : 'bg-white/90 border-slate-200 opacity-90 shadow-xs'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-orange-600 flex items-center justify-center text-xs font-black text-white shadow-sm border border-white/60">
                B
              </div>
              <div className="text-left">
                <div className="text-[10px] text-orange-800 font-black tracking-wider leading-none flex items-center gap-1">
                  <span>GUARDIANS</span>
                  {activeTurnTeam === 'teamB' && <span className="text-orange-600">• YOUR TURN</span>}
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none mt-1 flex items-center gap-1.5 font-heading">
                  <span className="text-amber-500">⭐</span>
                  <span>{teamBScore.toLocaleString()}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center shadow-2xs">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600 mr-0.5 inline" />
                    {teamBCorrectCount} crops
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Clay Utility Buttons: Badges, Map, Sound, Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Badges Drawer Button */}
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="clay-btn-white relative p-2.5 text-amber-600"
              title="View Badges"
            >
              <Award className="w-4 h-4" />
              {badges.filter(b => b.unlocked).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {badges.filter(b => b.unlocked).length}
                </span>
              )}
            </button>

            {/* Quick Map Button */}
            {stage !== 'map' && stage !== 'start' && (
              <button
                onClick={() => setStage('map')}
                className="clay-btn-emerald px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold font-heading"
                title="Go to Map"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            )}

            {/* SFX Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="clay-btn-white p-2.5 text-slate-700"
              title={audioEnabled ? "Mute SFX" : "Unmute SFX"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Competitive Tournament BGM Music */}
            <button
              onClick={() => {
                const playing = sounds.toggleBgm();
                setBgmOn(playing);
              }}
              className={`clay-btn-white p-2.5 transition-all ${
                bgmOn
                  ? 'text-emerald-700 bg-emerald-50 border-2 border-emerald-400 shadow-sm animate-pulse'
                  : 'text-slate-400 hover:text-emerald-700'
              }`}
              title={bgmOn ? "Pause Competitive Music" : "Play Competitive Tournament Music"}
              aria-label={bgmOn ? "Pause Competitive Music" : "Play Competitive Tournament Music"}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Reset Game Button */}
            <button
              onClick={() => {
                if (confirm('Restart game from the beginning? Scores and crop growth will reset.')) {
                  resetGame();
                }
              }}
              className="clay-btn-white p-2.5 text-slate-400 hover:text-red-600"
              title="Reset Game"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="clay-btn-white p-2.5 text-emerald-700 hover:text-emerald-900 border-2 border-emerald-200"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-emerald-600" />
              ) : (
                <Maximize className="w-4 h-4 text-emerald-700" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Badges Popover Drawer */}
      {showBadges && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="font-heading text-xl font-black text-slate-900">Ecosystem Badges</h3>
              </div>
              <button
                onClick={() => setShowBadges(false)}
                className="clay-btn-white w-8 h-8 flex items-center justify-center text-sm font-black"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all ${
                    b.unlocked
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-2xl">{b.icon}</div>
                  <div>
                    <div className="font-black text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-500">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBadges(false)}
              className="clay-btn-emerald w-full py-3 font-heading font-black text-sm"
            >
              Close Badges
            </button>
          </div>
        </div>
      )}
    </>
  );
};
