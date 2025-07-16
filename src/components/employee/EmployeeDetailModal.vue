<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ employee.display_name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Employee ID: {{ employee.employee_id }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="!isEditing" class="space-y-8">
          <!-- Employee Info Header -->
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {{ getInitials(employee.first_name, employee.last_name) }}
              </span>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ employee.display_name }}</h2>
              <p class="text-lg text-gray-600 dark:text-gray-300">{{ employee.position?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ employee.department?.name }}</p>
              <div class="mt-2">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusBadgeClass(employee.status)"
                >
                  {{ formatStatus(employee.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Information Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Basic Information</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.phone || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(employee.dob) || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.address || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Employment Details</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Employment Type</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatEmploymentType(employee.employment_type) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(employee.start_date) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Hire Date</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(employee.hire_date) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Manager</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.manager?.display_name || 'No Manager' }}</p>
                </div>
              </div>
            </div>

            <!-- Compensation -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Compensation</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.formatted_salary || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Pay Frequency</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatPayFrequency(employee.pay_frequency) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Number</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.tax_number || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Additional Information</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">National ID</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.national_id || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact</label>
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ employee.emergency_contact_name || 'N/A' }}
                    <span v-if="employee.emergency_contact_phone" class="text-gray-600 dark:text-gray-300">
                      ({{ employee.emergency_contact_phone }})
                    </span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ employee.notes || 'No notes' }}</p>
                </div>
              </div>
            </div>

            <!-- Garnishments -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Garnishments</h3>
                <button
                  @click="showGarnishmentModal = true"
                  class="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <ScaleIcon class="w-3 h-3 mr-1" />
                  Manage
                </button>
              </div>
              <div v-if="garnishments.length > 0" class="space-y-2">
                <div 
                  v-for="garnishment in garnishments" 
                  :key="garnishment.uuid"
                  class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-orange-800 dark:text-orange-200">
                        {{ garnishment.name }}
                      </span>
                      <span class="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-1 rounded">
                        {{ getGarnishmentTypeLabel(garnishment.type) }}
                      </span>
                      <span 
                        :class="[
                          'text-xs px-2 py-1 rounded-full',
                          garnishment.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          garnishment.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        ]"
                      >
                        {{ garnishment.status }}
                      </span>
                    </div>
                    <div class="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Priority: {{ garnishment.priority_order || 'N/A' }}
                      <span v-if="garnishment.court_order_number" class="ml-2">
                        • Court Order: {{ garnishment.court_order_number }}
                      </span>
                    </div>
                  </div>
                  <div class="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {{ formatCurrency(garnishment.amount || 0) }}
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No garnishments configured
              </div>
            </div>
          </div>

          <!-- Employment Flags -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Employment Flags</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.is_director" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">Director</span>
              </div>
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.is_independent_contractor" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">Independent Contractor</span>
              </div>
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.is_uif_exempt" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">UIF Exempt</span>
              </div>
            </div>
          </div>

          <!-- Benefits -->
          <div v-if="employee.benefits" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Benefits</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.benefits.health_insurance" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">Health Insurance</span>
              </div>
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.benefits.dental_insurance" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">Dental Insurance</span>
              </div>
              <div class="flex items-center">
                <CheckCircleIcon v-if="employee.benefits.retirement_plan" class="w-5 h-5 text-green-500 mr-2" />
                <XCircleIcon v-else class="w-5 h-5 text-gray-300 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">Retirement Plan</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form (when editing) -->
        <div v-else>
          <EmployeeEditForm
            :employee="employee"
            @updated="handleEmployeeUpdated"
            @cancelled="isEditing = false"
          />
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Created: {{ formatDate(employee.created_at) }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Updated: {{ formatDate(employee.updated_at) }}
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="$emit('close')"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
          <button
            v-if="!isEditing"
            @click="isEditing = true"
            type="button"
            class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            <PencilIcon class="w-4 h-4 mr-2" />
            Edit Employee
          </button>
        </div>
      </div>
    </div>

    <!-- Garnishment Management Modal -->
    <div v-if="showGarnishmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Garnishment Management - {{ employee.display_name }}
          </h3>
          <button
            @click="showGarnishmentModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6">
          <GarnishmentList
            :employee-uuid="employee.uuid"
            @garnishment-updated="fetchGarnishments"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EmployeeEditForm from './EmployeeEditForm.vue'
import { useTheme } from '@/composables/useTheme'
import { useApi } from '@/composables/useApi'
import { formatCurrency } from '@/utils/currency'
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline'
import GarnishmentList from '@/components/payroll/GarnishmentList.vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { isDark } = useTheme()
const { get } = useApi()
const isEditing = ref(false)
const showGarnishmentModal = ref(false)
const garnishments = ref([])
const garnishmentTypes = ref({})

// Methods
const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'terminated':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toLocaleDateString()
}

const formatEmploymentType = (type) => {
  const types = {
    'full_time': 'Full Time',
    'part_time': 'Part Time',
    'contract': 'Contract',
    'intern': 'Intern'
  }
  return types[type] || type
}

const formatPayFrequency = (frequency) => {
  const frequencies = {
    'weekly': 'Weekly',
    'bi_weekly': 'Bi-weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'annually': 'Annually'
  }
  return frequencies[frequency] || frequency
}

const fetchGarnishments = async () => {
  try {
    const response = await get(`/employees/${props.employee.uuid}/garnishments`)
    garnishments.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching garnishments:', error)
  }
}

const fetchGarnishmentTypes = async () => {
  try {
    const response = await get('/garnishments/options')
    garnishmentTypes.value = response.data.data.garnishment_types || {}
  } catch (error) {
    console.error('Error fetching garnishment types:', error)
  }
}

const getGarnishmentTypeLabel = (type) => {
  return garnishmentTypes.value[type] || type
}

const handleEmployeeUpdated = (updatedEmployee) => {
  isEditing.value = false
  emit('updated', updatedEmployee)
}

onMounted(() => {
  fetchGarnishments()
  fetchGarnishmentTypes()
})
</script>