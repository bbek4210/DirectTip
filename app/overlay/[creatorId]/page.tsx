"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OverlayPage() {
    const params = useParams();
    const creatorId = params.creatorId as string;
    const [alert, setAlert] = useState<any>(null);
    const [queue, setQueue] = useState<any[]>([]);
    const [isShowing, setIsShowing] = useState(false);

    // Poll for new tips (Real-time MVP)
    useEffect(() => {
        const checkTips = async () => {
            try {
                const res = await fetch(`/api/tips?creator=${creatorId}&limit=1`);
                const tips = await res.json();
                if (tips.length > 0) {
                    const latest = tips[0];
                    // Check if this tip is new (timestamp within last 10 seconds)
                    const tipTime = new Date(latest.timestamp).getTime();
                    const now = new Date().getTime();
                    if (now - tipTime < 10000) {
                        setQueue(prev => {
                            // Avoid duplicates
                            if (prev.find(t => t.signature === latest.signature)) return prev;
                            return [...prev, latest];
                        });
                    }
                }
            } catch (e) {}
        };

        const interval = setInterval(checkTips, 3000);
        return () => clearInterval(interval);
    }, [creatorId]);

    // Handle Animation Queue
    useEffect(() => {
        if (!isShowing && queue.length > 0) {
            const next = queue[0];
            setAlert(next);
            setIsShowing(true);
            setQueue(prev => prev.slice(1));
            
            // Show for 8 seconds
            setTimeout(() => {
                setIsShowing(false);
                setTimeout(() => setAlert(null), 500); // Wait for fade out
            }, 8000);
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
