<template>
  <Dialog :visible="isShowModal" @update:visible="updateModalVisibility" modal @hide="closeModal">
    <template #container="{ closeCallback }" headers="Login">
      <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl">
        <div class="inline-flex flex-col gap-2">
          <label for="username" class="text-primary-50 font-semibold">Username</label>
          <InputText type="text" id="username" v-model="username"
            class="!bg-white/20 !border-0 !p-4 !text-primary-50 w-80"></InputText>
        </div>
        <div class="flex items-center gap-4">
          <Button label="Cancel" @click="closeCallback" text severity="secondary"
            class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10">Close</Button>
          <Button label="Sign-In" @click="handleLogin" text severity="sucess"
            class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10">Login</Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useAuth } from '../../services/authService';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';


const username = ref('');
const { authenticate } = useAuth();
const router = useRouter();

const props = defineProps<{
  isShowModal: Boolean,
  closeModal: () => void,
  updateModalVisibility: (value: boolean) => void,
}>();

const updateModalVisibility = (value: boolean) => {
  props.updateModalVisibility(value)
}

const handleLogin = async () => {
  try {
    await authenticate(username.value);
    router.push('/');
  } catch (error) {
    console.error('Authentication failed', error);
  }
};
</script>