import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Briefcase,
  Fingerprint,
  Database,
  History,
  X,
  Plus,
  Server,
  Layers,
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
  stats: DatabaseStats | null;
  analytics: AnalyticsData | null;
  onSearchFocus?: (term: string) => void;
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
  stats,
  analytics,
  onSearchFocus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalRecords = stats?.totalRecords ?? analytics?.totalRecords ?? 106;
  const openCases = analytics?.openCases ?? 42;
  const underInvestigation = analytics?.underInvestigationCases ?? 31;
  const closedCases = analytics?.closedCases ?? 54;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearchFocus) {
      onSearchFocus(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      {/* CrimsonLogic Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#F9F9F9] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col h-full overflow-y-auto">
          {/* Logo & Branding */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ef4444] rounded-[12px] flex items-center justify-center text-white shadow-md relative shrink-0">
                <ShieldAlert size={22} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full pulse-red"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-bold text-base tracking-tight leading-tight font-sans">
                  CrimsonLogic
                </span>
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  AI Crime Intelligence
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Shortcut */}
          <form onSubmit={handleSearchSubmit} className="relative mb-5">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800 placeholder:text-gray-400 shadow-2xs"
            />
          </form>

          {/* Navigation */}
          <nav className="space-y-1">
            {/* Case Search (Main Chatbot) */}
            <button
              id="nav-case-search"
              onClick={() => {
                onSelectMode('chat');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-red-500 text-white shadow-xs shadow-red-500/20'
                  : 'text-slate-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase size={16} />
                <span>Case Search</span>
              </div>
              {activeMode === 'chat' && (
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              )}
            </button>

            {/* Evidence Analysis */}
            <button
              id="nav-evidence-analysis"
              onClick={() => {
                onSelectMode('chat');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'evidence'
                  ? 'bg-red-500 text-white shadow-xs shadow-red-500/20'
                  : 'text-slate-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Fingerprint size={16} />
                <span>Evidence Analysis</span>
              </div>
            </button>

            {/* Crime Records (Database Ledger) */}
            <button
              id="nav-crime-records"
              onClick={() => {
                onSelectMode('ledger');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'ledger'
                  ? 'bg-red-500 text-white shadow-xs shadow-red-500/20'
                  : 'text-slate-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database size={16} />
                <span>Crime Records</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                {totalRecords}
              </span>
            </button>

            {/* Chat History Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
                  <History size={11} />
                  Chat History
                </span>
                <button
                  onClick={onNewChat}
                  className="text-[11px] text-red-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  title="New chat session"
                >
                  <Plus size={12} /> New
                </button>
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSession(s.id);
                      onSelectMode('chat');
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors flex items-center justify-between cursor-pointer ${
                      activeSessionId === s.id && activeMode === 'chat'
                        ? 'bg-red-50 text-red-700 font-semibold border border-red-200'
                        : 'text-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate">{s.title || 'Inquiry Session'}</span>
                    <span className="text-[9px] font-mono text-gray-400 shrink-0 ml-1">
                      {s.messages.length} msgs
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Database Status Section */}
            <div className="pt-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 font-mono block mb-2.5">
                Database Status
              </span>
              <div className="space-y-2 px-1">
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-slate-600 font-medium">Crime Records</span>
                  <span className="font-mono font-bold text-slate-900 bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                    {totalRecords}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span className="text-slate-600 font-medium">Open Cases</span>
                  </div>
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border border-red-200">
                    {openCases}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    <span className="text-slate-600 font-medium">Under Investigation</span>
                  </div>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border border-orange-200">
                    {underInvestigation}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-slate-600 font-medium">Closed Cases</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border border-emerald-200">
                    {closedCases}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Bottom Card: New Investigation Action & Architecture badge */}
          <div className="mt-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                  <Server size={11} className="text-red-500" />
                  LangChain4j + pgvector
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                Natural-language conversational retrieval grounded in PostgreSQL.
              </p>
              <button
                id="btn-new-investigation"
                onClick={() => {
                  onSelectMode('chat');
                  onNewChat();
                  if (isOpenMobile) onCloseMobile();
                }}
                className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-xl hover:bg-red-500 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                New Investigation
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

