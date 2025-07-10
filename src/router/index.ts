import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Employees from '@/views/Employees.vue'
import Payroll from '@/views/Payroll.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          icon: 'home'
        }
      },
      {
        path: '/employees',
        name: 'Employees',
        component: Employees,
        meta: {
          title: 'Employees',
          icon: 'users'
        }
      },
      {
        path: '/payroll',
        name: 'Payroll',
        component: Payroll,
        meta: {
          title: 'Payroll',
          icon: 'credit-card'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
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
  // Set page title
  const title = to.meta?.title ? `${to.meta.title} | StaffX` : 'StaffX'
  document.title = title

  next()
})

export default router
