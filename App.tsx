
import React, { useState } from 'react';
import { AppState, ExamData, UserAnswer } from './types';
import ExamSelection from './components/ExamSelection';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppState>(AppState.SELECTION);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [quizResults, setQuizResults] = useState<UserAnswer[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);

  const handleSelectExam = (exam: ExamData) => {
    setSelectedExam(exam);
    setCurrentView(AppState.QUIZ);
  };

  const handleFinishQuiz = (answers: UserAnswer[], duration: number) => {
    setQuizResults(answers);
    setTimeTaken(duration);
    setCurrentView(AppState.RESULTS);
  };

  const handleExitQuiz = () => {
    setSelectedExam(null);
    setCurrentView(AppState.SELECTION);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {currentView !== AppState.QUIZ && (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-blue-100">
                C
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">CachePrep<span className="text-blue-600">.ai</span></span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Benchmarks</span>
              <button 
                className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
                onClick={() => alert("Login feature coming soon!")}
              >
                Login
              </button>
            </div>
          </div>
        </nav>
      )}

      {currentView === AppState.SELECTION && (
        <ExamSelection onSelect={handleSelectExam} />
      )}

      {currentView === AppState.QUIZ && selectedExam && (
        <QuizView 
          exam={selectedExam} 
          onFinish={handleFinishQuiz} 
          onExit={handleExitQuiz}
        />
      )}

      {currentView === AppState.RESULTS && selectedExam && (
        <ResultView 
          exam={selectedExam} 
          answers={quizResults} 
          timeTaken={timeTaken}
          onRestart={handleExitQuiz}
        />
      )}

      {currentView !== AppState.QUIZ && (
        <footer className="mt-auto py-12 border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">
              Aptitude Intelligence Engine
            </p>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              CachePrep.ai delivers standard-aligned assessments for candidates targeting top-tier global firms.
            </p>
            <div className="flex justify-center gap-6">
              <span className="text-slate-300">© 2024 CachePrep.ai</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
