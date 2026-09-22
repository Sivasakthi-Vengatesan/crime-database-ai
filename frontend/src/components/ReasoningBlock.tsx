import React from 'react';
import { Cpu, ChevronDown } from 'lucide-react';
import { ReasoningStep } from '../types/chat';

interface ReasoningBlockProps {
  steps: ReasoningStep[];
}

export const ReasoningBlock: React.FC<ReasoningBlockProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <details
      className="technical-block group"
      style={{
        backgroundColor: '#232730',
        borderRadius: '8px',
        border: '1px solid #1f2937',
        margin: '12px 0',
        overflow: 'hidden',
      }}
    >
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          cursor: 'pointer',
          fontSize: '14px', // 14px text
          color: '#e2e8f0',
          fontWeight: 500,
          transition: 'background-color 300ms ease-in-out',
        }}
        className="glow-white"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span>Agent Reasoning ({steps.length} processing steps)</span>
        </div>
        <ChevronDown
          size={16}
          color="#94a3b8"
          className="chevron-icon"
          style={{ transition: 'transform 300ms ease-in-out' }}
        />
      </summary>

      <div
        style={{
          borderTop: '1px solid rgba(31, 41, 55, 0.2)', // #1f293720
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // #00000033
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px 10px',
              backgroundColor: 'rgba(24, 27, 33, 0.6)',
              borderRadius: '6px',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                {idx + 1}. {step.stepName}
              </span>
              {step.durationMs !== undefined && (
                <span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {step.durationMs}ms
                </span>
              )}
            </div>
            <div style={{ color: '#cbd5e1', marginBottom: '3px' }}>
              {step.description}
            </div>
            {step.details && (
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: 'rgba(13, 15, 18, 0.5)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  overflowX: 'auto',
                }}
              >
                {step.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
};
