<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ configuration ? 'Edit' : 'Add' }} Statutory Deduction Configuration
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Configure employer payment and tax treatment for statutory deductions
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
        <form @submit.prevent="handleSubmit">
          <!-- Template Selection (only for new configurations) -->
          <div v-if="!configuration" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statutory Deduction Template *
            </label>
            <select
              v-model="formData.statutory_deduction_template_uuid"
              required
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            >
              <option value="">Select a template</option>
              <option v-for="template in availableTemplates" :key="template.uuid" :value="template.uuid">
                {{ template.name }} ({{ template.code }})
              </option>
            </select>
          </div>

          <!-- Template Info (for editing) -->
          <div v-if="configuration" class="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Template Information
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Name:</span>
                <span class="ml-2 text-gray-900 dark:text-white">
                  {{ configuration.statutory_deduction_template?.name }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Code:</span>
                <span class="ml-2 text-gray-900 dark:text-white">
                  {{ configuration.statutory_deduction_template?.code }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Type:</span>
                <span class="ml-2 text-gray-900 dark:text-white">
                  {{ configuration.statutory_deduction_template?.deduction_type }}
                </span>
              </div>
            </div>
          </div>

          <!-- Main Configuration -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Employer Covers Employee Portion -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="formData.employer_covers_employee_portion"
                  type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employer Covers Employee Portion
                </span>
              </label>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                When enabled, employer pays the employee's portion of this deduction
              </p>
            </div>

            <!-- Taxable if Employer Paid -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="formData.is_taxable_if_employer_paid"
                  type="checkbox"
                  :disabled="!formData.employer_covers_employee_portion"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 disabled:opacity-50"
                />
                <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Taxable Benefit if Employer Paid
                </span>
              </label>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                When enabled, employer-paid amount is added to taxable income
              </p>
            </div>
          </div>

          <!-- Rate Overrides -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Rate Overrides (Optional)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employer Rate Override (%)
                </label>
                <input
                  v-model.number="formData.employer_rate_override"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Leave empty for default"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employee Rate Override (%)
                </label>
                <input
                  v-model.number="formData.employee_rate_override"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Leave empty for default"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Salary Overrides -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Salary Limits (Optional)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary Override
                </label>
                <input
                  v-model.number="formData.minimum_salary_override"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Leave empty for default"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary Override
                </label>
                <input
                  v-model.number="formData.maximum_salary_override"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Leave empty for default"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Effective Period -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Effective Period
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Effective From *
                </label>
                <input
                  v-model="formData.effective_from"
                  type="date"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Effective To (Optional)
                </label>
                <input
                  v-model="formData.effective_to"
                  type="date"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!canSubmit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ configuration ? 'Update' : 'Create' }} Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'StatutoryDeductionConfigModal',
  components: {
    XMarkIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    configuration: {
      type: Object,
      default: null
    },
    availableTemplates: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const formData = ref({
      statutory_deduction_template_uuid: '',
      employer_covers_employee_portion: false,
      is_taxable_if_employer_paid: false,
      employer_rate_override: null,
      employee_rate_override: null,
      minimum_salary_override: null,
      maximum_salary_override: null,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null
    })

    const canSubmit = computed(() => {
      return (
        (props.configuration || formData.value.statutory_deduction_template_uuid) &&
        formData.value.effective_from
      )
    })

    const resetForm = () => {
      if (props.configuration) {
        // Edit mode - populate with existing data
        formData.value = {
          statutory_deduction_template_uuid: props.configuration.statutory_deduction_template_uuid,
          employer_covers_employee_portion: props.configuration.employer_covers_employee_portion,
          is_taxable_if_employer_paid: props.configuration.is_taxable_if_employer_paid,
          employer_rate_override: props.configuration.employer_rate_override,
          employee_rate_override: props.configuration.employee_rate_override,
          minimum_salary_override: props.configuration.minimum_salary_override,
          maximum_salary_override: props.configuration.maximum_salary_override,
          effective_from: props.configuration.effective_from?.split('T')[0] || new Date().toISOString().split('T')[0],
          effective_to: props.configuration.effective_to?.split('T')[0] || null
        }
      } else {
        // Add mode - reset to defaults
        formData.value = {
          statutory_deduction_template_uuid: '',
          employer_covers_employee_portion: false,
          is_taxable_if_employer_paid: false,
          employer_rate_override: null,
          employee_rate_override: null,
          minimum_salary_override: null,
          maximum_salary_override: null,
          effective_from: new Date().toISOString().split('T')[0],
          effective_to: null
        }
      }
    }

    const handleSubmit = () => {
      if (!canSubmit.value) return

      // Clean up the form data
      const submitData = { ...formData.value }
      
      // Convert percentage to decimal
      if (submitData.employer_rate_override) {
        submitData.employer_rate_override = submitData.employer_rate_override / 100
      }
      if (submitData.employee_rate_override) {
        submitData.employee_rate_override = submitData.employee_rate_override / 100
      }

      // Remove null values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === null || submitData[key] === '') {
          delete submitData[key]
        }
      })

      emit('save', submitData)
    }

    // Watch for modal open/close to reset form
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
      }
    })

    // Watch for employer covers employee portion changes
    watch(() => formData.value.employer_covers_employee_portion, (newVal) => {
      if (!newVal) {
        formData.value.is_taxable_if_employer_paid = false
      }
    })

    return {
      formData,
      canSubmit,
      handleSubmit
    }
  }
}
</script>