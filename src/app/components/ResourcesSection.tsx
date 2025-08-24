'use client';

import * as React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Tabs,
  Tab,
} from '@mui/material';

export default function ResourcesSection() {
  const [tab, setTab] = React.useState(0);

  // 模擬資料
  const shares = [
    {
      id: 1,
      title: '分享項目 A',
      desc: '這是最新的資源分享。',
      img: 'https://picsum.photos/seed/share1/400/300',
    },
    {
      id: 2,
      title: '分享項目 B',
      desc: '這是最新的資源分享。',
      img: 'https://picsum.photos/seed/share2/400/300',
    },
    {
      id: 3,
      title: '分享項目 C',
      desc: '這是最新的資源分享。',
      img: 'https://picsum.photos/seed/share3/400/300',
    },
    {
      id: 4,
      title: '分享項目 D',
      desc: '這是最新的資源分享。',
      img: 'https://picsum.photos/seed/share4/400/300',
    },
  ];

  const needs = [
    {
      id: 1,
      title: '需求項目 X',
      desc: '這是最新的需求資訊。',
      img: 'https://picsum.photos/seed/need1/400/300',
    },
    {
      id: 2,
      title: '需求項目 Y',
      desc: '這是最新的需求資訊。',
      img: 'https://picsum.photos/seed/need2/400/300',
    },
    {
      id: 3,
      title: '需求項目 Z',
      desc: '這是最新的需求資訊。',
      img: 'https://picsum.photos/seed/need3/400/300',
    },
    {
      id: 4,
      title: '需求項目 W',
      desc: '這是最新的需求資訊。',
      img: 'https://picsum.photos/seed/need4/400/300',
    },
  ];

  const items = tab === 0 ? shares : needs;

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mt: 8, mb: 2, color: '#000000' }}
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

      {/* Grid 卡片內容 */}
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardMedia
                component="img"
                image={item.img}
                alt={item.title}
                sx={{ borderRadius: 2 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {item.desc}
                </Typography>
                <Button variant="contained" size="small">
                  {tab === 0 ? '查看資源' : '聯繫需求'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* 查看更多按鈕 */}
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
