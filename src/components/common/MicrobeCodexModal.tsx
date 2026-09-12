'use client';

import React, { useState } from 'react';
import { MicrobeScene } from '@/components/3d/MicrobeScene';
import { Microbe2DDiagram } from '@/components/common/Microbe2DDiagram';
import { Volume2, X, Layers, Box } from 'lucide-react';
import { sounds } from '@/utils/audio';

interface MicrobeCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SpecimenId = 'bacteria' | 'fungi' | 'algae' | 'amoeba' | 'virus';

interface SpecimenInfo {
  id: SpecimenId;
  name: string;
  scientificName: string;
  icon: string;
  role: string;
  keyFacts: string[];
  keyAnatomy: { term: string; role: string }[];
}

const SPECIMENS: SpecimenInfo[] = [
  {
    id: 'bacteria',
    name: 'Bacillus Subtilis',
    scientificName: 'Prokaryotic Eubacterium',
    icon: '🔬',
    role: 'Decomposer & Nitrogen Recycler',
    keyFacts: [
      'Lacks a membrane-bound nucleus (DNA is a free circular nucleoid).',
      'Protected by a rigid peptidoglycan cell wall and outer capsule.',
      'Propelled through fluids by rotary flagella motors.',
    ],
    keyAnatomy: [
      { term: 'Nucleoid', role: 'Unbound circular chromosomal DNA' },
      { term: 'Peptidoglycan Wall', role: 'Tough structural sugar-protein mesh' },
      { term: 'Flagellum', role: 'Rotary proton-powered propeller' },
      { term: 'Ribosomes', role: 'Protein assembly factories in cytoplasm' },
    ],
  },
  {
    id: 'fungi',
    name: 'Yeast (Saccharomyces)',
    scientificName: 'Unicellular Eukaryote',
    icon: '🥣',
    role: 'Fermentation & Organic Decomposition',
    keyFacts: [
      'Has a true eukaryotic nucleus containing linear chromosomes.',
      'Cell wall is reinforced with chitin (same polymer as insect exoskeletons).',
      'Reproduces primarily by budding off clonal daughter cells.',
    ],
    keyAnatomy: [
      { term: 'Chitin Wall', role: 'Flexible yet strong polysaccharide shell' },
      { term: 'True Nucleus', role: 'Membrane-bound genetic control center' },
      { term: 'Mitochondria', role: 'Drives respiration and energy release' },
      { term: 'Budding Scar', role: 'Ring where a daughter clone detached' },
    ],
  },
  {
    id: 'algae',
    name: 'Chlamydomonas',
    scientificName: 'Unicellular Green Micro-Alga',
    icon: '🌱',
    role: 'Primary Producer & Oxygen Generator',
    keyFacts: [
      'Contains chloroplasts packed with chlorophyll to harness sunlight.',
      'Features a red carotenoid eyespot (stigma) to navigate toward light.',
      'Drives aquatic food chains as a foundation producer.',
    ],
    keyAnatomy: [
      { term: 'Cup Chloroplast', role: 'Performs oxygenic photosynthesis' },
      { term: 'Phototactic Eyespot', role: 'Steers the cell toward optimal light' },
      { term: 'Dual Flagella', role: 'Beats in breaststroke cycles to swim' },
      { term: 'Pyrenoid', role: 'Centers carbon fixation and starch storage' },
    ],
  },
  {
    id: 'amoeba',
    name: 'Amoeba Proteus',
    scientificName: 'Heterotrophic Protozoan',
    icon: '🦠',
    role: 'Microbial Predator (Phagocytosis)',
    keyFacts: [
      'Flows cytoplasm outward into pseudopodia ("false feet") to crawl.',
      'Engulfs bacteria and algae whole through phagocytosis.',
      'Uses a contractile vacuole to bail out excess fresh water.',
    ],
    keyAnatomy: [
      { term: 'Pseudopodia', role: 'Cytoplasmic extensions for crawling & engulfing' },
      { term: 'Food Vacuole', role: 'Internal digestive pouch with enzymes' },
      { term: 'Contractile Vacuole', role: 'Pumps out water to prevent osmotic burst' },
      { term: 'Plasma Membrane', role: 'Flexible boundary governing cell shape' },
    ],
  },
  {
    id: 'virus',
    name: 'Bacteriophage T4',
    scientificName: 'Acellular Biological Entity',
    icon: '⚡',
    role: 'Microbial Population Regulator',
    keyFacts: [
      'Not a living cell: lacks cytoplasm, ribosomes, and metabolism.',
      'Consists of a protein capsid housing packed genetic code.',
      'Injects DNA into bacterial hosts like a microscopic syringe.',
    ],
    keyAnatomy: [
      { term: 'Icosahedral Capsid', role: '20-sided protective protein head' },
      { term: 'Helical Sheath', role: 'Contractile syringe tube injecting DNA' },
      { term: 'Tail Fibers', role: 'Pins adhering precisely to host receptors' },
    ],
  },
];

