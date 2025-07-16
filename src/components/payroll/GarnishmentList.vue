<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Garnishments</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ employee?.name || 'Employee' }} - Legal deductions and garnishments
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-700 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Garnishment
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search garnishments..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>

        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            v-model="filters.type"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">All Types</option>
            <option v-for="(label, value) in garnishmentTypes" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>

        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            v-model="filters.status"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="suspended">Suspended</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>

    <!-- Garnishments Grid -->
    <div v-else-if="filteredGarnishments.length > 0" class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="garnishment in filteredGarnishments"
          :key="garnishment.uuid"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                      getGarnishmentTypeColor(garnishment.type)
                    ]"
                  >
                    {{ garnishmentTypes[garnishment.type] || garnishment.type }}
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(garnishment.status)
                    ]"
                  >
                    {{ getStatusLabel(garnishment.status) }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ garnishment.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Code: {{ garnishment.code }}
                </p>
                <p v-if="garnishment.court_order" class="text-sm text-gray-600 dark:text-gray-400">
                  Court Order: {{ garnishment.court_order }}
                </p>
                <p v-if="garnishment.authority" class="text-sm text-gray-600 dark:text-gray-400">
                  Authority: {{ garnishment.authority }}
                </p>
              </div>
              <div class="relative">
                <button
                  @click="toggleDropdown(garnishment.uuid)"
                  class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <EllipsisVerticalIcon class="w-5 h-5" />
                </button>
                <div
                  v-if="activeDropdown === garnishment.uuid"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600"
                >
                  <div class="py-1">
                    <button
                      @click="editGarnishment(garnishment)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Edit Garnishment
                    </button>
                    <button
                      @click="viewHistory(garnishment)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      View History
                    </button>
                    <button
                      v-if="garnishment.status === 'active'"
                      @click="suspendGarnishment(garnishment)"
                      class="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Suspend
                    </button>
                    <button
                      v-if="garnishment.status === 'suspended'"
                      @click="activateGarnishment(garnishment)"
                      class="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Activate
                    </button>
                    <button
                      @click="deleteGarnishment(garnishment)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Priority:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ garnishment.priority || 'N/A' }}
                </span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Method:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ formatCalculationMethod(garnishment.calculation_method) }}
                </span>
              </div>
              
              <div v-if="garnishment.amount" class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Amount:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ formatCurrency(garnishment.amount) }}
                </span>
              </div>
              
              <div v-if="garnishment.percentage" class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Percentage:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ garnishment.percentage }}%
                </span>
              </div>
              
              <div v-if="garnishment.maximum_percentage" class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Max %:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ garnishment.maximum_percentage }}%
                </span>
              </div>
            </div>

            <!-- Progress Bar for Total Amount Garnishments -->
            <div v-if="garnishment.total_amount && garnishment.total_amount > 0" class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">Progress:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ formatCurrency(garnishment.amount_garnished) }} / {{ formatCurrency(garnishment.total_amount) }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-red-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${getProgressPercentage(garnishment)}%` }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ getProgressPercentage(garnishment) }}% complete
              </div>
            </div>

            <!-- Date Information -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div v-if="garnishment.start_date">
                  <span class="text-gray-600 dark:text-gray-400">Start:</span>
                  <span class="text-gray-900 dark:text-white font-medium ml-1">
                    {{ formatDate(garnishment.start_date) }}
                  </span>
                </div>
                <div v-if="garnishment.end_date">
                  <span class="text-gray-600 dark:text-gray-400">End:</span>
                  <span class="text-gray-900 dark:text-white font-medium ml-1">
                    {{ formatDate(garnishment.end_date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <ScaleIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No garnishments found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ searchQuery || filters.type || filters.status ? 'No garnishments match your filters.' : 'No garnishments have been set up for this employee.' }}
      </p>
      <div class="mt-6">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Garnishment
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <GarnishmentModal
      v-if="showCreateModal || showEditModal"
      :is-open="showCreateModal || showEditModal"
      :garnishment="editingGarnishment"
      :employee-uuid="employeeUuid"
      @close="closeModal"
      @saved="handleGarnishmentSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import {
  PlusIcon,
  ScaleIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import GarnishmentModal from './GarnishmentModal.vue'

const props = defineProps({
  employeeUuid: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['garnishment-updated'])

const { get, post, delete: deleteRequest } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const garnishments = ref([])
const employee = ref(null)
const garnishmentTypes = ref({})
const searchQuery = ref('')
const filters = ref({
  type: '',
  status: ''
})

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingGarnishment = ref(null)

// Dropdown state
const activeDropdown = ref(null)

// Computed
const filteredGarnishments = computed(() => {
  let filtered = garnishments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(garnishment =>
      garnishment.name.toLowerCase().includes(query) ||
      garnishment.code.toLowerCase().includes(query) ||
      garnishment.court_order?.toLowerCase().includes(query) ||
      garnishment.authority?.toLowerCase().includes(query)
    )
  }

  if (filters.value.type) {
    filtered = filtered.filter(garnishment => garnishment.type === filters.value.type)
  }

  if (filters.value.status) {
    filtered = filtered.filter(garnishment => garnishment.status === filters.value.status)
  }

  return filtered
})

// Methods
const fetchGarnishments = async () => {
  try {
    loading.value = true
    const response = await get(`/employees/${props.employeeUuid}/garnishments`)
    garnishments.value = response.data.data
    employee.value = response.data.employee
  } catch (error) {
    showNotification('Error fetching garnishments', 'error')
    console.error('Error fetching garnishments:', error)
  } finally {
    loading.value = false
  }
}

const fetchOptions = async () => {
  try {
    const response = await get('/garnishments/options')
    garnishmentTypes.value = response.data.data.garnishment_types
  } catch (error) {
    showNotification('Error fetching options', 'error')
  }
}

const toggleDropdown = (garnishmentId) => {
  activeDropdown.value = activeDropdown.value === garnishmentId ? null : garnishmentId
}

const editGarnishment = (garnishment) => {
  editingGarnishment.value = garnishment
  showEditModal.value = true
  activeDropdown.value = null
}

const suspendGarnishment = async (garnishment) => {
  if (!confirm(`Are you sure you want to suspend "${garnishment.name}"?`)) {
    return
  }

  try {
    await post(`/garnishments/${garnishment.uuid}/suspend`)
    showNotification('Garnishment suspended successfully', 'success')
    fetchGarnishments()
  } catch (error) {
    showNotification('Error suspending garnishment', 'error')
  }
  activeDropdown.value = null
}

const activateGarnishment = async (garnishment) => {
  try {
    await post(`/garnishments/${garnishment.uuid}/activate`)
    showNotification('Garnishment activated successfully', 'success')
    fetchGarnishments()
  } catch (error) {
    showNotification('Error activating garnishment', 'error')
  }
  activeDropdown.value = null
}

const deleteGarnishment = async (garnishment) => {
  if (!confirm(`Are you sure you want to delete "${garnishment.name}"? This action cannot be undone.`)) {
    return
  }

  try {
    await deleteRequest(`/garnishments/${garnishment.uuid}`)
    showNotification('Garnishment deleted successfully', 'success')
    fetchGarnishments()
  } catch (error) {
    showNotification('Error deleting garnishment', 'error')
  }
  activeDropdown.value = null
}

const viewHistory = (garnishment) => {
  // TODO: Implement history view
  showNotification('History view coming soon', 'info')
  activeDropdown.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingGarnishment.value = null
}

const handleGarnishmentSaved = () => {
  closeModal()
  fetchGarnishments()
  emit('garnishment-updated')
}

// Utility functions
const getGarnishmentTypeColor = (type) => {
  const colors = {
    'child_support': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'tax_levy': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'wage_garnishment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'student_loan': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'bankruptcy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[type] || colors.other
}

const getStatusColor = (status) => {
  const colors = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'pending_approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'suspended': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[status] || colors.cancelled
}

const getStatusLabel = (status) => {
  const labels = {
    'active': 'Active',
    'pending_approval': 'Pending Approval',
    'suspended': 'Suspended',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const formatCalculationMethod = (method) => {
  const methods = {
    'fixed_amount': 'Fixed Amount',
    'percentage_of_salary': 'Percentage of Disposable Income',
    'percentage_of_basic': 'Percentage of Basic Salary',
    'formula': 'Formula Based',
    'manual': 'Manual Entry'
  }
  return methods[method] || method
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getProgressPercentage = (garnishment) => {
  if (!garnishment.total_amount || garnishment.total_amount === 0) return 0
  return Math.min(100, Math.round((garnishment.amount_garnished / garnishment.total_amount) * 100))
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  fetchGarnishments()
  fetchOptions()
  document.addEventListener('click', handleClickOutside)
})
</script>