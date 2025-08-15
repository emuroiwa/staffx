<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Payslip Preview
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p v-if="employee" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ employee.first_name }} {{ employee.last_name }} ({{ employee.employee_id }})
        </p>
      </div>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Loading payslip...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error loading payslip</h3>
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Payslip Content -->
        <div v-else-if="payslipData" class="space-y-6">
          <!-- Header -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Employee Information
                </h3>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Name:</span>
                    <span class="text-gray-900 dark:text-white">{{ payslipData.employee.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Employee ID:</span>
                    <span class="text-gray-900 dark:text-white">{{ payslipData.employee.employee_id }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Pay Frequency:</span>
                    <span class="text-gray-900 dark:text-white capitalize">{{ payslipData.employee.pay_frequency }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Pay Period
                </h3>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Period:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ formatDate(payslipData.payroll_summary.period_start) }} - 
                      {{ formatDate(payslipData.payroll_summary.period_end) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Payslip Number:</span>
                    <span class="text-gray-900 dark:text-white">{{ payslipData.payroll_summary.payroll_number }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Status:</span>
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(payslipData.payslip_status)"
                    >
                      {{ payslipData.payslip_status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Earnings -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Earnings
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Base Salary</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.base_salary }}
                </span>
              </div>
              <div v-if="payslipData.payroll_summary.allowances > 0" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Allowances</span>
                <span class="text-green-600 dark:text-green-400 font-medium">
                  +{{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.allowances }}
                </span>
              </div>
              <div v-if="payslipData.payroll_summary.overtime_pay > 0" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Overtime Pay</span>
                <span class="text-green-600 dark:text-green-400 font-medium">
                  +{{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.overtime_pay }}
                </span>
              </div>
              <div v-if="payslipData.payroll_summary.bonus > 0" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Bonus</span>
                <span class="text-green-600 dark:text-green-400 font-medium">
                  +{{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.bonus }}
                </span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between font-medium">
                  <span class="text-gray-900 dark:text-white">Gross Salary</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.gross_salary }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deductions -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Deductions
            </h3>
            <div class="space-y-3">
              <div 
                v-for="item in deductionItems" 
                :key="item.name"
                class="flex justify-between"
              >
                <div>
                  <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
                  <span v-if="item.is_statutory" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Statutory
                  </span>
                </div>
                <span class="text-red-600 dark:text-red-400 font-medium">
                  -{{ payslipData.payroll_summary.currency }}{{ item.amount }}
                </span>
              </div>
              <div v-if="deductionItems.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
                No deductions
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between font-medium">
                  <span class="text-gray-900 dark:text-white">Total Deductions</span>
                  <span class="text-red-600 dark:text-red-400">
                    -{{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.total_deductions }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Net Salary -->
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-green-900 dark:text-green-200">
                Net Salary
              </h3>
              <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ payslipData.payroll_summary.currency }}{{ payslipData.payroll_summary.net_salary }}
              </span>
            </div>
          </div>

          <!-- Additional Items -->
          <div v-if="additionalItems.length > 0" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Additional Items
            </h3>
            <div class="space-y-3">
              <div 
                v-for="item in additionalItems" 
                :key="item.name"
                class="flex justify-between"
              >
                <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
                <span 
                  class="font-medium"
                  :class="item.type === 'deduction' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                >
                  {{ item.type === 'deduction' ? '-' : '+' }}{{ payslipData.payroll_summary.currency }}{{ item.amount }}
                </span>
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
            Unable to load payslip data for this employee.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span v-if="payslipData?.payslip_status === 'finalized'">
              This payslip has been finalized
            </span>
            <span v-else-if="payslipData?.can_finalize">
              Ready for finalization
            </span>
            <span v-else>
              Cannot be finalized at this time
            </span>
          </div>
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              v-if="payslipData?.can_finalize"
              @click="finalizePayslip"
              :disabled="processing"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <span v-if="processing">Finalizing...</span>
              <span v-else>Finalize Payslip</span>
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
  employee: {
    type: Object,
    default: null
  },
  payrollUuid: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'finalized'])

const { showNotification } = useNotifications()

// State
const loading = ref(false)
const processing = ref(false)
const error = ref(null)
const payslipData = ref(null)

// Computed
const deductionItems = computed(() => {
  if (!payslipData.value?.payroll_items) return []
  return payslipData.value.payroll_items.filter(item => item.type === 'deduction')
})

const additionalItems = computed(() => {
  if (!payslipData.value?.payroll_items) return []
  return payslipData.value.payroll_items.filter(item => !['deduction', 'base_salary'].includes(item.type))
})

// Methods
const loadPayslipData = async () => {
  if (!props.payrollUuid) return

  try {
    loading.value = true
    error.value = null
    
    const response = await payslipApi.getFinalizationPreview([props.payrollUuid])
    payslipData.value = response.data[0] || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load payslip data'
    console.error('Error loading payslip data:', err)
  } finally {
    loading.value = false
  }
}

const finalizePayslip = async () => {
  if (!props.payrollUuid) return

  try {
    processing.value = true
    
    await payslipApi.finalize(props.payrollUuid)
    
    showNotification('Payslip finalized successfully', 'success')
    emit('finalized')
    
    // Reload data to show updated status
    await loadPayslipData()
  } catch (err) {
    showNotification('Failed to finalize payslip', 'error')
    console.error('Error finalizing payslip:', err)
  } finally {
    processing.value = false
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
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
    loadPayslipData()
  } else {
    // Reset state when modal closes
    payslipData.value = null
    error.value = null
  }
})
</script>