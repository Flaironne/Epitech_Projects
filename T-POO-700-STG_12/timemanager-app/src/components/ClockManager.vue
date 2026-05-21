<template>
    <h1 class="text-2xl font-bold my-4 text-center">Clocking</h1>
    <Panel v-if="isLogged" class="mt-4">
        <h2 class="text-xl font-semibold mb-4 text-center">Add Clock at Current Time</h2>
        <div class="flex justify-center">
            <button @click="toggleWorkingTime" :class="lastClockStatus === false ? 'bg-green-500' : 'bg-red-500'"
                class="px-4 py-2 text-white rounded-md" :disabled="!isOnline">
                <i :class="lastClockStatus === false ? 'pi pi-play' : 'pi pi-pause'"></i>
            </button>
        </div>
        <div v-if="lastClockStatus" class="mt-4 text-center">
            <h3 class="text-lg font-semibold">Time since last clock:</h3>
            <p class="text-2xl">{{ elapsedTime }}</p>
        </div>
    </Panel>
    <Panel class="mt-4">
        <div class="md:flex md:space-x-4">
            <div class="md:flex-1 mt-4 text-center">
                <h3 class="text-lg font-semibold">Total Worked Hours Today:</h3>
                <p class="text-2xl">{{ totalWorkedHours }}</p>
            </div>
            <div class="md:flex-1 mt-4 text-center">
                <h3 class="text-lg font-semibold">Total Worked Hours This Month:</h3>
                <p class="text-2xl">{{ totalWorkedHoursMonth }}</p>
            </div>
        </div>
    </Panel>
    <Panel class="mt-4">
        <h2 class="text-xl font-semibold mb-4 text-center">Clocks LIST</h2>
        <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scrope="col" class="py-3 px-6">ID</th>
                        <th v-if="canAccess(['admin', 'manager_general', 'manager'])" scope="col" class="py-3 px-6">User
                            Id</th>
                        <th scope="col" class="py-3 px-6">Time</th>
                        <th scrope="col" class="py-3 px-6">Status</th>
                        <th v-if="canAccess(['admin'])" scrope="col" class="py-3 px-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="clock in clocks" :key="clock.id" class=" borderb dark:border-gray-700">
                        <td class="py-4 px-6">
                            <span>{{ clock.id }}</span>
                        </td>
                        <td v-if="canAccess(['admin', 'manager_general', 'manager'])" class="py-4 px-6">
                            <span>{{ clock.userId }}</span>
                        </td>
                        <td class="py-4 px-6">
                            <span v-if="!clock.isEditing">{{ formatClockTime(clock.time) }}</span>
                            <input v-else  :value="formatInputTime(clock.time)" @input="updateTime(clock, $event)" type="datetime-local"
                                class="w-full px-3 py-2 border rounded-md" />
                        </td>
                        <td class="py-4 px-6">
                            <span>{{ clock.status }}</span>
                        </td>
                        <td v-if="canAccess(['admin'])" class="py-4 px-6">
                            <button v-if="!clock.isEditing" @click="editClock(clock)"
                                class="px-4 py-2 bg-teal-500 text-white rounded-md">Edit</button>
                            <button v-else @click="saveClock(clock)"
                                class="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
                            <button v-if="clock.isEditing" @click="cancelEdit(clock)"
                                class="px-4 py-2 bg-gray-500 text-white rounded-md ml-2">Cancel</button>
                            <button @click="openDeleteModal(clock.id)"
                                class="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Panel>
    <Panel v-if="canAccess(['admin'])" class="mt-4">
        <h2 class="text-xl font-semibold mb-4 text-center">Add a Clock</h2>
        <form @submit.prevent="addClocks" class="mt-4">
            <div class="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <select v-model="newClock.userId" required class="w-full px-3 py-2 border rounded-md">
                        <option value="" disabled>- Select User -</option>
                        <option v-for="user in users" :key="user.id" :value="user.id">#{{ user.id }} - {{ user.name }} - {{
                            user.role }}</option>
                    </select>
                </div>
                <div>
                    <input v-model="newClock.time" type="datetime-local" placeholder="Time" required
                        class="w-full px-3 py-2 border rounded-md" />
                </div>
            </div>
            <div class="mb-4">
                <label class="flex items-center">
                    <span class="mr-2">is Working ?</span>
                    <ToggleSwitch v-model="newClock.isActive" />
                </label>
            </div>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Add Clock</button>
        </form>
    </Panel>
    <Dialog header="Confirmation" :visible="confirmDialogVisible" modal @click="confirmDialogVisible = false">
        <span>Are you sure you want to delete this clock?</span>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="confirmDialogVisible = false" class="p-button-text" />
            <Button label="Yes" icon="pi pi-check" @click="deleteClock" class="p-button-text" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Clocks } from '../api/clocks';
import { Users } from '../api/users';
import { canAccess, formatDate, calculateWorkedTimes, formatWorkedHours, formatInputTime } from '../utils';
import { useAuthStore } from '../store/authStore';
import Panel from 'primevue/panel';
import { User, Clock } from '../interfaces';
import { useNetwork } from '@vueuse/core';

const { isOnline } = useNetwork();

const { isLogged, currentUser } = useAuthStore();

