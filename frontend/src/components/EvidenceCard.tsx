import React from 'react';
import { Calendar, MapPin, Shield, User, Sparkles } from 'lucide-react';
import { Evidence } from '../types/chat';

interface EvidenceCardProps {
  evidence: Evidence;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'medium':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all space-y-3">
      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-red-500 font-bold text-xs">
            #{index + 1}
          </span>
          <span className="font-mono font-bold text-xs text-slate-800 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
            {evidence.caseId}
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {evidence.crimeType}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getSeverityStyle(
              evidence.severity
            )}`}
          >
            {evidence.severity}
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-slate-600 border border-gray-200">
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
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <MapPin size={12} className="text-red-500" />
            <span>{evidence.location}</span>
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <span>{evidence.date}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {evidence.victimAge && (
            <span className="flex items-center gap-1">
              <User size={12} className="text-gray-400" />
              <span>Victim: {evidence.victimAge}y</span>
            </span>
          )}

          {evidence.similarityScore !== undefined && evidence.similarityScore !== null && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 font-semibold"
              title="Vector Cosine Similarity Score"
            >
              <Sparkles size={10} className="text-red-500" />
              sim: {evidence.similarityScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
