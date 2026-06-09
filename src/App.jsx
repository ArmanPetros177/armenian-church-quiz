import React, { useState } from 'react';
import { churches } from './data/churches';
import ScoreBoard from './components/ScoreBoard';
import QuizCard from './components/QuizCard';
import OptionsGrid from './components/OptionsGrid';
import { ChevronLeft, ChevronRight, Play, RotateCcw, Award, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const startQuiz = () => {
    setUserAnswers(new Array(churches.length).fill(null));
    setCurrentIndex(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  const restartQuiz = () => {
    if (window.confirm('Վստա՞հ եք, որ ուզում եք սկսել նորից:')) {
      startQuiz();
    }
  };

  const score = userAnswers.reduce((acc, selected, idx) => {
    if (selected && selected.id === churches[idx].id) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleSelect = (option) => {
    const updated = [...userAnswers];
    updated[currentIndex] = option;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < churches.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentChurch = churches[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];

  let answerStatus = null;
  if (selectedAnswer && currentChurch) {
    answerStatus = selectedAnswer.id === currentChurch.id ? 'correct' : 'incorrect';
  }

  const getRank = (s) => {
    const pct = (s / churches.length) * 100;
    if (pct === 100) return { title: 'Արարատյան Վարպետ', color: 'text-amber-400 border-amber-400 bg-amber-500/10' };
    if (pct >= 85) return { title: 'Հայ ճարտարապետության վարպետ', color: 'text-purple-400 border-purple-400 bg-purple-500/10' };
    if (pct >= 60) return { title: 'Ճարտարապետության Գիտակ', color: 'text-indigo-400 border-indigo-400 bg-indigo-500/10' };
    if (pct >= 30) return { title: 'Սկսնակ Գիտակ', color: 'text-emerald-400 border-emerald-400 bg-emerald-500/10' };
    return { title: 'Սկսնակ', color: 'text-slate-400 border-slate-500 bg-slate-500/10' };
  };

  const rank = getRank(score);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden pb-12">

      {/* ── Fixed background blobs (don't move on scroll) ── */}
      <div className="fixed top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/15 blur-[130px] animate-float pointer-events-none -z-20" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-600/15 blur-[130px] animate-float-reverse pointer-events-none -z-20" />
      <div className="fixed top-[35%] right-[8%] w-[38vw] h-[38vw] rounded-full bg-pink-600/10 blur-[100px] animate-float pointer-events-none -z-20" />
      <div className="fixed bottom-[15%] left-[4%] w-[42vw] h-[42vw] rounded-full bg-blue-600/10 blur-[110px] animate-float-reverse pointer-events-none -z-20" />

      {/* ── Header ── */}
      <header className="w-full text-center py-8 px-4 relative z-10">

        <h1 className="font-cinzel text-3xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-slate-100 to-indigo-200 drop-shadow-md">
          Հայաստանի Եկեղեցիներն ու Վանքերը
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mt-2 font-light">
          Ստուգեք Ձեր գիտելիքները հայ հոգևոր ճարտարապետության ոլորտում
        </p>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto z-10">

        {/* 1 ── Start screen */}
        {!gameStarted && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-indigo-400" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 font-cinzel mb-4">
                Պատրա՞ստ եք:
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Ձեզ անհրաժեշտ կլինի ճանաչել <strong>Հայաստանի 80 նշանավոր սրբավայրերը</strong>՝ բարձրորակ լուսանկարների հիման վրա։
                Մենք բացառել ենք քիչ հայտնի վայրերը՝ թողնելով հայկական ճարտարապետության ամենաարժեքավոր նմուշները։
              </p>

              <button
                onClick={startQuiz}
                id="start-quiz-btn"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Սկսել թեստը
              </button>
            </div>
          </div>
        )}

        {/* 2 ── Active quiz */}
        {gameStarted && !gameFinished && currentChurch && (
          <div>
            <ScoreBoard
              score={score}
              currentIndex={currentIndex}
              total={churches.length}
              onRestart={restartQuiz}
            />

            <QuizCard church={currentChurch} status={answerStatus} />

            <OptionsGrid
              options={churches}
              correctAnswer={currentChurch}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
            />

            {/* Navigation */}
            <div className="w-full max-w-4xl mx-auto px-4 mt-6 flex justify-between items-center gap-4 mb-8">
              <button
                id="prev-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/5 bg-slate-900/60 hover:bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Հետ
              </button>

              <div className="text-xs font-mono text-slate-500 bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-lg select-none">
                {currentIndex + 1} / {churches.length}
              </div>

              <button
                id="next-btn"
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300
                  ${selectedAnswer
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg active:scale-95 cursor-pointer'
                    : 'bg-slate-900/40 border border-white/5 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                {currentIndex === churches.length - 1 ? 'Ցուցադրել արդյունքները' : 'Առաջ'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 3 ── Results screen */}
        {gameFinished && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl text-center border border-white/10 relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-indigo-500/20 to-purple-600/20 border-2 border-indigo-400 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Trophy className="w-12 h-12 text-amber-300" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-cinzel mb-2">
                Թեստն ավարտված է!
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-6">
                Դուք պատասխանել եք բոլոր 80 հարցերին։ Ահա Ձեր արդյունքները.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ձեր հաշիվը</p>
                  <p className="text-4xl font-bold text-indigo-400 font-mono mt-1">
                    {score} <span className="text-lg text-slate-400 font-normal">80</span>
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ճշգրտություն</p>
                  <p className="text-4xl font-bold text-emerald-400 font-mono mt-1">
                    {Math.round((score / churches.length) * 100)}%
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-center items-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Կոչում</p>
                  <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold text-center w-full ${rank.color}`}>
                    {rank.title}
                  </span>
                </div>
              </div>

              <button
                id="restart-btn"
                onClick={startQuiz}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                Կրկին անցնել թեստը
              </button>
            </div>

            {/* Detailed breakdown */}
            <h3 className="text-xl font-bold text-slate-200 font-cinzel mb-4 px-1">
              Հարցերի մանրամասն վերլուծություն
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {churches.map((ch, idx) => {
                const ans = userAnswers[idx];
                const isCorrect = ans && ans.id === ch.id;
                return (
                  <div key={ch.id} className="glass-card rounded-2xl overflow-hidden flex gap-4 p-3 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/5">
                      <img src={ch.image} alt={ch.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-100 truncate">{ch.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{ch.location} • {ch.century}</p>
                      </div>
                      <div className="mt-2 text-xs flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-slate-400 shrink-0">Ձեր պատ.:</span>
                          <span className={`truncate font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ans ? ans.name : 'Բաց է թողնված'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isCorrect ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Ճիշտ (+1)
                            </span>
                          ) : (
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Սխալ (+0)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="w-full text-center py-6 text-xs text-slate-500 z-10 border-t border-white/5 mt-12 bg-slate-950/20 backdrop-blur-sm">
        <p>© 2026 INDMAN Production • Հայաստանի Եկեղեցիներն ու Վանքերը </p>
      </footer>
    </div>
  );
}