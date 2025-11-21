import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { createTimesheet, createTimeEntry, submitTimesheet, fetchMyTimesheets } from '../../services/timesheetService';
import { fetchProjects } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';
import { CreateTimeEntryDto, Timesheet } from '../../types/timesheet';
import { startOfWeek, addDays, format, eachDayOfInterval } from 'date-fns';

interface WeeklyTimeEntry {
  projectId: string;
  projectName?: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  notes: string;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
];

export default function WeeklyTimesheet() {
  const router = useRouter();
  const { user } = useAuth();
  const employeeData = user?.employeeData;
  
  const [isSaving, setIsSaving] = useState(false);
  const [existingTimesheet, setExistingTimesheet] = useState<Timesheet | null>(null);
  
  // Calculate current week
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    return format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });

  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyTimeEntry[]>([
    {
      projectId: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      notes: '',
    },
  ]);

  // Fetch available projects
  const { data: projects = [] } = useQuery('projects', fetchProjects);
  
  // Fetch user's timesheets
  const { data: allTimesheets = [], refetch: refetchTimesheets, isLoading: isLoadingTimesheets } = useQuery(
    ['my-timesheets', employeeData?.id],
    () => fetchMyTimesheets(employeeData?.id),
    {
      enabled: !!employeeData?.id,
      onSuccess: (data) => {
        console.log('Fetched timesheets:', data);
      },
      onError: (error) => {
        console.error('Error fetching timesheets:', error);
      }
    }
  );
  
  // Get last 4 submitted timesheets for display
  const submittedTimesheets = React.useMemo(() => {
    return allTimesheets
      .filter(t => t.status === 'submitted' || t.status === 'approved')
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 4);
  }, [allTimesheets]);
  
  // Check for existing timesheet when week changes
  React.useEffect(() => {
    if (!allTimesheets || !selectedWeekStart) return;
    
    // Calculate end date for the selected week
    const [year, month, day] = selectedWeekStart.split('-').map(Number);
    const endDateObj = new Date(year, month - 1, day + 6);
    const endYear = endDateObj.getFullYear();
    const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDateObj.getDate()).padStart(2, '0');
    const endDate = `${endYear}-${endMonth}-${endDay}`;
    
    // Find timesheet for this week
    const found = allTimesheets.find(
      (ts) => ts.startDate === selectedWeekStart && ts.endDate === endDate
    );
    
    setExistingTimesheet(found || null);
    
    // If found, populate the form with existing data
    if (found && found.timeEntries && found.timeEntries.length > 0) {
      // Group entries by project
      const projectMap = new Map<number, WeeklyTimeEntry>();
      
      found.timeEntries.forEach((entry) => {
        if (!projectMap.has(entry.projectId)) {
          projectMap.set(entry.projectId, {
            projectId: String(entry.projectId),
            projectName: entry.project?.name,
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            notes: '',
          });
        }
        
        const projectEntry = projectMap.get(entry.projectId)!;
        
        // Parse entry date to determine day of week
        const [entryYear, entryMonth, entryDay] = entry.entryDate.split('-').map(Number);
        const entryDate = new Date(entryYear, entryMonth - 1, entryDay);
        const dayOfWeek = entryDate.getDay();
        
        // Map day of week to field name
        const dayMap: { [key: number]: keyof WeeklyTimeEntry } = {
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
        };
        
        const dayField = dayMap[dayOfWeek];
        if (dayField) {
          // Sum hours if multiple entries for same day
          const currentHours = parseFloat(projectEntry[dayField] as string) || 0;
          projectEntry[dayField] = String(currentHours + entry.hoursWorked);
          
          // Use the first note found
          if (!projectEntry.notes && entry.notes) {
            projectEntry.notes = entry.notes;
          }
        }
      });
      
      setWeeklyEntries(Array.from(projectMap.values()));
    } else if (!found) {
      // Reset to empty form if no timesheet found
      setWeeklyEntries([{
        projectId: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        notes: '',
      }]);
    }
  }, [allTimesheets, selectedWeekStart]);

  const handleAddRow = () => {
    setWeeklyEntries([
      ...weeklyEntries,
      {
        projectId: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        notes: '',
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (weeklyEntries.length > 1) {
      setWeeklyEntries(weeklyEntries.filter((_, i) => i !== index));
    }
  };

  const handleEntryChange = (
    index: number,
    field: keyof WeeklyTimeEntry,
    value: string
  ) => {
    const newEntries = [...weeklyEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    // Update project name when project is selected
    if (field === 'projectId') {
      const project = projects.find((p) => String(p.id) === value);
      if (project) {
        newEntries[index].projectName = project.name;
      }
    }
    
    setWeeklyEntries(newEntries);
  };

  const handleSubmit = async () => {
    if (!employeeData?.id) {
      alert('Employee data not found. Please log in again.');
      return;
    }

    // Validate that at least one entry has hours
    const hasValidEntries = weeklyEntries.some(
      (entry) =>
        entry.projectId &&
        (entry.monday || entry.tuesday || entry.wednesday || entry.thursday || entry.friday)
    );

    if (!hasValidEntries) {
      alert('Please add at least one project with hours for the week.');
      return;
    }

    // Convert weekly entries to individual time entries
    const timeEntries = weeklyEntries.flatMap((entry) => {
      const entries: CreateTimeEntryDto[] = [];
      
      // Parse the start date
      format(new Date(selectedWeekStart), 'MMM d, yyyy')
      const [year, month, day] = selectedWeekStart.split('-').map(Number);
    
      DAYS_OF_WEEK.forEach((dayOfWeek, dayIndex) => {
        const hours = parseFloat(entry[dayOfWeek.key as keyof WeeklyTimeEntry] as string);
        
        if (hours && hours > 0) {
          // Calculate the entry date by adding dayIndex days
          const date = new Date(year, month - 1, day + dayIndex);
          const entryYear = date.getFullYear();
          const entryMonth = date.getMonth() + 1;
          const entryDay = date.getDate();
          const entryDate = `${entryYear}-${entryMonth}-${entryDay}`;
          
          entries.push({
            projectId: parseInt(entry.projectId, 10),
            entryDate: entryDate,
            startTime: '09:00',
            endTime: hours === 8 ? '17:00' : format(new Date(`2000-01-01 ${9 + hours}:00`), 'HH:mm'),
            hoursWorked: hours,
            notes: entry.notes || '',
          });
        }
      });

      return entries;
    });

    if (timeEntries.length === 0) {
      alert('Please enter hours for at least one day.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Calculate end date (6 days after start = Sunday)
      const [year, month, day] = selectedWeekStart.split('-').map(Number);
      const endDateObj = new Date(year, month - 1, day + 5);
      const endYear = endDateObj.getFullYear();
      const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDateObj.getDate()).padStart(2, '0');
      const endDate = `${endYear}-${endMonth}-${endDay}`;
      
      // Step 1: Create the timesheet with date range (Mon-Sun = 6 days)
      const timesheetData = {
        employeeId: employeeData.id,
        startDate: selectedWeekStart,
        endDate: endDate, // 6 days from Monday = Sunday
      };

      const createdTimesheet = await createTimesheet(timesheetData);
      
      // Step 2: Add all time entries to the created timesheet
      const entryPromises = timeEntries.map((entry) =>
        createTimeEntry(createdTimesheet.id, entry)
      );
      
      await Promise.all(entryPromises);
      
      // Step 3: Submit the timesheet
      await submitTimesheet(createdTimesheet.id);
      
      // Success - navigate to timesheets list
      router.push('/timesheets');
    } catch (error) {
      console.error('Error creating weekly timesheet:', error);
      alert('Failed to create timesheet. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateRowTotal = (entry: WeeklyTimeEntry) => {
    const total = DAYS_OF_WEEK.reduce((sum, day) => {
      const hours = parseFloat(entry[day.key as keyof WeeklyTimeEntry] as string) || 0;
      return sum + hours;
    }, 0);
    return total.toFixed(1);
  };

  const calculateDayTotal = (dayKey: string) => {
    const total = weeklyEntries.reduce((sum, entry) => {
      const hours = parseFloat(entry[dayKey as keyof WeeklyTimeEntry] as string) || 0;
      return sum + hours;
    }, 0);
    return total.toFixed(1);
  };

  const calculateWeekTotal = () => {
    const total = weeklyEntries.reduce((sum, entry) => {
      return sum + parseFloat(calculateRowTotal(entry));
    }, 0);
    return total.toFixed(1);
  };
  
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
  
  const renderSubmittedTimesheetGrid = (timesheet: Timesheet) => {
    const [startYear, startMonth, startDay] = timesheet.startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = timesheet.endDate.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
      .filter(day => day.getDay() >= 1 && day.getDay() <= 5);

    const projectMap = new Map<number, { projectName: string; entries: Map<string, number> }>();
    
    timesheet.timeEntries?.forEach(entry => {
      if (!projectMap.has(entry.projectId)) {
        // Try to get project name from multiple sources
        let projectName = entry.project?.name;
        
        // If not in entry.project, look it up from the projects list
        if (!projectName && projects) {
          const foundProject = projects.find(p => p.id === entry.projectId);
          projectName = foundProject?.name;
        }
        
        // Final fallback
        projectName = projectName || `Project ${entry.projectId}`;
        
        projectMap.set(entry.projectId, {
          projectName: projectName,
          entries: new Map()
        });
      }
      const project = projectMap.get(entry.projectId)!;
      const existing = project.entries.get(entry.entryDate) || 0;
      project.entries.set(entry.entryDate, existing + entry.hoursWorked);
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
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Submitted: {timesheet.submissionDate 
                ? format(new Date(timesheet.submissionDate), 'MMM d, yyyy')
                : 'N/A'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Weekly Timesheet Entry
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/timesheets')}
              >
                Back to Timesheets
              </Button>
            </Box>

            {/* Display last 4 submitted timesheets */}
            {submittedTimesheets.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                  Recently Submitted Timesheets
                </Typography>
                {submittedTimesheets.map(timesheet => (
                  <Box key={timesheet.id}>
                    {renderSubmittedTimesheetGrid(timesheet)}
                  </Box>
                ))}
                <Divider sx={{ my: 4 }} />
              </Box>
            )}
            
            {isLoadingTimesheets && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Loading timesheets...
              </Alert>
            )}
            
            {!isLoadingTimesheets && allTimesheets.length === 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                No existing timesheets found. You can create your first timesheet below.
              </Alert>
            )}

            {existingTimesheet && (
              <Alert 
                severity={existingTimesheet.status === 'draft' ? 'info' : 'warning'} 
                sx={{ mb: 3 }}
              >
                <Typography variant="body2">
                  <strong>
                    {existingTimesheet.status === 'draft' 
                      ? 'Draft Timesheet Found:' 
                      : `${existingTimesheet.status.charAt(0).toUpperCase() + existingTimesheet.status.slice(1)} Timesheet Found:`}
                  </strong>
                  {' '}A timesheet for this week (starting {selectedWeekStart}) already exists with status: <strong>{existingTimesheet.status.toUpperCase()}</strong>.
                  {existingTimesheet.status !== 'draft' && (
                    <> You cannot submit a new timesheet for a week that already has a submitted or approved timesheet.</>
                  )}
                  {existingTimesheet.status === 'draft' && (
                    <> The form below shows your saved data. You can modify and submit it.</>
                  )}
                </Typography>
              </Alert>
            )}

            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Week Starting"
                    type="date"
                    value={selectedWeekStart}
                    onChange={(e) => setSelectedWeekStart(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ maxWidth: 300 }}
                  />
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" sx={{ minWidth: 1000 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Project</TableCell>
                        {DAYS_OF_WEEK.map((day) => {
                          // Calculate date for display
                          const [year, month, dayNum] = selectedWeekStart.split('-').map(Number);
                          const displayDate = new Date(year, month - 1, dayNum + DAYS_OF_WEEK.indexOf(day));
                          
                          return (
                            <TableCell key={day.key} align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>
                              {day.label}
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {format(displayDate, 'MMM dd')}
                              </Typography>
                            </TableCell>
                          );
                        })}
                        <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>
                          Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Notes</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: 60 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weeklyEntries.map((entry, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <TextField
                              select
                              value={entry.projectId}
                              onChange={(e) => handleEntryChange(index, 'projectId', e.target.value)}
                              size="small"
                              fullWidth
                              required
                              disabled={existingTimesheet?.status !== 'draft' && !!existingTimesheet}
                            >
                              <MenuItem value="">
                                <em>Select Project</em>
                              </MenuItem>
                              {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                  {project.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          {DAYS_OF_WEEK.map((day) => (
                            <TableCell key={day.key} align="center">
                              <TextField
                                type="number"
                                value={entry[day.key as keyof WeeklyTimeEntry]}
                                onChange={(e) => handleEntryChange(index, day.key as keyof WeeklyTimeEntry, e.target.value)}
                                size="small"
                                disabled={existingTimesheet?.status !== 'draft' && !!existingTimesheet}
                                inputProps={{
                                  min: 0,
                                  max: 24,
                                  step: 0.5,
                                  style: { textAlign: 'center' },
                                }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {calculateRowTotal(entry)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={entry.notes}
                              onChange={(e) => handleEntryChange(index, 'notes', e.target.value)}
                              size="small"
                              fullWidth
                              multiline
                              rows={1}
                              disabled={existingTimesheet?.status !== 'draft' && !!existingTimesheet}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Remove row">
                              <span>
                                <IconButton
                                  onClick={() => handleRemoveRow(index)}
                                  disabled={weeklyEntries.length === 1 || (existingTimesheet?.status !== 'draft' && !!existingTimesheet)}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Totals Row */}
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Daily Totals</TableCell>
                        {DAYS_OF_WEEK.map((day) => (
                          <TableCell key={day.key} align="center" sx={{ fontWeight: 'bold' }}>
                            {calculateDayTotal(day.key)}
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {calculateWeekTotal()}
                        </TableCell>
                        <TableCell colSpan={2} />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddRow}
                    disabled={existingTimesheet?.status !== 'draft' && !!existingTimesheet}
                  >
                    Add Project
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={isSaving || (existingTimesheet?.status !== 'draft' && !!existingTimesheet)}
                  >
                    {isSaving ? 'Submitting...' : 'Submit Weekly Timesheet'}
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Quick Entry Tips:</strong>
                  </Typography>
                  <Box component="ul" sx={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Enter hours worked for each day (e.g., 8, 4.5, 6)</li>
                    <li>Add multiple rows to track different projects throughout the week</li>
                    <li>Daily and weekly totals are calculated automatically</li>
                    <li>Leave cells empty for days you didn't work on that project</li>
                  </Box>
                </Alert>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}
