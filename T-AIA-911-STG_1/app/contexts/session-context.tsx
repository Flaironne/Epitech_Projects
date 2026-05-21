import { createContext, type PropsWithChildren } from 'react';

import { useStorageState } from '@/hooks/use-storage-state';
import { useApi } from '@/hooks/use-api';

export type User = {
  id: string;
  name: string;
  email: string;
  default_language_code: string;
};

type Credentials = {
  email: string;
  password: string;
};

type Session = {
  access_token: string;
  token_type: 'Bearer';
  user: User;
};

export type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState<Session | null>('session');
  const { api } = useApi(session?.access_token ?? null);

  const signIn = async (credentials: Credentials) => {
    const session = await api.post<Session>('/login', credentials);

    console.log('Signed in, session:', session);
    setSession(session);
  };

  const signOut = async () => {
    await api.post('/logout');
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
