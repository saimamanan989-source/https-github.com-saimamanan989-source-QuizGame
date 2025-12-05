import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import Button from './Button';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  isSubmitting: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  isSubmitting
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setIsRevealed(false);
  }, [question.id]);

  const handleConfirm = () => {
    if (selectedIdx === null) return;
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (selectedIdx !== null) {
      onAnswer(selectedIdx);
    }
  };

  const getOptionStyles = (index: number) => {
    const baseStyle = "w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-center justify-between group";
    
    if (!isRevealed) {
      // Normal selection state
      if (selectedIdx === index) {
        return `${baseStyle} bg-zinc-800 border-zinc-500 text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]`;
      }
      return `${baseStyle} bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-600 hover:text-zinc-200`;
    }

    // Revealed state
    if (index === question.correctAnswerIndex) {
      // Correct answer
      return `${baseStyle} bg-green-950/30 border-green-500/50 text-green-200`;
    }
    
    if (selectedIdx === index && index !== question.correctAnswerIndex) {
      // Wrong selection
      return `${baseStyle} bg-red-950/30 border-red-500/50 text-red-200`;
    }

    // Other unselected options
    return `${baseStyle} bg-zinc-900/30 border-zinc-800/50 text-zinc-600 opacity-50`;
  };

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header / Progress */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-zinc-500 text-sm font-medium tracking-wider uppercase">Question {questionNumber}</span>
          <span className="text-zinc-700 text-sm font-medium mx-2">/</span>
          <span className="text-zinc-700 text-sm font-medium">{totalQuestions}</span>
        </div>
        <div className="text-xs font-mono text-zinc-600">
           {isRevealed ? (selectedIdx === question.correctAnswerIndex ? 'CORRECT' : 'INCORRECT') : 'PENDING'}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-900 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-zinc-100 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-8 leading-tight">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !isRevealed && setSelectedIdx(idx)}
            disabled={isRevealed}
            className={getOptionStyles(idx)}
          >
            <span className="flex-1">{option}</span>
            {isRevealed && idx === question.correctAnswerIndex && (
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isRevealed && selectedIdx === idx && idx !== question.correctAnswerIndex && (
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Explanation Reveal */}
      {isRevealed && (
        <div className="mb-8 p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg animate-fade-in">
          <p className="text-zinc-400 text-sm leading-relaxed">
            <strong className="text-zinc-200 block mb-1">Insight:</strong>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!isRevealed ? (
          <Button 
            onClick={handleConfirm} 
            disabled={selectedIdx === null}
            className="w-full sm:w-auto"
          >
            Confirm Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;