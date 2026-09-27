import React from 'react';
import {
  Plus,
  MessageSquare,
  Database,
  BarChart3,
  Settings,
  ShieldAlert,
} from 'lucide-react';

interface IconRailProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNewBuild: () => void;
  totalRecords?: number;
}

export const IconRail: React.FC<IconRailProps> = ({
  activeTab,
  onSelectTab,
  onNewBuild,
  totalRecords = 105,
}) => {
  return (
    <aside className="w-16 h-screen bg-[#eef1ed] border-r border-[#e4e9e4] flex flex-col items-center py-4 shrink-0 select-none z-30 justify-between">
      {/* Top: Brand Mark & Main Nav Stack */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Emerald Shield Brand Mark */}
        <button
          onClick={onNewBuild}
          className="w-10 h-10 rounded-xl bg-[#0ea968] text-white flex items-center justify-center shadow-emerald-btn hover:bg-[#0b8a54] transition-all cursor-pointer group"
          title="CrimsonLogic Crime Database AI"
          aria-label="CrimsonLogic AI"
        >
          <ShieldAlert className="w-5 h-5 transition-transform group-hover:scale-105" />
        </button>

        {/* Divider hairline */}
        <div className="w-8 h-[1px] bg-[#e4e9e4] my-1" />

        {/* Stack of 40px icon buttons */}
        <div className="flex flex-col items-center gap-2 w-full px-2">
          {/* New Case Investigation */}
          <button
            onClick={onNewBuild}
            className="w-10 h-10 rounded-xl text-[#5b655e] hover:text-[#131815] hover:bg-[#e4e9e4]/60 flex items-center justify-center transition-all cursor-pointer"
            title="New Case Inquiry (Cmd+N)"
            aria-label="New Inquiry"
          >
            <Plus size={19} strokeWidth={2.2} />
          </button>

          {/* AI Chat (Active Emerald Pill) */}
          <button
            onClick={() => onSelectTab('chat')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#e7f4ec] border border-[#cde7d7] text-[#0ea968] shadow-xs'
                : 'text-[#5b655e] hover:text-[#131815] hover:bg-[#e4e9e4]/60'
            }`}
            title="Conversational RAG Chat"
            aria-label="AI Chat"
          >
            <MessageSquare size={18} strokeWidth={2.2} />
          </button>

          {/* PostgreSQL Records Ledger */}
          <button
            onClick={() => onSelectTab('ledger')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-[#e7f4ec] border border-[#cde7d7] text-[#0ea968] shadow-xs'
                : 'text-[#5b655e] hover:text-[#131815] hover:bg-[#e4e9e4]/60'
            }`}
            title="Database Records Ledger"
            aria-label="Database Ledger"
          >
            <Database size={18} strokeWidth={2.2} />
          </button>

          {/* Patterns & Hotspots */}
          <button
            onClick={() => onSelectTab('analytics')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#e7f4ec] border border-[#cde7d7] text-[#0ea968] shadow-xs'
                : 'text-[#5b655e] hover:text-[#131815] hover:bg-[#e4e9e4]/60'
            }`}
            title="Crime Radar & Hotspot Analytics"
            aria-label="Crime Analytics"
          >
            <BarChart3 size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Bottom: Settings & Database Case Count Avatar */}
      <div className="flex flex-col items-center gap-3 w-full pb-2">
        <button
          onClick={() => onSelectTab('settings')}
          className="w-10 h-10 rounded-xl text-[#5b655e] hover:text-[#131815] hover:bg-[#e4e9e4]/60 flex items-center justify-center transition-all cursor-pointer"
          title="Architecture & Telemetry"
          aria-label="Architecture and Telemetry"
        >
          <Settings size={18} strokeWidth={2} />
        </button>

        {/* Database records count avatar */}
        <div
          onClick={() => onSelectTab('ledger')}
          className="w-[34px] h-[34px] rounded-full bg-[#dcf1e3] border border-[#cde7d7] text-[#0b8a54] font-mono font-bold text-[10.5px] flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#0ea968]/30 transition-all"
          title={`PostgreSQL: ${totalRecords} Indexed Crime Records`}
        >
          {totalRecords}
        </div>
      </div>
    </aside>
  );
};
