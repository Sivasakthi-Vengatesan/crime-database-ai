import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, User, AlertCircle, Database } from 'lucide-react';
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
        <div className="max-w-[85%] md:max-w-[75%] p-4 rounded-[22px] rounded-tr-sm bg-slate-800 text-white shadow-lg shadow-slate-900/10 space-y-1">
          <div className="flex items-center justify-between gap-3 text-[10px] text-gray-400 font-mono">
            <span className="font-semibold uppercase flex items-center gap-1">
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
            <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-sm">
              <ShieldAlert size={14} />
            </div>
            <span className="font-bold text-slate-800 text-sm">
              CrimsonLogic Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-semibold">
              Grounded pgvector
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-400">{message.timestamp}</span>
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg hover:bg-gray-200/80 text-gray-400 hover:text-slate-800 transition-colors"
              title="Copy Analysis"
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

        {/* Main Response Text Card */}
        {!message.isError && (
          <div className="p-5 rounded-2xl bg-white/90 border border-gray-200/90 shadow-sm space-y-3">
            <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans">
              {message.text}
            </p>
          </div>
        )}

        {/* Evidence Candidates */}
        {message.evidence && message.evidence.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <span className="text-red-600 font-bold uppercase flex items-center gap-1.5">
                <Database size={13} />
                Retrieved Crime Database Evidence ({message.evidence.length} Records)
              </span>
              <span>Sorted by Cosine Similarity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {message.evidence.map((ev, idx) => (
                <EvidenceCard key={ev.caseId || idx} evidence={ev} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Terminal Telemetry Block */}
        {message.terminalLog && <TerminalBlock log={message.terminalLog} />}
      </div>
    </div>
  );
};
