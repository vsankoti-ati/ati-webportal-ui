import { PublicClientApplication, Configuration, EventType } from "@azure/msal-browser";
import { msalConfig } from "../config/authConfig";

// Check if we should skip MSAL authentication
const shouldSkipMsal = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                       process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;

// Create a stub configuration for development when skipping MSAL
const stubConfig = {
  auth: {
    clientId: "stub-client-id",
    authority: "https://login.microsoftonline.com/stub-tenant-id",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage" as const,
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = shouldSkipMsal 
  ? new PublicClientApplication(stubConfig as Configuration)
  : new PublicClientApplication(msalConfig as Configuration);

// Only set up event callbacks if not skipping MSAL
if (!shouldSkipMsal) {
  // Default to using the first account if no account is active on page load
  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const authResult = event.payload as any;
      if (authResult.account) {
        msalInstance.setActiveAccount(authResult.account);
      }
    }
  });
}