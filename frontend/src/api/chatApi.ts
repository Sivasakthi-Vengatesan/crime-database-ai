import { ChatResponsePayload, DatabaseStats } from '../types/chat';

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
    throw new Error(errorData.answer || `Server responded with status ${response.status}`);
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
