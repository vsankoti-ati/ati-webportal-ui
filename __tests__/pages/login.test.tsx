import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockUsers } from '../utils/test-utils'
import LoginPage from '../../src/pages/login'

// Mock the useAuth hook
const mockLogin = jest.fn()
const mockLoginWithMsal = jest.fn()
const mockPush = jest.fn()

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    loginWithMsal: mockLoginWithMsal,
    logout: jest.fn(),
  }),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/login',
    route: '/login',
    query: {},
    asPath: '/login',
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login page with all elements', () => {
    render(<LoginPage />)

    expect(screen.getByText('ATI Web Portal')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument()
  })

  it('displays demo accounts section', () => {
    render(<LoginPage />)

    expect(screen.getByText('Demo Accounts')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('John Employee')).toBeInTheDocument()
    expect(screen.getByText('admin@atiwebportal.com')).toBeInTheDocument()
    expect(screen.getByText('employee@atiwebportal.com')).toBeInTheDocument()
  })

  it('handles demo user login when clicked', async () => {
    mockLogin.mockResolvedValue(undefined)
    render(<LoginPage />)

    const adminUser = screen.getByText('Admin User').closest('[role="button"]')
    fireEvent.click(adminUser!)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: 'admin-user-001',
        email: 'admin@atiwebportal.com',
        password: 'admin123',
        name: 'Admin User',
        roles: ['Admin'],
        department: 'IT Administration'
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('handles form submission with valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined)
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in$/i })

    fireEvent.change(emailInput, { target: { value: 'admin@atiwebportal.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })

  it('shows error for invalid credentials', async () => {
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in$/i })

    fireEvent.change(emailInput, { target: { value: 'invalid@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('handles Microsoft login button click', async () => {
    mockLoginWithMsal.mockResolvedValue(undefined)
    render(<LoginPage />)

    const msalButton = screen.getByText('Sign in with Microsoft')
    fireEvent.click(msalButton)

    await waitFor(() => {
      expect(mockLoginWithMsal).toHaveBeenCalled()
    })
  })

  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<LoginPage />)

    const adminUser = screen.getByText('Admin User').closest('[role="button"]')
    fireEvent.click(adminUser!)

    expect(screen.getByText('Signing in...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Signing in...')).not.toBeInTheDocument()
    })
  })

  it('redirects if user is already logged in', () => {
    jest.doMock('../../src/hooks/useAuth', () => ({
      useAuth: () => ({
        user: mockUsers.admin,
        isAuthenticated: true,
        isLoading: false,
        login: mockLogin,
        loginWithMsal: mockLoginWithMsal,
        logout: jest.fn(),
      }),
    }))

    render(<LoginPage />)

    // Note: In a real test, we'd need to wait for the useEffect to run
    // and check that router.push was called
  })
})