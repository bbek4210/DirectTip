'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { useCreateTipMutation } from '../../hooks/useTips';

export default function TipPage() {
  const params = useParams();
  const creatorWallet = params.wallet as string;

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const createTipMutation = useCreateTipMutation();

  const handleTip = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    // @ts-ignore
    if (!window.solana || !window.solana.isPhantom) {
      setError('Please install Phantom wallet');
      return;
    }

    try {
      setError('');
      setStatus('Connecting wallet...');

      // @ts-ignore
      const resp = await window.solana.connect();
      const senderWallet = resp.publicKey.toString();
      const receiverWallet = creatorWallet;

      setStatus('Preparing transaction...');
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(senderWallet),
          toPubkey: new PublicKey(receiverWallet),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(senderWallet);

      setStatus('Signing transaction...');
      // @ts-ignore
      const signed = await window.solana.signTransaction(transaction);
      const sig = await connection.sendRawTransaction(signed.serialize());

      setStatus('Confirming on blockchain...');
      await connection.confirmTransaction(sig);

      // Record tip in backend
      await createTipMutation.mutateAsync({
        senderWallet,
        receiverWallet,
        amount: parseFloat(amount),
        token: 'SOL',
        message,
        txSignature: sig,
      });

      setStatus('✓ Tip sent! Thank you for the support! 🎉');
      setAmount('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send tip');
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-8 border border-purple-500">
        <h1 className="text-3xl font-bold text-white mb-2">Send a Tip</h1>
        <p className="text-gray-400 mb-6 text-sm font-mono truncate">{creatorWallet}</p>

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Amount (SOL)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              step="0.01"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['0.1', '0.5', '1', '5'].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded font-semibold"
              >
                {val}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message..."
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none resize-none h-20"
            />
          </div>

          {/* Status Messages */}
          {status && (
            <div className="text-cyan-400 text-sm bg-cyan-900/20 p-3 rounded">{status}</div>
          )}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">{error}</div>
          )}

          {/* Send Button */}
          <button
            onClick={handleTip}
            disabled={createTipMutation.isPending || !amount}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded disabled:opacity-50 mt-6"
          >
            {createTipMutation.isPending ? 'Processing...' : 'Send Tip'}
          </button>
        </div>
      </div>
    </div>
  );
}

                <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
                    <a href="/" className="text-[10px] font-bold tracking-widest text-zinc-600 hover:text-white transition-colors uppercase italic">Powered by DirectTip Protocol</a>
                </div>
            </div>
        </div>
    );
}
