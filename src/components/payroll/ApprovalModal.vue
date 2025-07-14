<template>
  <Modal
    :is-open="isOpen"
    title="Approve Payroll Item"
    @close="$emit('close')"
    size="medium"
  >
    <div class="space-y-6">
      <!-- Item Information -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
          Item Details
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Employee:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">
              {{ item?.employee?.first_name }} {{ item?.employee?.last_name }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Item Name:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">{{ item?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Code:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">{{ item?.code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Type:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100 capitalize">{{ item?.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Method:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">
              {{ formatCalculationMethod(item?.calculation_method) }}
            </span>
          </div>
          <div v-if="item?.amount" class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Amount:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">
              {{ formatCurrency(item.amount) }}
            </span>
          </div>
          <div v-if="item?.percentage" class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Percentage:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">{{ item.percentage }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700 dark:text-blue-300">Effective Period:</span>
            <span class="font-medium text-blue-900 dark:text-blue-100">
              {{ formatDate(item?.effective_from) }}
              <span v-if="item?.effective_to"> to {{ formatDate(item.effective_to) }}</span>
              <span v-else> (Ongoing)</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <h4 class="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
          Current Status
        </h4>
        <div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending Approval
          </span>
          <span class="ml-3 text-sm text-yellow-700 dark:text-yellow-300">
            Waiting for manager approval
          </span>
        </div>
      </div>

      <!-- Approval Form -->
      <form @submit.prevent="approveItem" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Approval Notes
          </label>
          <textarea
            v-model="form.approval_notes"
            rows="4"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Add any notes about this approval (optional)"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            These notes will be recorded with the approval
          </p>
          <p v-if="errors.approval_notes" class="mt-1 text-sm text-red-600">{{ errors.approval_notes[0] }}</p>
        </div>

        <!-- Warning about approval -->
        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800 dark:text-amber-200">
                Approval Confirmation
              </h3>
              <div class="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>
                  Once approved, this item will become active and will be included in future payroll calculations. 
                  This action cannot be undone, but the item can be suspended later if needed.
                </p>
              </div>
            </div>
          </div>
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
            class="btn btn-success"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Approve Item
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import Modal from '@/components/shared/Modal.vue'

export default {
  name: 'ApprovalModal',
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
    }
  },
  emits: ['close', 'approved'],
  setup(props, { emit }) {
    const { post } = useApi()
    const { showNotification } = useNotifications()

    const loading = ref(false)
    const errors = ref({})

    const form = reactive({
      approval_notes: ''
    })

    const resetForm = () => {
      form.approval_notes = ''
      errors.value = {}
    }

    const approveItem = async () => {
      if (!props.item) return

      try {
        loading.value = true
        errors.value = {}

        await post(`/employee-payroll-items/${props.item.uuid}/approve`, {
          approval_notes: form.approval_notes || null
        })

        showNotification('Item approved successfully', 'success')
        emit('approved')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors || {}
        } else {
          showNotification(
            error.response?.data?.message || 'Error approving item',
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
      approveItem,
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

.btn-success {
  @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500;
}
</style>