'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';

type NewsItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
};

const RADIUS = 2; // 圖片區塊圓角
const IMAGE_H = 200; // 圖片區塊高度
const ACTION_H = 40; // 卡片底部按鈕區高度

export default function NewsSection() {
  // 每張卡片獨立 loaded 狀態, 控制圖片級 Skeleton
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true); // 載入狀態, 控制清單級 Skeleton

  const [items, setItems] = useState<NewsItem[]>([]);
  const [skip, setSkip] = useState(0); // 分頁：已跳過數
  const [take] = useState(6); // 分頁：每頁筆數
  const [total, setTotal] = useState(0); // 分頁：總筆數
  const [error, setError] = useState<string | null>(null); // 錯誤訊息

  // 抓取 API 的函式（支援初次載入/查看更多）
  async function load(initial = false) {
    // 初次(initial=true) 一定要放行；只有在非初次又正在載入時才擋掉重複請求
    if (loading && !initial) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/news?take=${take}&skip=${initial ? 0 : skip}`,
        { cache: 'no-store' }, // [重點] 避免快取舊資料
      );
      const data = await res.json();
      if (initial) {
        setItems(data.items);
        setSkip(data.take);
        setLoadedMap({}); // 初次載入時清空圖片載入狀態，避免殘留
      } else {
        setItems((prev) => [...prev, ...data.items]);
        setSkip((prev) => prev + data.take);
      }
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入失敗');
    } finally {
      setLoading(false); // 完成後結束清單級 Skeleton
    }
  }

  // 元件掛載時抓第一頁
  useEffect(() => {
    setLoading(true); // 先讓清單級 Skeleton 出現，避免初次看到「沒有更多了」
    load(true);
  }, []);

  const hasMore = skip < total; // 控制「查看更多」是否可點
  const showLoadMore = items.length > 0 || total > 0; // 只在知道總數或已有資料時顯示按鈕

  // ======== Early Return 1：loading（清單級 Skeleton）========
  if (loading) {
    return (
      <>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary' }}
        >
          最新消息
        </Typography>

        {/* 顯示錯誤 */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* 清單級 Skeleton */}
        <Grid container spacing={4}>
          {Array.from({ length: take }).map((_, i) => (
            <Grid key={`news-skeleton-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: IMAGE_H,
                    borderRadius: RADIUS,
                    overflow: 'hidden',
                    bgcolor: 'action.hover',
                    mb: 2,
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 'inherit',
                    }}
                  />
                </Box>
                <CardContent>
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={28}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" />
                </CardContent>
                <Box
                  sx={{
                    p: 2,
                    mt: 'auto',
                    minHeight: ACTION_H,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Skeleton variant="rounded" width="20%" />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  // ======== Early Return 2：非 loading 且沒有資料（空狀態）========
  if (items.length === 0) {
    return (
      <>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3, color: 'primary' }}
        >
          最新消息
        </Typography>

        {/* 顯示錯誤 */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* 空狀態 */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">目前沒有消息</Typography>
        </Box>
      </>
    );
  }

  // ======== 正常清單（包含「圖片級 Skeleton」：opacity 0→1，不用 display:none）========
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3, color: 'primary' }}
      >
        最新消息
      </Typography>

      {/* 顯示錯誤 */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 一般卡片清單 */}
      <Grid container spacing={4}>
        {items.map((news) => {
          const loaded = !!loadedMap[news.id];
          return (
            <Grid key={news.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* 圖片級 Skeleton 疊層 */}
                <Box
                  sx={{
                    position: 'relative',
                    height: IMAGE_H,
                    borderRadius: RADIUS,
                    overflow: 'hidden',
                    bgcolor: 'action.hover',
                    mb: 2,
                  }}
                >
                  {/* 圖片級 Skeleton 疊層 */}
                  {!loaded && (
                    <Skeleton
                      variant="rounded"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 'inherit',
                      }}
                    />
                  )}

                  {/* 圖片本體（與 Skeleton 共用同尺寸/位置） */}
                  <Box
                    component="img"
                    src={news.imageUrl || '/No_Image_Placeholder.png'}
                    alt={news.title}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: loaded ? 1 : 0,
                      transition: 'opacity .25s ease',
                      borderRadius: 'inherit',
                    }}
                    onLoad={() =>
                      setLoadedMap((prev) => ({ ...prev, [news.id]: true }))
                    }
                    onError={() =>
                      setLoadedMap((prev) => ({ ...prev, [news.id]: true }))
                    }
                  />
                </Box>

                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {news.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {/* 使用 API 的 createdAt */}
                    {new Date(news.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {news.description ?? '—'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, mt: 'auto', minHeight: ACTION_H }}>
                  <Button size="small">閱讀更多</Button>
                </Box>
              </Card>
            </Grid>
          );
        })}

        {/* 查看更多按鈕（避免初次就顯示「沒有更多了」） */}
        {showLoadMore && (
          <Grid
            size={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              disabled={!hasMore || loading}
              onClick={() => load()}
            >
              {loading ? '載入中...' : hasMore ? '查看更多' : '沒有更多了'}
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}
