import { ref } from 'vue';

const message = ref<string | null>(null);

export function useErrorStore() {
  const setMessage = (msg: string) => {
    message.value = msg;
    clearError();
  };

  const clearError = () => {
    setTimeout(() => {
      message.value = null;
    }, 4000);
  };

  return {
    message,
    setMessage,
    clearError
  };
}