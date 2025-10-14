import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const item = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true, email: true },
        },
      },
    });

    // 過濾條件
    if (!item || item.type !== 'NEED' || !item.published) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    // 避免快取
    return NextResponse.json(item, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('[GET /api/needs/[id]]', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    } else {
      console.error('[GET /api/needs/[id]] Unknown error', err);
    }
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
