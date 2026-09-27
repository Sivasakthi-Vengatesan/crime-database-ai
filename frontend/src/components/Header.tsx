import React from 'react';
import { Menu, RotateCcw, Activity, ShieldAlert, Cpu, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  activeMode: string;
  onOpenMobileMenu: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  onOpenSos: () => void;
  totalRecords?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  activeMode,
  onOpenMobileMenu,
  onClearChat,
  onOpenSettings,
  onOpenSos,
  totalRecords = 105,
}) => {
  const getModeTitle = () => {
    switch (activeMode) {
      case 'complaint':
        return 'Citizen Intake // e-FIR Filing Hub';
      case 'tracker':
        return 'Investigation Timeline // Case Status Tracker';
      case 'analytics':
        return 'Threat Radar // Live Crime Intelligence';
      case 'ledger':
        return 'PostgreSQL Ledger // Case Database Explorer';
      default:
        return title || 'AI Crime Database Analyst';
    }
  };

  return (
    <header className="glass-header sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu & Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          id="btn-mobile-menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold hidden sm:inline">
              CRIME WATCH AI // AEGIS SENTINEL
            </span>
          </div>
          <h1 className="text-sm md:text-base font-bold font-display text-white truncate">
            {getModeTitle()}
          </h1>
        </div>
      </div>

      {/* Right Action Icons & Live Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Vector Engine Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-mono text-slate-300">
          <Cpu size={12} className="text-cyan-400" />
          <span>PGVECTOR: CONNECTED</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400">{totalRecords} RECORDS</span>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSos}
          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)]"
        >
          <ShieldAlert size={14} className="text-rose-400" />
          <span>Emergency SOS</span>
        </button>

        {activeMode === 'chat' && (
          <button
            onClick={onClearChat}
            title="Reset active chat session"
            className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-medium flex items-center gap-1.5"
            id="btn-clear-chat"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          title="Telemetry & Config"
          className="p-2 rounded-xl btn-secondary text-slate-400 hover:text-white"
          id="btn-settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
