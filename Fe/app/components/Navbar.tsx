"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('directTip_user');
    if (saved) setUser(JSON.parse(saved));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('directTip_user');
    setUser(null);
    router.push('/');
    // Tell extension to clear state too
    window.postMessage({ type: 'DIRECTTIP_LOGOUT' }, '*');
  };

  const handleLoginWithWallet = async () => {
    try {
      if (!(window as any).solana) {
        alert("Please install Phantom wallet!");
        return;
      }
      const resp = await (window as any).solana.connect({ onlyIfTrusted: false });
      const wallet = resp.publicKey.toString();

      // Check if wallet is registered in backend
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5001';
      const res = await fetch(`${baseUrl}/api/creator/${wallet}`);
      const data = await res.json();

      if (data.creator) {
        // Log them in
        const userData = { ...data.creator.userId, walletAddress: wallet, role: 'creator' };
        localStorage.setItem('directTip_user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
      } else {
        // Not registered, send to register page with wallet filled
        router.push(`/register?wallet=${wallet}`);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleSync = () => {
    if (!user) return;
    window.postMessage({
      type: 'DIRECTTIP_SYNC_REQUEST',
      payload: {
        role: user.role,
        email: user.email,
        walletAddress: user.walletAddress,
        youtubeChannelId: user.youtubeChannelId || ''
      }
    }, '*');
  };

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-500 ${scrolled || pathname !== '/' ? 'border-b border-white/5 bg-black/40 backdrop-blur-2xl py-4' : 'bg-transparent py-8'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-solana-gradient shadow-[0_0_30px_rgba(153,69,255,0.4)] flex items-center justify-center font-black text-black group-hover:scale-110 transition-transform">DT</div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">DIRECTTIP</span>
        </Link>
        
        <div className="hidden items-center space-x-10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 md:flex">
          <Link href="/#features" className="transition-all hover:text-white hover:tracking-[0.3em]">Features</Link>
          {user && (
            <>
              <Link href="/dashboard" className={`transition-all hover:text-white ${pathname === '/dashboard' ? 'text-emerald-400' : ''}`}>Dashboard</Link>
              <button onClick={handleSync} className="transition-all hover:text-emerald-400 text-zinc-500 uppercase font-black">Sync Extension</button>
              {user.role === 'creator' && (
                <Link href={`/overlay/${user._id}`} className={`transition-all hover:text-white ${pathname.includes('/overlay') ? 'text-emerald-400' : ''}`}>Creator Overlay</Link>
              )}
            </>
          )}
          {!user && (
            <Link href="/register" className={`transition-all hover:text-white ${pathname === '/register' ? 'text-emerald-400' : ''}`}>Join Now</Link>
          )}
          <a href="https://www.youtube.com" target="_blank" className="transition-all hover:text-white">Live Demo</a>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-right">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Wallet Connected</div>
                <div className="text-[11px] font-mono text-emerald-400">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="relative h-12 overflow-hidden rounded-xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
              >
                <span className="relative z-10">Dashboard</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLoginWithWallet}
              className="relative h-12 overflow-hidden rounded-xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <span className="relative z-10">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
