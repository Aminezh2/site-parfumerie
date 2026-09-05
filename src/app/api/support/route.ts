import { NextResponse } from 'next/server';
import { getSupportMessages, addSupportMessage } from '@/lib/db';

export async function GET() {
  const messages = getSupportMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { content, role } = await request.json();
  if (!content || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const newMsg = addSupportMessage({ content, role });
  return NextResponse.json(newMsg, { status: 201 });
}
