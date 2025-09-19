'use client';
import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';

export default function ThemeToggleButton() {
  /**
    @todo: 確認&理解 toggle btn code
  **/

  /**
    @todo: 切換 git 開發 branch
  **/

  const { mode, systemMode, setMode } = useColorScheme();

  // 首次 render 會是 undefined，避免水合不一致
  if (typeof mode === 'undefined') return null;

  // 解析當前實際顯示的模式（若為 system 則看 OS 偏好）
  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? (systemMode ?? 'light') : mode;

  // 下一步要切換成的模式（這裡用「兩段式」：只在 light/dark 間切換）
  const nextMode: 'light' | 'dark' = resolvedMode === 'dark' ? 'light' : 'dark';

  const handleClick = () => {
    setMode(nextMode); // 點擊直接在 light / dark 間切換
    // 想要三段式循環（system → light → dark → system）可用以下：
    // const next = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
    // setMode(next);
  };

  const tooltip =
    mode === 'system'
      ? `目前：系統（${resolvedMode === 'dark' ? '深色' : '淺色'}）— 點擊切換為${nextMode === 'dark' ? '深色' : '淺色'}`
      : `目前：${mode === 'dark' ? '深色' : '淺色'} — 點擊切換為${nextMode === 'dark' ? '深色' : '淺色'}`;

  return (
    <Tooltip title={tooltip}>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`toggle color scheme to ${nextMode}`}
        size="small"
        sx={{ mr: 1.5 }}
      >
        {resolvedMode === 'dark' ? (
          <MdOutlineLightMode size={24} />
        ) : (
          <MdOutlineDarkMode size={24} />
        )}
      </IconButton>
    </Tooltip>
  );
}
