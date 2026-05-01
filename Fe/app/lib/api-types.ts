// API Types and Interfaces

export interface User {
  _id: string;
  email: string;
  walletAddress: string;
  role: 'creator' | 'viewer';
  createdAt: string;
}

export interface Creator {
  _id: string;
  userId: string;
  youtubeChannelId?: string;
  walletAddress: string;
  overlayUrl: string;
  totalDonations: number;
  createdAt: string;
}

export interface Tip {
  _id: string;
  senderWallet: string;
  receiverWallet: string;
  amount: number;
  token: 'SOL' | 'USDC';
  message?: string;
  txSignature?: string;
  status: 'pending' | 'confirmed' | 'failed';
  creatorId: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface CreatorResponse {
  creator: Creator;
}

export interface TipResponse {
  tip: Tip;
}

export interface TipsListResponse {
  tips: Tip[];
}

export interface StatsResponse {
  stats: {
    totalAmount: number;
    totalCount: number;
    avgAmount: number;
  };
}
