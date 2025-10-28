import { api } from '@/lib/api';
import { Holiday, HolidayCalendar, CreateHolidayDto, CreateHolidayCalendarDto } from '@/types/holiday';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

/**
 * Mock Holiday Calendar Data
 * 
 * Includes:
 * - ATI Company holiday calendar with 10 public holidays for 2025
 * - Client-specific holiday calendars for different clients
 * - Mix of public holidays, company holidays, and optional holidays
 */

// Mock Holiday Calendars
const mockHolidayCalendars: HolidayCalendar[] = [
  {
    id: 1,
    name: 'ATI Company Calendar',
    description: 'Official Adaptive Technology Insights holiday calendar',
    type: 'ati',
    is_active: true,
    color: '#1976d2', // Blue
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Microsoft Client Calendar',
    description: 'Holiday calendar for Microsoft project team',
    type: 'client',
    client_id: 101,
    client_name: 'Microsoft Corporation',
    is_active: true,
    color: '#2e7d32', // Green
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Amazon Client Calendar',
    description: 'Holiday calendar for Amazon AWS project',
    type: 'client',
    client_id: 102,
    client_name: 'Amazon Web Services',
    is_active: true,
    color: '#ed6c02', // Orange
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Google Client Calendar',
    description: 'Holiday calendar for Google Cloud project',
    type: 'client',
    client_id: 103,
    client_name: 'Google LLC',
    is_active: false,
    color: '#9c27b0', // Purple
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// Generate Mock Holidays for 2025
const generateMockHolidays = (): Holiday[] => {
  const holidays: Holiday[] = [];
  let holidayId = 1;

  // ATI Company Holidays (10 public holidays)
  const atiHolidays = [
    {
      name: "New Year's Day",
      date: '2025-01-01',
      description: 'Celebration of the beginning of the new year',
      type: 'public' as const
    },
    {
      name: "Martin Luther King Jr. Day",
      date: '2025-01-20',
      description: 'Federal holiday honoring civil rights leader Martin Luther King Jr.',
      type: 'public' as const
    },
    {
      name: "Presidents' Day",
      date: '2025-02-17',
      description: 'Federal holiday honoring all U.S. presidents',
      type: 'public' as const
    },
    {
      name: "Memorial Day",
      date: '2025-05-26',
      description: 'Federal holiday honoring military personnel who died in service',
      type: 'public' as const
    },
    {
      name: "Independence Day",
      date: '2025-07-04',
      description: 'Celebration of American independence from Britain',
      type: 'public' as const
    },
    {
      name: "Labor Day",
      date: '2025-09-01',
      description: 'Federal holiday celebrating the contributions of workers',
      type: 'public' as const
    },
    {
      name: "Columbus Day",
      date: '2025-10-13',
      description: 'Federal holiday commemorating Christopher Columbus',
      type: 'public' as const,
      is_optional: true
    },
    {
      name: "Veterans Day",
      date: '2025-11-11',
      description: 'Federal holiday honoring military veterans',
      type: 'public' as const
    },
    {
      name: "Thanksgiving Day",
      date: '2025-11-27',
      description: 'Traditional harvest festival and family gathering',
      type: 'public' as const
    },
    {
      name: "Christmas Day",
      date: '2025-12-25',
      description: 'Christian holiday celebrating the birth of Jesus Christ',
      type: 'public' as const
    }
  ];

  // Add ATI holidays
  atiHolidays.forEach(holiday => {
    holidays.push({
      id: holidayId++,
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      type: holiday.type,
      calendar_id: 1, // ATI Calendar
      calendar: mockHolidayCalendars[0],
      is_optional: holiday.is_optional || false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    });
  });

  // Microsoft Client Holidays (additional to ATI holidays)
  const microsoftHolidays = [
    {
      name: "Microsoft Founders Day",
      date: '2025-04-04',
      description: 'Celebrating Microsoft foundation anniversary',
      type: 'company' as const
    },
    {
      name: "Microsoft Innovation Day",
      date: '2025-06-15',
      description: 'Annual innovation and technology showcase',
      type: 'company' as const,
      is_optional: true
    },
    {
      name: "Good Friday",
      date: '2025-04-18',
      description: 'Christian observance of the crucifixion of Jesus',
      type: 'public' as const,
      is_optional: true
    }
  ];

  microsoftHolidays.forEach(holiday => {
    holidays.push({
      id: holidayId++,
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      type: holiday.type,
      calendar_id: 2, // Microsoft Calendar
      calendar: mockHolidayCalendars[1],
      is_optional: holiday.is_optional || false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    });
  });

  // Amazon Client Holidays
  const amazonHolidays = [
    {
      name: "Amazon Prime Day",
      date: '2025-07-15',
      description: 'Annual Amazon shopping event',
      type: 'company' as const
    },
    {
      name: "AWS re:Invent Conference",
      date: '2025-11-25',
      description: 'Amazon Web Services annual conference week',
      type: 'company' as const,
      is_optional: true
    },
    {
      name: "Earth Day",
      date: '2025-04-22',
      description: 'Environmental awareness and sustainability focus',
      type: 'company' as const,
      is_optional: true
    }
  ];

  amazonHolidays.forEach(holiday => {
    holidays.push({
      id: holidayId++,
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      type: holiday.type,
      calendar_id: 3, // Amazon Calendar
      calendar: mockHolidayCalendars[2],
      is_optional: holiday.is_optional || false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    });
  });

  // Google Client Holidays (inactive calendar)
  const googleHolidays = [
    {
      name: "Google I/O Conference",
      date: '2025-05-14',
      description: 'Annual Google developer conference',
      type: 'company' as const
    }
  ];

  googleHolidays.forEach(holiday => {
    holidays.push({
      id: holidayId++,
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      type: holiday.type,
      calendar_id: 4, // Google Calendar
      calendar: mockHolidayCalendars[3],
      is_optional: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    });
  });

  return holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const mockHolidays = generateMockHolidays();

// Add holidays to calendars
mockHolidayCalendars.forEach(calendar => {
  calendar.holidays = mockHolidays.filter(h => h.calendar_id === calendar.id);
});

// Service Functions
export const fetchHolidayCalendars = async (): Promise<HolidayCalendar[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockHolidayCalendars;
  }
  
  const response = await api.get('/holiday-calendars');
  return response.data;
};

export const fetchActiveHolidayCalendars = async (): Promise<HolidayCalendar[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockHolidayCalendars.filter(calendar => calendar.is_active);
  }
  
  const response = await api.get('/holiday-calendars/active');
  return response.data;
};

export const fetchHolidays = async (calendarId?: number, year?: number): Promise<Holiday[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredHolidays = mockHolidays;
    
    // Filter by calendar if specified
    if (calendarId) {
      filteredHolidays = filteredHolidays.filter(h => h.calendar_id === calendarId);
    }
    
    // Filter by year if specified
    if (year) {
      filteredHolidays = filteredHolidays.filter(h => 
        new Date(h.date).getFullYear() === year
      );
    }
    
    return filteredHolidays;
  }
  
  const params = new URLSearchParams();
  if (calendarId) params.append('calendar_id', calendarId.toString());
  if (year) params.append('year', year.toString());
  
  const response = await api.get(`/holidays?${params.toString()}`);
  return response.data;
};

export const fetchHoliday = async (id: number): Promise<Holiday> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const holiday = mockHolidays.find(h => h.id === id);
    if (!holiday) {
      throw new Error(`Holiday with id ${id} not found`);
    }
    return holiday;
  }
  
  const response = await api.get(`/holidays/${id}`);
  return response.data;
};

export const createHoliday = async (data: CreateHolidayDto): Promise<Holiday> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newHoliday: Holiday = {
      id: Math.max(...mockHolidays.map(h => h.id)) + 1,
      name: data.name,
      date: data.date,
      description: data.description,
      type: data.type,
      calendar_id: data.calendar_id,
      calendar: mockHolidayCalendars.find(c => c.id === data.calendar_id),
      is_optional: data.is_optional || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockHolidays.push(newHoliday);
    return newHoliday;
  }
  
  const response = await api.post('/holidays', data);
  return response.data;
};

export const deleteHoliday = async (id: number): Promise<void> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockHolidays.findIndex(h => h.id === id);
    if (index === -1) {
      throw new Error(`Holiday with id ${id} not found`);
    }
    
    mockHolidays.splice(index, 1);
    return;
  }
  
  await api.delete(`/holidays/${id}`);
};