
import React, { useState, useEffect } from 'react';
import { ExamData, UserAnswer } from '../types';

interface QuizViewProps {
  exam: ExamData;
  onFinish: (answers: UserAnswer[], timeTaken: number) => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ exam, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(exam.timeLimitMinutes * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const currentQuestion = exam.questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      if (exam.timerEnabled) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam.timerEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (index: number) => {
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: index });
  };

  const handleNext = () => {
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const finalAnswers: UserAnswer[] = exam.questions.map((q) => {
      const selected = userAnswers[q.id] ?? null;
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect: selected === q.answer
      };
    });
    onFinish(finalAnswers, elapsedTime);
  };

  const progress = ((currentIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">{exam.examName}</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Question {currentIndex + 1} of {exam.questions.length}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold ${
          !exam.timerEnabled ? 'bg-indigo-50 text-indigo-600' :
          timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {exam.timerEnabled ? formatTime(timeLeft) : 'Practice Mode'}
        </div>
      </header>

      <div className="w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-tighter">
              {currentQuestion.category}
            </span>
            <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full uppercase tracking-tighter">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-slate-800 leading-relaxed mb-10">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all group relative flex items-center gap-4 ${
                  userAnswers[currentQuestion.id] === idx 
                    ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  userAnswers[currentQuestion.id] === idx ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {userAnswers[currentQuestion.id] === idx && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={`text-lg font-medium ${userAnswers[currentQuestion.id] === idx ? 'text-blue-900' : 'text-slate-600'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-6 py-3 font-semibold text-slate-600 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-10 py-3 font-bold text-white rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {currentIndex === exam.questions.length - 1 ? 'Review & Submit' : 'Save & Next'}
          </button>
        </div>
      </main>

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Finish Attempt?</h2>
            <p className="text-slate-500 mb-8">You've answered {Object.keys(userAnswers).length} of {exam.questions.length} questions.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
              >
                Submit Now
              </button>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-full py-4 text-slate-500 font-semibold rounded-2xl hover:bg-slate-100 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
