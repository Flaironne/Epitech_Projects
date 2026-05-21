import { PropsWithChildren, useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import { useApi } from '@/hooks/use-api';

export function AuthBootstrapProvider({ children }: PropsWithChildren) {
  const { session, isLoading, signOut } = useSession();
  const { api } = useApi(session?.access_token ?? null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) return;

    const checkMe = async () => {
      try {
        const response = await api.get('/authenticated-user');
        console.log('Authenticated user:', response);
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
        // token invalide / expiré / user supprimé
        signOut();
      }
    };

    checkMe();
  }, [isLoading, session]);

  return <>{children}</>;
}
