import React, { useRef, useEffect } from 'react';
import { TrendingUp, SearchCode, FolderSearch, ShieldAlert } from 'lucide-react';
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

  return (
    <div className="flex-1 overflow-y-auto flex flex-col pb-36">
      {/* Empty State: CrimsonLogic Hero Banner & Bento Grid */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 animate-fadeIn max-w-4xl mx-auto w-full text-center my-auto">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-800 mb-3">
            Intelligence <span className="text-gradient">at Scale.</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Empowering criminal investigations with instant case synthesis, semantic vector search, and grounded RAG analysis.
          </p>

          {/* Bento Grid Prompt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
            {/* Purple Card: Crime Patterns */}
            <button
              id="prompt-card-patterns"
              onClick={() => onSelectSampleQuery('Show high severity crime patterns and unresolved cases in Delhi and Mumbai.')}
              className="prompt-card group bg-gradient-to-br from-purple-50 via-white to-white p-6 rounded-[28px] border border-white/60 shadow-sm hover:border-purple-200 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 bg-purple-100 rounded-[14px] flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <TrendingUp size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">
                  Analyze Crime Patterns
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Identify temporal and spatial correlations across active investigations and unresolved cases.
                </p>
              </div>
              <span className="text-[11px] font-bold text-purple-600 mt-4 inline-block font-mono">
                Launch Pattern Query →
              </span>
            </button>

            {/* Blue Card: Case Database */}
            <button
              id="prompt-card-search"
              onClick={() => onSelectSampleQuery('Show theft and vehicle theft cases in Chennai.')}
              className="prompt-card group bg-gradient-to-br from-blue-50 via-white to-white p-6 rounded-[28px] border border-white/60 shadow-sm hover:border-blue-200 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 bg-blue-100 rounded-[14px] flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <SearchCode size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">
                  Search Case Database
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Query 106+ records using natural language, structured city filters, and pgvector semantic link analysis.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-4 inline-block font-mono">
                Explore Database →
              </span>
            </button>

            {/* Orange Card: Evidence Review */}
            <button
              id="prompt-card-evidence"
              onClick={() => onSelectSampleQuery('Find cases similar to a mobile phone being stolen from a railway passenger.')}
              className="prompt-card group bg-gradient-to-br from-orange-50 via-white to-white p-6 rounded-[28px] border border-white/60 shadow-sm hover:border-orange-200 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 bg-orange-100 rounded-[14px] flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                  <FolderSearch size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">
                  Review Evidence Files
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Deep vector matching for modus operandi, transit robberies, and cyber financial scams.
                </p>
              </div>
              <span className="text-[11px] font-bold text-orange-600 mt-4 inline-block font-mono">
                Match Evidence →
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Message Thread */
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 py-4 text-xs font-mono text-red-500 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-1"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-2"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-3"></span>
              </div>
              <span>CrimsonLogic AI is searching PostgreSQL & synthesizing verified evidence...</span>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      )}
    </div>
  );
};
