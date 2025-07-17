<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Payroll Details</h2>
            <p class="text-sm text-gray-500">{{ employee?.employee?.name }} - {{ employee?.employee?.employee_id }}</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Employee Information -->
        <div v-if="!loading && payrollData" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Employee Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500">Name</div>
              <div class="text-lg text-gray-900">{{ payrollData.employee?.first_name + ' ' + payrollData.employee?.last_name }} </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Employee ID</div>
              <div class="text-lg text-gray-900">{{ payrollData.employee?.employee_id || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Department</div>
              <div class="text-lg text-gray-900">{{ payrollData.employee?.department?.name || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Position</div>
              <div class="text-lg text-gray-900">{{ payrollData.employee?.position?.name || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Pay Frequency</div>
              <div class="text-lg text-gray-900">{{ payrollData.employee?.pay_frequency || 'N/A' }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Inclusion Status</div>
              <span :class="payrollData.inclusion?.is_included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                    class="px-2 py-1 text-xs font-medium rounded-full">
                {{ payrollData.inclusion?.is_included ? 'Included' : 'Excluded' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Calculation Status -->
        <div v-if="!loading && payrollData" class="bg-blue-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Calculation Status</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500">Status</div>
              <span :class="getCalculationStatusClass(payrollData.calculation?.status)" 
                    class="px-2 py-1 text-xs font-medium rounded-full">
                {{ payrollData.calculation?.status_label || 'Unknown' }}
              </span>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Last Calculated</div>
              <div class="text-lg text-gray-900">{{ formatDate(payrollData.calculation?.calculated_at) }}</div>
            </div>
          </div>
          
          <!-- Calculation Errors -->
          <div v-if="payrollData.calculation?.errors?.length > 0" class="mt-4">
            <div class="text-sm font-medium text-red-700 mb-2">Calculation Errors:</div>
            <ul class="list-disc list-inside text-sm text-red-600">
              <li v-for="error in payrollData.calculation.errors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>

        <!-- Salary Summary -->
        <div v-if="!loading && payrollData?.payroll" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-sm font-medium text-green-700">Gross Salary</div>
            <div class="text-2xl font-bold text-green-900">{{ formatCurrency(payrollData.payroll.gross_salary) }}</div>
          </div>
          
          <div class="bg-red-50 rounded-lg p-4">
            <div class="text-sm font-medium text-red-700">Total Deductions</div>
            <div class="text-2xl font-bold text-red-900">{{ formatCurrency(totalDeductions) }}</div>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm font-medium text-blue-700">Net Salary</div>
            <div class="text-2xl font-bold text-blue-900">{{ formatCurrency(payrollData.payroll.net_salary) }}</div>
          </div>
        </div>

        <!-- Payroll Items Breakdown -->
        <div v-if="!loading && payrollData?.payroll?.items?.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Payroll Items Breakdown</h3>
          
          <!-- Earnings -->
          <div v-if="earnings.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-green-700 mb-2">Earnings & Allowances</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-green-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Item</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Description</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in earnings" :key="item.uuid">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.category?.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ item.description || 'N/A' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Deductions -->
          <div v-if="deductions.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-red-700 mb-2">Deductions</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-red-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Item</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Description</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in deductions" :key="item.uuid">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.category?.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ item.description || 'N/A' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Statutory Deductions -->
          <div v-if="statutoryDeductions.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-orange-700 mb-2">Statutory Deductions</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-orange-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Item</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Description</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-orange-800 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in statutoryDeductions" :key="item.uuid">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.category?.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ item.description || 'N/A' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Employer Contributions -->
          <div v-if="employerContributions.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-purple-700 mb-2">Employer Contributions</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-purple-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase">Item</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase">Description</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-purple-800 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in employerContributions" :key="item.uuid">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.category?.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ item.description || 'N/A' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Payslip Actions -->
        <div v-if="!loading && payrollData?.payroll" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Payslip Actions</h3>
          <div class="flex gap-4">
            <button
              @click="generatePayslip"
              :disabled="generating"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {{ generating ? 'Generating...' : 'Generate Payslip' }}
            </button>
            <button
              @click="downloadPayslip"
              :disabled="downloading"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {{ downloading ? 'Downloading...' : 'Download Payslip' }}
            </button>
            <button
              @click="previewPayslip"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Preview Payslip
            </button>
            <button
              @click="sendPayslipEmail"
              :disabled="sending"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {{ sending ? 'Sending...' : 'Send Email' }}
            </button>
          </div>
        </div>

        <!-- Pay Period Information -->
        <div v-if="!loading && payrollData?.payroll" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Pay Period Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500">Period Start</div>
              <div class="text-lg text-gray-900">{{ formatDate(payrollData.payroll.pay_period_start) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Period End</div>
              <div class="text-lg text-gray-900">{{ formatDate(payrollData.payroll.pay_period_end) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500">Pay Date</div>
              <div class="text-lg text-gray-900">{{ formatDate(payrollData.payroll.pay_date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import api from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  payRun: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { showSuccess, showError } = useNotifications()

// Reactive data
const loading = ref(false)
const generating = ref(false)
const downloading = ref(false)
const sending = ref(false)
const payrollData = ref(null)

// Computed properties
const earnings = computed(() => {
  if (!payrollData.value?.payroll?.items) return []
  return payrollData.value.payroll.items.filter(item => 
    item.category?.type === 'allowance' || item.category?.type === 'earning'
  )
})

const deductions = computed(() => {
  if (!payrollData.value?.payroll?.items) return []
  return payrollData.value.payroll.items.filter(item => 
    item.category?.type === 'deduction'
  )
})

const statutoryDeductions = computed(() => {
  if (!payrollData.value?.payroll?.items) return []
  return payrollData.value.payroll.items.filter(item => 
    item.category?.type === 'statutory_deduction'
  )
})

const employerContributions = computed(() => {
  if (!payrollData.value?.payroll?.items) return []
  return payrollData.value.payroll.items.filter(item => 
    item.category?.type === 'employer_contribution'
  )
})

const totalDeductions = computed(() => {
  const regularDeductions = deductions.value.reduce((sum, item) => sum + (item.amount || 0), 0)
  const statutoryDeds = statutoryDeductions.value.reduce((sum, item) => sum + (item.amount || 0), 0)
  return regularDeductions + statutoryDeds
})

// Methods
const loadEmployeePayrollData = async () => {
  loading.value = true
  try {
    const response = await api.get(`/pay-runs/${props.payRun.uuid}/employees/${props.employee.employee.uuid}`)
    payrollData.value = response.data.data
  } catch (error) {
    showError('Failed to load employee payroll data')
    console.error('Error loading employee payroll data:', error)
  } finally {
    loading.value = false
  }
}

const generatePayslip = async () => {
  if (!payrollData.value?.payroll?.uuid) return
  
  generating.value = true
  try {
    await api.post(`/payslips/${payrollData.value.payroll.uuid}/generate`)
    showSuccess('Payslip generated successfully')
  } catch (error) {
    showError('Failed to generate payslip')
    console.error('Error generating payslip:', error)
  } finally {
    generating.value = false
  }
}

const downloadPayslip = async () => {
  if (!payrollData.value?.payroll?.uuid) return
  
  downloading.value = true
  try {
    const response = await api.get(`/payslips/${payrollData.value.payroll.uuid}/download`, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `payslip-${payrollData.value.employee.name}-${formatDate(payrollData.value.payroll.pay_period_start)}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
    
    showSuccess('Payslip downloaded successfully')
  } catch (error) {
    showError('Failed to download payslip')
    console.error('Error downloading payslip:', error)
  } finally {
    downloading.value = false
  }
}

const previewPayslip = async () => {
  if (!payrollData.value?.payroll?.uuid) return
  
  try {
    const response = await api.get(`/payslips/${payrollData.value.payroll.uuid}/preview`, {
      responseType: 'blob'
    })
    
    // Open in new tab
    const url = window.URL.createObjectURL(new Blob([response.data]))
    window.open(url, '_blank')
    window.URL.revokeObjectURL(url)
  } catch (error) {
    showError('Failed to preview payslip')
    console.error('Error previewing payslip:', error)
  }
}

const sendPayslipEmail = async () => {
  if (!payrollData.value?.payroll?.uuid) return
  
  sending.value = true
  try {
    await api.post(`/payslips/${payrollData.value.payroll.uuid}/send-email`)
    showSuccess('Payslip email sent successfully')
  } catch (error) {
    showError('Failed to send payslip email')
    console.error('Error sending payslip email:', error)
  } finally {
    sending.value = false
  }
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
  loadEmployeePayrollData()
})
</script>