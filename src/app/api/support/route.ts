import { NextResponse } from 'next/server';
import { getSupportMessages, addSupportMessage } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

export async function GET() {
  const messages = getSupportMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const { content, role } = await request.json();
    if (!content || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const sanitizedContent = sanitizeInput(content);
    const validRole = role === 'admin' ? 'admin' : 'client';
    const newMsg = addSupportMessage({ content: sanitizedContent, role: validRole });
    return NextResponse.json(newMsg, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
