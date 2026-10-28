import React from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { GraduationCap, Clock, HardDrive, Lightbulb, Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export const ConclusionComplexityView: React.FC<Props> = ({ caseStudy }) => {
  const d = caseStudy.deliverables.conclusion;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
          <span>DELIVERABLE 10</span>
          <span>·</span>
          <span>COMPLEXITY ANALYSIS & CONCLUSION</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">10. Conclusion & Algorithmic Analysis</h2>
        <p className="text-sm text-slate-400 mt-1">Theoretical complexity evaluations, engineering reflections, and real-world applicability</p>
      </div>

      {/* Summary Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          Executive Synthesis
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {d.summary}
        </p>
      </div>

      {/* Time & Space Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Time Complexity Evaluation
            </h3>
            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
              {caseStudy.timeComplexity.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {d.timeComplexityAnalysis}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              Auxiliary Space Complexity
            </h3>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
              {caseStudy.spaceComplexity.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {d.spaceComplexityAnalysis}
          </p>
        </div>
      </div>

      {/* Key Learnings & Real-World Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Key Pedagogical Learnings
          </h3>
          <ul className="space-y-2.5">
            {d.keyLearnings.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            Real-World Industry Applications
          </h3>
          <ul className="space-y-2.5">
            {d.realWorldApplications.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Limitations & Future Roadmap */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Technical Limitations & Future Scalability Scope
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {d.limitationsAndFutureScope.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded border border-slate-800/80 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
