'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';

export default function NewsSection() {
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
        {[1, 2, 3].map((news) => (
          <Grid key={news} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                image={`https://picsum.photos/seed/news${news}/600/400`}
                alt="news image"
                height="180"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  新聞標題 {news}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  這是一段最新消息的摘要，簡單介紹文章內容。
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
