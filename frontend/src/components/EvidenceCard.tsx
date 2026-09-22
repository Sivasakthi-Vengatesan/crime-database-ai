import React from 'react';
import { Calendar, MapPin, Shield, CheckCircle2, User } from 'lucide-react';
import { Evidence } from '../types/chat';

interface EvidenceCardProps {
  evidence: Evidence;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { bg: 'rgba(196, 85, 47, 0.15)', text: '#A8421F', border: 'rgba(196, 85, 47, 0.4)' };
      case 'high':
        return { bg: 'rgba(217, 131, 74, 0.15)', text: '#C4552F', border: 'rgba(217, 131, 74, 0.35)' };
      case 'medium':
        return { bg: '#F4ECE1', text: '#736B5E', border: '#E7DCCC' };
      default:
        return { bg: '#F4ECE1', text: '#9E9484', border: '#E7DCCC' };
    }
  };

  const badge = getSeverityBadge(evidence.severity);

  return (
    <div
      style={{
        backgroundColor: '#FAF6F0',
        borderRadius: '10px',
        border: '1px solid #EAD6C4',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 1px 3px rgba(168, 66, 31, 0.04)',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C4552F')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#EAD6C4')}
    >
      {/* Top Header: Serif Numeral + Case ID + Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Serif-terracotta numeral */}
          <span
            className="font-serif"
            style={{
              color: '#C4552F',
              fontSize: '16px',
              fontWeight: 700,
              minWidth: '18px',
            }}
          >
            {index + 1}.
          </span>

          <span
            className="font-mono"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1A1A1A',
              backgroundColor: '#F0E3D5',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid #EAD6C4',
            }}
          >
            {evidence.caseId}
          </span>

          <span
            style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: '#736B5E',
            }}
          >
            {evidence.crimeType}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`,
            }}
          >
            {evidence.severity}
          </span>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#F4ECE1',
              color: '#736B5E',
              border: '1px solid #E7DCCC',
            }}
          >
            {evidence.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '13.5px',
          color: '#2E2822',
          lineHeight: '1.6',
          margin: 0,
        }}
      >
        {evidence.description}
      </p>

      {/* Footer Meta Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #F0E3D5',
          fontSize: '11.5px',
          color: '#736B5E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="#C4552F" />
            <span>{evidence.location}</span>
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} color="#736B5E" />
            <span>{evidence.date}</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {evidence.victimAge && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <User size={12} color="#736B5E" />
              <span>Victim: {evidence.victimAge}y</span>
            </span>
          )}

          {evidence.similarityScore !== undefined && evidence.similarityScore !== null && (
            <span
              className="font-mono"
              style={{
                color: '#A8421F',
                backgroundColor: '#F0E3D5',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '11px',
              }}
              title="Vector Cosine Similarity Score"
            >
              sim: {evidence.similarityScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
