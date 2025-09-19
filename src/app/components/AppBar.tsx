'use client';
import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { FaBars, FaGoogle } from 'react-icons/fa6';
import ThemeToggleButton from './ThemeToggleButton';
import { useSession, signIn, signOut } from 'next-auth/react';

const navLinks = [
  { label: '關於我們', href: '/about' },
  { label: '最新資訊', href: '/news' },
  { label: '資源分享', href: '/resources' },
  { label: '社群留言', href: '/community' },
  { label: '活動紀實', href: '/activities' },
  { label: '聯絡我們', href: '/contact' },
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthed = status === 'authenticated';
  const user = session?.user;

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      enableColorOnDark
      sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Brand*/}
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'helvetica',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WEISHUO
          </Typography>

          {/* Mobile: Menu Button + Nav Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {/* <MenuIcon /> */}
              <FaBars style={{ fontSize: '24px' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.label}
                  component={Link}
                  href={link.href}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: 'center' }}>
                    {link.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Brand */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'helvetica',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WEISHUO
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                href={link.href}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Profile Icon Controls */}
          <Box sx={{ flexGrow: 0 }}>
            <ThemeToggleButton />
            {!isAuthed ? (
              <>
                {/* xs: Google IconButton */}
                <IconButton
                  aria-label="使用 Google 登入"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                >
                  <FaGoogle size={22} />
                </IconButton>

                {/* md: 含文字的登入按鈕 */}
                <Button
                  variant="contained"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  disabled={isLoading}
                  startIcon={<FaGoogle />}
                  sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                >
                  {isLoading ? '載入中…' : '登入'}
                </Button>
              </>
            ) : (
              <>
                {/* 已登入: 顯示真實使用者頭像與選單 */}
                <Tooltip title={user?.name ?? '帳戶'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name ?? 'User'}
                      src={user?.image ?? undefined} // 改用 session.user.image
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* 明確列出個人資料與登出 */}
                  <MenuItem
                    component={Link}
                    href="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography sx={{ textAlign: 'center' }}>
                      個人資料
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>登出</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
