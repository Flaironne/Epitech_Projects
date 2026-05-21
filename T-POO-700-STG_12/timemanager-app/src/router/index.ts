import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import User from '../components/User.vue'
import WorkingTimes from '../components/WorkingTimes.vue'
import ChartManager from '../components/ChartManager.vue'
import ClockManager from '../components/ClockManager.vue'
import Register from '../components/Register.vue'
import EditUser from '../components/EditUser.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import { useAuthStore } from '../store/authStore'

const dashboardRoutes = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: 'users',
    name: 'User',
    component: User,
    meta: { requiresRole: ['manager', 'admin'] }
  },
  {
    path: 'edit-user',
    name: 'EditUser',
    component: EditUser
  },
  {
    path: 'workingtimes',
    name: 'WorkingTimes',
    component: WorkingTimes,
  },
  {
    path: 'clocks',
    name: 'ClockManager',
    component: ClockManager
  },
  {
    path: 'charts',
    name: 'ChartManager',
    component: ChartManager
  }
]

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Signup',
    component: Register
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    children: dashboardRoutes,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Ajoutez une garde de navigation globale
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLogged = authStore.isLogged.value;
  const currentUser = authStore.currentUser.value;

  if (to.matched.some(record => record.meta.requiresAuth) && !isLogged) {
    next('/login');
  } else if (to.matched.some(record => record.meta.requiresRole)) {
    const requiredRoles = to.meta.requiresRole as string[];
    if (currentUser && currentUser.role && requiredRoles.includes(currentUser.role)) {
      next();
    } else {
      next('/home'); // Ou redirigez vers une autre page si l'utilisateur n'a pas les permissions nécessaires
    }
  } else {
    next();
  }
})

export default router