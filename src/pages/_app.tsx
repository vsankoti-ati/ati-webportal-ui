import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { AuthProvider } from '../components/AuthProvider';
import { theme } from '../config/theme';

export default function App({ Component, pageProps }: AppProps) {
  // Create a new QueryClient instance for each user session
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          cacheTime: 1000 * 60 * 10, // 10 minutes
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}