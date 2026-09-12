'use client';

import React, { useEffect, useState } from 'react';

interface FloatingScoreProps {
  points: number;
  isPositive?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const FloatingScore: React.FC<FloatingScoreProps> = ({
  points,
  isPositive = true,
  onComplete,
  className = '',
}) => {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlive(false);
      onComplete?.();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!alive) return null;

  return (
    <div
      className={`pointer-events-none absolute -top-8 right-3 z-50 animate-bounce select-none ${className}`}
    >
      <div
        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-xl border-2 flex items-center gap-1 ${
          isPositive
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white ring-4 ring-emerald-300/50'
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-white ring-4 ring-rose-300/50'
        }`}
      >
        <span>{isPositive ? '⭐ +' : '❌ -'}</span>
        <span>{points} PTS</span>
      </div>
    </div>
  );
};
