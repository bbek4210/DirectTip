import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, creatorService } from '../lib/api-service';
import { AuthResponse, CreatorResponse, User } from '../lib/api-types';

// Register mutation
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; walletAddress: string; role: 'creator' | 'viewer' }) => {
      return authService.register(data.email, data.walletAddress, data.role);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      localStorage.setItem('user', JSON.stringify(user));
    },
  });
};

// Login mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      return authService.login(email);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      localStorage.setItem('user', JSON.stringify(user));
    },
  });
};

// Get creator by channel ID query
export const useCreatorByChannelId = (channelId: string | null) => {
  return useQuery({
    queryKey: ['creator', 'channel', channelId],
    queryFn: () => creatorService.getByChannelId(channelId!),
    enabled: !!channelId,
  });
};

// Get creator by ID query
export const useCreatorById = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['creator', 'id', creatorId],
    queryFn: () => creatorService.getById(creatorId!),
    enabled: !!creatorId,
  });
};

// Update creator mutation
export const useUpdateCreatorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; youtubeChannelId: string; walletAddress: string }) => {
      return creatorService.update(data.userId, data.youtubeChannelId, data.walletAddress);
    },
    onSuccess: (creator) => {
      queryClient.invalidateQueries({ queryKey: ['creator'] });
      localStorage.setItem('creator', JSON.stringify(creator));
    },
    onError: (error) => {
      console.error('Failed to update creator:', error);
    },
  });
};

