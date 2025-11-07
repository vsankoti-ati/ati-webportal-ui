import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function AuthDebugPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const envVars = {
    'NEXT_PUBLIC_SKIP_MSAL': process.env.NEXT_PUBLIC_SKIP_MSAL || 'not set',
    'NEXT_PUBLIC_AZURE_AD_CLIENT_ID': process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || 'not set',
    'NEXT_PUBLIC_AZURE_AD_TENANT_ID': process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || 'not set',
    'NEXT_PUBLIC_REDIRECT_URI': process.env.NEXT_PUBLIC_REDIRECT_URI || 'not set',
    'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL || 'not set',
    'NODE_ENV': process.env.NODE_ENV || 'not set',
  };

  const localStorageData = typeof window !== 'undefined' ? {
    'mockUser': localStorage.getItem('mockUser') || 'not set',
  } : {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Authentication Debug Information
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          This page shows authentication state and environment configuration. 
          Use this to diagnose login issues in Azure deployment.
        </Alert>

        {/* Authentication State */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Authentication State
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell><strong>Is Loading</strong></TableCell>
                <TableCell>
                  <Chip 
                    label={isLoading ? 'YES' : 'NO'} 
                    color={isLoading ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Is Authenticated</strong></TableCell>
                <TableCell>
                  <Chip 
                    label={isAuthenticated ? 'YES' : 'NO'} 
                    color={isAuthenticated ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>User ID</strong></TableCell>
                <TableCell>{user?.id || 'null'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>User Name</strong></TableCell>
                <TableCell>{user?.name || 'null'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>User Email</strong></TableCell>
                <TableCell>{user?.email || 'null'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>User Roles</strong></TableCell>
                <TableCell>
                  {user?.roles ? user.roles.join(', ') : 'null'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>User Department</strong></TableCell>
                <TableCell>{user?.department || 'null'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Environment Variables */}
        <Typography variant="h6" gutterBottom>
          Environment Variables
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Variable</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(envVars).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    <Box 
                      component="code" 
                      sx={{ fontSize: '0.85em' }}
                    >
                      {key.includes('CLIENT_ID') || key.includes('TENANT_ID') 
                        ? value.substring(0, 8) + '...' 
                        : value}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* LocalStorage Data */}
        <Typography variant="h6" gutterBottom>
          LocalStorage Data
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Key</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(localStorageData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    <Box 
                      component="code" 
                      sx={{ fontSize: '0.75em', wordBreak: 'break-all' }}
                    >
                      {value}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Actions */}
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/')}
          >
            Go to Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/job-openings')}
          >
            Go to Job Openings
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/timesheets')}
          >
            Go to Timesheets
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

// Force server-side rendering
export async function getServerSideProps() {
  return {
    props: {},
  };
}
