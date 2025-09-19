'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Skeleton,
  CardActions,
  Box,
} from '@mui/material';

type Item = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

const RADIUS = 2; // 圖片區塊圓角
const IMAGE_H = 200; // 圖片區塊高度
const ACTION_H = 40; // 卡片底部按鈕區高度

export default function ResourcesSection() {
  // 0=SHARE, 1=NEED
  const [tab, setTab] = useState(0);

  // 每張卡片獨立 loaded 狀態, 控制圖片級 Skeleton
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false); // 載入狀態, 控制清單級 Skeleton

  const [items, setItems] = useState<Item[]>([]); // 以 API 回來的 items 取代 mock
  const [skip, setSkip] = useState(0); // 分頁
  const [take] = useState(8); // 每頁筆數
  const [total, setTotal] = useState(0); // 總筆數
  const [error, setError] = useState<string | null>(null); // 錯誤訊息

  // 依 tab 決定呼叫 shares 或 needs
  const typePath = tab === 0 ? 'shares' : 'needs';

  async function load(initial = false) {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/${typePath}?take=${take}&skip=${initial ? 0 : skip}`,
        { cache: 'no-store' },
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
    } catch (e: any) {
      setError(e?.message ?? '載入失敗');
    } finally {
      setLoading(false); // 完成後結束清單級 Skeleton
    }
  }

  // 切換 Tab 時清空並重新抓
  useEffect(() => {
    setItems([]);
    setSkip(0);
    setTotal(0);
    setLoadedMap({});
    setLoading(true); // 先讓清單級 Skeleton 出現
    load(true);
  }, [tab]);

  const hasMore = skip < total; // 控制查看更多
  const showLoadMore = items.length > 0 || total > 0; // 只在知道總數或已有資料時顯示按鈕

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mt: 8, mb: 2, color: 'primary' }}
      >
        資源分享
      </Typography>

      {/* Tabs 切換 */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="最新分享" />
        <Tab label="最新需求" />
      </Tabs>

      {/* 簡單錯誤顯示 */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading && items.length === 0 ? (
        // 清單級 Skeleton
        <Grid container spacing={4}>
          {Array.from({ length: take }).map((_, i) => (
            <Grid key={`skeleton-${i}`} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
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
                    sx={{ mx: 'auto' }}
                  />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
                </CardContent>
                <CardActions
                  sx={{
                    mt: 'auto',
                    p: 0,
                    pt: 1,
                    justifyContent: 'center',
                    minHeight: ACTION_H,
                  }}
                >
                  <Skeleton variant="rounded" width={100} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // 一般卡片 + 圖片級 Skeleton
        <Grid container spacing={4}>
          {items.map((item) => {
            const key = `${tab}-${item.id}`;
            const loaded = !!loadedMap[key];
            return (
              <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    display: 'flex', // 讓整張卡片成為 flex 容器
                    flexDirection: 'column', // 垂直排列：圖片/內容/按鈕
                    p: 2,
                  }}
                >
                  {/* 圖片級 Skeleton + 圖片：放在同一個容器，確保完全對齊 */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: IMAGE_H,
                      borderRadius: RADIUS,
                      overflow: 'hidden',
                      bgcolor: 'action.hover', // 圖片載入前的底色，避免白底閃爍
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

                    {/* 圖片本體（用 Box component="img" 與 Skeleton 共用同尺寸/位置） */}
                    <Box
                      component="img"
                      src={item.imageUrl || '/No_Image_Placeholder.png'}
                      alt={item.title}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        opacity: loaded ? 1 : 0, // 用透明度，不用 display:none
                        transition: 'opacity .25s ease',
                        borderRadius: 'inherit',
                      }}
                      onLoad={() =>
                        setLoadedMap((prev) => ({ ...prev, [key]: true }))
                      }
                      onError={() =>
                        setLoadedMap((prev) => ({ ...prev, [key]: true }))
                      }
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {item.description ?? '—'}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ mt: 'auto', p: 0, pt: 1, justifyContent: 'center' }}
                  >
                    <CardActions
                      sx={{
                        mt: 'auto',
                        p: 0,
                        pt: 1,
                        justifyContent: 'center',
                        minHeight: ACTION_H,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ minWidth: 'auto', textTransform: 'none' }}
                      >
                        {tab === 0 ? '查看資源' : '聯繫需求'}
                      </Button>
                    </CardActions>
                  </CardActions>
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
      )}
    </>
  );
}
