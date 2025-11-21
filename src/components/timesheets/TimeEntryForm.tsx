import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { createTimeEntry } from '@/services/timesheetService';
import { CreateTimeEntryDto, Timesheet } from '@/types/timesheet';
import type { Project } from '@/types/timesheet';
import { validateTimeEntry } from '@/utils/timesheet-validations';

interface TimeEntryFormProps {
  timesheetId: number;
  projects: Project[];
  timesheet: Timesheet;
  onSuccess: () => void;
}

export default function TimeEntryForm({ timesheetId, timesheet, projects, onSuccess }: TimeEntryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTimeEntryDto>();

  const createMutation = useMutation(
    (data: CreateTimeEntryDto) => createTimeEntry(timesheetId, data),
    {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    }
  );

  const onSubmit = (data: CreateTimeEntryDto) => {
    const validation = validateTimeEntry(
      new Date(data.entryDate),
      data.startTime,
      data.endTime,
      new Date(timesheet.startDate),
      new Date(timesheet.endDate)
    );

    if (!validation.isValid) {
      setError('entryDate', { message: validation.error });
      return;
    }
    data.hoursWorked = Number(data.hoursWorked);
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create time entry. Please try again. {JSON.stringify(createMutation.error)}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('projectId', { required: 'Project is required' })}
            select
            label="Project"
            fullWidth
            error={!!errors.projectId}
            helperText={errors.projectId?.message}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('entryDate', { required: 'Date is required' })}
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}          
            error={!!errors.entryDate}
            helperText={errors.entryDate?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('startTime', { required: 'Start time is required' })}
            label="Start Time"
            type="time"
            fullWidth
            defaultValue="09:00"
            InputLabelProps={{ shrink: true }}
            error={!!errors.startTime}
            helperText={errors.startTime?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('endTime', { required: 'End time is required' })}
            label="End Time"
            type="time"
            fullWidth
            defaultValue="17:00"
            InputLabelProps={{ shrink: true }}
            error={!!errors.endTime}
            helperText={errors.endTime?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('hoursWorked', {
              required: 'Hours worked is required',
              min: { value: 0, message: 'Hours must be positive' },
              max: { value: 24, message: 'Hours cannot exceed 24' },
            })}
            label="Hours Worked"
            type="number"
            fullWidth
            inputProps={{ step: 0.5, min: 0, max: 24 }}
            error={!!errors.hoursWorked}
            helperText={errors.hoursWorked?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('notes')}
            label="Notes"
            multiline
            rows={2}
            fullWidth
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? 'Adding...' : 'Add Time Entry'}
        </Button>
      </Box>
    </form>
  );
}