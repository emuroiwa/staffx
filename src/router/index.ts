import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Employees from '@/views/Employees.vue'
import Payroll from '@/views/Payroll.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

const routes = [
  // Redirect root to login
  {
    path: '/',
    redirect: '/auth/login'
  },

  // Authentication routes
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: {
          title: 'Sign In',
          requiresGuest: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
        meta: {
          title: 'Sign Up',
          requiresGuest: true
        }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView,
        meta: {
          title: 'Forgot Password',
          requiresGuest: true
        }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPasswordView,
        meta: {
          title: 'Reset Password',
          requiresGuest: true
        }
      }
    ]
  },

  // Protected dashboard routes
  {
    path: '/dashboard',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          icon: 'home',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected employee routes
  {
    path: '/employees',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Employees',
        component: Employees,
        meta: {
          title: 'Employees',
          icon: 'users',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected payroll routes
  {
    path: '/payroll',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Payroll',
        component: Payroll,
        meta: {
          title: 'Payroll',
          icon: 'credit-card',
          requiresAuth: true
        }
      }
    ]
  },

  // Catch all - redirect to login
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  const title = to.meta?.title ? `${to.meta.title} | StaffX` : 'StaffX'
  document.title = title

  // Check authentication requirements
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if authentication is required
    next('/auth/login')
  } else if (requiresGuest && isAuthenticated) {
    // Redirect to dashboard if guest route but user is authenticated
    next('/dashboard')
  } else {
    next()
  }
})

export default router
