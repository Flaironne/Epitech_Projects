<template>
  <h1 class="text-2xl font-bold my-4 text-center">Charts</h1>
  <!-- <WorkedHours :selectedUserId="selectedUserId"></WorkedHours> -->
  <Panel class="mt-4">
    <h2 class="text-xl font-bold text-center mb-4">Working Hours per User</h2>
    <div class="md:flex md:space-x-4">
      <div class="md:flex-1">
        <label for="date">Select Dates</label>
        <DatePicker v-model="selectedDates" selectionMode="range" showIcon fluid iconDisplay="input" />
      </div>
      <div v-if="canAccess(['admin', 'manager_general', 'manager'])" class="md:flex-1">
        <label for="user">Select User</label>
        <select v-model="selectedUserId" class="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>- Select User -</option>
          <option v-for="user in users" :key="user.id" :value="user.id">#{{ user.id }} - {{ user.name }}</option>
        </select>
      </div>
    </div>
    <div class="flex justify-center m-5">
      <button @click="chartType = 'line'" class="mx-2 px-4 py-2 bg-blue-500 text-white rounded">Line Chart</button>
      <button @click="chartType = 'bar'" class="mx-2 px-4 py-2 bg-blue-500 text-white rounded">Bar Chart</button>
    </div>
    <div class="flex justify-center m-5">
      <LineChart v-if="chartType === 'line'" :chartData="computedChartData" :chartOptions="chartOptions" />
      <BarChart v-else-if="chartType === 'bar'" :chartData="computedChartData" :chartOptions="chartOptions" />
    </div>
    <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2">Worked Hours and Working Times by Date</h3>
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="p-2 text-left">Date</th>
          <th class="p-2 text-left">Working Times (hours)</th>
          <th class="p-2 text-left">Worked Hours (hours)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in WorkingTimesAndWorkingHoursPerDate" :key="date" class="border-b dark:border-gray-700">
          <td class="p-2">{{ data.date }}</td>
          <td class="p-2">{{ data.workingTimes }}</td>
          <td class="p-2">{{ data.workedHours }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </Panel>
  <Panel v-if="canAccess(['admin', 'manager_general', 'manager'])" class="mt-4">
    <h2 class="text-xl font-bold text-center mb-4">Working Hours for all Users for one day</h2>
    <div class="md:flex-1">
        <label for="date">Select Day</label>
        <DatePicker v-model="selectDateForAll" showIcon fluid iconDisplay="input" />
      </div>
    <div class="flex justify-center m-5 mx-auto w-full md:w-2/3">
      <PieChart v-if="selectDateForAll" :chartData="workedHoursByUserChartData" :chartOptions="chartOptions" />
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import LineChart from './Charts/LineChart.vue';
import BarChart from './Charts/BarChart.vue';
import PieChart from './Charts/PieChart.vue';
import Panel from 'primevue/panel';
import DatePicker from 'primevue/datepicker';
import { Clocks } from '../api/clocks';
import { Users } from '../api/users';
import { WorkingTimes } from '../api/workingtimes';
import { User, Clock, WorkingTime } from '../interfaces';
import { formatDate, calculateWorkedTimes, formatWorkedHours, formatWorkedHoursAlt, formatInputTime, canAccess } from '../utils';
import { useNetwork } from "@vueuse/core";
import { useAuth } from '../services/authService';
import WorkedHours from "./WorkedHours.vue";

const { currentUser } = useAuth();
const { isOnline } = useNetwork();

const chartType = ref<'line' | 'bar'>('line');
const selectedDates = ref<[Date, Date] | null>(null);
const selectedUserId = ref<number | string>('');

const clocks = ref<Clock[]>([]);
const workingTimes = ref<WorkingTime[]>([]);
const users = ref<User[]>([]);

const totalWorkedHours = ref<String>('00:00:00');
const totalWorkingTimes = ref<String>('00:00:00');
const workedHoursByDate = ref<Record<string, string>>({});
const workedWorkingTimesByDate = ref<Record<string, string>>({});
const WorkingTimesAndWorkingHoursPerDate = ref([]);

const workedHoursByUser = ref<Record<string, number>>({});
const selectDateForAll = ref<Date | null>(null);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Clocking Times",
      data: [],
      fill: true,
      backgroundColor: "red",
      borderColor: "red",
    },
    {
      label: "Working Times",
      data: [],
      fill: true,
      backgroundColor: "blue",
      borderColor: "blue",
    }
  ],
});

const chartOptions = ref({
  responsive: true,
});

const workedHoursByUserChartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }
  ]
});

