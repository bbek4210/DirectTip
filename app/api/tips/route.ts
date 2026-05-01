import { NextResponse } from 'next/server';

// For MVP, we'll use an in-memory store (reset on server restart)
// In a real app, use Prisma/Supabase
let tips: any[] = [];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const creator = searchParams.get('creator');
    
    if (creator) {
        return NextResponse.json(tips.filter(t => t.creatorWallet === creator));
    }
    
    return NextResponse.json(tips);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { signature, amount, token, creatorWallet, senderWallet, message, streamUrl } = body;
        
        if (!signature || !amount || !creatorWallet) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        
        const newTip = {
            signature,
            amount,
            token,
            creatorWallet,
            senderWallet,
            message: message || "",
            streamUrl: streamUrl || "Direct",
            timestamp: new Date().toISOString()
        };
        
        tips.unshift(newTip);
        
        // Keep only last 100 tips for memory safety
        if (tips.length > 100) tips.pop();
        
        return NextResponse.json({ success: true, tip: newTip });
    } catch (err) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
