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

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('closed') || s.includes('resolved')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('investigation')) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 overflow-y-auto pb-24 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
          <Clock size={13} />
          Investigation Lifecycle Tracker
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Track e-FIR & Forensic Status
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Look up active FIR tracking numbers or indexed case IDs to inspect investigation milestones, forensic dispatches, and assigned police divisions.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="p-5 rounded-[24px] bg-white border border-gray-200 shadow-sm mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Case ID or FIR (e.g. CASE-1001, CASE-1015, or FIR-2026-CHN-...)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            {isLoading ? 'Searching Registry...' : 'Track Investigation'}
          </button>
        </form>

        {/* Quick Test Links */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="font-mono text-[11px] text-gray-400">Quick Test Cases:</span>
          {['CASE-1001', 'CASE-1015', 'CASE-1051', 'CASE-1092'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setTrackingNumber(sample);
                handleSearch(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-mono text-xs border border-gray-200 transition-colors font-semibold"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 mb-6">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Case Details Card */}
      {caseResult && (
        <div className="p-6 md:p-8 rounded-[28px] bg-white border border-gray-200 shadow-md space-y-6 animate-fadeIn">
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-slate-800">{caseResult.caseId}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase border ${getStatusBadgeClass(
                    caseResult.status
                  )}`}
                >
                  {caseResult.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-slate-700 text-xs font-semibold">
                  {caseResult.severity} Severity
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-4 font-medium">
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
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20"
            >
              <MessageSquare size={14} />
              Investigate with AI
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 4-Stage Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-red-600 font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Investigation Lifecycle Timeline
            </h4>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-red-500 before:via-orange-400 before:to-gray-300">
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
                  <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-red-500 flex items-center justify-center shadow-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex-1">
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold">{milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal and Description Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-mono text-red-600 font-bold uppercase flex items-center gap-1.5">
                <Gavel size={14} /> Applicable Statutory Code
              </div>
              <p className="text-sm text-slate-800 font-semibold">{caseResult.recommendedPenalCode}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-mono text-slate-700 font-bold uppercase flex items-center gap-1.5">
                <Building size={14} /> Assigned Police Division
              </div>
              <p className="text-sm text-slate-800">{caseResult.assignedPoliceStation}</p>
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-mono text-slate-700 font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert size={14} /> Incident Case Statement
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{caseResult.aiTriageSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
