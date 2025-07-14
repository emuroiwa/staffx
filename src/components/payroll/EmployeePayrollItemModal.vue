<template>
  <Modal
    :is-open="isOpen"
    :title="isEdit ? 'Edit Employee Item' : 'Add Employee Item'"
    @close="$emit('close')"
    size="large"
  >
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Employee Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Employee <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.employee_uuid"
          :disabled="isEdit"
          required
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select Employee</option>
          <option
            v-for="employee in employees"
            :key="employee.uuid"
            :value="employee.uuid"
          >
            {{ employee.first_name }} {{ employee.last_name }} ({{ employee.employee_id }})
          </option>
        </select>
        <p v-if="errors.employee_uuid" class="mt-1 text-sm text-red-600">{{ errors.employee_uuid[0] }}</p>
      </div>

      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.code"
            :disabled="isEdit"
            type="text"
            required
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., OVERTIME"
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
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="e.g., Overtime Pay"
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
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Brief description of this item"
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
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select Method</option>
          <option value="fixed_amount">Fixed Amount</option>
          <option value="percentage_of_salary">Percentage of Gross Salary</option>
          <option value="percentage_of_basic">Percentage of Basic Salary</option>
          <option value="formula">Formula Based</option>
          <option value="manual">Manual (specify each period)</option>
        </select>
        <p v-if="errors.calculation_method" class="mt-1 text-sm text-red-600">{{ errors.calculation_method[0] }}</p>
      </div>

      <!-- Calculation Fields -->
      <div v-if="form.calculation_method">
        <div v-if="form.calculation_method === 'fixed_amount'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="0.00"
            >
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
          </div>
        </div>

        <div v-else-if="form.calculation_method.includes('percentage')" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-8"
                placeholder="0.00"
              >
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
            </div>
            <p v-if="errors.percentage" class="mt-1 text-sm text-red-600">{{ errors.percentage[0] }}</p>
          </div>
        </div>

        <div v-else-if="form.calculation_method === 'formula'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formula Expression <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.formula_expression"
            rows="3"
            required
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
            placeholder="e.g., {basic_salary} * 0.1 + {years_of_service} * 100"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Available variables: {basic_salary}, {gross_salary}, {years_of_service}
          </p>
          <p v-if="errors.formula_expression" class="mt-1 text-sm text-red-600">{{ errors.formula_expression[0] }}</p>
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
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="0.00"
          >
          <p v-if="errors.maximum_amount" class="mt-1 text-sm text-red-600">{{ errors.maximum_amount[0] }}</p>
        </div>
      </div>

      <!-- Effective Period -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Effective From <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.effective_from"
            type="date"
            required
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for ongoing items
          </p>
          <p v-if="errors.effective_to" class="mt-1 text-sm text-red-600">{{ errors.effective_to[0] }}</p>
        </div>
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center">
          <input
            v-model="form.is_taxable"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Taxable
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.is_pensionable"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Pensionable
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.requires_approval"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Requires Approval
          </label>
        </div>
      </div>

      <div class="flex items-center">
        <input
          v-model="form.is_recurring"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Recurring Item
        </label>
        <p class="ml-2 text-xs text-gray-500 dark:text-gray-400">
          (automatically applied to future payrolls)
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          {{ isEdit ? 'Update Item' : 'Create Item' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import Modal from '@/components/shared/Modal.vue'

export default {
  name: 'EmployeePayrollItemModal',
  components: {
    Modal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
    employees: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { post, put } = useApi()
    const { showNotification } = useNotifications()

    const loading = ref(false)
    const errors = ref({})

    const form = reactive({
      employee_uuid: '',
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
      is_taxable: true,
      is_pensionable: true,
      requires_approval: false,
      is_recurring: true
    })

    const isEdit = computed(() => !!props.item)

    const resetForm = () => {
      Object.keys(form).forEach(key => {
        if (typeof form[key] === 'boolean') {
          form[key] = key === 'is_taxable' || key === 'is_pensionable' || key === 'is_recurring'
        } else {
          form[key] = ''
        }
      })
      form.amount = null
      form.percentage = null
      form.minimum_amount = null
      form.maximum_amount = null
      form.effective_from = new Date().toISOString().split('T')[0]
      errors.value = {}
    }

    const populateForm = (item) => {
      if (!item) return

      Object.keys(form).forEach(key => {
        if (item[key] !== undefined) {
          form[key] = item[key]
        }
      })

      // Format dates
      if (item.effective_from) {
        form.effective_from = item.effective_from.split(' ')[0]
      }
      if (item.effective_to) {
        form.effective_to = item.effective_to.split(' ')[0]
      }
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

        // Clean up form data based on calculation method
        const formData = { ...form }
        
        if (formData.calculation_method !== 'fixed_amount') {
          formData.amount = null
        }
        if (!formData.calculation_method.includes('percentage')) {
          formData.percentage = null
        }
        if (formData.calculation_method !== 'formula') {
          formData.formula_expression = ''
        }

        // Remove empty effective_to
        if (!formData.effective_to) {
          formData.effective_to = null
        }

        await method(endpoint, formData)
        emit('saved')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors || {}
        } else {
          showNotification(
            error.response?.data?.message || 'Error saving item',
            'error'
          )
        }
      } finally {
        loading.value = false
      }
    }

    // Watch for item changes
    watch(() => props.item, (newItem) => {
      if (newItem) {
        populateForm(newItem)
      } else {
        resetForm()
      }
    }, { immediate: true })

    // Reset form when modal opens/closes
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen && !props.item) {
        resetForm()
      }
    })

    return {
      loading,
      errors,
      form,
      isEdit,
      resetCalculationFields,
      submitForm
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