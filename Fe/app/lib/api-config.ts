// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',

  // Creator
  CREATOR_BY_CHANNEL: (channelId: string) => `/api/creator/${channelId}`,
  CREATOR_BY_ID: (creatorId: string) => `/api/creator/id/${creatorId}`,
  CREATOR_UPDATE: '/api/creator/update',

  // Tips
  TIPS_CREATE: '/api/tips',
  TIPS_BY_CREATOR: (creatorId: string) => `/api/tips/creator/${creatorId}`,
  TIPS_OVERLAY: (creatorId: string) => `/api/tips/overlay/${creatorId}`,
  TIPS_STATUS: (tipId: string) => `/api/tips/${tipId}/status`,
  TIPS_STATS: (creatorId: string) => `/api/tips/stats/${creatorId}`,

  // Health
  HEALTH: '/api/health',
};

// Fetch wrapper with error handling
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}
