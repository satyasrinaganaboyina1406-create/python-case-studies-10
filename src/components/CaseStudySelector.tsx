import React from 'react';
import { CaseStudy } from '../types/caseStudy';
import { ChevronRight } from 'lucide-react';

interface CaseStudySelectorProps {
  caseStudies: CaseStudy[];
  selectedCaseId: number;
  onSelectCase: (id: number) => void;
}

export const CaseStudySelector: React.FC<CaseStudySelectorProps> = ({
  caseStudies,
  selectedCaseId,
  onSelectCase,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-xs uppercase tracking-wider font-mono text-slate-500 mr-2 shrink-0">
          Case Studies (1-10):
        </span>
        {caseStudies.map((cs) => {
          const isSelected = cs.id === selectedCaseId;
          return (
            <button
              key={cs.id}
              onClick={() => onSelectCase(cs.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span className={`font-mono ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                {cs.id.toString().padStart(2, '0')}
              </span>
              <span>{cs.title.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
