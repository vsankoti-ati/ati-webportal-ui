import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Function to get access token (will be set by auth hook)
let getAccessTokenFn: (() => string | null) | null = null;

export const setAuthTokenProvider = (tokenProvider: () => string | null) => {
  getAccessTokenFn = tokenProvider;
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from PKCE auth first, then fall back to localStorage
    const token = getAccessTokenFn?.() || 
                 sessionStorage.getItem('pkce_access_token') || 
                 localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Function to refresh token (will be set by auth hook)
let refreshTokenFn: (() => Promise<string | null>) | null = null;

export const setTokenRefreshProvider = (refreshProvider: () => Promise<string | null>) => {
  refreshTokenFn = refreshProvider;
};

// Add response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot reach API server at', error.config?.baseURL);
      console.error('Make sure your backend API is running and CORS is configured');
      return Promise.reject(error);
    }
    
    // Handle 401 unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry && refreshTokenFn) {
      originalRequest._retry = true;
      
      try {
        console.log('API: Attempting token refresh due to 401 response');
        const newToken = await refreshTokenFn();
        
        if (newToken) {
          console.log('API: Token refreshed successfully, retrying request');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('API: Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('pkce_access_token');
        sessionStorage.removeItem('pkce_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401) {
      // Fallback: clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('pkce_access_token');
      sessionStorage.removeItem('pkce_refresh_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);