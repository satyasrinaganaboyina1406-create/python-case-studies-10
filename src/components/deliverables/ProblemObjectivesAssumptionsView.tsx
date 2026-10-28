import React from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { FileText, Target, Sliders, Users, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
  mode: 'problem' | 'objectives' | 'assumptions';
}

export const ProblemObjectivesAssumptionsView: React.FC<Props> = ({ caseStudy, mode }) => {
  const d = caseStudy.deliverables;

  if (mode === 'problem') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 01</span>
            <span>·</span>
            <span>ACADEMIC PROBLEM SPECIFICATION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">1. Problem Statement</h2>
          <p className="text-sm text-slate-400 mt-1">{caseStudy.title}</p>
        </div>

        {/* Background & Core Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-sky-400" />
              Domain Background & Context
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {d.problemStatement.background}
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Core Algorithmic Challenge
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {d.problemStatement.coreChallenge}
            </p>
          </div>
        </div>

        {/* Stakeholders & Functional Scope */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 md:col-span-1">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-indigo-400" />
              Primary Stakeholders
            </h3>
            <ul className="space-y-2">
              {d.problemStatement.stakeholders.map((s, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Functional Engineering Scope
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {d.problemStatement.functionalScope.map((f, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                  <span className="text-emerald-400 font-mono text-[10px] mt-0.5">0{idx + 1}.</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'objectives') {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 02</span>
            <span>·</span>
            <span>SYSTEM GOALS & BENCHMARKS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">2. Objectives</h2>
          <p className="text-sm text-slate-400 mt-1">Measurable functional requirements and engineering targets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-emerald-400" />
              Primary Functional Objectives
            </h3>
            <ol className="space-y-3">
              {d.objectives.primary.map((obj, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{obj}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-sky-400" />
              Secondary / Analytical Objectives
            </h3>
            <ol className="space-y-3">
              {d.objectives.secondary.map((obj, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{obj}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            Quantitative Metrics of Success
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {d.objectives.metricsOfSuccess.map((metric, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 p-3 rounded-md">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  Metric #{idx + 1}
                </span>
                <span className="text-xs text-slate-300 font-medium leading-relaxed">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Assumptions mode
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
          <span>DELIVERABLE 03</span>
          <span>·</span>
          <span>OPERATIONAL & MATHEMATICAL BOUNDARIES</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">3. Assumptions</h2>
        <p className="text-sm text-slate-400 mt-1">Data format preconditions, operational parameters, and error handling rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            Data Assumptions & Preconditions
          </h3>
          <ul className="space-y-2.5">
            {d.assumptions.dataAssumptions.map((a, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-purple-400 font-mono text-[10px] mt-0.5">·</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-sky-400" />
            Operational & Environmental Assumptions
          </h3>
          <ul className="space-y-2.5">
            {d.assumptions.operationalAssumptions.map((a, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-sky-400 font-mono text-[10px] mt-0.5">·</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Boundary Limits & Edge Constraints
          </h3>
          <ul className="space-y-2.5">
            {d.assumptions.boundaryLimits.map((a, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-mono text-[10px] mt-0.5">·</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Error Handling Policy & Fallbacks
          </h3>
          <ul className="space-y-2.5">
            {d.assumptions.errorHandlingPolicy.map((a, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-rose-400 font-mono text-[10px] mt-0.5">·</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
