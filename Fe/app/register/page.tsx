"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'viewer';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [youtubeChannelId, setYoutubeChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    const walletParam = searchParams.get('wallet');
    if (walletParam) {
      setWalletAddress(walletParam);
    }
  }, [searchParams]);

  const handleConnectWallet = async () => {
    setWalletLoading(true);
    try {
      if (!(window as any).solana) {
        alert("Phantom wallet not found! Please install it.");
        return;
      }
      const resp = await (window as any).solana.connect({ onlyIfTrusted: false });
      setWalletAddress(resp.publicKey.toString());
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5001';
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, walletAddress, role }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      if (role === 'creator') {
         // Update creator details if needed (youtubeChannelId)
         await fetch(`${baseUrl}/api/creator/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user._id, walletAddress, youtubeChannelId }),
         });
      }

      setSuccess(true);
      localStorage.setItem('directTip_user', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    // Use postMessage for more reliable communication with the content script
    window.postMessage({
      type: 'DIRECTTIP_SYNC_REQUEST',
      payload: {
        role,
        email,
        walletAddress,
        youtubeChannelId
      }
    }, '*');
    alert("Syncing with extension... Please make sure the extension is installed.");
  };

  if (success) {
    return (
      <div className="glass-card p-12 rounded-[40px] text-center max-w-xl w-full animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mx-auto mb-8 border border-emerald-500/30 text-emerald-400">✓</div>
        <h2 className="text-4xl font-black mb-4">Registration Complete!</h2>
        <p className="text-zinc-400 mb-10 text-lg">Your account has been created successfully. Now, sync your details with the Chrome extension to start tipping.</p>
        
        <button 
          onClick={handleSync}
          className="w-full h-16 rounded-2xl bg-solana-gradient text-black font-bold text-lg mb-4 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          Sync with Extension
        </button>
        <button 
          onClick={() => router.push('/')}
          className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-10 sm:p-12 rounded-[40px] max-w-xl w-full border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className={`w-32 h-32 rounded-full blur-3xl ${role === 'creator' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
      </div>

      <h2 className="text-4xl font-black mb-2">Create Account</h2>
      <p className="text-zinc-500 mb-10">Join the DirectTip ecosystem as a {role}.</p>

      <div className="flex gap-4 mb-10 p-1 bg-white/5 rounded-2xl border border-white/5">
        <button 
          onClick={() => setRole('viewer')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${role === 'viewer' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
        >
          Viewer
        </button>
        <button 
          onClick={() => setRole('creator')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${role === 'creator' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
        >
          Creator
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <input 
            type="email" 
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 glass-input rounded-2xl px-6 text-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Solana Wallet Address</label>
          <div className="relative group/input">
            <input 
              type="text" 
              required
              placeholder="Paste or connect your SOL wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full h-14 glass-input rounded-2xl px-6 pr-32 text-sm font-mono transition-all focus:border-emerald-500/50"
            />
            {walletAddress ? (
              <button
                type="button"
                onClick={() => setWalletAddress("")}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={walletLoading}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {walletLoading ? "..." : "Connect"}
              </button>
            )}
          </div>
        </div>

        {role === 'creator' && (
          <div className="animate-fade-in">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">YouTube Channel ID / URL</label>
            <input 
              type="text" 
              required
              placeholder="e.g. UC-lHJZR3Gqxm24_Vd_AJ5Yw"
              value={youtubeChannelId}
              onChange={(e) => setYoutubeChannelId(e.target.value)}
              className="w-full h-14 glass-input rounded-2xl px-6 text-lg font-mono"
            />
            <p className="mt-2 text-[10px] text-zinc-600 px-1 italic">This links your YouTube presence to your wallet for automatic tip detection.</p>
          </div>
        )}

        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-white text-black font-black text-xl hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-white/5"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>

        <div className="text-center mt-6">
           <button 
            type="button"
            onClick={handleSync}
            className="text-xs font-bold text-zinc-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
           >
            Already registered? <span className="underline underline-offset-4">Sync Extension Now</span>
           </button>
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="noise-bg" />
      <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[1000px] w-[1000px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      
      <Link href="/" className="absolute top-10 left-10 text-zinc-500 hover:text-white flex items-center gap-2 font-bold transition-colors group">
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back
      </Link>

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
