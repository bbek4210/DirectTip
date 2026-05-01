'use client';

import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCreateTipMutation } from '../hooks/useTips';

export default function TipModal({ creatorWallet, onClose }: { creatorWallet: string; onClose: () => void }) {
  const [amount, setAmount] = useState('0.1');
  const [token, setToken] = useState('SOL');
  const [message, setMessage] = useState('');
  const createTipMutation = useCreateTipMutation();

  const handleDonate = async () => {
    try {
      const { solana } = window as any;
      if (!solana) {
        alert('Please install Phantom wallet');
        return;
      }

      const resp = await solana.connect();
      const senderWallet = resp.publicKey.toString();

      // Create transaction
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(senderWallet),
          toPubkey: new PublicKey(creatorWallet),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signed = await solana.signTransaction(transaction);

      // Store tip in backend using the mutation hook
      await createTipMutation.mutateAsync({
        senderWallet,
        receiverWallet: creatorWallet,
        amount: parseFloat(amount),
        token,
        message,
        txSignature: 'pending',
      });

      alert('Tip sent! Thank you for supporting the creator.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Transaction failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md border border-purple-500">
        <h2 className="text-2xl font-bold mb-6 text-white">Send a Tip</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Token</label>
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option>SOL</option>
              <option>USDC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDonate}
              disabled={createTipMutation.isPending}
              className="flex-1 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {createTipMutation.isPending ? 'Processing...' : 'Send Tip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
