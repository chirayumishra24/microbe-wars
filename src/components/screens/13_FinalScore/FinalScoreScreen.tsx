'use client';

import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MicrobeMascot } from '@/components/common/MicrobeMascot';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti } from '@/utils/confetti';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, BookOpen, Trophy } from 'lucide-react';
import { HallOfFameModal } from '@/components/common/HallOfFameModal';

export const FinalScoreScreen: React.FC = () => {
  const { teamAScore, teamBScore, teamAName, teamBName, setStage, goBack, resetGame } = useGame();

  const [displayedScoreA, setDisplayedScoreA] = useState(0);
  const [displayedScoreB, setDisplayedScoreB] = useState(0);
  const [showHallOfFame, setShowHallOfFame] = useState(false);

  // Determine winner
  const isTeamAWinner = teamAScore > teamBScore;
  const isTeamBWinner = teamBScore > teamAScore;
  const isTie = teamAScore === teamBScore;

  useEffect(() => {
    sounds.playFanfare();
    fireCelebrationConfetti();
    const timer = setInterval(() => {
      fireCelebrationConfetti();
    }, 2500);

    // Save match results to Prisma SQLite dev.db
    const winnerName = isTie ? 'Tie' : isTeamAWinner ? teamAName : teamBName;
    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamAName,
        teamBName,
        teamAScore,
        teamBScore,
        winner: winnerName,
      }),
    }).catch((err) => console.error('Error saving session:', err));

    // Score Counter Animation
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    const counter = setInterval(() => {
      step++;
      const progress = step / steps;
      setDisplayedScoreA(Math.floor(teamAScore * progress));
      setDisplayedScoreB(Math.floor(teamBScore * progress));

      if (step >= steps) {
        clearInterval(counter);
        setDisplayedScoreA(teamAScore);
        setDisplayedScoreB(teamBScore);
      }
    }, stepTime);

    return () => {
      clearInterval(timer);
      clearInterval(counter);
    };
  }, [teamAScore, teamBScore, isTie, isTeamAWinner, teamAName, teamBName]);

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center justify-center bio-particles">
      <div className="max-w-4xl w-full text-center">
        
        {/* Trophy Header */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl clay-card bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl sm:text-6xl mx-auto shadow-clay animate-bounce mb-6">
          🏆
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full clay-pill bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-black mb-4">
          <Sparkles className="w-4 h-4 text-amber-600" />
          TOURNAMENT RESULTS
        </div>

        {/* Winner Declaration */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 font-heading tracking-tight mb-2">
          {isTeamAWinner && (
            <span className="text-blue-600">
              {teamAName.toUpperCase()} WINS!
            </span>
          )}
          {isTeamBWinner && (
            <span className="text-orange-600">
              {teamBName.toUpperCase()} WINS!
            </span>
          )}
          {isTie && (
            <span className="text-emerald-600">
              ECOSYSTEM CHAMPIONS!
            </span>
          )}
        </h2>

        <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-lg mx-auto mb-10">
          {isTie
            ? 'A spectacular dead-heat tie! Both teams demonstrated peerless scientific knowledge!'
            : isTeamAWinner
            ? `${teamAName} proved their mastery of microscopic life and ecological food webs!`
            : `${teamBName} safeguarded the biosphere with unmatched ecological deductions!`}
        </p>

        {/* Dual Score Cards Face-Off */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          
          {/* Team A Final Card */}
          <div className={`clay-card-blue p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${
            isTeamAWinner
              ? 'border-blue-400 ring-4 ring-blue-300 scale-105 shadow-clay'
              : 'border-blue-200 opacity-90'
          }`}>
            <div className="w-24 h-24 mb-3">
              <MicrobeMascot type="teamA" size={100} />
            </div>

            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">
              TEAM A • {teamAName}
            </span>

            <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono my-2">
              {displayedScoreA.toLocaleString()}
            </div>

            <div className="text-xs text-slate-600 font-black">
              Total Points Earned
            </div>

            {isTeamAWinner && (
              <span className="mt-4 text-xs font-black px-4 py-1.5 rounded-full clay-pill bg-blue-100 text-blue-800 border border-blue-300">
                👑 Grand Champions
              </span>
            )}
          </div>

          {/* Team B Final Card */}
          <div className={`clay-card-orange p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${
            isTeamBWinner
              ? 'border-orange-400 ring-4 ring-orange-300 scale-105 shadow-clay'
              : 'border-orange-200 opacity-90'
          }`}>
            <div className="w-24 h-24 mb-3">
              <MicrobeMascot type="teamB" size={100} />
            </div>

            <span className="text-xs font-black text-orange-700 uppercase tracking-widest">
              TEAM B • {teamBName}
            </span>

            <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono my-2">
              {displayedScoreB.toLocaleString()}
            </div>

            <div className="text-xs text-slate-600 font-black">
              Total Points Earned
            </div>

            {isTeamBWinner && (
              <span className="mt-4 text-xs font-black px-4 py-1.5 rounded-full clay-pill bg-orange-100 text-orange-800 border border-orange-300">
                👑 Grand Champions
              </span>
            )}
          </div>

        </div>

        {/* Next Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="w-full sm:w-auto clay-btn-white px-6 py-4 rounded-3xl text-slate-800 font-black text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={() => setStage('summary')}
            className="w-full sm:w-auto clay-btn-emerald px-10 py-4 rounded-3xl text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 font-heading cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>SEE WHAT WE LEARNED</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShowHallOfFame(true);
            }}
            className="w-full sm:w-auto clay-btn-white px-6 py-4 rounded-3xl text-amber-800 font-black text-base transition-all flex items-center justify-center gap-2 border-2 border-amber-300 bg-amber-50/80 hover:bg-amber-100"
          >
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Hall of Fame</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Start a new competition match?')) {
                resetGame();
              }
            }}
            className="w-full sm:w-auto clay-btn-white px-6 py-4 rounded-3xl text-slate-800 font-black text-base transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
        </div>

      </div>

      {/* Classroom Hall of Fame Modal */}
      <HallOfFameModal isOpen={showHallOfFame} onClose={() => setShowHallOfFame(false)} />
    </div>
  );
};
