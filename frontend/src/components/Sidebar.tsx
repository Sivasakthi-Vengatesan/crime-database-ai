import React, { useState } from 'react';
import { Feather, Plus, Search, MessageSquare, Settings, X, Shield, Clock } from 'lucide-react';
import { ConversationSession, DatabaseStats } from '../types/chat';

interface SidebarProps {
  sessions: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  stats: DatabaseStats | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  isOpenMobile,
  onCloseMobile,
  stats,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26, 26, 26, 0.4)',
            zIndex: 40,
            backdropFilter: 'blur(3px)',
          }}
          className="md:hidden"
        />
      )}

      {/* 264px Left Sidebar on Paper #F4ECE1 */}
      <aside
        style={{
          width: '264px',
          backgroundColor: '#F4ECE1',
          borderRight: '1px solid #E7DCCC',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 300ms ease-in-out',
        }}
        className={`transform ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Branding: Terracotta feather + Serif 'Terra' wordmark */}
        <div
          style={{
            padding: '20px 18px 16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Terracotta feather mark */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(196, 85, 47, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C4552F',
              }}
            >
              <Feather size={18} strokeWidth={2.2} />
            </div>

            <div>
              <span
                className="font-serif"
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  letterSpacing: '-0.3px',
                }}
              >
                Terra
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#736B5E',
                  marginLeft: '6px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Crime AI
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#736B5E',
              cursor: 'pointer',
              padding: '4px',
            }}
            className="md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Full-width terracotta 'New conversation' button (with ⌘N hint) */}
        <div style={{ padding: '0 16px 12px 16px' }}>
          <button
            onClick={() => {
              onNewChat();
              if (isOpenMobile) onCloseMobile();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: '#C4552F',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(196, 85, 47, 0.25)',
              transition: 'background-color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A8421F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C4552F')}
            id="btn-new-conversation"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} strokeWidth={2.2} />
              <span>New conversation</span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.75)',
                fontFamily: 'Inter, sans-serif',
                padding: '2px 5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              }}
            >
              ⌘N
            </span>
          </button>
        </div>

        {/* Search Field ('Search chats') */}
        <div style={{ padding: '0 16px 14px 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ECE2D5',
              border: '1px solid #E7DCCC',
              borderRadius: '8px',
              padding: '7px 10px',
            }}
          >
            <Search size={14} color="#736B5E" />
            <input
              type="text"
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#1A1A1A',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Middle: Scrollable History Grouped by Date Headers ('TODAY', 'YESTERDAY') */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 12px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* TODAY section */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#9E9484',
                padding: '4px 8px 8px 8px',
              }}
            >
              TODAY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {filteredSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #EAD6C4' : '1px solid transparent',
                      backgroundColor: isActive ? '#F0E3D5' : 'transparent', // Soft-terracotta #F0E3D5 active pill
                      color: isActive ? '#1A1A1A' : '#736B5E',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#ECE2D5';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MessageSquare
                      size={14}
                      color={isActive ? '#C4552F' : '#9E9484'}
                      style={{ flexShrink: 0 }}
                    />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* YESTERDAY sample history section */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#9E9484',
                padding: '4px 8px 8px 8px',
              }}
            >
              YESTERDAY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  color: '#9E9484',
                  fontSize: '13px',
                  cursor: 'default',
                }}
              >
                <Clock size={14} color="#9E9484" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Mumbai robbery analysis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Account Row pinned to base (Ink initial avatar 'TL' + name + plan + gear) */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid #E7DCCC',
            backgroundColor: '#ECE2D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Ink initial avatar 'TL' */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1A1A1A',
                color: '#FAF6F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              TL
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                Terra Lead
              </div>
              <div style={{ fontSize: '11px', color: '#736B5E' }}>
                Crime Intel Pro
              </div>
            </div>
          </div>

          <button
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
            title="Account Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};
