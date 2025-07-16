<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-300 font-medium text-sm">
              {{ getInitials(employee?.first_name, employee?.last_name) }}
            </span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ employee?.display_name }} - Garnishment Management
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ employee?.employee_id }} • {{ employee?.position?.name }} • {{ employee?.department?.name }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-hidden">
        <div class="h-full p-6">
          <GarnishmentList
            v-if="employee?.uuid"
            :employee-uuid="employee.uuid"
            @garnishment-updated="handleGarnishmentUpdated"
            class="h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import GarnishmentList from './GarnishmentList.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const handleGarnishmentUpdated = () => {
  emit('updated')
}
</script>