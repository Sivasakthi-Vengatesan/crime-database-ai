import React, { useRef, useEffect } from 'react';
import { TrendingUp, Database, FolderSearch, Sparkles, AlertCircle } from 'lucide-react';
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
      {/* Empty State: CrimsonLogic Intelligence Landing */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 animate-fadeIn max-w-4xl mx-auto w-full text-center my-auto">
          {/* Subtle Synthetic Data Disclaimer Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50/80 border border-red-200/80 text-red-600 text-[11px] font-semibold mb-6 shadow-2xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Synthetic Demo Data — Records shown are fictional and intended for academic demonstration.</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-3 font-sans">
            Intelligence <span className="text-gradient">at Scale.</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Query the crime database using natural language and receive evidence-grounded answers.
          </p>

          {/* 3 Prompt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left mb-8">
            {/* Card 1: Analyze Crime Patterns */}
            <button
              id="prompt-card-patterns"
              onClick={() => onSelectSampleQuery('Show me crime patterns in Chennai during 2026.')}
              className="prompt-card group bg-white p-5 rounded-[24px] border border-gray-200/90 shadow-2xs hover:border-red-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 bg-purple-50 rounded-[14px] flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">
                  Analyze Crime Patterns
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Explore patterns across crime types, locations, dates, and case descriptions.
                </p>
              </div>
              <span className="text-[11px] font-bold text-red-600 mt-4 inline-block font-mono">
                "Show me crime patterns in Chennai during 2026." →
              </span>
            </button>

            {/* Card 2: Search Case Database */}
            <button
              id="prompt-card-search"
              onClick={() => onSelectSampleQuery('Show unresolved theft cases in Chennai.')}
              className="prompt-card group bg-white p-5 rounded-[24px] border border-gray-200/90 shadow-2xs hover:border-red-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 bg-blue-50 rounded-[14px] flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <Database size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">
                  Search Case Database
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Search crime records using natural language and semantic retrieval.
                </p>
              </div>
              <span className="text-[11px] font-bold text-red-600 mt-4 inline-block font-mono">
                "Show unresolved theft cases in Chennai." →
              </span>
            </button>

            {/* Card 3: Explore Crime Records */}
            <button
              id="prompt-card-explore"
              onClick={() => onSelectSampleQuery('Find cases involving mobile phone theft near railway stations.')}
              className="prompt-card group bg-white p-5 rounded-[24px] border border-gray-200/90 shadow-2xs hover:border-red-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 bg-orange-50 rounded-[14px] flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
                  <FolderSearch size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">
                  Explore Crime Records
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Find cases using descriptions, locations, crime types, and other attributes.
                </p>
              </div>
              <span className="text-[11px] font-bold text-red-600 mt-4 inline-block font-mono">
                "Find cases involving mobile phone theft near railway stations." →
              </span>
            </button>
          </div>

          {/* Quick Query Suggestions Chips */}
          <div className="w-full">
            <span className="text-[11px] font-mono text-gray-400 font-semibold uppercase tracking-wider block mb-2.5">
              Curated Investigation Queries
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {sampleQueries.slice(0, 6).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSampleQuery(q)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 text-slate-700 hover:text-red-700 text-xs font-medium transition-all shadow-2xs cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Conversation Message Thread */
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          {/* Typing / Retrieval Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 py-4 text-xs font-mono text-red-600 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-1"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-2"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 dot-bounce-3"></span>
              </div>
              <span className="font-semibold">Searching crime database & synthesizing verified evidence...</span>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      )}
    </div>
  );
};

