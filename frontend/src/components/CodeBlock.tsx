import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

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
    if (line.startsWith('--') || line.startsWith('//') || line.startsWith('#')) {
      return <span key={idx} className="text-slate-500 italic">{line}</span>;
    }

    if (line.startsWith('$')) {
      const rest = line.substring(1);
      return (
        <span key={idx}>
          <span className="text-cyan-400 font-bold">$</span>
          <span className="text-slate-300">{rest}</span>
        </span>
      );
    }

    const parts = line.split(/(\b(?:SELECT|FROM|WHERE|AND|OR|ILIKE|BETWEEN|ORDER BY|LIMIT|pgvector|cosine_ops|Open|Closed|High|Medium|Low)\b|'[^']*'|"[^"]*")/g);

    return (
      <span key={idx}>
        {parts.map((part, pIdx) => {
          if (/^(?:SELECT|FROM|WHERE|AND|OR|ILIKE|BETWEEN|ORDER BY|LIMIT|pgvector|cosine_ops)$/i.test(part)) {
            return <span key={pIdx} className="text-cyan-400 font-bold">{part}</span>;
          }
          if (/^'[^']*'|"[^"]*"$/.test(part)) {
            return <span key={pIdx} className="text-amber-300">{part}</span>;
          }
          if (/^(?:Open|Closed|High|Medium|Low)$/i.test(part)) {
            return <span key={pIdx} className="text-emerald-400 font-semibold">{part}</span>;
          }
          return <span key={pIdx} className="text-slate-300">{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-[#070a10] overflow-hidden font-mono text-xs">
      {/* Header Strip */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-white/10 text-slate-400 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Terminal size={12} className="text-cyan-400" />
          <span>{filename}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-3.5 m-0 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
        <code>
          {code.split('\n').map((line, idx) => (
            <div key={idx}>{formatSyntaxLine(line, idx)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
};
