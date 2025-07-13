export default [
  {
    path: '/employees',
    name: 'EmployeeList',
    component: () => import('@/pages/employees/EmployeeList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Employees'
    }
  },
  {
    path: '/positions',
    name: 'PositionList',
    component: () => import('@/pages/positions/PositionList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Positions'
    }
  },
  {
    path: '/departments',
    name: 'DepartmentList',
    component: () => import('@/pages/departments/DepartmentList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Departments'
    }
  },
  {
    path: '/organogram',
    name: 'Organogram',
    component: () => import('@/pages/organogram/OrganogramView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Organogram'
    }
  }
]