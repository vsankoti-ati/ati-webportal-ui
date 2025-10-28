import { api } from '@/lib/api';
import { 
  Timesheet, 
  TimeEntry,
  CreateTimesheetDto, 
  CreateTimeEntryDto,
  CreateApprovalDto 
} from '@/types/timesheet';
import { startOfWeek, endOfWeek, subWeeks, format, addDays } from 'date-fns';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

/**
 * Mock Timesheet Data Generator
 * 
 * Generates realistic timesheet data for the past 4 weeks including:
 * - Week 1 (Current): Draft status with partial entries
 * - Week 2: Submitted status waiting for approval
 * - Week 3-4: Approved timesheets with complete entries
 * 
 * Each timesheet contains:
 * - Monday-Friday work entries (7 hours/day standard)
 * - Overtime entries on Tuesday/Thursday (2 hours each)
 * - Different projects rotated throughout the week
 * - Realistic notes and time tracking
 */

// Mock Projects Data
const mockProjects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Building a modern e-commerce platform',
    start_date: '2025-09-01',
    end_date: '2025-12-31',
    status: 'active' as const,
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'React Native mobile application',
    start_date: '2025-08-15',
    end_date: '2025-11-30',
    status: 'active' as const,
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-08-15T00:00:00Z'
  },
  {
    id: 3,
    name: 'Database Migration',
    description: 'Migrating legacy database to cloud',
    start_date: '2025-10-01',
    end_date: '2025-12-15',
    status: 'active' as const,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'API Integration',
    description: 'Third-party API integration project',
    start_date: '2025-09-15',
    end_date: '2025-10-30',
    status: 'active' as const,
    created_at: '2025-09-15T00:00:00Z',
    updated_at: '2025-09-15T00:00:00Z'
  }
];

// Generate mock timesheets for the past 4 weeks
const generateMockTimesheets = (): Timesheet[] => {
  const timesheets: Timesheet[] = [];
  const currentDate = new Date();
  
  // Generate timesheets for the past 4 weeks
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    const weekStartDate = startOfWeek(subWeeks(currentDate, weekOffset), { weekStartsOn: 1 }); // Monday
    const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 }); // Sunday
    
    const timesheetId = 100 + weekOffset;
    const status = weekOffset === 0 ? 'draft' : weekOffset === 1 ? 'submitted' : 'approved';
    
    // Generate time entries for this week
    const timeEntries: TimeEntry[] = [];
    let entryId = timesheetId * 10;
    
    // Monday to Friday entries
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const entryDate = addDays(weekStartDate, dayOffset);
      const projectId = mockProjects[dayOffset % mockProjects.length].id;
      
      // Morning session
      timeEntries.push({
        id: entryId++,
        timesheet_id: timesheetId,
        project_id: projectId,
        project: mockProjects.find(p => p.id === projectId),
        entry_date: format(entryDate, 'yyyy-MM-dd'),
        start_time: '09:00',
        end_time: '12:00',
        hours_worked: 3,
        notes: `Morning work on ${mockProjects.find(p => p.id === projectId)?.name}`,
        created_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      });
      
      // Afternoon session
      timeEntries.push({
        id: entryId++,
        timesheet_id: timesheetId,
        project_id: projectId,
        project: mockProjects.find(p => p.id === projectId),
        entry_date: format(entryDate, 'yyyy-MM-dd'),
        start_time: '13:00',
        end_time: '17:00',
        hours_worked: 4,
        notes: `Afternoon work on ${mockProjects.find(p => p.id === projectId)?.name}`,
        created_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updated_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      });
      
      // Some days have overtime
      if (dayOffset === 1 || dayOffset === 3) { // Tuesday and Thursday
        timeEntries.push({
          id: entryId++,
          timesheet_id: timesheetId,
          project_id: projectId,
          project: mockProjects.find(p => p.id === projectId),
          entry_date: format(entryDate, 'yyyy-MM-dd'),
          start_time: '18:00',
          end_time: '20:00',
          hours_worked: 2,
          notes: `Overtime work on ${mockProjects.find(p => p.id === projectId)?.name}`,
          created_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          updated_at: format(entryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        });
      }
    }
    
    const timesheet: Timesheet = {
      id: timesheetId,
      employee_id: 101,
      start_date: format(weekStartDate, 'yyyy-MM-dd'),
      end_date: format(weekEndDate, 'yyyy-MM-dd'),
      status: status as 'draft' | 'submitted' | 'approved',
      submission_date: status !== 'draft' ? format(weekEndDate, 'yyyy-MM-dd') : undefined,
      approval_date: status === 'approved' ? format(addDays(weekEndDate, 1), 'yyyy-MM-dd') : undefined,
      approved_by_employee_id: status === 'approved' ? 1 : undefined,
      created_at: format(weekStartDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(weekEndDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      time_entries: timeEntries
    };
    
    timesheets.push(timesheet);
  }
  
  return timesheets.reverse(); // Most recent first
};

