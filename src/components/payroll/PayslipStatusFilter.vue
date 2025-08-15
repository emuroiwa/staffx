<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Payslip Status Filter
      </h3>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      >
        Clear All
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Pay Frequency Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pay Frequency
        </label>
        <select
          v-model="localFilters.payFrequency"
          @change="emitFilters"
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Frequencies</option>
          <option value="weekly">Weekly</option>
          <option value="bi_weekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      </div>

      <!-- Payslip Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Payslip Status
        </label>
        <select
          v-model="localFilters.payslipStatus"
          @change="emitFilters"
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="finalized">Finalized</option>
        </select>
      </div>

      <!-- Department Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Department
        </label>
        <select
          v-model="localFilters.department"
          @change="emitFilters"
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
            {{ dept.name }}
          </option>
        </select>
      </div>

      <!-- Search Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search
        </label>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="localFilters.search"
            @input="emitFilters"
            type="text"
            placeholder="Search employees..."
            class="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Status Counts -->
    <div v-if="statusCounts" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Status Summary
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          @click="filterByStatus('draft')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            localFilters.payslipStatus === 'draft' 
              ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700' 
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          ]"
        >
          Draft ({{ statusCounts.draft || 0 }})
        </button>
        <button
          @click="filterByStatus('in_progress')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            localFilters.payslipStatus === 'in_progress' 
              ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' 
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          ]"
        >
          In Progress ({{ statusCounts.in_progress || 0 }})
        </button>
        <button
          @click="filterByStatus('finalized')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            localFilters.payslipStatus === 'finalized' 
              ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700' 
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          ]"
        >
          Finalized ({{ statusCounts.finalized || 0 }})
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap gap-2">
        <button
          @click="filterByFrequency('monthly')"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Monthly
        </button>
        <button
          @click="filterByFrequency('weekly')"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Weekly
        </button>
        <button
          @click="filterByFrequency('bi_weekly')"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Bi-weekly
        </button>
        <button
          @click="showOnlyDraft"
          class="px-3 py-1 text-sm border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Show Draft Only
        </button>
        <button
          @click="showOnlyFinalized"
          class="px-3 py-1 text-sm border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          Show Finalized Only
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  departments: {
    type: Array,
    default: () => []
  },
  statusCounts: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['filter-changed'])

// Local reactive filters
const localFilters = reactive({
  payFrequency: props.filters.payFrequency || '',
  payslipStatus: props.filters.payslipStatus || '',
  department: props.filters.department || '',
  search: props.filters.search || ''
})

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(localFilters).some(value => value !== '')
})

// Methods
const emitFilters = () => {
  emit('filter-changed', { ...localFilters })
}

const clearFilters = () => {
  Object.keys(localFilters).forEach(key => {
    localFilters[key] = ''
  })
  emitFilters()
}

const filterByStatus = (status) => {
  if (localFilters.payslipStatus === status) {
    localFilters.payslipStatus = ''
  } else {
    localFilters.payslipStatus = status
  }
  emitFilters()
}

const filterByFrequency = (frequency) => {
  if (localFilters.payFrequency === frequency) {
    localFilters.payFrequency = ''
  } else {
    localFilters.payFrequency = frequency
  }
  emitFilters()
}

const showOnlyDraft = () => {
  localFilters.payslipStatus = 'draft'
  emitFilters()
}

const showOnlyFinalized = () => {
  localFilters.payslipStatus = 'finalized'
  emitFilters()
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })
</script>