<template>
    <Menu :model="items" class="w-full h-full !border-none !rounded-none">
      <template #start>
        <span class="inline-flex items-center gap-1 px-2 py-2 w-full">
          <img src="/img/hourglass.png" alt="Vite Logo" class="w-8 h-8" />
          <span class="text-xl font-semibold">TIME<span class="text-primary">MANAGER</span></span>
        </span>
      </template>
      <template #submenulabel="{ item }">
        <span class="text-primary font-bold">{{ item.label }}</span>
      </template>
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <i :class="item.icon" class="mr-2"></i>
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
        </a>
      </template>
    </Menu>
</template>

<script lang="ts" setup>
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore';
import { canAccess } from '../../utils';

const router = useRouter()
const { isLogged, currentUser } = useAuthStore();

const items = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => { router.push('/') }
  },
  ...(canAccess(['admin', 'manager_general', 'manager']) ? [{
    label: 'Users',
    icon: 'pi pi-users',
    command: () => { router.push('/users') }
  }] : []),
  {
    label: 'Working Times',
    icon: 'pi pi-clock',
    command: () => { router.push('/workingtimes') }
  },
  {
    label: 'Clocks',
    icon: 'pi pi-stopwatch',
    command: () => { router.push('/clocks') }
  },
  {
    label: 'Charts',
    icon: 'pi pi-chart-line',
    command: () => { router.push('/charts') }
  }
]
</script>

<style scoped></style>