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
      new Date(data.entry_date),
      data.start_time,
      data.end_time,
      new Date(timesheet.start_date),
      new Date(timesheet.end_date)
    );

    if (!validation.isValid) {
      setError('entry_date', { message: validation.error });
      return;
    }

    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create time entry. Please try again.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('project_id', { required: 'Project is required' })}
            select
            label="Project"
            fullWidth
            error={!!errors.project_id}
            helperText={errors.project_id?.message}
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
            {...register('entry_date', { required: 'Date is required' })}
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.entry_date}
            helperText={errors.entry_date?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('start_time', { required: 'Start time is required' })}
            label="Start Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.start_time}
            helperText={errors.start_time?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('end_time', { required: 'End time is required' })}
            label="End Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.end_time}
            helperText={errors.end_time?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register('hours_worked', {
              required: 'Hours worked is required',
              min: { value: 0, message: 'Hours must be positive' },
              max: { value: 24, message: 'Hours cannot exceed 24' },
            })}
            label="Hours Worked"
            type="number"
            fullWidth
            inputProps={{ step: 0.5, min: 0, max: 24 }}
            error={!!errors.hours_worked}
            helperText={errors.hours_worked?.message}
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