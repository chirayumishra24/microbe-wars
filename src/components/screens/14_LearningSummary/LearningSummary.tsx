'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { LEARNING_TAKEAWAYS } from '@/data/questions';
import { sounds } from '@/utils/audio';
import { RefreshCw, BookOpen, Award, Heart } from 'lucide-react';

export const LearningSummary: React.FC = () => {
  const { resetGame, badges } = useGame();

  const handlePlayAgain = () => {
    sounds.playClick();
    resetGame();
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 lg:p-8 flex flex-col items-center bio-particles">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full clay-pill bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black mb-3">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            SCIENCE CURRICULUM DEBRIEF
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
            WHAT DID WE LEARN?
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-lg mx-auto">
            Beyond the high-stakes competition, here are the essential scientific concepts to remember for life!
          </p>
        </div>

        {/* 5 Key Takeaway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {LEARNING_TAKEAWAYS.map((item, idx) => (
            <div
              key={idx}
              className="clay-card p-5 rounded-3xl flex items-start gap-4 hover:scale-102 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl clay-card bg-emerald-50 text-emerald-800 flex items-center justify-center text-3xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* 6th Card: Badges Summary */}
          <div className="clay-card p-5 rounded-3xl bg-emerald-50/90 border border-emerald-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase mb-1">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Classroom Honor Roll</span>
              </div>
              <h3 className="font-heading text-lg font-black text-slate-900 mb-1">
                Ecosystem Master Badges
              </h3>
              <p className="text-xs font-semibold text-slate-600 mb-3">
                Completed missions unlock special biological investigator credentials.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.id}
                  className={`clay-pill text-xs px-3 py-1 font-black flex items-center gap-1 ${
                    b.unlocked
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Final Memorable Quotation / Tagline Banner */}
        <div className="clay-card p-6 sm:p-8 rounded-3xl bg-emerald-100/90 border-2 border-emerald-300 text-center mb-8 shadow-clay">
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-heading tracking-wide">
            “Because even the smallest organisms play a big role.”
          </p>
          <div className="text-xs sm:text-sm text-emerald-800 font-black mt-2 flex items-center justify-center gap-1.5">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Protect Our Planet’s Microscopic Biosphere</span>
          </div>
        </div>

        {/* Restart Action */}
        <div className="flex justify-center">
          <button
            onClick={handlePlayAgain}
            className="clay-btn-emerald px-10 py-4 rounded-3xl text-white font-black text-base sm:text-lg flex items-center gap-2.5 font-heading"
          >
            <RefreshCw className="w-5 h-5" />
            <span>PLAY AGAIN / NEW TOURNAMENT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
