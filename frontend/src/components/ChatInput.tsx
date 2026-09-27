import React, { useState } from 'react';
import { Paperclip, Mic, ArrowUp, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Mock voice assistant prompt
      setInput('Show high severity robbery and theft cases reported in 2026');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-[288px] px-4 sm:px-6 py-6 flex flex-col items-center bg-gradient-to-t from-[#f0e6dd] via-[#f0e6dd]/90 to-transparent pointer-events-none z-30">
      <div className="max-w-4xl w-full pointer-events-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#f9fafb] border border-gray-200/90 rounded-[28px] p-2 flex items-center shadow-xl shadow-slate-900/5 focus-within:ring-2 focus-within:ring-red-500/30 transition-all"
        >
          {/* Main Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Describe the case details or query by city, crime type, or suspect..."
            className="flex-1 bg-transparent px-5 py-3 text-xs sm:text-sm focus:outline-none placeholder:text-gray-400 text-slate-800"
            id="chat-input-field"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 pr-1.5">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              title="Attach digital evidence file"
              onClick={() => setInput((prev) => prev ? prev + ' [Attached Evidence File: FIR-Report.pdf]' : 'Analyze attached forensic report [FIR-Report.pdf]')}
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 transition-colors rounded-full ${
                isRecording
                  ? 'text-red-500 bg-red-50 animate-pulse'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Voice Query Input"
            >
              <Mic size={18} />
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-[#ef4444] transition-all transform active:scale-90 disabled:opacity-40 disabled:hover:bg-slate-800 shrink-0 shadow-md shadow-slate-800/20"
              id="send-btn"
              title="Send Query"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-gray-500 text-center mt-2.5 font-medium">
          CrimsonLogic provides intelligence support. All insights should be verified by a certified human investigator before formal reporting.
        </p>
      </div>
    </div>
  );
};
