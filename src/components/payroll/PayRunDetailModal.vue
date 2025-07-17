<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ payRun?.name }}</h2>
            <p class="text-sm text-gray-500">{{ payRun?.pay_run_number }}</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Status and Actions -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <span :class="getStatusClass(payRun?.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ getStatusLabel(payRun?.status) }}
            </span>
            <span class="text-sm text-gray-500">
              Created {{ formatDate(payRun?.created_at) }}
            </span>
          </div>
          
          <div class="flex gap-2">
            <button
              v-if="canCalculate"
              @click="calculate"
              :disabled="processing"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Calculate
            </button>
            <button
              v-if="canApprove"
              @click="approve"
              :disabled="processing"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Approve
            </button>
            <button
              v-if="canProcess"
              @click="process"
              :disabled="processing"
              class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Process
            </button>
            <button
              v-if="canFinalize"
              @click="finalize"
              :disabled="processing"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Finalize
            </button>
            <button
              v-if="canClose"
              @click="close"
              :disabled="processing"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm font-medium text-blue-700">Total Employees</div>
            <div class="text-2xl font-bold text-blue-900">{{ payRun?.employee_count || 0 }}</div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-sm font-medium text-green-700">Gross Salary</div>
            <div class="text-2xl font-bold text-green-900">{{ formatCurrency(payRun?.total_gross_salary) }}</div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="text-sm font-medium text-purple-700">Net Salary</div>
            <div class="text-2xl font-bold text-purple-900">{{ formatCurrency(payRun?.total_net_salary) }}</div>
          </div>
          
          <div class="bg-red-50 rounded-lg p-4">
            <div class="text-sm font-medium text-red-700">Total Deductions</div>
            <div class="text-2xl font-bold text-red-900">{{ formatCurrency(payRun?.total_deductions) }}</div>
          </div>
        </div>

        <!-- Pay Period Information -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Pay Period Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500">Period Start</div>
              <div class="text-lg text-gray-900">{{ formatDate(payRun?.pay_period_start) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Period End</div>
              <div class="text-lg text-gray-900">{{ formatDate(payRun?.pay_period_end) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Pay Date</div>
              <div class="text-lg text-gray-900">{{ formatDate(payRun?.pay_date) }}</div>
            </div>
          </div>
        </div>

        <!-- Workflow Information -->
        <div v-if="payRun?.workflow" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Workflow Status</h3>
          <div class="space-y-2">
            <div v-if="payRun.workflow.created_by" class="flex justify-between">
              <span class="text-sm text-gray-600">Created by:</span>
              <span class="text-sm font-medium">{{ payRun.workflow.created_by }} on {{ formatDate(payRun.workflow.created_at) }}</span>
            </div>
            <div v-if="payRun.workflow.approved_by" class="flex justify-between">
              <span class="text-sm text-gray-600">Approved by:</span>
              <span class="text-sm font-medium">{{ payRun.workflow.approved_by }} on {{ formatDate(payRun.workflow.approved_at) }}</span>
            </div>
            <div v-if="payRun.workflow.processed_by" class="flex justify-between">
              <span class="text-sm text-gray-600">Processed by:</span>
              <span class="text-sm font-medium">{{ payRun.workflow.processed_by }} on {{ formatDate(payRun.workflow.processed_at) }}</span>
            </div>
            <div v-if="payRun.workflow.finalized_by" class="flex justify-between">
              <span class="text-sm text-gray-600">Finalized by:</span>
              <span class="text-sm font-medium">{{ payRun.workflow.finalized_by }} on {{ formatDate(payRun.workflow.finalized_at) }}</span>
            </div>
            <div v-if="payRun.workflow.closed_by" class="flex justify-between">
              <span class="text-sm text-gray-600">Closed by:</span>
              <span class="text-sm font-medium">{{ payRun.workflow.closed_by }} on {{ formatDate(payRun.workflow.closed_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Employee List -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Employees in Pay Run</h3>
          
          <!-- Employee Filters -->
          <div class="mb-4 flex gap-4">
            <select v-model="employeeFilter" class="border border-gray-300 rounded-md p-2">
              <option value="">All Employees</option>
              <option value="included">Included Only</option>
              <option value="excluded">Excluded Only</option>
              <option value="error">Calculation Errors</option>
            </select>
            
            <input
              v-model="employeeSearch"
              type="text"
              placeholder="Search employees..."
              class="border border-gray-300 rounded-md p-2 flex-1"
            />
          </div>
          
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calculation</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="employee in filteredEmployees" :key="employee.uuid" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div>
                      <div class="font-medium text-gray-900">{{ employee.employee?.name }}</div>
                      <div class="text-sm text-gray-500">{{ employee.employee?.employee_id }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="employee.inclusion?.is_included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                          class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ employee.inclusion?.is_included ? 'Included' : 'Excluded' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getCalculationStatusClass(employee.calculation?.status)" 
                          class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ employee.calculation?.status_label }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ formatCurrency(employee.calculation?.calculated_gross) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ formatCurrency(employee.calculation?.calculated_net) }}
                  </td>
                  <td class="px-6 py-4">
                    {{ employee }}
                    <button
                      @click="viewEmployeeDetail(employee)"
                      class="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="payRun?.notes" class="bg-yellow-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Notes</h3>
          <p class="text-gray-700">{{ payRun.notes }}</p>
        </div>
      </div>
    </div>
    
    <!-- Employee Payroll Detail Modal -->
    <EmployeePayrollDetailModal
      v-if="showEmployeeDetailModal && selectedEmployee"
      :employee="selectedEmployee"
      :payRun="payRun"
      @close="closeEmployeeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import api from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'
import EmployeePayrollDetailModal from './EmployeePayrollDetailModal.vue'

const props = defineProps({
  payRun: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { showSuccess, showError } = useNotifications()

// Reactive data
const processing = ref(false)
const payRunDetails = ref(null)
const employeeFilter = ref('')
const employeeSearch = ref('')
const showEmployeeDetailModal = ref(false)
const selectedEmployee = ref(null)

// Computed properties
const filteredEmployees = computed(() => {
  if (!payRunDetails.value?.employees) return []
  
  let filtered = payRunDetails.value.employees
  
  // Filter by status
  if (employeeFilter.value === 'included') {
    filtered = filtered.filter(emp => emp.inclusion?.is_included)
  } else if (employeeFilter.value === 'excluded') {
    filtered = filtered.filter(emp => !emp.inclusion?.is_included)
  } else if (employeeFilter.value === 'error') {
    filtered = filtered.filter(emp => emp.calculation?.has_errors)
  }
  
  // Filter by search
  if (employeeSearch.value) {
    const search = employeeSearch.value.toLowerCase()
    filtered = filtered.filter(emp => 
      emp.employee?.name?.toLowerCase().includes(search) ||
      emp.employee?.employee_id?.toLowerCase().includes(search)
    )
  }
  
  return filtered
})

const canCalculate = computed(() => {
  return ['draft', 'error'].includes(props.payRun?.status)
})

const canApprove = computed(() => {
  return props.payRun?.status === 'calculated'
})

const canProcess = computed(() => {
  return props.payRun?.status === 'approved'
})

const canFinalize = computed(() => {
  return props.payRun?.status === 'processed'
})

const canClose = computed(() => {
  return props.payRun?.status === 'finalized'
})

// Methods
const loadPayRunDetails = async () => {
  try {
    const response = await api.get(`/pay-runs/${props.payRun.uuid}`)
    payRunDetails.value = response.data.data
  } catch (error) {
    showError('Failed to load pay run details')
    console.error('Error loading pay run details:', error)
  }
}

const calculate = async () => {
  if (!confirm('Calculate payroll for all employees in this pay run?')) return
  
  processing.value = true
  try {
    await api.post(`/pay-runs/${props.payRun.uuid}/calculate`)
    showSuccess('Pay run calculation started')
    await loadPayRunDetails()
    emit('updated')
  } catch (error) {
    showError('Failed to calculate pay run')
    console.error('Error calculating pay run:', error)
  } finally {
    processing.value = false
  }
}

const approve = async () => {
  if (!confirm('Approve this pay run for processing?')) return
  
  processing.value = true
  try {
    await api.post(`/pay-runs/${props.payRun.uuid}/approve`)
    showSuccess('Pay run approved successfully')
    await loadPayRunDetails()
    emit('updated')
  } catch (error) {
    showError('Failed to approve pay run')
    console.error('Error approving pay run:', error)
  } finally {
    processing.value = false
  }
}

const process = async () => {
  if (!confirm('Process this pay run? This will generate payslips and payment files.')) return
  
  processing.value = true
  try {
    await api.post(`/pay-runs/${props.payRun.uuid}/process`)
    showSuccess('Pay run processing started')
    await loadPayRunDetails()
    emit('updated')
  } catch (error) {
    showError('Failed to process pay run')
    console.error('Error processing pay run:', error)
  } finally {
    processing.value = false
  }
}

const finalize = async () => {
  if (!confirm('Finalize this pay run? This action cannot be undone.')) return
  
  processing.value = true
  try {
    await api.post(`/pay-runs/${props.payRun.uuid}/finalize`)
    showSuccess('Pay run finalized successfully')
    await loadPayRunDetails()
    emit('updated')
  } catch (error) {
    showError('Failed to finalize pay run')
    console.error('Error finalizing pay run:', error)
  } finally {
    processing.value = false
  }
}

const close = async () => {
  if (!confirm('Close this pay run and pay period? This action cannot be undone.')) return
  
  processing.value = true
  try {
    await api.post(`/pay-runs/${props.payRun.uuid}/close`)
    showSuccess('Pay run closed successfully')
    await loadPayRunDetails()
    emit('updated')
  } catch (error) {
    showError('Failed to close pay run')
    console.error('Error closing pay run:', error)
  } finally {
    processing.value = false
  }
}

const viewEmployeeDetail = (employee) => {
  selectedEmployee.value = employee
  showEmployeeDetailModal.value = true
}

const closeEmployeeDetailModal = () => {
  showEmployeeDetailModal.value = false
  selectedEmployee.value = null
}

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    calculating: 'bg-blue-100 text-blue-800',
    calculated: 'bg-green-100 text-green-800',
    approved: 'bg-purple-100 text-purple-800',
    processing: 'bg-orange-100 text-orange-800',
    processed: 'bg-indigo-100 text-indigo-800',
    finalized: 'bg-teal-100 text-teal-800',
    closed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    calculating: 'Calculating',
    calculated: 'Calculated',
    approved: 'Approved',
    processing: 'Processing',
    processed: 'Processed',
    finalized: 'Finalized',
    closed: 'Closed',
    error: 'Error'
  }
  return labels[status] || status
}

const getCalculationStatusClass = (status) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800',
    calculating: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    excluded: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadPayRunDetails()
})
</script>