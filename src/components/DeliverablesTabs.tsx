import React from 'react';
import {
  FileText,
  Target,
  Sliders,
  ListOrdered,
  Workflow,
  Code2,
  Terminal,
  CheckSquare,
  Image as ImageIcon,
  GraduationCap
} from 'lucide-react';

export type DeliverableTabId =
  | 'problem'
  | 'objectives'
  | 'assumptions'
  | 'algorithm'
  | 'flowchart'
  | 'pseudocode'
  | 'python'
  | 'tests'
  | 'screenshot'
  | 'conclusion';

interface DeliverablesTabsProps {
  activeTab: DeliverableTabId;
  onSelectTab: (tab: DeliverableTabId) => void;
}

const TABS: Array<{ id: DeliverableTabId; label: string; icon: React.ElementType; index: number }> = [
  { id: 'problem', label: '1. Problem Statement', icon: FileText, index: 1 },
  { id: 'objectives', label: '2. Objectives', icon: Target, index: 2 },
  { id: 'assumptions', label: '3. Assumptions', icon: Sliders, index: 3 },
  { id: 'algorithm', label: '4. Algorithm', icon: ListOrdered, index: 4 },
  { id: 'flowchart', label: '5. Flowchart', icon: Workflow, index: 5 },
  { id: 'pseudocode', label: '6. Pseudocode', icon: Code2, index: 6 },
  { id: 'python', label: '7. Python Source Code', icon: Terminal, index: 7 },
  { id: 'tests', label: '8. Test Cases', icon: CheckSquare, index: 8 },
  { id: 'screenshot', label: '9. Output Screenshot', icon: ImageIcon, index: 9 },
  { id: 'conclusion', label: '10. Conclusion', icon: GraduationCap, index: 10 },
];

export const DeliverablesTabs: React.FC<DeliverablesTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-2 overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
