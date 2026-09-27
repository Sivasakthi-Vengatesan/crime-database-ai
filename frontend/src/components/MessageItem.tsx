import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, User, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { EvidenceCard } from './EvidenceCard';
import { ReasoningBlock } from './ReasoningBlock';
import { TerminalBlock } from './TerminalBlock';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.sender === 'user') {
    return (
      <div className="flex justify-end my-4 animate-fadeIn">
        <div className="max-w-[85%] md:max-w-[75%] p-4 rounded-[22px] rounded-tr-sm bg-slate-900 text-white shadow-md shadow-slate-900/10 space-y-1">
          <div className="flex items-center justify-between gap-3 text-[10px] text-gray-400 font-mono">
            <span className="font-semibold uppercase flex items-center gap-1 text-red-400">
              <User size={11} /> Investigator Query
            </span>
            <span>{message.timestamp}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed font-sans">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-6 animate-fadeIn">
      <div className="w-full max-w-full space-y-4">
        {/* Agent Turn Header */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-2xs">
              <ShieldAlert size={14} />
            </div>
            <span className="font-bold text-slate-900 text-sm">
              CrimsonLogic Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold">
              Grounded pgvector
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-400">{message.timestamp}</span>
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg hover:bg-gray-200/80 text-gray-400 hover:text-slate-800 transition-colors cursor-pointer"
              title="Copy Analysis"
              aria-label="Copy message text"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Error State */}
        {message.isError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Reasoning Steps Collapsible */}
        {message.reasoning && message.reasoning.length > 0 && (
          <ReasoningBlock steps={message.reasoning} />
        )}

        {/* Structured ANSWER Block */}
        {!message.isError && (
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-red-600">
              <CheckCircle2 size={13} />
              <span>Answer</span>
            </div>
            <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans font-normal">
              {message.text}
            </p>
          </div>
        )}

        {/* Structured EVIDENCE Block */}
        {message.evidence && message.evidence.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <span className="text-slate-800 font-bold uppercase flex items-center gap-1.5">
                <Database size={13} className="text-red-500" />
                Evidence ({message.evidence.length} Retrieved Records)
              </span>
              <span className="text-gray-400 text-[10px]">Ranked by Vector & Filter Relevance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {message.evidence.map((ev, idx) => (
                <EvidenceCard key={ev.caseId || idx} evidence={ev} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Terminal / Query Telemetry Block */}
        {message.terminalLog && <TerminalBlock log={message.terminalLog} />}
      </div>
    </div>
  );
};

