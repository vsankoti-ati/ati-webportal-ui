# Employee Data Integration - Usage Guide

## Overview

The application now automatically fetches and stores employee data after successful authentication via PKCE or MSAL. Employee data is retrieved from the API endpoint `/employees/email/{email}` and stored in sessionStorage for persistence across page refreshes.

## Key Features

### 1. Automatic Employee Data Fetching
- After successful authentication, the system automatically calls `employeeService.getByEmail(userEmail)`
- Employee data is stored in both the user object and sessionStorage
- Data persists across page refreshes and browser tabs

### 2. Enhanced User Object
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  department?: string;
  employeeData?: Employee | null; // New property
}
```

### 3. New Hook Methods
```typescript
interface AuthState {
  // ... existing properties
  getEmployeeData?: () => Employee | null;
  refreshEmployeeData?: () => Promise<Employee | null>;
}
```

## Usage Examples

### Basic Employee Data Access
```typescript
import { useAuth } from '@/hooks/useAuth';

function UserProfile() {
  const { user, getEmployeeData } = useAuth();
  const employeeData = getEmployeeData?.();

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      
      {employeeData ? (
        <div>
          <h2>Employee Information</h2>
          <p>Employee ID: {employeeData.id}</p>
          <p>Role: {employeeData.role}</p>
          <p>Department: {user.department}</p>
          <p>Hire Date: {employeeData.hireDate}</p>
          <p>Phone: {employeeData.phoneNumber}</p>
          <p>Address: {employeeData.addressLine1}, {employeeData.city}, {employeeData.state}</p>
        </div>
      ) : (
        <div>Loading employee data...</div>
      )}
    </div>
  );
}
```

### Using Dedicated Employee Hook
```typescript
import { useEmployeeData } from '@/hooks/useEmployee';

function EmployeeDetails() {
  const { employeeData, isLoading, refreshEmployeeData, error } = useEmployeeData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employeeData) return <div>No employee data available</div>;

  const handleRefresh = async () => {
    await refreshEmployeeData?.();
  };

  return (
    <div>
      <h2>Employee Details</h2>
      <p>Name: {employeeData.firstName} {employeeData.lastName}</p>
      <p>Role: {employeeData.role}</p>
      <p>Status: {employeeData.isActive ? 'Active' : 'Inactive'}</p>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
```

### Comprehensive User Profile
```typescript
import { useUserProfile } from '@/hooks/useEmployee';

function ComprehensiveProfile() {
  const { 
    user, 
    isAuthenticated, 
    employeeData, 
    employeeError, 
    roles, 
    isFullyLoaded 
  } = useUserProfile();

  if (!isAuthenticated) return <div>Please log in</div>;
  if (!isFullyLoaded) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>Complete Profile</h1>
      
      {/* Authentication Data */}
      <section>
        <h2>User Information</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Roles: {roles.join(', ')}</p>
      </section>

      {/* Employee Data */}
      <section>
        <h2>Employee Information</h2>
        {employeeData ? (
          <div>
            <p>Employee ID: {employeeData.id}</p>
            <p>Position: {employeeData.role}</p>
            <p>Hire Date: {new Date(employeeData.hireDate).toLocaleDateString()}</p>
            <p>Status: {employeeData.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        ) : (
          <p>Error loading employee data: {employeeError}</p>
        )}
      </section>
    </div>
  );
}
```

### Role-Based Access Control
```typescript
import { useUserRoles } from '@/hooks/useEmployee';

function AdminPanel() {
  const { hasRole, userRoles } = useUserRoles(['Admin', 'HR']);

  if (!hasRole) {
    return <div>Access denied. Required roles: Admin or HR</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Your roles: {userRoles.join(', ')}</p>
      {/* Admin content */}
    </div>
  );
}
```

## Data Storage & Persistence

### SessionStorage Keys
- `employeeData`: Raw employee data from API
- `pkce_user`: User object with embedded employee data (PKCE mode)
- `msalUser`: User object with embedded employee data (MSAL mode)
- `mockUser`: User object with embedded employee data (Mock mode)

### Storage Structure
```typescript
// sessionStorage.getItem('employeeData')
{
  "id": "emp123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Developer",
  "emailId": "john.doe@company.com",
  "hireDate": "2023-01-15",
  "isActive": true,
  // ... other employee properties
}
```

## Authentication Flow with Employee Data

### PKCE Authentication
1. User redirected to Azure AD
2. Authorization code exchanged for access token
3. User info retrieved from Microsoft Graph
4. **Employee data fetched using user email**
5. Complete user object stored with employee data

### MSAL Authentication
1. MSAL popup/redirect authentication
2. User account extracted from MSAL
3. **Employee data fetched using user email**
4. User object updated with employee data

### Mock Authentication (Development)
1. Mock user created
2. **Employee data fetched from mock service**
3. Mock user updated with employee data

## Error Handling

### Employee Data Not Found
```typescript
const { employeeData, error } = useEmployeeData();

if (error) {
  // Handle case where user email doesn't match any employee record
  console.log('Employee lookup failed:', error);
  // Show appropriate UI or redirect to employee registration
}
```

### API Failures
```typescript
const { refreshEmployeeData } = useAuth();

const handleRetry = async () => {
  try {
    const data = await refreshEmployeeData?.();
    if (data) {
      console.log('Employee data refreshed successfully');
    }
  } catch (error) {
    console.error('Failed to refresh employee data:', error);
  }
};
```

## Benefits

1. **Seamless Integration**: Employee data automatically available after authentication
2. **Performance**: Data cached in sessionStorage to avoid repeated API calls
3. **Consistency**: Same employee data structure across all authentication modes
4. **Flexibility**: Easy refresh capability for updated employee information
5. **Developer Experience**: Simple hooks for accessing employee data in components

## Migration Notes

If you have existing components that need employee data:

1. **Replace direct API calls** with `useEmployeeData()` hook
2. **Update user interfaces** to show loading states during employee data fetch
3. **Handle null cases** where employee data might not be available
4. **Use refresh capability** for components that need updated employee information

The employee data is automatically integrated into the authentication flow, so most components will just work with the enhanced user object without requiring changes.