export interface Evidence {
  caseId: string;
  crimeType: string;
  location: string;
  date: string;
  status: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  description: string;
  victimAge?: number | null;
  suspectAge?: number | null;
  similarityScore?: number | null;
}

export interface ReasoningStep {
  stepName: string;
  description: string;
  details?: string;
  durationMs?: number;
}

export interface ChatResponsePayload {
  answer: string;
  evidence: Evidence[];
  reasoning: ReasoningStep[];
  terminalLog?: string;
  totalFound: number;
  sessionId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  evidence?: Evidence[];
  reasoning?: ReasoningStep[];
  terminalLog?: string;
  timestamp: string;
  isError?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  lastUpdated: string;
  messages: ChatMessage[];
}

export interface DatabaseStats {
  totalRecords: number;
  status: string;
  embeddingModel: string;
  vectorEngine: string;
  isSyntheticData: boolean;
  disclaimer: string;
}

export interface ComplaintFormData {
  complainantName: string;
  contactPhone: string;
  contactEmail: string;
  crimeType: string;
  location: string;
  incidentDate: string;
  description: string;
  victimAge?: number | '';
  suspectAge?: number | '';
  suspectDetails?: string;
  severity: string;
  landmark?: string;
}

export interface ComplaintResponseData {
  trackingNumber: string;
  caseId: string;
  status: string;
  severity: string;
  crimeType: string;
  location: string;
  incidentDate: string;
  complainantName: string;
  aiTriageSummary: string;
  recommendedPenalCode: string;
  assignedPoliceStation: string;
  createdAt: string;
  message: string;
  investigationMilestones?: string[];
}

export interface CrimeRecordItem {
  id: number;
  caseId: string;
  crimeType: string;
  location: string;
  incidentDate: string;
  description: string;
  status: string;
  severity: string;
  victimAge?: number | null;
  suspectAge?: number | null;
}

export interface AnalyticsData {
  totalRecords: number;
  solvedRate: number;
  openCases: number;
  underInvestigationCases: number;
  closedCases: number;
  severityCounts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  cityDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  recentHotspots: CrimeRecordItem[];
}
