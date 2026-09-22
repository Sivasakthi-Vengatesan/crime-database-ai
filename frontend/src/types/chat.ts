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
