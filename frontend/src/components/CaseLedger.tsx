import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { CrimeRecordItem } from '../types/chat';
import { fetchCrimeRecordsApi } from '../api/chatApi';

interface CaseLedgerProps {
  onInvestigateInChat: (caseId: string, summary: string) => void;
}

const CITIES = [
  'All Cities',
  'Chennai',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

const CRIME_TYPES = [
  'All Types',
  'Theft',
  'Mobile Phone Theft',
  'Vehicle Theft',
  'Cyber Crime',
  'Robbery',
  'Burglary',
  'Assault',
  'Harassment',
  'Missing Person',
  'Fraud',
];

const STATUSES = ['All Statuses', 'Open', 'Under Investigation', 'Closed'];
const SEVERITIES = ['All Severities', 'Critical', 'High', 'Medium', 'Low'];

export const CaseLedger: React.FC<CaseLedgerProps> = ({ onInvestigateInChat }) => {
  const [records, setRecords] = useState<CrimeRecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRecordDetail, setActiveRecordDetail] = useState<CrimeRecordItem | null>(null);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCrimeRecordsApi({
        location: selectedCity !== 'All Cities' ? selectedCity : undefined,
        crimeType: selectedType !== 'All Types' ? selectedType : undefined,
        status: selectedStatus !== 'All Statuses' ? selectedStatus : undefined,
        severity: selectedSeverity !== 'All Severities' ? selectedSeverity : undefined,
        search: searchTerm.trim() || undefined,
      });
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [selectedCity, selectedType, selectedStatus, selectedSeverity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecords();
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'closed') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (s.includes('investigation')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Database size={13} />
            PostgreSQL & pgvector Ledger
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
            Case Records Ledger & Database Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and query the entire crime database repository. Filter by city, severity, or crime classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
            {records.length} Records Loaded
          </span>
          <button
            onClick={loadRecords}
            className="px-3 py-1.5 rounded-lg btn-secondary text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="cyber-panel p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Case ID, keyword, description, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {CRIME_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table / Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw size={24} className="animate-spin text-cyan-400 mx-auto mb-2" />
          <p className="text-xs font-mono">Fetching indexed records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="cyber-panel p-12 text-center text-slate-400 space-y-2">
          <AlertTriangle size={24} className="text-amber-400 mx-auto" />
          <p className="text-sm">No crime records match the current filters or search query.</p>
        </div>
      ) : (
        <div className="cyber-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="p-3.5 pl-5">Case ID</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300 font-sans">
                {records.map((r) => (
                  <tr
                    key={r.caseId}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => setActiveRecordDetail(r)}
                  >
                    <td className="p-3.5 pl-5 font-mono font-bold text-cyan-400">{r.caseId}</td>
                    <td className="p-3.5 font-medium text-white">{r.crimeType}</td>
                    <td className="p-3.5 text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-500" />
                        {r.location}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{r.incidentDate}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getSeverityBadge(
                          r.severity
                        )}`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          onInvestigateInChat(
                            r.caseId,
                            `Investigate case ${r.caseId} involving ${r.crimeType} in ${r.location}. Provide full case breakdown and suspect profile.`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 text-[11px] font-medium border border-cyan-500/30 transition-all inline-flex items-center gap-1"
                        title="Analyze in AI Chat"
                      >
                        <MessageSquare size={12} />
                        Ask AI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      {activeRecordDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveRecordDetail(null)}
        >
          <div
            className="cyber-panel p-6 w-full max-w-2xl space-y-5 bg-slate-900/95 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-cyan-400">
                  {activeRecordDetail.caseId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${getStatusBadge(
                    activeRecordDetail.status
                  )}`}
                >
                  {activeRecordDetail.status}
                </span>
              </div>
              <button
                onClick={() => setActiveRecordDetail(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 font-mono uppercase block mb-1">Crime Type</span>
                <span className="font-semibold text-white text-sm">{activeRecordDetail.crimeType}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 font-mono uppercase block mb-1">Jurisdiction City</span>
                <span className="font-semibold text-white text-sm">{activeRecordDetail.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 font-mono uppercase block mb-1">Incident Date</span>
                <span className="font-semibold text-white text-sm">{activeRecordDetail.incidentDate}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 font-mono uppercase block mb-1">Assessed Severity</span>
                <span className="font-semibold text-white text-sm">{activeRecordDetail.severity}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold block">
                Incident Statement & Modus Operandi
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeRecordDetail.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                {activeRecordDetail.victimAge && `Victim Age: ${activeRecordDetail.victimAge} `}
                {activeRecordDetail.suspectAge && `| Suspect Age: ${activeRecordDetail.suspectAge}`}
              </div>

              <button
                onClick={() => {
                  const id = activeRecordDetail.caseId;
                  const desc = activeRecordDetail.description;
                  setActiveRecordDetail(null);
                  onInvestigateInChat(id, `Analyze case ${id} and suggest forensic leads: ${desc}`);
                }}
                className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2"
              >
                <MessageSquare size={14} />
                Investigate in AI Chat
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
