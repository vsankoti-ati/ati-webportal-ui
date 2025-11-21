import { useAccount, useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { setAuthTokenProvider, setTokenRefreshProvider } from '@/lib/api';
import { employeeService, Employee } from '@/services/employee';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  department?: string;
  employeeData?: Employee | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  loginWithMsal: () => Promise<void>;
  logout: () => void;
  getAccessToken?: () => string | null;
  getEmployeeData?: () => Employee | null;
  refreshEmployeeData?: () => Promise<Employee | null>;
}

import { pkceAuthService, PKCETokenResponse } from '@/services/pkceAuth';

// Helper function to fetch and store employee data
const fetchEmployeeDataByEmail = async (email: string): Promise<Employee | null> => {
  try {
    console.log('[Auth] Fetching employee data for email:', email);
    const employeeData = await employeeService.getByEmail(email);
    
    // Store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('employeeData', JSON.stringify(employeeData));
      console.log('[Auth] Employee data stored in sessionStorage:', employeeData);
    }
    
    return employeeData;
  } catch (error) {
    console.warn('[Auth] Failed to fetch employee data:', error);
    // Clear any stale employee data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('employeeData');
    }
    return null;
  }
};

// Helper function to get employee data from sessionStorage
const getStoredEmployeeData = (): Employee | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem('employeeData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('[Auth] Failed to parse stored employee data:', error);
    sessionStorage.removeItem('employeeData');
    return null;
  }
};

// Check authentication mode based on environment
const isLocalEnvironment = process.env.NEXT_PUBLIC_ENV === 'local';
const shouldSkipMsal = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                       (isLocalEnvironment && !process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID);
const usePKCE = !shouldSkipMsal && !isLocalEnvironment && process.env.NEXT_PUBLIC_USE_PKCE === 'true';

// Debug logging
console.log('Auth Debug Info:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_SKIP_MSAL: process.env.NEXT_PUBLIC_SKIP_MSAL,
  NEXT_PUBLIC_USE_PKCE: process.env.NEXT_PUBLIC_USE_PKCE,
  isLocalEnvironment,
  shouldSkipMsal,
  usePKCE,
  timestamp: new Date().toISOString()
});

// Mock user for development/testing environments
const mockUser: User = {
  id: 'dev-user-123',
  email: 'developer@company.com',
  name: 'Development User',
  roles: ['ati_portal_admin'], // Full permissions for testing
  employeeData: getStoredEmployeeData(), // Try to get stored employee data
};

// Mock hook for development environments
function useMockAuth(): AuthState {
  // Initialize user from localStorage immediately to prevent flash
  const getInitialUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log('[useMockAuth] Initial user loaded from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockUser');
      }
    }
    console.log('[useMockAuth] No user found in localStorage');
    return null;
  };

  const [user, setUser] = useState<User | null>(getInitialUser);
  // Set loading to false immediately if we have a user from localStorage
  const [isLoading, setIsLoading] = useState(false);

  // No need for delayed loading - we have the user state immediately
  useEffect(() => {
    console.log('[useMockAuth] Auth state:', { user: user?.name, isAuthenticated: !!user, isLoading });
  }, [user, isLoading]);

  // Keep user in sync with localStorage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockUser') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing stored user:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (userData: User) => {
    console.log('[useMockAuth] Mock login attempted with user:', userData);
    
    // Fetch employee data after login
    if (userData.email) {
      setIsLoading(true);
      const employeeData = await fetchEmployeeDataByEmail(userData.email);
      userData.employeeData = employeeData;
      setIsLoading(false);
    }
    
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(userData));
      console.log('[useMockAuth] User stored in localStorage:', userData);
    }
  };

  const loginWithMsal = async () => {
    // In mock mode, just set the default mock user
    await login(mockUser);
  };

  const logout = () => {
    console.log('[useMockAuth] Logout called');
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
      sessionStorage.removeItem('employeeData');
    }
  };

  const getAccessToken = () => null; // Mock auth doesn't provide real tokens

  const getEmployeeData = (): Employee | null => {
    return user?.employeeData || getStoredEmployeeData();
  };

  const refreshEmployeeData = async (): Promise<Employee | null> => {
    if (!user?.email) return null;
    
    setIsLoading(true);
    const employeeData = await fetchEmployeeDataByEmail(user.email);
    if (employeeData && user) {
      const updatedUser = { ...user, employeeData };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      }
    }
    setIsLoading(false);
    return employeeData;
  };

  // Set up API providers for mock mode (no real tokens)
  useEffect(() => {
    setAuthTokenProvider(() => null); // Mock mode doesn't provide real tokens
    setTokenRefreshProvider(async () => null); // No refresh capability in mock mode
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithMsal,
    logout,
    getAccessToken,
    getEmployeeData,
    refreshEmployeeData,
  };
}

