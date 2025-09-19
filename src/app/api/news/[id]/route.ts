import { NextResponse } from 'next/server';
import { getPostById } from '@/lib/postService';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const post = await getPostById(params.id);
    if (!post || post.type !== 'NEWS') {
      return NextResponse.json(
        { error: 'Not Found' },
        {
          status: 404,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    }
    return NextResponse.json(post, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    console.error('[GET /api/news/:id] error:', err?.message || err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
