import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import { Timesheet } from '@/types/timesheet';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

// Add this query function to timesheetService.ts
import { fetchPendingApprovals } from '@/services/timesheetService';

const getStatusColor = (status: Timesheet['status']) => {
  switch (status) {
    case 'draft':
      return 'default';
    case 'submitted':
      return 'primary';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

export default function TimesheetApprovals() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Check if user has admin or HR privileges
  const hasApprovalRights = user?.roles.some(role => ['Admin', 'HR'].includes(role));
  
  const { data: timesheets, isLoading } = useQuery(
    'pending-approvals',
    fetchPendingApprovals,
    {
      enabled: hasApprovalRights,
    }
  );

  const handleView = (id: number) => {
    router.push(`/timesheets/${id}/review`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Access denied page for non-admin users
  if (!hasApprovalRights) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Access Restricted
                </Typography>
                <Typography>
                  You don't have sufficient privileges to access timesheet approvals. 
                  This feature is only available to administrators and HR personnel.
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => router.push('/timesheets')} 
                  sx={{ mt: 2 }}
                >
                  Go to My Timesheets
                </Button>
              </Alert>
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute roles={['Admin', 'HR']}>
        <Layout>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['Admin', 'HR']}>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleBackToHome}
                size="small"
              >
                Back to Home
              </Button>
              <Typography variant="h4" component="h1">
                Timesheet Approvals
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheets?.map((timesheet) => {
              const totalHours = timesheet.time_entries?.reduce(
                (sum, entry) => sum + entry.hours_worked,
                0
              ) || 0;

              return (
                <TableRow key={timesheet.id}>
                  <TableCell>
                    {timesheet.employee?.first_name} {timesheet.employee?.last_name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(timesheet.start_date), 'MMM d, yyyy')} -{' '}
                    {format(new Date(timesheet.end_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{totalHours}</TableCell>
                  <TableCell>
                    {timesheet.submission_date
                      ? format(new Date(timesheet.submission_date), 'MMM d, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={timesheet.status.toUpperCase()}
                      color={getStatusColor(timesheet.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        onClick={() => handleView(timesheet.id)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!timesheets || timesheets.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No timesheets pending approval.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
        </Layout>
      </ProtectedRoute>
  );
}

// Force server-side rendering to prevent static generation issues
export async function getServerSideProps() {
  return {
    props: {},
  };
}