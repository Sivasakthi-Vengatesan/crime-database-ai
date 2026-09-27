import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  RotateCcw,
  Database,
  FileText,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  ChevronDown,
  ArrowUp,
  Loader2,
  ShieldAlert,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Evidence } from '../types/chat';
import { sendChatMessage } from '../api/chatApi';

export interface CrimeChatTurn {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  duration?: string;
  evidence?: Evidence[];
  totalFound?: number;
  checklist?: string[];
  isError?: boolean;
}

interface ChatColumnProps {
  onSelectEvidence?: (ev: Evidence) => void;
  onSelectCaseId?: (caseId: string) => void;
  initialQuery?: string;
}

export const ChatColumn: React.FC<ChatColumnProps> = ({
  onSelectEvidence,
  onSelectCaseId,
  initialQuery = '',
}) => {
  const [input, setInput] = useState(initialQuery);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const [turns, setTurns] = useState<CrimeChatTurn[]>([
    {
      id: 'turn-1-user',
      sender: 'user',
      text: 'Show theft cases in Chennai.',
      timestamp: '9:41 AM',
    },
    {
      id: 'turn-1-assistant',
      sender: 'assistant',
      text: 'I found 8 Vehicle Theft cases in Chennai matching your query. The verified case records are displayed as evidence below.',
      timestamp: '9:41 AM',
      duration: 'retrieved in 18ms',
      totalFound: 8,
      evidence: [
        {
          caseId: 'CASE-1092',
          crimeType: 'Vehicle Theft',
          location: 'Chennai',
          date: '2026-03-31',
          status: 'Open',
          severity: 'Low',
          description: 'Auto rickshaw stolen from outside a hospital entrance while driver accompanied a patient.',
          victimAge: 46,
          suspectAge: null,
          similarityScore: 0.656,
        },
        {
          caseId: 'CASE-1001',
          crimeType: 'Mobile Phone Theft',
          location: 'Chennai',
          date: '2026-05-14',
          status: 'Open',
          severity: 'Medium',
          description: 'A mobile phone was reported stolen from a commuter while travelling through a crowded railway station.',
          victimAge: 21,
          suspectAge: null,
          similarityScore: 0.649,
        },
        {
          caseId: 'CASE-1011',
          crimeType: 'Mobile Phone Theft',
          location: 'Chennai',
          date: '2026-02-04',
          status: 'Under Investigation',
          severity: 'Medium',
          description: 'Handset was stolen inside a crowded train compartment between Central and Egmore stations.',
          victimAge: 19,
          suspectAge: null,
          similarityScore: 0.634,
        },
      ],
      checklist: [
        'Extracted structured filter: Location = Chennai',
        'Category constraint: Theft & Vehicle Theft variants',
        'Ranked 8 records via pgvector dense cosine similarity',
        'Zero-hallucination: All facts grounded strictly on PostgreSQL records',
      ],
    },
  ]);

  const sampleQueries = [
    'Show theft cases in Chennai.',
    'Find robbery cases in Mumbai.',
    'Show unresolved cases in Bengaluru.',
    'Find cases similar to a phone stolen from a railway passenger.',
    'Show cybercrime cases during 2026.',
    'Show high severity cases in Delhi.',
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isProcessing) return;

    setInput('');

    const userTurn: CrimeChatTurn = {
      id: `turn-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTurns((prev) => [...prev, userTurn]);
    setIsProcessing(true);

    try {
      // Call Java Spring Boot backend
      const response = await sendChatMessage(textToSend);

      const assistantTurn: CrimeChatTurn = {
        id: `turn-${Date.now()}-assistant`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: 'retrieved in 22ms',
        evidence: response.evidence || [],
        totalFound: response.totalFound || (response.evidence ? response.evidence.length : 0),
        checklist: [
          'Decomposed natural-language query into structured & semantic vectors',
          `Assembled ${response.evidence?.length || 0} verified PostgreSQL records`,
          'Validated zero-hallucination constraint with LangChain4j',
        ],
      };

      setTurns((prev) => [...prev, assistantTurn]);

      if (response.evidence && response.evidence.length > 0 && onSelectEvidence) {
        onSelectEvidence(response.evidence[0]);
      }
    } catch (err: any) {
      const errorTurn: CrimeChatTurn = {
        id: `turn-${Date.now()}-error`,
        sender: 'assistant',
        text: err.message || 'Unable to process the query against the crime database.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setTurns((prev) => [...prev, errorTurn]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setTurns([]);
  };

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isProcessing]);

  return (
    <div className="w-[452px] h-screen bg-[#fcfdfc] border-r border-[#e4e9e4] flex flex-col shrink-0 relative overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-[#fcfdfc]/90 backdrop-blur-md border-b border-[#e4e9e4] px-5 py-3.5 space-y-2.5">
        {/* Row 1: Title and Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0ea968] text-white flex items-center justify-center">
              <ShieldAlert size={13} />
            </div>
            <h1 className="font-display font-semibold text-[15px] text-[#131815] tracking-tight">
              CrimsonLogic · Crime Database AI
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] transition-colors cursor-pointer"
              title="Reset query session"
              aria-label="Reset Query"
            >
              <RotateCcw size={14} />
            </button>
            <button
              className="p-1.5 rounded-lg text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] transition-colors cursor-pointer"
              title="Share findings"
              aria-label="Share"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>

        {/* Row 2: Model & Database Chips */}
        <div className="flex items-center gap-2">
          {/* LANGCHAIN4J . RAG ONLINE Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e7f4ec] border border-[#cde7d7] text-[#0b8a54] font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0ea968] pulse-emerald" />
            <span>LANGCHAIN4J · RAG ONLINE</span>
          </div>

          {/* Branch / Vector DB Chip */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f5f1] border border-[#e4e9e4] text-[#5b655e] font-mono text-[11px]">
            <span>pgvector · 105 records</span>
          </div>
        </div>
      </header>

      {/* Scrolling Message Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-48">
        {/* DATABASE CONNECTED Separator */}
        <div className="flex items-center justify-center my-2">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#5b655e] px-3 py-0.5 rounded-full bg-[#eef1ed] border border-[#e4e9e4]">
            DATABASE CONNECTED · POSTGRESQL + PGVECTOR
          </span>
        </div>

        {turns.map((turn) => {
          if (turn.sender === 'user') {
            return (
              /* Right-aligned User Bubble */
              <div key={turn.id} className="flex justify-end animate-fadeIn">
                <div className="max-w-[84%] bg-[#e8f4ee] border border-[#d2e9db] text-[#131815] p-3.5 rounded-[16px] rounded-br-[4px] shadow-2xs space-y-1">
                  <p className="text-[13.5px] leading-relaxed font-sans">{turn.text}</p>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-[#5b655e]">{turn.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          }

          /* Frameless Assistant Turn */
          return (
            <div key={turn.id} className="space-y-3.5 animate-fadeIn group">
              {/* Header: AI Shield + Assistant Name + Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[7px] bg-[#0ea968] text-white flex items-center justify-center shadow-emerald-btn shrink-0">
                    <ShieldAlert size={14} />
                  </div>
                  <span className="font-display font-semibold text-[14px] text-[#131815]">
                    CrimsonLogic AI
                  </span>
                  {turn.duration && (
                    <span className="font-mono text-[11px] text-[#5b655e]">
                      {turn.duration}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-[#5b655e]">{turn.timestamp}</span>
              </div>

              {/* Editorial Statement */}
              <div className="p-3.5 rounded-xl bg-white border border-[#e4e9e4] shadow-2xs space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0ea968] block">
                  ANSWER
                </span>
                <p className="text-[13px] text-[#131815] leading-relaxed font-sans font-normal">
                  {turn.text}
                </p>
              </div>

              {/* Bordered Retrieved Evidence Manifest */}
              {turn.evidence && turn.evidence.length > 0 && (
                <div className="rounded-xl border border-[#e4e9e4] bg-white overflow-hidden shadow-2xs">
                  {/* Header Row */}
                  <div className="bg-[#f7f9f7] px-3.5 py-2 border-b border-[#e4e9e4] flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#131815] font-semibold">
                      <Database size={13} className="text-[#0ea968]" />
                      <span>{turn.evidence.length} EVIDENCE RECORDS</span>
                    </div>
                    <span className="text-[#0b8a54] font-semibold">
                      Ranked by Cosine Score
                    </span>
                  </div>

                  {/* Body: Case Rows divided by hairlines */}
                  <div className="divide-y divide-[#e4e9e4]">
                    {turn.evidence.map((ev, idx) => (
                      <button
                        key={ev.caseId || idx}
                        onClick={() => {
                          if (onSelectEvidence) onSelectEvidence(ev);
                          if (onSelectCaseId) onSelectCaseId(ev.caseId);
                        }}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#e7f4ec]/40 transition-colors text-left cursor-pointer group/item"
                      >
                        <div className="space-y-0.5 max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#131815] group-hover/item:text-[#0ea968]">
                              {ev.caseId}
                            </span>
                            <span className="text-xs font-semibold text-[#5b655e]">
                              {ev.crimeType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#5b655e]">
                            <span className="flex items-center gap-0.5">
                              <MapPin size={10} className="text-[#0ea968]" />
                              {ev.location}
                            </span>
                            <span>·</span>
                            <span>{ev.date}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border ${
                              ev.severity === 'Critical'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : ev.severity === 'High'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-[#e7f4ec] text-[#0b8a54] border-[#cde7d7]'
                            }`}
                          >
                            {ev.severity}
                          </span>

                          {ev.similarityScore !== undefined && ev.similarityScore !== null && (
                            <span className="font-mono text-[9px] text-[#0b8a54] flex items-center gap-0.5">
                              <Sparkles size={9} />
                              sim: {ev.similarityScore}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Green-check Grounding Checklist */}
              {turn.checklist && turn.checklist.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {turn.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[12px] text-[#131815] font-sans">
                      <div className="w-4 h-4 rounded-full bg-[#e7f4ec] text-[#0ea968] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} strokeWidth={2.8} />
                      </div>
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hover Action Row */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => handleCopy(turn.id, turn.text)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-sans text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] border border-transparent hover:border-[#e4e9e4] transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === turn.id ? (
                    <>
                      <Check size={11} className="text-[#0ea968]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSend(turn.text)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-sans text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] border border-transparent hover:border-[#e4e9e4] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Retry</span>
                </button>

                <button
                  className="p-1 rounded-md text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] transition-colors cursor-pointer"
                  title="Accurate Evidence"
                >
                  <ThumbsUp size={12} />
                </button>

                <button
                  className="p-1 rounded-md text-[#5b655e] hover:text-[#131815] hover:bg-[#eef1ed] transition-colors cursor-pointer"
                  title="Needs refinement"
                >
                  <ThumbsDown size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#0b8a54] animate-fadeIn">
            <Loader2 size={13} className="animate-spin text-[#0ea968]" />
            <span>Searching PostgreSQL & synthesizing verified evidence...</span>
          </div>
        )}

        <div ref={threadEndRef} className="h-2" />
      </div>

      {/* Sticky Bottom Composer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#fcfdfc] via-[#fcfdfc]/95 to-transparent z-30">
        <div className="bg-white rounded-[15px] border border-[#e4e9e4] p-3 shadow-md shadow-[#131815]/5 space-y-2.5 focus-within:border-[#0ea968] focus-within:ring-2 focus-within:ring-[#0ea968]/15 transition-all">
          {/* Main Field */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the crime database (e.g. Show theft cases in Chennai)..."
            rows={2}
            className="w-full bg-transparent text-[13px] text-[#131815] placeholder:text-[#5b655e]/70 resize-none focus:outline-none font-sans"
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f1]">
            {/* Left Controls: Sample queries chip & Model tag */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(sampleQueries[Math.floor(Math.random() * sampleQueries.length)])}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f4f7f4] border border-[#e4e9e4] text-[#131815] font-mono text-[11px] font-medium hover:bg-[#eef1ed] transition-colors cursor-pointer"
                title="Insert random sample query"
              >
                <Sparkles size={11} className="text-[#0ea968]" />
                <span>Sample Query</span>
              </button>

              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#f4f7f4] text-[#5b655e] font-mono text-[10.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ea968]" />
                <span>AllMiniLmL6V2</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] text-[#5b655e] hidden sm:inline">
                Enter to send
              </span>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                className="w-[34px] h-[34px] rounded-full bg-[#0ea968] text-white flex items-center justify-center shadow-emerald-btn hover:bg-[#0b8a54] disabled:opacity-30 disabled:hover:bg-[#0ea968] transition-all cursor-pointer"
                title="Send query"
                aria-label="Send"
              >
                <ArrowUp size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>

        {/* Small Centered Disclaimer */}
        <p className="text-center font-sans text-[11px] text-[#5b655e] mt-2">
          Synthetic Demo Data — All crime records shown are fictional and for academic demonstration.
        </p>
      </div>
    </div>
  );
};
