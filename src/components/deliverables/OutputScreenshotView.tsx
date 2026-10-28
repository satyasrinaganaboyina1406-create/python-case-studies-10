import React, { useState } from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { generateTerminalOutputSvg } from '../../utils/svgGenerators';
import { Image as ImageIcon, Download, Copy, Check, Terminal, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export const OutputScreenshotView: React.FC<Props> = ({ caseStudy }) => {
  const [copied, setCopied] = useState(false);
  const terminalData = caseStudy.deliverables.outputScreenshot;

  const handleDownloadSvg = () => {
    const svgContent = generateTerminalOutputSvg(caseStudy);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseStudy.slug}_output_screenshot.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyRaw = () => {
    const fullLog = `$ ${terminalData.terminalCommand}\n\n${terminalData.rawConsoleOutput}`;
    navigator.clipboard.writeText(fullLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 09</span>
            <span>·</span>
            <span>OUTPUT SCREENSHOT SPECIFICATION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">9. Program Execution Output Screenshot</h2>
          <p className="text-sm text-slate-400 mt-1">Authentic terminal session logs demonstrating end-to-end runtime output</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Screenshot (.svg)</span>
          </button>

          <button
            onClick={handleCopyRaw}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Log</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Transcript</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Execution Telemetry Badges */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Exit Code: {terminalData.exitCode} (SUCCESS)</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1.5 text-sky-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Execution Time: {terminalData.executionTimeMs} ms</span>
        </div>
        <span>·</span>
        <span className="text-slate-500">Timestamp: {terminalData.renderedTimestamp}</span>
      </div>

      {/* High-Fidelity Terminal Screenshot Container */}
      <div className="rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
        {/* Terminal Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-400">
              student@workstation: ~/PythonActivity/{caseStudy.slug}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            bash ~ 80x24
          </span>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-6 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed select-text space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <span className="text-emerald-400">➜</span>
            <span className="text-purple-400">{caseStudy.slug}</span>
            <span className="text-slate-400">$</span>
            <span>{terminalData.terminalCommand}</span>
          </div>

          <pre className="whitespace-pre font-mono text-slate-100/90 leading-normal tracking-wide">
            {terminalData.rawConsoleOutput}
          </pre>

          <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="w-2 h-3.5 bg-amber-400 animate-pulse inline-block" />
            <span>Process terminated with return code 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
