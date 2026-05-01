'use client';

import { useEffect, useState } from 'react';
import { useOverlayTips } from '../hooks/useTips';
import { Tip } from '../lib/api-types';

export default function TipOverlay({ creatorId }: { creatorId: string }) {
  const [displayTip, setDisplayTip] = useState<Tip | null>(null);
  const { data: tipsData } = useOverlayTips(creatorId);

  useEffect(() => {
    if (tipsData?.tips && tipsData.tips.length > 0) {
      const newTip = tipsData.tips[0];
      if (!displayTip || newTip._id !== displayTip._id) {
        setDisplayTip(newTip);
        setTimeout(() => setDisplayTip(null), 5000);
      }
    }
  }, [tipsData, displayTip]);

  if (!displayTip) return null;

  const shortWallet = displayTip.senderWallet.slice(0, 4) + '...' + displayTip.senderWallet.slice(-4);

  return (
    <div className="fixed bottom-5 right-5 animate-bounce">
      <div className="bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg p-4 shadow-2xl border border-purple-400 max-w-sm">
        <div className="text-white">
          <div className="text-sm font-bold text-cyan-200">New Tip!</div>
          <div className="text-xl font-bold mt-2">
            {displayTip.amount} {displayTip.token}
          </div>
          <div className="text-sm text-gray-200 mt-1">from {shortWallet}</div>
          {displayTip.message && (
            <div className="text-sm mt-2 italic">"{displayTip.message}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
