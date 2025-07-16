<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Payroll Templates</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage company-wide allowances, deductions, and employer contributions</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DocumentTextIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Templates</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pagination?.total || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeTemplatesCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <PlusCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Allowances</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ allowancesCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <MinusCircleIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Deductions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ deductionsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BuildingOfficeIcon class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Employer Contributions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ employerContributionsCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                id="search"
                placeholder="Search templates..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              v-model="filters.type"
              id="type"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchTemplates"
            >
              <option value="">All Types</option>
              <option value="allowance">Allowances</option>
              <option value="deduction">Deductions</option>
              <option value="employer_contribution">Employer Contributions</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.is_active"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchTemplates"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Templates</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Templates Grid -->
        <div v-else-if="templates && templates.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="template in templates"
              :key="template.uuid"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                          template.type === 'allowance'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : template.type === 'employer_contribution'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        ]"
                      >
                        {{ getTemplateTypeLabel(template.type) }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          template.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        ]"
                      >
                        {{ template.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ template.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {{ template.code }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ template.description }}
                    </p>
                  </div>
                  <div class="relative">
                    <button
                      @click="toggleDropdown(template.uuid)"
                      class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      <EllipsisVerticalIcon class="w-5 h-5" />
                    </button>
                    <div
                      v-if="activeDropdown === template.uuid"
                      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600"
                    >
                      <div class="py-1">
                        <button
                          @click="editTemplate(template)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          Edit Template
                        </button>
                        <button
                          @click="testCalculation(template)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          Test Calculation
                        </button>
                        <button
                          @click="toggleTemplateStatus(template)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {{ template.is_active ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button
                          @click="deleteTemplate(template)"
                          class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          Delete Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Method:</span>
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatCalculationMethod(template.calculation_method) }}
                    </span>
                  </div>
                  <div v-if="template.amount" class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatCurrency(template.amount) }}
                    </span>
                  </div>
                  <div v-if="template.default_percentage" class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Percentage:</span>
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ template.default_percentage }}%
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Taxable:</span>
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ template.is_taxable ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first payroll template.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ pagination.from || ((pagination.current_page - 1) * pagination.per_page + 1) }} to {{ pagination.to || Math.min(pagination.current_page * pagination.per_page, pagination.total) }} of {{ pagination.total }} results
              </div>
              <div class="flex items-center space-x-2">
                <label for="per-page-templates" class="text-sm text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="per-page-templates"
                  v-model="currentPerPage"
                  @change="changePerPage"
                  class="block px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="text-sm text-gray-700 dark:text-gray-300">per page</span>
              </div>
            </div>
            <div v-if="pagination.last_page > 1" class="flex items-center space-x-2">
              <button
                @click="handlePageChange(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
              </span>
              <button
                @click="handlePageChange(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <PayrollTemplateModal
      v-if="showCreateModal || showEditModal"
      :is-open="showCreateModal || showEditModal"
      :template="editingTemplate"
      @close="closeModal"
      @saved="handleTemplateSaved"
    />

    <!-- Test Calculation Modal -->
    <TestCalculationModal
      v-if="showTestModal"
      :is-open="showTestModal"
      :template="testingTemplate"
      @close="showTestModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import {
  PlusIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import PayrollTemplateModal from '@/components/payroll/PayrollTemplateModal.vue'
import TestCalculationModal from '@/components/payroll/TestCalculationModal.vue'

const { get, post, delete: deleteRequest } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const templates = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15
})

const filters = reactive({
  type: '',
  is_active: ''
})

const searchQuery = ref('')
const currentPerPage = ref(15)

// Methods
const fetchTemplates = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: pagination.value.per_page,
      ...filters
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await get('/payroll-templates', { params })
    
    // API returns paginated data directly in response.data.data structure
    const responseData = response.data.data || {}
    templates.value = responseData.data || []
    pagination.value = {
      current_page: responseData.current_page || 1,
      last_page: responseData.last_page || 1,
      total: responseData.total || 0,
      per_page: responseData.per_page || 15,
      from: responseData.from || 0,
      to: responseData.to || 0
    }
  } catch (error) {
    templates.value = [] // Ensure templates is always an array
    showNotification('Error fetching templates', 'error')
    console.error('Error fetching templates:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  fetchTemplates()
}, 300)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showTestModal = ref(false)
const editingTemplate = ref(null)
const testingTemplate = ref(null)

// Dropdown state
const activeDropdown = ref(null)

const handlePageChange = (page) => {
  fetchTemplates(page)
}

const changePerPage = () => {
  pagination.value.per_page = parseInt(currentPerPage.value)
  pagination.value.current_page = 1  // Reset to first page when changing per-page
  fetchTemplates(1)
}

const toggleDropdown = (templateId) => {
  activeDropdown.value = activeDropdown.value === templateId ? null : templateId
}

const editTemplate = (template) => {
  editingTemplate.value = template
  showEditModal.value = true
  activeDropdown.value = null
}

const testCalculation = (template) => {
  testingTemplate.value = template
  showTestModal.value = true
  activeDropdown.value = null
}

const toggleTemplateStatus = async (template) => {
  try {
    await post(`/payroll-templates/${template.uuid}/toggle-status`)
    showNotification(
      `Template ${template.is_active ? 'deactivated' : 'activated'} successfully`,
      'success'
    )
    fetchTemplates(pagination.value.current_page)
  } catch (error) {
    showNotification('Error updating template status', 'error')
    console.error('Error updating template status:', error)
  }
  activeDropdown.value = null
}

const deleteTemplate = async (template) => {
  if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
    return
  }

  try {
    await deleteRequest(`/payroll-templates/${template.uuid}`)
    showNotification('Template deleted successfully', 'success')
    fetchTemplates(pagination.value.current_page)
  } catch (error) {
    showNotification(
      error.response?.data?.message || 'Error deleting template',
      'error'
    )
    console.error('Error deleting template:', error)
  }
  activeDropdown.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTemplate.value = null
}

const handleTemplateSaved = () => {
  closeModal()
  fetchTemplates(pagination.value.current_page)
  showNotification('Template saved successfully', 'success')
}

const formatCalculationMethod = (method) => {
  const methods = {
    fixed_amount: 'Fixed Amount',
    percentage_of_salary: 'Percentage of Salary',
    percentage_of_basic: 'Percentage of Basic',
    formula: 'Formula Based'
  }
  return methods[method] || method
}

const getTemplateTypeLabel = (type) => {
  const types = {
    allowance: 'Allowance',
    deduction: 'Deduction',
    employer_contribution: 'Employer Contribution'
  }
  return types[type] || type
}

// Computed statistics
const activeTemplatesCount = computed(() => {
  return Array.isArray(templates.value) ? templates.value.filter(t => t.is_active).length : 0
})

const allowancesCount = computed(() => {
  return Array.isArray(templates.value) ? templates.value.filter(t => t.type === 'allowance').length : 0
})

const deductionsCount = computed(() => {
  return Array.isArray(templates.value) ? templates.value.filter(t => t.type === 'deduction').length : 0
})

const employerContributionsCount = computed(() => {
  return Array.isArray(templates.value) ? templates.value.filter(t => t.type === 'employer_contribution').length : 0
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  fetchTemplates()
  document.addEventListener('click', handleClickOutside)
})
</script>