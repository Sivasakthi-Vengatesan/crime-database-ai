import React from 'react';
import { Calendar, MapPin, Sparkles, User } from 'lucide-react';
import { Evidence } from '../types/chat';

interface EvidenceCardProps {
  evidence: Evidence;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'closed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('investigation')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-red-300 transition-all space-y-2.5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-red-500 font-bold text-xs">
            #{index + 1}
          </span>
          <span className="font-mono font-bold text-xs text-slate-900 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
            {evidence.caseId}
          </span>
          <span className="text-xs font-bold text-slate-800">
            {evidence.crimeType}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {evidence.similarityScore !== undefined && evidence.similarityScore !== null && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 font-bold"
              title="pgvector Cosine Similarity Score"
            >
              <Sparkles size={10} className="text-red-500" />
              sim: {evidence.similarityScore}
            </span>
          )}

          <span
            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getSeverityBadge(
              evidence.severity
            )}`}
          >
            {evidence.severity}
          </span>

          <span
            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
              evidence.status
            )}`}
          >
            {evidence.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed font-sans">
        {evidence.description}
      </p>

      {/* Footer Meta Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-700 font-semibold">
            <MapPin size={12} className="text-red-500" />
            <span>{evidence.location}</span>
          </span>

          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-500">
            <Calendar size={11} className="text-gray-400" />
            <span>{evidence.date}</span>
          </span>
        </div>

        {evidence.victimAge && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
            <User size={11} className="text-gray-400" />
            <span>Victim: {evidence.victimAge}y</span>
          </span>
        )}
      </div>
    </div>
  );
};

