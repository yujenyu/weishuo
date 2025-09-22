import { Container } from '@mui/material';
import ResourcesSection from '@/features/resources/ResourcesSection';

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <ResourcesSection />
    </Container>
  );
}
