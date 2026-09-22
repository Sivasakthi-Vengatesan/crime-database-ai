import React from 'react';
import { Menu, History, Share2, MoreHorizontal, RotateCcw } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenMobileMenu,
  onClearChat,
  onOpenSettings,
}) => {
  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderBottom: '1px solid #E7DCCC',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Left: Mobile hamburger toggle & Editorial conversation title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <button
          onClick={onOpenMobileMenu}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
          className="md:hidden"
          id="btn-mobile-menu"
        >
          <Menu size={20} />
        </button>

        {/* Current conversation title in Fraunces serif (~18px) */}
        <h1
          className="font-serif"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1A1A1A',
            letterSpacing: '-0.2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            margin: 0,
          }}
        >
          {title || 'New conversation'}
        </h1>
      </div>

      {/* Right: History / Share / More icon buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={onClearChat}
          title="Reset conversation"
          style={{
            background: 'transparent',
            border: '1px solid #E7DCCC',
            color: '#736B5E',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4ECE1')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          id="btn-clear-chat"
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="View Database Intel & Stats"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4ECE1')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          id="btn-history-stats"
        >
          <History size={17} />
        </button>

        <button
          title="Share conversation"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4ECE1')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          id="btn-share-chat"
        >
          <Share2 size={17} />
        </button>

        <button
          onClick={onOpenSettings}
          title="More options"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4ECE1')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          id="btn-more-options"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>
    </header>
  );
};
