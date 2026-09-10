'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { RAPID_FIRE_QUESTIONS, RapidFireQuestion } from '@/data/questions';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { Zap, Timer, ArrowRight } from 'lucide-react';

export const RapidFireQuiz: React.FC = () => {
  const { addScore, markZoneComplete, setStage } = useGame();

  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  const currentQ: RapidFireQuestion = RAPID_FIRE_QUESTIONS[questionIdx % RAPID_FIRE_QUESTIONS.length];

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || isTimeUp) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      sounds.playFanfare();
      fireCelebrationConfetti();
      markZoneComplete('rapidFire');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeft, isTimeUp, markZoneComplete]);

  const handleStart = () => {
    sounds.playCorrect();
    setHasStarted(true);
  };

  const handleAnswer = (choiceIdx: number) => {
    if (isTimeUp) return;

    const isCorrect = choiceIdx === currentQ.correctIndex;
    setAnsweredCount((prev) => prev + 1);

    if (isCorrect) {
      sounds.playCorrect();
      fireScorePop();
      addScore(50);
      setCorrectCount((prev) => prev + 1);
      setLastFeedback({ correct: true, text: `✓ +50 PTS! ${currentQ.explanation}` });
    } else {
      sounds.playIncorrect();
      setLastFeedback({ correct: false, text: `✕ ${currentQ.explanation}` });
    }

    // Move to next question immediately
    setQuestionIdx((prev) => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-3xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>SPECIAL CHALLENGE</span>
              <span>•</span>
              <span>SPEED QUIZ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5 flex items-center gap-2">
              <Zap className="w-7 h-7 text-amber-500 fill-amber-400" />
              <span>RAPID FIRE ROUND</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="clay-pill flex items-center gap-1.5 px-4 py-2 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black">
              <Timer className="w-4 h-4 text-amber-600" />
              <span className="text-base font-mono text-amber-700">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {!hasStarted ? (
          <div className="clay-card p-8 sm:p-12 rounded-3xl text-center backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto mb-4">
              ⏱️
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mb-3">
              30-SECOND BLITZ!
            </h3>

            <p className="text-slate-600 text-sm sm:text-base font-semibold max-w-md mx-auto mb-6 leading-relaxed">
              Questions appear one after another covering all ecosystem topics. Answer as many as you can before the clock expires!
            </p>

            <div className="clay-pill p-3 max-w-sm mx-auto mb-8 text-xs font-black text-amber-900 bg-amber-100 border border-amber-300">
              ⚡ Reward: +50 Points for each correct answer & crop boost!
            </div>

            <button
              onClick={handleStart}
              className="clay-btn-orange px-10 py-4 rounded-3xl text-white font-black text-lg font-heading"
            >
              START 30s TIMER NOW!
            </button>
          </div>
        ) : !isTimeUp ? (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md relative">
            
            {/* Top Timer Bar */}
            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden mb-6 p-0.5 border border-slate-300">
              <div
                className={`h-full rounded-full transition-all duration-1000 linear ${
                  timeLeft <= 7 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-4 text-xs font-black">
              <span className="clay-pill text-indigo-900 bg-indigo-100 px-3 py-1">
                Topic: {currentQ.topic}
              </span>
              <span className="clay-pill text-amber-800 bg-amber-100 px-3 py-1 font-mono">
                +{correctCount * 50} pts ({correctCount}/{answeredCount})
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mb-6 min-h-[55px] flex items-center">
              {currentQ.question}
            </h3>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="clay-btn-white p-4 rounded-2xl text-left font-black text-sm text-slate-800 transition-all hover:scale-102"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Quick Feedback Flash */}
            {lastFeedback && (
              <div className={`clay-card p-3 rounded-2xl text-xs font-black text-center ${
                lastFeedback.correct
                  ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-2 border-rose-400 bg-rose-50 text-rose-950'
              }`}>
                {lastFeedback.text}
              </div>
            )}

          </div>
        ) : (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-amber-400 text-center max-w-xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🏆
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mb-2">
              TIME’S UP!
            </h3>

            <p className="text-slate-600 text-sm font-semibold mb-6">
              Incredible lightning-fast reflexes! Here is your blitz performance:
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="clay-card p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300">
                <div className="text-3xl font-black text-emerald-700">
                  {correctCount}
                </div>
                <div className="text-[11px] text-emerald-900 font-black uppercase mt-1">
                  Correct Answers
                </div>
              </div>

              <div className="clay-card p-4 rounded-2xl bg-amber-50/80 border border-amber-300">
                <div className="text-3xl font-black text-amber-700">
                  +{correctCount * 50}
                </div>
                <div className="text-[11px] text-amber-900 font-black uppercase mt-1">
                  Points Earned
                </div>
              </div>
            </div>

            <button
              onClick={() => setStage('risk')}
              className="clay-btn-orange px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 mx-auto font-heading"
            >
              <span>ENTER RISK ROUND (WAGERS!)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
