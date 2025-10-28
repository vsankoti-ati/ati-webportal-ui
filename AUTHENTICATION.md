# Authentication Configuration

This application supports both Azure AD MSAL authentication and mock authentication for different environments.

## Environment Variables

### Required for MSAL Authentication
- `NEXT_PUBLIC_AZURE_AD_CLIENT_ID` - Azure AD Application Client ID
- `NEXT_PUBLIC_AZURE_AD_TENANT_ID` - Azure AD Tenant ID
- `NEXT_PUBLIC_REDIRECT_URI` - Redirect URI after authentication
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Authentication Control
- `NEXT_PUBLIC_SKIP_MSAL` - Set to `true` to skip MSAL authentication

## Authentication Modes

### MSAL Authentication (Production)
Used when:
- `NEXT_PUBLIC_SKIP_MSAL` is `false` or not set
- All Azure AD configuration variables are provided

### Mock Authentication (Development/Testing)
Used when:
- `NEXT_PUBLIC_SKIP_MSAL` is `true`, OR
- In development mode without Azure AD configuration

Mock authentication provides:
- Default user: `developer@company.com`
- Full permissions: Admin, HR, User roles
- No actual authentication required

## Environment Files

### `.env.local` (Development)
```bash
NEXT_PUBLIC_SKIP_MSAL=true
```

### `.env.production` (Production)
```bash
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your_production_tenant_id
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.com
NEXT_PUBLIC_SKIP_MSAL=false
```

## Usage

The `useAuth` hook automatically handles both authentication modes:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

## Security Notes

- **Never** set `NEXT_PUBLIC_SKIP_MSAL=true` in production environments
- Mock authentication should only be used for development and testing
- Ensure proper Azure AD configuration before deploying to production