const computedChartData = computed(() => {
  if (!isOnline.value) {
    // Load cached chart data if offline
    const cachedChartData = localStorage.getItem('chartData');
    if (cachedChartData) {
      console.log("Loaded chart data from cache (offline mode)");
      return JSON.parse(cachedChartData);
    }
    return chartData.value; // Fallback if no cached data is found
  }

  // Online mode: calculate the chart data
  if (!selectedDates.value || selectedDates.value.length !== 2) {
    return chartData.value;
  }

  const [startDate, endDate] = selectedDates.value;
  const labels = [];
  const data = [];

  const workedHoursByDate = getWorkedHoursByDate(clocks.value, startDate, endDate);
  const workingTimesByDate = getWorkingTimesByDate(workingTimes.value, startDate, endDate);

  // Update table data
  WorkingTimesAndWorkingHoursPerDate.value = Object.keys(workedHoursByDate).map(date => ({
    date,
    workedHours: formatWorkedHoursAlt(workedHoursByDate[date]),
    workingTimes: formatWorkedHoursAlt(workingTimesByDate[date]),
  }));

  Object.keys(workedHoursByDate).forEach(date => {
    labels.push(new Date(date).toLocaleDateString());
    const totalHours = workedHoursByDate[date] / 3600;
    data.push(totalHours);
  });

  // Construct computed chart data
  const computedData = {
    labels,
    datasets: [
      {
        label: "Clocking Times",
        data: Object.keys(workedHoursByDate).map(date => workedHoursByDate[date] / 3600),
        fill: true,
        backgroundColor: "red",
        borderColor: "red",
      },
      {
        label: "Working Times",
        data: Object.keys(workingTimesByDate).map(date => workingTimesByDate[date] / 3600),
        fill: true,
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  };

  // Cache the computed chart data
  localStorage.setItem('chartData', JSON.stringify(computedData));
  return computedData;
});

async function fetchClocks(userId: number | null) {
  if (userId === null) {
    clocks.value = [];
    totalWorkedHours.value = '00:00:00';
    workedHoursByDate.value = {};
    return;
  }

  const fetchedClocks = await Clocks.getUserClocks(userId.toString());
  clocks.value = fetchedClocks.map(clock => ({
    id: clock.id,
    userId: clock.user_id,
    time: clock.time,
    formattedTime: formatInputTime(clock.time),
    status: clock.status
  }));
}

async function fetchWorkingTimes(userId: number | null) {
  if (userId === null) {
    totalWorkingTimes.value = '00:00:00';
    workedWorkingTimesByDate.value = {};
    return;
  }

  const fetchedWorkingTimes = await WorkingTimes.getUserWorkingTimes(userId.toString());
  workingTimes.value = fetchedWorkingTimes.map(workingTime => ({
    id: workingTime.id,
    userId: workingTime.user_id,
    start: workingTime.start,
    end: workingTime.end,
  }));
}

async function fetchUsers() {
  const fetchedUsers = await Users.getUsers();
  users.value = fetchedUsers.map(user => ({
    id: user.id,
    name: user.username
  }));
}

async function fetchWorkedHoursByUser(date: Date) {
  const formattedDate = formatDateYYYMMDD(date);
  const workedHours: Record<string, number> = {};

  for (const user of users.value) {
    const clocksForUser = await Clocks.getUserClocks(user.id.toString());
    const workedHoursForDate = getWorkedHoursByDate(clocksForUser, date, date);
    workedHours[user.name] = workedHoursForDate[formattedDate] / 3600; // Convert to hours
  }

  workedHoursByUser.value = workedHours;

  // Generate Doughnut chart data
  workedHoursByUserChartData.value = {
    labels: Object.keys(workedHours),
    datasets: [
      {
        data: Object.values(workedHours),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };
}


function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function formatDateYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWorkedHoursByDate(clocks: Clock[], startDate: Date, endDate: Date): Record<string, number> {
  const datesInRange = getDatesInRange(startDate, endDate);

  const workedHoursByDate: Record<string, number> = {};

  datesInRange.forEach(date => {
    const dateString = formatDateYYYMMDD(date); // Utiliser formatDate
    const clocksForDate = clocks.filter(clock => clock.time.startsWith(dateString));
    workedHoursByDate[dateString] = calculateWorkedTimes(clocksForDate);
  });

  return workedHoursByDate;
}

function getWorkingTimesByDate(workingTimes: WorkingTime[], startDate: Date, endDate: Date): Record<string, number> {
  const datesInRange = getDatesInRange(startDate, endDate);
  const workingTimesByDate: Record<string, number> = {};

  datesInRange.forEach(date => {
    const dateString = formatDateYYYMMDD(date); // Utiliser formatDate
    const workingTimesForDate = workingTimes.filter(workingTime => workingTime.start.startsWith(dateString));
    workingTimesByDate[dateString] = calculateWorkingTimes(workingTimesForDate);
  });

  return workingTimesByDate;
}

function calculateWorkingTimes(workingTimes: WorkingTime[]): number {
  let totalSeconds = 0;

  workingTimes.forEach(workingTime => {
    const startTime = new Date(workingTime.start).getTime() / 1000; // Convertir en secondes
    const endTime = new Date(workingTime.end).getTime() / 1000; // Convertir en secondes
    totalSeconds += (endTime - startTime); // Ajouter la différence en secondes
  });

  return totalSeconds;
}

watch(selectedUserId, (userId) => {
  fetchClocks(userId);
  fetchWorkingTimes(userId);
});

watch(selectedDates, (newDates) => {
  if (newDates && newDates.length === 2 && selectedUserId.value !== null) {
    fetchClocks(selectedUserId.value);
    fetchWorkingTimes(selectedUserId.value);
  }
});

watch(selectDateForAll, (date) => {
  if (date) {
    fetchWorkedHoursByUser(date);
  }
});

onMounted(() => {
  fetchUsers();
  if (canAccess(['user'])) {
    selectedUserId.value = currentUser.value.id;
  }
});

</script>

<style scoped></style>