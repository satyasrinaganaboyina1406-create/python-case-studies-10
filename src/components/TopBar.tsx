import React from 'react';
import { Download, Github, FileText, CheckCircle2 } from 'lucide-react';

interface TopBarProps {
  onOpenGitHubHub: () => void;
  onDownloadZip: () => void;
  onOpenFullReport: () => void;
  isDownloadingZip: boolean;
  activeView: 'cases' | 'report';
  setActiveView: (view: 'cases' | 'report') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenGitHubHub,
  onDownloadZip,
  onOpenFullReport,
  isDownloadingZip,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm">
            Py
          </span>
          <span>PythonActivity</span>
        </a>
      </div>

      {/* Zone 2: Single-line Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveView('cases')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'cases' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          10 Case Studies
        </button>
        <button
          onClick={() => setActiveView('report')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'report' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Master Dossier Report
        </button>
        <button
          onClick={onOpenGitHubHub}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          GitHub Repository Hub
        </button>
      </nav>

      {/* Zone 3: Primary Action CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer shadow-sm shadow-amber-500/10"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloadingZip ? 'Packaging Repo...' : 'Download PythonActivity.zip'}</span>
        </button>

        <button
          onClick={onOpenGitHubHub}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Upload to student's GitHub repository"
        >
          <Github className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Upload to GitHub</span>
        </button>
      </div>
    </header>
  );
};
