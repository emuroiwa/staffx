<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Positions</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage organizational positions and roles</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Position
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BriefcaseIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Positions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ positions?.length || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Positions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activePositions }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Filled Positions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ filledPositions }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                id="search"
                placeholder="Search positions..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchPositions"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Position Cards -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="positions && positions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="position in positions"
          :key="position.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ position.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ position.description || 'No description' }}</p>
              
              <div class="mt-4 space-y-2">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon class="w-4 h-4 mr-2" />
                  {{ position.employees_count || 0 }} employees
                </div>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon class="w-4 h-4 mr-2" />
                  Created {{ formatDate(position.created_at) }}
                </div>
              </div>

              <div class="mt-4">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusBadgeClass(position.is_active)"
                >
                  {{ position.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="viewPosition(position)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                title="View"
              >
                <EyeIcon class="w-4 h-4" />
              </button>
              <button
                @click="editPosition(position)"
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                title="Edit"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                @click="deletePosition(position)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                title="Delete"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BriefcaseIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No positions found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new position.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Position
          </button>
        </div>
      </div>
    </div>

    <!-- Create Position Modal -->
    <PositionCreateModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePositionCreated"
    />

    <!-- Position Detail Modal -->
    <PositionDetailModal
      v-if="selectedPosition && showDetailModal"
      :position="selectedPosition"
      @close="showDetailModal = false"
      @updated="handlePositionUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'
import PositionCreateModal from '@/components/position/PositionCreateModal.vue'
import PositionDetailModal from '@/components/position/PositionDetailModal.vue'
import {
  BriefcaseIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()

// Component state
const loading = ref(false)
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedPosition = ref(null)

// Data
const positions = ref([])

// Filters
const filters = reactive({
  search: '',
  status: '',
  page: 1,
  per_page: 50
})

// Computed
const activePositions = computed(() => {
  return positions.value?.filter(pos => pos.is_active).length || 0
})

const filledPositions = computed(() => {
  return positions.value?.filter(pos => pos.employees_count > 0).length || 0
})

// Methods
const fetchPositions = async () => {
  loading.value = true
  try {
    const response = await employeeStore.fetchPositions(filters)
    positions.value = response.data
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to fetch positions'
    })
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  filters.page = 1
  fetchPositions()
}, 300)

const viewPosition = (position) => {
  selectedPosition.value = position
  showDetailModal.value = true
}

const editPosition = (position) => {
  selectedPosition.value = position
  showDetailModal.value = true
}

const deletePosition = async (position) => {
  if (confirm(`Are you sure you want to delete "${position.name}"?`)) {
    try {
      await employeeStore.deletePosition(position.id)
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Position deleted successfully'
      })
      fetchPositions()
    } catch (error) {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete position'
      })
    }
  }
}

const handlePositionCreated = () => {
  showCreateModal.value = false
  fetchPositions()
  notificationStore.addNotification({
    type: 'success',
    title: 'Success',
    message: 'Position created successfully'
  })
}

const handlePositionUpdated = () => {
  showDetailModal.value = false
  fetchPositions()
  notificationStore.addNotification({
    type: 'success',
    title: 'Success',
    message: 'Position updated successfully'
  })
}

// Utility functions
const getStatusBadgeClass = (isActive) => {
  return isActive 
    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchPositions()
})
</script>