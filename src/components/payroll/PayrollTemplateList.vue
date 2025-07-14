<template>
  <div class="payroll-template-list">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Payroll Templates
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage company-wide allowances and deductions
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Create Template
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            v-model="filters.type"
            @change="fetchTemplates"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="allowance">Allowances</option>
            <option value="deduction">Deductions</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="filters.is_active"
            @change="fetchTemplates"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Search templates..."
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
        </div>
      </div>
    </div>

    <!-- Templates Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      <p class="text-gray-600 dark:text-gray-400 mt-4">Loading templates...</p>
    </div>

    <div v-else-if="templates.length === 0" class="text-center py-12">
      <DocumentIcon class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No templates found
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Create your first payroll template to get started
      </p>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        Create Template
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templates"
        :key="template.uuid"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center mb-2">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    template.type === 'allowance'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ template.type === 'allowance' ? 'Allowance' : 'Deduction' }}
                </span>
                <span
                  :class="[
                    'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
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
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <EllipsisVerticalIcon class="w-5 h-5" />
              </button>
              <div
                v-if="activeDropdown === template.uuid"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
              >
                <div class="py-1">
                  <button
                    @click="editTemplate(template)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Edit Template
                  </button>
                  <button
                    @click="testCalculation(template)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Test Calculation
                  </button>
                  <button
                    @click="toggleTemplateStatus(template)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {{ template.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button
                    @click="deleteTemplate(template)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
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

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.per_page" class="mt-8">
      <Pagination
        :current-page="pagination.current_page"
        :total-pages="pagination.last_page"
        :total-items="pagination.total"
        :per-page="pagination.per_page"
        @page-change="handlePageChange"
      />
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

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useApi } from '@/composables/useApi'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { formatCurrency } from '@/utils/currency'
import {
  PlusIcon,
  DocumentIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import Pagination from '@/components/shared/Pagination.vue'
import PayrollTemplateModal from './PayrollTemplateModal.vue'
import TestCalculationModal from './TestCalculationModal.vue'

export default {
  name: 'PayrollTemplateList',
  components: {
    PlusIcon,
    DocumentIcon,
    EllipsisVerticalIcon,
    Pagination,
    PayrollTemplateModal,
    TestCalculationModal
  },
  setup() {
    const router = useRouter()
    const { showNotification } = useNotifications()
    const { get, post, delete: deleteRequest } = useApi()

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
        templates.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page
        }
      } catch (error) {
        showNotification('Error fetching templates', 'error')
        console.error('Error fetching templates:', error)
      } finally {
        loading.value = false
      }
    }

    const debouncedSearch = useDebouncedRef(searchQuery, 300, fetchTemplates)

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

    return {
      loading,
      templates,
      pagination,
      filters,
      searchQuery,
      debouncedSearch,
      showCreateModal,
      showEditModal,
      showTestModal,
      editingTemplate,
      testingTemplate,
      activeDropdown,
      fetchTemplates,
      handlePageChange,
      toggleDropdown,
      editTemplate,
      testCalculation,
      toggleTemplateStatus,
      deleteTemplate,
      closeModal,
      handleTemplateSaved,
      formatCalculationMethod,
      formatCurrency
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
</style>