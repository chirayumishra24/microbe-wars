'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CHAIN_ORGANISMS, AQUATIC_CHAIN_ORGANISMS, WEB_NODES, VALID_WEB_CONNECTIONS, OrganismItem, WebNode } from '@/data/foodChains';
import { sounds } from '@/utils/audio';
import { fireCelebrationConfetti, fireScorePop } from '@/utils/confetti';
import { ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { TurnPill } from '@/components/common/TurnPill';
import { FloatingScore } from '@/components/common/FloatingScore';

export const Zone2Container: React.FC = () => {
  const { addScore, markZoneComplete, setStage, teamACorrectCount, teamBCorrectCount, teamAName, teamBName } = useGame();
  const [floatingPoints, setFloatingPoints] = useState<number | null>(null);

  const [subGame, setSubGame] = useState<'chain' | 'web' | 'complete'>('chain');

  // --- GAME A: DUAL-TEAM TURN-BY-TURN FOOD CHAIN ---
  const [chainTurn, setChainTurn] = useState<'teamA' | 'teamB'>('teamA');

  const targetTerrestrialOrder = ['grass', 'caterpillar', 'bird', 'eagle'];
  const targetAquaticOrder = ['algae', 'zooplankton', 'minnow', 'heron'];

  const initialCardsA: OrganismItem[] = [
    CHAIN_ORGANISMS[2], // Bird
    CHAIN_ORGANISMS[0], // Grass
    CHAIN_ORGANISMS[3], // Eagle
    CHAIN_ORGANISMS[1], // Caterpillar
  ];
  const initialCardsB: OrganismItem[] = [
    AQUATIC_CHAIN_ORGANISMS[2], // Minnow
    AQUATIC_CHAIN_ORGANISMS[0], // Algae
    AQUATIC_CHAIN_ORGANISMS[3], // Heron
    AQUATIC_CHAIN_ORGANISMS[1], // Zooplankton
  ];

  const [availableChainCards, setAvailableChainCards] = useState<OrganismItem[]>(initialCardsA);
  const [placedChain, setPlacedChain] = useState<(OrganismItem | null)[]>([null, null, null, null]);
  const [chainEnergyActive, setChainEnergyActive] = useState(false);
  const [chainMessage, setChainMessage] = useState<string | null>(null);

  const handlePlaceInSlot = (slotIdx: number, item: OrganismItem) => {
    sounds.playClick();
    const newPlaced = [...placedChain];

    const existing = newPlaced[slotIdx];
    let newAvailable = availableChainCards.filter(c => c.id !== item.id);
    if (existing) {
      newAvailable = [...newAvailable, existing];
    }

    newPlaced[slotIdx] = item;
    setPlacedChain(newPlaced);
    setAvailableChainCards(newAvailable);
  };

  const handleRemoveFromSlot = (slotIdx: number) => {
    const existing = placedChain[slotIdx];
    if (!existing) return;
    sounds.playClick();
    const newPlaced = [...placedChain];
    newPlaced[slotIdx] = null;
    setPlacedChain(newPlaced);
    setAvailableChainCards([...availableChainCards, existing]);
  };

  const handleCheckChain = () => {
    if (placedChain.some(item => item === null)) {
      sounds.playIncorrect();
      setChainMessage('Please fill all 4 slots in the food chain sequence first!');
      return;
    }

    const currentOrder = placedChain.map(item => item!.id);
    const targetOrder = chainTurn === 'teamA' ? targetTerrestrialOrder : targetAquaticOrder;
    const isCorrect = currentOrder.every((id, idx) => id === targetOrder[idx]);

    if (isCorrect) {
      sounds.playEnergyWhoosh();
      fireScorePop();
      addScore(150, chainTurn);
      setFloatingPoints(150);
      setChainEnergyActive(true);

      const teamName = chainTurn === 'teamA' ? teamAName : teamBName;
      const cropText = chainTurn === 'teamA' ? 'Sunflowers Surge!' : 'Corn Crops Surge!';
      setChainMessage(`✓ EXCELLENT! +150 POINTS for ${teamName}! ${cropText} Energy flows from Producer up to Apex Predator!`);

      if (chainTurn === 'teamA') {
        setTimeout(() => {
          setChainTurn('teamB');
          setAvailableChainCards(initialCardsB);
          setPlacedChain([null, null, null, null]);
          setChainEnergyActive(false);
          setChainMessage(null);
        }, 2400);
      } else {
        setTimeout(() => {
          setSubGame('web');
        }, 2400);
      }
    } else {
      sounds.playIncorrect();
      setChainMessage('✕ Incorrect sequence! Energy flows from Producer ➔ Primary Consumer ➔ Secondary Consumer ➔ Apex Predator.');
    }
  };

  // --- GAME B: BUILD THE FOOD WEB (ALTERNATING LINK TURNS) ---
  const [webTurn, setWebTurn] = useState<'teamA' | 'teamB'>('teamA');
  const [selectedSourceNode, setSelectedSourceNode] = useState<WebNode | null>(null);
  const [establishedLinks, setEstablishedLinks] = useState<{ from: string; to: string }[]>([]);
  const [webFeedback, setWebFeedback] = useState<{ success?: boolean; text: string } | null>(null);

  const targetRequiredLinksCount = 5;

  const handleNodeClick = (node: WebNode) => {
    sounds.playClick();

    if (!selectedSourceNode) {
      setSelectedSourceNode(node);
      const teamLabel = webTurn === 'teamA' ? 'The Explorers' : 'The Guardians';
      setWebFeedback({ text: `[${teamLabel}] Selected "${node.label}". Now click who eats it or whom it eats!` });
      return;
    }

    if (selectedSourceNode.id === node.id) {
      setSelectedSourceNode(null);
      setWebFeedback(null);
      return;
    }

    const validLink = VALID_WEB_CONNECTIONS.find(
      c => (c.from === selectedSourceNode.id && c.to === node.id) ||
           (c.from === node.id && c.to === selectedSourceNode.id)
    );

    const alreadyAdded = establishedLinks.some(
      c => (c.from === selectedSourceNode.id && c.to === node.id) ||
           (c.from === node.id && c.to === selectedSourceNode.id)
    );

    if (alreadyAdded) {
      sounds.playIncorrect();
      setWebFeedback({ success: false, text: 'This connection is already established in the food web!' });
      setSelectedSourceNode(null);
      return;
    }

    if (validLink) {
      sounds.playEnergyWhoosh();
      fireScorePop();
      const currentTeam = webTurn;
      addScore(40, currentTeam);
      setFloatingPoints(40);
      const newLinks = [...establishedLinks, { from: validLink.from, to: validLink.to }];
      setEstablishedLinks(newLinks);
      const teamName = currentTeam === 'teamA' ? teamAName : teamBName;
      setWebFeedback({
        success: true,
        text: `✓ Valid link established by ${teamName}! ${validLink.label} (+40 PTS & Crops Grow 🌱)`
      });
      setSelectedSourceNode(null);

      // Alternate turn to opposing team
      setWebTurn(prev => (prev === 'teamA' ? 'teamB' : 'teamA'));

      if (newLinks.length >= targetRequiredLinksCount) {
        sounds.playFanfare();
        fireCelebrationConfetti();
        addScore(100, currentTeam);
        markZoneComplete('zone2');
        setTimeout(() => {
          setSubGame('complete');
        }, 1500);
      }
    } else {
      sounds.playIncorrect();
      setWebFeedback({
        success: false,
        text: `✕ Invalid connection! ${selectedSourceNode.label} and ${node.label} do not have a direct trophic relationship.`
      });
      setSelectedSourceNode(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-4 sm:p-6 flex flex-col items-center bio-particles">
      <div className="max-w-5xl w-full">
        
        {/* Breadcrumb Header */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>ZONE 2</span>
              <span>•</span>
              <span>TROPHIC LEVELS & ENERGY FLOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-0.5">
              FOOD CHAIN ARENA
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setSubGame('chain')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                subGame === 'chain'
                  ? 'clay-btn-emerald text-white'
                  : 'clay-btn-white text-slate-700'
              }`}
            >
              1. Build Chain
            </button>
            <button
              onClick={() => setSubGame('web')}
              className={`px-4 py-2 rounded-2xl font-black transition-all ${
                subGame === 'web'
                  ? 'clay-btn-emerald text-white'
                  : 'clay-btn-white text-slate-700'
              }`}
            >
              2. Build Food Web
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* GAME A: BUILD THE FOOD CHAIN */}
        {/* ---------------------------------------------------- */}
        {subGame === 'chain' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md relative">
            {floatingPoints && (
              <FloatingScore points={floatingPoints} onComplete={() => setFloatingPoints(null)} />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  GAME A: BUILD THE FOOD CHAIN ({chainTurn === 'teamA' ? 'Terrestrial' : 'Aquatic'})
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Arrange the organisms in order of energy flow: Producer ➔ Primary ➔ Secondary ➔ Apex Predator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TurnPill currentTeam={chainTurn} teamACount={teamACorrectCount} teamBCount={teamBCorrectCount} />
                <span className="clay-pill text-xs font-black text-amber-700 bg-amber-100">
                  +150 Pts
                </span>
              </div>
            </div>

            {/* The 4 Food Chain Slots */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 relative">
              {placedChain.map((item, slotIdx) => (
                <div key={slotIdx} className="relative flex flex-col items-center">
                  
                  <div
                    onClick={() => handleRemoveFromSlot(slotIdx)}
                    className={`w-full min-h-[160px] rounded-3xl flex flex-col items-center justify-center p-4 text-center transition-all cursor-pointer ${
                      item
                        ? 'clay-card border-2 border-emerald-400 bg-emerald-50/90 hover:scale-105'
                        : 'clay-card border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-white/70'
                    }`}
                  >
                    {item ? (
                      <>
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className="font-black text-sm text-slate-900">{item.name}</div>
                        <div className="clay-pill text-[10px] text-emerald-800 font-black uppercase mt-1 bg-emerald-100">
                          {item.trophicLevel}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-2 hover:text-red-500 font-bold">
                          (Click to remove)
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-black text-slate-500 uppercase">
                          Step {slotIdx + 1}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-bold">
                          {slotIdx === 0 ? 'Producer' :
                           slotIdx === 1 ? 'Primary Consumer' :
                           slotIdx === 2 ? 'Secondary Consumer' : 'Apex Predator'}
                        </div>
                      </>
                    )}
                  </div>

                  {slotIdx < 3 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-600 font-black">
                      <span className={`text-2xl ${chainEnergyActive ? 'animate-pulse font-black text-amber-500' : ''}`}>➔</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pulsing Energy Flow indicator */}
            {chainEnergyActive && (
              <div className="clay-card p-4 mb-6 rounded-2xl bg-emerald-100/90 border-2 border-emerald-400 text-emerald-950 text-xs font-black flex items-center justify-center gap-2 animate-pulse">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>ENERGY IS FLOWING: Solar Photons ➔ Chemical Energy in Plants ➔ Biomass in Animal Tissues!</span>
              </div>
            )}

            {/* Available Cards Tray */}
            <div className="clay-card p-5 rounded-3xl bg-slate-50/80 mb-6">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                Click a card below to place it into the next open slot:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableChainCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      const firstOpenIdx = placedChain.findIndex(s => s === null);
                      if (firstOpenIdx !== -1) {
                        handlePlaceInSlot(firstOpenIdx, card);
                      }
                    }}
                    className="clay-btn-white p-3 rounded-2xl hover:border-emerald-400 transition-all flex flex-col items-center text-center"
                  >
                    <span className="text-3xl mb-1">{card.icon}</span>
                    <span className="font-black text-xs text-slate-900">{card.name}</span>
                    <span className="text-[10px] font-bold text-slate-500">{card.trophicLevel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback & Actions */}
            {chainMessage && (
              <div className="clay-card p-4 rounded-2xl text-xs font-black text-slate-800 mb-4">
                {chainMessage}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setPlacedChain([null, null, null, null]);
                  setAvailableChainCards([CHAIN_ORGANISMS[2], CHAIN_ORGANISMS[0], CHAIN_ORGANISMS[3], CHAIN_ORGANISMS[1]]);
                  setChainEnergyActive(false);
                  setChainMessage(null);
                }}
                className="clay-btn-white px-4 py-2.5 rounded-2xl text-slate-700 text-xs font-black flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Chain</span>
              </button>

              {!chainEnergyActive ? (
                <button
                  onClick={handleCheckChain}
                  className="clay-btn-emerald px-7 py-3 rounded-2xl text-white font-black text-sm font-heading"
                >
                  Verify Food Chain
                </button>
              ) : (
                <button
                  onClick={() => setSubGame('web')}
                  className="clay-btn-emerald px-7 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 font-heading"
                >
                  <span>Continue to Food Web</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* GAME B: BUILD THE FOOD WEB */}
        {/* ---------------------------------------------------- */}
        {subGame === 'web' && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl backdrop-blur-md">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  GAME B: BUILD THE FOOD WEB (Alternating Turns)
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Click two organisms that have an ecological connection to link them! Connect at least {targetRequiredLinksCount} valid relationships.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TurnPill currentTeam={webTurn} teamACount={teamACorrectCount} teamBCount={teamBCorrectCount} />
                <span className="text-xs text-emerald-800 font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Links: {establishedLinks.length} / {targetRequiredLinksCount}
                </span>
              </div>
            </div>

            {webFeedback && (
              <div className={`clay-card p-3.5 mb-4 rounded-2xl text-xs font-black ${
                webFeedback.success
                  ? 'border-2 border-emerald-400 bg-emerald-50 text-emerald-950'
                  : 'border-2 border-slate-300 bg-white text-slate-800'
              }`}>
                {webFeedback.text}
              </div>
            )}

            {/* Interactive Node Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 my-6">
              {WEB_NODES.map((node) => {
                const isSelected = selectedSourceNode?.id === node.id;
                const linkCount = establishedLinks.filter(
                  l => l.from === node.id || l.to === node.id
                ).length;

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`clay-card p-4 rounded-2xl transition-all flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'border-2 border-teal-500 ring-4 ring-teal-300 scale-105 bg-teal-50'
                        : linkCount > 0
                        ? 'border-2 border-emerald-400 bg-emerald-50/90 text-emerald-950'
                        : 'bg-white/80 text-slate-800 hover:scale-105'
                    }`}
                  >
                    {linkCount > 0 && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {linkCount}
                      </span>
                    )}

                    <span className="text-3xl sm:text-4xl mb-1.5">{node.icon}</span>
                    <span className="font-black text-xs text-slate-900 leading-tight">{node.label}</span>
                    <span className="clay-pill text-[9px] text-slate-600 uppercase tracking-wide mt-1.5 font-black bg-slate-100">
                      {node.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Established Links List */}
            <div className="clay-card p-5 rounded-3xl bg-slate-50/80">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Active Food Web Energy Pathways ({establishedLinks.length}):
              </div>

              {establishedLinks.length === 0 ? (
                <p className="text-xs font-semibold text-slate-500 italic">
                  No pathways established yet. Click one organism (e.g. Plants) and then another (e.g. Insects) to create an energy arrow.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {establishedLinks.map((link, idx) => {
                    const fromNode = WEB_NODES.find(n => n.id === link.from);
                    const toNode = WEB_NODES.find(n => n.id === link.to);

                    return (
                      <span
                        key={idx}
                        className="clay-pill text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 flex items-center gap-1.5"
                      >
                        <span>{fromNode?.icon} {fromNode?.label}</span>
                        <span>➔</span>
                        <span>{toNode?.icon} {toNode?.label}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ZONE 2 COMPLETED CELEBRATION */}
        {/* ---------------------------------------------------- */}
        {subGame === 'complete' && (
          <div className="clay-card p-8 sm:p-12 rounded-3xl text-center max-w-2xl mx-auto border-2 border-emerald-400 backdrop-blur-md">
            <div className="w-20 h-20 rounded-3xl clay-card bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl mx-auto mb-4">
              🌱
            </div>

            <span className="clay-pill text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 border border-emerald-300">
              Badge Unlocked: Trophic Master
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              ZONE 2 COMPLETED!
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
              Your team mastered trophic levels, energy transfer sequences, and interconnected ecological webs! Your crops are growing healthy!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStage('zone-3')}
                className="w-full sm:w-auto clay-btn-emerald px-8 py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 font-heading"
              >
                <span>ENTER ZONE 3: DECAY DETECTIVE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setStage('map')}
                className="w-full sm:w-auto clay-btn-white px-6 py-3.5 rounded-2xl text-slate-800 font-black text-base"
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
