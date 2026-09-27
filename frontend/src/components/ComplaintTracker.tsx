import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Building,
  Gavel,
  ShieldAlert,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ComplaintResponseData } from '../types/chat';
import { trackComplaintApi } from '../api/chatApi';

interface ComplaintTrackerProps {
  initialTrackingNumber?: string;
  onInvestigateInChat: (caseId: string, summary: string) => void;
}

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({
  initialTrackingNumber = '',
  onInvestigateInChat,
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [caseResult, setCaseResult] = useState<ComplaintResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      handleSearch(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  const handleSearch = async (queryToUse?: string) => {
    const term = (queryToUse || trackingNumber).trim();
    if (!term) {
      setErrorMessage('Please enter an FIR tracking number or Case ID (e.g. CASE-1001 or FIR-2026-CHN-1092).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await trackComplaintApi(term);
      setCaseResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || `No case found matching "${term}".`);
      setCaseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('closed') || s.includes('resolved')) return '#10b981';
    if (s.includes('investigation')) return '#f59e0b';
    return '#06b6d4';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 overflow-y-auto">
      {/* Tracker Header */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Clock size={13} />
          Real-Time Investigation Tracker
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
          Track e-FIR & Case Investigation Status
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter any official FIR Tracking Number or indexed Case ID to view live investigation milestones, forensic updates, and jurisdiction routing.
        </p>
      </div>

      {/* Search Bar */}
      <div className="cyber-panel p-4 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. CASE-1001, CASE-1015, or FIR-2026-CHN-4821"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 font-mono transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isLoading ? 'Searching Registry...' : 'Track Status'}
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-500">Quick Test Cases:</span>
          {['CASE-1001', 'CASE-1015', 'CASE-1051', 'CASE-1092'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setTrackingNumber(sample);
                handleSearch(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 font-mono text-xs border border-white/5 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 mb-6 animate-shake">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Case Details Card */}
      {caseResult && (
        <div className="cyber-panel p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-white">{caseResult.caseId}</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase"
                  style={{
                    backgroundColor: `${getStatusColor(caseResult.status)}20`,
                    color: getStatusColor(caseResult.status),
                    border: `1px solid ${getStatusColor(caseResult.status)}40`,
                  }}
                >
                  {caseResult.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">
                  {caseResult.severity} Severity
                </span>
              </div>
              <div className="text-sm text-slate-400 mt-1 flex items-center gap-4">
                <span>📍 {caseResult.location}</span>
                <span>📂 {caseResult.crimeType}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {caseResult.incidentDate}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onInvestigateInChat(
                  caseResult.caseId,
                  `Provide a detailed intelligence report and suspect analysis on case ${caseResult.caseId} in ${caseResult.location}.`
                )
              }
              className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2"
            >
              <MessageSquare size={14} />
              Investigate with AI
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 4-Stage Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Investigation Lifecycle Timeline
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-slate-700">
              {(caseResult.investigationMilestones && caseResult.investigationMilestones.length > 0
                ? caseResult.investigationMilestones
                : [
                    'FIR Registered & Assigned Case Identifier',
                    `Dispatched to ${caseResult.assignedPoliceStation}`,
                    'Evidence Preservation & Digital Vector Indexing',
                    'Active Field Investigation in Progress',
                  ]
              ).map((milestone, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex-1">
                    <p className="text-sm text-slate-200 font-medium">{milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal and Description Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                <Gavel size={14} /> Applicable Legal Code
              </div>
              <p className="text-sm text-slate-200 font-medium">{caseResult.recommendedPenalCode}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                <Building size={14} /> Assigned Police Wing
              </div>
              <p className="text-sm text-slate-200">{caseResult.assignedPoliceStation}</p>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                <ShieldAlert size={14} /> Incident Case Summary
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{caseResult.aiTriageSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
