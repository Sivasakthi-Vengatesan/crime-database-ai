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
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('investigation')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 overflow-y-auto pb-24 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Database size={13} />
            PostgreSQL Investigation Ledger
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Case Records Ledger & Database Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, filter, and inspect verified criminal records indexed in the central PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-700 bg-white border border-gray-200 px-3 py-1.5 rounded-xl font-bold shadow-xs">
            {records.length} Records Loaded
          </span>
          <button
            onClick={loadRecords}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Case ID, crime keyword, description, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-gray-100">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
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
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
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
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
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
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw size={24} className="animate-spin text-red-500 mx-auto mb-2" />
          <p className="text-xs font-mono">Fetching indexed records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 rounded-[24px] bg-white border border-gray-200 text-center text-gray-500 space-y-2">
          <AlertTriangle size={24} className="text-orange-500 mx-auto" />
          <p className="text-sm font-medium">No crime records match the current filters or search query.</p>
        </div>
      ) : (
        <div className="rounded-[28px] bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-mono uppercase tracking-wider text-gray-500">
                  <th className="p-4 pl-6">Case ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-slate-700 font-sans">
                {records.map((r) => (
                  <tr
                    key={r.caseId}
                    className="hover:bg-red-50/40 transition-colors cursor-pointer"
                    onClick={() => setActiveRecordDetail(r)}
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-800">{r.caseId}</td>
                    <td className="p-4 font-bold text-slate-800">{r.crimeType}</td>
                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-red-500" />
                        {r.location}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-[11px]">{r.incidentDate}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getSeverityBadge(
                          r.severity
                        )}`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          onInvestigateInChat(
                            r.caseId,
                            `Investigate case ${r.caseId} involving ${r.crimeType} in ${r.location}. Provide full case breakdown and suspect profile.`
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-500 text-red-600 hover:text-white text-[11px] font-bold border border-red-200 hover:border-red-500 transition-all inline-flex items-center gap-1 shadow-xs"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveRecordDetail(null)}
        >
          <div
            className="p-6 md:p-8 w-full max-w-2xl space-y-5 bg-white rounded-[28px] border border-gray-200 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-slate-800">
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
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 font-mono uppercase block mb-1">Crime Category</span>
                <span className="font-bold text-slate-800 text-sm">{activeRecordDetail.crimeType}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 font-mono uppercase block mb-1">City Jurisdiction</span>
                <span className="font-bold text-slate-800 text-sm">{activeRecordDetail.location}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 font-mono uppercase block mb-1">Incident Date</span>
                <span className="font-bold text-slate-800 text-sm">{activeRecordDetail.incidentDate}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 font-mono uppercase block mb-1">Severity Rating</span>
                <span className="font-bold text-slate-800 text-sm">{activeRecordDetail.severity}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-xs font-mono uppercase text-red-600 font-bold block">
                Incident Statement & Modus Operandi
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {activeRecordDetail.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 font-mono">
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
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/25"
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
