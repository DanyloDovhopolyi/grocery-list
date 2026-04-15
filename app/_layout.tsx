import '../global.css';

import AppErrorFallback from '@/components/app-error-fallback';
import AppLoading from '@/components/app-loading';
import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppQueryProvider } from '@/providers/query-client';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <Suspense fallback={<AppLoading message="Loading app..." />}>
        <AppQueryProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal/index" options={{ presentation: 'modal', title: 'Item' }} />
            </Stack>
            <PortalHost />
            <StatusBar style="auto" />
          </ThemeProvider>
        </AppQueryProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
