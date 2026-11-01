import {
  Scheme,
  EligibilityCheckResponse,
  HealthStatus,
  Language,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Common fetch wrapper with detailed error reporting
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP ${res.status}: Failed to fetch ${endpoint}`);
    }

    return data as T;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export async function fetchHealth(): Promise<HealthStatus> {
  return request<HealthStatus>('/health');
}

export async function fetchSchemes(params?: {
  search?: string;
  category?: string;
  state?: string;
  limit?: number;
  offset?: number;
}): Promise<{ schemes: Scheme[]; total: number; source: string }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
  if (params?.state) searchParams.set('state', params.state);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return request<{ schemes: Scheme[]; total: number; source: string }>(
    `/schemes${query ? `?${query}` : ''}`
  );
}

export async function fetchCategories(): Promise<{ categories: string[] }> {
  return request<{ categories: string[] }>('/schemes/categories');
}

export async function fetchSchemeById(idOrCode: string): Promise<{ scheme: Scheme; source: string }> {
  return request<{ scheme: Scheme; source: string }>(`/schemes/${encodeURIComponent(idOrCode)}`);
}

export async function checkEligibility(payload: {
  profile: Record<string, any>;
  schemeId?: string;
  language?: Language;
  includeExplanations?: boolean;
}): Promise<EligibilityCheckResponse> {
  return request<EligibilityCheckResponse>('/eligibility/check', {
    method: 'POST',
    body: JSON.stringify({
      language: 'en',
      includeExplanations: true,
      ...payload,
    }),
  });
}

export async function sendChatMessage(payload: {
  message: string;
  currentProfile?: Record<string, any>;
  language?: Language;
}): Promise<{
  reply: string;
  updatedProfile: Record<string, any>;
  evaluation: {
    potentiallyEligible: any[];
    needsInformation: any[];
    notEligibleCount: number;
  };
  missingFields: string[];
  isAiGenerated: boolean;
}> {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function extractProfile(payload: {
  text: string;
  existingProfile?: Record<string, any>;
}): Promise<{
  profile: Record<string, any>;
  isAiExtracted: boolean;
  missingFields: string[];
  followUpQuestionEn?: string;
  followUpQuestionHi?: string;
}> {
  return request('/profile/extract', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function adminFetchSchemes(): Promise<{ schemes: Scheme[]; source: string }> {
  return request<{ schemes: Scheme[]; source: string }>('/admin/schemes');
}

export async function adminCreateScheme(
  schemeData: any,
  adminKey: string
): Promise<{ message: string; scheme: Scheme }> {
  return request('/admin/schemes', {
    method: 'POST',
    headers: {
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(schemeData),
  });
}

export async function adminUpdateStatus(
  schemeId: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  adminKey: string
): Promise<{ message: string; scheme: Scheme }> {
  return request(`/admin/schemes/${encodeURIComponent(schemeId)}/status`, {
    method: 'PATCH',
    headers: {
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ status }),
  });
}

export async function adminFetchAuditLogs(): Promise<{ logs: any[] }> {
  return request<{ logs: any[] }>('/admin/audit-logs');
}
