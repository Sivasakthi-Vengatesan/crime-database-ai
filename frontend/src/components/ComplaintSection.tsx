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

  const calculateLiveUrgency = (text: string, type: string) => {
    const t = text.toLowerCase();
    if (t.includes('weapon') || t.includes('gun') || t.includes('knife') || t.includes('blood') || t.includes('hospital') || type === 'Robbery') {
      return { level: 'Critical', color: '#ef4444', score: 95 };
    }
    if (t.includes('injury') || t.includes('threat') || t.includes('lakh') || type === 'Assault' || type === 'Burglary') {
      return { level: 'High', color: '#f97316', score: 75 };
    }
    if (type === 'Cyber Crime' || type === 'Theft' || type === 'Vehicle Theft' || type === 'Mobile Phone Theft') {
      return { level: 'Medium', color: '#3b82f6', score: 50 };
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8 overflow-y-auto pb-24 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <Sparkles size={13} className="text-red-500 animate-spin" />
            AI-Assisted Citizen & Officer Intake Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Register e-FIR / Incident Complaint
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            File an official incident report. CrimsonLogic AI automatically analyzes the statement, calculates threat severity, assigns penal codes, and indexes the record for instant retrieval.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-red"></span>
          Direct pgvector Pipeline Active
        </div>
      </div>

      {/* Success Receipt State */}
      {successReceipt ? (
        <div className="p-6 md:p-8 rounded-[28px] bg-white border border-emerald-200 shadow-xl shadow-emerald-500/5 animate-fadeIn">
          <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  e-FIR Successfully Registered & Indexed
                </h3>
                <p className="text-xs text-gray-500">
                  Digitally assigned to the official Crime Intelligence Ledger.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 text-white rounded-2xl px-4 py-2 shadow-md">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">FIR Tracking Number</div>
                <div className="text-base sm:text-lg font-bold font-mono text-red-400">{successReceipt.trackingNumber}</div>
              </div>
              <button
                onClick={handleCopyFIR}
                className="p-2 ml-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Copy FIR Number"
              >
                {copied ? <ShieldCheck size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1 font-mono uppercase">Incident Category</span>
              <span className="text-sm font-bold text-slate-800">{successReceipt.crimeType}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1 font-mono uppercase">Jurisdiction City</span>
              <span className="text-sm font-bold text-slate-800">{successReceipt.location}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1 font-mono uppercase">Assigned Priority</span>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-red-100 text-red-700">
                {successReceipt.severity} Priority
              </span>
            </div>
          </div>

          {/* Legal Section */}
          <div className="space-y-3 mb-6 p-4 rounded-2xl bg-red-50/60 border border-red-100">
            <div className="flex items-start gap-2.5">
              <Gavel size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-red-700 font-bold uppercase">Statutory Penal Citation:</span>
                <p className="text-sm text-slate-800 font-semibold mt-0.5">{successReceipt.recommendedPenalCode}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Building size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-red-700 font-bold uppercase">Police Jurisdiction:</span>
                <p className="text-sm text-slate-700 mt-0.5">{successReceipt.assignedPoliceStation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-mono text-red-700 font-bold uppercase">AI Triage Summary:</span>
                <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{successReceipt.aiTriageSummary}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-slate-700 text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={15} />
              File Another Report
            </button>
            <button
              onClick={() => onViewTracker(successReceipt.trackingNumber)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md"
            >
              <FileText size={15} />
              Track Investigation
            </button>
            <button
              onClick={() =>
                onInvestigateInChat(
                  successReceipt.trackingNumber,
                  `Investigate newly registered FIR ${successReceipt.trackingNumber} for ${successReceipt.crimeType} in ${successReceipt.location}`
                )
              }
              className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-red-500/25"
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
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Complainant Identification */}
              <div className="p-6 rounded-[28px] bg-white border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-sm font-bold text-slate-800">
                  <User size={16} className="text-red-500" />
                  1. Complainant Identification
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.complainantName}
                      onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address (For Case Notifications)
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="citizen@domain.com"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification & Location */}
              <div className="p-6 rounded-[28px] bg-white border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-sm font-bold text-slate-800">
                  <ShieldAlert size={16} className="text-red-500" />
                  2. Incident Classification & Geography
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Crime Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.crimeType}
                      onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
                    >
                      {CRIME_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City Jurisdiction <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Incident Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.incidentDate}
                        onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Landmark / Exact Address
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Near T. Nagar Bus Terminal"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statement & Details */}
              <div className="p-6 rounded-[28px] bg-white border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-sm font-bold text-slate-800">
                  <FileText size={16} className="text-red-500" />
                  3. Incident Statement & Suspect Details
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Incident Description <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {formData.description.length}/2000 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    maxLength={2000}
                    placeholder="Describe what occurred, items stolen, modus operandi, sequence of events, vehicle number, or online transaction details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Victim Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      value={formData.victimAge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          victimAge: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Suspect Est. Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      value={formData.suspectAge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          suspectAge: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Suspect Features
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Black bike, helmet"
                      value={formData.suspectDetails}
                      onChange={(e) => setFormData({ ...formData, suspectDetails: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Attach Digital Evidence / CCTV Clips / Receipts (Optional)
                  </label>
                  <label className="border border-dashed border-gray-300 hover:border-red-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                    <Upload size={20} className="text-red-500 mb-1" />
                    <span className="text-xs text-gray-600">Click to upload photos, CCTV screenshots, or bank statements</span>
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
                          className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-medium"
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
              <div className="p-6 rounded-[28px] bg-white border border-red-200 shadow-lg shadow-red-500/5 sticky top-24 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Sparkles size={16} className="text-red-500" />
                    Live AI Triage Engine
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold border border-red-200">
                    REALTIME
                  </span>
                </div>

                {/* Threat Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Assessed Threat Level:</span>
                    <span
                      className="font-bold font-mono px-2.5 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: `${liveAiAssessment.color}15`,
                        color: liveAiAssessment.color,
                        border: `1px solid ${liveAiAssessment.color}30`,
                      }}
                    >
                      {liveAiAssessment.level} ({liveAiAssessment.score}/100)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${liveAiAssessment.score}%`,
                        backgroundColor: liveAiAssessment.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Statutory Mapping */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-[11px] font-mono text-red-600 font-bold uppercase flex items-center gap-1.5">
                    <Gavel size={12} />
                    Statutory Mapping
                  </div>
                  <div className="text-xs text-slate-800 font-bold">{selectedCrimeObj.ipc}</div>
                </div>

                {/* Station Routing */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-[11px] font-mono text-slate-700 font-bold uppercase flex items-center gap-1.5">
                    <Building size={12} />
                    Jurisdiction Command
                  </div>
                  <div className="text-xs text-slate-700">
                    {formData.location} {formData.crimeType === 'Cyber Crime' ? 'Cyber Forensics Wing' : 'Central Zonal PS'}
                  </div>
                </div>

                {/* Notice */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-[11px] text-orange-800 leading-relaxed font-medium">
                  🛡️ <strong>Auto-Index Notice:</strong> Upon registration, this report will be embedded (384 dimensions) and immediately made queryable through conversational AI.
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/25 transition-all active:scale-95"
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
