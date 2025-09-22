'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Stack,
} from '@mui/material';

export default function GuestbookPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}
      >
        留言板
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        歡迎留下你的想法與回饋。我們會適時整理常見建議，持續改進服務。
      </Typography>

      {/* 留言輸入區（僅外觀，尚未接 API） */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="你的名稱（可留空）"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
            <TextField
              label="留言內容"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              minRows={3}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" size="small" disabled>
                送出（待串接）
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* 近期留言（靜態 placeholder） */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        最新留言
      </Typography>

      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              匿名 · 剛剛
            </Typography>
            <Typography variant="body2">
              很棒的計畫，加油！未來希望可以看到需求的即時更新。
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Alex · 昨天
            </Typography>
            <Typography variant="body2">
              介面清楚好用，期待手機版更優化 🙌
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
