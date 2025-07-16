<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Preview Calculation
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Test the statutory deduction calculation for {{ configuration?.statutory_deduction_template?.name }}
          </p>
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
        <!-- Input Form -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee *
              </label>
              <select
                v-model="previewData.employee_uuid"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              >
                <option value="">Select an employee</option>
                <option v-for="employee in employees" :key="employee.uuid" :value="employee.uuid">
                  {{ employee.display_name }} ({{ employee.employee_id }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gross Salary *
              </label>
              <input
                v-model.number="previewData.gross_salary"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Enter gross salary"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calculation Date
              </label>
              <input
                v-model="previewData.calculation_date"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>

            <div class="flex items-end">
              <button
                @click="calculatePreview"
                :disabled="!canCalculate || calculating"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ calculating ? 'Calculating...' : 'Calculate Preview' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="calculationResult" class="space-y-6">
          <!-- Configuration Summary -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Configuration Summary
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Employer Covers:</span>
                <span class="ml-2 text-gray-900 dark:text-white">
                  {{ configuration?.employer_covers_employee_portion ? 'Yes' : 'No' }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Taxable Benefit:</span>
                <span class="ml-2 text-gray-900 dark:text-white">
                  {{ configuration?.is_taxable_if_employer_paid ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Calculation Results -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Calculation Results
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Employee Amount</div>
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(calculationResult.calculation?.employee_amount || 0) }}
                </div>
              </div>
              <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Employer Amount</div>
                <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                  {{ formatCurrency(calculationResult.calculation?.employer_amount || 0) }}
                </div>
              </div>
              <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</div>
                <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {{ formatCurrency((calculationResult.calculation?.employee_amount || 0) + (calculationResult.calculation?.employer_amount || 0)) }}
                </div>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Payment Details
              </h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Paid by:</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ calculationResult.calculation?.employer_covers_employee_portion ? 'Employer' : 'Employee' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Taxable Benefit:</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ calculationResult.calculation?.is_taxable_if_employer_paid ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Gross Salary Used:</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatCurrency(calculationResult.gross_salary_used || 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Calculation Details -->
          <div v-if="calculationResult.calculation?.calculation_details" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Calculation Details
            </h4>
            <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">{{ JSON.stringify(calculationResult.calculation.calculation_details, null, 2) }}</pre>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="calculationError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200">
                Calculation Error
              </h4>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                {{ calculationError }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import api from '@/services/api'
import statutoryDeductionService from '@/services/statutoryDeductionService'

export default {
  name: 'StatutoryDeductionPreviewModal',
  components: {
    XMarkIcon,
    ExclamationTriangleIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    configuration: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props) {
    const employees = ref([])
    const previewData = ref({
      employee_uuid: '',
      gross_salary: 15000,
      calculation_date: new Date().toISOString().split('T')[0]
    })
    const calculationResult = ref(null)
    const calculationError = ref(null)
    const calculating = ref(false)

    const canCalculate = computed(() => {
      return previewData.value.employee_uuid && previewData.value.gross_salary > 0
    })

    const loadEmployees = async () => {
      try {
        const response = await api.get('/employees')
        employees.value = response.data?.data || []
      } catch (error) {
        console.error('Error loading employees:', error)
      }
    }

    const calculatePreview = async () => {
      if (!canCalculate.value || !props.configuration) return

      calculating.value = true
      calculationError.value = null
      calculationResult.value = null

      try {
        const response = await statutoryDeductionService.previewCalculation(
          props.configuration.uuid,
          previewData.value
        )
        calculationResult.value = response.data
      } catch (error) {
        console.error('Error calculating preview:', error)
        calculationError.value = error.response?.data?.message || 'Failed to calculate preview'
      } finally {
        calculating.value = false
      }
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // This should be dynamic based on company currency
        minimumFractionDigits: 2
      }).format(amount)
    }

    onMounted(() => {
      loadEmployees()
    })

    return {
      employees,
      previewData,
      calculationResult,
      calculationError,
      calculating,
      canCalculate,
      calculatePreview,
      formatCurrency
    }
  }
}
</script>