export const MicrobeCodexModal: React.FC<MicrobeCodexModalProps> = ({ isOpen, onClose }) => {
  const [selectedId, setSelectedId] = useState<SpecimenId>('bacteria');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  if (!isOpen) return null;

  const current = SPECIMENS.find((s) => s.id === selectedId) || SPECIMENS[0];

  const pronounceTerm = (term: string) => {
    sounds.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="clay-card max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden bg-white/95 border-2 border-emerald-200 shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md border border-white/60">
              🔬
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl font-heading leading-tight flex items-center gap-2">
                <span>MICROBE FIELD CODEX</span>
                <span className="clay-pill text-[10px] font-black text-emerald-800 px-2.5 py-0.5 uppercase">
                  Classroom Guide
                </span>
              </div>
              <div className="text-xs text-slate-600 font-bold">
                Tap any scientific term to hear correct pronunciation
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="clay-btn-white w-10 h-10 flex items-center justify-center text-slate-700 hover:text-red-600 font-black rounded-2xl"
            title="Close Codex"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specimen Selector Tabs (Touch-First Large Chips) */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SPECIMENS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                sounds.playClick();
                setSelectedId(s.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex-shrink-0 ${
                selectedId === s.id
                  ? 'bg-emerald-600 text-white shadow-md ring-3 ring-emerald-300/50 scale-102'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <span className="text-base sm:text-lg">{s.icon}</span>
              <span>{s.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Explorer (3D / 2D Diagram) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between">
            {/* 3D vs 2D Toggle Pills */}
            <div className="flex items-center gap-2 mb-3 self-center sm:self-start">
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('3d');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  viewMode === '3d'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Live Specimen</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('2d');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  viewMode === '2d'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Cross-Section</span>
              </button>
            </div>

            {/* Visual Container */}
            <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-950 border-4 border-white shadow-xl relative flex items-center justify-center ring-4 ring-emerald-200">
              {viewMode === '3d' ? (
                <MicrobeScene type={current.id} className="w-full h-full" />
              ) : (
                <div className="w-full h-full overflow-auto p-2 bg-slate-900 flex items-center justify-center">
                  <Microbe2DDiagram type={current.id} className="w-full h-full" />
                </div>
              )}
            </div>

            <div className="text-[11px] font-bold text-slate-600 mt-2 text-center">
              {viewMode === '3d' ? '👆 Touch and drag to orbit 3D model' : '👆 Tap labeled pins for anatomical cross-section details'}
            </div>
          </div>

          {/* Right Column: Key Facts & Pronounceable Terms */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{current.name}</span>
                </h3>
                <button
                  onClick={() => pronounceTerm(current.name)}
                  className="clay-btn-white p-2 text-emerald-700 hover:text-emerald-900 rounded-xl"
                  title="Pronounce Name"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-800 mb-2">
                {current.scientificName} • <span className="text-amber-700">{current.role}</span>
              </div>

              {/* Core Curriculum Takeaways */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Key Biological Roles:
                </span>
                {current.keyFacts.map((fact, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-slate-800 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              {/* Tap to Pronounce Anatomical Structures */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  Tap to Pronounce Structure:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {current.keyAnatomy.map((part) => (
                    <button
                      key={part.term}
                      onClick={() => pronounceTerm(part.term)}
                      className="p-2.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between group shadow-2xs active:scale-98"
                    >
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                          {part.term}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight">
                          {part.role}
                        </div>
                      </div>
                      <Volume2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1 opacity-70 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="clay-btn-emerald w-full py-3 text-sm font-heading font-black tracking-wide mt-2"
            >
              Resume Competition
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
