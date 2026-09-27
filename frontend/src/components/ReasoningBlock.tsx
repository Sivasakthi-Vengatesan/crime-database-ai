import React from 'react';
import { Cpu, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ReasoningStep } from '../types/chat';

interface ReasoningBlockProps {
  steps: ReasoningStep[];
}

export const ReasoningBlock: React.FC<ReasoningBlockProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <details className="group my-3 rounded-2xl border border-gray-200 bg-white/80 shadow-sm overflow-hidden transition-all">
      <summary className="flex items-center justify-between p-3.5 cursor-pointer text-xs font-semibold text-slate-800 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-orange-500 shrink-0" />
          <span>CrimsonLogic RAG Reasoning Pipeline ({steps.length} steps executed)</span>
        </div>
        <ChevronDown
          size={15}
          className="text-gray-400 group-open:rotate-180 transition-transform duration-200"
        />
      </summary>

      <div className="border-t border-gray-100 bg-[#f9fafb] p-3.5 space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1 text-xs shadow-xs"
          >
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {idx + 1}. {step.stepName}
              </span>
              {step.durationMs !== undefined && (
                <span className="text-[10px] text-gray-400">
                  {step.durationMs}ms
                </span>
              )}
            </div>
            <p className="text-slate-600 text-xs font-sans">{step.description}</p>
            {step.details && (
              <div className="text-[11px] font-mono text-red-600 bg-red-50/70 px-2 py-1 rounded-lg border border-red-100 overflow-x-auto">
                {step.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
};
