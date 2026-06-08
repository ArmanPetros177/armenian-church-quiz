import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function OptionsGrid({ options, correctAnswer, selectedAnswer, onSelect }) {

  const quizOptions = useMemo(() => {
    // Все неправильные ответы
    const wrong = options.filter(item => item.id !== correctAnswer.id);

    // Перемешиваем
    wrong.sort(() => Math.random() - 0.5);

    // Берём 3 случайных
    const result = [correctAnswer, ...wrong.slice(0, 3)];

    // Снова перемешиваем, чтобы правильный ответ был в случайном месте
    return result.sort(() => Math.random() - 0.5);
  }, [options, correctAnswer]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quizOptions.map((opt) => {
        const isSelected = selectedAnswer && selectedAnswer.id === opt.id;
        const isCorrect = correctAnswer.id === opt.id;
        const hasAnswered = selectedAnswer != null;

        let btnStyle = "glass-button";

        if (hasAnswered) {
          if (isCorrect) btnStyle = "bg-green-500/20 border-green-500";
          else if (isSelected) btnStyle = "bg-red-500/20 border-red-500";
        }

        return (
          <button
            key={opt.id}
            disabled={hasAnswered}
            onClick={() => onSelect(opt)}
            className={btnStyle}
          >
            {opt.name}
          </button>
        );
      })}
    </div>
  );
}