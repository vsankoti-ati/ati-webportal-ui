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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useQuery } from 'react-query';
import { fetchMyTimesheets } from '@/services/timesheetService';
import { useEmployeeData } from '@/hooks/useEmployee';
import { Timesheet } from '@/types/timesheet';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
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
  const { employeeData } = useEmployeeData();
  
  const { data: timesheets, isLoading } = useQuery(
    ['my-timesheets', employeeData?.id], 
    () => fetchMyTimesheets(employeeData?.id),
    {
      enabled: !!employeeData?.id
    }
  );

  // Get last 4 submitted timesheets
  const submittedTimesheets = timesheets
    ?.filter(t => t.status === 'submitted' || t.status === 'approved')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 4) || [];

  const handleCreate = () => {
    router.push('/timesheets/new');
  };

  const handleView = (id: number) => {
    router.push(`/timesheets/${id}`);
  };

  const renderWeeklyTimesheetGrid = (timesheet: Timesheet) => {
    // Parse dates as local dates
    const [startYear, startMonth, startDay] = timesheet.startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = timesheet.endDate.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // Get all weekdays (Mon-Fri)
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
      .filter(day => day.getDay() >= 1 && day.getDay() <= 5); // Monday to Friday

    // Group entries by project
    const projectMap = new Map<number, { projectName: string; entries: Map<string, number> }>();
    
    timesheet.timeEntries?.forEach(entry => {
      if (!projectMap.has(entry.projectId)) {
        projectMap.set(entry.projectId, {
          projectName: entry.project?.name || `Project ${entry.projectId}`,
          entries: new Map()
        });
      }
      const project = projectMap.get(entry.projectId)!;
      project.entries.set(entry.entryDate, entry.hoursWorked);
    });

    const calculateDayTotal = (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      let total = 0;
      projectMap.forEach(project => {
        total += project.entries.get(dateStr) || 0;
      });
      return total;
    };

    const calculateProjectTotal = (projectEntries: Map<string, number>) => {
      let total = 0;
      projectEntries.forEach(hours => total += hours);
      return total;
    };

    const calculateGrandTotal = () => {
      let total = 0;
      projectMap.forEach(project => {
        total += calculateProjectTotal(project.entries);
      });
      return total;
    };

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Week: {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </Typography>
            <Chip
              label={timesheet.status.toUpperCase()}
              color={getStatusColor(timesheet.status)}
              size="small"
            />
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Project</TableCell>
                  {allDays.map(day => (
                    <TableCell key={day.toISOString()} align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>
                      {format(day, 'EEE')}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {format(day, 'MMM d')}
                      </Typography>
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80, bgcolor: 'primary.50' }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(projectMap.entries()).map(([projectId, project]) => (
                  <TableRow key={projectId} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{project.projectName}</TableCell>
                    {allDays.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const hours = project.entries.get(dateStr);
                      return (
                        <TableCell 
                          key={day.toISOString()} 
                          align="center"
                          sx={{ 
                            bgcolor: hours ? 'background.default' : 'grey.50',
                            color: hours ? 'text.primary' : 'text.disabled'
                          }}
                        >
                          {hours || '-'}
                        </TableCell>
                      );
                    })}
                    <TableCell 
                      align="center" 
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.50' }}
                    >
                      {calculateProjectTotal(project.entries)}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Daily Totals Row */}
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Daily Totals</TableCell>
                  {allDays.map(day => (
                    <TableCell 
                      key={day.toISOString()} 
                      align="center" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {calculateDayTotal(day)}
                    </TableCell>
                  ))}
                  <TableCell 
                    align="center" 
                    sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '1rem' }}
                  >
                    {calculateGrandTotal()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Submitted: {timesheet.submissionDate 
                ? (() => {
                    const submissionDate = new Date(timesheet.submissionDate);                    
                    return format(submissionDate, 'MMM d, yyyy');
                  })()
                : 'N/A'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleView(timesheet.id)}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
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
              const totalHours = timesheet.timeEntries?.reduce(
                (sum, entry) => sum + entry.hoursWorked,
                0
              ) || 0;

              return (
                <TableRow key={timesheet.id}>
                  <TableCell>
                    {(() => {
                      // Parse dates as local dates to avoid timezone shifts        
                      return `${timesheet.startDate} to ${timesheet.endDate}`;
                    })()}
                  </TableCell>
                  <TableCell>{totalHours}</TableCell>
                  <TableCell>
                    {timesheet.submissionDate
                      ? (() => {
                          return format(new Date(timesheet.submissionDate), 'MMM d, yyyy');
                        })()
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