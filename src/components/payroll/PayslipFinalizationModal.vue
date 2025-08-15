<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Finalize Payslips
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Review and finalize payslips for {{ employeeUuids.length }} selected employees
        </p>
      </div>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Loading payslip data...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error loading payslip data
              </h3>
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Payslip Preview -->
        <div v-else-if="payslipPreview.length > 0" class="space-y-6">
          <!-- Summary -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">
              Finalization Summary
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ payslipPreview.length }}
                </div>
                <div class="text-sm text-blue-700 dark:text-blue-300">Total Payslips</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ finalizableCount }}
                </div>
                <div class="text-sm text-green-700 dark:text-green-300">Ready to Finalize</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ alreadyFinalizedCount }}
                </div>
                <div class="text-sm text-yellow-700 dark:text-yellow-300">Already Finalized</div>
              </div>
            </div>
          </div>

          <!-- Payslip Details -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Payslip Details
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div 
                v-for="payslip in payslipPreview" 
                :key="payslip.payroll_uuid"
                class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ payslip.employee.name }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ payslip.employee.employee_id }} • {{ payslip.employee.pay_frequency }}
                    </p>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(payslip.payslip_status)"
                  >
                    {{ payslip.payslip_status }}
                  </span>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Period:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ formatDate(payslip.payroll_summary.period_start) }} - 
                      {{ formatDate(payslip.payroll_summary.period_end) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Gross Salary:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ payslip.payroll_summary.currency }}{{ payslip.payroll_summary.gross_salary }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Deductions:</span>
                    <span class="text-red-600 dark:text-red-400">
                      -{{ payslip.payroll_summary.currency }}{{ payslip.payroll_summary.total_deductions }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm font-medium border-t pt-2">
                    <span class="text-gray-900 dark:text-white">Net Salary:</span>
                    <span class="text-green-600 dark:text-green-400">
                      {{ payslip.payroll_summary.currency }}{{ payslip.payroll_summary.net_salary }}
                    </span>
                  </div>
                </div>

                <!-- Payroll Items -->
                <div v-if="payslip.payroll_items.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payroll Items ({{ payslip.payroll_items.length }})
                  </h5>
                  <div class="space-y-1">
                    <div 
                      v-for="item in payslip.payroll_items.slice(0, 3)" 
                      :key="item.name"
                      class="flex justify-between text-xs"
                    >
                      <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
                      <span 
                        :class="item.type === 'deduction' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                      >
                        {{ item.type === 'deduction' ? '-' : '+' }}{{ payslip.payroll_summary.currency }}{{ item.amount }}
                      </span>
                    </div>
                    <div v-if="payslip.payroll_items.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
                      +{{ payslip.payroll_items.length - 3 }} more items
                    </div>
                  </div>
                </div>

                <!-- Individual Finalize Action -->
                <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    v-if="payslip.can_finalize"
                    @click="finalizeSinglePayslip(payslip)"
                    :disabled="processing"
                    class="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span v-if="processing && processingPayslip === payslip.payroll_uuid" class="flex items-center justify-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Finalizing...
                    </span>
                    <span v-else>
                      Finalize This Payslip
                    </span>
                  </button>
                  <div v-else class="text-center py-2">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ payslip.payslip_status === 'finalized' ? 'Already finalized' : 'Cannot finalize' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center py-12">
          <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No payslip data available
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Unable to load payslip data for the selected employees.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ finalizableCount }} payslips ready for finalization
          </div>
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="finalizePayslips"
              :disabled="processing || finalizableCount === 0"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="processing" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finalizing...
              </span>
              <span v-else>
                Finalize {{ finalizableCount }} Payslips
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  DocumentIcon 
} from '@heroicons/vue/24/outline'
import { payslipApi } from '@/services/payslipApi'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  employeeUuids: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'finalized'])

const { showNotification } = useNotifications()

