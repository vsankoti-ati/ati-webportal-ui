import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { fetchJobOpening } from '@/services/jobOpeningService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/hooks/useAuth';
import ReferCandidateDialog from '@/components/job-openings/ReferCandidateDialog';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export default function JobOpeningDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [referDialogOpen, setReferDialogOpen] = React.useState(false);

  const { data: job, isLoading } = useQuery(
    ['jobOpening', id],
    () => fetchJobOpening(Number(id)),
    {
      enabled: !!id,
    }
  );

  const handleEdit = () => {
    router.push(`/job-openings/${id}/edit`);
  };

  const handleDelete = async () => {
    // Implement delete confirmation and logic
  };

  const handleRefer = () => {
    setReferDialogOpen(true);
  };

  if (isLoading || !job) {
    return (
      <ProtectedRoute>
        <Layout>
          <div>Loading...</div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const isAdminOrHR = user?.roles.includes('Admin') || user?.roles.includes('HR');

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              {job.title}
            </Typography>
            <Box display="flex" gap={2}>
              {isAdminOrHR && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button variant="contained" color="primary" onClick={handleRefer}>
                Refer a Candidate
              </Button>
            </Box>
          </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Responsibilities
            </Typography>
            <List>
              {job.responsibilities.map((resp, index) => (
                <ListItem key={index}>
                  <ListItemText primary={resp} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Required Qualifications
            </Typography>
            <List>
              {job.qualifications.map((qual, index) => (
                <ListItem key={index}>
                  <ListItemText primary={qual} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Required Skills
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {job.skills_required.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>
            <Box sx={{ '& > *': { mb: 2 } }}>
              <Box>
                <Typography color="text.secondary">Department</Typography>
                <Typography variant="body1">{job.department}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Location</Typography>
                <Typography variant="body1">{job.location}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Employment Type</Typography>
                <Typography variant="body1">{job.employment_type}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Experience Required</Typography>
                <Typography variant="body1">{job.experience_required}</Typography>
              </Box>
              {job.salary_range && (
                <Box>
                  <Typography color="text.secondary">Salary Range</Typography>
                  <Typography variant="body1">{job.salary_range}</Typography>
                </Box>
              )}
              <Box>
                <Typography color="text.secondary">Status</Typography>
                <Chip
                  label={job.is_active ? 'Active' : 'Closed'}
                  color={job.is_active ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ReferCandidateDialog
        open={referDialogOpen}
        onClose={() => setReferDialogOpen(false)}
        jobOpening={job}
      />
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