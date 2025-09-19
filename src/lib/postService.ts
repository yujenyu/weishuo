// src/lib/postService.ts
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const PostTypeEnum = z.enum(['NEWS', 'SHARE', 'NEED']);

export const CreatePostSchema = z.object({
  type: PostTypeEnum,
  title: z.string().min(1, '標題必填'),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url('imageUrl 必須是合法 URL').optional(),
  status: z.string().optional(), // e.g. OPEN/CLOSED
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export type PostDetail = {
  id: string;
  type: 'NEWS' | 'SHARE' | 'NEED';
  title: string;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  status?: string | null;
  createdAt: Date;
};

// 讀列表（分頁）
export async function listPosts(params: {
  type?: 'NEWS' | 'SHARE' | 'NEED';
  take?: number;
  skip?: number;
}) {
  const { type, take = 12, skip = 0 } = params;
  const limit = Math.min(take, 50);
  const where = type ? { type } : undefined;

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        imageUrl: true,
        status: true,
        createdAt: true,
      },
      take: limit,
      skip,
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total, skip, take: limit };
}

// 建立單筆（需登入，呼叫端傳入 authorId）
export async function createPost(data: CreatePostInput, authorId: string) {
  const parsed = CreatePostSchema.safeParse(data);
  if (!parsed.success) {
    // 真正在 API 端回傳 400，這裡丟錯即可
    throw new Error('INVALID_PAYLOAD');
  }

  return prisma.post.create({
    data: { ...parsed.data, authorId },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      imageUrl: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function getPostById(id: string): Promise<PostDetail | null> {
  return prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      content: true,
      imageUrl: true,
      status: true,
      createdAt: true,
    },
  });
}
