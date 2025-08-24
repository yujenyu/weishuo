'use client';

import { Container, Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3, color: '#000000' }}
      >
        關於我們
      </Typography>
      <Typography variant="body1" color="text.secondary">
        我們致力於公益，分享物資與資訊，幫助有需要的人。
      </Typography>
    </Container>
  );
}
