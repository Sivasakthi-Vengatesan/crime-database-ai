import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Loader2, Cpu, Mic, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-footer sticky bottom-0 p-3 md:p-4 z-20">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="cyber-panel p-3 bg-slate-900/90 border-white/15 focus-within:border-cyan-500/60 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all flex flex-col gap-2 rounded-2xl"
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crime cases, specific cities, stolen items, or suspect profiles..."
            disabled={isLoading}
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-sm font-sans resize-none max-h-40 leading-relaxed px-2"
            id="chat-input-textarea"
          />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400">
            {/* Model Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-white/10 text-[11px] font-mono text-cyan-300">
                <Cpu size={12} className="text-cyan-400" />
                <span>LangChain4j + pgvector</span>
              </div>
            </div>

            {/* Right: Hint + Submit Button */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                ⏎ to execute query
              </span>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
                id="btn-send-message"
                title="Send query"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin text-white" />
                ) : (
                  <ArrowUp size={16} strokeWidth={2.5} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-2 font-mono">
          Aegis Crime AI retrieves grounded evidence from PostgreSQL. All data is for law enforcement demonstration.
        </p>
      </div>
    </div>
  );
};
