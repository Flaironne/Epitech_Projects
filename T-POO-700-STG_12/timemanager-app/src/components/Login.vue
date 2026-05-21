<template>
  <div class="min-h-screen justify-center items-center flex flex-col bg-cover bg-center"
    style="background-image: url('public/img/gotham-city.jpg');">
    <div class="flex justify-center mb-6">
        <img src="../../public/img/logo-timemanager-blanc.png" alt="TimeManager Logo" class="h-12">
    </div>
    <div :class="[darkMode ? 'bg-black/70' : 'bg-white/70', 'backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md w-full']">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold text-primary-50">Login</h1>
      </div>
      <AlertDisplay class="mt-4" />
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <label for="email" class="text-primary-50 font-semibold">Email</label>
        <InputText type="text" id="email" v-model="email" class="!bg-white/20 border-gray-300 !p-4 !text-primary-50">
        </InputText>
        <label for="password" class="text-primary-50 font-semibold">Password</label>
        <InputText type="password" id="password" v-model="password"
          class="!bg-white/20 border-gray-300 !p-4 !text-primary-50"></InputText>
        <div class="flex items-center gap-4 mt-6">
          <Button label="Sign-In" type="submit" severity=""
        class="!p-4 w-full !text-primary-50 !border">Login</Button>
        </div>
      </form>
      <router-link to="/register" class="block text-center mt-4 text-primary-50">
        <Button label="Sign up" class="p-button-text p-button-plain" />
      </router-link>
    </div>
    <div class="absolute top-2 right-2">
      <button @click="toggleDarkMode" class="p-button p-component p-button-text p-button-plain">
        <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useAuth } from '../services/authService';
import { useRouter } from 'vue-router';
import AlertDisplay from './Alerts/AlertDisplay.vue'
import { useThemeStore } from '../store/themeStore';

const email = ref('');
const password = ref('');
const { authenticate } = useAuth();
const router = useRouter();

const { darkMode, toggleDarkMode } = useThemeStore();

const handleLogin = async () => {
  try {
    await authenticate(email.value, password.value);
    router.push('/');
  } catch (error) {
    console.error('Authentication failed', error);
  }
};
</script>