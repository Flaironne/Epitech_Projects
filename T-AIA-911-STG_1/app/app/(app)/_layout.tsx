import * as React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { ProfileButton } from '@/components/auth/profile-button';
import { Image, View } from 'react-native';

const SCREEN_OPTIONS = {
  title: '',
  headerTransparent: true,
  headerLeft: () => <ThemeToggle />,
  headerTitle: () => (
    <View style={{ alignItems: 'center' }}>
      <Image 
        source={require('@/assets/images/sncf-connect-logo.png')} 
        style={{ width: 120, height: 32 }}
        resizeMode="contain"
      />
    </View>
  ),
  headerRight: () => <ProfileButton />,
};

export default function AppLayout() {
  return (
    <>
      <Stack screenOptions={SCREEN_OPTIONS} />
      <PortalHost />
    </>
  );
}
