import { isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns';

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTimesheetDates = (
  startDate: Date,
  endDate: Date
): DateValidationResult => {
  // Check if end date is before start date
  if (isBefore(endDate, startDate)) {
    return {
      isValid: false,
      error: 'End date must be after start date',
    };
  }

  // Check if dates are in the future
  const today = new Date();
  if (isAfter(startDate, today) || isAfter(endDate, today)) {
    return {
      isValid: false,
      error: 'Cannot create timesheets for future dates',
    };
  }

  // Check if dates are in the same week
  const weekStart = startOfWeek(startDate);
  const weekEnd = endOfWeek(startDate);
  
  if (!isBefore(endDate, weekEnd) || !isAfter(endDate, weekStart)) {
    return {
      isValid: false,
      error: 'Timesheet must be within the same week',
    };
  }

  return { isValid: true };
};

export const validateTimeEntry = (
  entryDate: Date,
  startTime: string,
  endTime: string,
  timesheetStartDate: Date,
  timesheetEndDate: Date
): DateValidationResult => {
  // Check if entry date is within timesheet period
  if (isBefore(entryDate, timesheetStartDate) || isAfter(entryDate, timesheetEndDate)) {
    return {
      isValid: false,
      error: 'Entry date must be within the timesheet period',
    };
  }

  // Check if entry date is in the future
  const today = new Date();
  if (isAfter(entryDate, today)) {
    return {
      isValid: false,
      error: 'Cannot add time entries for future dates',
    };
  }

  // Validate time range
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
    return {
      isValid: false,
      error: 'End time must be after start time',
    };
  }

  // Calculate hours worked
  const hoursWorked = (endHour - startHour) + (endMinute - startMinute) / 60;
  if (hoursWorked > 24) {
    return {
      isValid: false,
      error: 'Time entry cannot exceed 24 hours',
    };
  }

  return { isValid: true };
};