import React, { useState } from 'react';
import { QuizConfig } from '../types';
import Button from './Button';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuizConfig['difficulty']>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ 
      topic: topic.trim() || 'General Knowledge', 
      difficulty 
    });
  };

  const difficulties: QuizConfig['difficulty'][] = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 shadow-xl">
          <svg className="w-8 h-8 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Quiz Game</h1>
        <p className="text-zinc-400">Generate a unique 10-question quiz on any topic.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-zinc-300">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Quantum Physics, 90s Pop Music, World History..."
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                  difficulty === level
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" fullWidth className="mt-8">
          Start Quiz
        </Button>
      </form>
      
      <div className="pt-8 border-t border-zinc-900 text-center">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold">
          Powered by Gemini 2.5 Flash
        </p>
      </div>
    </div>
  );
};

export default QuizSetup;