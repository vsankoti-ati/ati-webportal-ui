interface PKCETokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface PKCEAuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
}

class PKCEAuthService {
  private config: PKCEAuthConfig;
  private codeVerifier: string | null = null;

  constructor(config: PKCEAuthConfig) {
    this.config = config;
  }

  // Generate code verifier and challenge for PKCE using Web Crypto API
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(digest));
  }

  // Helper function to base64URL encode
  private base64URLEncode(array: Uint8Array): string {
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(array)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // Generate authorization URL
  async getAuthorizationUrl(): Promise<string> {
    this.codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    // Store code verifier in sessionStorage for later use
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pkce_code_verifier', this.codeVerifier);
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: this.config.scopes.join(' '),
      response_mode: 'query',
    });

    const authority = `https://login.microsoftonline.com/${this.config.tenantId}`;
    return `${authority}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(authorizationCode: string): Promise<PKCETokenResponse> {
    const codeVerifier = typeof window !== 'undefined' 
      ? sessionStorage.getItem('pkce_code_verifier')
      : this.codeVerifier;

    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const authority = `https://login.microsoftonline.com/${this.config.tenantId}`;
    const tokenEndpoint = `${authority}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      client_id: this.config.clientId,
      code: authorizationCode,
      redirect_uri: this.config.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange failed:', errorText);
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const tokenData: PKCETokenResponse = await response.json();

      // Clean up code verifier
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pkce_code_verifier');
      }

      return tokenData;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<PKCETokenResponse> {
    const authority = `https://login.microsoftonline.com/${this.config.tenantId}`;
    const tokenEndpoint = `${authority}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: this.config.scopes.join(' '),
    });

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Get user info from Microsoft Graph
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const pkceAuthService = new PKCEAuthService({
  clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || '',
  tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  scopes: ['User.Read', 'profile', 'email', 'openid'],
});

export type { PKCETokenResponse };