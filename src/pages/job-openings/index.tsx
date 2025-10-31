import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { useQuery } from 'react-query';
import { fetchJobOpenings } from '@/services/jobOpeningService';
import { useRouter } from 'next/router';
import { JobOpening } from '@/types/jobOpening';
import JobOpeningCard from '@/components/job-openings/JobOpeningCard';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

// Check if we're using mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export default function JobOpeningsList() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: jobOpenings, isLoading } = useQuery('jobOpenings', fetchJobOpenings);

  const handleAddNew = () => {
    router.push('/job-openings/new');
  };

  const handleViewDetails = (id: number) => {
    router.push(`/job-openings/${id}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Skeleton variant="text" width="200px" height="40px" />
              <Skeleton variant="rectangular" width="150px" height="36px" />
            </Box>
            <Grid container spacing={3}>
              {Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="80%" height="32px" />
                      <Skeleton variant="text" width="60%" height="20px" />
                      <Skeleton variant="text" width="100%" height="16px" />
                      <Skeleton variant="text" width="100%" height="16px" />
                      <Skeleton variant="text" width="70%" height="16px" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
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
              Job Openings
            </Typography>
            {(user?.roles.includes('Admin') || user?.roles.includes('HR')) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
              >
                Add New Position
              </Button>
            )}
          </Box>

      {/* Mock Data Info Banner */}
      {useMockData && (
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ mb: 3 }}
        >
          <strong>Development Mode:</strong> Displaying mock job opening data with {jobOpenings?.length || 0} positions. 
          In production, this would connect to the real API.
        </Alert>
      )}

      <Grid container spacing={3}>
        {jobOpenings && jobOpenings.length > 0 ? (
          jobOpenings.map((job: JobOpening) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobOpeningCard job={job} onView={() => handleViewDetails(job.id)} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="200px"
            >
              <Typography variant="h6" color="text.secondary">
                No job openings available at this time
              </Typography>
            </Box>
          </Grid>
        )}
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