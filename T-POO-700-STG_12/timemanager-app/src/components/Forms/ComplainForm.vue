<template>
    <form @submit.prevent="submitForm">
        <div class="mb-4">
            <label for="recipient" class="block text-sm font-medium text-gray-700">Recipient Email</label>
            <input id="recipient" v-model="recipient" type="email" required
                class="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input id="subject" v-model="subject" type="text" required
                class="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div class="mb-4">
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>     
            <textarea id="message" v-model="message" required
                class="mt-1 block w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        <div class="flex justify-end">
            <Button type="submit" label="Submit" class="p-button-primary" />
        </div>
    </form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button';
import { Users } from '../../api/users';
import { Manager } from '../../interfaces';
import { useAuthStore } from '../../store/authStore';

const recipient = ref('')
const subject = ref('')
const message = ref('')
const manager = ref<Manager | null>(null);

const { currentUser } = useAuthStore();

const fetchManagerEmail = async () => {
    if (currentUser.value && currentUser.value.managerId) {
        const managerData = await Users.getUser(currentUser.value.managerId.toString());
        manager.value = managerData;
        recipient.value = managerData.email;
    }
};

const submitForm = () => {
    const complaintData = {
        recipient: recipient.value,
        subject: subject.value,
        message: message.value,
    }

    // Call the submit event with the complaintData
    // ...
}

onMounted(() => {
    fetchManagerEmail();
});
</script>

<style scoped></style>