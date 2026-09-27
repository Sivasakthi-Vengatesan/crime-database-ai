import React from 'react';
import { Menu, RotateCcw, ShieldAlert, Settings, PhoneCall } from 'lucide-react';

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
  totalRecords = 106,
}) => {
  const getModeLabel = () => {
    switch (activeMode) {
      case 'complaint':
        return 'e-FIR Intake Portal';
      case 'tracker':
        return 'Investigation Timeline';
      case 'analytics':
        return 'Suspect & Threat Radar';
      case 'ledger':
        return 'Database Reports';
      default:
        return 'CrimeGPT v4.2.0-Alpha';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 z-40 bg-white/40 backdrop-blur-md border-b border-gray-200/80 sticky top-0">
      {/* Left: Mobile Menu & CrimeGPT Tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 text-slate-700"
          id="btn-mobile-menu"
        >
          <Menu size={18} />
        </button>

        <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
            {getModeLabel()}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span className="text-[10px] font-bold text-red-500 uppercase font-mono">
            {totalRecords} CASES
          </span>
        </div>
      </div>

      {/* Right: Investigator Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Reset Active Chat Button */}
        {activeMode === 'chat' && (
          <button
            onClick={onClearChat}
            title="Reset active query"
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="btn-clear-chat"
          >
            <RotateCcw size={13} className="text-gray-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSos}
          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <ShieldAlert size={14} className="text-red-500" />
          <span className="hidden sm:inline">Emergency SOS</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-slate-600 shadow-sm"
          title="Telemetry Settings"
        >
          <Settings size={15} />
        </button>

        {/* Investigator Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Det. Marcus Thorne</p>
            <p className="text-[10px] text-gray-400 font-mono">m.thorne@precinct-09.gov</p>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden bg-red-100 shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
