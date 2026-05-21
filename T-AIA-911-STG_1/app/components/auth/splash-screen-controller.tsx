import { SplashScreen } from 'expo-router';
import { useSession } from '@/hooks/use-session';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return <View>
    <Text>{isLoading ? 'Loading...' : 'Loaded'}</Text>
  </View>;
}
