<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Employees
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team members and their information.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button
          @click="exportEmployees"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Download class="w-4 h-4 mr-2 inline" />
          Export
        </button>
        <button
          @click="showAddEmployeeModal = true"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <Plus class="w-4 h-4 mr-2 inline" />
          Add Employee
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search employees..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedDepartment"
            class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>

          <select
            v-model="selectedRole"
            class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>

          <button
            @click="clearFilters"
            v-if="hasActiveFilters"
            class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                v-for="column in tableColumns"
                :key="column.key"
                @click="column.sortable && sortBy(column.key)"
                :class="[
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                  column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''
                ]"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <template v-if="column.sortable">
                    <ChevronUp v-if="sortConfig.key === column.key && sortConfig.direction === 'asc'" class="w-4 h-4" />
                    <ChevronDown v-else-if="sortConfig.key === column.key && sortConfig.direction === 'desc'" class="w-4 h-4" />
                    <ArrowUpDown v-else class="w-4 h-4 opacity-50" />
                  </template>
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="employee in paginatedEmployees"
              :key="employee.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="employee.avatar"
                    :alt="employee.name"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ employee.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ employee.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.department }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.role }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(employee.joiningDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  employee.level === 'Full-Time' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  employee.level === 'Part-Time' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                ]">
                  {{ employee.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewEmployee(employee)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="editEmployee(employee)"
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteEmployee(employee)"
                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredEmployees.length }} employees
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Employee Modal -->
    <teleport to="body">
      <div
        v-if="showAddEmployeeModal"
        @click.self="showAddEmployeeModal = false"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Employee
              </h2>
              <button
                @click="showAddEmployeeModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="addEmployee" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    v-model="newEmployee.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    v-model="newEmployee.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    v-model="newEmployee.department"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    <option v-for="dept in departments" :key="dept" :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    v-model="newEmployee.role"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    v-model="newEmployee.level"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Joining Date
                  </label>
                  <input
                    v-model="newEmployee.joiningDate"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="showAddEmployeeModal = false"
                  class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from 'lucide-vue-next'

// Reactive state
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showAddEmployeeModal = ref(false)

// Sort configuration
const sortConfig = reactive({
  key: '',
  direction: 'asc'
})

// New employee form
const newEmployee = reactive({
  name: '',
  email: '',
  department: '',
  role: '',
  level: '',
  joiningDate: ''
})

// Table columns
const tableColumns = [
  { key: 'name', label: 'Employee', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'joiningDate', label: 'Joining Date', sortable: true },
  { key: 'level', label: 'Type', sortable: true }
]

// Sample employee data
const employees = ref([
  {
    id: 1,
    name: 'Lea Simo',
    email: 'lea.simo@staffx.com',
    department: 'Product',
    role: 'UX/UI Designer',
    level: 'Full-Time',
    joiningDate: '2025-03-23',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Bessie Cooper',
    email: 'bessie.cooper@staffx.com',
    department: 'Developer',
    role: 'Front End Dev',
    level: 'Full-Time',
    joiningDate: '2025-02-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Floyd Miles',
    email: 'floyd.miles@staffx.com',
    department: 'Ops',
    role: 'Human Resource',
    level: 'Freelance',
    joiningDate: '2025-02-28',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4,
    name: 'Jacob Jones',
    email: 'jacob.jones@staffx.com',
    department: 'Developer',
    role: 'Back End Dev',
    level: 'Internship',
    joiningDate: '2025-01-04',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 5,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@staffx.com',
    department: 'Marketing',
    role: 'Marketing Manager',
    level: 'Full-Time',
    joiningDate: '2024-12-15',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6,
    name: 'Michael Brown',
    email: 'michael.brown@staffx.com',
    department: 'Finance',
    role: 'Financial Analyst',
    level: 'Part-Time',
    joiningDate: '2024-11-08',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
])

// Computed properties
const departments = computed(() => {
  return [...new Set(employees.value.map(emp => emp.department))]
})

const roles = computed(() => {
  return [...new Set(employees.value.map(emp => emp.role))]
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedDepartment.value || selectedRole.value
})

const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query)
    )
  }

  // Apply department filter
  if (selectedDepartment.value) {
    filtered = filtered.filter(emp => emp.department === selectedDepartment.value)
  }

  // Apply role filter
  if (selectedRole.value) {
    filtered = filtered.filter(emp => emp.role === selectedRole.value)
  }

  // Apply sorting
  if (sortConfig.key) {
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      if (sortConfig.key === 'joiningDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredEmployees.value.length)
})

const paginatedEmployees = computed(() => {
  return filteredEmployees.value.slice(startIndex.value, endIndex.value)
})

// Methods
function sortBy(key) {
  if (sortConfig.key === key) {
    sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.key = key
    sortConfig.direction = 'asc'
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedDepartment.value = ''
  selectedRole.value = ''
  currentPage.value = 1
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function exportEmployees() {
  console.log('Exporting employees...')
  // Implement export functionality
}

function viewEmployee(employee) {
  console.log('Viewing employee:', employee)
  // Implement view employee details
}

function editEmployee(employee) {
  console.log('Editing employee:', employee)
  // Implement edit employee functionality
}

function deleteEmployee(employee) {
  if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
    const index = employees.value.findIndex(emp => emp.id === employee.id)
    if (index > -1) {
      employees.value.splice(index, 1)
    }
  }
}

function addEmployee() {
  const employee = {
    id: employees.value.length + 1,
    ...newEmployee,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
  }
  
  employees.value.unshift(employee)
  
  // Reset form
  Object.keys(newEmployee).forEach(key => {
    newEmployee[key] = ''
  })
  
  showAddEmployeeModal.value = false
  
  console.log('Employee added:', employee)
}

// Reset current page when filters change
function resetPagination() {
  currentPage.value = 1
}

// Watch for filter changes
onMounted(() => {
  // Any initialization logic
})
</script>