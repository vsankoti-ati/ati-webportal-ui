import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Person,
  EventNote,
  Work,
  CalendarMonth,
  AccessTime,
  Description,
  ChevronLeft,
  ChevronRight,
  Assessment,
  ListAlt,
  Approval,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? drawerWidth : 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

interface LayoutProps {
  children: ReactNode;
}

// Menu items configuration with role-based access
const getMenuItems = (userRoles: string[] = []) => {
  const isAdmin = userRoles.includes('Admin');
  const isHR = userRoles.includes('HR');
  
  const baseItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'My Profile', icon: <AccountCircle />, path: '/profile' },
    { text: 'Job Openings', icon: <Work />, path: '/job-openings' },
    { text: 'Holiday Calendar', icon: <CalendarMonth />, path: '/holidays' },
    { text: 'My Timesheets', icon: <ListAlt />, path: '/timesheets' },
    { text: 'Weekly Summary', icon: <Assessment />, path: '/timesheets/summary' },
    { text: 'Documents', icon: <Description />, path: '/documents' },
  ];

  // Admin/HR only menu items
  const adminItems = [
    { text: 'Leave Management', icon: <EventNote />, path: '/leave' },
    { text: 'Employee Details', icon: <Person />, path: '/employee' },
    { text: 'Timesheet Approvals', icon: <Approval />, path: '/timesheets/approvals' },
  ];

  return isAdmin || isHR ? [...baseItems, ...adminItems] : baseItems;
};

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    router.push('/login');
  };

  // Prevent hydration mismatch during mounting
  if (!mounted) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ATI Intranet Portal
          </Typography>
          
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle2">{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                  {user?.roles?.join(', ')}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
      >
        <Toolbar />
        <List>
          {getMenuItems(user?.roles || []).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false); // Close drawer on mobile after navigation
              }}
              selected={router.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Toolbar />
        <List>
          {getMenuItems(user?.roles || []).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => router.push(item.path)}
              selected={router.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Main open={!isMobile}>
        <Toolbar />
        {children}
      </Main>
    </Box>
  );
}