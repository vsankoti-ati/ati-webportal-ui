import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { JobOpening } from '@/types/jobOpening';
import { useMutation, useQueryClient } from 'react-query';
import { createJobReferral } from '@/services/jobReferralService';

interface ReferCandidateDialogProps {
  open: boolean;
  onClose: () => void;
  jobOpening: JobOpening;
}

interface ReferralFormData {
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  relationship: string;
  resume_url: string;
  notes: string;
}

export default function ReferCandidateDialog({
  open,
  onClose,
  jobOpening,
}: ReferCandidateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>();

  const queryClient = useQueryClient();

  const createReferral = useMutation(createJobReferral, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobReferrals']);
      reset();
      onClose();
    },
  });

  const onSubmit = (data: ReferralFormData) => {
    createReferral.mutate({
      ...data,
      job_opening_id: jobOpening.id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Refer a Candidate</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Job Position
            </Typography>
            <Typography variant="body1">{jobOpening.title}</Typography>
          </Box>

          <TextField
            {...register('candidate_name', { required: 'Name is required' })}
            label="Candidate Name"
            fullWidth
            margin="normal"
            error={!!errors.candidate_name}
            helperText={errors.candidate_name?.message}
          />

          <TextField
            {...register('candidate_email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            label="Candidate Email"
            fullWidth
            margin="normal"
            error={!!errors.candidate_email}
            helperText={errors.candidate_email?.message}
          />

          <TextField
            {...register('candidate_phone', { required: 'Phone number is required' })}
            label="Candidate Phone"
            fullWidth
            margin="normal"
            error={!!errors.candidate_phone}
            helperText={errors.candidate_phone?.message}
          />

          <TextField
            {...register('relationship', { required: 'Relationship is required' })}
            label="Your Relationship with Candidate"
            fullWidth
            margin="normal"
            error={!!errors.relationship}
            helperText={errors.relationship?.message}
          />

          <TextField
            {...register('resume_url', { required: 'Resume URL is required' })}
            label="Resume URL"
            fullWidth
            margin="normal"
            error={!!errors.resume_url}
            helperText={errors.resume_url?.message}
          />

          <TextField
            {...register('notes')}
            label="Additional Notes"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createReferral.isLoading}
          >
            {createReferral.isLoading ? 'Submitting...' : 'Submit Referral'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}