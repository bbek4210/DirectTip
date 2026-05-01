"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('directTip_registered');
    if (saved) setIsRegistered(true);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-300 ${scrolled || pathname !== '/' ? 'border-b border-white/10 bg-black/80 backdrop-blur-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-solana-gradient shadow-[0_0_20px_rgba(153,69,255,0.3)] flex items-center justify-center font-bold text-black group-hover:scale-110 transition-transform">D</div>
          <span className="text-2xl font-black tracking-tighter italic">DIRECTTIP</span>
        </Link>
        
        <div className="hidden space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 md:flex">
          <Link href="/#features" className={`transition-colors hover:text-solana-green ${pathname === '/' ? 'text-zinc-400' : 'text-zinc-500'}`}>Features</Link>
          <Link href="/dashboard" className={`transition-colors hover:text-solana-green ${pathname === '/dashboard' ? 'text-solana-green' : ''}`}>Dashboard</Link>
          <Link href="/register" className={`transition-colors hover:text-solana-green ${pathname === '/register' ? 'text-solana-green' : ''}`}>Registration</Link>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" className="transition-colors hover:text-solana-green">Live Test</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(isRegistered ? '/dashboard' : '/register')}
            className="group relative inline-flex items-center justify-center rounded-full bg-solana-gradient p-[1.5px] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(20,241,149,0.2)]"
          >
            <div className="rounded-full bg-[#0a0a0a] px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors group-hover:bg-transparent group-hover:text-black">
              {isRegistered ? 'Pro Dashboard' : 'Join Platform'}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
