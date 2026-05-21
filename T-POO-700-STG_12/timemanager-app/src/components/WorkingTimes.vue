<template>
    <h1 class="text-2xl font-bold my-4 text-center">Working Times</h1>
    <Panel class="mt-4">
        <h2 class="text-xl font-semibold mb-4 text-center">Working Times List</h2>
        <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scrope="col" class="py-3 px-6">ID</th>
                        <th v-if="canAccess(['admin', 'manager_general', 'manager'])" scope="col" class="py-3 px-6">User
                            Id</th>
                        <th scope="col" class="py-3 px-6">Début</th>
                        <th scope="col" class="py-3 px-6">Fin</th>
                        <th v-if="canAccess(['admin', 'manager_general', 'manager'])" scrope="col" class="py-3 px-6">
                            Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="workingtime in workingtimes" :key="workingtime.id" class="border-b dark:border-gray-700">
                        <td class="py-4 px-6">
                            <span>{{ workingtime.id }}</span>
                        </td>
                        <td v-if="canAccess(['admin', 'manager_general', 'manager'])" class="py-4 px-6">
                            <span>{{ workingtime.userId }}</span>
                        </td>
                        <td class="py-4 px-6">
                            <span v-if="!workingtime.isEditing">{{ formatTime(workingtime.start) }}</span>
                            <input v-else :value="formatInputTime(workingtime.start)" @input="updateStart(workingtime, $event)" type="datetime-local"
                                class="w-full px-3 py-2 border rounded-md" />
                        </td>
                        <td class="py-4 px-6">
                            <span v-if="!workingtime.isEditing">{{ formatTime(workingtime.end) }}</span>
                            <input v-else :value="formatInputTime(workingtime.end)" @input="updateEnd(workingtime, $event)" type="datetime-local"
                                class="w-full px-3 py-2 border rounded-md" />
                        </td>
                        <td v-if="canAccess(['admin', 'manager_general', 'manager'])" class="py-4 px-6">
                            <button v-if="!workingtime.isEditing" @click="editWorkingTime(workingtime)"
                                class="px-4 py-2 bg-teal-500 text-white rounded-md">Edit</button>
                            <button v-else-if="workingtime.isEditing" @click="saveWorkingTime(workingtime)"
                                class="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
                            <button v-if="workingtime.isEditing" @click="cancelEdit(workingtime)"
                                class="px-4 py-2 bg-gray-500 text-white rounded-md ml-2">Cancel</button>
                            <button @click="openDeleteModal(workingtime.id)"
                                class="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Panel>
    <Panel v-if="canAccess(['admin', 'manager_general', 'manager'])" class="mt-4">
        <h2 class="text-xl font-semibold mb-4 text-center">Add a Working Time</h2>
        <form @submit.prevent="addWorkingTimes" class="mt-4">
            <div class="mb-4">
                <select v-model="newWorkingTime.userId" required class="w-full px-3 py-2 border rounded-md">
                    <option value="" disabled>- Select User -</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">#{{ user.id }} - {{ user.name }} - {{ user.role }}</option>
                </select>
            </div>
            <div class="mb-4 flex space-x-4">
                <input v-model="newWorkingTime.start" type="datetime-local" placeholder="Start Date" required
                    class="w-full px-3 py-2 border rounded-md" />
                <input v-model="newWorkingTime.end" type="datetime-local" placeholder="End Date" required
                    class="w-full px-3 py-2 border rounded-md" />
            </div>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Add Working Time</button>
        </form>
    </Panel>
    <Dialog header="Confirmation" :visible="confirmDialogVisible" modal @click="confirmDialogVisible = false">
        <span>Are you sure you want to delete this workingTime ?</span>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDialogVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="deleteWorkingTime" class="p-button-text" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WorkingTimes } from '../api/workingtimes';
import { Users } from '../api/users';

import { formatDate, canAccess, formatInputTime } from '../utils';
import { User, WorkingTime } from '../interfaces';
import { useAuthStore } from '../store/authStore';
import { useNetwork } from '@vueuse/core'

const { currentUser } = useAuthStore();
const { isOnline } = useNetwork();


const workingtimes = ref<WorkingTime[]>([]);
const users = ref<User[]>([]);
const newWorkingTime = ref({
    userId: '',
    start: '',
    end: ''
});

