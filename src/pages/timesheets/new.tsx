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
import { useAuth } from '@/hooks/useAuth';
import { useEmployeeData } from '@/hooks/useEmployee';

export default function NewTimesheet() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get the logged-in user
  const { employeeData, isLoading: isLoadingEmployee, error: employeeError } = useEmployeeData(); // Get employee data
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTimesheetDto>();

  // Now you can access user details:
  // user.id - User ID
  // user.name - User's name
  // user.email - User's email
  // user.roles - Array of user roles
  // user.department - User's department (optional)
  // employeeData - Complete employee information from the API
  
  console.log('Logged in user:', user);
  console.log('Employee data:', employeeData);

  const createMutation = useMutation(createTimesheet, {
    onSuccess: () => {
      queryClient.invalidateQueries('my-timesheets');
      router.push('/timesheets');
    },
  });

  // Set default dates to current week
  React.useEffect(() => {
    const now = new Date();
    setValue('startDate', format(startOfWeek(now), 'yyyy-MM-dd'));
    setValue('endDate', format(endOfWeek(now), 'yyyy-MM-dd'));
  }, [setValue]);

  const onSubmit = (data: CreateTimesheetDto) => {
    // Get employee ID from employee data and assign to data.employeeId
    if (employeeData?.id) {
      data.employeeId = employeeData.id;
      console.log('Assigning employee ID to timesheet:', employeeData.id);
    } else {
      console.warn('Employee data not available, cannot assign employee ID');
    }
    
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

      {employeeError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Employee data not available: {employeeError}. Timesheet may not be properly associated with your employee record.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('startDate', { required: 'Start date is required' })}
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('endDate', { required: 'End date is required' })}
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
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
              disabled={createMutation.isLoading || isLoadingEmployee || !employeeData}
            >
              {createMutation.isLoading ? 'Creating...' : 
               isLoadingEmployee ? 'Loading Employee Data...' :
               !employeeData ? 'Employee Data Required' :
               'Create Timesheet'}
            </Button>
          </Box>
        </form>
      </Paper>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}