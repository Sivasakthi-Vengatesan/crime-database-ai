import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Upload,
  Copy,
  MessageSquare,
  RefreshCw,
  Building,
  Gavel,
  ShieldCheck,
} from 'lucide-react';
import { ComplaintFormData, ComplaintResponseData } from '../types/chat';
import { submitComplaintApi } from '../api/chatApi';

interface ComplaintSectionProps {
  onInvestigateInChat: (caseId: string, summary: string) => void;
  onViewTracker: (trackingNumber: string) => void;
}

const CRIME_TYPES = [
  { label: 'Theft & Snatching', value: 'Theft', ipc: 'IPC Sec. 379 / BNS Sec. 303' },
  { label: 'Mobile Phone Theft', value: 'Mobile Phone Theft', ipc: 'IPC Sec. 379 / BNS Sec. 303' },
  { label: 'Vehicle Theft', value: 'Vehicle Theft', ipc: 'IPC Sec. 379/411 / BNS Sec. 303(2)' },
  { label: 'Cyber Crime & Online Fraud', value: 'Cyber Crime', ipc: 'IT Act Sec. 66D & IPC Sec. 420' },
  { label: 'Armed Robbery', value: 'Robbery', ipc: 'IPC Sec. 392 / BNS Sec. 309' },
  { label: 'Burglary & Housebreaking', value: 'Burglary', ipc: 'IPC Sec. 454 / BNS Sec. 331' },
  { label: 'Physical Assault', value: 'Assault', ipc: 'IPC Sec. 323 / BNS Sec. 115' },
  { label: 'Harassment & Stalking', value: 'Harassment', ipc: 'IPC Sec. 354D / BNS Sec. 78' },
  { label: 'Missing Person', value: 'Missing Person', ipc: 'CrPC Sec. 100 Priority SAR' },
  { label: 'Financial Scam & Cheating', value: 'Fraud', ipc: 'IPC Sec. 420 / BNS Sec. 318' },
];