const confirmDialogVisible = ref(false);
const workingTimeToDelete = ref<number | null>(null);

// if (isOnline.value) {
//     const myData = localStorage.getItem('myData');
//     if (myData) {
//         workingtimes.value = JSON.parse(myData);
//     }
// };

const fetchWorkingTimes = async () => {

    // console.log("isOnline", isOnline.value);
    if (!isOnline.value) {
        const cachedData = localStorage.getItem('myData');
        if (cachedData) {
            workingtimes.value = JSON.parse(cachedData);
            console.log("Loaded working times from cache (offline mode)");
        }
        return;
    }

    // Fetch data from API when online
    const workingtimesData = await WorkingTimes.getWorkingTimes();
    const mapWorkingTime = (workingtime) => ({
        id: workingtime.id,
        userId: workingtime.user_id,
        start: workingtime.start,
        end: workingtime.end,
    });

    if (canAccess(['user'])) {
        workingtimes.value = workingtimesData
            .filter(workingtime => currentUser.value && workingtime.user_id === currentUser.value.id)
            .map(mapWorkingTime);

    } else {
        workingtimes.value = workingtimesData.map(mapWorkingTime);
    }

    const plainData = workingtimes.value.map(mapWorkingTime);
    localStorage.setItem('myData', JSON.stringify(plainData));
};

// const fetchWorkingTimes = async () => {
//     const workingtimesData = await WorkingTimes.getWorkingTimes();
//     const mapWorkingTime = (workingtime) => ({
//         id: workingtime.id,
//         userId: workingtime.user_id,
//         start: workingtime.start,
//         formattedStart: formatInputTime(workingtime.start),
//         end: workingtime.end,
//         formattedEnd: formatInputTime(workingtime.end)
//     });

//     console.log("fetching workingtimes");

//     if (canAccess(['user'])) {
//         workingtimes.value = workingtimesData
//             .filter(workingtime => currentUser.value && workingtime.user_id === currentUser.value.id)
//             .map(mapWorkingTime);

//     } else {
//         workingtimes.value = workingtimesData.map(mapWorkingTime);
//     }

//     const plainData = workingtimes.value.map(mapWorkingTime);
//     localStorage.setItem('myData', JSON.stringify(plainData));
// };

const fetchUsers = async () => {
    const usersData = await Users.getUsers();
    users.value = usersData.map(user => ({
        id: user.id,
        name: user.username,
        role: user.role
    }));
};

const addWorkingTimes = async () => {
    const { userId, start, end } = newWorkingTime.value;
    await WorkingTimes.createWorkingTime(userId, {
        working_time: {
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString()
        }
    });
    fetchWorkingTimes();
};

const openDeleteModal = (id: number) => {
    confirmDialogVisible.value = true;
    workingTimeToDelete.value = id;
};

const deleteWorkingTime = async () => {
    if (workingTimeToDelete.value !== null && canAccess(['admin', 'manager_general', 'manager'])) {
        await WorkingTimes.deleteWorkingTime(workingTimeToDelete.value.toString());
        fetchWorkingTimes();
        confirmDialogVisible.value = false;
        workingTimeToDelete.value = null;
    }
};

const editWorkingTime = (workingtime: WorkingTime) => {
    if (canAccess(['admin', 'manager_general', 'manager'])) {
        workingtime.isEditing = true;
    }
};

const saveWorkingTime = async (workingtime: WorkingTime) => {
    await WorkingTimes.updateWorkingTime(workingtime.id.toString(), {
        working_time: {
            start: workingtime.start,
            end: workingtime.end
        }
    });
    workingtime.isEditing = false;
    fetchWorkingTimes();
};

const formatTime = (time: string) => {
    return formatDate(time);
};

const updateStart = (workingtime: WorkingTime, event) => {
    if (event.target) {
            const date = new Date(event.target.value);
            workingtime.start = date.toISOString();
        }
};

const updateEnd = (workingtime: WorkingTime, event) => {
    if (event.target) {
        const date = new Date(event.target.value);
        workingtime.end = date.toISOString();
    }
};

const cancelEdit = (workingtime: WorkingTime) => {
    workingtime.isEditing = false;
};

onMounted(() => {
    fetchWorkingTimes();
    fetchUsers();
});

</script>

<style scoped>
.cardContainer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1em;
    padding: 1em;
    background-color: #f3f4f6;
}
</style>