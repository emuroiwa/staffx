<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">{{ position.name }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Name</label>
            <p class="text-sm text-gray-900">{{ position.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Description</label>
            <p class="text-sm text-gray-900">{{ position.description || 'No description' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Status</label>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {{ position.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Close
        </button>
        <button
          @click="$emit('updated')"
          type="button"
          class="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit Position
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  position: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])
</script>