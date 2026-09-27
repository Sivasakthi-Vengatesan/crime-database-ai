import React, { useState, useEffect } from 'react';
import {
  FileText,
  Database,
  Code,
  Check,
  RotateCw,
  Lock,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  Sparkles,
  Search,
  MessageSquare,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Evidence, CrimeRecordItem, DatabaseStats, AnalyticsData } from '../types/chat';
import { fetchCrimeRecordsApi, fetchDatabaseStats, fetchAnalyticsApi } from '../api/chatApi';

interface LivePreviewPanelProps {
  selectedEvidence?: Evidence | null;
  selectedCaseId?: string | null;
  onInvestigateInChat?: (query: string) => void;
  activeModeTab?: string;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  selectedEvidence,
  selectedCaseId,
  onInvestigateInChat,
  activeModeTab = 'dossier',
}) => {
  const [viewMode, setViewMode] = useState<'dossier' | 'ledger' | 'pipeline'>('dossier');
  const [records, setRecords] = useState<CrimeRecordItem[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync if activeModeTab changes
  useEffect(() => {
    if (activeModeTab === 'ledger') setViewMode('ledger');
    if (activeModeTab === 'analytics') setViewMode('dossier');
    if (activeModeTab === 'settings') setViewMode('pipeline');
  }, [activeModeTab]);

  useEffect(() => {
    fetchDatabaseStats().then(setStats);
    fetchAnalyticsApi().then(setAnalytics).catch(() => {});
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCrimeRecordsApi({
        location: selectedCity !== 'All Cities' ? selectedCity : undefined,
        search: searchTerm.trim() || undefined,
      });
      setRecords(data);
    } catch (e) {
      console.warn('Could not load records', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [selectedCity]);

  // Active Dossier Record
  const activeCase: Evidence = selectedEvidence || {
    caseId: selectedCaseId || 'CASE-1092',
    crimeType: 'Vehicle Theft',
    location: 'Chennai',
    date: '2026-03-31',
    status: 'Open',
    severity: 'Low',
    description: 'Auto rickshaw stolen from outside a hospital entrance while driver accompanied a patient.',
    victimAge: 46,
    suspectAge: null,
    similarityScore: 0.656,
  };

  // City Distribution mini chart
  const cityBars = [
    { city: 'Chennai', count: 18, isPeak: true },
    { city: 'Mumbai', count: 15 },
    { city: 'Delhi', count: 14 },
    { city: 'Bengaluru', count: 12 },
    { city: 'Hyderabad', count: 11 },
    { city: 'Kolkata', count: 10 },
    { city: 'Pune', count: 9 },
    { city: 'Kochi', count: 8 },
  ];

  const pipelineCode = `-- PostgreSQL 16 + pgvector Schema & Hybrid Query Pipeline

-- 1. Create pgvector Extension and Index
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE crime_records (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    victim_age INT,
    suspect_age INT,
    status VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    embedding vector(384)
);

CREATE INDEX idx_crime_records_embedding_hnsw 
ON crime_records USING hnsw (embedding vector_cosine_ops);

-- 2. Hybrid Filter + Cosine Similarity Vector Retrieval Query
SELECT 
    case_id, crime_type, location, incident_date, status, severity, description,
    1 - (embedding <=> :queryEmbedding) AS similarity_score
FROM crime_records
WHERE location ILIKE :cityFilter
ORDER BY embedding <=> :queryEmbedding ASC
LIMIT 8;`;

  return (
    <div className="flex-1 h-screen bg-[#f1f5f1] flex flex-col min-w-0 overflow-hidden relative select-none">
      {/* Sticky Toolbar */}
      <header className="sticky top-0 z-20 bg-[#f1f5f1]/85 backdrop-blur-md border-b border-[#e4e9e4] px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Segmented Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-[#eaefe9] p-1 rounded-xl flex items-center gap-1 border border-[#e4e9e4]">
            <button
              onClick={() => setViewMode('dossier')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'dossier'
                  ? 'bg-[#0ea968] text-white shadow-xs font-semibold'
                  : 'text-[#5b655e] hover:text-[#131815]'
              }`}
            >
              <FileText size={14} />
              <span>Evidence Dossier</span>
            </button>

            <button
              onClick={() => setViewMode('ledger')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'ledger'
                  ? 'bg-[#0ea968] text-white shadow-xs font-semibold'
                  : 'text-[#5b655e] hover:text-[#131815]'
              }`}
            >
              <Database size={14} />
              <span>Database Ledger</span>
            </button>

            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-[#0ea968] text-white shadow-xs font-semibold'
                  : 'text-[#5b655e] hover:text-[#131815]'
              }`}
            >
              <Code size={14} />
              <span>RAG & SQL</span>
            </button>
          </div>

          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e7f4ec] border border-[#cde7d7] text-[#0b8a54] font-mono text-[11px] font-semibold">
            <Check size={12} strokeWidth={2.8} />
            <span>POSTGRESQL · {stats?.totalRecords || 105} CASES SYNCED</span>
          </div>
        </div>

        {/* Right: Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onInvestigateInChat) {
                onInvestigateInChat(`Show all open high severity cases in ${activeCase.location}`);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#0ea968] text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-emerald-btn hover:bg-[#0b8a54] transition-all cursor-pointer"
          >
            <MessageSquare size={13} />
            <span>Query in Chat</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        {viewMode === 'dossier' && (
          /* Evidence Dossier Mode */
          <div className="w-full max-w-[1000px] bg-white rounded-[16px] border border-[#e4e9e4] shadow-preview-frame overflow-hidden animate-fadeIn">
            {/* Dossier Browser Bar */}
            <div className="bg-[#f7f9f7] border-b border-[#e4e9e4] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>

              <div className="px-4 py-1 rounded-full bg-white border border-[#e4e9e4] text-[11px] font-mono text-[#5b655e] flex items-center gap-1.5 shadow-2xs">
                <Lock size={11} className="text-[#0ea968]" />
                <span>crimsonlogic.db/cases/{activeCase.caseId}</span>
              </div>

              <div className="text-[10.5px] font-mono text-[#0b8a54] font-semibold">
                VERIFIED EVIDENCE
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-6 sm:p-8 space-y-6 select-text">
              {/* Header Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e4e9e4]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#131815] text-white">
                      {activeCase.caseId}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        activeCase.severity === 'Critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : activeCase.severity === 'High'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-[#e7f4ec] text-[#0b8a54] border-[#cde7d7]'
                      }`}
                    >
                      {activeCase.severity} Severity
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gray-100 text-slate-700 border border-gray-200">
                      {activeCase.status}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-[#131815]">
                    {activeCase.crimeType} in {activeCase.location}
                  </h2>
                </div>

                {activeCase.similarityScore && (
                  <div className="text-right">
                    <span className="font-mono text-xs text-[#5b655e] block">Dense Cosine Score</span>
                    <span className="font-mono text-xl font-bold text-[#0ea968] flex items-center justify-end gap-1">
                      <Sparkles size={16} />
                      {activeCase.similarityScore}
                    </span>
                  </div>
                )}
              </div>

              {/* Modus Operandi & Incident Narrative */}
              <div className="p-4 rounded-xl bg-[#fcfdfc] border border-[#e4e9e4] space-y-1.5">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#0ea968] font-bold block">
                  Incident Statement & Modus Operandi
                </span>
                <p className="text-sm text-[#131815] leading-relaxed font-sans font-normal">
                  {activeCase.description}
                </p>
              </div>

              {/* Demographics & Meta Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4]">
                  <span className="text-[#5b655e] font-mono text-[10px] uppercase block mb-0.5">Location</span>
                  <span className="font-semibold text-[#131815] flex items-center gap-1">
                    <MapPin size={12} className="text-[#0ea968]" />
                    {activeCase.location}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4]">
                  <span className="text-[#5b655e] font-mono text-[10px] uppercase block mb-0.5">Incident Date</span>
                  <span className="font-semibold text-[#131815] flex items-center gap-1 font-mono">
                    <Calendar size={12} className="text-[#5b655e]" />
                    {activeCase.date}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4]">
                  <span className="text-[#5b655e] font-mono text-[10px] uppercase block mb-0.5">Victim Age</span>
                  <span className="font-semibold text-[#131815] font-mono">
                    {activeCase.victimAge ? `${activeCase.victimAge} years` : 'Unrecorded'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4]">
                  <span className="text-[#5b655e] font-mono text-[10px] uppercase block mb-0.5">Suspect Age</span>
                  <span className="font-semibold text-[#131815] font-mono">
                    {activeCase.suspectAge ? `${activeCase.suspectAge} years` : 'Unknown / Unidentified'}
                  </span>
                </div>
              </div>

              {/* City Hotspot Distribution Bar Chart */}
              <div className="rounded-xl border border-[#e4e9e4] p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-[#131815]">
                    Jurisdiction Crime Incident Distribution (105 Synthetic Records)
                  </span>
                  <span className="font-mono text-[10px] text-[#0b8a54] font-semibold">
                    Live Vector Store
                  </span>
                </div>

                {/* 8-bar mini chart */}
                <div className="h-24 flex items-end justify-between gap-2 pt-2 px-1">
                  {cityBars.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[#131815] text-white text-[9px] font-mono px-1 rounded shadow-sm pointer-events-none">
                        {bar.count} cases
                      </div>
                      <div
                        style={{ height: `${(bar.count / 18) * 100}%` }}
                        className={`w-full rounded-t transition-all ${
                          bar.city === activeCase.location
                            ? 'bg-[#0ea968] shadow-emerald-btn'
                            : 'bg-[#cde7d7] hover:bg-[#a8dcbc]'
                        }`}
                      />
                      <span className="font-mono text-[9px] text-[#5b655e] truncate w-full text-center">
                        {bar.city.slice(0, 4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'ledger' && (
          /* Database Ledger Mode */
          <div className="w-full max-w-[1000px] bg-white rounded-[16px] border border-[#e4e9e4] shadow-sm overflow-hidden animate-fadeIn space-y-4 p-5">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b655e]" />
                <input
                  type="text"
                  placeholder="Search Case ID, crime keyword, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadRecords()}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4] text-xs text-[#131815] focus:outline-none focus:ring-1 focus:ring-[#0ea968]"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#f7f9f7] border border-[#e4e9e4] text-xs text-[#131815] focus:outline-none"
              >
                <option value="All Cities">All Cities (10)</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Kochi">Kochi</option>
              </select>

              <button
                onClick={loadRecords}
                className="px-3 py-1.5 rounded-xl bg-[#0ea968] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-[#e4e9e4] overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f7f9f7] border-b border-[#e4e9e4] font-mono text-[10.5px] uppercase tracking-wider text-[#5b655e]">
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e9e4] font-sans">
                  {records.map((r) => (
                    <tr key={r.caseId} className="hover:bg-[#e7f4ec]/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#131815]">{r.caseId}</td>
                      <td className="p-3 font-semibold text-[#131815]">{r.crimeType}</td>
                      <td className="p-3 text-[#5b655e]">{r.location}</td>
                      <td className="p-3 font-mono text-[#5b655e]">{r.incidentDate}</td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#e7f4ec] text-[#0b8a54]">
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-slate-700">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (onInvestigateInChat) {
                              onInvestigateInChat(`Analyze case ${r.caseId} in ${r.location}`);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#e7f4ec] hover:bg-[#0ea968] text-[#0b8a54] hover:text-white font-mono text-[10.5px] font-bold transition-all cursor-pointer"
                        >
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

        {viewMode === 'pipeline' && (
          /* RAG & SQL Pipeline Mode */
          <div className="w-full max-w-[900px] bg-white rounded-[16px] border border-[#e4e9e4] shadow-sm overflow-hidden animate-fadeIn">
            <div className="bg-[#f7f9f7] border-b border-[#e4e9e4] px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#131815]">
                LangChain4j + PostgreSQL pgvector Pipeline
              </span>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(pipelineCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-2.5 py-1 rounded-md text-xs font-sans text-[#5b655e] hover:text-[#131815] hover:bg-white border border-transparent hover:border-[#e4e9e4] transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check size={13} className="text-[#0ea968]" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#131815] text-[#e7f4ec] font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>
                <code>{pipelineCode}</code>
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
