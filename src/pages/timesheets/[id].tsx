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
  Divider,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  fetchTimesheet, 
  fetchTimeEntries,
  submitTimesheet,
  deleteTimesheet,
  deleteTimeEntry
} from '@/services/timesheetService';
import { fetchActiveProjects } from '@/services/projectService';
import { format } from 'date-fns';
import TimeEntryForm from '@/components/timesheets/TimeEntryForm';
import { useConfirm } from '@/hooks/useConfirm';
import HomeIcon from '@mui/icons-material/Home';

export default function TimesheetDetails() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { showConfirm } = useConfirm();
  
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

  const { data: projects } = useQuery('active-projects', fetchActiveProjects);

  const submitMutation = useMutation(submitTimesheet, {
    onSuccess: () => {
      queryClient.invalidateQueries(['timesheet', id]);
      queryClient.invalidateQueries('my-timesheets');
    },
  });

  const deleteTimesheetMutation = useMutation(deleteTimesheet, {
    onSuccess: () => {
      queryClient.invalidateQueries('my-timesheets');
      router.push('/timesheets');
    },
  });

  const deleteTimeEntryMutation = useMutation(deleteTimeEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries', id]);
      queryClient.invalidateQueries(['timesheet', id]);
    },
  });

  const handleSubmit = async () => {
    const confirmed = await showConfirm({
      title: 'Submit Timesheet',
      message: 'Are you sure you want to submit this timesheet? You won\'t be able to make changes after submission.',
      confirmText: 'Submit',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      submitMutation.mutate(Number(id));
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const totalHours = timeEntries?.reduce(
    (sum, entry) => sum + entry.hours_worked,
    0
  ) || 0;

  if (isLoadingTimesheet) {
    return <div>Loading...</div>;
  }

  if (!timesheet) {
    return <div>Timesheet not found</div>;
  }

  return (
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
            Timesheet Details
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => router.push('/timesheets')}
          >
            Back to List
          </Button>
          {timesheet.status === 'draft' && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitMutation.isLoading || totalHours === 0}
              >
                {submitMutation.isLoading ? 'Submitting...' : 'Submit Timesheet'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  const confirmed = await showConfirm({
                    title: 'Delete Timesheet',
                    message: 'Are you sure you want to delete this timesheet? This action cannot be undone.',
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                  });
                  if (confirmed) {
                    deleteTimesheetMutation.mutate(Number(id));
                  }
                }}
                disabled={deleteTimesheetMutation.isLoading}
              >
                {deleteTimesheetMutation.isLoading ? 'Deleting...' : 'Delete Timesheet'}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {submitMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to submit timesheet. Please try again.
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
              {timesheet.submission_date && (
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Submitted
                  </Typography>
                  <Typography>
                    {format(new Date(timesheet.submission_date), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              )}
              {timesheet.approval_date && (
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {timesheet.status === 'approved' ? 'Approved' : 'Rejected'} On
                  </Typography>
                  <Typography>
                    {format(new Date(timesheet.approval_date), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {timesheet?.status === 'draft' && projects && timesheet && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Add Time Entry
                </Typography>
                <TimeEntryForm 
                  timesheetId={Number(id)}
                  timesheet={timesheet}
                  projects={projects}
                  onSuccess={() => {
                    queryClient.invalidateQueries(['timeEntries', id]);
                  }}
                />
              </Paper>
              <Divider sx={{ my: 3 }} />
            </>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Notes</TableCell>
                  {timesheet.status === 'draft' && <TableCell>Actions</TableCell>}
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
                    {timesheet.status === 'draft' && (
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={async () => {
                            const confirmed = await showConfirm({
                              title: 'Delete Time Entry',
                              message: 'Are you sure you want to delete this time entry?',
                              confirmText: 'Delete',
                              cancelText: 'Cancel',
                            });
                            if (confirmed) {
                              deleteTimeEntryMutation.mutate(entry.id);
                            }
                          }}
                          disabled={deleteTimeEntryMutation.isLoading}
                        >
                          {deleteTimeEntryMutation.isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {(!timeEntries || timeEntries.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={timesheet.status === 'draft' ? 6 : 5}
                      align="center"
                    >
                      No time entries found.
                      {timesheet.status === 'draft' && ' Add an entry to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

// Force server-side rendering to prevent static generation issues
export async function getServerSideProps() {
  return {
    props: {},
  };
}