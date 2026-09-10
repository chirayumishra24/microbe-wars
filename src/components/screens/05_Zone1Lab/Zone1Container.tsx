'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { MICROBE_MYSTERIES, SORTER_CARDS, TRUE_FALSE_QUESTIONS, SorterCard } from '@/data/microbes';
import { MicrobeScene } from '@/components/3d/MicrobeScene';
import { Microbe2DDiagram } from '@/components/common/Microbe2DDiagram';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Compass,
  Shield,
  Sprout,
} from 'lucide-react';

export const Zone1Container: React.FC = () => {
  const { addScore, markZoneComplete, setStage, teamACorrectCount, teamBCorrectCount } = useGame();

  const [subGame, setSubGame] = useState<'detective' | 'sorter' | 'truefalse' | 'complete'>('detective');

  // --- GAME A: DUAL-CARD TURN-BY-TURN DETECTIVE DUEL ---
  const [roundIdx, setRoundIdx] = useState(0); // 3 Duel Levels (Rounds 0, 1, 2)
  const [duelTurn, setDuelTurn] = useState<'teamA' | 'teamB'>('teamA');
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState<number | null>(null);

  // Team A (The Explorers) Card State
  const [viewModeA, setViewModeA] = useState<'3d' | '2d'>('3d');
  const [revealedCluesA, setRevealedCluesA] = useState<string[]>(['habitat']);
  const [selectedAnswerA, setSelectedAnswerA] = useState<string | null>(null);
  const [feedbackA, setFeedbackA] = useState<{ correct: boolean; text: string } | null>(null);

  // Team B (The Guardians) Card State
  const [viewModeB, setViewModeB] = useState<'3d' | '2d'>('3d');
  const [revealedCluesB, setRevealedCluesB] = useState<string[]>(['habitat']);
  const [selectedAnswerB, setSelectedAnswerB] = useState<string | null>(null);
  const [feedbackB, setFeedbackB] = useState<{ correct: boolean; text: string } | null>(null);

  // Paired same-difficulty questions for current level
  const mysteryA = MICROBE_MYSTERIES[roundIdx * 2] || MICROBE_MYSTERIES[0];
  const mysteryB = MICROBE_MYSTERIES[roundIdx * 2 + 1] || MICROBE_MYSTERIES[1];

  const handleRevealClueA = (key: string) => {
    sounds.playClick();
    if (!revealedCluesA.includes(key)) setRevealedCluesA([...revealedCluesA, key]);
  };

  const handleRevealClueB = (key: string) => {
    sounds.playClick();
    if (!revealedCluesB.includes(key)) setRevealedCluesB([...revealedCluesB, key]);
  };

  const handleAnswerA = (option: string) => {
    if (selectedAnswerA || duelTurn !== 'teamA') return;
    setSelectedAnswerA(option);

    if (option === mysteryA.category) {
      sounds.playCorrect();
      fireScorePop();
      addScore(100, 'teamA');
      setFeedbackA({
        correct: true,
        text: `✓ Correct! (+100 PTS) The Explorers' sunflowers grow taller in the 3D garden! ${mysteryA.explanation}`
      });
    } else {
      sounds.playIncorrect();
      setFeedbackA({
        correct: false,
        text: `✕ Incorrect! It was ${mysteryA.category}. ${mysteryA.explanation}`
      });
    }

    // Automatically transition to Team B's turn after brief moment
    setTimeout(() => {
      setDuelTurn('teamB');
    }, 700);
  };

  const handleAnswerB = (option: string) => {
    if (selectedAnswerB || duelTurn !== 'teamB') return;
    setSelectedAnswerB(option);

    if (option === mysteryB.category) {
      sounds.playCorrect();
      fireScorePop();
      addScore(100, 'teamB');
      setFeedbackB({
        correct: true,
        text: `✓ Correct! (+100 PTS) The Guardians' corn crops shoot up in the 3D garden! ${mysteryB.explanation}`
      });
    } else {
      sounds.playIncorrect();
      setFeedbackB({
        correct: false,
        text: `✕ Incorrect! It was ${mysteryB.category}. ${mysteryB.explanation}`
      });
    }
  };

  const handleNextRound = useCallback(() => {
    sounds.playClick();
    if (roundIdx + 1 < 3) {
      setRoundIdx(prev => prev + 1);
      setSelectedAnswerA(null);
      setSelectedAnswerB(null);
      setFeedbackA(null);
      setFeedbackB(null);
      setRevealedCluesA(['habitat']);
      setRevealedCluesB(['habitat']);
      setDuelTurn('teamA');
      setAutoAdvanceSeconds(null);
    } else {
      setSubGame('sorter');
    }
  }, [roundIdx]);

  // Automatically change question when both teams have answered
  useEffect(() => {
    if (selectedAnswerA !== null && selectedAnswerB !== null) {
      setAutoAdvanceSeconds(3);
      const interval = setInterval(() => {
        setAutoAdvanceSeconds((prev) => (prev !== null && prev > 1 ? prev - 1 : 1));
      }, 1000);

      const timer = setTimeout(() => {
        handleNextRound();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setAutoAdvanceSeconds(null);
    }
  }, [selectedAnswerA, selectedAnswerB, handleNextRound]);

  // --- GAME B: SORTER (ALTERNATING TEAM TURNS) ---
  const categories = ['Producers', 'Consumers', 'Decomposers', 'Other Microorganisms'] as const;
  type Category = typeof categories[number];

  const [cardsToPlace, setCardsToPlace] = useState<SorterCard[]>(SORTER_CARDS);
  const [selectedSorterCard, setSelectedSorterCard] = useState<SorterCard | null>(SORTER_CARDS[0]);
  const [sorterTurn, setSorterTurn] = useState<'teamA' | 'teamB'>('teamA');
  const [sorterAutoAdvanceSeconds, setSorterAutoAdvanceSeconds] = useState<number | null>(null);
  const [buckets, setBuckets] = useState<Record<Category, SorterCard[]>>({
    Producers: [],
    Consumers: [],
    Decomposers: [],
    'Other Microorganisms': [],
  });
  const [sorterMessage, setSorterMessage] = useState<string | null>(null);

  const handleDropIntoBucket = (cat: Category) => {
    if (!selectedSorterCard) return;

    if (selectedSorterCard.category === cat) {
      sounds.playCorrect();
      fireScorePop();
      const currentTeam = sorterTurn;
      addScore(50, currentTeam);

      setBuckets(prev => ({
        ...prev,
        [cat]: [...prev[cat], selectedSorterCard]
      }));

      const remaining = cardsToPlace.filter(c => c.id !== selectedSorterCard.id);
      setCardsToPlace(remaining);
      setSelectedSorterCard(remaining.length > 0 ? remaining[0] : null);

      const teamName = currentTeam === 'teamA' ? 'The Explorers (Team A)' : 'The Guardians (Team B)';
      const cropName = currentTeam === 'teamA' ? 'Sunflowers' : 'Corn';
      setSorterMessage(`✓ Correct! ${teamName} placed ${selectedSorterCard.name} under ${cat}! (+50 PTS & ${cropName} Grew 🌱)`);

      // Alternate turn to the other team for the next card
      setSorterTurn(prev => (prev === 'teamA' ? 'teamB' : 'teamA'));
    } else {
      sounds.playIncorrect();
      setSorterMessage(`✕ Try again! Hint: ${selectedSorterCard.hint}`);
    }
  };

  // Auto-advance to True/False when all cards are placed in Sorter
  useEffect(() => {
    if (subGame === 'sorter' && cardsToPlace.length === 0) {
      setSorterAutoAdvanceSeconds(3);
      const interval = setInterval(() => {
        setSorterAutoAdvanceSeconds(prev => (prev !== null && prev > 1 ? prev - 1 : 1));
      }, 1000);

      const timer = setTimeout(() => {
        setSubGame('truefalse');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setSorterAutoAdvanceSeconds(null);
    }
  }, [subGame, cardsToPlace.length]);

  // --- GAME C: TRUE OR FALSE (ALTERNATING TEAM TURNS) ---
  const [tfIdx, setTfIdx] = useState(0);
  const [selectedTf, setSelectedTf] = useState<boolean | null>(null);
  const [tfFeedback, setTfFeedback] = useState<string | null>(null);
  const [tfAutoAdvanceSeconds, setTfAutoAdvanceSeconds] = useState<number | null>(null);

  // Alternates turn: Question 0 & 2: Team A, Question 1 & 3: Team B
  const tfTeam: 'teamA' | 'teamB' = tfIdx % 2 === 0 ? 'teamA' : 'teamB';
  const currentTf = TRUE_FALSE_QUESTIONS[tfIdx];

  const handleAnswerTf = (val: boolean) => {
    if (selectedTf !== null) return;
    setSelectedTf(val);

    if (val === currentTf.isTrue) {
      sounds.playCorrect();
      fireScorePop();
      addScore(100, tfTeam);
      const teamLabel = tfTeam === 'teamA' ? "The Explorers' sunflowers grow!" : "The Guardians' corn shoots up!";
      setTfFeedback(`✓ Correct! (+100 PTS) ${teamLabel} — ${currentTf.explanation}`);
    } else {
      sounds.playIncorrect();
      setTfFeedback(`✕ Incorrect! — ${currentTf.explanation}`);
    }
  };

  const handleNextTf = useCallback(() => {
    sounds.playClick();
    if (tfIdx + 1 < TRUE_FALSE_QUESTIONS.length) {
      setTfIdx(prev => prev + 1);
      setSelectedTf(null);
      setTfFeedback(null);
      setTfAutoAdvanceSeconds(null);
    } else {
      sounds.playFanfare();
      fireCelebrationConfetti();
      markZoneComplete('zone1');
      setSubGame('complete');
    }
  }, [tfIdx, markZoneComplete]);

  // Auto-advance True/False after question is answered
  useEffect(() => {
    if (subGame === 'truefalse' && selectedTf !== null) {
      setTfAutoAdvanceSeconds(3);
      const interval = setInterval(() => {
        setTfAutoAdvanceSeconds(prev => (prev !== null && prev > 1 ? prev - 1 : 1));
      }, 1000);

      const timer = setTimeout(() => {
        handleNextTf();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setTfAutoAdvanceSeconds(null);
    }
  }, [subGame, selectedTf, handleNextTf]);

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        
        {/* Zone 1 Breadcrumb Clay Header */}
        <div className="clay-card flex flex-wrap items-center justify-between gap-3 mb-6 p-4">
          <div>
            <div className="text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>ZONE 1</span>
              <span>•</span>
              <span>MICROORGANISMS IN THE ENVIRONMENT</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 font-heading mt-0.5">
              MICROBE DETECTIVE LAB
            </h2>
          </div>

          {/* Sub-game Tabs */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setSubGame('detective')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                subGame === 'detective'
                  ? 'clay-btn-emerald'
                  : 'clay-btn-white'
              }`}
            >
              1. Detective
            </button>
            <button
              onClick={() => setSubGame('sorter')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                subGame === 'sorter'
                  ? 'clay-btn-emerald'
                  : 'clay-btn-white'
              }`}
            >
              2. Sorter
            </button>
            <button
              onClick={() => setSubGame('truefalse')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                subGame === 'truefalse'
                  ? 'clay-btn-emerald'
                  : 'clay-btn-white'
              }`}
            >
              3. True/False
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* GAME A: TWO-CARD TURN-BY-TURN DETECTIVE DUEL */}
        {/* ---------------------------------------------------- */}
        {subGame === 'detective' && (
          <div className="space-y-6">
            
            {/* Duel Level & Turn Status Header */}
            <div className="clay-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-2 border-emerald-200">
              <div className="flex items-center gap-2.5">
                <span className="clay-pill text-xs font-black text-emerald-950 px-4 py-1.5 bg-emerald-100/90 border border-emerald-300">
                  Duel Level {roundIdx + 1} of 3 (Same Difficulty)
                </span>
                <span className="text-xs font-black text-slate-700 hidden sm:inline">
                  ⚡ 2 Separate Specimens • 1-by-1 Turns
                </span>
              </div>

              {/* Live Turn Pill */}
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-all ${
                  selectedAnswerA && selectedAnswerB
                    ? 'bg-emerald-600 text-white animate-bounce'
                    : duelTurn === 'teamA'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-orange-500 text-white ring-4 ring-orange-200'
                }`}>
                  {selectedAnswerA && selectedAnswerB ? (
                    <>
                      <span>⏳</span>
                      <span>Next question in {autoAdvanceSeconds ?? 3}s...</span>
                    </>
                  ) : duelTurn === 'teamA' ? (
                    <>
                      <Compass className="w-4 h-4 text-white" />
                      <span>TURN: The Explorers (Team A)</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-white" />
                      <span>TURN: The Guardians (Team B)</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Two Cards Side-By-Side: Team A (Left) & Team B (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              
              {/* ======================================================== */}
              {/* CARD 1: THE EXPLORERS (TEAM A)                           */}
              {/* ======================================================== */}
              <div className={`clay-card-blue p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 relative border-2 ${
                duelTurn === 'teamA' && !selectedAnswerA
                  ? 'ring-4 ring-blue-500/80 shadow-2xl scale-[1.01] border-blue-400'
                  : selectedAnswerA
                  ? 'border-blue-200 opacity-95'
                  : 'opacity-70 border-slate-200'
              }`}>
                {/* Team Card Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
                      A
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-blue-950 text-base leading-tight">
                        The Explorers
                      </h4>
                      <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600 inline" />
                        <span>{teamACorrectCount} crops in 3D garden</span>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    selectedAnswerA
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : duelTurn === 'teamA'
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {selectedAnswerA ? '✓ Answered' : duelTurn === 'teamA' ? '👉 Your Turn' : 'Waiting'}
                  </span>
                </div>

                {/* 3D vs 2D Microscope Toggle */}
                <div className="flex items-center justify-center gap-1.5 p-1 bg-white/90 rounded-2xl border border-blue-200 mb-4 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setViewModeA('3d'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      viewModeA === '3d'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-800'
                    }`}
                  >
                    <span>🔬 3D Specimen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setViewModeA('2d'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      viewModeA === '2d'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-800'
                    }`}
                  >
                    <span>📋 2D Diagram</span>
                  </button>
                </div>

                {/* Microscope Viewport */}
                <div className="flex flex-col items-center mb-4">
                  {viewModeA === '3d' ? (
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-white bg-slate-950 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-blue-300">
                      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-cyan-400/30" />
                        <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
                        <div className="w-40 h-40 rounded-full border border-cyan-400/30" />
                      </div>
                      <MicrobeScene
                        type={
                          mysteryA.category === 'Bacteria' ? 'bacteria' :
                          mysteryA.category === 'Fungi' ? 'fungi' :
                          mysteryA.category === 'Algae' ? 'algae' :
                          mysteryA.category === 'Virus' ? 'virus' : 'amoeba'
                        }
                        color={mysteryA.color}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-6 border-white bg-white/95 shadow-xl flex items-center justify-center p-2 ring-4 ring-blue-300 overflow-hidden">
                      <Microbe2DDiagram
                        type={
                          mysteryA.category === 'Bacteria' ? 'bacteria' :
                          mysteryA.category === 'Fungi' ? 'fungi' :
                          mysteryA.category === 'Algae' ? 'algae' :
                          mysteryA.category === 'Virus' ? 'virus' : 'amoeba'
                        }
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  <span className="text-[10px] text-blue-900/80 font-bold mt-2">
                    Specimen A • Drag to inspect 360°
                  </span>
                </div>

                {/* Detective Clues Checklist */}
                <div className="space-y-2 mb-4 text-xs text-left">
                  <div className="font-black text-blue-950 uppercase tracking-wider text-[11px]">
                    Detective Clues (Team A):
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">
                    <b className="text-blue-900">Habitat:</b> {mysteryA.clues.habitat}
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                    <div>
                      <b className="text-blue-900">Shape:</b>{' '}
                      {revealedCluesA.includes('shape') ? (
                        <span>{mysteryA.clues.shape}</span>
                      ) : (
                        <button
                          onClick={() => handleRevealClueA('shape')}
                          disabled={duelTurn !== 'teamA' || selectedAnswerA !== null}
                          className="text-blue-700 hover:underline font-black"
                        >
                          🔍 Click to inspect morphology
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                    <div>
                      <b className="text-blue-900">Role:</b>{' '}
                      {revealedCluesA.includes('role') ? (
                        <span>{mysteryA.clues.role}</span>
                      ) : (
                        <button
                          onClick={() => handleRevealClueA('role')}
                          disabled={duelTurn !== 'teamA' || selectedAnswerA !== null}
                          className="text-blue-700 hover:underline font-black"
                        >
                          🔍 Click to inspect ecological role
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multiple Choice Answers */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-blue-950 text-left">
                    What is Specimen A?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {mysteryA.options.map((opt) => {
                      const isSelected = selectedAnswerA === opt;
                      const isCorrect = opt === mysteryA.category;

                      return (
                        <button
                          key={`optA-${opt}`}
                          disabled={duelTurn !== 'teamA' || selectedAnswerA !== null}
                          onClick={() => handleAnswerA(opt)}
                          className={`p-3 rounded-xl font-black text-xs border-2 transition-all flex items-center justify-between ${
                            selectedAnswerA === null
                              ? duelTurn === 'teamA'
                                ? 'clay-btn-white hover:border-blue-500 hover:scale-102 cursor-pointer'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                              : isSelected
                              ? 'bg-rose-100 border-rose-400 text-rose-950'
                              : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedAnswerA && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                          {selectedAnswerA && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Box */}
                {feedbackA && (
                  <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-left border ${
                    feedbackA.correct
                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                      : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}>
                    {feedbackA.text}
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* CARD 2: THE GUARDIANS (TEAM B)                           */}
              {/* ======================================================== */}
              <div className={`clay-card-orange p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 relative border-2 ${
                duelTurn === 'teamB' && !selectedAnswerB
                  ? 'ring-4 ring-orange-500/80 shadow-2xl scale-[1.01] border-orange-400'
                  : selectedAnswerB
                  ? 'border-orange-200 opacity-95'
                  : 'opacity-70 border-slate-200'
              }`}>
                {/* Team Card Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-xs">
                      B
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-orange-950 text-base leading-tight">
                        The Guardians
                      </h4>
                      <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600 inline" />
                        <span>{teamBCorrectCount} crops in 3D garden</span>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    selectedAnswerB
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : duelTurn === 'teamB'
                      ? 'bg-orange-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {selectedAnswerB ? '✓ Answered' : duelTurn === 'teamB' ? '👉 Your Turn' : 'Waiting for Team A'}
                  </span>
                </div>

                {/* 3D vs 2D Microscope Toggle */}
                <div className="flex items-center justify-center gap-1.5 p-1 bg-white/90 rounded-2xl border border-orange-200 mb-4 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setViewModeB('3d'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      viewModeB === '3d'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-orange-800'
                    }`}
                  >
                    <span>🔬 3D Specimen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setViewModeB('2d'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      viewModeB === '2d'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-orange-800'
                    }`}
                  >
                    <span>📋 2D Diagram</span>
                  </button>
                </div>

                {/* Microscope Viewport */}
                <div className="flex flex-col items-center mb-4">
                  {viewModeB === '3d' ? (
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-white bg-slate-950 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-orange-300">
                      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-cyan-400/30" />
                        <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
                        <div className="w-40 h-40 rounded-full border border-cyan-400/30" />
                      </div>
                      <MicrobeScene
                        type={
                          mysteryB.category === 'Bacteria' ? 'bacteria' :
                          mysteryB.category === 'Fungi' ? 'fungi' :
                          mysteryB.category === 'Algae' ? 'algae' :
                          mysteryB.category === 'Virus' ? 'virus' : 'amoeba'
                        }
                        color={mysteryB.color}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-6 border-white bg-white/95 shadow-xl flex items-center justify-center p-2 ring-4 ring-orange-300 overflow-hidden">
                      <Microbe2DDiagram
                        type={
                          mysteryB.category === 'Bacteria' ? 'bacteria' :
                          mysteryB.category === 'Fungi' ? 'fungi' :
                          mysteryB.category === 'Algae' ? 'algae' :
                          mysteryB.category === 'Virus' ? 'virus' : 'amoeba'
                        }
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  <span className="text-[10px] text-orange-900/80 font-bold mt-2">
                    Specimen B • Drag to inspect 360°
                  </span>
                </div>

                {/* Detective Clues Checklist */}
                <div className="space-y-2 mb-4 text-xs text-left">
                  <div className="font-black text-orange-950 uppercase tracking-wider text-[11px]">
                    Detective Clues (Team B):
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200">
                    <b className="text-orange-900">Habitat:</b> {mysteryB.clues.habitat}
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-between">
                    <div>
                      <b className="text-orange-900">Shape:</b>{' '}
                      {revealedCluesB.includes('shape') ? (
                        <span>{mysteryB.clues.shape}</span>
                      ) : (
                        <button
                          onClick={() => handleRevealClueB('shape')}
                          disabled={duelTurn !== 'teamB' || selectedAnswerB !== null}
                          className="text-orange-700 hover:underline font-black"
                        >
                          🔍 Click to inspect morphology
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-between">
                    <div>
                      <b className="text-orange-900">Role:</b>{' '}
                      {revealedCluesB.includes('role') ? (
                        <span>{mysteryB.clues.role}</span>
                      ) : (
                        <button
                          onClick={() => handleRevealClueB('role')}
                          disabled={duelTurn !== 'teamB' || selectedAnswerB !== null}
                          className="text-orange-700 hover:underline font-black"
                        >
                          🔍 Click to inspect ecological role
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multiple Choice Answers */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-orange-950 text-left">
                    What is Specimen B?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {mysteryB.options.map((opt) => {
                      const isSelected = selectedAnswerB === opt;
                      const isCorrect = opt === mysteryB.category;

                      return (
                        <button
                          key={`optB-${opt}`}
                          disabled={duelTurn !== 'teamB' || selectedAnswerB !== null}
                          onClick={() => handleAnswerB(opt)}
                          className={`p-3 rounded-xl font-black text-xs border-2 transition-all flex items-center justify-between ${
                            selectedAnswerB === null
                              ? duelTurn === 'teamB'
                                ? 'clay-btn-white hover:border-orange-500 hover:scale-102 cursor-pointer'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                              : isSelected
                              ? 'bg-rose-100 border-rose-400 text-rose-950'
                              : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedAnswerB && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                          {selectedAnswerB && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Box */}
                {feedbackB && (
                  <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-left border ${
                    feedbackB.correct
                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                      : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}>
                    {feedbackB.text}
                  </div>
                )}
              </div>

            </div>

            {/* Duel Round Complete Banner & Transition Button */}
            {selectedAnswerA && selectedAnswerB && (
              <div className="clay-card p-5 bg-gradient-to-r from-blue-50 via-emerald-50 to-orange-50 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
                <div className="text-left flex-1">
                  <h4 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>🏆 Duel Level {roundIdx + 1} Finished!</span>
                    <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-bold">
                      3D Garden Crops Updated
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                    {roundIdx < 2
                      ? `Both teams answered! Changing to Level ${roundIdx + 2} automatically in ${autoAdvanceSeconds ?? 3}s...`
                      : `All 3 detective levels complete! Proceeding to Microbe Sorter in ${autoAdvanceSeconds ?? 3}s...`}
                  </p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2 max-w-xs border border-slate-300">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((autoAdvanceSeconds ?? 3) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextRound}
                  className="clay-btn-emerald px-6 py-3 text-xs sm:text-sm font-black flex items-center gap-2 font-heading tracking-wide flex-shrink-0 shadow-lg hover:scale-103"
                >
                  <span>{roundIdx < 2 ? `Skip Wait (${autoAdvanceSeconds ?? 3}s)` : 'Continue Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* GAME B: MICROBE SORTER */}
        {/* ---------------------------------------------------- */}
        {subGame === 'sorter' && (
          <div className="clay-card p-6 sm:p-8">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  GAME B: MICROBE SORTER
                </h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">
                  Alternating turns: Sort each organism card into its accurate ecological trophic category.
                </p>
              </div>

              {/* Sorter Turn & Score Pill */}
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-all ${
                  sorterTurn === 'teamA'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-orange-500 text-white ring-4 ring-orange-200'
                }`}>
                  {sorterTurn === 'teamA' ? (
                    <>
                      <Compass className="w-4 h-4 text-white" />
                      <span>TURN: The Explorers (Team A)</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-white" />
                      <span>TURN: The Guardians (Team B)</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  +50 Pts Per Card
                </span>
              </div>
            </div>

            {/* Current Selected Card to Place with Team Accent */}
            <div className={`clay-card p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 transition-all ${
              sorterTurn === 'teamA' ? 'border-blue-400 bg-blue-50/40' : 'border-orange-400 bg-orange-50/40'
            }`}>
              {selectedSorterCard ? (
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-inner border-2 ${
                    sorterTurn === 'teamA' ? 'bg-blue-100 border-blue-300' : 'bg-orange-100 border-orange-300'
                  }`}>
                    {selectedSorterCard.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      <span className={sorterTurn === 'teamA' ? 'text-blue-700' : 'text-orange-700'}>
                        {sorterTurn === 'teamA' ? '👉 Team A Card to Classify' : '👉 Team B Card to Classify'}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5" />
                        {sorterTurn === 'teamA' ? `${teamACorrectCount} sunflowers` : `${teamBCorrectCount} corn`}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">
                      {selectedSorterCard.name}
                    </div>
                    <div className="text-xs text-slate-600 font-bold mt-0.5">
                      💡 Clue: {selectedSorterCard.hint}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-emerald-800 font-black text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>All cards successfully classified! Fantastic sorting skills!</span>
                </div>
              )}

              {selectedSorterCard && (
                <div className="clay-pill px-3.5 py-1 text-xs text-slate-700 font-black">
                  Cards remaining: <b className="text-slate-900">{cardsToPlace.length}</b>
                </div>
              )}
            </div>

            {sorterMessage && (
              <div className="mb-4 text-xs font-black p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-left">
                {sorterMessage}
              </div>
            )}

            {/* 4 Classification Category Drop Buckets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {categories.map((cat) => {
                const placedCards = buckets[cat];

                return (
                  <div
                    key={cat}
                    onClick={() => handleDropIntoBucket(cat)}
                    className="clay-card p-4 cursor-pointer transition-all flex flex-col justify-between min-h-[160px] group hover:border-teal-500"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading text-sm font-black text-slate-900 group-hover:text-teal-700">
                          {cat}
                        </span>
                        <span className="clay-pill text-[10px] font-black px-2 py-0.5 text-slate-700">
                          {placedCards.length}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-2">
                        {placedCards.map((c) => (
                          <div
                            key={c.id}
                            className="p-1.5 px-2 rounded-xl bg-emerald-100/80 border border-emerald-300 text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{c.icon}</span>
                            <span className="truncate">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={!selectedSorterCard}
                      className="clay-btn-white mt-3 w-full py-1.5 text-xs font-black text-slate-800 group-hover:text-teal-700"
                    >
                      Place Here ➔
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sorter Auto-Advance Banner */}
            {cardsToPlace.length === 0 && (
              <div className="clay-card p-5 bg-gradient-to-r from-blue-50 via-emerald-50 to-orange-50 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
                <div className="text-left flex-1">
                  <h4 className="font-heading text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>🎉 Microbe Sorter Completed!</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                    Transitioning to Game C (True or False) automatically in {sorterAutoAdvanceSeconds ?? 3}s...
                  </p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2 max-w-xs border border-slate-300">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((sorterAutoAdvanceSeconds ?? 3) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSubGame('truefalse')}
                  className="clay-btn-emerald px-8 py-3 font-black text-xs sm:text-sm flex items-center gap-2 font-heading shadow-lg hover:scale-103"
                >
                  <span>Continue Now ({sorterAutoAdvanceSeconds ?? 3}s)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* GAME C: TRUE OR FALSE */}
        {/* ---------------------------------------------------- */}
        {subGame === 'truefalse' && (
          <div className="clay-card p-6 sm:p-8">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="clay-pill text-xs font-black text-teal-900 px-3.5 py-1">
                Question #{tfIdx + 1} of {TRUE_FALSE_QUESTIONS.length}
              </span>

              {/* Turn Indicator for True/False */}
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-all ${
                  tfTeam === 'teamA'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-orange-500 text-white ring-4 ring-orange-200'
                }`}>
                  {tfTeam === 'teamA' ? (
                    <>
                      <Compass className="w-4 h-4 text-white" />
                      <span>QUESTION FOR: The Explorers (Team A)</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-white" />
                      <span>QUESTION FOR: The Guardians (Team B)</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  +100 Points
                </span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center py-6">
              <div className="text-6xl mb-4 animate-bounce">💡</div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mb-8">
                “{currentTf.statement}”
              </h3>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  disabled={selectedTf !== null}
                  onClick={() => handleAnswerTf(true)}
                  className={`px-10 py-5 text-xl font-black flex items-center gap-2.5 font-heading ${
                    selectedTf === null
                      ? 'clay-btn-emerald'
                      : currentTf.isTrue
                      ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300'
                      : selectedTf === true
                      ? 'bg-rose-600 text-white'
                      : 'opacity-50'
                  }`}
                >
                  <CheckCircle2 className="w-7 h-7" />
                  <span>TRUE</span>
                </button>

                <button
                  disabled={selectedTf !== null}
                  onClick={() => handleAnswerTf(false)}
                  className={`px-10 py-5 text-xl font-black flex items-center gap-2.5 font-heading ${
                    selectedTf === null
                      ? 'clay-btn-orange'
                      : !currentTf.isTrue
                      ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300'
                      : selectedTf === false
                      ? 'bg-rose-600 text-white'
                      : 'opacity-50'
                  }`}
                >
                  <XCircle className="w-7 h-7" />
                  <span>FALSE</span>
                </button>
              </div>

              {tfFeedback && (
                <div className="clay-card p-5 text-slate-900 text-sm font-bold text-left">
                  <p>{tfFeedback}</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3 max-w-xs border border-slate-300">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((tfAutoAdvanceSeconds ?? 3) / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500 font-bold">
                      Next in {tfAutoAdvanceSeconds ?? 3}s...
                    </span>
                    <button
                      onClick={handleNextTf}
                      className="clay-btn-emerald px-6 py-2.5 font-black text-xs sm:text-sm flex items-center gap-1.5 font-heading"
                    >
                      <span>{tfIdx + 1 < TRUE_FALSE_QUESTIONS.length ? 'Next Question Now' : 'Finish Zone 1 Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ZONE 1 COMPLETED CELEBRATION */}
        {/* ---------------------------------------------------- */}
        {subGame === 'complete' && (
          <div className="clay-card p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center text-5xl mx-auto mb-4">
              🔬
            </div>

            <span className="clay-pill text-xs font-black text-emerald-900 uppercase tracking-widest px-4 py-1.5">
              Badge Unlocked: Microbe Detective
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              ZONE 1 COMPLETED!
            </h2>

            <p className="text-slate-700 font-bold text-sm sm:text-base mt-2 max-w-md mx-auto">
              Your team mastered microbe identification, cellular structures, and ecological sorting! Check your crops growing in the 3D garden!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStage('zone-2')}
                className="clay-btn-emerald w-full sm:w-auto px-8 py-4 font-black text-base flex items-center justify-center gap-2 font-heading"
              >
                <span>ENTER ZONE 2: FOOD CHAIN ARENA</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setStage('map')}
                className="clay-btn-white w-full sm:w-auto px-6 py-4 font-black text-base font-heading"
              >
                View Game Map
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
