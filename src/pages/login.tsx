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
    roles: ['Admin'],
    department: 'IT Administration'
  },
  {
    id: 'employee-user-001', 
    email: 'employee@atiwebportal.com',
    password: 'emp123',
    name: 'John Employee',
    roles: ['Employee'],
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

  // Ensure component is mounted to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (mounted && user) {
      router.push('/');
    }
  }, [user, router, mounted]);

  const handleDummyLogin = async (dummyUser: typeof dummyUsers[0]) => {
    console.log('Dummy login clicked for user:', dummyUser);
    setLoading(true);
    setError('');
    
    try {
      await login(dummyUser);
      console.log('Login successful, redirecting to home...');
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
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
        router.push('/');
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
      router.push('/');
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
                        <Avatar sx={{ bgcolor: user.roles.includes('Admin') ? 'error.main' : 'primary.main' }}>
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
                              color={user.roles.includes('Admin') ? 'error' : 'primary'}
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

// Force server-side rendering to prevent static generation issues
export async function getServerSideProps() {
  return {
    props: {},
  };
}