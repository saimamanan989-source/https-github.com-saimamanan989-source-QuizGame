import React from 'react';
import { UserAnswer, Question } from '../types';
import Button from './Button';

interface ResultsProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ questions, userAnswers, onRestart }) => {
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  let message = "";
  if (percentage >= 90) message = "Exceptional Intellectual Prowess.";
  else if (percentage >= 70) message = "Admirable Performance.";
  else if (percentage >= 50) message = "Competent Effort.";
  else message = "Room for Improvement.";

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in text-center pb-12">
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-white mb-2">{percentage}%</h2>
        <p className="text-xl text-zinc-400">{message}</p>
        <div className="mt-4 text-sm text-zinc-600 font-mono uppercase tracking-widest">
          {correctCount} / {questions.length} Correct
        </div>
      </div>

      <div className="space-y-6 text-left mb-12">
        {questions.map((q, idx) => {
          const userAnswer = userAnswers.find(a => a.questionId === q.id);
          const isCorrect = userAnswer?.isCorrect;
          
          return (
            <div key={q.id} className={`p-6 rounded-lg border ${isCorrect ? 'bg-zinc-900/50 border-zinc-800' : 'bg-red-950/10 border-red-900/20'}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-zinc-200 font-medium">
                  <span className="text-zinc-500 mr-2">{idx + 1}.</span>
                  {q.text}
                </h3>
                {isCorrect ? (
                  <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                    Correct
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                    Incorrect
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                 {!isCorrect && (
                   <div className="flex gap-2">
                     <span className="text-red-400 w-16 shrink-0">Selected:</span>
                     <span className="text-zinc-400 line-through decoration-red-500/50">
                       {q.options[userAnswer?.selectedOptionIndex ?? -1]}
                     </span>
                   </div>
                 )}
                 <div className="flex gap-2">
                   <span className="text-green-400 w-16 shrink-0">Answer:</span>
                   <span className="text-zinc-200">{q.options[q.correctAnswerIndex]}</span>
                 </div>
                 <div className="mt-4 pt-4 border-t border-zinc-800/50 text-zinc-500 italic">
                   "{q.explanation}"
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button onClick={onRestart}>
          Initialize New Quiz
        </Button>
      </div>
    </div>
  );
};

export default Results;