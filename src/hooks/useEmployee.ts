import { useAuth } from './useAuth';
import { Employee } from '@/services/employee';

/**
 * Hook to easily access employee data from the authenticated user
 * @returns Employee data if available, null otherwise
 */
export const useEmployeeData = (): {
  employeeData: Employee | null;
  isLoading: boolean;
  refreshEmployeeData: (() => Promise<Employee | null>) | undefined;
  error: string | null;
} => {
  const { user, isLoading, getEmployeeData, refreshEmployeeData } = useAuth();

  const employeeData = getEmployeeData?.() || null;
  const hasError = user?.email && !employeeData && !isLoading;

  return {
    employeeData,
    isLoading,
    refreshEmployeeData,
    error: hasError ? `No employee data found for ${user.email}` : null,
  };
};

/**
 * Hook to check if the current user has specific roles
 * @param requiredRoles Array of roles to check
 * @returns true if user has any of the required roles
 */
export const useUserRoles = (requiredRoles: string[] = []): {
  hasRole: boolean;
  userRoles: string[];
  isLoading: boolean;
} => {
  const { user, isLoading } = useAuth();

  const userRoles = user?.roles || [];
  const hasRole = requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

  return {
    hasRole,
    userRoles,
    isLoading,
  };
};

/**
 * Hook to get comprehensive user profile including authentication and employee data
 * @returns Complete user profile with auth and employee information
 */
export const useUserProfile = () => {
  const auth = useAuth();
  const { employeeData, error: employeeError } = useEmployeeData();
  const { userRoles } = useUserRoles();

  return {
    // Auth data
    ...auth,
    
    // Employee data
    employeeData,
    employeeError,
    
    // Role data
    roles: userRoles,
    
    // Combined loading state
    isFullyLoaded: !auth.isLoading && (employeeData !== null || employeeError !== null),
  };
};