import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Shield,
  FilePlus2,
  Clock,
  BarChart3,
  Database,
  PhoneCall,
  Sparkles,
  ChevronRight,
  X,
  Radio,
} from 'lucide-react';
import { ConversationSession, DatabaseStats } from '../types/chat';

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
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const NAV_ITEMS = [
    {
      id: 'chat',
      label: 'AI Crime Analyst',
      icon: MessageSquare,
      badge: 'LLM RAG',
      color: '#3b82f6',
    },
    {
      id: 'complaint',
      label: 'Register e-FIR / Complaint',
      icon: FilePlus2,
      badge: 'NEW',
      color: '#06b6d4',
    },
    {
      id: 'tracker',
      label: 'Track Case Status',
      icon: Clock,
      badge: 'LIVE',
      color: '#6366f1',
    },
    {
      id: 'analytics',
      label: 'Crime Threat Radar',
      icon: BarChart3,
      badge: 'METRICS',
      color: '#f59e0b',
    },
    {
      id: 'ledger',
      label: 'Case Records Ledger',
      icon: Database,
      badge: '105+',
      color: '#10b981',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090d16] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Shield size={20} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold font-display text-white tracking-wide">
                  AEGIS CRIME AI
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider uppercase block">
                Law Enforcement Hub
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Command Navigation */}
        <div className="p-3 border-b border-white/5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-semibold">
            Command Center
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectMode(item.id);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-white border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    style={{ color: isActive ? '#06b6d4' : item.color }}
                  />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-cyan-400 text-black font-extrabold'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI Chat History Section */}
        <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3">
          {/* New Chat Button */}
          <button
            onClick={() => {
              onSelectMode('chat');
              onNewChat();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Plus size={15} />
            <span>New Investigation Query</span>
          </button>

          {/* Search Chats */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search past sessions..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 font-semibold">
              Recent Inquiries
            </div>
            {filteredSessions.map((session) => {
              const isSessionActive =
                activeMode === 'chat' && session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    onSelectMode('chat');
                    onSelectSession(session.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${
                    isSessionActive
                      ? 'bg-blue-500/15 border border-blue-500/30 text-white font-medium'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare
                      size={14}
                      className={isSessionActive ? 'text-cyan-400' : 'text-slate-500'}
                    />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <ChevronRight
                    size={13}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Emergency SOS & Stats Banner */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-slate-950/80">
          {/* Quick SOS Bar */}
          <button
            onClick={onOpenSos}
            className="w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <PhoneCall size={14} className="text-rose-400 animate-pulse" />
              <span>National Helpline (112 / 1930)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
              SOS
            </span>
          </button>

          {/* Database Live Telemetry */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="radar-blip"></span>
              <span>pgvector Embeddings</span>
            </div>
            <span className="text-cyan-400 font-bold">
              {stats?.totalRecords || 105} Records
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
