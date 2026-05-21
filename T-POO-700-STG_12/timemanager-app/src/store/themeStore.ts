import { ref } from 'vue';

const darkMode = ref<boolean>(false);

export function useThemeStore() {
  const initializeDarkMode = () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkMode.value = isDarkMode;
  };

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value ? 'true' : 'false');
  };

  return {
    darkMode,
    initializeDarkMode,
    toggleDarkMode
  };
}