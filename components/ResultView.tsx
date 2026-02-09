
import React, { useState } from 'react';
import { ExamData, UserAnswer, Question } from '../types';
import { getExplanation } from '../services/geminiService';

interface ResultViewProps {
  exam: ExamData;
  answers: UserAnswer[];
  timeTaken: number;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ exam, answers, timeTaken, onRestart }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / exam.questions.length) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const fetchAIExplanation = async (question: Question) => {
    setSelectedQuestionId(question.id);
    setExplanation(null);
    setLoadingExplanation(true);
    const text = await getExplanation(
      question.question,
      question.options,
      question.options[question.answer]
    );
    setExplanation(text);
    setLoadingExplanation(false);
  };

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (percentage >= 80) return 'bg-emerald-50';
    if (percentage >= 50) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Summary Card */}
      <div className={`rounded-3xl p-10 mb-8 flex flex-col md:flex-row items-center gap-10 shadow-xl border border-slate-100 ${getScoreBg()}`}>
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={Math.PI * 120}
              strokeDashoffset={Math.PI * 120 * (1 - percentage / 100)}
              className={`${getScoreColor()} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-4xl font-extrabold ${getScoreColor()}`}>{percentage}%</span>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Assessment Report</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
            <p className="text-lg font-medium text-slate-600">
              Score: <span className="font-bold text-slate-900">{correctCount}/{exam.questions.length}</span>
            </p>
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block"></div>
            <p className="text-lg font-medium text-slate-600">
              Time Used: <span className="font-bold text-slate-900">{formatTime(timeTaken)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={onRestart}
              className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-xl hover:border-slate-300 transition-all active:scale-95 text-sm"
            >
              Exit to Menu
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
            >
              Retake Exam
            </button>
          </div>
        </div>
      </div>

      {/* Login / Save Report Banner */}
      <div className="bg-indigo-600 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-100">
        <div className="flex items-center gap-4 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">💾</div>
          <div>
            <h3 className="font-bold text-lg">Save this assessment?</h3>
            <p className="text-indigo-100 text-sm">Create an account to track your progress and benchmark against top candidates.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowLoginModal(true)}
          className="whitespace-nowrap px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-sm"
        >
          Login to Save
        </button>
      </div>

      {/* Detailed Review */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Logic & Explanations</h2>
      <div className="space-y-6">
        {exam.questions.map((q, idx) => {
          const userAnswer = answers.find(a => a.questionId === q.id);
          const isCorrect = userAnswer?.isCorrect;
          
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {idx + 1}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <button
                    onClick={() => fetchAIExplanation(q)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    ✨ Explain with AI
                  </button>
                </div>

                <p className="text-lg font-semibold text-slate-800 mb-6">{q.question}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswer?.selectedOption === oIdx;
                    const isTheCorrectAnswer = q.answer === oIdx;
                    
                    let styleClass = 'border-slate-100 bg-slate-50 text-slate-500';
                    if (isTheCorrectAnswer) styleClass = 'border-emerald-200 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500';
                    else if (isSelected) styleClass = 'border-red-200 bg-red-50 text-red-800 ring-1 ring-red-500';

                    return (
                      <div key={oIdx} className={`p-4 rounded-xl border-2 font-medium text-sm flex items-center justify-between ${styleClass}`}>
                        <span>{opt}</span>
                        {isTheCorrectAnswer && <span className="text-emerald-600 font-bold">✓ Correct</span>}
                        {isSelected && !isTheCorrectAnswer && <span className="text-red-600 font-bold">✗ Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {selectedQuestionId === q.id && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600">
                      <h4 className="font-bold uppercase tracking-widest text-xs">Gemini AI Explanation</h4>
                    </div>
                    {loadingExplanation ? (
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Analyzing solution...</span>
                      </div>
                    ) : (
                      <div className="prose prose-slate prose-sm max-w-none text-slate-700 whitespace-pre-line bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        {explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black italic mx-auto mb-4">C</div>
              <h2 className="text-2xl font-bold text-slate-900">Sign in to CachePrep</h2>
              <p className="text-slate-500">Benchmark your results against 10,000+ candidates.</p>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <input type="email" placeholder="Email address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
              <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
