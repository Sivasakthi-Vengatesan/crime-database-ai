import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalBlockProps {
  log?: string;
}

export const TerminalBlock: React.FC<TerminalBlockProps> = ({ log }) => {
  if (!log || log.trim().length === 0) return null;

  const lines = log.split('\n');

  return (
    <div
      style={{
        backgroundColor: '#0d0f12',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        margin: '12px 0',
        overflow: 'hidden',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
      }}
    >
      {/* Terminal Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          backgroundColor: '#15181e',
          borderBottom: '1px solid #1f2937',
          color: '#64748b',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TerminalIcon size={12} color="#3b82f6" />
          <span>pgvector & postgres telemetry</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#374151' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#374151' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
        </div>
      </div>

      {/* Terminal Output */}
      <div
        style={{
          padding: '12px 14px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          color: '#cbd5e1',
        }}
      >
        {lines.map((line, idx) => {
          if (!line.trim()) return null;

          if (line.startsWith('$')) {
            const rest = line.substring(1).trim();
            const isSuccess = rest.includes('SUCCESS') || rest.includes('RESULT');
            const isWarn = rest.includes('WARN') || rest.includes('ERR');

            return (
              <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#10b981', fontWeight: 600, userSelect: 'none' }}>$</span>
                <span
                  style={{
                    color: isSuccess ? '#3b82f6' : isWarn ? '#f59e0b' : '#e2e8f0',
                  }}
                >
                  {rest}
                </span>
              </div>
            );
          }

          return (
            <div key={idx} style={{ color: '#94a3b8', paddingLeft: '16px' }}>
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};
