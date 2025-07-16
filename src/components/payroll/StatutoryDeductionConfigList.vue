<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- Loading state -->
    <div v-if="loading" class="p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="configurations.length === 0" class="p-8 text-center">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No configurations found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first statutory deduction configuration.
      </p>
    </div>

    <!-- Configuration table -->
    <div v-else class="overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Deduction
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Configuration
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Rate Overrides
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Effective Period
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="config in configurations" :key="config.uuid" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <!-- Deduction Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-300 font-medium text-sm">
                    {{ config.statutory_deduction_template?.code?.substring(0, 2) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ config.statutory_deduction_template?.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ config.statutory_deduction_template?.code }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Configuration -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="space-y-1">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    Employer Covers:
                  </span>
                  <span class="ml-2">
                    <span v-if="config.employer_covers_employee_portion" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Yes
                    </span>
                    <span v-else 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      No
                    </span>
                  </span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    Taxable Benefit:
                  </span>
                  <span class="ml-2">
                    <span v-if="config.is_taxable_if_employer_paid" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Yes
                    </span>
                    <span v-else 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      No
                    </span>
                  </span>
                </div>
              </div>
            </td>

            <!-- Rate Overrides -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                <div v-if="config.employer_rate_override || config.employee_rate_override">
                  <div v-if="config.employer_rate_override" class="mb-1">
                    Employer: {{ (config.employer_rate_override * 100).toFixed(2) }}%
                  </div>
                  <div v-if="config.employee_rate_override">
                    Employee: {{ (config.employee_rate_override * 100).toFixed(2) }}%
                  </div>
                </div>
                <span v-else class="text-gray-500 dark:text-gray-400">Default rates</span>
              </div>
            </td>

            <!-- Effective Period -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                <div>From: {{ formatDate(config.effective_from) }}</div>
                <div v-if="config.effective_to" class="text-gray-500 dark:text-gray-400">
                  To: {{ formatDate(config.effective_to) }}
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">
                  Ongoing
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="config.is_active" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <span class="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                Active
              </span>
              <span v-else 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <span class="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>
                Inactive
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <!-- Preview button -->
                <button
                  @click="$emit('preview', config)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Preview calculation"
                >
                  <EyeIcon class="w-4 h-4" />
                </button>
                
                <!-- Edit button -->
                <button
                  @click="$emit('edit', config)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  title="Edit configuration"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                
                <!-- Toggle status button -->
                <button
                  @click="$emit('toggle-status', config)"
                  :class="config.is_active ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                  :title="config.is_active ? 'Deactivate' : 'Activate'"
                >
                  <component :is="config.is_active ? XMarkIcon : CheckIcon" class="w-4 h-4" />
                </button>
                
                <!-- Delete button -->
                <button
                  @click="$emit('delete', config)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete configuration"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { 
  DocumentTextIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

export default {
  name: 'StatutoryDeductionConfigList',
  components: {
    DocumentTextIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon
  },
  props: {
    configurations: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'toggle-status', 'preview'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>