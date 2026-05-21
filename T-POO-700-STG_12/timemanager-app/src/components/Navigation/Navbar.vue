<template>
  <Menubar class="navbar shadow-black !border-none !rounded-none">
    <template #start>
      <span v-if="isLogged">Bienvenue, {{ currentUser?.name }}</span>
    </template>
    <template #end>
      <Button v-if="canAccess(['user'])" label="complaint" icon="pi pi-exclamation-circle" text class="p-button-warning" @click="showComplaintForm" />
      <router-link v-if="isLogged" to="/edit-user" class="p-button p-component p-button-text p-button-plain">
        <i class="pi pi-user-edit text-xl"></i>
      </router-link>
      <router-link v-if="!isLogged" to="/signup" class="p-button p-component p-button-text p-button-plain">
        <Button label="Sign up" class="p-button-text p-button-plain" />
      </router-link>
      <Button v-if="isLogged" text label="Logout" class="p-button-danger logout-button ml-4" @click="handleLogout" />
      <Button v-else label="Login" text class="p-button-primary" @click="showModal" />
      <button @click="toggleDarkMode" class="p-button p-component p-button-text p-button-plain">
        <i :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'" />
      </button>
    </template>
  </Menubar>
  <LoginModal :isShowModal="isShowModal" :closeModal="closeModal" :updateModalVisibility="updateModalVisibility" />
  <Dialog v-model:visible="isComplaintFormVisible" modal header="Complaint" :style="{ width: '25rem' }">
    <ComplaintForm @submit="handleComplaintSubmit" />
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { useRouter } from 'vue-router'
import { useAuth } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import LoginModal from '../Modal/LoginModal.vue';
import ComplaintForm from '../Forms/ComplainForm.vue';
import { canAccess } from '../../utils';

const isShowModal = ref(false)
const isComplaintFormVisible = ref(false)
const router = useRouter()

const { currentUser, isLogged, logout } = useAuthStore();
const { darkMode, toggleDarkMode } = useThemeStore();

const showModal = () => {
  isShowModal.value = true
}

const closeModal = () => {
  isShowModal.value = false
}

const updateModalVisibility = (value: boolean) => {
  isShowModal.value = value
}

const handleLogout = () => {
  logout()
  router.push('/login')
}

const showComplaintForm = () => {
  isComplaintFormVisible.value = true
}

const handleComplaintSubmit = (complaintData: { subject: string, message: string, location: string }) => {
  // Handle the complaint submission logic here
  console.log('Complaint submitted:', complaintData)
  isComplaintFormVisible.value = false
}

</script>


<style scoped></style>