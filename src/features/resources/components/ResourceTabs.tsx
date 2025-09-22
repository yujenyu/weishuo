'use client';

import { Box, Button, Tabs, Tab } from '@mui/material';

export default function ResourceTabs({
  activeTab,
  setActiveTab,
  onCreate,
  createDisabled,
  createLabel,
}: {
  activeTab: number;
  setActiveTab: (v: number) => void;
  onCreate: () => void;
  createDisabled: boolean;
  createLabel: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap', // 小螢幕時自動換行
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          '& .MuiTab-root': { py: 1 },
        }}
      >
        <Tab label="最新分享" />
        <Tab label="最新需求" />
      </Tabs>

      <Button
        variant="contained"
        onClick={onCreate}
        disabled={createDisabled} // 讀取 session 中先禁用
        sx={{ ml: 'auto', whiteSpace: 'nowrap', alignSelf: 'center' }}
      >
        {createLabel}
      </Button>
    </Box>
  );
}
