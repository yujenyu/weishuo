'use client';

import { Container, Typography } from '@mui/material';

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6, color: 'text.primary' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        聯絡我們
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        如果您有任何問題或建議，歡迎透過以下方式與我們聯絡：
      </Typography>
      <Typography variant="subtitle2">Email: support@example.com</Typography>
      <Typography variant="subtitle2">電話: 0800-000-000</Typography>
    </Container>
  );
}
