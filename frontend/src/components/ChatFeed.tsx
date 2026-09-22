import React, { useRef, useEffect } from 'react';
import { Feather, Search, Sparkles, Database, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { MessageItem } from './MessageItem';

interface ChatFeedProps {
  messages: ChatMessage[];
  isLoading: boolean;
  sampleQueries: string[];
  onSelectSampleQuery: (query: string) => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  messages,
  isLoading,
  sampleQueries,
  onSelectSampleQuery,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          width: '100%',
          margin: '0 auto',
          padding: '20px 24px 32px 24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Date Separator: Centered 'TODAY · 2:14 PM' flanked by hairlines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            margin: '8px 0 24px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E7DCCC' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.8px',
              color: '#9E9484',
              textTransform: 'uppercase',
            }}
          >
            TODAY · {currentTime}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E7DCCC' }} />
        </div>

        {/* Empty State / Welcome Screen */}
        {messages.length === 0 ? (
          <div
            style={{
              margin: 'auto 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '24px',
              padding: '20px 0',
            }}
          >
            {/* Top Brand Mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(196, 85, 47, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C4552F',
                }}
              >
                <Feather size={22} strokeWidth={2.2} />
              </div>

              <div>
                <h1
                  className="font-serif"
                  style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    letterSpacing: '-0.5px',
                    margin: 0,
                  }}
                >
                  Ask Terra
                </h1>
                <p
                  className="font-serif"
                  style={{
                    fontSize: '15px',
                    fontStyle: 'italic',
                    color: '#736B5E',
                    margin: '2px 0 0 0',
                  }}
                >
                  Intelligent conversational assistant for crime records and forensic intelligence.
                </p>
              </div>
            </div>

            {/* Intro Editorial Text */}
            <p
              style={{
                fontSize: '15px',
                color: '#2E2822',
                lineHeight: '1.7',
                maxWidth: '680px',
              }}
            >
              Terra grounds every response in the PostgreSQL crime database. You can search by specific cities,
              crime categories, dates, or search naturally with descriptive phrasing like <em style={{ color: '#A8421F' }}>"mobile phone stolen near a railway station"</em>.
            </p>

            {/* Sample Inquiry Pills */}
            <div style={{ width: '100%', marginTop: '8px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#9E9484',
                  marginBottom: '12px',
                }}
              >
                Suggested Inquiries
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '10px',
                }}
              >
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSampleQuery(query)}
                    style={{
                      backgroundColor: '#F4ECE1',
                      border: '1px solid #E7DCCC',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      color: '#1A1A1A',
                      fontSize: '13.5px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 200ms ease',
                      boxShadow: '0 1px 3px rgba(168, 66, 31, 0.03)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0E3D5';
                      e.currentTarget.style.borderColor = '#EAD6C4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F4ECE1';
                      e.currentTarget.style.borderColor = '#E7DCCC';
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {query}
                    </span>
                    <ArrowRight size={14} color="#C4552F" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Thread */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {/* Terracotta Typing Indicator (Three small terracotta dots bouncing in sequence) */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 0 12px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(196, 85, 47, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C4552F',
                    }}
                  >
                    <Feather size={14} strokeWidth={2.4} />
                  </div>
                  <span
                    className="font-serif"
                    style={{
                      fontSize: '15px',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#1A1A1A',
                    }}
                  >
                    Terra
                  </span>
                </div>

                {/* 3 Bouncing Terracotta Dots */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 4px',
                  }}
                >
                  <span
                    className="dot-bounce-1"
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#C4552F',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="dot-bounce-2"
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#C4552F',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="dot-bounce-3"
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#C4552F',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#736B5E', marginLeft: '6px' }}>
                    Consulting database records…
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} style={{ height: '8px' }} />
      </div>
    </div>
  );
};