// Real MSAL hook for production environments
function useMsalAuth(): AuthState {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  // Initialize user state from sessionStorage OR account
  const getInitialUserFromAccount = (): User | null => {
    // First check sessionStorage for persisted user
    if (typeof window !== 'undefined') {
      try {
        const storedUser = sessionStorage.getItem('msalUser');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log('[useMsalAuth] User loaded from sessionStorage:', parsed);
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing stored MSAL user:', error);
        sessionStorage.removeItem('msalUser');
      }
    }
    
    // Fall back to extracting from account if available
    if (!account) return null;
    
    const extractRoles = (acc: any): string[] => {
      const roles: string[] = [];
      if (acc.idTokenClaims) {
        if (acc.idTokenClaims.roles) {
          roles.push(...acc.idTokenClaims.roles);
        }
        if (acc.idTokenClaims.groups) {
          roles.push(...acc.idTokenClaims.groups);
        }
      }
      return roles.length > 0 ? roles : ['User'];
    };
    
    const user = {
      id: account.homeAccountId || '',
      email: account.username || '',
      name: account.name || account.username || '',
      roles: extractRoles(account),
    };
    
    // Store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('msalUser', JSON.stringify(user));
    }
    
    return user;
  };
  
  const [user, setUser] = useState<User | null>(getInitialUserFromAccount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[useMsalAuth] Account changed:', { 
      hasAccount: !!account, 
      accountName: account?.name,
      accountsLength: accounts.length,
      currentUser: user?.name
    });
    
    if (account) {
      // Extract user information from the account
      const userData: User = {
        id: account.homeAccountId || '',
        email: account.username || '',
        name: account.name || account.username || '',
        roles: extractRoles(account),
        employeeData: getStoredEmployeeData(), // Try to get existing employee data
      };
      console.log('[useMsalAuth] Setting user from MSAL account:', userData);
      
      // Fetch employee data if not already loaded
      const fetchAndSetEmployeeData = async () => {
        if (userData.email && !userData.employeeData) {
          setIsLoading(true);
          const employeeData = await fetchEmployeeDataByEmail(userData.email);
          if (employeeData) {
            userData.employeeData = employeeData;
            console.log('[useMsalAuth] Employee data fetched for user:', employeeData);
          }
          setIsLoading(false);
        }
        
        setUser(userData);
        // Persist to sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('msalUser', JSON.stringify(userData));
        }
      };
      
      fetchAndSetEmployeeData();
    } else {
      // Only clear user if we actually had an account before
      if (user && accounts.length === 0) {
        console.log('[useMsalAuth] No MSAL account, clearing user');
        setUser(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('msalUser');
          sessionStorage.removeItem('employeeData');
        }
      } else {
        console.log('[useMsalAuth] No account yet, but keeping existing user state');
      }
    }
  }, [account, accounts.length]);

  const login = async (userData: User) => {
    // For demo/dummy user logins - this is a fallback for testing
    console.log('[useMsalAuth] Demo login (not recommended with MSAL enabled):', userData);
    
    // Fetch employee data after login
    if (userData.email) {
      setIsLoading(true);
      const employeeData = await fetchEmployeeDataByEmail(userData.email);
      userData.employeeData = employeeData;
      setIsLoading(false);
    }
    
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
    console.log('[useMsalAuth] Logout called');
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('msalUser');
      sessionStorage.removeItem('employeeData');
    }
    if (accounts.length > 0) {
      instance.logoutPopup().catch((error) => {
        console.error('[useMsalAuth] Logout error:', error);
      });
    }
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

  const isAuthenticated = !!account || !!user;
  
  console.log('[useMsalAuth] Current auth state:', {
    isAuthenticated,
    hasAccount: !!account,
    hasUser: !!user,
    userName: user?.name,
    isLoading
  });

  const getAccessToken = () => null; // MSAL mode doesn't expose tokens for API calls in this implementation

  const getEmployeeData = (): Employee | null => {
    return user?.employeeData || getStoredEmployeeData();
  };

  const refreshEmployeeData = async (): Promise<Employee | null> => {
    if (!user?.email) return null;
    
    setIsLoading(true);
    const employeeData = await fetchEmployeeDataByEmail(user.email);
    if (employeeData && user) {
      const updatedUser = { ...user, employeeData };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('msalUser', JSON.stringify(updatedUser));
      }
    }
    setIsLoading(false);
    return employeeData;
  };

  // Set up API providers for MSAL mode (will use localStorage token fallback)
  useEffect(() => {
    setAuthTokenProvider(() => null); // MSAL mode relies on localStorage fallback in API interceptor
    setTokenRefreshProvider(async () => null); // No refresh capability in basic MSAL mode
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithMsal,
    logout,
    getAccessToken,
    getEmployeeData,
    refreshEmployeeData,
  };
}

