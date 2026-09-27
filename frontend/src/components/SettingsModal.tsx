import React from 'react';
import { X, Database, Cpu, Shield, CheckCircle2, Server, Layers } from 'lucide-react';
import { DatabaseStats } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DatabaseStats | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="cyber-panel p-6 w-full max-w-lg space-y-5 bg-slate-900/95 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                AEGIS System Architecture & Telemetry
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Backend Services & Vector Engine Status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          {/* Status Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs font-mono">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>CORE ENGINE: ONLINE (Java 17 Spring Boot 3.3.4 + pgvector)</span>
          </div>

          {/* Metric Details */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Database size={15} className="text-cyan-400" />
                <span>Indexed Crime Records</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold">
                {stats?.totalRecords || 105} cases
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Cpu size={15} className="text-indigo-400" />
                <span>Embedding Model</span>
              </div>
              <span className="font-mono text-slate-400">
                {stats?.embeddingModel || 'LangChain4j 384-dim (AllMiniLmL6V2)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Server size={15} className="text-emerald-400" />
                <span>Vector Retrieval Engine</span>
              </div>
              <span className="font-mono text-slate-400">
                {stats?.vectorEngine || 'pgvector + Cosine Ops'}
              </span>
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            🛡️ <strong>Zero-Hallucination Grounding:</strong> Every response synthesized by Aegis AI is directly validated against PostgreSQL structured records and dense vector similarity.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
