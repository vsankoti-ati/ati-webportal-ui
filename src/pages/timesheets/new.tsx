import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { createTimesheet } from '@/services/timesheetService';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateTimesheetDto } from '@/types/timesheet';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export default function NewTimesheet() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTimesheetDto>();

  const createMutation = useMutation(createTimesheet, {
    onSuccess: () => {
      queryClient.invalidateQueries('my-timesheets');
      router.push('/timesheets');
    },
  });

  // Set default dates to current week
  React.useEffect(() => {
    const now = new Date();
    setValue('start_date', format(startOfWeek(now), 'yyyy-MM-dd'));
    setValue('end_date', format(endOfWeek(now), 'yyyy-MM-dd'));
  }, [setValue]);

  const onSubmit = (data: CreateTimesheetDto) => {
    createMutation.mutate(data);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Create New Timesheet
            </Typography>
          </Box>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create timesheet. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('start_date', { required: 'Start date is required' })}
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.start_date}
                helperText={errors.start_date?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('end_date', { required: 'End date is required' })}
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.end_date}
                helperText={errors.end_date?.message}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="outlined"
              onClick={() => router.push('/timesheets')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Creating...' : 'Create Timesheet'}
            </Button>
          </Box>
        </form>
      </Paper>
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