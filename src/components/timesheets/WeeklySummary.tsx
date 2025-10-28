import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useQuery } from 'react-query';
import { fetchMyTimesheets } from '@/services/timesheetService';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isSameDay,
} from 'date-fns';

interface WeeklySummaryProps {
  startDate: Date;
  endDate: Date;
}

interface DailySummary {
  date: Date;
  totalHours: number;
  entries: Array<{
    project: string;
    hours: number;
  }>;
}

export default function WeeklySummary({ startDate, endDate }: WeeklySummaryProps) {
  const { data: timesheets } = useQuery('my-timesheets', fetchMyTimesheets);

  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Create daily summaries
  const dailySummaries: DailySummary[] = weekDays.map(date => {
    const summary: DailySummary = {
      date,
      totalHours: 0,
      entries: [],
    };

    timesheets?.forEach(timesheet => {
      timesheet.time_entries?.forEach(entry => {
        const entryDate = parseISO(entry.entry_date);
        if (isSameDay(date, entryDate)) {
          summary.totalHours += entry.hours_worked;
          
          // Add or update project entry
          const existingEntry = summary.entries.find(e => e.project === entry.project?.name);
          if (existingEntry) {
            existingEntry.hours += entry.hours_worked;
          } else {
            summary.entries.push({
              project: entry.project?.name || 'Unknown Project',
              hours: entry.hours_worked,
            });
          }
        }
      });
    });

    return summary;
  });

  const totalWeeklyHours = dailySummaries.reduce((sum, day) => sum + day.totalHours, 0);

  // Get unique projects across all entries
  const uniqueProjects = new Set<string>();
  dailySummaries.forEach(day => {
    day.entries.forEach(entry => uniqueProjects.add(entry.project));
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Weekly Summary ({format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')})
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Total Hours: {totalWeeklyHours}
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project / Date</TableCell>
                {weekDays.map(day => (
                  <TableCell key={day.toISOString()} align="center">
                    {format(day, 'EEE MM/dd')}
                  </TableCell>
                ))}
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(uniqueProjects).map(project => {
                const projectDailyHours = weekDays.map(date => {
                  const daySummary = dailySummaries.find(d => isSameDay(d.date, date));
                  const projectEntry = daySummary?.entries.find(e => e.project === project);
                  return projectEntry?.hours || 0;
                });

                const projectTotalHours = projectDailyHours.reduce((sum, hours) => sum + hours, 0);

                return (
                  <TableRow key={project}>
                    <TableCell>{project}</TableCell>
                    {projectDailyHours.map((hours, index) => (
                      <TableCell key={index} align="center">
                        {hours > 0 ? hours : '-'}
                      </TableCell>
                    ))}
                    <TableCell align="center">{projectTotalHours}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow sx={{ '& > td': { fontWeight: 'bold' } }}>
                <TableCell>Daily Total</TableCell>
                {dailySummaries.map((day, index) => (
                  <TableCell key={index} align="center">
                    {day.totalHours > 0 ? day.totalHours : '-'}
                  </TableCell>
                ))}
                <TableCell align="center">{totalWeeklyHours}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}