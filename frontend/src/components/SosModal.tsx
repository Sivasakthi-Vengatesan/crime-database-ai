import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, AlertOctagon, X, Copy, Check } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMERGENCY_SERVICES = [
  {
    number: '112',
    title: 'National Emergency Response (All-in-One)',
    desc: 'Unified emergency response for Police, Fire, Ambulance & Disaster.',
    color: '#ef4444',
    badge: '24/7 TOLL-FREE',
  },
  {
    number: '1930',
    title: 'National Cyber Financial Crime Helpline',
    desc: 'Instant freeze helpline for cyber banking, UPI fraud & phishing.',
    color: '#3b82f6',
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
    color: '#f97316',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="p-6 md:p-8 w-full max-w-xl space-y-5 bg-white rounded-[28px] border border-gray-200 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-xs">
              <AlertOctagon size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Emergency SOS & Citizen Hotlines
              </h3>
              <p className="text-xs text-gray-500">
                Direct nationwide contact numbers for immediate law enforcement dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {EMERGENCY_SERVICES.map((srv) => (
            <div
              key={srv.number}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-200 transition-all flex items-center justify-between gap-4"
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
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: `${srv.color}15`,
                      color: srv.color,
                      border: `1px solid ${srv.color}30`,
                    }}
                  >
                    {srv.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{srv.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(srv.number)}
                  className="p-2 rounded-xl bg-white hover:bg-gray-100 text-slate-600 border border-gray-200 text-xs flex items-center gap-1 transition-colors shadow-xs"
                  title="Copy Number"
                >
                  {copiedNumber === srv.number ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <a
                  href={`tel:${srv.number}`}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1 shadow-md transition-transform hover:scale-105"
                  style={{ backgroundColor: srv.color }}
                >
                  <PhoneCall size={13} />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-[11px] text-red-700 flex items-start gap-2 font-medium">
          <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-500" />
          <span>If you are in immediate life-threatening danger, dial <strong>112</strong> immediately.</span>
        </div>
      </div>
    </div>
  );
};
