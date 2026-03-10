import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Error,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  LightMode,
  DarkMode,
  Settings
} from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

const DRAWER_WIDTH = 260;

const DashboardLayout = React.memo(({ children, currentPage, onPageChange, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleTheme, isDarkMode } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout();
  };

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'cars', label: 'My Cars', icon: DirectionsCar },
    { id: 'maintenance', label: 'Maintenance', icon: Build },
    { id: 'errors', label: 'Error Codes', icon: Error },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const profileMenuItems = [
    { id: 'profile', label: 'Profile', icon: AccountCircle },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 1.5 }}>
      {/* Header / Branding */}
      <Box sx={{ pt: 3, pb: 2, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DirectionsCar sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              CarLogix
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Vehicle Manager
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 1.5, mb: 0.5, display: 'block', color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          Menu
        </Typography>
        <List sx={{ px: 0 }}>
          {mainMenuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    onPageChange(item.id);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{ borderRadius: 2, py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <item.icon
                      sx={{
                        fontSize: 20,
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Profile Section at Bottom */}
      <Box sx={{ pb: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="overline" sx={{ px: 1.5, mb: 0.5, display: 'block', color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          Account
        </Typography>
        <List sx={{ px: 0 }}>
          {profileMenuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    onPageChange(item.id);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{ borderRadius: 2, py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <item.icon sx={{ fontSize: 20, color: isActive ? 'primary.main' : 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          <ListItem disablePadding sx={{ mb: 0.3 }}>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Logout sx={{ fontSize: 20, color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* User card */}
        {user && (
          <Box sx={{
            mt: 1, p: 1.5, borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}>
            <Avatar sx={{
              width: 34, height: 34, fontSize: '0.85rem', fontWeight: 600,
              background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
            }}>
              {user.name?.charAt(0) || '?'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user.email || ''}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  const drawerPaperSx = {
    boxSizing: 'border-box',
    width: DRAWER_WIDTH,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {[...mainMenuItems, ...profileMenuItems].find(item => item.id === currentPage)?.label || 'CarLogix'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{
                width: 32, height: 32, fontSize: '0.8rem', fontWeight: 600,
                background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
              }}>
                {user?.name?.charAt(0) || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleProfileMenuClose(); onPageChange('profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
});

export default DashboardLayout;