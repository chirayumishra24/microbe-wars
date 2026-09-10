'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export interface DiagramPart {
  name: string;
  desc: string;
  x: number; // percentage in SVG viewBox
  y: number;
}

interface Microbe2DDiagramProps {
  type: 'bacteria' | 'fungi' | 'algae' | 'amoeba' | 'virus';
  className?: string;
}

export const Microbe2DDiagram: React.FC<Microbe2DDiagramProps> = ({
  type = 'bacteria',
  className = 'w-full h-64 sm:h-72'
}) => {
  const [activePart, setActivePart] = useState<DiagramPart | null>(null);

  // Anatomical details & callouts for each organism
  const diagramData: Record<string, { title: string; color: string; parts: DiagramPart[] }> = {
    bacteria: {
      title: 'Bacterial Cell Cross-Section (Bacillus)',
      color: '#10B981',
      parts: [
        { name: 'Capsule & Cell Wall', desc: 'Tough outer protective envelope guarding against desiccation and immune cells.', x: 18, y: 35 },
        { name: 'Plasma Membrane', desc: 'Lipid bilayer controlling nutrient import and waste export.', x: 26, y: 64 },
        { name: 'Nucleoid (Circular DNA)', desc: 'Unbound genetic material containing chromosomal instructions (no true nucleus).', x: 50, y: 48 },
        { name: 'Ribosomes', desc: 'Microscopic protein factories scattered throughout the cytoplasm.', x: 62, y: 34 },
        { name: 'Flagellum', desc: 'Rotary whiplike propeller motor providing active swimming locomotion.', x: 86, y: 70 },
        { name: 'Pili / Fimbriae', desc: 'Hair-like appendages helping the bacterium adhere to host surfaces and food.', x: 42, y: 16 }
      ]
    },
    fungi: {
      title: 'Yeast Cell Cross-Section (Saccharomyces)',
      color: '#F59E0B',
      parts: [
        { name: 'Chitin Cell Wall', desc: 'Rigid exterior wall composed of chitin and glucan polymers.', x: 24, y: 28 },
        { name: 'Budding Daughter Cell', desc: 'Asexual reproduction where a new clone grows directly from the mother cell.', x: 74, y: 26 },
        { name: 'Bud Scar', desc: 'Ring of chitin marking where a daughter cell previously detached.', x: 60, y: 52 },
        { name: 'True Nucleus', desc: 'Membrane-bound eukaryotic nucleus holding linear chromosomes.', x: 40, y: 45 },
        { name: 'Central Vacuole', desc: 'Stores amino acids, nutrients, and enzymes for cellular metabolism.', x: 46, y: 70 },
        { name: 'Mitochondria', desc: 'Cellular powerhouses driving aerobic respiration and fermentation energy.', x: 28, y: 62 }
      ]
    },
    algae: {
      title: 'Green Micro-Alga Cross-Section (Chlamydomonas)',
      color: '#059669',
      parts: [
        { name: 'Dual Flagella', desc: 'Pair of whiplike anterior appendages beating in breaststroke cycles to propel toward light.', x: 50, y: 12 },
        { name: 'Eyespot (Stigma)', desc: 'Carotenoid-rich photoreceptor steering the alga toward optimal sunlight (phototaxis).', x: 28, y: 42 },
        { name: 'Cup Chloroplast', desc: 'Large green organelle packed with thylakoid membranes performing photosynthesis.', x: 38, y: 70 },
        { name: 'Pyrenoid Core', desc: 'Center of starch formation and carbon fixation (RuBisCO enzyme reservoir).', x: 52, y: 74 },
        { name: 'Cellulose Wall', desc: 'Permeable glycoprotein and cellulose barrier maintaining cell turgor pressure.', x: 20, y: 54 },
        { name: 'Nucleus', desc: 'Centrally located eukaryotic organelle orchestrating protein synthesis.', x: 52, y: 48 }
      ]
    },
    amoeba: {
      title: 'Amoeba proteus Cross-Section',
      color: '#3B82F6',
      parts: [
        { name: 'Pseudopodium', desc: '“False foot” formed by actin filament flow used for crawling and capturing prey.', x: 80, y: 32 },
        { name: 'Contractile Vacuole', desc: 'Water-expelling organelle that prevents the amoeba from bursting in hypotonic freshwater.', x: 34, y: 30 },
        { name: 'Food Vacuole', desc: 'Digestive chamber containing engulfed bacteria, algae, and organic particles.', x: 62, y: 65 },
        { name: 'Granular Endoplasm', desc: 'Fluid inner cytoplasm teeming with drifting organelles, vesicles, and glycogen.', x: 45, y: 56 },
        { name: 'Ectoplasm', desc: 'Gel-like, clear outer cytoplasmic cortex under the plasma membrane.', x: 22, y: 68 },
        { name: 'Nucleus', desc: 'Disc-shaped nucleus housing cellular genetic programming.', x: 42, y: 42 }
      ]
    },
    virus: {
      title: 'Bacteriophage T4 Structural Diagram',
      color: '#8B5CF6',
      parts: [
        { name: 'Icosahedral Head', desc: '20-sided protein capsid shielding the tightly packed double-stranded viral DNA.', x: 50, y: 22 },
        { name: 'Collar & Whisker', desc: 'Connecting swivel ring sensing environmental cues before host landing.', x: 50, y: 45 },
        { name: 'Contractile Sheath', desc: 'Spring-loaded protein cylinder that contracts to inject viral DNA into the bacterium.', x: 50, y: 58 },
        { name: 'Base Plate', desc: 'Hexagonal landing hub armed with molecular pins to pierce bacterial cell walls.', x: 50, y: 72 },
        { name: 'Long Tail Fibers', desc: 'Flexible leg-like fibers that bind specifically to surface receptors on host bacteria.', x: 26, y: 82 }
      ]
    }
  };

  const key = type === 'amoeba' ? 'amoeba' : type;
  const current = diagramData[key] || diagramData.bacteria;

  return (
    <div className={`flex flex-col items-center justify-between relative ${className}`}>
      {/* 2D Vector Diagram Illustration */}
      <div className="relative w-full h-full max-w-[280px] max-h-[280px] flex items-center justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-md overflow-visible select-none"
        >
          {/* Subtle microscope grid background */}
          <defs>
            <pattern id="microGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="algaeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="yeastGlow" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
              <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="amoebaGlow" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
            </radialGradient>
          </defs>

          {/* Grid circle */}
          <circle cx="150" cy="150" r="135" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="150" cy="150" r="135" fill="url(#microGrid)" />

          {/* BACTERIA DIAGRAM */}
          {key === 'bacteria' && (
            <g>
              {/* Flagella */}
              <path
                d="M 230 150 Q 260 120 270 170 T 295 160"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d="M 225 165 Q 255 190 280 175 T 290 205"
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Pili (Hairs) around the capsule */}
              {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg, i) => (
                <line
                  key={`pili-top-${i}`}
                  x1={100 + i * 11}
                  y1={85}
                  x2={100 + i * 11}
                  y2={72}
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}
              {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg, i) => (
                <line
                  key={`pili-bot-${i}`}
                  x1={100 + i * 11}
                  y1={215}
                  x2={100 + i * 11}
                  y2={228}
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}

              {/* Outer Capsule */}
              <rect x="70" y="85" width="160" height="130" rx="65" fill="#A7F3D0" stroke="#059669" strokeWidth="4" />

              {/* Middle Cell Wall */}
              <rect x="80" y="95" width="140" height="110" rx="55" fill="#34D399" stroke="#047857" strokeWidth="3" />

              {/* Inner Plasma Membrane */}
              <rect x="88" y="103" width="124" height="94" rx="47" fill="#6EE7B7" stroke="#065F46" strokeWidth="2" />

              {/* Cytoplasm Interior */}
              <rect x="94" y="109" width="112" height="82" rx="41" fill="#D1FAE5" />

              {/* Nucleoid DNA Wiggle */}
              <path
                d="M 120 150 Q 135 125 150 150 T 175 140 T 185 160 T 150 170 T 130 155 Z"
                fill="#047857"
                fillOpacity="0.4"
                stroke="#065F46"
                strokeWidth="3.5"
                strokeDasharray="4 2"
              />

              {/* Ribosomes dots */}
              {[
                [110, 130], [115, 170], [140, 125], [175, 125], [180, 175],
                [195, 145], [160, 180], [130, 185]
              ].map(([cx, cy], i) => (
                <circle key={`ribo-${i}`} cx={cx} cy={cy} r="3" fill="#047857" />
              ))}
            </g>
          )}

          {/* FUNGI (YEAST) DIAGRAM */}
          {key === 'fungi' && (
            <g>
              {/* Mother Yeast Cell Wall */}
              <circle cx="135" cy="160" r="75" fill="url(#yeastGlow)" stroke="#B45309" strokeWidth="5" />
              <circle cx="135" cy="160" r="68" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />

              {/* Daughter Bud Cell */}
              <circle cx="215" cy="105" r="42" fill="url(#yeastGlow)" stroke="#B45309" strokeWidth="4" />
              <circle cx="215" cy="105" r="37" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />

              {/* Bud Scar Rim */}
              <ellipse cx="178" cy="132" rx="10" ry="16" fill="#D97706" stroke="#92400E" strokeWidth="3" transform="rotate(-35 178 132)" />

              {/* Nucleus in Mother Cell */}
              <circle cx="120" cy="150" r="24" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
              <circle cx="120" cy="150" r="10" fill="#92400E" />

              {/* Daughter Nucleus migrating */}
              <circle cx="210" cy="105" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />

              {/* Large Vacuole */}
              <ellipse cx="145" cy="185" rx="26" ry="18" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />

              {/* Mitochondria & Ribosomes */}
              <ellipse cx="100" cy="195" rx="10" ry="6" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" transform="rotate(25 100 195)" />
              <ellipse cx="105" cy="120" rx="9" ry="5" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" transform="rotate(-35 105 120)" />
            </g>
          )}

          {/* ALGAE DIAGRAM */}
          {key === 'algae' && (
            <g>
              {/* Dual Flagella */}
              <path
                d="M 145 78 Q 120 30 90 20"
                fill="none"
                stroke="#047857"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 155 78 Q 180 30 210 20"
                fill="none"
                stroke="#047857"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Pear-shaped Body */}
              <path
                d="M 150 78 C 195 80 225 140 220 190 C 215 240 85 240 80 190 C 75 140 105 80 150 78 Z"
                fill="url(#algaeGlow)"
                stroke="#064E3B"
                strokeWidth="4.5"
              />

              {/* Cup-shaped Chloroplast */}
              <path
                d="M 150 105 C 190 108 208 150 204 195 C 200 230 100 230 96 195 C 92 150 110 108 150 105 Z"
                fill="#059669"
                stroke="#065F46"
                strokeWidth="3"
              />

              {/* Central Pyrenoid Core (Starch reservoir) */}
              <circle cx="150" cy="188" r="22" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
              <circle cx="150" cy="188" r="12" fill="#F59E0B" />

              {/* Nucleus */}
              <circle cx="150" cy="138" r="18" fill="#BBF7D0" stroke="#16A34A" strokeWidth="2.5" />
              <circle cx="150" cy="138" r="8" fill="#15803D" />

              {/* Eyespot (Stigma) */}
              <ellipse cx="98" cy="130" rx="6" ry="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" transform="rotate(-15 98 130)" />
            </g>
          )}

          {/* AMOEBA DIAGRAM */}
          {key === 'amoeba' && (
            <g>
              {/* Irregular Pseudopodia Outline */}
              <path
                d="M 110 90 C 145 65 190 85 220 95 C 255 105 270 145 250 175 C 235 195 245 235 205 245 C 165 255 135 235 105 240 C 75 245 55 210 60 175 C 65 140 75 115 110 90 Z"
                fill="url(#amoebaGlow)"
                stroke="#2563EB"
                strokeWidth="4"
              />

              {/* Clear Ectoplasm Rim */}
              <path
                d="M 115 102 C 145 80 185 96 210 106 C 240 116 250 145 234 170 C 220 188 230 220 198 230 C 165 240 140 222 112 226 C 85 230 70 200 75 172 C 80 142 88 122 115 102 Z"
                fill="#EFF6FF"
                fillOpacity="0.6"
              />

              {/* Nucleus */}
              <circle cx="135" cy="145" r="22" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="3" />
              <circle cx="135" cy="145" r="10" fill="#1E40AF" />

              {/* Contractile Vacuole (Clear bubble) */}
              <circle cx="180" cy="135" r="18" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" fillOpacity="0.85" />

              {/* Ingested Food Vacuoles */}
              <circle cx="185" cy="195" r="12" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
              <circle cx="185" cy="195" r="5" fill="#10B981" />

              <circle cx="120" cy="190" r="10" fill="#FBCFE8" stroke="#BE185D" strokeWidth="2" />
              <circle cx="120" cy="190" r="4" fill="#6366F1" />
            </g>
          )}

          {/* Interactive Callout Pin Markers */}
          {current.parts.map((p, idx) => {
            const isHovered = activePart?.name === p.name;
            const px = (p.x / 100) * 300;
            const py = (p.y / 100) * 300;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActivePart(p)}
                onMouseEnter={() => setActivePart(p)}
              >
                <circle
                  cx={px}
                  cy={py}
                  r={isHovered ? 11 : 9}
                  fill={isHovered ? '#EF4444' : '#0F172A'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-md"
                />
                <text
                  x={px}
                  y={py + 3.5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="900"
                  pointerEvents="none"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Callout Definition Box */}
      <div className="w-full mt-2 p-3 rounded-2xl bg-white/95 border border-slate-200 shadow-clay-sm">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <div className="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>{activePart ? activePart.name : 'Click any numbered anatomical pin:'}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {activePart ? 'Biological Structure' : 'Interactive Guide'}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-600 leading-snug min-h-[34px]">
          {activePart
            ? activePart.desc
            : 'Hover or tap the numbered callouts on the diagram to inspect the organelle names, biological membranes, and specialized functions.'}
        </p>
      </div>
    </div>
  );
};