const CITIES = [
  'Chennai',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export const ComplaintSection: React.FC<ComplaintSectionProps> = ({
  onInvestigateInChat,
  onViewTracker,
}) => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    complainantName: '',
    contactPhone: '',
    contactEmail: '',
    crimeType: 'Theft',
    location: 'Chennai',
    incidentDate: new Date().toISOString().split('T')[0],
    description: '',
    victimAge: '',
    suspectAge: '',
    suspectDetails: '',
    severity: 'Medium',
    landmark: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<ComplaintResponseData | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const selectedCrimeObj = CRIME_TYPES.find((c) => c.value === formData.crimeType) || CRIME_TYPES[0];

  // Live estimated AI urgency
  const calculateLiveUrgency = (text: string, type: string) => {
    const t = text.toLowerCase();
    if (t.includes('weapon') || t.includes('gun') || t.includes('knife') || t.includes('blood') || t.includes('hospital') || type === 'Robbery') {
      return { level: 'Critical', color: '#f43f5e', score: 95 };
    }
    if (t.includes('injury') || t.includes('threat') || t.includes('lakh') || type === 'Assault' || type === 'Burglary') {
      return { level: 'High', color: '#f59e0b', score: 75 };
    }
    if (type === 'Cyber Crime' || type === 'Theft' || type === 'Vehicle Theft' || type === 'Mobile Phone Theft') {
      return { level: 'Medium', color: '#06b6d4', score: 50 };
    }
    return { level: 'Low', color: '#10b981', score: 25 };
  };

  const liveAiAssessment = calculateLiveUrgency(formData.description, formData.crimeType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.complainantName.trim()) {
      setErrorMsg('Please enter the complainant full name.');
      return;
    }
    if (formData.description.trim().length < 10) {
      setErrorMsg('Please provide a detailed incident description (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitComplaintApi({
        ...formData,
        severity: liveAiAssessment.level,
      });
      setSuccessReceipt(response);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit complaint. Please check server connectivity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyFIR = () => {
    if (successReceipt) {
      navigator.clipboard.writeText(successReceipt.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  const handleReset = () => {
    setSuccessReceipt(null);
    setFormData({
      complainantName: '',
      contactPhone: '',
      contactEmail: '',
      crimeType: 'Theft',
      location: 'Chennai',
      incidentDate: new Date().toISOString().split('T')[0],
      description: '',
      victimAge: '',
      suspectAge: '',
      suspectDetails: '',
      severity: 'Medium',
      landmark: '',
    });
    setUploadedFiles([]);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="animate-spin" />
            AI-Assisted Citizen Police Intake Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
            Register e-FIR & Citizen Complaint
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit a real-time incident report. The record is instantly triaged, legal citations assigned, and vector-embedded into the active database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="radar-blip bg-emerald-400"></span>
            Direct Vector Pipeline Active
          </div>
        </div>
      </div>

      {/* Success Receipt State */}
      {successReceipt ? (
        <div className="cyber-panel p-6 md:p-8 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  e-FIR Successfully Registered & Indexed
                </h3>
                <p className="text-xs text-slate-400">
                  Digitally signed and added to the official Crime Intelligence Ledger.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">FIR Tracking Number</div>
                <div className="text-lg font-bold font-mono text-cyan-400">{successReceipt.trackingNumber}</div>
              </div>
              <button
                onClick={handleCopyFIR}
                className="p-2 ml-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                title="Copy FIR Number"
              >
                {copied ? <ShieldCheck size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Incident Category</span>
              <span className="text-sm font-semibold text-white">{successReceipt.crimeType}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Jurisdiction City</span>
              <span className="text-sm font-semibold text-white">{successReceipt.location}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Assigned Priority</span>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono"
                style={{
                  backgroundColor:
                    successReceipt.severity === 'Critical'
                      ? 'rgba(244,63,94,0.2)'
                      : successReceipt.severity === 'High'
                      ? 'rgba(245,158,11,0.2)'
                      : 'rgba(6,182,212,0.2)',
                  color:
                    successReceipt.severity === 'Critical'
                      ? '#f43f5e'
                      : successReceipt.severity === 'High'
                      ? '#f59e0b'
                      : '#06b6d4',
                }}
              >
                {successReceipt.severity} Priority
              </span>
            </div>
          </div>

          {/* Legal Section & Police Station */}
          <div className="space-y-3 mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
            <div className="flex items-start gap-2">
              <Gavel size={16} className="text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase">Applicable Statutory Penal Section:</span>
                <p className="text-sm text-slate-200 mt-0.5 font-medium">{successReceipt.recommendedPenalCode}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building size={16} className="text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase">Jurisdiction Police Command:</span>
                <p className="text-sm text-slate-200 mt-0.5">{successReceipt.assignedPoliceStation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase">AI Triage Summary:</span>
                <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{successReceipt.aiTriageSummary}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl btn-secondary text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw size={15} />
              File Another Complaint
            </button>
            <button
              onClick={() => onViewTracker(successReceipt.trackingNumber)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center gap-2 transition-all"
            >
              <FileText size={15} />
              Track Investigation Timeline
            </button>
            <button
              onClick={() =>
                onInvestigateInChat(
                  successReceipt.trackingNumber,
                  `Investigate recently filed FIR ${successReceipt.trackingNumber} for ${successReceipt.crimeType} in ${successReceipt.location}`
                )
              }
              className="px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Ask AI About This FIR
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Intake Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-shake">
              <AlertTriangle size={18} className="text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Complainant Identification */}
              <div className="cyber-panel p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-sm font-semibold text-slate-200">
                  <User size={16} className="text-cyan-400" />
                  1. Complainant Details (Citizen / Officer)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Legal Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.complainantName}
                      onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Contact Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address (For FIR Notification)
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="citizen@domain.com"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Incident Classification & Location */}
              <div className="cyber-panel p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-sm font-semibold text-slate-200">
                  <ShieldAlert size={16} className="text-cyan-400" />
                  2. Incident Classification & Geography
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Crime Category <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.crimeType}
                      onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                    >
                      {CRIME_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      City Jurisdiction <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city} className="bg-slate-900 text-white">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Incident Date <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={formData.incidentDate}
                        onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Specific Landmark / Street
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Near T. Nagar Bus Terminal"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Incident Narrative & Suspect Info */}
              <div className="cyber-panel p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-sm font-semibold text-slate-200">
                  <FileText size={16} className="text-cyan-400" />
                  3. Narrative Incident Statement & Suspect Details
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Detailed Incident Narrative <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formData.description.length}/2000 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    maxLength={2000}
                    placeholder="Describe what occurred, items stolen, modus operandi, sequence of events, or online transaction details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Victim Age (Optional)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      placeholder="e.g. 28"
                      value={formData.victimAge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          victimAge: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Suspect Est. Age
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      placeholder="e.g. 25"
                      value={formData.suspectAge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          suspectAge: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Suspect Identifiers
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Red jacket, black bike"
                      value={formData.suspectDetails}
                      onChange={(e) => setFormData({ ...formData, suspectDetails: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Evidence Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Attach Digital Evidence / Photos / Receipts (Optional)
                  </label>
                  <label className="border border-dashed border-white/15 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/60 transition-all">
                    <Upload size={20} className="text-cyan-400 mb-1" />
                    <span className="text-xs text-slate-300">Click to upload photos, CCTV clips, or transaction PDFs</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleMockFileUpload}
                    />
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {uploadedFiles.map((file, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                        >
                          📎 {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Live AI Triage Radar */}
            <div className="space-y-6">
              <div className="cyber-panel-glow p-5 sticky top-24 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                    <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                    Live AI Triage Engine
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    REALTIME
                  </span>
                </div>

                {/* Risk Gauge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Assessed Threat Level:</span>
                    <span
                      className="font-bold font-mono px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${liveAiAssessment.color}20`,
                        color: liveAiAssessment.color,
                        border: `1px solid ${liveAiAssessment.color}40`,
                      }}
                    >
                      {liveAiAssessment.level} ({liveAiAssessment.score}/100)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${liveAiAssessment.score}%`,
                        backgroundColor: liveAiAssessment.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Predicted Legal Citation */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                    <Gavel size={12} />
                    Statutory Mapping
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{selectedCrimeObj.ipc}</div>
                </div>

                {/* Assigned Station Route */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                    <Building size={12} />
                    Jurisdiction Command
                  </div>
                  <div className="text-xs text-slate-200">
                    {formData.location} {formData.crimeType === 'Cyber Crime' ? 'Cyber Forensics Wing' : 'Central Zonal PS'}
                  </div>
                </div>

                {/* Vector Database Info */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed">
                  🛡️ <strong>Auto-Index Notice:</strong> Upon registration, this report will be embedded (384 dimensions) and immediately made queryable through conversational AI.
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Generating e-FIR & Embeddings...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Register & Index e-FIR
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
