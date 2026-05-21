import '@/global.css';

import { ThemeToggle } from '@/components/theme-toggle';
import { SessionProvider } from '@/contexts/session-context';
import { SplashScreenController } from '@/components/auth/splash-screen-controller';
import { PortalHost } from '@rn-primitives/portal';
import { useSession } from '@/hooks/use-session';
import { Stack } from 'expo-router';
import { AuthBootstrapProvider } from '@/contexts/auth-bootstrap-provider';

export { ErrorBoundary } from 'expo-router';

const SCREEN_OPTIONS = {
  title: '',
  headerTransparent: true,
  headerLeft: () => <ThemeToggle />,
};

export default function Root() {
  return (
    <SessionProvider>
      <AuthBootstrapProvider>
        <SplashScreenController />
        <RootNavigator />
        <PortalHost />
      </AuthBootstrapProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={SCREEN_OPTIONS} />
      </Stack.Protected>
    </Stack>
  );
}
