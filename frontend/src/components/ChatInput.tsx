import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowUp, ChevronDown, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
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
    <div
      className="glass-panel"
      style={{
        position: 'sticky',
        bottom: 0,
        padding: '12px 20px 18px 20px',
        borderTop: '1px solid #E7DCCC',
        zIndex: 20,
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Rounded-2xl bordered card on cream (#FAF6F0) with a soft shadow */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#FAF6F0',
            borderRadius: '18px',
            border: '1px solid #EAD6C4',
            padding: '12px 16px 10px 16px',
            boxShadow: '0 4px 16px rgba(168, 66, 31, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'border-color 200ms ease',
          }}
          onFocus={() => {
            const el = document.getElementById('composer-card');
            if (el) el.style.borderColor = '#C4552F';
          }}
          id="composer-card"
        >
          {/* Auto-grow 'Reply to Terra…' textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply to Terra…"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#1A1A1A',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              resize: 'none',
              lineHeight: '1.6',
              maxHeight: '160px',
            }}
            disabled={isLoading}
            id="chat-input-textarea"
          />

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '4px',
            }}
          >
            {/* Left: Attach button + Model Chip Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
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
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C4552F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#736B5E')}
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>

              {/* Model Chip Pill: terracotta dot · 'Terra 1.5 · Editorial' · caret */}
              <button
                type="button"
                onClick={() => setShowModelPicker(!showModelPicker)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4ECE1',
                  border: '1px solid #E7DCCC',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ECE2D5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F4ECE1')}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#C4552F',
                    display: 'inline-block',
                  }}
                />
                <span>Terra 1.5 · Editorial</span>
                <ChevronDown size={13} color="#736B5E" />
              </button>
            </div>

            {/* Right: '⏎ to send' hint + Round terracotta send button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#9E9484',
                  fontFamily: 'Inter, sans-serif',
                }}
                className="hidden sm:inline"
              >
                ⏎ to send
              </span>

              {/* Round terracotta send button (#C4552F) */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: input.trim() && !isLoading ? '#C4552F' : '#E7DCCC',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 200ms ease',
                  boxShadow: input.trim() && !isLoading ? '0 2px 6px rgba(196, 85, 47, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#A8421F';
                }}
                onMouseLeave={(e) => {
                  if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#C4552F';
                }}
                id="btn-send-message"
                title="Send query"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <ArrowUp size={16} strokeWidth={2.5} color="#FFFFFF" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Centered 'Terra can make mistakes. Double-check important info.' disclaimer */}
        <div
          style={{
            fontSize: '11.5px',
            color: '#9E9484',
            textAlign: 'center',
            marginTop: '8px',
            letterSpacing: '0.1px',
          }}
        >
          Terra can make mistakes. Double-check important crime record info. (Synthetic Demo Data)
        </div>
      </div>
    </div>
  );
};
