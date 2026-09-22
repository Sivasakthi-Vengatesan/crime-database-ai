import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  filename?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename = 'QueryExecution.sql',
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSyntaxLine = (line: string, idx: number) => {
    // Syntax highlight keywords in #E39B6E, strings in #C9B78E, comments in #8A7E6C, functions in #EAD9BE
    if (line.startsWith('--') || line.startsWith('//') || line.startsWith('#')) {
      return <span key={idx} style={{ color: '#8A7E6C', fontStyle: 'italic' }}>{line}</span>;
    }

    if (line.startsWith('$')) {
      const rest = line.substring(1);
      return (
        <span key={idx}>
          <span style={{ color: '#C4552F', fontWeight: 600 }}>$</span>
          <span style={{ color: '#EAD9BE' }}>{rest}</span>
        </span>
      );
    }

    // Replace basic SQL / code tokens with warm palette colors
    const parts = line.split(/(\b(?:SELECT|FROM|WHERE|AND|ILIKE|BETWEEN|ORDER BY|LIMIT|pgvector|cosine_ops|Open|Closed|High|Medium|Low)\b|'[^']*'|"[^"]*")/g);

    return (
      <span key={idx}>
        {parts.map((part, pIdx) => {
          if (/^(?:SELECT|FROM|WHERE|AND|ILIKE|BETWEEN|ORDER BY|LIMIT|pgvector|cosine_ops)$/i.test(part)) {
            return <span key={pIdx} style={{ color: '#E39B6E', fontWeight: 600 }}>{part}</span>;
          }
          if (/^'[^']*'|"[^"]*"$/.test(part)) {
            return <span key={pIdx} style={{ color: '#C9B78E' }}>{part}</span>;
          }
          if (/^(?:Open|Closed|High|Medium|Low)$/i.test(part)) {
            return <span key={pIdx} style={{ color: '#EAD9BE' }}>{part}</span>;
          }
          return <span key={pIdx} style={{ color: '#D4C5B3' }}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#262019',
        borderRadius: '10px',
        border: '1px solid #383027',
        margin: '14px 0',
        overflow: 'hidden',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12.5px',
        boxShadow: '0 2px 8px rgba(38, 32, 25, 0.15)',
      }}
    >
      {/* Header Strip (#1F1A15) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#1F1A15',
          borderBottom: '1px solid #332B22',
        }}
      >
        <span style={{ color: '#A89B88', fontSize: '12px', fontWeight: 500 }}>
          {filename}
        </span>

        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#A89B88',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontFamily: 'Inter, sans-serif',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF6F0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#A89B88')}
        >
          {copied ? (
            <>
              <Check size={13} color="#C9B78E" />
              <span style={{ color: '#C9B78E' }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Muted Syntax Colors */}
      <pre
        style={{
          padding: '12px 16px',
          margin: 0,
          overflowX: 'auto',
          lineHeight: '1.65',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <code>
          {code.split('\n').map((line, idx) => (
            <div key={idx}>{formatSyntaxLine(line, idx)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
};
