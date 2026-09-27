import React, { useRef, useEffect } from 'react';
import { Shield, Sparkles, Database, ArrowRight, Compass } from 'lucide-react';
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
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col flex-1">
        {/* Date / Security Telemetry Separator */}
        <div className="flex items-center justify-center gap-4 my-3 text-[11px] font-mono uppercase text-slate-500">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            ACTIVE SESSION // {currentTime}
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Empty State / Welcome Screen */}
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-start gap-6 py-8">
            {/* Top Brand Mark */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                  <Shield size={24} />
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
                  AEGIS Crime Intelligence AI
                </h1>
                <p className="text-xs md:text-sm text-cyan-400 font-mono">
                  PostgreSQL Structured Filtering + 384-Dim pgvector Dense Semantic Search
                </p>
              </div>
            </div>

            {/* Intro Text */}
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
              Welcome to the law enforcement intelligence chatbot. Ask questions about crime patterns,
              suspect modus operandi, city hotspot distributions, or specific FIRs in plain English.
            </p>

            {/* Suggested Starter Queries */}
            <div className="w-full space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <Compass size={14} className="text-cyan-400" />
                Recommended Investigation Queries
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSampleQuery(query)}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 text-left text-xs sm:text-sm text-slate-200 transition-all flex items-center justify-between gap-3 group shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    <span className="truncate group-hover:text-white font-medium">{query}</span>
                    <ArrowRight
                      size={14}
                      className="text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Thread */
          <div className="flex flex-col">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {/* Typing / Retrieval Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 py-4 text-xs font-mono text-cyan-400 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-cyan-400 dot-bounce-1" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 dot-bounce-2" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 dot-bounce-3" />
                <span>Executing pgvector semantic ranking & generating grounded analysis...</span>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
