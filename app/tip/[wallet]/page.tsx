"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

export default function TipPage() {
    const params = useParams();
    const creatorWallet = params.wallet as string;
    
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("SOL");
    const [status, setStatus] = useState("");
    const [signature, setSignature] = useState("");
    const [message, setMessage] = useState("");

    const handleTip = async () => {
        if (!amount || parseFloat(amount) <= 0) return alert("Enter a valid amount");
        
        // @ts-ignore
        if (!window.solana || !window.solana.isPhantom) {
            return alert("Please install Phantom wallet to send tips!");
        }

        try {
            setStatus("Connecting to wallet...");
            // @ts-ignore
            const resp = await window.solana.connect();
            const fromPubkey = resp.publicKey;
            const toPubkey = new PublicKey(creatorWallet);

            const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
            
            setStatus("Preparing transaction...");
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            setStatus("Waiting for signature...");
            // @ts-ignore
            const signed = await window.solana.signTransaction(transaction);
            const sig = await connection.sendRawTransaction(signed.serialize());
            
            setSignature(sig);
            setStatus("Confirming on blockchain...");
            
            await connection.confirmTransaction(sig);
            
            // Report to backend
            try {
                await fetch('/api/tips', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        signature: sig,
                        amount,
                        token: 'SOL',
                        creatorWallet: creatorWallet,
                        senderWallet: fromPubkey.toString(),
                        message: message,
                        streamUrl: 'Direct Web Tip'
                    })
                });
            } catch (e) {}

            setStatus("Confirmed! Thank you for the support! 🎉");
        } catch (err: any) {
            console.error(err);
            setStatus("Error: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full glass p-10 rounded-[40px] text-center border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-solana-gradient opacity-10 blur-[60px]" />
                
                <div className="h-16 w-16 bg-solana-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_20px_rgba(20,241,149,0.3)]">D</div>
                
                <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Support Creator</h1>
                <p className="text-zinc-500 text-xs font-mono break-all mb-8 bg-white/5 p-3 rounded-xl border border-white/5">
                    {creatorWallet}
                </p>

                <div className="space-y-4 mb-8">
                    <div className="relative group">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount in SOL" 
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-xl outline-none focus:border-solana-green/50 transition-all font-black italic"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase tracking-widest group-focus-within:text-solana-green">SOL</div>
                    </div>

                    <div className="flex gap-2">
                        {['0.1', '0.5', '1.0', '5.0'].map(val => (
                            <button 
                                key={val}
                                onClick={() => setAmount(val)}
                                className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black hover:bg-white/10 transition-colors uppercase"
                            >
                                {val} SOL
                            </button>
                        ))}
                    </div>

                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a message for the creator..." 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm outline-none focus:border-solana-purple/50 transition-all min-h-[100px] resize-none mb-6"
                    />
                </div>

                <button 
                    onClick={handleTip}
                    disabled={status.includes("Confirming")}
                    className="w-full bg-solana-gradient text-black font-black py-5 rounded-[24px] hover:scale-105 transition-transform shadow-[0_0_40px_rgba(20,241,149,0.2)] uppercase tracking-widest text-sm"
                >
                    {status.includes("Confirming") ? "Sending..." : "Send Tip Now"}
                </button>

                {status && (
                    <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-solana-green animate-pulse">
                        {status}
                    </div>
                )}

                {signature && (
                    <a 
                        href={`https://solscan.io/tx/${signature}`} 
                        target="_blank"
                        className="mt-4 block text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        View Blockchain Receipt ↗
                    </a>
                )}

                <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
                    <a href="/" className="text-[10px] font-bold tracking-widest text-zinc-600 hover:text-white transition-colors uppercase italic">Powered by DirectTip Protocol</a>
                </div>
            </div>
        </div>
    );
}