// State
const loading = ref(false)
const processing = ref(false)
const processingPayslip = ref(null)
const error = ref(null)
const payslipPreview = ref([])

// Computed
const finalizableCount = computed(() => {
  return payslipPreview.value.filter(p => p.can_finalize).length
})

const alreadyFinalizedCount = computed(() => {
  return payslipPreview.value.filter(p => p.payslip_status === 'finalized').length
})

// Methods
const loadPayslipPreview = async () => {
  if (!props.employeeUuids.length) return

  try {
    loading.value = true
    error.value = null
    
    // Convert employee UUIDs to payroll UUIDs
    // First, get the payroll UUIDs for the selected employees
    const payrollUuids = await getPayrollUuidsForEmployees(props.employeeUuids)
    
    if (payrollUuids.length === 0) {
      error.value = 'No payroll records found for selected employees'
      return
    }
    
    const response = await payslipApi.getFinalizationPreview(payrollUuids)
    payslipPreview.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load payslip preview'
    console.error('Error loading payslip preview:', err)
  } finally {
    loading.value = false
  }
}

const getPayrollUuidsForEmployees = async (employeeUuids) => {
  try {
    // Get payroll records for the selected employees
    const response = await payslipApi.getPayrollsByEmployees(employeeUuids)
    console.log('Payrolls for employees:', response.data.data);
    
    // The API returns paginated results, so we need to get the data array
    const payrolls = response.data.data || []
    
    // Extract UUIDs from the payroll records
    return payrolls.map(payroll => payroll.uuid)
  } catch (err) {
    console.error('Error getting payroll UUIDs:', err)
    // Fallback: if the API call fails, return empty array to trigger error handling
    return []
  }
}

const finalizePayslips = async () => {
  const finalizablePayslips = payslipPreview.value.filter(p => p.can_finalize)
  
  if (finalizablePayslips.length === 0) {
    showNotification('No payslips available for finalization', 'warning')
    return
  }

  try {
    processing.value = true
    
    const payrollUuids = finalizablePayslips.map(p => p.payroll_uuid)
    const response = await payslipApi.bulkFinalize(payrollUuids)
    
    const { finalized, already_finalized, failed } = response.data
    
    if (finalized.length > 0) {
      showNotification(`Successfully finalized ${finalized.length} payslips`, 'success')
      emit('finalized', finalized.length)
    }
    
    if (failed.length > 0) {
      showNotification(`Failed to finalize ${failed.length} payslips`, 'error')
    }
    
    if (already_finalized.length > 0) {
      showNotification(`${already_finalized.length} payslips were already finalized`, 'info')
    }
    
  } catch (err) {
    showNotification('Failed to finalize payslips', 'error')
    console.error('Error finalizing payslips:', err)
  } finally {
    processing.value = false
  }
}

const finalizeSinglePayslip = async (payslip) => {
  if (!payslip.can_finalize) {
    showNotification('This payslip cannot be finalized', 'warning')
    return
  }

  try {
    processing.value = true
    processingPayslip.value = payslip.payroll_uuid
    
    const response = await payslipApi.finalize(payslip.payroll_uuid)
    
    showNotification(`Payslip for ${payslip.employee.name} has been finalized`, 'success')
    
    // Update the local state to reflect the finalized status
    const index = payslipPreview.value.findIndex(p => p.payroll_uuid === payslip.payroll_uuid)
    if (index !== -1) {
      payslipPreview.value[index].payslip_status = 'finalized'
      payslipPreview.value[index].can_finalize = false
    }
    
    // Emit event to parent component
    emit('finalized', 1)
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to finalize payslip'
    showNotification(errorMessage, 'error')
    console.error('Error finalizing single payslip:', err)
  } finally {
    processing.value = false
    processingPayslip.value = null
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    pending_approval: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    approved: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    finalized: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Watchers
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadPayslipPreview()
  } else {
    // Reset state when modal closes
    payslipPreview.value = []
    error.value = null
  }
})
</script>