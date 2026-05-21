import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/session-context';

export function useSession(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
