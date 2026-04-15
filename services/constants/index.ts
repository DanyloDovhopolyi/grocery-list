import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 3001;

const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

/**
 * Host where Metro is reachable (same machine as json-server in dev).
 * Example: `192.168.1.5` from `192.168.1.5:8081`.
 */
function getExpoDevHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    return host || null;
  }

  const legacy = Constants.manifest as { debuggerHost?: string } | null;
  if (legacy?.debuggerHost && typeof legacy.debuggerHost === 'string') {
    return legacy.debuggerHost.split(':')[0] ?? null;
  }

  return null;
}

/**
 * JSON Server base URL. Override with `EXPO_PUBLIC_API_URL` (no trailing slash).
 */
export const getApiBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }

  if (Platform.OS === 'web') {
    return `http://localhost:${API_PORT}`;
  }

  const expoHost = getExpoDevHost();
  const isLoopback =
    expoHost === 'localhost' ||
    expoHost === '127.0.0.1' ||
    expoHost === '::1' ||
    expoHost === undefined ||
    expoHost === null;

  // Phone/tablet on LAN: Expo shows your PC's IP — use it for json-server too.
  if (expoHost && !isLoopback) {
    return `http://${expoHost}:${API_PORT}`;
  }

  // Android emulator: special alias to the dev machine (localhost on host).
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }

  // iOS simulator and other cases: Metro on localhost.
  return `http://127.0.0.1:${API_PORT}`;
};
