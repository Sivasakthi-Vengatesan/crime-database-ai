import React, { useState } from 'react';
import {
  Copy,
  Check,
  Shield,
  User,
  AlertCircle,
  Database,
  Sparkles,
} from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { EvidenceCard } from './EvidenceCard';
import { ReasoningBlock } from './ReasoningBlock';
import { TerminalBlock } from './TerminalBlock';
import { CodeBlock } from './CodeBlock';

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
      <div className="flex justify-end my-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[85%] md:max-w-[70%] p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 space-y-1 rounded-br-sm">
          <div className="flex items-center justify-between gap-3 text-[10px] text-cyan-100 font-mono">
            <span className="font-semibold uppercase flex items-center gap-1">
              <User size={11} /> You (Investigator)
            </span>
            <span>{message.timestamp}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="w-full max-w-full space-y-4">
        {/* Agent Turn Header */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield size={13} />
            </div>
            <span className="font-bold font-display text-white text-sm">
              AEGIS Crime Analyst
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              EVIDENCE GROUNDED
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500">{message.timestamp}</span>
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copy Answer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Error State */}
        {message.isError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Reasoning Steps Collapsible */}
        {message.reasoning && message.reasoning.length > 0 && (
          <ReasoningBlock steps={message.reasoning} />
        )}

        {/* Main Response Text */}
        {!message.isError && (
          <div className="cyber-panel p-5 space-y-3 bg-slate-900/60 border-white/10">
            <p className="text-sm md:text-base text-slate-100 leading-relaxed font-sans">
              {message.text}
            </p>
          </div>
        )}

        {/* Evidence Candidates */}
        {message.evidence && message.evidence.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                <Database size={13} />
                Verified Database Evidence ({message.evidence.length} Records)
              </span>
              <span>Sorted by Dense Cosine Similarity</span>
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
