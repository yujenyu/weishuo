'use client';

import { Container } from '@mui/material';
import NewsSection from '../components/NewsSection';

export default function NewsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <NewsSection />
    </Container>
  );
}
