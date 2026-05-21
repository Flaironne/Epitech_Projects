import { ref } from 'vue';
import { useErrorStore } from './errorStore';
import { Fetch } from '../api/fetch';
import { User } from '../interfaces';

const { setMessage } = useErrorStore();

const isLogged = ref(false);
const currentUser = ref<User | null>(null);

export function useAuthStore() {
  const login = async (token: string) => {
    // Check if the network is online
    setMessage('Authentication success');
    isLogged.value = true;
    Fetch.setToken(token);
    try {
      const user = await Fetch.getUser();
      currentUser.value = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        managerId: user.manager_id
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  const logout = () => {
    setMessage('Logout');
    isLogged.value = false;
    currentUser.value = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    Fetch.setToken('');
  };

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      currentUser.value = JSON.parse(storedUser);
      isLogged.value = true;
      Fetch.setToken(storedToken);
    }
  };

  return {
    isLogged,
    currentUser,
    login,
    logout,
    initializeAuth
  };
}
