import React from 'react';
import { Cpu, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ReasoningStep } from '../types/chat';

interface ReasoningBlockProps {
  steps: ReasoningStep[];
}

export const ReasoningBlock: React.FC<ReasoningBlockProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <details className="technical-block group my-3 rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <summary className="flex items-center justify-between p-3.5 cursor-pointer text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-amber-400 shrink-0" />
          <span>LangChain4j RAG Inference ({steps.length} steps executed)</span>
        </div>
        <ChevronDown
          size={15}
          className="text-slate-400 group-open:rotate-180 transition-transform duration-200"
        />
      </summary>

      <div className="border-t border-white/5 bg-slate-950/60 p-3.5 space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1 text-xs"
          >
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {idx + 1}. {step.stepName}
              </span>
              {step.durationMs !== undefined && (
                <span className="text-[10px] text-slate-500">
                  {step.durationMs}ms
                </span>
              )}
            </div>
            <p className="text-slate-300 text-xs">{step.description}</p>
            {step.details && (
              <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-white/5 overflow-x-auto">
                {step.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
};
