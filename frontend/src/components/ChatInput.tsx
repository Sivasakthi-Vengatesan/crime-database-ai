import React, { useState } from 'react';
import { Paperclip, Mic, ArrowUp, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, initialValue = '' }) => {
  const [input, setInput] = useState(initialValue);

  // Sync if initialValue changes
  React.useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-[280px] px-4 sm:px-6 py-4 flex flex-col items-center bg-gradient-to-t from-[#fdfcfb] via-[#fdfcfb]/95 to-transparent pointer-events-none z-30">
      <div className="max-w-4xl w-full pointer-events-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300/80 rounded-[28px] p-2 flex items-center shadow-lg shadow-slate-900/5 focus-within:ring-2 focus-within:ring-red-500/30 focus-within:border-red-400 transition-all"
        >
          {/* Main Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask the crime database..."
            className="flex-1 bg-transparent px-5 py-3 text-xs sm:text-sm focus:outline-none placeholder:text-gray-400 text-slate-800"
            id="chat-input-field"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 pr-1.5">
            <button
              type="button"
              className="p-2 text-gray-300 cursor-not-allowed rounded-full"
              title="File attachment coming soon"
              disabled
            >
              <Paperclip size={17} />
            </button>

            <button
              type="button"
              className="p-2 text-gray-300 cursor-not-allowed rounded-full"
              title="Voice transcription coming soon"
              disabled
            >
              <Mic size={17} />
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-[#ef4444] transition-all transform active:scale-95 disabled:opacity-30 disabled:hover:bg-slate-900 shrink-0 shadow-sm cursor-pointer"
              id="send-btn"
              title="Send query to crime database"
              aria-label="Send Query"
            >
              {isLoading ? (
                <Loader2 size={17} className="animate-spin text-white" />
              ) : (
                <ArrowUp size={17} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </form>

        {/* Official Disclaimer */}
        <p className="text-[11px] text-gray-400 text-center mt-2.5 font-sans leading-tight">
          CrimsonLogic provides evidence-grounded database assistance. All records in this prototype are synthetic demonstration data.
        </p>
      </div>
    </div>
  );
};

