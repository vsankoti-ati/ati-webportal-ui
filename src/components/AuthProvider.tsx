import { ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../services/msal';

interface AuthProviderProps {
  children: ReactNode;
}

// Check if we should skip MSAL authentication
const shouldSkipMsal = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                       process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;

export function AuthProvider({ children }: AuthProviderProps) {
  // If skipping MSAL, just return children without MsalProvider wrapper
  if (shouldSkipMsal) {
    return <>{children}</>;
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}