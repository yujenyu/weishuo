'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';

export default function NewsSection() {
  // 每張卡片獨立 loaded 狀態
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  // 模擬資料
  const news = [
    {
      id: 1,
      title: '新聞標題 A',
      desc: '這是一段最新消息的摘要，簡單介紹文章內容。',
      img: 'https://picsum.photos/seed/share1/400/300',
    },
    {
      id: 2,
      title: '新聞標題 B',
      desc: '這是一段最新消息的摘要，簡單介紹文章內容。',
      img: 'https://picsum.photos/seed/share2/400/300',
    },
    {
      id: 3,
      title: '新聞標題 C',
      desc: '這是一段最新消息的摘要，簡單介紹文章內容。',
      img: 'https://picsum.photos/seed/share3/400/300',
    },
  ];

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3, color: '#000000' }}
      >
        最新消息
      </Typography>
      <Grid container spacing={4}>
        {news.map((news) => (
          <Grid key={news.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                image={news.img}
                alt={news.img}
                sx={{
                  borderRadius: 2,
                  display: !!loadedMap[news.id] ? 'block' : 'none',
                  width: '100%',
                  height: 200,
                }}
                onLoad={() =>
                  setLoadedMap((prev) => ({
                    ...prev,
                    [news.id]: true,
                  }))
                }
                onError={() =>
                  setLoadedMap((prev) => ({
                    ...prev,
                    [news.id]: true,
                  }))
                }
              />
              {!loadedMap[news.id] && (
                <Skeleton variant="rounded" width="100%" height={200} />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {news.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {news.desc}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, mt: 'auto' }}>
                <Button size="small">閱讀更多</Button>
              </Box>
            </Card>
          </Grid>
        ))}
        <Grid
          size={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button variant="contained">查看更多</Button>
        </Grid>
      </Grid>
    </>
  );
}
