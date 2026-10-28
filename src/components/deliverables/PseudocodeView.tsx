import React, { useState } from 'react';
import { CaseStudy } from '../../types/caseStudy';
import { Code2, Copy, Check } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export const PseudocodeView: React.FC<Props> = ({ caseStudy }) => {
  const [copied, setCopied] = useState(false);
  const pseudocode = caseStudy.deliverables.pseudocode;

  const handleCopy = () => {
    navigator.clipboard.writeText(pseudocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = pseudocode.split('\n');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>DELIVERABLE 06</span>
            <span>·</span>
            <span>STRUCTURED ACADEMIC PSEUDOCODE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">6. Formal Pseudocode</h2>
          <p className="text-sm text-slate-400 mt-1">Language-independent procedural algorithm description</p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Pseudocode</span>
            </>
          )}
        </button>
      </div>

      {/* Code Block with line numbers */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>ALGORITHM_SPECIFICATION.txt</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            {lines.length} lines · UTF-8
          </span>
        </div>

        <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed select-text">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                // Highlight keywords
                let highlighted = line
                  .replace(/\b(ALGORITHM|INPUT|OUTPUT|BEGIN|END|FOR EACH|IN|DO|IF|THEN|ELSE IF|ELSE|RETURN|WHILE|AND|OR|NOT|TRUE|FALSE)\b/g, '<span class="text-amber-400 font-bold">$1</span>')
                  .replace(/\b(SET|APPEND|SUM|AVERAGE|SQRT|MIN|MAX|CEIL|LENGTH|ROUND)\b/g, '<span class="text-sky-400 font-semibold">$1</span>')
                  .replace(/(\/\/[^\n]*)/g, '<span class="text-slate-500 italic">$1</span>');

                return (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top py-0.5">
                      {idx + 1}
                    </td>
                    <td
                      className="text-slate-200 py-0.5 whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
