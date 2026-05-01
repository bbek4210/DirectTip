import { NextResponse } from 'next/server';

// Mock database for creators (in-memory)
const creators: Record<string, { wallet: string, channelName: string }> = {
    'UC12345': { wallet: 'ExvF4uXnJ3mXJ9XpXpXpXpXpXpXpXpXpXpXpXpXp', channelName: 'Sample Creator' }
};

export async function GET(request: Request, { params }: { params: { channelId: string } }) {
    const channelId = params.channelId;
    const creator = creators[channelId];
    
    if (!creator) {
        return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }
    
    return NextResponse.json(creator);
}

export async function POST(request: Request, { params }: { params: { channelId: string } }) {
    const channelId = params.channelId;
    const { wallet, channelName } = await request.json();
    
    if (!wallet) return NextResponse.json({ error: "Wallet required" }, { status: 400 });
    
    creators[channelId] = { wallet, channelName };
    return NextResponse.json({ success: true, channelId });
}