const mockTimesheets = generateMockTimesheets();

export const fetchMyTimesheets = async (): Promise<Timesheet[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockTimesheets;
  }
  
  const response = await api.get('/timesheets/my-timesheets');
  return response.data;
};

export const fetchTimesheet = async (id: number): Promise<Timesheet> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const timesheet = mockTimesheets.find(ts => ts.id === id);
    if (!timesheet) {
      throw new Error(`Timesheet with id ${id} not found`);
    }
    return timesheet;
  }
  
  const response = await api.get(`/timesheets/${id}`);
  return response.data;
};

export const createTimesheet = async (data: CreateTimesheetDto): Promise<Timesheet> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTimesheet: Timesheet = {
      id: Math.max(...mockTimesheets.map(ts => ts.id)) + 1,
      employee_id: 101,
      start_date: data.start_date,
      end_date: data.end_date,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      time_entries: []
    };
    
    mockTimesheets.unshift(newTimesheet);
    return newTimesheet;
  }
  
  const response = await api.post('/timesheets', data);
  return response.data;
};

export const submitTimesheet = async (id: number): Promise<Timesheet> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const timesheetIndex = mockTimesheets.findIndex(ts => ts.id === id);
    if (timesheetIndex === -1) {
      throw new Error(`Timesheet with id ${id} not found`);
    }
    
    mockTimesheets[timesheetIndex] = {
      ...mockTimesheets[timesheetIndex],
      status: 'submitted',
      submission_date: format(new Date(), 'yyyy-MM-dd'),
      updated_at: new Date().toISOString()
    };
    
    return mockTimesheets[timesheetIndex];
  }
  
  const response = await api.patch(`/timesheets/${id}`, { status: 'submitted' });
  return response.data;
};

export const fetchTimeEntries = async (timesheetId: number): Promise<TimeEntry[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const timesheet = mockTimesheets.find(ts => ts.id === timesheetId);
    return timesheet?.time_entries || [];
  }
  
  const response = await api.get(`/time-entries/timesheet/${timesheetId}`);
  return response.data;
};

export const createTimeEntry = async (timesheetId: number, data: CreateTimeEntryDto): Promise<TimeEntry> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timesheet = mockTimesheets.find(ts => ts.id === timesheetId);
    if (!timesheet) {
      throw new Error(`Timesheet with id ${timesheetId} not found`);
    }
    
    const newTimeEntry: TimeEntry = {
      id: Math.floor(Math.random() * 10000) + 1000,
      timesheet_id: timesheetId,
      project_id: data.project_id,
      project: mockProjects.find(p => p.id === data.project_id),
      entry_date: data.entry_date,
      start_time: data.start_time,
      end_time: data.end_time,
      hours_worked: data.hours_worked,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (!timesheet.time_entries) {
      timesheet.time_entries = [];
    }
    timesheet.time_entries.push(newTimeEntry);
    
    return newTimeEntry;
  }
  
  const response = await api.post(`/time-entries/${timesheetId}`, data);
  return response.data;
};

export const updateTimeEntry = async (id: number, data: CreateTimeEntryDto): Promise<TimeEntry> => {
  const response = await api.patch(`/time-entries/${id}`, data);
  return response.data;
};

export const deleteTimeEntry = async (id: number): Promise<void> => {
  await api.delete(`/time-entries/${id}`);
};

export const fetchPendingApprovals = async (): Promise<Timesheet[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    // Return timesheets that are submitted but not yet approved
    return mockTimesheets.filter(ts => ts.status === 'submitted');
  }
  
  const response = await api.get('/timesheets/pending-approvals');
  return response.data;
};

export const approveTimesheet = async (id: number, comments?: string): Promise<void> => {
  await api.post(`/approvals/${id}`, {
    approval_status: 'approved',
    comments,
  } as CreateApprovalDto);
};

export const rejectTimesheet = async (id: number, comments?: string): Promise<void> => {
  await api.post(`/approvals/${id}`, {
    approval_status: 'rejected',
    comments,
  } as CreateApprovalDto);
};

export const deleteTimesheet = async (id: number): Promise<void> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timesheetIndex = mockTimesheets.findIndex(ts => ts.id === id);
    if (timesheetIndex === -1) {
      throw new Error(`Timesheet with id ${id} not found`);
    }
    
    mockTimesheets.splice(timesheetIndex, 1);
    return;
  }
  
  await api.delete(`/timesheets/${id}`);
};