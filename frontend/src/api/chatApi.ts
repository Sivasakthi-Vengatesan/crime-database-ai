import {
  ChatResponsePayload,
  DatabaseStats,
  ComplaintFormData,
  ComplaintResponseData,
  CrimeRecordItem,
  AnalyticsData,
} from '../types/chat';

const API_BASE = '/api';

export async function sendChatMessage(message: string, sessionId?: string): Promise<ChatResponsePayload> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.answer || errorData.message || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSampleQueries(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/sample-queries`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Could not fetch sample queries from backend, using fallback list', e);
  }
  return [
    'Show theft cases in Chennai.',
    'Find cybercrime cases in Bengaluru.',
    'Show unresolved cases in Mumbai.',
    'Find mobile phone theft cases involving young victims.',
    'Show robbery cases reported during 2026.',
    'Find cases similar to a mobile phone being stolen from a railway passenger.',
    'Which cases are still under investigation?',
    'Show high severity cases in Delhi.'
  ];
}

export async function fetchDatabaseStats(): Promise<DatabaseStats | null> {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Could not fetch database stats', e);
  }
  return null;
}

export async function clearSessionApi(sessionId?: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/chat/clear?sessionId=${encodeURIComponent(sessionId || '')}`, {
      method: 'POST'
    });
  } catch (e) {
    console.warn('Could not clear session on backend', e);
  }
}

export async function submitComplaintApi(data: ComplaintFormData): Promise<ComplaintResponseData> {
  const response = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      victimAge: data.victimAge === '' ? null : Number(data.victimAge),
      suspectAge: data.suspectAge === '' ? null : Number(data.suspectAge),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to submit complaint (HTTP ${response.status})`);
  }

  return response.json();
}

export async function trackComplaintApi(trackingNumber: string): Promise<ComplaintResponseData> {
  const response = await fetch(`${API_BASE}/complaints/track/${encodeURIComponent(trackingNumber.trim())}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `No complaint found for ID "${trackingNumber}"`);
  }
  return response.json();
}

export async function fetchCrimeRecordsApi(filters?: {
  location?: string;
  crimeType?: string;
  status?: string;
  severity?: string;
  search?: string;
}): Promise<CrimeRecordItem[]> {
  const params = new URLSearchParams();
  if (filters?.location) params.append('location', filters.location);
  if (filters?.crimeType) params.append('crimeType', filters.crimeType);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`${API_BASE}/records?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch records (HTTP ${response.status})`);
  }
  return response.json();
}

export async function fetchAnalyticsApi(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics (HTTP ${response.status})`);
  }
  return response.json();
}
