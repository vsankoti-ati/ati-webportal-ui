import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const dummyUsers = [
  {
    id: 'admin-user-001',
    email: 'admin@atiwebportal.com',
    password: 'admin123',
    name: 'Admin User',
    roles: ['ati_portal_admin'],
    department: 'IT Administration'
  },
  {
    id: 'employee-user-001', 
    email: 'employee@atiwebportal.com',
    password: 'emp123',
    name: 'John Employee',
    roles: ['ati_portal_user'],
    department: 'Software Development'
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, loginWithMsal, user } = useAuth();
  const router = useRouter();
  const hasRedirected = React.useRef(false);

  console.log('[LoginPage] Component state:', { 
    mounted, 
    hasUser: !!user, 
    returnUrl: router.query.returnUrl,
    fullQuery: router.query,
    pathname: router.pathname,
    asPath: router.asPath,
    isReady: router.isReady,
    hasRedirected: hasRedirected.current
  });

  // Ensure component is mounted to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in, redirect to returnUrl or home
  React.useEffect(() => {
    // Wait for router to be ready to ensure query params are available
    if (!mounted || !user || !router.isReady || hasRedirected.current) {
      return;
    }
    
    const returnUrl = router.query.returnUrl as string | undefined;
    const destination = returnUrl || '/';
    
    console.log('[LoginPage] User already logged in, redirecting to:', {
      destination,
      returnUrl,
      queryParams: router.query,
      isReady: router.isReady
    });
    
    hasRedirected.current = true;
    router.push(destination);
  }, [user, mounted, router]);

  const handleDummyLogin = async (dummyUser: typeof dummyUsers[0]) => {
    console.log('[LoginPage] Dummy login clicked for user:', dummyUser);
    console.log('[LoginPage] ReturnUrl at login:', router.query.returnUrl);
    setLoading(true);
    setError('');
    
    try {
      await login(dummyUser);
      const destination = (router.query.returnUrl as string) || '/';
      console.log('[LoginPage] Login successful, redirecting to:', destination);
      router.push(destination);
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check dummy users first
    const dummyUser = dummyUsers.find(
      user => user.email === email && user.password === password
    );

    if (dummyUser) {
      try {
        await login(dummyUser);
        const destination = (router.query.returnUrl as string) || '/';
        console.log('[LoginPage] Form login successful, redirecting to:', destination);
        router.push(destination);
      } catch (err) {
        setError('Login failed. Please try again.');
      }
    } else {
      setError('Invalid email or password. Use dummy credentials or Azure AD login.');
    }
    
    setLoading(false);
  };

  const handleAzureLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithMsal();
      const destination = (router.query.returnUrl as string) || '/';
      console.log('[LoginPage] Azure login successful, redirecting to:', destination);
      router.push(destination);
    } catch (err) {
      setError('Azure AD login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4} maxWidth="md">
          {/* Left side - Main Login */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    ATI Web Portal
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to your account
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {/* Azure AD Login */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleAzureLogin}
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.50',
                    }
                  }}
                >
                  Sign in with Microsoft
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                {/* Form Login */}
                <Box component="form" onSubmit={handleFormLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right side - Demo Accounts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Demo Accounts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Click any account below for quick login or use the credentials in the form.
                </Typography>
                
                <List>
                  {dummyUsers.map((user, index) => (
                    <ListItem
                      key={user.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                      onClick={() => handleDummyLogin(user)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: user.roles.includes('ati_portal_admin') ? 'error.main' : 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {user.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={user.roles[0]}
                              color={user.roles.includes('ati_portal_admin') ? 'error' : 'primary'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Password: {user.password} | {user.department}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    These are demo accounts for testing. In production, use Azure AD authentication.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}