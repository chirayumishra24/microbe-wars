'use client';

import React from 'react';

interface MascotProps {
  type: 'teamA' | 'teamB' | 'green' | 'purple';
  size?: number;
  className?: string;
  expression?: 'happy' | 'excited' | 'curious' | 'thinking';
}

export const MicrobeMascot: React.FC<MascotProps> = ({
  type,
  size = 120,
  className = ''
}) => {
  if (type === 'teamA') {
    // Team A: The Explorers (Energetic Blue Microbe with scientific goggles & flagella)
    return (
      <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl animate-float">
          <defs>
            <radialGradient id="teamAGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="60%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </radialGradient>
            <filter id="glowA">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Microbe Body Pseudopodia */}
          <path
            d="M 50 12 C 72 10, 88 28, 86 50 C 85 70, 72 88, 50 86 C 28 85, 12 70, 14 50 C 12 28, 28 14, 50 12 Z"
            fill="url(#teamAGrad)"
            filter="url(#glowA)"
          />

          {/* Cilia / Tentacles */}
          <circle cx="18" cy="30" r="4" fill="#60A5FA" />
          <circle cx="12" cy="52" r="5" fill="#3B82F6" />
          <circle cx="22" cy="74" r="4.5" fill="#2563EB" />
          <circle cx="82" cy="32" r="4" fill="#60A5FA" />
          <circle cx="88" cy="54" r="5" fill="#3B82F6" />
          <circle cx="80" cy="72" r="4.5" fill="#2563EB" />

          {/* Scientist Explorer Goggles */}
          <rect x="26" y="32" width="22" height="22" rx="6" fill="#1E293B" stroke="#60A5FA" strokeWidth="2.5" />
          <circle cx="37" cy="43" r="8" fill="#E0F2FE" />
          <rect x="52" y="32" width="22" height="22" rx="6" fill="#1E293B" stroke="#60A5FA" strokeWidth="2.5" />
          <circle cx="63" cy="43" r="8" fill="#E0F2FE" />
          <line x1="48" y1="43" x2="52" y2="43" stroke="#60A5FA" strokeWidth="3" />

          {/* Eyes Pupils */}
          <circle cx="38" cy="43" r="4" fill="#0F172A" />
          <circle cx="39" cy="41" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="43" r="4" fill="#0F172A" />
          <circle cx="65" cy="41" r="1.5" fill="#FFFFFF" />

          {/* Cheerful Mouth */}
          <path
            d="M 40 62 Q 50 72 60 62"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="32" cy="62" rx="4" ry="2.5" fill="#93C5FD" opacity="0.6" />
          <ellipse cx="68" cy="62" rx="4" ry="2.5" fill="#93C5FD" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (type === 'teamB') {
    // Team B: The Guardians (Warm Amber/Orange Microbe with protective antenna crest)
    return (
      <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl animate-float-delayed">
          <defs>
            <radialGradient id="teamBGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C2410C" />
            </radialGradient>
            <filter id="glowB">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Microbe Body (Rounded organic capsule) */}
          <rect
            x="20"
            y="22"
            width="60"
            height="62"
            rx="28"
            fill="url(#teamBGrad)"
            filter="url(#glowB)"
          />

          {/* Guardian Antenna Crest */}
          <path d="M 50 22 L 50 8" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="7" r="5.5" fill="#FDE047" stroke="#EA580C" strokeWidth="2" />

          {/* Friendly Eyes */}
          <ellipse cx="36" cy="46" rx="8" ry="10" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.5" />
          <circle cx="37" cy="47" r="4.5" fill="#431407" />
          <circle cx="38" cy="45" r="1.5" fill="#FFFFFF" />

          <ellipse cx="64" cy="46" rx="8" ry="10" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.5" />
          <circle cx="63" cy="47" r="4.5" fill="#431407" />
          <circle cx="64" cy="45" r="1.5" fill="#FFFFFF" />

          {/* Happy Open Smile */}
          <path
            d="M 38 64 Q 50 78 62 64"
            fill="#7C2D12"
            stroke="#9A3412"
            strokeWidth="2"
          />
          <path d="M 44 67 Q 50 73 56 67" fill="#F87171" />

          {/* Rosy Blush */}
          <circle cx="28" cy="60" r="4" fill="#FCA5A5" opacity="0.7" />
          <circle cx="72" cy="60" r="4" fill="#FCA5A5" opacity="0.7" />
        </svg>
      </div>
    );
  }

  // Default Green / Purple friendly microbes
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl animate-float">
        <circle cx="50" cy="50" r="36" fill={type === 'green' ? '#10B981' : '#8B5CF6'} />
        <circle cx="40" cy="45" r="6" fill="#FFFFFF" />
        <circle cx="41" cy="45" r="3" fill="#1F2937" />
        <circle cx="60" cy="45" r="6" fill="#FFFFFF" />
        <circle cx="61" cy="45" r="3" fill="#1F2937" />
        <path d="M 42 60 Q 50 70 58 60" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};
