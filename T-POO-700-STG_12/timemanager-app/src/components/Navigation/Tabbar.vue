<template>
  <nav class="fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2">
    <router-link to="/" class="flex flex-col items-center">
      <i class="pi pi-home text-xl"></i>
      <span class="text-xs">Home</span>
    </router-link>
    <router-link v-if="canAccess(['admin', 'manager_general', 'manager'])" to="/users" class="flex flex-col items-center">
      <i class="pi pi-users text-xl"></i>
      <span class="text-xs">Users</span>
    </router-link>
    <router-link to="/workingtimes" class="flex flex-col items-center">
      <i class="pi pi-clock text-xl"></i>
      <span class="text-xs">Working Times</span>
    </router-link>
    <router-link to="/clocks" class="flex flex-col items-center">
      <i class="pi pi-stopwatch text-xl"></i>
      <span class="text-xs">Clocks</span>
    </router-link>
    <router-link to="/charts" class="flex flex-col items-center">
      <i class="pi pi-chart-line text-xl"></i>
      <span class="text-xs">Charts</span>
    </router-link>
  </nav>
</template>
  
  <script lang="ts" setup>
  import Menubar from 'primevue/menubar';
  import Badge from 'primevue/badge';
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../store/authStore';
  import { canAccess } from '../../utils/';
  
  const router = useRouter()
  const { isLogged, currentUser } = useAuthStore();
  
  const items = [
    {
      label: '',
      icon: 'pi pi-home',
      command: () => { router.push('/home') }
    },
    ...(canAccess(['admin', 'manager_general', 'manager']) ? [{
      label: '',
      icon: 'pi pi-user',
      command: () => { router.push('/user') }
    }] : []),
    {
      label: '',
      icon: 'pi pi-clock',
      command: () => { router.push('/workingTimes') }
    },
    {
      label: '',
      icon: 'pi pi-stopwatch',
      command: () => { router.push('/clock') }
    },
    {
      label: '',
      icon: 'pi pi-chart-line',
      command: () => { router.push('/chartManager') }
    }
  ]
  </script>
  
  <style scoped></style>