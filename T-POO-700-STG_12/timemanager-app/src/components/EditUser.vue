<template>
    <Panel class="mt-4">
        <form @submit.prevent="saveUser" class="flex flex-col space-y-4">
            <div class="flex flex-row space-x-4">
            <div class="flex-1">
                <label for="name" class="block text-sm font-medium text-gray-700">Nom:</label>
                <input id="name" v-model="name" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div class="flex-1">
                <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                <input id="email" type="email" v-model="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            </div>
            <div class="flex justify-start space-x-4">
                <button type="submit" class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save settings
                </button>
                <button type="button" @click="openDeleteModal" class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Account
                </button>
            </div>
        </form>
    </Panel>
    <Dialog header="Confirmation" :visible="confirmDialogVisible" modal @click="confirmDialogVisible = false">
        <span>Are you sure you want to delete your account?</span>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDialogVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="deleteUser" class="p-button-text" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../store/authStore';
import { Users } from '../api/users';
import { useRouter } from 'vue-router'
import { useErrorStore } from '../store/errorStore';

const router = useRouter();
const { currentUser, logout } = useAuthStore();
const { setMessage, clearError } = useErrorStore();
const name = ref('');
const email = ref('');
const confirmDialogVisible = ref(false);

const updateFormFields = () => {
    if (currentUser.value) {
        name.value = currentUser.value.name;
        email.value = currentUser.value.email;
    }
};

onMounted(updateFormFields);

watch(currentUser, updateFormFields);

const saveUser = async () => {
    try {
        clearError();
        if (currentUser.value) {
            await Users.updateUser(currentUser.value.id.toString(), {
                user: {
                    username: name.value,
                    email: email.value
                }
            });
            // Optionally, you can update the currentUser in the store
            currentUser.value.name = name.value;
            currentUser.value.email = email.value;
        }
    } catch (error) {
        setMessage('Failed to save user information.');
    }
};

const openDeleteModal = () => {
    confirmDialogVisible.value = true;
};

const deleteUser = async () => {
    try {
        clearError();
        if (currentUser.value) {
            await Users.deleteUser(currentUser.value.id.toString());
            setMessage('User account deleted successfully.');
            // Optionally, you can clear the currentUser in the store
            currentUser.value = null;
        }
        logout()
        router.push('/login')
    } catch (error) {
        setMessage('Failed to delete user account.');
    }
};
</script>

<style scoped>
/* Ajoutez ici vos styles */
</style>