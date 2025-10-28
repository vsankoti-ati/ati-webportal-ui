import { useAccount, useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  department?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  loginWithMsal: () => Promise<void>;
  logout: () => void;
}

// Check if we should skip MSAL authentication (for development/testing environments)
const shouldSkipMsal = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                       process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;

// Debug logging
console.log('Auth Debug Info:', {
  NEXT_PUBLIC_SKIP_MSAL: process.env.NEXT_PUBLIC_SKIP_MSAL,
  NODE_ENV: process.env.NODE_ENV,
  shouldSkipMsal,
  timestamp: new Date().toISOString()
});

// Mock user for development/testing environments
const mockUser: User = {
  id: 'dev-user-123',
  email: 'developer@company.com',
  name: 'Development User',
  roles: ['Admin', 'HR', 'User'], // Full permissions for testing
};

// Mock hook for development environments
function useMockAuth(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      // Check for stored user in localStorage
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('mockUser');
          setUser(null);
        }
      } else {
        // Don't set default mock user automatically - wait for explicit login
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: User) => {
    console.log('Mock login attempted with user:', userData);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(userData));
      console.log('User stored in localStorage:', userData);
    }
  };

  const loginWithMsal = async () => {
    // In mock mode, just set the default mock user
    await login(mockUser);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithMsal,
    logout,
  };
}

// Real MSAL hook for production environments
function useMsalAuth(): AuthState {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account) {
      // Extract user information from the account
      const userData: User = {
        id: account.homeAccountId || '',
        email: account.username || '',
        name: account.name || account.username || '',
        roles: extractRoles(account), // Extract roles from account claims
      };
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [account]);

  const login = async (userData: User) => {
    // In MSAL mode, this would typically not be used for custom logins
    // But we can still support it for demo purposes
    setUser(userData);
  };

  const loginWithMsal = async () => {
    try {
      await instance.loginPopup({
        scopes: ['User.Read'],
      });
    } catch (error) {
      console.error('MSAL login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    instance.logoutPopup();
    setUser(null);
  };

  const extractRoles = (account: any): string[] => {
    // Extract roles from account claims or ID token
    // This depends on your Azure AD configuration
    const roles: string[] = [];
    
    if (account.idTokenClaims) {
      // Check for roles in different possible claim properties
      if (account.idTokenClaims.roles) {
        roles.push(...account.idTokenClaims.roles);
      }
      
      if (account.idTokenClaims.groups) {
        // Map group IDs to role names if needed
        // You might need to implement group-to-role mapping logic here
        roles.push(...account.idTokenClaims.groups);
      }
      
      // Add other role extraction logic as needed based on your Azure AD setup
    }
    
    // Default roles if none found (you might want to adjust this)
    if (roles.length === 0) {
      roles.push('User'); // Default role
    }
    
    return roles;
  };

  return {
    user,
    isAuthenticated: !!account,
    isLoading,
    login,
    loginWithMsal,
    logout,
  };
}

export function useAuth(): AuthState {
  if (shouldSkipMsal) {
    console.log('MSAL authentication skipped - using mock user');
    return useMockAuth();
  } else {
    return useMsalAuth();
  }
}