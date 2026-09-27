import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalBlockProps {
  log?: string;
}

export const TerminalBlock: React.FC<TerminalBlockProps> = ({ log }) => {
  if (!log || log.trim().length === 0) return null;

  const lines = log.split('\n');

  return (
    <div className="my-3 rounded-2xl border border-slate-800 bg-[#1e293b] text-slate-200 overflow-hidden font-mono text-xs shadow-md">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-700/80 text-gray-400 text-[11px]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={13} className="text-red-400" />
          <span className="text-slate-200 font-semibold">PostgreSQL & pgvector Query Telemetry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-300 space-y-1">
        {lines.map((line, idx) => {
          if (!line.trim()) return null;

          if (line.startsWith('$')) {
            const rest = line.substring(1).trim();
            const isSuccess = rest.includes('SUCCESS') || rest.includes('RESULT');
            const isWarn = rest.includes('WARN') || rest.includes('ERR');
            const isSql = rest.includes('SELECT') || rest.includes('FROM');

            return (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-red-400 font-bold select-none">$</span>
                <span
                  className={
                    isSuccess
                      ? 'text-emerald-400 font-semibold'
                      : isWarn
                      ? 'text-orange-400'
                      : isSql
                      ? 'text-cyan-300'
                      : 'text-slate-200'
                  }
                >
                  {rest}
                </span>
              </div>
            );
          }

          return (
            <div key={idx} className="text-slate-400 pl-4">
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};