// PKCE authentication hook for production environments
function usePKCEAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Set up API providers
  useEffect(() => {
    // Set token provider for API calls
    setAuthTokenProvider(() => accessToken);
    
    // Set refresh token provider
    setTokenRefreshProvider(async () => {
      const refreshToken = sessionStorage.getItem('pkce_refresh_token');
      if (refreshToken) {
        try {
          await refreshAccessToken(refreshToken);
          return sessionStorage.getItem('pkce_access_token');
        } catch (error) {
          console.error('Token refresh failed in API provider:', error);
          return null;
        }
      }
      return null;
    });
  }, [accessToken]);

  // Initialize from stored tokens and user data
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = sessionStorage.getItem('pkce_access_token');
        const storedUser = sessionStorage.getItem('pkce_user');
        const tokenExpiry = sessionStorage.getItem('pkce_token_expiry');

        if (storedToken && storedUser && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry);
          const now = Date.now();

          if (now < expiryTime) {
            // Token is still valid
            setAccessToken(storedToken);
            const userData = JSON.parse(storedUser);
            
            // Load employee data if not already included
            if (!userData.employeeData) {
              userData.employeeData = getStoredEmployeeData();
            }
            
            setUser(userData);
            console.log('[usePKCEAuth] Restored user from storage with employee data');
          } else {
            // Token expired, try to refresh
            const refreshToken = sessionStorage.getItem('pkce_refresh_token');
            if (refreshToken) {
              await refreshAccessToken(refreshToken);
            } else {
              clearAuthData();
            }
          }
        }

        // Check for authorization code in URL (redirect from Azure AD)
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const error = urlParams.get('error');

          if (error) {
            console.error('[usePKCEAuth] Authorization error:', error);
            clearAuthData();
          } else if (code) {
            console.log('[usePKCEAuth] Processing authorization code');
            await handleAuthorizationCode(code);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error('[usePKCEAuth] Initialization error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthorizationCode = async (code: string) => {
    try {
      const tokenResponse = await pkceAuthService.exchangeCodeForToken(code);
      await storeTokensAndUser(tokenResponse);
    } catch (error) {
      console.error('[usePKCEAuth] Error handling authorization code:', error);
      throw error;
    }
  };

  const storeTokensAndUser = async (tokenResponse: PKCETokenResponse) => {
    const { access_token, refresh_token, expires_in } = tokenResponse;
    
    // Calculate expiry time
    const expiryTime = Date.now() + (expires_in * 1000);
    
    // Store tokens
    setAccessToken(access_token);
    sessionStorage.setItem('pkce_access_token', access_token);
    sessionStorage.setItem('pkce_token_expiry', expiryTime.toString());
    
    if (refresh_token) {
      sessionStorage.setItem('pkce_refresh_token', refresh_token);
    }

    // Get user info and store it
    try {
      const userInfo = await pkceAuthService.getUserInfo(access_token);
      const userData: User = {
        id: userInfo.id,
        email: userInfo.mail,
        name: userInfo.displayName,
        roles: ['User'], // Default role, could be enhanced with group membership
        department: userInfo.department,
      };

      // Fetch employee data using the user's email
      if (userData.email) {
        console.log('[usePKCEAuth] Fetching employee data for:', userData.email);
        const employeeData = await fetchEmployeeDataByEmail(userData.email);
        userData.employeeData = employeeData;
        userData.roles = employeeData ? employeeData.role ? [employeeData.role] : ['ati_portal_user'] : ['ati_portal_user'];
      }
      
      setUser(userData);
      sessionStorage.setItem('pkce_user', JSON.stringify(userData));
      console.log('[usePKCEAuth] User authenticated with employee data:', userData);
    } catch (error) {
      console.error('[usePKCEAuth] Error getting user info:', error);
      throw error;
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const tokenResponse = await pkceAuthService.refreshToken(refreshToken);
      await storeTokensAndUser(tokenResponse);
      console.log('[usePKCEAuth] Token refreshed successfully');
    } catch (error) {
      console.error('[usePKCEAuth] Token refresh failed:', error);
      clearAuthData();
      throw error;
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem('pkce_access_token');
    sessionStorage.removeItem('pkce_refresh_token');
    sessionStorage.removeItem('pkce_user');
    sessionStorage.removeItem('pkce_token_expiry');
    sessionStorage.removeItem('employeeData');
  };

  const login = async (userData: User) => {
    // For demo/dummy user logins in PKCE mode (fallback)
    console.log('[usePKCEAuth] Demo login (fallback):', userData);
    setUser(userData);
  };

  const loginWithMsal = async () => {
    // Redirect to Azure AD for PKCE flow
    const authUrl = await pkceAuthService.getAuthorizationUrl();
    console.log('[usePKCEAuth] Redirecting to Azure AD for PKCE flow');
    window.location.href = authUrl;
  };

  const logout = () => {
    console.log('[usePKCEAuth] Logout called');
    clearAuthData();
    
    // Optionally redirect to Azure AD logout
    const logoutUrl = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
    window.location.href = logoutUrl;
  };

  // Expose access token for API calls
  const getAccessToken = (): string | null => {
    return accessToken;
  };

  const getEmployeeData = (): Employee | null => {
    return user?.employeeData || getStoredEmployeeData();
  };

  const refreshEmployeeData = async (): Promise<Employee | null> => {
    if (!user?.email) return null;
    
    const employeeData = await fetchEmployeeDataByEmail(user.email);
    if (employeeData && user) {
      const updatedUser = { ...user, employeeData };
      setUser(updatedUser);
      sessionStorage.setItem('pkce_user', JSON.stringify(updatedUser));
    }
    return employeeData;
  };

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    loginWithMsal,
    logout,
    getAccessToken,
    getEmployeeData,
    refreshEmployeeData,
  };
}

export function useAuth(): AuthState {
  if (shouldSkipMsal) {
    console.log('Authentication skipped - using mock user');
    return useMockAuth();
  } else if (usePKCE) {
    console.log('Using PKCE authentication');
    return usePKCEAuth();
  } else {
    console.log('Using MSAL authentication');
    return useMsalAuth();
  }
}

// Export employee data types for convenience
export type { Employee } from '@/services/employee';