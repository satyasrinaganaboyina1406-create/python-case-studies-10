import React, { useState } from 'react';
import { CASE_STUDIES } from './data/caseStudiesData';
import { TopBar } from './components/TopBar';
import { CaseStudySelector } from './components/CaseStudySelector';
import { DeliverablesTabs, DeliverableTabId } from './components/DeliverablesTabs';
import { ProblemObjectivesAssumptionsView } from './components/deliverables/ProblemObjectivesAssumptionsView';
import { AlgorithmFlowchartView } from './components/deliverables/AlgorithmFlowchartView';
import { PseudocodeView } from './components/deliverables/PseudocodeView';
import { SourceCodeRunnerView } from './components/deliverables/SourceCodeRunnerView';
import { TestCasesMatrixView } from './components/deliverables/TestCasesMatrixView';
import { OutputScreenshotView } from './components/deliverables/OutputScreenshotView';
import { ConclusionComplexityView } from './components/deliverables/ConclusionComplexityView';
import { GitHubHubModal } from './components/GitHubHubModal';
import { AllDeliverablesPrintView } from './components/AllDeliverablesPrintView';
import { StudentRepoConfig, createPythonActivityZipBlob } from './utils/zipGenerator';
import { CheckCircle2, Github, Download, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<DeliverableTabId>('problem');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'cases' | 'report'>('cases');
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  // Student configuration (pre-filled with student details)
  const [studentConfig, setStudentConfig] = useState<StudentRepoConfig>({
    studentName: 'Nagna Boyina Satya Sri',
    githubUsername: 'nagnaboyinasatyasri',
    repoName: 'PythonActivity',
  });

  const selectedCase = CASE_STUDIES.find((c) => c.id === selectedCaseId) || CASE_STUDIES[0];

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const blob = await createPythonActivityZipBlob(studentConfig);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentConfig.repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate repo zip:', e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Strict Top Bar */}
      <TopBar
        onOpenGitHubHub={() => setIsGitHubModalOpen(true)}
        onDownloadZip={handleDownloadZip}
        onOpenFullReport={() => setActiveView('report')}
        isDownloadingZip={isDownloadingZip}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {activeView === 'report' ? (
        <AllDeliverablesPrintView
          studentConfig={studentConfig}
          onBackToExplorer={() => setActiveView('cases')}
          onDownloadZip={handleDownloadZip}
          isDownloadingZip={isDownloadingZip}
        />
      ) : (
        <main className="flex-1 flex flex-col">
          {/* Quick Case Study Selector Bar */}
          <CaseStudySelector
            caseStudies={CASE_STUDIES}
            selectedCaseId={selectedCaseId}
            onSelectCase={(id) => {
              setSelectedCaseId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Case Study Meta Strip */}
          <div className="bg-slate-900/40 border-b border-slate-800/80 px-6 py-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">Case Study {selectedCase.id.toString().padStart(2, '0')} of 10</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCase.shortDomain}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">Folder: <code className="text-slate-300">PythonActivity/{selectedCase.slug}/</code></span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {selectedCase.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {selectedCase.summary}
                </p>
              </div>

              {/* Status and GitHub push prompt */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10 / 10 Deliverables Ready</span>
                </div>
                <button
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Target: <strong className="text-slate-200 font-mono font-medium">{studentConfig.repoName}</strong></span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 10 Mandatory Deliverables Tab Bar */}
          <DeliverablesTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          {/* Main Deliverable Content Stage */}
          <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
            {activeTab === 'problem' && (
              <ProblemObjectivesAssumptionsView caseStudy={selectedCase} mode="problem" />
            )}
            {activeTab === 'objectives' && (
              <ProblemObjectivesAssumptionsView caseStudy={selectedCase} mode="objectives" />
            )}
            {activeTab === 'assumptions' && (
              <ProblemObjectivesAssumptionsView caseStudy={selectedCase} mode="assumptions" />
            )}
            {activeTab === 'algorithm' && (
              <AlgorithmFlowchartView caseStudy={selectedCase} mode="algorithm" />
            )}
            {activeTab === 'flowchart' && (
              <AlgorithmFlowchartView caseStudy={selectedCase} mode="flowchart" />
            )}
            {activeTab === 'pseudocode' && (
              <PseudocodeView caseStudy={selectedCase} />
            )}
            {activeTab === 'python' && (
              <SourceCodeRunnerView caseStudy={selectedCase} />
            )}
            {activeTab === 'tests' && (
              <TestCasesMatrixView caseStudy={selectedCase} />
            )}
            {activeTab === 'screenshot' && (
              <OutputScreenshotView caseStudy={selectedCase} />
            )}
            {activeTab === 'conclusion' && (
              <ConclusionComplexityView caseStudy={selectedCase} />
            )}

            {/* Bottom Deliverable Navigation Footer */}
            <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Case Study navigation:</span>
                <button
                  disabled={selectedCaseId === 1}
                  onClick={() => setSelectedCaseId((id) => Math.max(1, id - 1))}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded border border-slate-800 text-slate-300 font-medium cursor-pointer"
                >
                  Previous Case
                </button>
                <button
                  disabled={selectedCaseId === 10}
                  onClick={() => setSelectedCaseId((id) => Math.min(10, id + 1))}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded border border-slate-800 text-slate-300 font-medium cursor-pointer"
                >
                  Next Case
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('report')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  View Full Academic Dossier
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-semibold"
                >
                  Upload All 10 to GitHub (PythonActivity)
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* GitHub Repository Sync Modal */}
      <GitHubHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        studentConfig={studentConfig}
        onUpdateStudentConfig={setStudentConfig}
      />
    </div>
  );
}
