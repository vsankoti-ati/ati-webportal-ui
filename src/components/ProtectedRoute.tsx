import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <CircularProgress />;
  }
  
  if (!isAuthenticated) {
    // Show loading while redirecting to login
    return <CircularProgress />;
  }

  // Check roles if specified
  if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {
      router.push('/unauthorized');
      return <CircularProgress />;
    }
  }

  return <>{children}</>;
}