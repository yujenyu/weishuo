import { NextResponse } from 'next/server';
import { listPosts, createPost } from '@/lib/postService';
import { auth } from '@/auth';
import { z } from 'zod';

function cleanTextInput(v: unknown) {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s) return undefined;
  const lower = s.toLowerCase();
  if (lower === 'null' || lower === 'undefined') return undefined;
  return s;
}

function cleanUrlInput(v: unknown) {
  const s = cleanTextInput(v);
  if (!s) return undefined;
  if (!/^https?:\/\//i.test(s)) return undefined;
  return s;
}

// 後端最終驗證
const PostSchema = z.object({
  type: z.literal('SHARE'),
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
  description: z.string().min(1, 'description is required'),
  imageUrl: z.string().url('imageUrl must be a valid URL'),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Number(searchParams.get('take') ?? '12');
    const skip = Number(searchParams.get('skip') ?? '0');
    const data = await listPosts({ type: 'SHARE', take, skip });
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    console.error('[GET /api/shares] error:', err?.message || err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 取 session
    const session = await auth();
    const authorId = session?.user?.id as string | undefined;
    if (!authorId) {
      // 未登入無法新增
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const raw = await req.json();

    // 先整理使用者輸入內容
    const title = cleanTextInput(raw?.title);
    const content = cleanTextInput(raw?.content);
    const description = cleanTextInput(raw?.description);
    const imageUrl = cleanUrlInput(raw?.imageUrl);
    const status =
      cleanTextInput(raw?.status)?.toUpperCase() === 'CLOSED'
        ? 'CLOSED'
        : 'OPEN';

    // 用 Zod 做最終把關
    const parsed = PostSchema.parse({
      type: 'SHARE',
      title: title ?? '',
      content: content ?? '',
      description,
      imageUrl: imageUrl ?? '',
      status,
    });

    const item = await createPost(parsed, authorId);
    return NextResponse.json({ item });
  } catch (err: any) {
    if (err?.issues) {
      // Zod 錯誤
      return NextResponse.json(
        { error: 'Invalid payload', details: err.issues },
        { status: 400 },
      );
    }
    if (err?.message === 'INVALID_PAYLOAD') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    console.error('[POST /api/shares] error:', err?.message || err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
