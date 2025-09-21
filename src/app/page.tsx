'use client';

import { Container, Stack, Box } from '@mui/material';
import NewsSection from './components/NewsSection';
import ResourcesSection from './components/ResourcesSection';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Stack spacing={{ xs: 6, sm: 8, md: 10 }}>
        <Box component="section">
          <ResourcesSection />
        </Box>
        <Box component="section">
          <NewsSection />
        </Box>
      </Stack>
    </Container>
  );
}
