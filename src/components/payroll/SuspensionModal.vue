<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Suspend Payroll Item
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Temporarily suspend this payroll item
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
      <!-- Item Information -->
      <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
        <h3 class="text-lg font-medium text-orange-900 dark:text-orange-100 mb-3">
          Item Details
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Employee:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">
              {{ item?.employee?.first_name }} {{ item?.employee?.last_name }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Item Name:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">{{ item?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Code:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">{{ item?.code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Type:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100 capitalize">{{ item?.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Method:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">
              {{ formatCalculationMethod(item?.calculation_method) }}
            </span>
          </div>
          <div v-if="item?.amount" class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Amount:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">
              {{ formatCurrency(item.amount) }}
            </span>
          </div>
          <div v-if="item?.percentage" class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Percentage:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">{{ item.percentage }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-orange-700 dark:text-orange-300">Effective Period:</span>
            <span class="font-medium text-orange-900 dark:text-orange-100">
              {{ formatDate(item?.effective_from) }}
              <span v-if="item?.effective_to"> to {{ formatDate(item.effective_to) }}</span>
              <span v-else> (Ongoing)</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h4 class="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
          Current Status
        </h4>
        <div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </span>
          <span class="ml-3 text-sm text-green-700 dark:text-green-300">
            Currently included in payroll calculations
          </span>
        </div>
      </div>

      <!-- Suspension Form -->
      <form @submit.prevent="suspendItem" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suspension Reason <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.suspension_reason"
            rows="4"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Please provide a reason for suspending this item"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This reason will be recorded and visible in the item history
          </p>
          <p v-if="errors.suspension_reason" class="mt-1 text-sm text-red-600">{{ errors.suspension_reason[0] }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suspension Effective From
          </label>
          <input
            v-model="form.suspension_effective_from"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty to suspend immediately from today
          </p>
          <p v-if="errors.suspension_effective_from" class="mt-1 text-sm text-red-600">{{ errors.suspension_effective_from[0] }}</p>
        </div>

        <!-- Warning about suspension -->
        <div class="bg-red-50 dark:bg-red-900/20 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Suspension Impact
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  Suspending this item will stop it from being included in future payroll calculations. 
                  The item can be reactivated later, but any payrolls already processed will not be affected.
                </p>
                <ul class="mt-2 list-disc list-inside space-y-1">
                  <li>Future payrolls will exclude this item</li>
                  <li>Historical payrolls remain unchanged</li>
                  <li>Item can be reactivated by editing and changing status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        </form>
        </div>
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
          @click="suspendItem"
          :disabled="loading || !form.suspension_reason"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 border border-transparent rounded-lg hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Suspend Item
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'SuspensionModal',
  components: {
    XMarkIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'suspended'],
  setup(props, { emit }) {
    const { post } = useApi()
    const { showNotification } = useNotifications()

    const loading = ref(false)
    const errors = ref({})

    const form = reactive({
      suspension_reason: '',
      suspension_effective_from: ''
    })

    const resetForm = () => {
      form.suspension_reason = ''
      form.suspension_effective_from = ''
      errors.value = {}
    }

    const suspendItem = async () => {
      if (!props.item) return

      try {
        loading.value = true
        errors.value = {}

        const payload = {
          suspension_reason: form.suspension_reason
        }

        if (form.suspension_effective_from) {
          payload.suspension_effective_from = form.suspension_effective_from
        }

        await post(`/employee-payroll-items/${props.item.uuid}/suspend`, payload)

        showNotification('Item suspended successfully', 'success')
        emit('suspended')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors || {}
        } else {
          showNotification(
            error.response?.data?.message || 'Error suspending item',
            'error'
          )
        }
      } finally {
        loading.value = false
      }
    }

    const formatCalculationMethod = (method) => {
      const methods = {
        fixed_amount: 'Fixed Amount',
        percentage_of_salary: 'Percentage of Salary',
        percentage_of_basic: 'Percentage of Basic',
        formula: 'Formula Based',
        manual: 'Manual'
      }
      return methods[method] || method
    }

    // Reset form when modal opens/closes or item changes
    watch([() => props.isOpen, () => props.item], () => {
      resetForm()
    })

    return {
      loading,
      errors,
      form,
      suspendItem,
      formatCalculationMethod,
      formatCurrency,
      formatDate
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

.btn-danger {
  @apply text-white bg-red-600 hover:bg-red-700 focus:ring-red-500;
}
</style>