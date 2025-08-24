'use client';

import { Container } from '@mui/material';
import ResourcesSection from '../components/ResourcesSection';

export default function ResourcesPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <ResourcesSection />
    </Container>
  );
}
