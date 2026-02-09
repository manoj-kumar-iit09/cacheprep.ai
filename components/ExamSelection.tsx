
import React, { useState } from 'react';
import { EXAM_DATASETS } from '../data/datasets';
import { ExamData } from '../types';

interface ExamSelectionProps {
  onSelect: (exam: ExamData) => void;
}

const ExamSelection: React.FC<ExamSelectionProps> = ({ onSelect }) => {
  const [timerEnabled, setTimerEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">CachePrep<span className="text-blue-600">.ai</span></h1>
        <p className="text-lg text-slate-600">The high-fidelity simulation engine for consulting and technical assessments.</p>
      </div>

      <div className="mb-8 flex justify-center">
        <label className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={timerEnabled} 
              onChange={() => setTimerEnabled(!timerEnabled)} 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <span className="text-sm font-bold text-slate-700 select-none">
            {timerEnabled ? 'Timed Assessment Mode (Standard)' : 'Untimed Practice Mode'}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAM_DATASETS.map((exam) => (
          <button
            key={exam.id}
            onClick={() => onSelect({ ...exam, timerEnabled })}
            className="group relative bg-white rounded-2xl border-2 border-slate-100 p-8 text-left transition-all hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 focus:outline-none"
          >
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-xl ${exam.color} flex items-center justify-center text-3xl shadow-lg shadow-blue-100`}>
                {exam.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {exam.examName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    ⏱️ {exam.timeLimitMinutes} Mins
                  </span>
                  <span className="flex items-center gap-1">
                    📝 {exam.questions.length} Questions
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">
                    Tier 1
                  </span>
                </div>
              </div>
              <div className="text-slate-300 group-hover:text-blue-500 transition-colors self-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-100 border border-slate-200 rounded-2xl">
        <h4 className="font-bold text-slate-900 mb-2">💡 Intelligence Note</h4>
        <ul className="text-slate-600 text-sm space-y-2 opacity-90">
          <li>• Questions are randomized and weighted for predictive difficulty.</li>
          <li>• Gemini AI is used to synthesize logic for every answer in the review phase.</li>
          <li>• Consistent performance across all sets is required for technical competency.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExamSelection;
