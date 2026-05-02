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
                onClick={() => router.push('/dashboard')}
                className="relative h-12 overflow-hidden rounded-xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
              >
                <span className="relative z-10">Dashboard</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => router.push('/register')}
              className="relative h-12 overflow-hidden rounded-xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <span className="relative z-10">Launch App</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
