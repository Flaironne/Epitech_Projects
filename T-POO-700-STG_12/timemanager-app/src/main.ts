import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { ref, watch } from 'vue';

import 'primeicons/primeicons.css';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToggleSwitch from 'primevue/toggleswitch';
import DatePicker from 'primevue/datepicker';
import PrimeVue from 'primevue/config';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select';
import { Fetch } from './api/fetch';

import Noir from './presets';
import Aura from '@primevue/themes/aura';

const app = createApp(App)

app.component('Card', Card)
app.component('Panel', Panel)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Message', Message)
app.component('DatePicker', DatePicker)
app.component('Dialog', Dialog)
app.component('FloatLabel', FloatLabel)
app.component('Select', Select)

app.use(router)

const { darkMode, initializeDarkMode } = useThemeStore();
initializeDarkMode();

const authStore = useAuthStore();
authStore.initializeAuth();

app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: darkMode,
            cssLayer: false
        }
    }
 });

 window.addEventListener('online', () => {
    Fetch.syncOfflineRequests();
  });

app.mount('#app')