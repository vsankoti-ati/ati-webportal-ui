# PKCE Authentication Implementation

This application now supports **Proof Key for Code Exchange (PKCE)** authentication flow for enhanced security in production environments.

## Authentication Modes

The application supports three authentication modes based on environment configuration:

### 1. Mock Authentication (Development)
- **When**: `NEXT_PUBLIC_ENV=local` or `NODE_ENV=development`
- **Usage**: Uses predefined mock users for local development
- **Security**: No real authentication (development only)

### 2. MSAL Authentication (Basic)
- **When**: Azure AD credentials provided but `NEXT_PUBLIC_USE_PKCE=false`
- **Usage**: Uses Microsoft Authentication Library popup/redirect flow
- **Security**: Standard OAuth 2.0 flow

### 3. PKCE Authentication (Production Recommended)
- **When**: `NEXT_PUBLIC_USE_PKCE=true` and not in local environment
- **Usage**: Uses OAuth 2.0 PKCE flow for enhanced security
- **Security**: Enhanced protection against authorization code interception

## Environment Configuration

### For Local Development (.env.local)
```bash
# Environment indicator (enables mock auth)
NEXT_PUBLIC_ENV=local

# Azure AD Configuration (optional for local)
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your_client_id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your_tenant_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# Authentication mode
NEXT_PUBLIC_SKIP_MSAL=false
NEXT_PUBLIC_USE_PKCE=false
```

### For Production (.env.production)
```bash
# Environment indicator
NEXT_PUBLIC_ENV=production

# Azure AD Configuration (required)
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your_tenant_id
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.com

# Enable PKCE for production security
NEXT_PUBLIC_SKIP_MSAL=false
NEXT_PUBLIC_USE_PKCE=true

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Azure AD App Registration Setup

For PKCE authentication, configure your Azure AD app registration:

1. **Authentication Platform**: Single-page application (SPA)
2. **Redirect URIs**: Add your application URL
3. **API Permissions**: 
   - Microsoft Graph: `User.Read` (for user profile)
   - Add any additional API scopes needed
4. **Advanced Settings**:
   - Allow public client flows: **Yes**
   - Supported account types: As per your requirements

## Features

### API Integration
- **Automatic Token Injection**: Access tokens are automatically added to API requests
- **Token Refresh**: Expired tokens are automatically refreshed on 401 responses
- **Fallback Support**: Falls back to localStorage tokens for compatibility

### User Authentication
- **User Profile**: Access logged-in user details via `useAuth()` hook
- **Access Tokens**: Get current access token via `getAccessToken()` method
- **Persistent Sessions**: User state persists across browser tabs and page refreshes

### Security Features
- **PKCE Flow**: Uses cryptographically secure code verifier/challenge pairs
- **Token Storage**: Secure storage in sessionStorage with expiry tracking
- **Automatic Logout**: Redirects to Azure AD logout on authentication failures

## Usage Examples

### Getting User Information
```typescript
import { useAuth } from '@/hooks/useAuth';

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Roles: {user?.roles.join(', ')}</p>
    </div>
  );
}
```

### Making Authenticated API Calls
```typescript
import { api } from '@/lib/api';

// Tokens are automatically injected
const response = await api.get('/protected-endpoint');

// API will automatically refresh tokens on 401 responses
const data = await api.post('/user/profile', userData);
```

### Manual Token Access
```typescript
import { useAuth } from '@/hooks/useAuth';

function ApiComponent() {
  const { getAccessToken } = useAuth();

  const callCustomAPI = async () => {
    const token = getAccessToken?.();
    if (token) {
      // Use token with custom HTTP client
      const response = await fetch('/api/custom', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };
}
```

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined"**
   - Ensure all required environment variables are set
   - Check Azure AD app registration configuration

2. **Infinite redirect loops**
   - Verify redirect URI matches exactly in Azure AD
   - Check that `NEXT_PUBLIC_ENV` is set correctly

3. **API calls failing with 401**
   - Ensure API accepts the audience in the access token
   - Verify API permissions in Azure AD app registration

4. **Token refresh failures**
   - Check that refresh tokens are enabled in Azure AD
   - Ensure the app registration allows refresh token rotation

### Debug Information

The application logs detailed authentication information to the browser console:
- Authentication mode selection
- Token lifecycle events
- API request/response details
- User authentication state changes

Enable browser console to see detailed debug information during development.

## Migration from MSAL

If migrating from basic MSAL authentication:

1. Update environment variables to include `NEXT_PUBLIC_USE_PKCE=true`
2. Ensure Azure AD app registration supports public client flows
3. Test authentication flow in staging environment
4. Update any custom token handling to use the new `getAccessToken()` method

The migration is backward compatible - existing MSAL configurations will continue to work when `NEXT_PUBLIC_USE_PKCE=false`.