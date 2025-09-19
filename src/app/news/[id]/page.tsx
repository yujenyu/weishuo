import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container, Box, Typography, Chip, Divider } from '@mui/material';
import { getPostById } from '@/lib/postService';

export const dynamic = 'force-dynamic'; // 內容常更新時

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const news = await getPostById(params.id);
  if (!news || news.type !== 'NEWS') notFound();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {news.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Chip label="最新消息" color="primary" size="small" />
        <Typography variant="body2" color="text.secondary">
          {new Date(news.createdAt).toLocaleString()}
        </Typography>
      </Box>

      {news.imageUrl && (
        <Box sx={{ position: 'relative', width: '100%', height: 420, mb: 3 }}>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            style={{ objectFit: 'cover', borderRadius: 12 }}
          />
        </Box>
      )}

      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {news.content ?? news.description ?? '—'}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography
        component="a"
        href="/news"
        color="primary"
        sx={{
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        ← 返回最新消息
      </Typography>
    </Container>
  );
}

// （可選）SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const news = await getPostById(params.id);
  if (!news || news.type !== 'NEWS') return {};
  return {
    title: `${news.title} | 最新消息`,
    description: news.description ?? undefined,
    openGraph: {
      title: news.title,
      description: news.description ?? undefined,
      images: news.imageUrl ? [{ url: news.imageUrl }] : undefined,
      type: 'article',
    },
  };
}
