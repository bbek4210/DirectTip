import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(req: NextRequest, { params }: { params: { creatorId: string } }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/overlay/${params.creatorId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch overlay' }, { status: 500 });
  }
}
