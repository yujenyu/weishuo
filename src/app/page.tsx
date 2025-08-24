'use client';

import { Container } from '@mui/material';
import NewsSection from './components/NewsSection';
import ResourcesSection from './components/ResourcesSection';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <ResourcesSection />
      <NewsSection />
    </Container>
  );
}
