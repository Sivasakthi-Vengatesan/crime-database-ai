import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, AlertOctagon, X, Copy, Check, ExternalLink } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMERGENCY_SERVICES = [
  {
    number: '112',
    title: 'National Emergency Response (All-in-One)',
    desc: 'Unified emergency response for Police, Fire, Ambulance & Disaster.',
    color: '#f43f5e',
    badge: '24/7 TOLL-FREE',
  },
  {
    number: '1930',
    title: 'National Cyber Financial Crime Reporting',
    desc: 'Instant freeze helpline for cyber banking, UPI fraud & phishing.',
    color: '#06b6d4',
    badge: 'CYBER HELPLINE',
  },
  {
    number: '1090',
    title: 'Women Helpline & Anti-Harassment',
    desc: 'Confidential reporting for stalking, domestic abuse & harassment.',
    color: '#ec4899',
    badge: 'PRIORITY',
  },
  {
    number: '1098',
    title: 'Childline Emergency Service',
    desc: 'Protection, rescue and counseling helpline for children in distress.',
    color: '#f59e0b',
    badge: 'CHILD PROTECTION',
  },
  {
    number: '108',
    title: 'Disaster & Medical Ambulance',
    desc: 'Emergency trauma ambulance and critical medical response.',
    color: '#10b981',
    badge: 'MEDICAL',
  },
];

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="cyber-panel p-6 w-full max-w-xl space-y-5 bg-slate-900/95 border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.2)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertOctagon size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Emergency SOS & Citizen Hotlines
              </h3>
              <p className="text-xs text-slate-400">
                Direct nationwide contact numbers for immediate law enforcement dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {EMERGENCY_SERVICES.map((srv) => (
            <div
              key={srv.number}
              className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-bold font-mono"
                    style={{ color: srv.color }}
                  >
                    {srv.number}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${srv.color}20`,
                      color: srv.color,
                      border: `1px solid ${srv.color}40`,
                    }}
                  >
                    {srv.badge}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{srv.title}</h4>
                <p className="text-[11px] text-slate-400">{srv.desc}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(srv.number)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Copy Number"
                >
                  {copiedNumber === srv.number ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <a
                  href={`tel:${srv.number}`}
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white flex items-center gap-1 shadow-md transition-transform hover:scale-105"
                  style={{ backgroundColor: srv.color }}
                >
                  <PhoneCall size={13} />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300 flex items-start gap-2">
          <ShieldAlert size={14} className="shrink-0 mt-0.5" />
          <span>If you are in immediate life-threatening danger, dial <strong>112</strong> immediately.</span>
        </div>
      </div>
    </div>
  );
};