const clocks = ref<Clock[]>([]);
const userClocks = ref<Clock[]>([]);
const users = ref<User[]>([]);
const newClock = ref({
    userId: '',
    isActive: false,
    time: ''
});
const lastClockTime = ref<Date | null>(null);
const lastClockStatus = ref<boolean | null>(false);
const confirmDialogVisible = ref(false);
const clockToDelete = ref<number | null>(null);
const elapsedTime = ref('00:00:00');
const totalWorkedHours = ref<string>('');
const totalWorkedHoursMonth = ref<string>('');

const fetchClocks = async () => {
    if (!isOnline.value) {
        // Load data from localStorage when offline
        const cachedClocks = localStorage.getItem('clocksData');
        if (cachedClocks) {
            clocks.value = JSON.parse(cachedClocks);
            console.log("Loaded clocks from cache (offline mode)");
            calculateTodayWorkedHours();
            calculateMonthlyWorkedHours();
        }
        return; // Skip fetching from API
    }

    let clocksData;
    if (canAccess(['user'])) {
        if (!currentUser.value) return;
        const userId = currentUser.value.id;
        clocksData = await Clocks.getUserClocks(userId.toString());
    } else {
        clocksData = await Clocks.getClocks();
    }

    clocks.value = clocksData.map(clock => ({
        id: clock.id,
        userId: clock.user_id,
        time: clock.time,
        formattedTime: formatInputTime(clock.time),
        status: clock.status
    }));

    // Cache the fetched clocks data for offline use
    localStorage.setItem('clocksData', JSON.stringify(clocks.value));

    calculateTodayWorkedHours();
    calculateMonthlyWorkedHours();
};


/* const fetchUserClocks = async () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const userClocksData = await Clocks.getUserClocks(userId.toString());
    userClocks.value = userClocksData.map(clock => ({
        id: clock.id,
        userId: clock.user_id,
        time: clock.time,
        formattedTime: formatInputTime(clock.time),
        status: clock.status
    }));
};*/

const calculateTodayWorkedHours = () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const today = new Date().toISOString().split('T')[0];
    const todayClocks = clocks.value.filter(clock => clock.userId === userId && clock.time.startsWith(today));
    const totalSeconds = calculateWorkedTimes(todayClocks);
    totalWorkedHours.value = formatWorkedHours(totalSeconds);
};

const calculateMonthlyWorkedHours = () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyClocks = clocks.value.filter(clock => clock.userId === userId && clock.time.startsWith(currentMonth));
    const totalSeconds = calculateWorkedTimes(monthlyClocks);
    totalWorkedHoursMonth.value = formatWorkedHours(totalSeconds);
};

const fetchLastUserClock = async () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const lastClock = await Clocks.getLastUserClock(userId.toString());
    if (lastClock) {
        lastClockTime.value = new Date(lastClock.time);
        lastClockStatus.value = lastClock.status;
        setInterval(updateElapsedTime, 1000);
    }
};

const fetchUsers = async () => {
    const usersData = await Users.getUsers();
    users.value = usersData.map(user => ({
        id: user.id,
        name: user.username,
        role: user.role,
    }));
};

const addClocks = async () => {
    const { userId, time } = newClock.value;
    await Clocks.createClock(userId, {
        clock: {
            time: newClock.value.time,
            status: newClock.value.isActive ? true : false
        }
    });
    fetchClocks();
    newClock.value.time = '';
};

const openDeleteModal = (id: number) => {
    clockToDelete.value = id;
    confirmDialogVisible.value = true;
};

const deleteClock = async () => {
    if (clockToDelete.value !== null) {
        await Clocks.deleteClock(clockToDelete.value.toString());
        fetchClocks();
        confirmDialogVisible.value = false;
        clockToDelete.value = null;
    }
};

const editClock = (clock: Clock) => {
    clock.isEditing = true;
};

const saveClock = async (clock: Clock) => {
    await Clocks.updateClock(clock.id.toString(), {
        clock: {
            time: clock.time,
        }
    });
    clock.isEditing = false;
    fetchClocks();
};

const toggleWorkingTime = async () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const currentTime = new Date().toISOString();
    const newStatus = !lastClockStatus.value;
    await Clocks.createClock(userId.toString(), {
        clock: {
            time: currentTime,
            status: newStatus
        }
    });
    lastClockTime.value = new Date(currentTime);
    lastClockStatus.value = newStatus;
    fetchClocks();
    // fetchUserClocks();
    updateElapsedTime();
};

const updateElapsedTime = () => {
    if (lastClockTime.value) {
        const now = new Date();
        const diff = now.getTime() - lastClockTime.value.getTime();
        const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        elapsedTime.value = `${hours}:${minutes}:${seconds}`;
    }
};

const formatClockTime = (time: string) => {
    return formatDate(time);
};

const updateTime = (clock: Clock, event) => {
    if (event.target) {
        const date = new Date(event.target.value);
        clock.time = date.toISOString();
    }
};

const cancelEdit = (clock: Clock) => {
    clock.isEditing = false;
};

onMounted(() => {
    fetchClocks();
    fetchUsers();
    fetchLastUserClock();
    //fetchUserClocks();
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