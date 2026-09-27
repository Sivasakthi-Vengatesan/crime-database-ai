import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Briefcase,
  Fingerprint,
  Users,
  FileText,
  FilePlus2,
  X,
  PhoneCall,
  Plus,
} from 'lucide-react';
import { ConversationSession, DatabaseStats, AnalyticsData } from '../types/chat';

interface SidebarProps {
  sessions: ConversationSession[];
  activeSessionId: string;
  activeMode: string;
  onSelectSession: (id: string) => void;
  onSelectMode: (mode: string) => void;
  onNewChat: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSos: () => void;
  stats: DatabaseStats | null;
  analytics: AnalyticsData | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  activeMode,
  onSelectSession,
  onSelectMode,
  onNewChat,
  isOpenMobile,
  onCloseMobile,
  onOpenSos,
  stats,
  analytics,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const activeCount = analytics ? analytics.openCases + analytics.underInvestigationCases : 12;
  const pendingCount = analytics ? analytics.underInvestigationCases : 48;
  const closedCount = analytics ? analytics.closedCases : 8;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      {/* CrimsonLogic Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[288px] bg-[#F9F9F9] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ef4444] rounded-[12px] flex items-center justify-center text-white shadow-lg relative shrink-0">
                <ShieldAlert size={22} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full pulse-red"></span>
                </span>
              </div>
              <span className="text-[var(--slate-800)] font-bold text-lg tracking-tight">
                CrimsonLogic
              </span>
            </div>

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800"
            />
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {/* Case Search */}
            <div className="relative group has-tooltip">
              <a
                id="nav-case-search"
                href="#case-search"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMode('chat');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeMode === 'chat'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                    : 'text-[var(--slate-800)] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={18} />
                  <span>Case Search</span>
                </div>
                {activeMode !== 'chat' && (
                  <span className="w-2 h-2 bg-red-500 rounded-full pulse-red"></span>
                )}
              </a>
              <div className="tooltip absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] pointer-events-none">
                <p className="text-white text-xs font-bold mb-1">Case Discovery</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Access global investigation records with semantic RAG lookup.
                </p>
              </div>
            </div>

            {/* Register e-FIR */}
            <div className="relative group has-tooltip">
              <a
                id="nav-complaint"
                href="#register-efir"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMode('complaint');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeMode === 'complaint'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                    : 'text-[var(--slate-800)] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FilePlus2 size={18} />
                  <span>Register e-FIR</span>
                </div>
                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded font-mono">
                  NEW
                </span>
              </a>
              <div className="tooltip absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] pointer-events-none">
                <p className="text-white text-xs font-bold mb-1">Citizen & Officer Intake</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Submit incident reports with live AI threat assessment and vector indexing.
                </p>
              </div>
            </div>

            {/* Evidence Analysis / Case Tracker */}
            <div className="relative group has-tooltip">
              <a
                id="nav-evidence"
                href="#evidence-analysis"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMode('tracker');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeMode === 'tracker'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                    : 'text-[var(--slate-800)] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Fingerprint size={18} />
                  <span>Evidence Analysis</span>
                </div>
              </a>
              <div className="tooltip absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] pointer-events-none">
                <p className="text-white text-xs font-bold mb-1">Investigation Timeline</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Track 5-stage case forensics, evidence milestones, and station assignments.
                </p>
              </div>
            </div>

            {/* Suspect Database / Radar */}
            <div className="relative group has-tooltip">
              <a
                id="nav-suspects"
                href="#suspect-database"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMode('analytics');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeMode === 'analytics'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                    : 'text-[var(--slate-800)] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Suspect Database</span>
                </div>
              </a>
              <div className="tooltip absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] pointer-events-none">
                <p className="text-white text-xs font-bold mb-1">Target Profiling</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Cross-reference city hotspot patterns with active warrant registries.
                </p>
              </div>
            </div>

            {/* Reports */}
            <div className="relative group has-tooltip">
              <a
                id="nav-reports"
                href="#reports"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMode('ledger');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeMode === 'ledger'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                    : 'text-[var(--slate-800)] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Reports</span>
                </div>
              </a>
              <div className="tooltip absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] pointer-events-none">
                <p className="text-white text-xs font-bold mb-1">Database Repository</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Browse and export verified records from the PostgreSQL database.
                </p>
              </div>
            </div>

            {/* Live Case Updates Section */}
            <div className="pt-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
                Live Case Updates
              </span>
              <div className="mt-4 space-y-3 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span className="text-[11px] font-semibold text-slate-600">Active Cases</span>
                  </div>
                  <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {activeCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    <span className="text-[11px] font-semibold text-slate-600">Pending Review</span>
                  </div>
                  <span className="bg-orange-50 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {pendingCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    <span className="text-[11px] font-semibold text-slate-600">Closed Today</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {closedCount < 10 ? `0${closedCount}` : closedCount}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Emergency SOS Bar */}
          <div className="my-4">
            <button
              onClick={onOpenSos}
              className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <PhoneCall size={14} className="text-red-500 animate-pulse" />
                <span>Emergency SOS (112)</span>
              </div>
              <span className="text-[9px] bg-red-500 text-white font-mono px-1.5 py-0.5 rounded font-bold">
                24/7
              </span>
            </button>
          </div>

          {/* Upgrade Card */}
          <div className="mt-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-500 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                  Pro
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {stats?.totalRecords || 106} cases
                </span>
              </div>
              <p className="text-xs font-semibold text-[var(--slate-800)] mb-1">Unlock Advanced RAG</p>
              <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                Deep cross-referencing for cold cases and complex patterns with pgvector.
              </p>
              <button
                id="upgrade-btn"
                onClick={() => {
                  onSelectMode('chat');
                  onNewChat();
                  if (isOpenMobile) onCloseMobile();
                }}
                className="w-full bg-white text-red-500 text-[12px] font-bold py-2 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus size={13} />
                New Investigation
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
