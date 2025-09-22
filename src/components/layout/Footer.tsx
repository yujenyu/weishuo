'use client';

import { Box, Typography, IconButton } from '@mui/material';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: 'grey.900',
        color: 'grey.100',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} <strong>WEISHUO</strong>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="inherit" href="https://facebook.com">
          <FaFacebook />
        </IconButton>
        <IconButton color="inherit" href="https://instagram.com">
          <FaInstagram />
        </IconButton>
        <IconButton color="inherit" href="https://youtube.com">
          <FaYoutube />
        </IconButton>
      </Box>
    </Box>
  );
}
