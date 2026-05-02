"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InstallPage() {
  const router = useRouter();
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  const handleInstall = () => {
    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setInstalled(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="noise-bg" />
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-purple-600/5 blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[800px] w-[800px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <Link href="/" className="absolute top-10 left-10 text-zinc-500 hover:text-white flex items-center gap-2 font-bold transition-colors group z-50">
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back to DirectTip
      </Link>

      <div className="relative z-10 w-full max-w-4xl animate-fade-in">
        <div className="glass-card rounded-[40px] overflow-hidden border-white/10 shadow-2xl">
          {/* Header */}
          <div className="p-8 sm:p-12 border-b border-white/5 flex flex-col sm:flex-row items-center gap-8 bg-white/5">
            <div className="w-24 h-24 rounded-3xl bg-solana-gradient shadow-[0_0_40px_rgba(153,69,255,0.4)] flex items-center justify-center text-4xl font-black text-black">
              DT
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight">DirectTip Pro</h1>
              <p className="text-zinc-400 text-lg">Decentralized Tipping for YouTube Creators</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">★</span> 4.9 (2.4k reviews)</span>
                <span>•</span>
                <span>100,000+ users</span>
                <span>•</span>
                <span className="text-emerald-400">Productivity</span>
              </div>
            </div>
            <button 
              onClick={handleInstall}
              disabled={installing || installed}
              className={`h-16 px-10 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${
                installed 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default" 
                : "bg-white text-black hover:scale-105"
              }`}
            >
              {installing ? "Adding to Chrome..." : installed ? "✓ Added to Chrome" : "Add to Chrome"}
            </button>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Support your favorite YouTube creators directly from the player. DirectTip Pro injects a native "Send Tip" button and a floating overlay that allows you to send Solana (SOL) and USDC instantly.
              </p>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Key Features</h3>
              <ul className="space-y-4">
                {[
                  "One-click tipping via Phantom or Solflare",
                  "Automatic creator wallet detection",
                  "Real-time stream donation overlays",
                  "Verified creator badges",
                  "Low transaction fees (< $0.001)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="text-emerald-400 mt-0.5">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
               <div className="glass-card rounded-3xl p-6 border-white/5 bg-black/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-solana-gradient opacity-20" />
                    <div className="flex-1 h-3 bg-white/5 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
                    <div className="h-12 w-full bg-solana-gradient opacity-10 rounded-xl border border-solana-purple/20" />
                  </div>
               </div>
               <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400/70 italic leading-relaxed text-center">
                    "The fastest way to support creators I've ever used. No 30% platform cut!"
                  </p>
                  <p className="text-[10px] text-zinc-500 text-center mt-2 font-bold uppercase tracking-widest">— Top Streamer</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {installed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="glass-card p-12 rounded-[40px] text-center max-w-lg w-full border-emerald-500/30">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mx-auto mb-8 border border-emerald-500/30 text-emerald-400">✓</div>
            <h2 className="text-4xl font-black mb-4">Installation Ready!</h2>
            <p className="text-zinc-400 mb-6 text-lg">DirectTip Pro has been prepared. Since this is a development environment, please follow these steps:</p>
            
            <div className="text-left bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 space-y-3">
              <div className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-solana-gradient flex items-center justify-center text-black font-black flex-shrink-0 text-[10px]">1</span>
                <span>Go to <code className="text-emerald-400">chrome://extensions</code></span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-solana-gradient flex items-center justify-center text-black font-black flex-shrink-0 text-[10px]">2</span>
                <span>Enable <span className="font-bold text-white">Developer mode</span></span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-solana-gradient flex items-center justify-center text-black font-black flex-shrink-0 text-[10px]">3</span>
                <span>Click <span className="font-bold text-white">Load unpacked</span> and select the <code className="text-emerald-400">Fe/extension</code> folder.</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-white/10"
            >
              Continue to Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
