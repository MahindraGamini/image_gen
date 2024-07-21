import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server';
 
export async function GET() {
  const user = await kv.hgetall('photo:me');
  return NextResponse.json(user);
}

