'use client';

import { Grid, Button, CircularProgress } from '@mui/material';
import ResourceCard from './ResourceCard';
import type { Item } from '../types';

export default function ResourceGrid({
  items,
  actionLabel,
  onLoadMore,
  hasMore,
  loading,
  showLoadMore,
}: {
  items: Item[];
  actionLabel: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  showLoadMore: boolean;
}) {
  return (
    <Grid container spacing={4}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
          <ResourceCard item={item} actionLabel={actionLabel} />
        </Grid>
      ))}

      {showLoadMore && (
        <Grid
          size={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            disabled={!hasMore || loading}
            onClick={onLoadMore}
            startIcon={
              loading ? <CircularProgress size={16} thickness={5} /> : null
            }
          >
            {loading ? '載入中...' : hasMore ? '查看更多' : '沒有更多了'}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
