//  @ts-ignore
import axios from "axios";
import { ref } from 'vue';
import { useAuthStore } from "../store/authStore";
import { useErrorStore } from "../store/errorStore";
import { useNetwork } from "@vueuse/core";

export function useAuth() {
  const { isLogged, currentUser, login, logout } = useAuthStore();
  const { setMessage, clearError } = useErrorStore();
  const { isOnline } = useNetwork();

  //  @ts-ignore
  const apiUrl = import.meta.env.MODE === 'production' ? 'http://localhost:4173' : 'http://localhost:5173';
  const offlineMode = ref(!isOnline.value);

  //  @ts-ignore
  const authenticate = async (email: string, password: string) => {
    try {
      if (!isOnline.value) {
        setMessage("Network is offline. Cannot log in.");
        console.error("Login failed: No network connection");
        return;
      };
      const response = await axios.post(apiUrl + "/api/login/", {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        await login(token);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("An unexpected error occurred.");
      }
      //logout();
    }
  };

  return {
    isLogged,
    currentUser,
    authenticate,
    logout,
  };
}
