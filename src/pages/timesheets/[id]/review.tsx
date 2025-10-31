import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  fetchTimesheet, 
  fetchTimeEntries,
  approveTimesheet,
  rejectTimesheet,
} from '@/services/timesheetService';
import { format } from 'date-fns';
import { useConfirm } from '@/hooks/useConfirm';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export default function TimesheetReview() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { showConfirm } = useConfirm();
  const [comments, setComments] = React.useState('');
  const { user } = useAuth();
  
  const { data: timesheet, isLoading: isLoadingTimesheet } = useQuery(
    ['timesheet', id],
    () => fetchTimesheet(Number(id)),
    { enabled: !!id }
  );

  const { data: timeEntries } = useQuery(
    ['timeEntries', id],
    () => fetchTimeEntries(Number(id)),
    { enabled: !!id }
  );

  const approveMutation = useMutation(
    () => approveTimesheet(Number(id), comments),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['timesheet', id]);
        queryClient.invalidateQueries('pending-approvals');
        router.push('/timesheets/approvals');
      },
    }
  );

  const rejectMutation = useMutation(
    () => rejectTimesheet(Number(id), comments),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['timesheet', id]);
        queryClient.invalidateQueries('pending-approvals');
        router.push('/timesheets/approvals');
      },
    }
  );

  const handleApprove = async () => {
    const confirmed = await showConfirm({
      title: 'Approve Timesheet',
      message: 'Are you sure you want to approve this timesheet?',
      confirmText: 'Approve',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      approveMutation.mutate();
    }
  };

  const handleReject = async () => {
    const confirmed = await showConfirm({
      title: 'Reject Timesheet',
      message: 'Are you sure you want to reject this timesheet?',
      confirmText: 'Reject',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      rejectMutation.mutate();
    }
  };

  const totalHours = timeEntries?.reduce(
    (sum, entry) => sum + entry.hours_worked,
    0
  ) || 0;

  if (!user?.roles.includes('Admin')) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography>You don't have permission to access this page.</Typography>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (isLoadingTimesheet) {
    return (
      <ProtectedRoute>
        <Layout>
          <div>Loading...</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!timesheet) {
    return (
      <ProtectedRoute>
        <Layout>
          <div>Timesheet not found</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Review Timesheet
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/timesheets/approvals')}
            >
              Back to Approvals
            </Button>
          </Box>

      {(approveMutation.isError || rejectMutation.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to process timesheet. Please try again.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Timesheet Information
            </Typography>
            <Box sx={{ '& > *': { mb: 2 } }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Employee
                </Typography>
                <Typography>
                  {timesheet.employee?.first_name} {timesheet.employee?.last_name}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Period
                </Typography>
                <Typography>
                  {format(new Date(timesheet.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(timesheet.end_date), 'MMM d, yyyy')}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={timesheet.status.toUpperCase()}
                  color={
                    timesheet.status === 'approved'
                      ? 'success'
                      : timesheet.status === 'rejected'
                      ? 'error'
                      : 'primary'
                  }
                />
              </Box>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Total Hours
                </Typography>
                <Typography>{totalHours}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Submission Date
                </Typography>
                <Typography>
                  {timesheet.submission_date 
                    ? format(new Date(timesheet.submission_date), 'MMM d, yyyy')
                    : 'Not submitted'
                  }
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Comments
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Enter your comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
                disabled={
                  approveMutation.isLoading ||
                  rejectMutation.isLoading ||
                  timesheet.status !== 'submitted'
                }
                fullWidth
              >
                {approveMutation.isLoading ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleReject}
                disabled={
                  approveMutation.isLoading ||
                  rejectMutation.isLoading ||
                  timesheet.status !== 'submitted'
                }
                fullWidth
              >
                {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.entry_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{entry.project?.name}</TableCell>
                    <TableCell>{entry.hours_worked}</TableCell>
                    <TableCell>
                      {entry.start_time} - {entry.end_time}
                    </TableCell>
                    <TableCell>{entry.notes || '-'}</TableCell>
                  </TableRow>
                ))}
                {(!timeEntries || timeEntries.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No time entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
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