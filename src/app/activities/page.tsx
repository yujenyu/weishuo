'use client';

import { Container, Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}
      >
        活動紀實
      </Typography>
      <Typography variant="body1" color="text.secondary">
        我們近期舉辦的公益活動
      </Typography>
    </Container>
  );
}
