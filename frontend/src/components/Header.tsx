import React from 'react';
import { Menu, RotateCcw, Settings, Database, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  activeMode: string;
  onOpenMobileMenu: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  totalRecords?: number;
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  activeMode,
  onOpenMobileMenu,
  onClearChat,
  onOpenSettings,
  totalRecords = 106,
  isConnected = true,
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/80 sticky top-0">
      {/* Left: Mobile Menu & Engine Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-slate-700"
          id="btn-mobile-menu"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-slate-900 font-mono flex items-center gap-1.5">
              CRIMSONLOGIC
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200 font-mono">
                AI Crime Intelligence
              </span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="bg-[#f9fafb] border border-gray-200 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                RAG ENGINE ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Database Telemetry & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Database Connected Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-[11px] font-mono font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>DATABASE CONNECTED</span>
          <span className="text-emerald-800 font-bold">({totalRecords} Records)</span>
        </div>

        {/* Reset Chat Button */}
        {activeMode === 'chat' && (
          <button
            onClick={onClearChat}
            title="Reset conversation"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:border-red-300 transition-all cursor-pointer"
            id="btn-clear-chat"
          >
            <RotateCcw size={13} className="text-gray-500" />
            <span className="hidden sm:inline">Reset Query</span>
          </button>
        )}

        {/* Settings / Telemetry Modal */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-slate-600 shadow-2xs hover:text-slate-900 transition-colors cursor-pointer"
          title="Architecture & Telemetry"
          aria-label="Architecture and telemetry details"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};

