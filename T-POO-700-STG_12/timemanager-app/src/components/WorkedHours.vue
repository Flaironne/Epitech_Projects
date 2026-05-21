<template>
    <Panel class="mt-4">
        <h2 v-if="canAccess(['admin', 'manager', 'manager_general'])" class="text-center text-2xl">Worked hours for User #{{ selectedUserId }}</h2>
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
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, defineProps } from "vue";
import { Clocks } from '../api/clocks';
import { useAuth } from "../services/authService";
import { useNetwork } from '@vueuse/core';
import { canAccess, formatInputTime, formatDate, formatWorkedHours, calculateWorkedTimes } from "../utils";
import { Clock } from "../interfaces";

const props = defineProps<{ selectedUserId: number | string }>();
const { isOnline } = useNetwork();
const { currentUser } = useAuth();
const clocks = ref<Clock[]>([]);
const totalWorkedHours = ref<string>('00:00:00');
const totalWorkedHoursMonth = ref<string>('00:00:00');

const fetchClocks = async (userId) => {
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
        clocksData = await Clocks.getUserClocks(userId.toString());
    }

    clocks.value = clocksData.map((clock: { id: any; user_id: any; time: string; status: any; }) => ({
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

const calculateTodayWorkedHours = () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const today = new Date().toISOString().split('T')[0];
    const todayClocks = clocks.value.filter((clock: { userId: any; time: string; }) => clock.userId === userId && clock.time.startsWith(today));
    const totalSeconds = calculateWorkedTimes(todayClocks);
    totalWorkedHours.value = formatWorkedHours(totalSeconds);
};

const calculateMonthlyWorkedHours = () => {
    if (!currentUser.value) return;
    const userId = currentUser.value.id;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyClocks = clocks.value.filter((clock: { userId: any; time: string; }) => clock.userId === userId && clock.time.startsWith(currentMonth));
    const totalSeconds = calculateWorkedTimes(monthlyClocks);
    totalWorkedHoursMonth.value = formatWorkedHours(totalSeconds);
};

watch(() => props.selectedUserId, (newUserId) => {
    fetchClocks(newUserId);
});

onMounted(() => {
    fetchClocks(props.selectedUserId);
});


</script>