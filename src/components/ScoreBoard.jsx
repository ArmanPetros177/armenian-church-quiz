import React from 'react';
import { Trophy, RefreshCw, Layers } from 'lucide-react';

export default function ScoreBoard({ score, currentIndex, total, onRestart }) {
  const progressPercent = (currentIndex / total) * 100;

  return (
    <div className="w-full  max-w-4xl mx-auto mb-8 px-4">
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left: Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ճիշտ</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono leading-none mt-0.5">
                {score} <span className="text-sm text-slate-400 font-normal">/ {total}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-indigo-500/15 border border-indigo-500/30 px-4 py-2.5 rounded-xl">
            <Layers className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Հարց</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono leading-none mt-0.5">
                {Math.min(currentIndex + 1, total)} <span className="text-sm text-slate-400 font-normal">/ {total}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Progress Bar */}
        <div className="flex-1 md:mx-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Ընթացք</span>
            <span className="font-mono">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-slate-900/60 rounded-full h-2.5 border border-white/5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Restart */}
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass-button text-slate-200 hover:text-white font-medium text-sm transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Վերսկսել
        </button>

      </div>
    </div>
  );
}
