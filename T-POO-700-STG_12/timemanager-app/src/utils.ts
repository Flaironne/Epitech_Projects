import { Clock } from './interfaces';
import { useAuthStore } from './store/authStore';

const { currentUser } = useAuthStore();

function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Utiliser toLocaleString pour formater la date en fonction du fuseau horaire local
  const formattedDate = date.toLocaleString('default', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return formattedDate;
}

function calculateWorkedTimes(clocks: Clock[]): number {
  let totalSeconds = 0;
  let lastInTime: Date | null = null;

  clocks.forEach(clock => {
    const clockTime = new Date(clock.time).getTime() / 1000; // Convertir en secondes
    if (clock.status) {
      // Clock-in
      lastInTime = new Date(clock.time);
    } else if (lastInTime) {
      // Clock-out
      const clockOutTime = new Date(clock.time);
      totalSeconds += (clockOutTime.getTime() - lastInTime.getTime()) / 1000; // Ajouter la différence en secondes
      lastInTime = null;
    }
  });

  return totalSeconds;
}

function formatWorkedHours(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours} Hours ${formattedMinutes} Minutes ${formattedSeconds} Secondes`;
}

function formatWorkedHoursAlt(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
}

function canAccess(roles: string[]): boolean {
  return currentUser.value !== null && roles.includes(currentUser.value.role);
}

function formatInputTime(time: string): string {
  const date = new Date(time);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(date.getUTCDate()).padStart(2, '0');
  
  // Ajuste les heures et minutes pour le fuseau local
  const hours = String(date.getUTCHours() + date.getTimezoneOffset() / -60).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export { formatDate, calculateWorkedTimes, formatWorkedHours, formatWorkedHoursAlt, canAccess, formatInputTime };