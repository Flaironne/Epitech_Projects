import { ApiClient } from '@/services/api';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL!;

export function useApi(token: string | null) {
  return {
    api: new ApiClient(API_URL, (): string | null => token),
  };
}
