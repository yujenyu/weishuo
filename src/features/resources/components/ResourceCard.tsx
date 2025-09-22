'use client';

import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { ACTIONS_HEIGHT, CARD_RADIUS, IMAGE_HEIGHT } from '../lib/constants';
import type { Item } from '../types';

export default function ResourceCard({
  item,
  actionLabel,
}: {
  item: Item;
  actionLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: IMAGE_HEIGHT,
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          bgcolor: 'action.hover', // 圖片載入前的底色，避免白底閃爍
          mb: 2,
        }}
      >
        {/* 圖片級 Skeleton 疊層 */}
        {!loaded && (
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
        )}

        <Box
          component="img"
          src={item.imageUrl || '/No_Image_Placeholder.png'}
          alt={item.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .25s ease',
            borderRadius: 'inherit',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {item.description ?? '—'}
        </Typography>
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
        <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
