import { LogOut } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export function ProfileButton() {
  const { signOut } = useSession();
  const router = useRouter();

  const handlePress = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={{ 
        backgroundColor: '#0088CE', 
        padding: 8, 
        borderRadius: 20,
        marginRight: 8,
      }}>
        <LogOut size={20} color="white" />
      </View>
    </Pressable>
  );
}
