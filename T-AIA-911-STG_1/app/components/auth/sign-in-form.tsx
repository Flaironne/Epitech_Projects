import { View, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function SignInForm() {
  const { session, isLoading, signIn } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('a@b.c');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/(app)');
    }
  }, [session, isLoading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre email et mot de passe');
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Connexion échouée', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ marginBottom: 48, alignItems: 'center' }}>
        <Image 
          source={require('@/assets/images/sncf-connect-logo.png')} 
          style={{ width: 200, height: 60, marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 16, color: '#004C97' }}>
          Connectez-vous pour continuer
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ backgroundColor: '#fff', borderColor: '#E5D9ED' }}
        />
        <Input 
          placeholder="Mot de passe" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
          style={{ backgroundColor: '#fff', borderColor: '#E5D9ED' }}
        />

        <Button onPress={handleLogin} disabled={loading} className="mt-4 h-12 rounded-xl" style={{ backgroundColor: '#0088CE' }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
