'use client';

import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Box,
} from '@mui/material';
import {
  ACTIONS_HEIGHT,
  CARD_RADIUS,
  IMAGE_HEIGHT,
  PAGE_SIZE,
} from '../lib/constants';

export default function ResourceSkeletonGrid() {
  return (
    // 清單級 Skeleton
    <Grid container spacing={4}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Grid key={`skeleton-${i}`} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <Box
              sx={{
                position: 'relative',
                height: IMAGE_HEIGHT,
                borderRadius: CARD_RADIUS,
                overflow: 'hidden',
                bgcolor: 'action.hover',
                mb: 2,
              }}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                }}
              />
            </Box>
            <CardContent>
              <Skeleton
                variant="text"
                width="70%"
                height={28}
                sx={{ mx: 'auto' }}
              />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
            </CardContent>
            <CardActions
              sx={{
                mt: 'auto',
                p: 0,
                pt: 1,
                justifyContent: 'center',
                minHeight: ACTIONS_HEIGHT,
              }}
            >
              <Skeleton variant="rounded" width={100} height={36} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
