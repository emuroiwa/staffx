<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Department' : department.name }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ department.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ department.description || 'No description' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              {{ department.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ department.employees_count || 0 }} employees</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(department.created_at) }}</p>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else>
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
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {{ isEditing ? 'Cancel' : 'Close' }}
        </button>
        
        <button
          v-if="!isEditing"
          @click="startEditing"
          type="button"
          class="px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
        >
          Edit Department
        </button>
        
        <button
          v-else
          @click="handleSubmit"
          type="button"
          :disabled="submitting"
          class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ submitting ? 'Updating...' : 'Update Department' }}
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

const props = defineProps({
  department: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()

const isEditing = ref(false)
const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  is_active: true
})

const startEditing = () => {
  // Populate form with current department data
  form.name = props.department.name
  form.description = props.department.description || ''
  form.is_active = props.department.is_active
  isEditing.value = true
}

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

  try {
    await employeeStore.updateDepartment(props.department.id, form)
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: 'Department updated successfully'
    })
    emit('updated')
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {}
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed'
      notificationStore.addNotification({
        type: 'error',
        title: 'Validation Error',
        message: firstError
      })
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update department. Please try again.'
      })
    }
  } finally {
    submitting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}
</script>