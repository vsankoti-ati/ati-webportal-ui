import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from '../../src/config/theme'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock user data for testing
export const mockUsers = {
  admin: {
    id: 'admin-user-001',
    email: 'admin@atiwebportal.com',
    name: 'Admin User',
    roles: ['Admin'],
    department: 'IT Administration'
  },
  employee: {
    id: 'employee-user-001',
    email: 'employee@atiwebportal.com',
    name: 'John Employee',
    roles: ['Employee'],
    department: 'Software Development'
  },
  hr: {
    id: 'hr-user-001',
    email: 'hr@atiwebportal.com',
    name: 'HR Manager',
    roles: ['HR'],
    department: 'Human Resources'
  }
}

// Mock timesheet data
export const mockTimesheet = {
  id: 'ts-001',
  employeeId: 'employee-user-001',
  weekStart: '2025-10-13',
  weekEnd: '2025-10-19',
  status: 'draft',
  totalHours: 40,
  entries: [
    {
      date: '2025-10-13',
      projectId: 'proj-001',
      projectName: 'ATI Web Portal',
      hours: 8,
      description: 'Frontend development',
    }
  ]
}

// Mock holiday data
export const mockHolidays = [
  {
    id: 'holiday-001',
    name: 'New Year\'s Day',
    date: '2025-01-01',
    type: 'public',
    calendarId: 'ati-calendar'
  },
  {
    id: 'holiday-002',
    name: 'Independence Day',
    date: '2025-07-04',
    type: 'public',
    calendarId: 'ati-calendar'
  }
]

// Mock employee data
export const mockEmployee = {
  id: 'emp-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@atiwebportal.com',
  department: 'Engineering',
  position: 'Software Developer',
  startDate: '2025-01-15',
  status: 'active'
}

// Mock job opening data
export const mockJobOpening = {
  id: 'job-001',
  title: 'Senior Software Engineer',
  department: 'Engineering',
  location: 'Remote',
  type: 'Full-time',
  description: 'We are looking for a senior software engineer...',
  requirements: ['5+ years experience', 'React expertise'],
  status: 'open',
  postedDate: '2025-10-01'
}

// Mock leave data
export const mockLeave = {
  id: 'leave-001',
  employeeId: 'employee-user-001',
  type: 'vacation',
  startDate: '2025-11-01',
  endDate: '2025-11-05',
  days: 5,
  status: 'pending',
  reason: 'Family vacation'
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }