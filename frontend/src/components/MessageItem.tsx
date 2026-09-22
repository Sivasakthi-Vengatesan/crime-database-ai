import React, { useState } from 'react';
import { Feather, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { CodeBlock } from './CodeBlock';
import { EvidenceCard } from './EvidenceCard';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAgent = message.sender === 'agent';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAgent) {
    // USER TURN: Right-aligned soft-terracotta card (#F0E3D5, #EAD6C4 border, rounded-2xl with a rounded-tr-sm tail, max ~85% width)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 0',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '85%',
            backgroundColor: '#F0E3D5',
            border: '1px solid #EAD6C4',
            borderRadius: '16px',
            borderTopRightRadius: '4px', // small tail
            padding: '12px 18px',
            color: '#1A1A1A',
            fontSize: '15px',
            lineHeight: '1.6',
            boxShadow: '0 1px 4px rgba(196, 85, 47, 0.06)',
          }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  // ASSISTANT TURN: Left-aligned and FRAMELESS (no bubble): small terracotta mark + serif-italic 'Terra' name over editorial paragraphs
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0 16px 0',
        width: '100%',
      }}
      className="group"
    >
      {/* Assistant Header: Small terracotta feather mark + serif-italic 'Terra' name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
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
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#1A1A1A',
            letterSpacing: '-0.2px',
          }}
        >
          Terra
        </span>

        <span style={{ fontSize: '11.5px', color: '#9E9484', marginLeft: '4px' }}>
          {message.timestamp}
        </span>
      </div>

      {/* Editorial Body Text (Inter ~15px / 1.68) */}
      <div
        style={{
          fontSize: '15px',
          lineHeight: '1.68',
          color: message.isError ? '#A8421F' : '#1A1A1A',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.text}
      </div>

      {/* Structured / Technical Trace in Warm Code Block */}
      {message.terminalLog && (
        <div style={{ marginTop: '14px' }}>
          <CodeBlock filename="RetrievalPlan.sql" code={message.terminalLog} />
        </div>
      )}

      {/* Supporting Evidence List (Rendered as typeset list with serif numerals & cards) */}
      {message.evidence && message.evidence.length > 0 && (
        <div style={{ marginTop: '18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: '#736B5E',
              marginBottom: '12px',
            }}
          >
            <CheckCircle2 size={14} color="#C4552F" />
            <span>Verified Database Records ({message.evidence.length} Cases Retrieved)</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '12px',
            }}
          >
            {message.evidence.map((ev, idx) => (
              <EvidenceCard key={ev.caseId} evidence={ev} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Subtle Hover Action Row (copy / thumbs-up / thumbs-down / regenerate) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '14px',
          paddingTop: '6px',
          opacity: 0.85,
          transition: 'opacity 200ms ease',
        }}
      >
        <button
          onClick={handleCopyText}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            padding: '4px 6px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C4552F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#736B5E')}
          title="Copy response"
        >
          {copied ? <Check size={14} color="#C4552F" /> : <Copy size={14} />}
          <span style={{ fontSize: '11px' }}>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          onClick={() => setLiked(liked === true ? null : true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: liked === true ? '#C4552F' : '#736B5E',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C4552F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = liked === true ? '#C4552F' : '#736B5E')}
          title="Helpful"
        >
          <ThumbsUp size={14} />
        </button>

        <button
          onClick={() => setLiked(liked === false ? null : false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: liked === false ? '#C4552F' : '#736B5E',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C4552F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = liked === false ? '#C4552F' : '#736B5E')}
          title="Not helpful"
        >
          <ThumbsDown size={14} />
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#736B5E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            padding: '4px 6px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C4552F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#736B5E')}
          title="Regenerate response"
        >
          <RotateCcw size={14} />
          <span style={{ fontSize: '11px' }}>Regenerate</span>
        </button>
      </div>
    </div>
  );
};
