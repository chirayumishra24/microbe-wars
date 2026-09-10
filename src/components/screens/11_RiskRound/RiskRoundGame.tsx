'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { RISK_ROUND_QUESTIONS, RiskRoundQuestion } from '@/data/questions';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { Coins, Flame, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

export const RiskRoundGame: React.FC = () => {
  const { addScore, deductScore, markZoneComplete, setStage, activeTurnTeam } = useGame();

  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQ: RiskRoundQuestion = RISK_ROUND_QUESTIONS[questionIdx];

  const [selectedWager, setSelectedWager] = useState<number>(25); // 10, 25, 50
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ win: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const handleSelectWager = (wager: number) => {
    if (selectedChoice !== null) return;
    sounds.playClick();
    setSelectedWager(wager);
  };

  const handleAnswer = (choiceIdx: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIdx);

    const isCorrect = choiceIdx === currentQ.correctIndex;

    if (isCorrect) {
      // WIN DOUBLE THE WAGER
      const reward = selectedWager * 2;
      sounds.playCorrect();
      fireScorePop();
      addScore(reward);
      setFeedback({
        win: true,
        text: `✓ JACKPOT WIN! You wagered ${selectedWager} and WON DOUBLE (+${reward} PTS) for ${activeTurnTeam === 'teamA' ? 'The Explorers' : 'The Guardians'}! ${currentQ.explanation}`
      });
    } else {
      // LOSE THE WAGER
      sounds.playIncorrect();
      deductScore(selectedWager);
      setFeedback({
        win: false,
        text: `✕ BUST! You lost your wager (-${selectedWager} PTS). ${currentQ.explanation}`
      });
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (questionIdx + 1 < RISK_ROUND_QUESTIONS.length) {
      setQuestionIdx(questionIdx + 1);
      setSelectedChoice(null);
      setFeedback(null);
      setShowHint(false);
    } else {
      sounds.playFanfare();
      fireCelebrationConfetti();
      markZoneComplete('risk');
      setRoundComplete(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>HIGH STAKES</span>
              <span>•</span>
              <span>TACTICAL STRATEGY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5 flex items-center gap-2">
              <Flame className="w-7 h-7 text-rose-500 fill-rose-400" />
              <span>RISK ROUND</span>
            </h2>
          </div>

          <div className="clay-pill text-xs font-black text-rose-800 bg-rose-100 border border-rose-300">
            Round {questionIdx + 1} of {RISK_ROUND_QUESTIONS.length}
          </div>
        </div>

        {!roundComplete ? (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            {/* Wager Selection Console */}
            <div className="mb-8 p-5 rounded-3xl clay-card bg-rose-50/60 border border-rose-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Choose Your Point Wager Before Answering:</span>
                  </div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">
                    Correct = <b className="text-emerald-700">WIN DOUBLE</b> • Incorrect = <b className="text-rose-600">LOSE WAGER</b>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      disabled={selectedChoice !== null}
                      onClick={() => handleSelectWager(amount)}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                        selectedWager === amount
                          ? 'clay-btn-orange text-white scale-105'
                          : 'clay-btn-white text-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <span>🪙</span>
                      <span>{amount} pts</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mb-4 text-center">
                {currentQ.question}
              </h3>

              {showHint && (
                <div className="clay-card p-3 rounded-2xl bg-amber-50 text-xs font-semibold text-amber-900 text-center mb-4 flex items-center justify-center gap-2 border border-amber-300">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>{currentQ.hint}</span>
                </div>
              )}

              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 underline"
                >
                  {showHint ? 'Hide Strategic Hint' : '💡 Need a strategic hint?'}
                </button>
              </div>

              {/* Choices Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedChoice === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  return (
                    <button
                      key={idx}
                      disabled={selectedChoice !== null}
                      onClick={() => handleAnswer(idx)}
                      className={`p-5 rounded-2xl text-left font-black text-sm sm:text-base transition-all flex items-center justify-between ${
                        selectedChoice === null
                          ? 'clay-btn-white text-slate-800 hover:border-rose-400 hover:scale-102'
                          : isCorrect
                          ? 'clay-card border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-black'
                          : isSelected
                          ? 'clay-card border-2 border-rose-400 bg-rose-50 text-rose-950 font-black'
                          : 'clay-card opacity-50 bg-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedChoice !== null && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 ml-2" />
                      )}
                      {selectedChoice === idx && !isCorrect && (
                        <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Next */}
            {feedback && (
              <div className={`clay-card p-4 rounded-2xl text-xs sm:text-sm font-semibold mb-4 ${
                feedback.win
                  ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-2 border-rose-400 bg-rose-50 text-rose-950'
              }`}>
                <p>{feedback.text}</p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleNextQuestion}
                    className="clay-btn-orange px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5"
                  >
                    <span>{questionIdx + 1 < RISK_ROUND_QUESTIONS.length ? 'Next Risk Wager' : 'Proceed to Final Emergency'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="clay-card p-8 sm:p-12 rounded-3xl border-2 border-rose-400 text-center max-w-xl mx-auto backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-rose-100 text-rose-600 flex items-center justify-center text-4xl mx-auto mb-4">
              🎲
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mb-2">
              RISK ROUND COMPLETE!
            </h3>

            <p className="text-slate-600 text-sm font-semibold mb-6 leading-relaxed">
              The stakes were high, and both teams fought with courage! Now comes the ultimate climax of the entire journey...
            </p>

            <button
              onClick={() => setStage('final-challenge')}
              className="clay-btn-emerald px-8 py-4 rounded-3xl text-white font-black text-base flex items-center justify-center gap-2 mx-auto font-heading"
            >
              <span>ENTER THE FINAL CHALLENGE: SAVE THE ECOSYSTEM!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
