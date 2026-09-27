import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Briefcase,
  Fingerprint,
  Users,
  FileText,
  FilePlus2,
  Clock,
  Sparkles,
  PhoneCall,
  X,
  Database,
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

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NAV_ITEMS = [
    {
      id: 'chat',
      label: 'Case Search & AI',
      icon: Briefcase,
      tooltipTitle: 'Case Discovery',
      tooltipDesc: 'Access global investigation records with semantic RAG lookup.',
      hasPulse: true,
    },
    {
      id: 'complaint',
      label: 'Register e-FIR',
      icon: FilePlus2,
      tooltipTitle: 'Citizen & Officer Intake',
      tooltipDesc: 'Submit incident report with real-time AI triage and vector indexing.',
      hasPulse: false,
    },
    {
      id: 'tracker',
      label: 'Case & Evidence Tracker',
      icon: Fingerprint,
      tooltipTitle: 'Investigation Timeline',
      tooltipDesc: 'Cross-reference case milestones, forensics, and status updates.',
      hasPulse: false,
    },
    {
      id: 'analytics',
      label: 'Suspect & Threat Radar',
      icon: Users,
      tooltipTitle: 'Target Profiling & Density',
      tooltipDesc: 'Real-time city threat heatmap, crime categories, and active watchlist.',
      hasPulse: false,
    },
    {
      id: 'ledger',
      label: 'Reports & Ledger',
      icon: FileText,
      tooltipTitle: 'Database Repository',
      tooltipDesc: 'Explore 105+ PostgreSQL records with instant filters.',
      hasPulse: false,
    },
  ];

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
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ef4444] rounded-[12px] flex items-center justify-center text-white shadow-lg relative shrink-0">
                <ShieldAlert size={22} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full pulse-red"></span>
                </span>
              </div>
              <div>
                <span className="text-slate-800 font-bold text-lg tracking-tight block">
                  CrimsonLogic
                </span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block font-mono">
                  Criminal Justice AI
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search investigations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800 placeholder:text-gray-400"
            />
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 mb-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeMode === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      onSelectMode(item.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/25 font-bold'
                        : 'text-slate-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={isActive ? 'text-white' : 'text-slate-500'}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.hasPulse && !isActive && (
                      <span className="w-2 h-2 bg-red-500 rounded-full pulse-red"></span>
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  <div className="hidden lg:block absolute left-full ml-4 top-1/2 -translate-y-1/2 dark-glass px-4 py-3 rounded-2xl w-48 shadow-2xl z-[60] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                    <p className="text-white text-xs font-bold mb-0.5">{item.tooltipTitle}</p>
                    <p className="text-gray-300 text-[10px] leading-relaxed">{item.tooltipDesc}</p>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Live Case Updates Section */}
          <div className="pt-4 pb-4 border-t border-gray-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3">
              Live Case Updates
            </span>
            <div className="mt-3 space-y-2 px-1">
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span className="text-[11px] font-semibold text-slate-700">Active Cases</span>
                </div>
                <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  <span className="text-[11px] font-semibold text-slate-700">Pending Review</span>
                </div>
                <span className="bg-orange-50 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  <span className="text-[11px] font-semibold text-slate-700">Closed Resolved</span>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {closedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency SOS Bar */}
          <div className="mb-4">
            <button
              onClick={onOpenSos}
              className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 text-xs font-bold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <PhoneCall size={14} className="text-red-500 animate-pulse" />
                <span>Emergency SOS (112 / 1930)</span>
              </div>
              <span className="text-[9px] bg-red-500 text-white font-mono px-1.5 py-0.2 rounded font-bold">
                24/7
              </span>
            </button>
          </div>

          {/* Upgrade Card / Advanced RAG */}
          <div className="mt-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-500 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                  Active
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {stats?.totalRecords || 106} cases
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">
                LangChain4j + pgvector
              </p>
              <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                Dense 384-dim semantic ranking & grounded synthesis enabled.
              </p>
              <button
                onClick={() => {
                  onSelectMode('chat');
                  onNewChat();
                  if (isOpenMobile) onCloseMobile();
                }}
                className="w-full bg-white text-red-500 text-[11px] font-bold py-2 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
