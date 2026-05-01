"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [tips, setTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState("");
    const [totalSol, setTotalSol] = useState(0);

    const fetchTips = async (creatorWallet: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tips?creator=${creatorWallet}`);
            const data = await res.json();
            setTips(data);
            
            const total = data.reduce((acc: number, tip: any) => acc + (tip.token === 'SOL' ? parseFloat(tip.amount) : 0), 0);
            setTotalSol(total);
        } catch (err) {
            console.error("Failed to fetch tips", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('directTip_registered');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.role === 'creator') {
                setWallet(data.wallet);
                fetchTips(data.wallet);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (wallet) fetchTips(wallet);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-12 selection:bg-solana-purple/30 font-sans">
            <div className="mx-auto max-w-6xl pt-12">

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-16 relative group">
                    <input 
                        type="text" 
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        placeholder="Paste your Solana creator wallet address..." 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-6 text-lg outline-none focus:border-solana-purple/50 focus:bg-white/[0.07] transition-all font-mono placeholder:font-sans placeholder:italic"
                    />
                    <button type="submit" className="absolute right-4 top-4 bottom-4 rounded-xl bg-solana-gradient px-8 font-black text-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                        Fetch Tips
                    </button>
                </form>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { label: "Total Earnings", val: `${totalSol.toFixed(2)} SOL`, icon: "◎", color: "text-solana-green" },
                        { label: "Total Tips Received", val: tips.length, icon: "⚡", color: "text-solana-purple" },
                        { label: "Unique Supporters", val: new Set(tips.map(t => t.senderWallet)).size, icon: "👥", color: "text-white" }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className={`absolute top-0 right-0 p-8 text-4xl opacity-10 group-hover:opacity-20 transition-opacity`}>{stat.icon}</div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-4">{stat.label}</div>
                            <div className={`text-4xl font-black tracking-tight italic ${stat.color}`}>{stat.val}</div>
                        </div>
                    ))}
                </div>

                {/* Tip Table */}
                <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-black italic uppercase tracking-tighter text-xl">Recent Transactions</h2>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Updated Just Now</div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">
                                <tr>
                                    <th className="px-8 py-5">Event</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Donator</th>
                                    <th className="px-8 py-5">Source</th>
                                    <th className="px-8 py-5 text-right">Blockchain</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-6 w-6 border-2 border-solana-green border-t-transparent rounded-full animate-spin" />
                                                <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Scanning Network...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : tips.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-bold italic uppercase">
                                            No active tips detected on this address
                                        </td>
                                    </tr>
                                ) : (
                                    tips.map((tip, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-solana-green group-hover:scale-150 transition-transform" />
                                                    <span className="text-xs font-black uppercase italic tracking-tighter">Tip Received</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-black text-solana-green italic text-lg">
                                                {tip.amount} {tip.token}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                                                    {tip.senderWallet?.slice(0, 6)}...{tip.senderWallet?.slice(-6)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] text-zinc-500 font-bold uppercase truncate max-w-[150px]">
                                                {tip.streamUrl?.split('v=')[1] ? `Video: ${tip.streamUrl.split('v=')[1]}` : 'YouTube Stream'}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <a 
                                                    href={`https://solscan.io/tx/${tip.signature}`} 
                                                    target="_blank" 
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-solana-gradient hover:text-black transition-all"
                                                >
                                                    Verify ↗
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
