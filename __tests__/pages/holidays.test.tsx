import { render, screen } from '@testing-library/react'
import { mockUsers } from '../utils/test-utils'
import HolidaysPage from '../../src/pages/holidays'

const mockUseAuth = jest.fn()

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('../../src/services/holidayService', () => ({
  holidayService: {
    getHolidays: jest.fn().mockResolvedValue([
      {
        id: 'holiday-001',
        name: 'New Year\'s Day',
        date: '2025-01-01',
        type: 'public',
        calendarId: 'ati-calendar'
      }
    ]),
    getCalendars: jest.fn().mockResolvedValue([
      {
        id: 'ati-calendar',
        name: 'ATI Holidays',
        description: 'Company holidays',
        isDefault: true
      }
    ])
  }
}))

describe('HolidaysPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.employee,
      isAuthenticated: true,
      isLoading: false,
    })
  })

  it('renders holidays page', async () => {
    render(<HolidaysPage />)

    expect(screen.getByText('Holiday Calendar')).toBeInTheDocument()
    expect(screen.getByText('2025 Holidays')).toBeInTheDocument()
  })

  it('displays holiday list', async () => {
    render(<HolidaysPage />)

    // Wait for holidays to load
    expect(await screen.findByText('New Year\'s Day')).toBeInTheDocument()
  })

  it('shows calendar filter', () => {
    render(<HolidaysPage />)

    expect(screen.getByText('Calendar Filter')).toBeInTheDocument()
  })

  it('allows filtering by calendar', async () => {
    render(<HolidaysPage />)

    // Test calendar filtering functionality
    expect(screen.getByText('All Calendars')).toBeInTheDocument()
  })
})