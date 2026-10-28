import React, { useState } from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { generateFlowchartSvg } from '../../utils/svgGenerators';
import { ListOrdered, Workflow, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
  mode: 'algorithm' | 'flowchart';
}

export const AlgorithmFlowchartView: React.FC<Props> = ({ caseStudy, mode }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const d = caseStudy.deliverables;

  const handleDownloadSvg = () => {
    const svgContent = generateFlowchartSvg(caseStudy);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseStudy.slug}_flowchart.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (mode === 'algorithm') {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 04</span>
            <span>·</span>
            <span>STEP-BY-STEP ALGORITHM</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">4. Step-by-Step Algorithm</h2>
          <p className="text-sm text-slate-400 mt-1">Rigorous algorithmic logic and execution sequence</p>
        </div>

        <div className="space-y-4">
          {d.algorithm.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {step.stepNumber.toString().padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                  {step.substeps && step.substeps.length > 0 && (
                    <ul className="mt-2.5 pl-4 border-l border-slate-800 space-y-1.5">
                      {step.substeps.map((sub, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-amber-400 font-mono text-[10px]">›</span>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Flowchart Mode
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 05</span>
            <span>·</span>
            <span>VISUAL FLOWCHART SPECIFICATION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">5. Algorithmic Flowchart</h2>
          <p className="text-sm text-slate-400 mt-1">Formal visual process logic using standard ANSI flowchart symbol geometry</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Flowchart.svg</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-md flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="font-mono text-[11px] text-slate-500 uppercase">ANSI Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-950 border border-sky-400" />
          <span>Terminal (Start/End)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-950 border border-emerald-400 rotate-12" />
          <span>Input / Output</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-slate-800 border border-slate-400 rounded-xs" />
          <span>Process Task</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-indigo-950 border border-indigo-400 rotate-45" />
          <span>Decision Condition</span>
        </div>
      </div>

      {/* Interactive SVG Diagram Container */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-6 overflow-auto flex justify-center min-h-[500px]">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          dangerouslySetInnerHTML={{ __html: generateFlowchartSvg(caseStudy) }}
        />
      </div>
    </div>
  );
};
