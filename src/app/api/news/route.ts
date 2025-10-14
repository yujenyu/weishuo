import { NextResponse } from 'next/server';
import { listPosts } from '@/lib/postService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Number(searchParams.get('take') ?? '12');
    const skip = Number(searchParams.get('skip') ?? '0');
    const data = await listPosts({ type: 'NEWS', take, skip });
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/news] error:', msg, err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
