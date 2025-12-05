import React, { useState, useCallback } from 'react';
import { GameState, Question, QuizConfig, UserAnswer } from './types';
import { generateQuizQuestions } from './services/geminiService';
import QuizSetup from './components/QuizSetup';
import QuestionCard from './components/QuestionCard';
import Results from './components/Results';
import Loading from './components/Loading';
import Button from './components/Button';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startQuiz = useCallback(async (config: QuizConfig) => {
    setGameState('LOADING');
    setErrorMsg(null);
    try {
      const generatedQuestions = await generateQuizQuestions(config);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setGameState('PLAYING');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setGameState('ERROR');
    }
  }, []);

  const handleAnswer = useCallback((selectedOptionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex,
      isCorrect
    };

    setUserAnswers(prev => [...prev, newAnswer]);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('FINISHED');
    }
  }, [currentQuestionIndex, questions]);

  const restartQuiz = () => {
    setGameState('SETUP');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-zinc-900/20 to-transparent blur-3xl rounded-full opacity-50 transform scale-150"></div>
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-tl from-black to-zinc-900/20 blur-3xl rounded-full opacity-50 transform translate-y-1/2 translate-x-1/2"></div>
      </div>

      <header className="relative w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 cursor-pointer" onClick={restartQuiz}>
            <div className="w-6 h-6 bg-zinc-100 rounded-md flex items-center justify-center text-zinc-950 font-black text-xs">Q</div>
            <span>Quiz Game</span>
          </div>
          {gameState === 'PLAYING' && (
            <div className="text-xs font-mono text-zinc-500">
              Q{currentQuestionIndex + 1} / {questions.length}
            </div>
          )}
        </div>
      </header>

      <main className="relative flex-grow flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto z-0">
        
        {gameState === 'SETUP' && (
          <QuizSetup onStart={startQuiz} />
        )}

        {gameState === 'LOADING' && (
          <Loading />
        )}

        {gameState === 'ERROR' && (
          <div className="text-center space-y-6 max-w-md animate-fade-in">
             <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto border border-red-900/30">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
                <h3 className="text-lg font-medium text-white">System Malfunction</h3>
                <p className="text-zinc-500 mt-2">{errorMsg}</p>
             </div>
             <Button onClick={restartQuiz} variant="secondary">
                Try Again
             </Button>
          </div>
        )}

        {gameState === 'PLAYING' && questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            isSubmitting={false}
          />
        )}

        {gameState === 'FINISHED' && (
          <Results
            questions={questions}
            userAnswers={userAnswers}
            onRestart={restartQuiz}
          />
        )}
      </main>

      <footer className="relative border-t border-zinc-900 bg-zinc-950 py-6 text-center z-10">
        <p className="text-zinc-600 text-xs">
          &copy; {new Date().getFullYear()} Quiz Game. Generated by Google Gemini.
        </p>
      </footer>
    </div>
  );
};

export default App;