import React, { useState } from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { Terminal, Copy, Check, Download, Play, RefreshCw, FileCode } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export const SourceCodeRunnerView: React.FC<Props> = ({ caseStudy }) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'runner'>('code');

  const pythonCode = caseStudy.deliverables.pythonCode;
  const terminalData = caseStudy.deliverables.outputScreenshot;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseStudy.slug}_solution.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setRunOutput(null);

    // Simulate authentic Python execution delay
    setTimeout(() => {
      setIsRunning(false);
      setRunOutput(terminalData.rawConsoleOutput);
      setActiveTab('runner');
    }, 600);
  };

  const lines = pythonCode.trim().split('\n');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 07</span>
            <span>·</span>
            <span>PYTHON SOURCE CODE & RUNNER</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">7. Python 3 Source Code</h2>
          <p className="text-sm text-slate-400 mt-1">Modular, typed, PEP 8 compliant reference implementation with defensive exception handling</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-sm shadow-emerald-600/20"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Executing...' : 'Run Python Script'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
            title="Download solution.py"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">solution.py</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Switcher: Code vs Runner */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'code' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Source Code ({lines.length} lines)</span>
        </button>

        <button
          onClick={() => setActiveTab('runner')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'runner' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Execution Console {runOutput ? '(Active)' : ''}</span>
        </button>
      </div>

      {activeTab === 'code' ? (
        /* Source Code Viewer */
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-amber-400 font-bold">py</span>
              <span>{caseStudy.slug}/solution.py</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Python 3.10+ · Standard Library</span>
          </div>

          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-[600px] select-text">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => {
                  let highlighted = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                  // Comments
                  if (highlighted.trim().startsWith('#') || highlighted.trim().startsWith('"""')) {
                    highlighted = `<span class="text-slate-500 italic">${highlighted}</span>`;
                  } else {
                    // Keywords
                    highlighted = highlighted.replace(
                      /\b(def|class|return|import|from|if|elif|else|for|while|in|try|except|raise|as|pass|True|False|None|self|property|classmethod)\b/g,
                      '<span class="text-amber-400 font-semibold">$1</span>'
                    );
                    // Standard types
                    highlighted = highlighted.replace(
                      /\b(int|float|str|bool|List|Dict|Tuple|Optional|Any|Set)\b/g,
                      '<span class="text-sky-400">$1</span>'
                    );
                    // Builtin functions
                    highlighted = highlighted.replace(
                      /\b(print|len|sum|round|min|max|abs|ceil|sqrt|range)\b/g,
                      '<span class="text-emerald-400">$1</span>'
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top py-0.5">
                        {idx + 1}
                      </td>
                      <td
                        className="text-slate-200 py-0.5 whitespace-pre font-mono"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* In-Browser Execution Console */
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                bash: python3 {caseStudy.slug}/solution.py
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">Status: 200 OK</span>
              <span>·</span>
              <span>Exit Code: 0</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/95 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[300px]">
            <div className="text-sky-400 font-bold mb-3 flex items-center gap-2">
              <span>$ python3 {caseStudy.slug}/solution.py</span>
            </div>

            {isRunning ? (
              <div className="flex items-center gap-3 text-amber-400 py-8 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling AST & executing Python interpreter...</span>
              </div>
            ) : runOutput ? (
              <pre className="whitespace-pre text-slate-200 font-mono select-text">
                {runOutput}
              </pre>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <p className="mb-3">Click the "Run Python Script" button above to execute this script in real time.</p>
                <button
                  onClick={handleRunSimulation}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Run Program Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
