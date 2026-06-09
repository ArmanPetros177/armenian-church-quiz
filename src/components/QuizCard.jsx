import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizCard({ church, status }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [church]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-8">
      <div
        className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 relative aspect-video md:aspect-[21/9] flex items-center justify-center
          ${status === 'correct' ? 'border-emerald-500/50 ring-4 ring-emerald-500/20 animate-success-pulse' : ''}
          ${status === 'incorrect' ? 'border-red-500/50 ring-4 ring-red-500/20 animate-shake' : ''}
          ${!status ? 'border-white/10 hover:border-white/20' : ''}
        `}
      >
        {/* Skeleton Loader */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10">
            <HelpCircle className="w-12 h-12 text-slate-500 animate-bounce mb-3" />
            <span className="text-slate-400 text-sm font-medium tracking-wide">Բեռնվում է...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 p-6 text-center">
            <HelpCircle className="w-12 h-12 text-rose-500 mb-3" />
            <span className="text-rose-400 font-semibold text-lg">Չհաջողվեց բեռնել պատկերը</span>
            <span className="text-slate-400 text-sm mt-1">Ստուգեք ինտերնետ կապը</span>
          </div>
        )}

        {/* Church Photo */}
        <img
          src={church.image}
          alt="Անհայտ եկեղեցի"
          className={`w-full h-full object-scale-down object-center select-none pointer-events-none transition-all duration-700
  ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
  ${status ? 'brightness-[0.85]' : ''}
  [image-rendering:auto]
`}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />

        {/* Status Badge */}
        {status === 'correct' && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm backdrop-blur-md z-20">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            Ճիշտ! +1
          </div>
        )}
        {status === 'incorrect' && (
          <div className="absolute top-4 right-4 bg-red-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg text-sm backdrop-blur-md z-20">
            Սխալ! 0 միավոր
          </div>
        )}
      </div>
    </div>
  );
}
