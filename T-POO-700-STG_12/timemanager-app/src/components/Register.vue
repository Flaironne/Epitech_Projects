<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
    style="background-image: url('public/img/gotham-city.jpg');">
    <div class="flex justify-center mb-6">
        <img src="../../public/img/logo-timemanager-blanc.png" alt="TimeManager Logo" class="h-12">
    </div>
    <div :class="[darkMode ? 'bg-black/70' : 'bg-white/70', 'backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md w-full']">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-primary-50">Register</h1>
      </div>
      <AlertDisplay class="mt-4" />
      <form @submit.prevent="addUser" class="register-form">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-primary-50">Username</label>
          <input v-model="newUser.name" type="text" id="username" required
            class="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm !bg-white/20 !text-primary-50" />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-primary-50">Email</label>
          <input v-model="newUser.email" type="email" id="email" required
            class="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm !bg-white/20 !text-primary-50" />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-primary-50">Password</label>
          <input v-model="newUser.password" type="password" id="password" required
            class="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm !bg-white/20 !text-primary-50" />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-primary-50">Confirm Password</label>
          <input v-model="confirmPassword" type="password" id="confirmPassword" required
            class="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm !bg-white/20 !text-primary-50" />
        </div>
        <Button type="submit" severity=""
        class="!p-4 w-full !text-primary-50 !border">Register</Button>
      </form>
      <div class="text-center mt-4">
        <router-link to="/login" class="hover:underline">Back to login</router-link>
      </div>
    </div>
    <div class="absolute top-2 right-2">
      <button @click="toggleDarkMode" class="p-button p-component p-button-text p-button-plain">
        <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { Users } from '../api/users';
import AlertDisplay from './Alerts/AlertDisplay.vue'
import { useErrorStore } from '../store/errorStore';
import { useThemeStore } from '../store/themeStore';
import { User } from '../interfaces';

const users = ref<User[]>([]);
const newUser = ref({
  name: '',
  email: '',
  password: ''
});

const confirmPassword = ref('');

const { setMessage } = useErrorStore(); // Utiliser le store d'erreurs
const { darkMode, toggleDarkMode } = useThemeStore();

const router = useRouter();

const addUser = async () => {
  if (newUser.value.password !== confirmPassword.value) {
    setMessage('Passwords do not match'); // Message d'erreur
    return;
  }

  try {
    await Users.registerUser({
      user: {
        username: newUser.value.name,
        email: newUser.value.email,
        password: newUser.value.password
      }
    });
    setMessage('User registered successfully'); // Message de succès
  } catch (error) {
    setMessage(error || 'Failed to register user'); // Message d'échec
  }
};
</script>