"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('directTip_registered');
    if (saved) setIsRegistered(true);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 font-sans">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 text-center">
        {/* Ambient Lights */}
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live on Solana Mainnet
          </div>
          
          <h1 className="mb-8 text-6xl font-black tracking-tight sm:text-8xl leading-[0.9]">
            The Future of <br />
            <span className="text-solana-gradient italic">Creator Support</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-400 leading-relaxed">
            DirectTip is a non-custodial gateway for YouTube. Send SOL & USDC tips instantly 
            without ever leaving the stream. Powered by Solana speed.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button className="h-16 rounded-2xl bg-solana-gradient px-10 text-lg font-black text-black shadow-[0_0_40px_rgba(20,241,149,0.3)] transition-all hover:scale-105 hover:rotate-1">
              Add to Chrome Free
            </button>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 w-12 rounded-full border-2 border-[#0a0a0a] bg-zinc-800" />
              ))}
              <div className="flex h-12 items-center pl-6 text-sm text-zinc-500 font-medium">+2,400 creators joined</div>
            </div>
          </div>
        </div>

        {/* Extension Mockup Display */}
        <div className="relative mt-24 w-full max-w-6xl rounded-[40px] border border-white/10 bg-zinc-900/30 p-2 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="aspect-video w-full overflow-hidden rounded-[32px] bg-black relative group">
                <div className="absolute inset-0 bg-solana-gradient opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="flex h-full w-full flex-col items-center justify-center">
                    {/* Simulated Extension UI */}
                    <div className="w-80 glass rounded-3xl p-6 shadow-2xl border-white/20 translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-6 w-6 rounded bg-solana-gradient" />
                            <div className="h-3 w-24 bg-white/20 rounded-full" />
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between">
                                <span className="text-xs font-bold text-solana-green">1.5 SOL</span>
                                <span className="text-[10px] text-zinc-500">◎</span>
                            </div>
                        </div>
                        <button className="w-full h-12 bg-solana-gradient rounded-xl font-bold text-black text-sm">Send Tip</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold mb-4 italic">THREE STEPS TO START</h2>
                <div className="h-1.5 w-20 bg-solana-gradient mx-auto rounded-full" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-16">
                {[
                    { step: "01", title: "Connect Wallet", desc: "Link your Phantom wallet to our platform securely in one click." },
                    { step: "02", title: "Install Extension", desc: "Add the DirectTip Pro extension to your Chrome browser." },
                    { step: "03", title: "Tip Instantly", desc: "Open any YouTube Live stream and support your favorite creator." }
                ].map((item, i) => (
                    <div key={i} className="relative group">
                        <div className="text-8xl font-black text-white/5 absolute -top-12 -left-4 group-hover:text-solana-purple/10 transition-colors">{item.step}</div>
                        <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 border-y border-white/5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
                { label: "Total Tips", val: "$1.2M+" },
                { label: "Transactions", val: "450k+" },
                { label: "Active Creators", val: "2,400+" },
                { label: "Avg. Confirmation", val: "400ms" }
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-4xl font-black text-solana-gradient mb-2">{stat.val}</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-solana-gradient" />
            <span className="text-xl font-bold tracking-tighter italic">DIRECTTIP</span>
          </div>
          <div className="flex gap-10 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="text-xs text-zinc-700">© 2026 DirectTip Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
