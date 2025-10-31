import React from 'react';
import {
  Box,
  Button,
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
} from '@mui/material';
import { useQuery } from 'react-query';
import { fetchMyTimesheets } from '@/services/timesheetService';
import { Timesheet } from '@/types/timesheet';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

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

export default function TimesheetList() {
  const router = useRouter();
  const { data: timesheets, isLoading } = useQuery('my-timesheets', fetchMyTimesheets);

  const handleCreate = () => {
    router.push('/timesheets/new');
  };

  const handleView = (id: number) => {
    router.push(`/timesheets/${id}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div>Loading...</div>
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
              My Timesheets
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              New Timesheet
            </Button>
          </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
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
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(timesheet.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!timesheets || timesheets.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No timesheets found. Create a new timesheet to get started.
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