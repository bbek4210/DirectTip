'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTipStore } from '../store/tipStore';
import { useTipsByCreator, useTipStats } from '../hooks/useTips';
import { useUpdateCreatorMutation } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { tips, setTips } = useTipStore();
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const updateCreatorMutation = useUpdateCreatorMutation();
  const { data: tipsData, isLoading: tipsLoading } = useTipsByCreator(creatorId);
  const { data: statsData } = useTipStats(creatorId);

  useEffect(() => {
    if (user) {
      setCreatorId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (tipsData?.tips) {
      setTips(tipsData.tips);
    }
  }, [tipsData, setTips]);

  const handleUpdateCreator = async () => {
    if (!user) return;
    try {
      await updateCreatorMutation.mutateAsync({
        userId: user._id,
        youtubeChannelId,
        walletAddress,
      });
      alert('Creator info updated!');
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update creator info');
    }
  };

  const totalDonations = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const stats = statsData?.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Creator Dashboard</h1>

        {/* Creator Setup */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-purple-500">
          <h2 className="text-2xl font-bold mb-4">Creator Setup</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">YouTube Channel ID</label>
              <input
                type="text"
                value={youtubeChannelId}
                onChange={(e) => setYoutubeChannelId(e.target.value)}
                placeholder="Enter your YouTube channel ID"
                className="w-full bg-gray-700 px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Solana Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="w-full bg-gray-700 px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleUpdateCreator}
              disabled={updateCreatorMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-bold disabled:opacity-50"
            >
              {updateCreatorMutation.isPending ? 'Saving...' : 'Save Creator Info'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
            <div className="text-gray-400 text-sm">Total Donations</div>
            <div className="text-3xl font-bold mt-2">
              {stats?.totalAmount?.toFixed(2) || '0'} SOL
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500">
            <div className="text-gray-400 text-sm">Number of Tips</div>
            <div className="text-3xl font-bold mt-2">{stats?.totalCount || 0}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
            <div className="text-gray-400 text-sm">Avg Tip Size</div>
            <div className="text-3xl font-bold mt-2">
              {stats?.avgAmount?.toFixed(2) || '0'} SOL
            </div>
          </div>
        </div>

        {/* Recent Tips */}
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
          <h2 className="text-2xl font-bold mb-4">Recent Tips</h2>
          <div className="space-y-3">
            {tipsLoading ? (
              <p className="text-gray-400">Loading tips...</p>
            ) : tips.length > 0 ? (
              tips.slice(0, 10).map((tip) => (
                <div key={tip._id} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">
                        {tip.amount} {tip.token}
                      </div>
                      <div className="text-sm text-gray-400">
                        from {tip.senderWallet.slice(0, 6)}...
                      </div>
                      {tip.message && (
                        <div className="text-sm text-gray-300 mt-2 italic">"{tip.message}"</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      tip.status === 'confirmed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {tip.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No tips yet. Share your overlay URL to start receiving donations!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
