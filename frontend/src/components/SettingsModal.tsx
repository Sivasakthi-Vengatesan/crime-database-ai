import React from 'react';
import { X, Database, Cpu, Shield, CheckCircle2, Feather } from 'lucide-react';
import { DatabaseStats } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DatabaseStats | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 26, 26, 0.45)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FAF6F0',
          border: '1px solid #EAD6C4',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 40px rgba(26, 26, 26, 0.12)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E7DCCC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F4ECE1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Feather size={18} color="#C4552F" />
            <span className="font-serif" style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A1A' }}>
              System & Architecture Info
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#736B5E',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Badge */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#F0E3D5',
              border: '1px solid #EAD6C4',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13.5px',
              color: '#A8421F',
            }}
          >
            <CheckCircle2 size={18} color="#C4552F" />
            <span>Backend Status: Active (Java 17 Spring Boot + pgvector)</span>
          </div>

          {/* Metric Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                backgroundColor: '#F4ECE1',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E7DCCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={15} color="#C4552F" />
                <span style={{ fontSize: '13.5px', color: '#1A1A1A' }}>Indexed Crime Records</span>
              </div>
              <span className="font-mono" style={{ fontSize: '13px', color: '#C4552F', fontWeight: 600 }}>
                {stats?.totalRecords || 105} cases
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#F4ECE1',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E7DCCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={15} color="#736B5E" />
                <span style={{ fontSize: '13.5px', color: '#1A1A1A' }}>Embedding Model</span>
              </div>
              <span style={{ fontSize: '12.5px', color: '#736B5E' }}>
                {stats?.embeddingModel || 'LangChain4j 384-dim'}
              </span>
            </div>
          </div>

          {/* Demo Data Notice */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#F4ECE1',
              border: '1px solid #E7DCCC',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#736B5E',
              lineHeight: 1.5,
            }}
          >
            <strong>Synthetic Demo Data:</strong> All crime records shown are fictional and generated strictly for demonstration and testing purposes.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #E7DCCC',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: '#F4ECE1',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#C4552F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A8421F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C4552F')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
