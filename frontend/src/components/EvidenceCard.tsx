import React from 'react';
import { Calendar, MapPin, Shield, User, Sparkles } from 'lucide-react';
import { Evidence } from '../types/chat';

interface EvidenceCardProps {
  evidence: Evidence;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { bg: 'rgba(244, 63, 94, 0.15)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.3)' };
      case 'high':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      case 'medium':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' };
    }
  };

  const badge = getSeverityBadge(evidence.severity);

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-bold text-sm min-w-[18px]">
            {index + 1}.
          </span>
          <span className="font-mono font-bold text-xs text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10">
            {evidence.caseId}
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {evidence.crimeType}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`,
            }}
          >
            {evidence.severity}
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
            {evidence.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {evidence.description}
      </p>

      {/* Footer Meta Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin size={12} className="text-cyan-400" />
            <span>{evidence.location}</span>
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-slate-500" />
            <span>{evidence.date}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {evidence.victimAge && (
            <span className="flex items-center gap-1">
              <User size={12} className="text-slate-500" />
              <span>Victim: {evidence.victimAge}y</span>
            </span>
          )}

          {evidence.similarityScore !== undefined && evidence.similarityScore !== null && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
              title="Cosine Similarity"
            >
              <Sparkles size={10} className="text-cyan-400" />
              sim: {evidence.similarityScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
