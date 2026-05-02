"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden">
      <div className="noise-bg" />
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-purple-600/10 blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[800px] w-[800px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8 backdrop-blur-md animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            DirectTip v2.0 is Live
          </div>
          
          <h1 className="mb-8 text-7xl font-black tracking-tight sm:text-9xl leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            THE NEW ERA OF <br />
            <span className="text-solana-gradient">STREAM TIPPING</span>
          </h1>
          
          <p className="mx-auto mb-16 max-w-2xl text-xl text-zinc-400 leading-relaxed font-light">
            Empowering YouTube creators and viewers with lightning-fast Solana transactions. 
            No fees, no delays, just pure support.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row mb-24">
             <Link href="#get-started" className="group relative h-16 rounded-2xl bg-white px-10 flex items-center justify-center text-lg font-bold text-black transition-all hover:scale-105 active:scale-95">
                Get Started
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
             </Link>
             <Link href="/install" className="h-16 rounded-2xl border border-white/10 bg-white/5 px-10 flex items-center justify-center text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                Install Extension
             </Link>
          </div>
        </div>

        {/* Floating Extension Mockup */}
        <div className="relative w-full max-w-5xl px-4 animate-float">
          <div className="glass-card rounded-[40px] p-4 border-white/20 shadow-2xl overflow-hidden group">
            <div className="aspect-video w-full rounded-[30px] bg-[#0c0c0c] flex items-center justify-center relative">
               <div className="absolute inset-0 bg-solana-gradient opacity-10 blur-3xl" />
               <div className="relative z-10 w-full max-w-md p-8 glass-card rounded-3xl border-white/10">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-solana-gradient" />
                        <span className="font-bold tracking-tight">DirectTip Pro</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</div>
                  </div>
                  <div className="space-y-4">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-zinc-500">Receiver</span>
                        <span className="text-emerald-400 font-mono">MrBeast.sol</span>
                     </div>
                     <div className="p-6 rounded-2xl bg-solana-gradient/10 border border-emerald-500/20 text-center">
                        <div className="text-4xl font-black text-solana-gradient">5.00 SOL</div>
                        <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Amount to send</div>
                     </div>
                     <button className="w-full h-14 rounded-2xl bg-solana-gradient font-black text-black text-lg shadow-lg shadow-emerald-500/20">
                        Confirm Transaction
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choice Section */}
      <section id="get-started" className="py-40 px-6 relative z-10">
        <div className="mx-auto max-w-7xl">
            <div className="text-center mb-24">
                <h2 className="text-5xl font-black mb-6">CHOOSE YOUR PATH</h2>
                <p className="text-zinc-500 text-lg">Join as a creator to receive tips or a viewer to support your favorites.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
                {/* Creator Card */}
                <div className="group relative glass-card rounded-[40px] p-12 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                        <div className="w-32 h-32 rounded-full bg-emerald-500 blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-3xl mb-8 border border-emerald-500/30">🎥</div>
                        <h3 className="text-4xl font-black mb-4">Content Creator</h3>
                        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                            Monetize your YouTube channel with zero platform fees. Get a custom tipping dashboard and real-time stream overlays.
                        </p>
                        <ul className="space-y-4 mb-12 text-zinc-500">
                            <li className="flex items-center gap-3">
                                <span className="text-emerald-400">✓</span> Instant SOL/USDC Payouts
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-emerald-400">✓</span> Dynamic Stream Overlays
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-emerald-400">✓</span> Detailed Tip Analytics
                            </li>
                        </ul>
                        <button 
                          onClick={() => router.push('/register?role=creator')}
                          className="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95"
                        >
                            Register as Creator
                        </button>
                    </div>
                </div>

                {/* Viewer Card */}
                <div className="group relative glass-card rounded-[40px] p-12 transition-all hover:border-purple-500/50 hover:bg-purple-500/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                        <div className="w-32 h-32 rounded-full bg-purple-500 blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-3xl mb-8 border border-purple-500/30">💎</div>
                        <h3 className="text-4xl font-black mb-4">Viewer & Fan</h3>
                        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                            Support your favorite creators directly from the YouTube player. Fast, secure, and decentralized.
                        </p>
                        <ul className="space-y-4 mb-12 text-zinc-500">
                            <li className="flex items-center gap-3">
                                <span className="text-purple-400">✓</span> One-Click Tipping
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-purple-400">✓</span> Connect Phantom/Solflare
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-purple-400">✓</span> Transaction History
                            </li>
                        </ul>
                        <button 
                          onClick={() => router.push('/register?role=viewer')}
                          className="w-full h-16 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-lg transition-transform hover:scale-[1.02] hover:bg-white/20 active:scale-95"
                        >
                            Register as Viewer
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 px-6 border-y border-white/5 relative z-10">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
                { label: "Total Tips", val: "$1.2M+" },
                { label: "Transactions", val: "10+" },
                { label: "Active Creators", val: "2,40+" },
                { label: "Confirmation", val: "400ms" }
            ].map((stat, i) => (
                <div key={i} className="group">
                    <div className="text-5xl font-black text-solana-gradient mb-2 group-hover:scale-110 transition-transform">{stat.val}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/50 relative z-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-solana-gradient p-2 flex items-center justify-center font-black text-black">DT</div>
            <span className="text-2xl font-black tracking-tighter">DIRECTTIP</span>
          </div>
          <div className="flex gap-10 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Discord</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
          </div>
          <div className="text-xs text-zinc-700 font-mono uppercase tracking-widest">© 2026 DIRECTTIP.PROTOCOL</div>
        </div>
      </footer>
    </div>
  );
}
