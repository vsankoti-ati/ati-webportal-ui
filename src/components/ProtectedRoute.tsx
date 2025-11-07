import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasAttemptedRedirect = useRef(false);
  const isCheckingAuth = useRef(false);
  const currentPath = useRef(router.asPath);
  
  console.log('[ProtectedRoute] Render:', {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    userName: user?.name,
    path: router.asPath,
    pathname: router.pathname,
    isReady: router.isReady
  });
  
  // Reset redirect flag when path changes
  useEffect(() => {
    if (currentPath.current !== router.asPath) {
      console.log('[ProtectedRoute] Path changed:', {
        from: currentPath.current,
        to: router.asPath
      });
      currentPath.current = router.asPath;
      hasAttemptedRedirect.current = false;
      isCheckingAuth.current = false;
    }
  }, [router.asPath]);
  
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady || isCheckingAuth.current) {
      return;
    }

    // Only attempt redirect once when authentication check is complete and user is not authenticated
    if (!isLoading && !isAuthenticated && !hasAttemptedRedirect.current) {
      isCheckingAuth.current = true;
      hasAttemptedRedirect.current = true;
      
      console.log('[ProtectedRoute] User not authenticated, redirecting to login...', {
        isLoading,
        isAuthenticated,
        user,
        currentPath: router.pathname,
        asPath: router.asPath,
        isReady: router.isReady
      });
      
      // Store the intended destination for redirect after login
      const returnUrl = router.asPath;
      router.push({
        pathname: '/login',
        query: { returnUrl }
      }).finally(() => {
        isCheckingAuth.current = false;
      });
    }
    
    // Reset the flag if user becomes authenticated
    if (isAuthenticated && hasAttemptedRedirect.current) {
      hasAttemptedRedirect.current = false;
      isCheckingAuth.current = false;
    }
  }, [isAuthenticated, isLoading, router.isReady, router.pathname, user]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading state');
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading authentication...
        </Typography>
      </Box>
    );
  }
  
  // If not authenticated, show loading while redirect happens
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, showing redirect message');
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  // Check roles if specified
  if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {
      console.log('[ProtectedRoute] User lacks required role', {
        userRoles: user.roles,
        requiredRoles: roles
      });
      
      return (
        <Box 
          display="flex" 
          flexDirection="column"
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
          gap={2}
        >
          <Typography variant="h5" color="error">
            Access Denied
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required roles: {roles.join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your roles: {user.roles.join(', ')}
          </Typography>
        </Box>
      );
    }
  }

  console.log('[ProtectedRoute] Access granted', { 
    userName: user?.name, 
    userRoles: user?.roles,
    path: router.pathname 
  });
  
  return <>{children}</>;
}