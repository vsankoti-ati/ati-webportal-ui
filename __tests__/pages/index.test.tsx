import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../utils/test-utils';
import Home from '../../src/pages/index';
import { useAuth } from '../../src/hooks/useAuth';

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders company information', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user', email: 'test@test.com', name: 'Test User', roles: ['employee'] },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      loginWithMsal: jest.fn(),
      logout: jest.fn(),
    });

    render(<Home />);

    expect(await screen.findByText('Adaptive Technology Insights')).toBeInTheDocument();
  });

  it('displays latest happenings section', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-2', email: 'test2@test.com', name: 'Test User 2', roles: ['employee'] },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      loginWithMsal: jest.fn(),
      logout: jest.fn(),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Latest Happenings')).toBeInTheDocument();
      expect(screen.getByText('New Project Win')).toBeInTheDocument();
      expect(screen.getByText('Technology Workshop')).toBeInTheDocument();
      expect(screen.getByText('Employee Recognition')).toBeInTheDocument();
    });
  });

  it('shows leaves section for authenticated users', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-3', email: 'test3@test.com', name: 'Test User 3', roles: ['employee'] },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      loginWithMsal: jest.fn(),
      logout: jest.fn(),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('My Leaves')).toBeInTheDocument();
      expect(screen.getByText('View All Leaves')).toBeInTheDocument();
    });
  });

  it('handles unauthenticated users', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      loginWithMsal: jest.fn(),
      logout: jest.fn(),
    });

    render(<Home />);

    expect(screen.queryByText('Adaptive Technology Insights')).not.toBeInTheDocument();
  });
});
