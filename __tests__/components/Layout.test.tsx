import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render, mockUsers } from '../utils/test-utils'
import Layout from '../../src/components/Layout'

const mockUseAuth = jest.fn()
const mockPush = jest.fn()

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  }),
}))

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders layout with navigation for authenticated admin user', () => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText('ATI Web Portal')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Employees')).toBeInTheDocument()
    expect(screen.getByText('Leave Management')).toBeInTheDocument()
  })

  it('renders layout with limited navigation for employee user', () => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.employee,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Timesheets')).toBeInTheDocument()
    expect(screen.getByText('Job Openings')).toBeInTheDocument()
    
    // Admin sections should not be visible
    expect(screen.queryByText('Employees')).not.toBeInTheDocument()
    expect(screen.queryByText('Leave Management')).not.toBeInTheDocument()
  })

  it('handles logout when logout button is clicked', () => {
    const mockLogout = jest.fn()
    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    // Find and click logout button (usually in a menu or toolbar)
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })

  it('displays user name in the app bar', () => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText(mockUsers.admin.name)).toBeInTheDocument()
  })

  it('renders mobile drawer when menu button is clicked', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 900px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    // Find and click menu button for mobile
    const menuButton = screen.getByLabelText('open drawer')
    fireEvent.click(menuButton)

    // Check that drawer opens (implementation depends on actual component)
  })

  it('navigates to correct route when navigation item is clicked', () => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    const timesheetsLink = screen.getByText('Timesheets')
    fireEvent.click(timesheetsLink)

    expect(mockPush).toHaveBeenCalledWith('/timesheets')
  })

  it('shows correct navigation items based on user role', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUsers.hr, roles: ['HR'] },
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    // HR should see leave management but not employee management
    expect(screen.getByText('Leave Management')).toBeInTheDocument()
    expect(screen.queryByText('Employees')).not.toBeInTheDocument()
  })

  it('renders without navigation when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})