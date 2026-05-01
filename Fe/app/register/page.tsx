'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [role, setRole] = useState<'creator' | 'viewer'>('viewer');
  const [error, setError] = useState('');

  const registerMutation = useRegisterMutation();

  const handleConnectWallet = async () => {
    try {
      // @ts-ignore
      const { solana } = window;
      if (!solana) {
        setError('Please install Phantom wallet');
        return;
      }

      const resp = await solana.connect();
      setWalletAddress(resp.publicKey.toString());
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !walletAddress) {
      setError('Please fill in all fields and connect wallet');
      return;
    }

    try {
      const user = await registerMutation.mutateAsync({
        email,
        walletAddress,
        role,
      });
      setUser(user);
      router.push(role === 'creator' ? '/dashboard' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-8 border border-purple-500">
        <h1 className="text-3xl font-bold text-white mb-2">Join DirectTip</h1>
        <p className="text-gray-400 mb-6">Create your account to get started</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Solana Wallet</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                readOnly
                placeholder="Connect your wallet"
                className="flex-1 bg-gray-700 text-gray-400 px-4 py-2 rounded border border-gray-600"
              />
              <button
                type="button"
                onClick={handleConnectWallet}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-bold"
              >
                Connect
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Account Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="creator"
                  checked={role === 'creator'}
                  onChange={(e) => setRole(e.target.value as 'creator' | 'viewer')}
                  className="mr-3"
                />
                <span className="text-gray-300">Creator (Receive tips)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={(e) => setRole(e.target.value as 'creator' | 'viewer')}
                  className="mr-3"
                />
                <span className="text-gray-300">Viewer (Send tips)</span>
              </label>
            </div>
          </div>

          {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">{error}</div>}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded mt-6 disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
