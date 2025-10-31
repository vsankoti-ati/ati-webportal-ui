import React, { useState } from 'react';
import { Box, Container, Paper, Typography, ButtonGroup, Button } from '@mui/material';
import WeeklySummary from '@/components/timesheets/WeeklySummary';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export default function TimesheetSummaryPage() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Start week on Monday
  );

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const handleCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              Weekly Summary
            </Typography>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <ButtonGroup variant="contained" color="primary">
                <Button onClick={handlePreviousWeek}>Previous Week</Button>
                <Button onClick={handleCurrentWeek}>Current Week</Button>
                <Button onClick={handleNextWeek}>Next Week</Button>
              </ButtonGroup>
            </Box>

            <WeeklySummary startDate={currentWeekStart} endDate={weekEnd} />
          </Container>
        </Box>
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