import { NextResponse } from 'next/server';
import { listPosts } from '@/lib/postService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Number(searchParams.get('take') ?? '12');
    const skip = Number(searchParams.get('skip') ?? '0');
    const data = await listPosts({ type: 'NEED', take, skip });
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    console.error('[GET /api/needs] error:', err?.message || err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
