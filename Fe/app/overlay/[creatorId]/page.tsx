"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useOverlayTips } from "../../hooks/useTips";
import { Tip } from "../../lib/api-types";

export default function OverlayPage() {
    const params = useParams();
    const creatorId = params.creatorId as string;
    const [alert, setAlert] = useState<Tip | null>(null);
    const [queue, setQueue] = useState<Tip[]>([]);
    const [isShowing, setIsShowing] = useState(false);

    const { data: tipsData } = useOverlayTips(creatorId);

    // Handle new tips from the query
    useEffect(() => {
        if (tipsData && tipsData.length > 0) {
            setQueue(prev => {
                const newTips = tipsData.filter(
                    newTip => !prev.some(t => t._id === newTip._id) && (!alert || alert._id !== newTip._id)
                );
                return [...prev, ...newTips];
            });
        }
    }, [tipsData, alert]);

    // Handle Animation Queue
    useEffect(() => {
        if (!isShowing && queue.length > 0) {
            const next = queue[0];
            setAlert(next);
            setIsShowing(true);
            setQueue(prev => prev.slice(1));
            
            // Show for 8 seconds
            const timer = setTimeout(() => {
                setIsShowing(false);
                setTimeout(() => setAlert(null), 700); // Wait for fade out
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [queue, isShowing]);

    if (!alert) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="relative p-1 bg-solana-gradient rounded-[40px] shadow-[0_0_50px_rgba(20,241,149,0.5)]">
                <div className="bg-[#0a0a0a] rounded-[38px] p-12 text-center min-w-[400px] border border-white/10">
                    <div className="text-6xl mb-6 animate-bounce">💎</div>
                    <div className="text-[14px] font-black uppercase tracking-[0.4em] text-solana-green mb-4">NEW DONATION</div>
                    <div className="text-5xl font-black text-white italic mb-2 tracking-tighter">
                        {alert.senderWallet.slice(0, 4)}...{alert.senderWallet.slice(-4)}
                    </div>
                    <div className="text-6xl font-black text-solana-gradient italic mb-8">
                        {alert.amount} {alert.token}
                    </div>
                    {alert.message && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-xl text-zinc-300 font-medium italic">
                            "{alert.message}"
                        </div>
                    )}
                </div>
            </div>
            
            {/* Audio Cue Placeholder */}
            <audio autoPlay src="https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" />
            
            <style jsx global>{`
                body { background: transparent !important; overflow: hidden; }
                .bg-solana-gradient {
                    background: linear-gradient(135deg, #9945FF 0%, #14F195 100%);
                }
                .text-solana-gradient {
                    background: linear-gradient(135deg, #9945FF 0%, #14F195 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}
