'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, X, RefreshCw } from 'lucide-react';
import { sounds } from '@/utils/audio';

interface GameSessionRecord {
  id: string;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  winner: string | null;
  completedAt: string;
}

interface HallOfFameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HallOfFameModal: React.FC<HallOfFameModalProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<GameSessionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to load hall of fame:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="clay-card max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden bg-white/95 border-2 border-amber-300 shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 border-b border-amber-200 flex items-center justify-between bg-amber-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md border border-white/60">
              🏆
            </div>
            <div>
              <div className="font-black text-slate-900 text-lg sm:text-xl font-heading leading-tight flex items-center gap-2">
                <span>CLASSROOM HALL OF FAME</span>
                <span className="clay-pill text-[10px] font-black text-amber-800 px-2.5 py-0.5 uppercase">
                  Records
                </span>
              </div>
              <div className="text-xs text-slate-600 font-bold">
                Tournament Champions & Match History
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                fetchSessions();
              }}
              className="clay-btn-white p-2.5 text-slate-600 hover:text-amber-600 rounded-xl"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="clay-btn-white w-10 h-10 flex items-center justify-center text-slate-700 hover:text-red-600 font-black rounded-2xl"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {loading && sessions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-bold text-sm flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
              <span>Loading tournament champions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-bold text-sm">
              <div className="text-4xl mb-2">🌱</div>
              <p>No tournament records yet! Complete your first match to enter the Hall of Fame.</p>
            </div>
          ) : (
            sessions.map((s, idx) => {
              const formattedDate = new Date(s.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isTie = s.teamAScore === s.teamBScore;
              const winnerName = s.winner || (s.teamAScore > s.teamBScore ? s.teamAName : s.teamBName);

              return (
                <div
                  key={s.id || idx}
                  className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 bg-white/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm flex-shrink-0 border border-amber-300">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isTie ? 'Tie Match: Ecosystem Co-Champions' : `Champion: ${winnerName}`}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Scores Comparison */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-center">
                      <div className="text-[10px] font-black text-blue-700 truncate max-w-[90px]">
                        {s.teamAName}
                      </div>
                      <div className="text-sm font-black text-slate-900 font-mono">
                        {s.teamAScore}
                      </div>
                    </div>

                    <span className="text-xs font-black text-slate-400">vs</span>

                    <div className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-center">
                      <div className="text-[10px] font-black text-orange-700 truncate max-w-[90px]">
                        {s.teamBName}
                      </div>
                      <div className="text-sm font-black text-slate-900 font-mono">
                        {s.teamBScore}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="clay-btn-emerald px-6 py-2 text-xs font-heading font-black"
          >
            Close Hall of Fame
          </button>
        </div>

      </div>
    </div>
  );
};
