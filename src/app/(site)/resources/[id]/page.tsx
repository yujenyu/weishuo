import { notFound } from 'next/navigation';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Breadcrumbs,
  Link as MUILink,
  Avatar,
  Paper,
  ChipProps,
} from '@mui/material';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Author = {
  id: string;
  name: string;
  image?: string;
  email?: string;
};

type Item = {
  id: string;
  type: 'NEED' | 'SHARE';
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: Author;
};

/**
 * ResourceDetail
 * @todo 重新修改以下邏輯!!!
 * @todo 重新修改以下邏輯!!!
 * @todo 重新修改以下邏輯!!!
 */
const BASE =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

async function tryFetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (res.ok) return (await res.json()) as Item;
  if (res.status === 404) return null;
  throw new Error(`Request failed: ${url} (${res.status})`);
}

async function getResource(id: string): Promise<Item | null> {
  // 先試 SHARE，再試 NEED
  const share = await tryFetchJson(`${BASE}/api/shares/${id}`);
  if (share) return share;
  const need = await tryFetchJson(`${BASE}/api/needs/${id}`);
  if (need) return need;
  return null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getResource(id);
  if (!item) notFound();

  // const typeLabel = item.type === 'SHARE' ? '提供資源' : '聯繫需求';
  const STATUS_COLOR: Record<Item['status'], ChipProps['color']> = {
    OPEN: 'success',
    PENDING: 'warning',
    CLOSED: 'default',
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* 麵包屑 */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MUILink href="/" underline="hover" color="inherit">
          首頁
        </MUILink>
        <MUILink href="/resources" underline="hover" color="inherit">
          資源分享
        </MUILink>
        <Typography color="text.primary" noWrap>
          {item.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* 左：大圖 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Box
              component="img"
              src={item.imageUrl || '/No_Image_Placeholder.png'}
              alt={item.title}
              sx={{
                display: 'block',
                width: '100%',
                height: { xs: 320, md: 520 },
                objectFit: 'cover',
              }}
            />
          </Paper>
        </Grid>

        {/* 右：敘述 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {/* 標籤列 */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={item.type === 'SHARE' ? '提供資源' : '需求'}
                color={item.type === 'SHARE' ? 'primary' : 'secondary'}
                size="small"
              />
              <Chip
                label={item.status}
                color={STATUS_COLOR[item.status]}
                variant="outlined"
                size="small"
              />
              {!item.published && <Chip label="未發布" size="small" />}
            </Stack>

            {/* 標題 */}
            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
              {item.title}
            </Typography>

            {/* 短描述 */}
            {item.description && (
              <Typography variant="body1" color="text.secondary">
                {item.description}
              </Typography>
            )}

            <Divider />

            {/* 詳細內容 */}
            {item.content && (
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  說明
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </Typography>
              </Stack>
            )}

            {/* 作者／聯絡 */}
            {item.author && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={item.author.image} alt={item.author.name} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap fontWeight={600}>
                      {item.author.name}
                    </Typography>
                    {item.author.email && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.author.email}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* 次要動作 */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                href="/resources"
                sx={{ textTransform: 'none' }}
              >
                回到列表
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={`${BASE}/resources/${item.id}`}
                sx={{ textTransform: 'none' }}
              >
                複製/分享連結
              </Button>
            </Stack>

            {/* 時間資訊 */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              建立：{new Date(item.createdAt).toLocaleString()} 更新：
              {new Date(item.updatedAt).toLocaleString()}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
