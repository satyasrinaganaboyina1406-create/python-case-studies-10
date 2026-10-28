import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/caseStudiesData';
import { StudentRepoConfig } from '../utils/zipGenerator';
import { generateFlowchartSvg, generateTerminalOutputSvg } from '../utils/svgGenerators';
import { Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  studentConfig: StudentRepoConfig;
  onBackToExplorer: () => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const AllDeliverablesPrintView: React.FC<Props> = ({
  studentConfig,
  onBackToExplorer,
  onDownloadZip,
  isDownloadingZip,
}) => {
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<number | 'all'>('all');

  const filteredStudies =
    selectedCaseFilter === 'all'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.id === selectedCaseFilter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      {/* Top Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 sticky top-18 z-30 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToExplorer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Interactive Explorer</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 font-mono">
            Master Academic Dossier ({filteredStudies.length} of 10 Case Studies)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCaseFilter}
            onChange={(e) =>
              setSelectedCaseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden"
          >
            <option value="all">Display All 10 Case Studies</option>
            {CASE_STUDIES.map((c) => (
              <option key={c.id} value={c.id}>
                Case {c.id.toString().padStart(2, '0')}: {c.title.split('&')[0]}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Repo (.zip)</span>
          </button>
        </div>
      </div>

      {/* Dossier Title Header */}
      <div className="border-b border-slate-800 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Academic Submission Portfolio · 10 Mandatory Deliverables Completed</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PythonActivity: 10 Selected Case Studies
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Comprehensive deliverable suite comprising problem statements, objectives, assumptions, algorithms, flowcharts, pseudocode, Python source code, test matrices, execution output screenshots, and conclusions.
        </p>
        <div className="text-xs text-slate-500 font-mono pt-2">
          <span>Student: <strong className="text-slate-300">{studentConfig.studentName}</strong></span>
          <span className="mx-2">·</span>
          <span>GitHub Repository: <strong className="text-amber-400">{studentConfig.githubUsername}/{studentConfig.repoName}</strong></span>
        </div>
      </div>

      {/* Case Studies Sequential Render */}
      <div className="space-y-16">
        {filteredStudies.map((cs) => {
          const d = cs.deliverables;
          return (
            <article
              key={cs.id}
              className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-8"
            >
              {/* Case Header */}
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase">
                  CASE STUDY {cs.id.toString().padStart(2, '0')} · {cs.shortDomain}
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                  {cs.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Folder: <code className="text-slate-300 font-mono">PythonActivity/{cs.slug}/</code> · Complexity: <code className="text-amber-300 font-mono">{cs.timeComplexity}</code>
                </p>
              </div>

              {/* 1. Problem Statement */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  1. Problem Statement
                </h3>
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p><strong>Background:</strong> {d.problemStatement.background}</p>
                  <p><strong>Core Challenge:</strong> {d.problemStatement.coreChallenge}</p>
                  <p><strong>Key Stakeholders:</strong> {d.problemStatement.stakeholders.join(', ')}</p>
                </div>
              </section>

              {/* 2. Objectives */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  2. Objectives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60 space-y-1.5">
                    <strong className="text-emerald-400 block mb-1">Primary Objectives:</strong>
                    {d.objectives.primary.map((p, idx) => (
                      <div key={idx}>• {p}</div>
                    ))}
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60 space-y-1.5">
                    <strong className="text-sky-400 block mb-1">Secondary Objectives:</strong>
                    {d.objectives.secondary.map((s, idx) => (
                      <div key={idx}>• {s}</div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 3. Assumptions */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  3. Assumptions & Constraints
                </h3>
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-purple-400 block mb-1">Data & Operational:</strong>
                    {d.assumptions.dataAssumptions.map((a, idx) => (
                      <div key={idx} className="mb-1">• {a}</div>
                    ))}
                  </div>
                  <div>
                    <strong className="text-amber-400 block mb-1">Boundaries & Error Policies:</strong>
                    {d.assumptions.boundaryLimits.map((b, idx) => (
                      <div key={idx} className="mb-1">• {b}</div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. Algorithm */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  4. Step-by-Step Algorithm
                </h3>
                <div className="space-y-2 text-xs">
                  {d.algorithm.steps.map((st) => (
                    <div key={st.stepNumber} className="bg-slate-950/60 p-3 rounded border border-slate-800/60">
                      <strong className="text-amber-400 font-mono mr-2">Step {st.stepNumber}: {st.title}</strong>
                      <span className="text-slate-300">{st.description}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Flowchart */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  5. Flowchart Diagram
                </h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto flex justify-center">
                  <div dangerouslySetInnerHTML={{ __html: generateFlowchartSvg(cs) }} />
                </div>
              </section>

              {/* 6. Pseudocode */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  6. Structured Pseudocode
                </h3>
                <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                  {d.pseudocode}
                </pre>
              </section>

              {/* 7. Python Source Code */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  7. Python Source Code ({cs.slug}/solution.py)
                </h3>
                <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre leading-relaxed max-h-96">
                  {d.pythonCode.trim()}
                </pre>
              </section>

              {/* 8. Test Cases */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  8. Test Cases Matrix
                </h3>
                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 font-mono">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Input Parameters</th>
                        <th className="p-2.5">Expected Output</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {d.testCases.map((tc) => (
                        <tr key={tc.id}>
                          <td className="p-2.5 font-mono font-bold text-amber-400">{tc.id}</td>
                          <td className="p-2.5 font-mono text-[11px]">{tc.category}</td>
                          <td className="p-2.5 font-mono text-[11px]">{tc.input}</td>
                          <td className="p-2.5 font-mono text-[11px]">{tc.expectedOutput}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{tc.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 9. Output Screenshot */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  9. Program Execution Output Screenshot
                </h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto flex justify-center">
                  <div dangerouslySetInnerHTML={{ __html: generateTerminalOutputSvg(cs) }} />
                </div>
              </section>

              {/* 10. Conclusion */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
                  10. Conclusion & Complexity
                </h3>
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60 text-xs text-slate-300 space-y-2">
                  <p><strong>Synthesis:</strong> {d.conclusion.summary}</p>
                  <p><strong>Time Complexity:</strong> {d.conclusion.timeComplexityAnalysis}</p>
                  <p><strong>Space Complexity:</strong> {d.conclusion.spaceComplexityAnalysis}</p>
                  <div>
                    <strong>Key Learnings:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {d.conclusion.keyLearnings.map((k, idx) => (
                        <li key={idx}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </article>
          );
        })}
      </div>
    </div>
  );
};
