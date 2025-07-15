<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edit Payroll Item' : 'Add Payroll Item' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ employee?.display_name }} - {{ employee?.employee_id }}
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
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="e.g., TRANSPORT"
              >
              <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              >
                <option value="">Select Type</option>
                <option value="allowance">Allowance</option>
                <option value="deduction">Deduction</option>
              </select>
              <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type[0] }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="e.g., Transport Allowance"
            >
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="Brief description of this payroll item"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
          </div>

          <!-- Calculation Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calculation Method <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.calculation_method"
              @change="resetCalculationFields"
              required
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            >
              <option value="">Select Method</option>
              <option value="fixed_amount">Fixed Amount</option>
              <option value="percentage_of_salary">Percentage of Gross Salary</option>
              <option value="percentage_of_basic">Percentage of Basic Salary</option>
              <option value="formula">Formula Based</option>
              <option value="manual">Manual Entry</option>
            </select>
            <p v-if="errors.calculation_method" class="mt-1 text-sm text-red-600">{{ errors.calculation_method[0] }}</p>
          </div>

          <!-- Calculation Fields -->
          <div v-if="form.calculation_method">
            <div v-if="form.calculation_method === 'fixed_amount'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="0.00"
              >
              <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
            </div>

            <div v-else-if="form.calculation_method.includes('percentage')">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Percentage <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 pr-8"
                  placeholder="0.00"
                >
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
              </div>
              <p v-if="errors.percentage" class="mt-1 text-sm text-red-600">{{ errors.percentage[0] }}</p>
            </div>

            <div v-else-if="form.calculation_method === 'formula'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formula Expression <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.formula_expression"
                rows="3"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 font-mono text-sm"
                placeholder="e.g., {basic_salary} * 0.1 + {years_of_service} * 100"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Available variables: {basic_salary}, {gross_salary}, {years_of_service}
              </p>
              <p v-if="errors.formula_expression" class="mt-1 text-sm text-red-600">{{ errors.formula_expression[0] }}</p>
            </div>

            <div v-else-if="form.calculation_method === 'manual'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manual Amount <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="0.00"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This amount will be used as-is without any calculations
              </p>
              <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
            </div>
          </div>

          <!-- Constraints -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Amount
              </label>
              <input
                v-model.number="form.minimum_amount"
                type="number"
                step="0.01"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="0.00"
              >
              <p v-if="errors.minimum_amount" class="mt-1 text-sm text-red-600">{{ errors.minimum_amount[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Amount
              </label>
              <input
                v-model.number="form.maximum_amount"
                type="number"
                step="0.01"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="0.00"
              >
              <p v-if="errors.maximum_amount" class="mt-1 text-sm text-red-600">{{ errors.maximum_amount[0] }}</p>
            </div>
          </div>

          <!-- Effective Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Effective From <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.effective_from"
                type="date"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              >
              <p v-if="errors.effective_from" class="mt-1 text-sm text-red-600">{{ errors.effective_from[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Effective To
              </label>
              <input
                v-model="form.effective_to"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              >
              <p v-if="errors.effective_to" class="mt-1 text-sm text-red-600">{{ errors.effective_to[0] }}</p>
            </div>
          </div>

          <!-- Settings -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center">
              <input
                v-model="form.is_recurring"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Recurring
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="form.requires_approval"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Requires Approval
              </label>
            </div>
          </div>

          <!-- Tax Settings (only for allowances) -->
          <div v-if="form.type === 'allowance'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center">
              <input
                v-model="form.is_taxable"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Taxable
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="form.is_pensionable"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Pensionable
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          {{ isEdit ? 'Update Item' : 'Create Item' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { post, put } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const errors = ref({})

const form = reactive({
  code: '',
  name: '',
  description: '',
  type: '',
  calculation_method: '',
  amount: null,
  percentage: null,
  formula_expression: '',
  minimum_amount: null,
  maximum_amount: null,
  effective_from: '',
  effective_to: '',
  is_recurring: true,
  requires_approval: false,
  is_taxable: true,
  is_pensionable: true
})

// Computed
const isEdit = computed(() => !!props.item)

// Methods
const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (typeof form[key] === 'boolean') {
      form[key] = ['is_recurring', 'is_taxable', 'is_pensionable'].includes(key)
    } else if (typeof form[key] === 'number') {
      form[key] = null
    } else {
      form[key] = ''
    }
  })
  form.effective_from = new Date().toISOString().split('T')[0]
  errors.value = {}
}

const populateForm = (item) => {
  if (!item) return

  Object.keys(form).forEach(key => {
    if (item[key] !== undefined) {
      if (key === 'effective_from' || key === 'effective_to') {
        form[key] = item[key] ? new Date(item[key]).toISOString().split('T')[0] : ''
      } else {
        form[key] = item[key]
      }
    }
  })
}

const resetCalculationFields = () => {
  form.amount = null
  form.percentage = null
  form.formula_expression = ''
}

const submitForm = async () => {
  try {
    loading.value = true
    errors.value = {}

    const endpoint = isEdit.value
      ? `/employee-payroll-items/${props.item.uuid}`
      : '/employee-payroll-items'

    const method = isEdit.value ? put : post

    // Prepare form data
    const formData = { ...form }
    formData.employee_uuid = props.employee.uuid

    // Clean up form data based on calculation method
    if (formData.calculation_method !== 'fixed_amount' && formData.calculation_method !== 'manual') {
      formData.amount = null
    }
    if (!formData.calculation_method.includes('percentage')) {
      formData.percentage = null
    }
    if (formData.calculation_method !== 'formula') {
      formData.formula_expression = ''
    }

    // Ensure deductions are never taxable or pensionable
    if (formData.type === 'deduction') {
      formData.is_taxable = false
      formData.is_pensionable = false
    }

    await method(endpoint, formData)
    emit('saved')
    showNotification(
      `Payroll item ${isEdit.value ? 'updated' : 'created'} successfully`,
      'success'
    )
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      showNotification(
        error.response?.data?.message || 'Error saving payroll item',
        'error'
      )
    }
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.item, (newItem) => {
  if (newItem) {
    populateForm(newItem)
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !props.item) {
    resetForm()
  }
})

// Watch for type changes to update defaults
watch(() => form.type, () => {
  if (form.type === 'deduction') {
    form.is_taxable = false
    form.is_pensionable = false
  } else if (form.type === 'allowance') {
    form.is_taxable = true
    form.is_pensionable = true
  }
})
</script>