import { fetchAPI, API_ENDPOINTS } from './api-config';
import {
  AuthResponse,
  CreatorResponse,
  TipResponse,
  TipsListResponse,
  StatsResponse,
  User,
  Creator,
  Tip,
} from './api-types';

// ============ AUTH SERVICES ============
export const authService = {
  async register(email: string, walletAddress: string, role: 'creator' | 'viewer'): Promise<User> {
    const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, walletAddress, role }),
    });
    return response.user;
  },

  async login(email: string): Promise<User> {
    const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.user;
  },
};

// ============ CREATOR SERVICES ============
export const creatorService = {
  async getByChannelId(channelId: string): Promise<Creator> {
    const response = await fetchAPI<CreatorResponse>(
      API_ENDPOINTS.CREATOR_BY_CHANNEL(channelId)
    );
    return response.creator;
  },

  async getById(creatorId: string): Promise<Creator> {
    const response = await fetchAPI<CreatorResponse>(
      API_ENDPOINTS.CREATOR_BY_ID(creatorId)
    );
    return response.creator;
  },

  async update(userId: string, youtubeChannelId: string, walletAddress: string): Promise<Creator> {
    const response = await fetchAPI<CreatorResponse>(API_ENDPOINTS.CREATOR_UPDATE, {
      method: 'POST',
      body: JSON.stringify({ userId, youtubeChannelId, walletAddress }),
    });
    return response.creator;
  },
};

// ============ TIP SERVICES ============
export const tipService = {
  async create(
    senderWallet: string,
    receiverWallet: string,
    amount: number,
    token: string,
    message?: string,
    txSignature?: string,
    creatorId?: string
  ): Promise<Tip> {
    const response = await fetchAPI<TipResponse>(API_ENDPOINTS.TIPS_CREATE, {
      method: 'POST',
      body: JSON.stringify({
        senderWallet,
        receiverWallet,
        amount,
        token,
        message,
        txSignature,
        creatorId,
      }),
    });
    return response.tip;
  },

  async getByCreator(creatorId: string): Promise<Tip[]> {
    const response = await fetchAPI<TipsListResponse>(
      API_ENDPOINTS.TIPS_BY_CREATOR(creatorId)
    );
    return response.tips || [];
  },

  async getOverlay(creatorId: string): Promise<Tip[]> {
    const response = await fetchAPI<TipsListResponse>(
      API_ENDPOINTS.TIPS_OVERLAY(creatorId)
    );
    return response.tips || [];
  },

  async updateStatus(tipId: string, status: 'pending' | 'confirmed' | 'failed'): Promise<Tip> {
    const response = await fetchAPI<TipResponse>(API_ENDPOINTS.TIPS_STATUS(tipId), {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
    return response.tip;
  },

  async getStats(creatorId: string): Promise<{
    totalAmount: number;
    totalCount: number;
    avgAmount: number;
  }> {
    const response = await fetchAPI<StatsResponse>(API_ENDPOINTS.TIPS_STATS(creatorId));
    return response.stats;
  },
};

// ============ HEALTH CHECK ============
export const healthService = {
  async check(): Promise<{ status: string }> {
    return fetchAPI(API_ENDPOINTS.HEALTH);
  },
};
