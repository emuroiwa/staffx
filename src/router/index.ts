import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Employees from '@/views/Employees.vue'
import Payroll from '@/views/Payroll.vue'
import CompaniesView from '@/views/CompaniesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import EmailVerificationView from '@/views/auth/EmailVerificationView.vue'

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
      },
      {
        path: 'email/verify/:id/:hash',
        name: 'EmailVerification',
        component: EmailVerificationView,
        meta: {
          title: 'Email Verification',
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
      },
      {
        path: 'payroll',
        name: 'EmployeePayroll',
        component: () => import('@/pages/employees/EmployeePayrollManagement.vue'),
        meta: {
          title: 'Employee Payroll Management',
          icon: 'currency-dollar',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected positions routes
  {
    path: '/positions',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Positions',
        component: () => import('@/pages/positions/PositionList.vue'),
        meta: {
          title: 'Positions',
          icon: 'briefcase',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected departments routes
  {
    path: '/departments',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Departments',
        component: () => import('@/pages/departments/DepartmentList.vue'),
        meta: {
          title: 'Departments',
          icon: 'building-office',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected organogram routes
  {
    path: '/organogram',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Organogram',
        component: () => import('@/pages/organogram/OrganogramView.vue'),
        meta: {
          title: 'Organogram',
          icon: 'chart-bar',
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
          title: 'Payroll Processing',
          icon: 'credit-card',
          requiresAuth: true
        }
      },
      {
        path: 'templates',
        name: 'PayrollTemplates',
        component: () => import('@/pages/payroll/PayrollTemplateList.vue'),
        meta: {
          title: 'Payroll Templates',
          icon: 'file-text',
          requiresAuth: true
        }
      },
      {
        path: 'employee-items',
        name: 'EmployeePayrollItems',
        component: () => import('@/pages/payroll/EmployeePayrollItemList.vue'),
        meta: {
          title: 'Employee Items',
          icon: 'user',
          requiresAuth: true
        }
      },
      {
        path: 'reports',
        name: 'PayrollReports',
        component: () => import('@/views/PayrollReports.vue'),
        meta: {
          title: 'Payroll Reports',
          icon: 'bar-chart-3',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected companies routes (HCA only)
  {
    path: '/companies',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Companies',
        component: CompaniesView,
        meta: {
          title: 'Companies',
          icon: 'building-office',
          requiresAuth: true,
          requiresHCA: true
        }
      }
    ]
  },

  // Protected profile routes
  {
    path: '/profile',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Profile',
        component: ProfileView,
        meta: {
          title: 'Profile',
          icon: 'user',
          requiresAuth: true
        }
      }
    ]
  },

  // Protected settings routes
  {
    path: '/settings',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Settings',
        component: SettingsView,
        meta: {
          title: 'Settings',
          icon: 'settings',
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  const title = to.meta?.title ? `${to.meta.title} | StaffX` : 'StaffX'
  document.title = title

  // Initialize auth if not already initialized
  if (!authStore.isAuthenticated && localStorage.getItem('authToken')) {
    await authStore.initializeAuth()
  }

  // Check authentication requirements
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresHCA = to.matched.some(record => record.meta.requiresHCA)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if authentication is required
    next('/auth/login')
  } else if (requiresGuest && isAuthenticated) {
    // Redirect to dashboard if guest route but user is authenticated
    next('/dashboard')
  } else if (requiresHCA && !authStore.isHoldingCompanyAdmin) {
    // Redirect to dashboard if HCA route but user is not HCA
    next('/dashboard')
  } else {
    next()
  }
})

export default router
