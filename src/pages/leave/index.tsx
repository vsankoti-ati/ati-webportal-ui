import { Box, Container, Grid, CircularProgress } from '@mui/material';
import Layout from '../../components/Layout';
import LeaveBalance from '../../components/LeaveBalance';
import LeaveApplications from '../../components/LeaveApplications';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { employeeService } from '../../services/employee';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export default function LeavePage() {
  const { user, isAuthenticated } = useAuth();
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (useMockData) {
        // Use mock data for development
        setEmployeeId(101); // Mock employee ID
        setIsAdmin(user.roles.includes('Admin') || user.roles.includes('HR'));
        setLoading(false);
      } else {
        // Use real API for production
        loadEmployeeDetails(user.email);
        setIsAdmin(user.roles.includes('Admin') || user.roles.includes('HR'));
      }
    }
  }, [user, isAuthenticated]);

  const loadEmployeeDetails = async (email: string) => {
    try {
      const employee = await employeeService.getProfile();
      setEmployeeId(employee.id);
    } catch (error) {
      console.error('Error loading employee details:', error);
      // Fallback to mock ID if API fails
      setEmployeeId(101);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !employeeId) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <ProtectedRoute roles={['Admin', 'HR']}>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <LeaveBalance employeeId={employeeId} />
              </Grid>
              <Grid item xs={12} md={8}>
                <LeaveApplications employeeId={employeeId} isAdmin={isAdmin} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}