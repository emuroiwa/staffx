<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Test Calculation
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Test template calculation with sample data
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
        <div class="space-y-6">
      <!-- Template Info -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ template?.name }}
        </h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Code:</span>
            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ template?.code }}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Type:</span>
            <span class="ml-2 font-medium text-gray-900 dark:text-white capitalize">{{ template?.type }}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Method:</span>
            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ formatCalculationMethod(template?.calculation_method) }}</span>
          </div>
        </div>
      </div>

      <!-- Test Form -->
      <form @submit.prevent="testCalculation" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee Basic Salary <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.employee_basic_salary"
            type="number"
            step="0.01"
            min="0"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter basic salary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gross Salary (optional)
          </label>
          <input
            v-model.number="form.gross_salary"
            type="number"
            step="0.01"
            min="0"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Leave empty to use basic salary"
          >
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            If not provided, basic salary will be used
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || !form.employee_basic_salary"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          Calculate
        </button>
      </form>

      <!-- Results -->
      <div v-if="result" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h4 class="text-lg font-medium text-green-900 dark:text-green-100 mb-3">
          Calculation Result
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-green-700 dark:text-green-300">Calculated Amount:</span>
            <span class="font-bold text-green-900 dark:text-green-100 text-lg">
              {{ formatCurrency(result.calculated_amount) }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-green-600 dark:text-green-400">Basic Salary Used:</span>
            <span class="text-green-800 dark:text-green-200">
              {{ formatCurrency(result.employee_basic_salary) }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-green-600 dark:text-green-400">Gross Salary Used:</span>
            <span class="text-green-800 dark:text-green-200">
              {{ formatCurrency(result.gross_salary_used) }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-green-600 dark:text-green-400">Method:</span>
            <span class="text-green-800 dark:text-green-200">
              {{ formatCalculationMethod(result.calculation_method) }}
            </span>
          </div>
        </div>

        <!-- Template Settings -->
        <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
          <h5 class="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
            Template Settings Used:
          </h5>
          <div class="space-y-1 text-xs">
            <div v-if="result.template_settings?.amount" class="flex justify-between">
              <span class="text-green-600 dark:text-green-400">Fixed Amount:</span>
              <span class="text-green-800 dark:text-green-200">
                {{ formatCurrency(result.template_settings.amount) }}
              </span>
            </div>
            <div v-if="result.template_settings?.default_percentage" class="flex justify-between">
              <span class="text-green-600 dark:text-green-400">Percentage:</span>
              <span class="text-green-800 dark:text-green-200">
                {{ result.template_settings.default_percentage }}%
              </span>
            </div>
            <div v-if="result.template_settings?.formula_expression" class="flex justify-between">
              <span class="text-green-600 dark:text-green-400">Formula:</span>
              <span class="text-green-800 dark:text-green-200 font-mono text-xs break-all">
                {{ result.template_settings.formula_expression }}
              </span>
            </div>
            <div v-if="result.template_settings?.minimum_amount" class="flex justify-between">
              <span class="text-green-600 dark:text-green-400">Minimum:</span>
              <span class="text-green-800 dark:text-green-200">
                {{ formatCurrency(result.template_settings.minimum_amount) }}
              </span>
            </div>
            <div v-if="result.template_settings?.maximum_amount" class="flex justify-between">
              <span class="text-green-600 dark:text-green-400">Maximum:</span>
              <span class="text-green-800 dark:text-green-200">
                {{ formatCurrency(result.template_settings.maximum_amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <h4 class="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
          Calculation Error
        </h4>
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
      </div>

        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="clearResults"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Clear Results
        </button>
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { formatCurrency } from '@/utils/currency'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TestCalculationModal',
  components: {
    XMarkIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    template: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props) {
    const { post } = useApi()

    const loading = ref(false)
    const result = ref(null)
    const error = ref(null)

    const form = reactive({
      employee_basic_salary: null,
      gross_salary: null
    })

    const resetForm = () => {
      form.employee_basic_salary = null
      form.gross_salary = null
      result.value = null
      error.value = null
    }

    const testCalculation = async () => {
      if (!props.template || !form.employee_basic_salary) return

      try {
        loading.value = true
        error.value = null

        const response = await post(
          `/payroll-templates/${props.template.uuid}/test-calculation`,
          {
            employee_basic_salary: form.employee_basic_salary,
            gross_salary: form.gross_salary || form.employee_basic_salary
          }
        )

        result.value = response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Error testing calculation'
        result.value = null
      } finally {
        loading.value = false
      }
    }

    const clearResults = () => {
      result.value = null
      error.value = null
    }

    const formatCalculationMethod = (method) => {
      const methods = {
        fixed_amount: 'Fixed Amount',
        percentage_of_salary: 'Percentage of Salary',
        percentage_of_basic: 'Percentage of Basic',
        formula: 'Formula Based'
      }
      return methods[method] || method
    }

    // Reset form when modal opens/closes or template changes
    watch([() => props.isOpen, () => props.template], () => {
      resetForm()
    })

    return {
      loading,
      result,
      error,
      form,
      testCalculation,
      clearResults,
      formatCalculationMethod,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}

.btn-secondary {
  @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700;
}
</style>