"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const router = useRouter();
    const [wallet, setWallet] = useState("");
    const [role, setRole] = useState("donator");
    const [status, setStatus] = useState("");
    const [channelId, setChannelId] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const saved = localStorage.getItem('directTip_registered');
        if (saved) {
            setIsRegistered(true);
            const data = JSON.parse(saved);
            setWallet(data.wallet);
            setRole(data.role);
            setChannelId(data.channelId || "");
        }
    }, []);

    const handleConnect = async () => {
        // @ts-ignore
        if (window.solana && window.solana.isPhantom) {
            try {
                // @ts-ignore
                const resp = await window.solana.connect();
                setWallet(resp.publicKey.toString());
                setStep(2);
            } catch (err) {
                alert("Connection rejected");
            }
        } else {
            alert("Please install Phantom wallet!");
        }
    };

    const handleRegister = async () => {
        if (!wallet) return alert("Please connect your wallet first");
        
        setStatus("Verifying on Solana...");
        setTimeout(() => {
            const regData = { wallet, role, channelId, timestamp: new Date().toISOString() };
            localStorage.setItem('directTip_registered', JSON.stringify(regData));
            setIsRegistered(true);
            setStatus("");
        }, 2000);
    };

    if (isRegistered) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
                <div className="max-w-xl w-full glass p-12 rounded-[40px] text-center border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 blur-[80px]" />
                    
                    <div className="h-24 w-24 bg-emerald-500/20 border border-emerald-500/50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <span className="text-4xl">💎</span>
                    </div>
                    
                    <h1 className="text-4xl font-black mb-4 tracking-tight uppercase italic">You're All Set!</h1>
                    <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
                        Your wallet is securely registered as a 
                        <span className="text-emerald-500 font-black px-2 py-1 bg-emerald-500/10 rounded-lg ml-2 uppercase italic">{role}</span>
                    </p>
                    
                    <div className="mb-10 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Your Public Tipping URL</label>
                        <div className="flex gap-2">
                            <input 
                                readOnly 
                                value={`http://localhost:3000/tip/${wallet}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono text-solana-green outline-none"
                            />
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(`http://localhost:3000/tip/${wallet}`);
                                    alert("Link copied!");
                                }}
                                className="px-4 py-3 bg-white/10 rounded-xl text-xs hover:bg-white/20 transition-colors"
                            >
                                📋
                            </button>
                        </div>
                        <p className="mt-2 text-[10px] text-zinc-600 font-bold uppercase italic">Share this link with your audience to receive tips instantly!</p>
                    </div>

                    {role === 'creator' && (
                        <div className="mb-10 text-left animate-in slide-in-from-bottom-2 duration-700">
                            <label className="text-[10px] font-black uppercase tracking-widest text-solana-purple mb-2 block">Your Stream Overlay URL (OBS)</label>
                            <div className="flex gap-2">
                                <input 
                                    readOnly 
                                    value={`http://localhost:3000/overlay/${wallet}`}
                                    className="flex-1 bg-white/5 border border-solana-purple/30 rounded-xl px-4 py-3 text-[11px] font-mono text-solana-purple outline-none"
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`http://localhost:3000/overlay/${wallet}`);
                                        alert("Overlay URL copied!");
                                    }}
                                    className="px-4 py-3 bg-solana-purple/10 rounded-xl text-xs hover:bg-solana-purple/20 transition-colors"
                                >
                                    📋
                                </button>
                            </div>
                            <p className="mt-2 text-[10px] text-zinc-600 font-bold uppercase italic">Add this as a "Browser Source" in OBS to see live tip alerts.</p>
                        </div>
                    )}
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link 
                            href={`/tip/${wallet}`} 
                            className="flex flex-col items-center justify-center gap-3 p-8 bg-solana-gradient rounded-[32px] hover:scale-105 transition-transform"
                        >
                            <span className="text-3xl">💎</span>
                            <span className="font-black text-black uppercase text-sm">View Tip Page</span>
                        </Link>
                        <Link 
                            href="/dashboard" 
                            className="flex flex-col items-center justify-center gap-3 p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-colors"
                        >
                            <span className="text-3xl">📊</span>
                            <span className="font-black text-white uppercase text-sm">Go to Dashboard</span>
                        </Link>
                    </div>

                    <button 
                        onClick={() => {
                            localStorage.removeItem('directTip_registered');
                            window.location.reload();
                        }}
                        className="mt-12 text-xs font-bold text-zinc-600 hover:text-red-500 transition-colors tracking-widest uppercase"
                    >
                        Reset Registration Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full glass p-10 rounded-[40px] text-center border-white/5 relative">
                <div className="mb-10 flex justify-center gap-2">
                    {[1,2,3].map(i => (
                        <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${step >= i ? 'bg-solana-gradient' : 'bg-white/10'}`} />
                    ))}
                </div>

                <div className="h-20 w-20 bg-solana-gradient rounded-3xl mx-auto mb-8 shadow-[0_0_30px_rgba(20,241,149,0.2)] flex items-center justify-center font-bold text-3xl text-black">D</div>
                
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-black mb-3 tracking-tighter italic uppercase">CHOOSE YOUR ROLE</h1>
                        <p className="text-zinc-500 mb-10 text-sm">How do you want to use the DirectTip ecosystem?</p>

                        <div className="grid gap-4 mb-10 text-left">
                            <div 
                                onClick={() => setRole('donator')}
                                className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${role === 'donator' ? 'border-solana-green bg-solana-green/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">👋</div>
                                    <div>
                                        <div className="font-bold text-sm">I'm a Donator</div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Support creators I love</div>
                                    </div>
                                </div>
                            </div>
                            <div 
                                onClick={() => setRole('creator')}
                                className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${role === 'creator' ? 'border-solana-purple bg-solana-purple/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">🎞️</div>
                                    <div>
                                        <div className="font-bold text-sm">I'm a YouTuber</div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Receive tips from my fans</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-white text-black font-black py-4 rounded-[20px] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-black mb-3 tracking-tighter italic uppercase">SECURE CONNECT</h1>
                        <p className="text-zinc-500 mb-10 text-sm">Connect your Solana wallet to verify identity.</p>

                        {!wallet ? (
                            <button 
                                onClick={handleConnect}
                                className="group relative w-full rounded-[24px] bg-solana-gradient p-[2px] transition-transform hover:scale-[1.02]"
                            >
                                <div className="rounded-[22px] bg-black py-5 font-black text-white transition-colors group-hover:bg-transparent group-hover:text-black uppercase tracking-widest text-sm">
                                    Connect Phantom
                                </div>
                            </button>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs font-mono text-solana-green break-all shadow-inner">
                                    {wallet}
                                </div>
                                
                                {role === 'creator' && (
                                    <div className="text-left animate-in fade-in duration-700">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-2">YouTube Channel ID</label>
                                        <input 
                                            type="text" 
                                            value={channelId}
                                            onChange={(e) => setChannelId(e.target.value)}
                                            placeholder="e.g. UC12345..." 
                                            className="w-full rounded-[24px] border border-white/10 bg-white/5 px-6 py-4 text-sm outline-none focus:border-solana-purple/50 transition-all mb-4"
                                        />
                                    </div>
                                )}

                                <button 
                                    onClick={handleRegister}
                                    className="w-full bg-solana-gradient text-black font-black py-5 rounded-[24px] hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(153,69,255,0.3)] uppercase tracking-widest text-sm"
                                >
                                    Finish Registration
                                </button>
                            </div>
                        )}
                        <button onClick={() => setStep(1)} className="mt-8 text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-white transition-colors">← Change Role</button>
                    </div>
                )}

                {status && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center p-10 z-20">
                        <div className="h-2 w-48 bg-white/10 rounded-full mb-6 overflow-hidden">
                            <div className="h-full bg-solana-gradient animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                        </div>
                        <p className="text-solana-green font-black italic uppercase tracking-tighter text-xl">{status}</p>
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-white/5 flex justify-center">
                    <Link href="/" className="text-[10px] font-bold tracking-widest text-zinc-600 hover:text-white transition-colors uppercase italic">DirectTip Protocol v1.0</Link>
                </div>
            </div>
        </div>
    );
}
