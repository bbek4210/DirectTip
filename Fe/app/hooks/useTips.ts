import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tipService } from '../lib/api-service';
import { Tip } from '../lib/api-types';

// Create tip mutation
export const useCreateTipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      senderWallet: string;
      receiverWallet: string;
      amount: number;
      token: string;
      message?: string;
      txSignature?: string;
      creatorId?: string;
    }) => {
      return tipService.create(
        data.senderWallet,
        data.receiverWallet,
        data.amount,
        data.token,
        data.message,
        data.txSignature,
        data.creatorId
      );
    },
    onSuccess: (tip) => {
      // Invalidate tips queries to refetch
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      // Optionally add the new tip to the cache
      queryClient.setQueryData(['tips', 'recent'], (old: Tip[] = []) => [tip, ...old]);
    },
    onError: (error) => {
      console.error('Failed to create tip:', error);
    },
  });
};

// Get tips for creator query
export const useTipsByCreator = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['tips', 'creator', creatorId],
    queryFn: () => tipService.getByCreator(creatorId!),
    enabled: !!creatorId,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 2000, // Data is stale after 2 seconds
  });
};

// Get overlay tips query (real-time)
export const useOverlayTips = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['tips', 'overlay', creatorId],
    queryFn: () => tipService.getOverlay(creatorId!),
    enabled: !!creatorId,
    refetchInterval: 2000, // Refetch every 2 seconds for real-time
    staleTime: 1000, // Data is stale after 1 second
  });
};

// Update tip status mutation
export const useUpdateTipStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { tipId: string; status: 'pending' | 'confirmed' | 'failed' }) => {
      return tipService.updateStatus(data.tipId, data.status);
    },
    onSuccess: (updatedTip) => {
      // Invalidate all tips queries
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      // Update local cache if available
      queryClient.setQueryData(['tips', 'recent'], (old: Tip[] = []) =>
        old.map((tip) => (tip._id === updatedTip._id ? updatedTip : tip))
      );
    },
    onError: (error) => {
      console.error('Failed to update tip status:', error);
    },
  });
};

// Get tip stats query
export const useTipStats = (creatorId: string | null) => {
  return useQuery({
    queryKey: ['tips', 'stats', creatorId],
    queryFn: () => tipService.getStats(creatorId!),
    enabled: !!creatorId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

// Hook to get all tips with filtering
export const useAllTips = (creatorId: string | null) => {
  const tipsQuery = useTipsByCreator(creatorId);
  const statsQuery = useTipStats(creatorId);

  return {
    tips: tipsQuery.data || [],
    stats: statsQuery.data,
    isLoading: tipsQuery.isLoading || statsQuery.isLoading,
    error: tipsQuery.error || statsQuery.error,
    refetch: () => {
      tipsQuery.refetch();
      statsQuery.refetch();
    },
  };
};

