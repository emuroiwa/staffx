<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Department</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              required
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g., Engineering"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              id="description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Department description..."
            ></textarea>
          </div>

          <div>
            <label class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active Department</span>
            </label>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          type="button"
          :disabled="submitting"
          class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ submitting ? 'Creating...' : 'Create Department' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'

const emit = defineEmits(['close', 'created'])

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()

const submitting = ref(false)
const errors = ref({})

const form = reactive({
  name: '',
  description: '',
  is_active: true
})

const handleSubmit = async () => {
  if (!form.name.trim()) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Department name is required'
    })
    return
  }

  submitting.value = true
  errors.value = {}

  try {
    await employeeStore.createDepartment(form)
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: 'Department created successfully'
    })
    emit('created')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create department. Please try again.'
      })
    }
  } finally {
    submitting.value = false
  }
}
</script>