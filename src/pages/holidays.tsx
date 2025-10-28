import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useQuery } from 'react-query';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchActiveHolidayCalendars, fetchHolidays } from '@/services/holidayService';
import { Holiday, HolidayCalendar } from '@/types/holiday';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

// Check if we're using mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export default function HolidaysPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | 'all'>('all');
  const [showOptionalHolidays, setShowOptionalHolidays] = useState(true);

  const { data: calendars, isLoading: isLoadingCalendars } = useQuery(
    'holiday-calendars',
    fetchActiveHolidayCalendars
  );

  const { data: holidays, isLoading: isLoadingHolidays } = useQuery(
    ['holidays', selectedCalendarId, selectedYear],
    () => fetchHolidays(
      selectedCalendarId === 'all' ? undefined : selectedCalendarId as number,
      selectedYear
    )
  );

  const handleBackToHome = () => {
    router.push('/');
  };

  const getHolidayIcon = (type: Holiday['type']) => {
    switch (type) {
      case 'public':
        return <PublicIcon />;
      case 'company':
        return <BusinessIcon />;
      case 'client':
        return <BusinessIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getHolidayStatusColor = (date: string) => {
    const holidayDate = new Date(date);
    if (isToday(holidayDate)) return 'primary';
    if (isFuture(holidayDate)) return 'success';
    if (isPast(holidayDate)) return 'default';
    return 'default';
  };

  const getHolidayStatusText = (date: string) => {
    const holidayDate = new Date(date);
    if (isToday(holidayDate)) return 'Today';
    if (isFuture(holidayDate)) return 'Upcoming';
    if (isPast(holidayDate)) return 'Past';
    return '';
  };

  const filteredHolidays = React.useMemo(() => {
    if (!holidays) return [];
    
    let filtered = holidays;
    
    // Filter by calendar if specific calendar is selected
    if (selectedCalendarId !== 'all') {
      filtered = filtered.filter(holiday => holiday.calendar_id === selectedCalendarId);
    }
    
    // Filter optional holidays if not showing them
    if (!showOptionalHolidays) {
      filtered = filtered.filter(holiday => !holiday.is_optional);
    }
    
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [holidays, selectedCalendarId, showOptionalHolidays]);

  const upcomingHolidays = React.useMemo(() => {
    return filteredHolidays
      .filter(holiday => isFuture(new Date(holiday.date)) || isToday(new Date(holiday.date)))
      .slice(0, 5);
  }, [filteredHolidays]);

  const isLoading = isLoadingCalendars || isLoadingHolidays;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress size={60} />
            </Box>
          </Container>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleBackToHome}
                size="small"
              >
                Back to Home
              </Button>
              <Typography variant="h4" component="h1">
                Holiday Calendar {selectedYear}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="primary" />
              <Typography variant="body1" color="primary" fontWeight="bold">
                {format(new Date(), 'MMMM d, yyyy')}
              </Typography>
            </Box>
          </Box>

          {/* Mock Data Info Banner */}
          {useMockData && (
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ mb: 3 }}
            >
              <strong>Development Mode:</strong> Displaying mock holiday data with {filteredHolidays.length} holidays 
              across {calendars?.length || 0} calendars. In production, this would connect to the real API.
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Filters and Controls */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <FilterListIcon color="action" />
                  <Typography variant="h6">Filters & Options</Typography>
                </Box>
                
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Calendar Year</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Calendar Year"
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                      >
                        <MenuItem value={2024}>2024</MenuItem>
                        <MenuItem value={2025}>2025</MenuItem>
                        <MenuItem value={2026}>2026</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Holiday Calendar</InputLabel>
                      <Select
                        value={selectedCalendarId}
                        label="Holiday Calendar"
                        onChange={(e) => setSelectedCalendarId(e.target.value as number | 'all')}
                      >
                        <MenuItem value="all">All Calendars</MenuItem>
                        {calendars?.map((calendar) => (
                          <MenuItem key={calendar.id} value={calendar.id}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: calendar.color
                                }}
                              />
                              {calendar.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showOptionalHolidays}
                          onChange={(e) => setShowOptionalHolidays(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Show Optional Holidays"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Total Holidays: 
                      </Typography>
                      <Chip 
                        label={filteredHolidays.length} 
                        color="primary" 
                        size="small" 
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Upcoming Holidays Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Holidays
                  </Typography>
                  <List dense>
                    {upcomingHolidays.length > 0 ? (
                      upcomingHolidays.map((holiday) => (
                        <React.Fragment key={holiday.id}>
                          <ListItem>
                            <ListItemIcon>
                              {getHolidayIcon(holiday.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={holiday.name}
                              secondary={
                                <Box>
                                  <Typography variant="caption" display="block">
                                    {format(new Date(holiday.date), 'EEEE, MMMM d, yyyy')}
                                  </Typography>
                                  <Box display="flex" gap={1} mt={0.5}>
                                    <Chip
                                      label={getHolidayStatusText(holiday.date)}
                                      color={getHolidayStatusColor(holiday.date) as any}
                                      size="small"
                                    />
                                    {holiday.is_optional && (
                                      <Chip
                                        label="Optional"
                                        variant="outlined"
                                        size="small"
                                      />
                                    )}
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                          {upcomingHolidays.indexOf(holiday) < upcomingHolidays.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary="No upcoming holidays"
                          secondary="All holidays for this year have passed"
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* All Holidays List */}
            <Grid item xs={12} md={8}>
              <Paper>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    All Holidays ({filteredHolidays.length})
                  </Typography>
                </Box>
                
                <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                  <List>
                    {filteredHolidays.length > 0 ? (
                      filteredHolidays.map((holiday, index) => (
                        <React.Fragment key={holiday.id}>
                          <ListItem>
                            <ListItemIcon>
                              {getHolidayIcon(holiday.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {holiday.name}
                                  </Typography>
                                  {holiday.is_optional && (
                                    <Chip
                                      label="Optional"
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {format(new Date(holiday.date), 'EEEE, MMMM d, yyyy')}
                                  </Typography>
                                  {holiday.description && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {holiday.description}
                                    </Typography>
                                  )}
                                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: holiday.calendar?.color || '#gray'
                                      }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {holiday.calendar?.name}
                                    </Typography>
                                    <Chip
                                      label={getHolidayStatusText(holiday.date)}
                                      color={getHolidayStatusColor(holiday.date) as any}
                                      size="small"
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < filteredHolidays.length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary="No holidays found"
                          secondary="Try adjusting your filters to see more holidays"
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Paper>
            </Grid>

            {/* Holiday Calendar Legend */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Holiday Calendars
                </Typography>
                <Grid container spacing={2}>
                  {calendars?.map((calendar) => (
                    <Grid item xs={12} sm={6} md={4} key={calendar.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: calendar.color
                              }}
                            />
                            <Typography variant="subtitle1" fontWeight="medium">
                              {calendar.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {calendar.description}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={calendar.type === 'ati' ? 'Company' : 'Client'}
                              color={calendar.type === 'ati' ? 'primary' : 'secondary'}
                              size="small"
                            />
                            {calendar.client_name && (
                              <Chip
                                label={calendar.client_name}
                                variant="outlined"
                                size="small"
                              />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {calendar.holidays?.length || 0} holidays
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
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