import React from 'react';
import { X, Database, Cpu, ShieldAlert, CheckCircle2, Server } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="p-6 md:p-8 w-full max-w-lg space-y-5 bg-white rounded-[28px] border border-gray-200 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-md">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                CrimsonLogic Architecture & Telemetry
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                Backend Services & Vector Engine Status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          {/* Status Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-mono font-bold">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>CORE ENGINE: ACTIVE (Java 17 Spring Boot 3.3.4 + pgvector)</span>
          </div>

          {/* Metric Details */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Database size={15} className="text-red-500" />
                <span>Indexed Crime Records</span>
              </div>
              <span className="font-mono text-red-600 font-bold">
                {stats?.totalRecords || 106} cases
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Cpu size={15} className="text-orange-500" />
                <span>Embedding Model</span>
              </div>
              <span className="font-mono text-gray-600">
                {stats?.embeddingModel || 'LangChain4j 384-dim (AllMiniLmL6V2)'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Server size={15} className="text-emerald-500" />
                <span>Vector Retrieval Engine</span>
              </div>
              <span className="font-mono text-gray-600">
                {stats?.vectorEngine || 'pgvector + Cosine Ops'}
              </span>
            </div>
          </div>

          {/* Notice */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 leading-relaxed">
            🛡️ <strong>Zero-Hallucination Grounding:</strong> Every response synthesized by CrimsonLogic AI is directly validated against PostgreSQL structured records and dense vector similarity.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
