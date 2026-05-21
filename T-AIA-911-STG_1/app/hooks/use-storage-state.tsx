import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type AsyncState<T> = [boolean, T | null];
type UseStateHook<T> = [AsyncState<T>, (value: T | null) => void];

function useAsyncState<T>(
  initialValue: AsyncState<T> = [true, null]
): UseStateHook<T> {
  return useReducer(
    (_: AsyncState<T>, action: T | null): AsyncState<T> => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

/**
 * SecureStore key validation
 * Expo SecureStore only accepts:
 * a-z A-Z 0-9 . - _
 */
function isValidKey(key: unknown): key is string {
  return (
    typeof key === 'string' &&
    key.length > 0 &&
    /^[a-zA-Z0-9._-]+$/.test(key)
  );
}

async function setRawStorageItem(
  key: string,
  value: string | null
): Promise<void> {
  if (Platform.OS === 'web') {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getRawStorageItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>();

  useEffect(() => {
    if (!isValidKey(key)) {
      setState(null);
      return;
    }

    getRawStorageItem(key).then((storedValue) => {
      if (!storedValue) {
        setState(null);
        return;
      }

      try {
        setState(JSON.parse(storedValue) as T);
      } catch {
        setState(null);
      }
    });
  }, [key]);

  const setValue = useCallback(
    (value: T | null) => {
      if (!isValidKey(key)) {
        return;
      }

      setState(value);
      setRawStorageItem(key, value ? JSON.stringify(value) : null);
    },
    [key]
  );

  return [state, setValue];
}