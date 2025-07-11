<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Companies</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and organize your company portfolio
        </p>
      </div>
      
      <button
        @click="showCreateForm = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Company
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <svg 
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search companies..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center space-x-3">
          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          <!-- Per Page -->
          <select
            v-model="perPage"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="10">10 per page</option>
            <option value="15">15 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Companies Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading skeletons -->
      <div v-for="n in 6" :key="n" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
      </div>
    </div>

    <div v-else-if="companies.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No companies found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first company' }}
      </p>
      <div class="mt-6">
        <button
          @click="showCreateForm = true"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Company
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CompanyCard
        v-for="company in companies"
        :key="company.id"
        :company="company"
        :is-default="company.id === defaultCompanyId"
        :can-set-default="true"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @set-default="handleSetDefault"
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="goToPage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Page {{ pagination.current_page }} of {{ pagination.last_page }}
        </span>
        
        <button
          @click="goToPage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div 
      v-if="showCreateForm || showEditForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <CompanyForm
            :company="editingCompany"
            :loading="formLoading"
            @submit="handleFormSubmit"
            @close="closeForm"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delete Company</h3>
          </div>
        </div>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>{{ deletingCompany?.name }}</strong>? 
          This action cannot be undone and will permanently remove all company data.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleteLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg flex items-center space-x-2"
          >
            <svg 
              v-if="deleteLoading" 
              class="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { Company } from '@/types/company'
import CompanyCard from './CompanyCard.vue'
import CompanyForm from './CompanyForm.vue'

// Store
const companyStore = useCompanyStore()

// Local state
const searchQuery = ref('')
const statusFilter = ref('')
const perPage = ref('15')
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showDeleteModal = ref(false)
const editingCompany = ref<Company | null>(null)
const deletingCompany = ref<Company | null>(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Search debounce
let searchTimeout: NodeJS.Timeout

// Computed
const companies = computed(() => companyStore.companies)
const pagination = computed(() => companyStore.pagination)
const loading = computed(() => companyStore.loading)
const defaultCompanyId = computed(() => companyStore.defaultCompany?.id)

// Methods
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

function applyFilters() {
  companyStore.setFilters({
    search: searchQuery.value,
    is_active: statusFilter.value,
    per_page: parseInt(perPage.value)
  })
  companyStore.fetchCompanies(1)
}

function goToPage(page: number) {
  if (page >= 1 && page <= pagination.value.last_page) {
    companyStore.fetchCompanies(page)
  }
}

function handleView(company: Company) {
  // Navigate to company detail view
  console.log('View company:', company)
}

function handleEdit(company: Company) {
  editingCompany.value = company
  showEditForm.value = true
}

function handleDelete(company: Company) {
  deletingCompany.value = company
  showDeleteModal.value = true
}

async function handleSetDefault(company: Company) {
  try {
    await companyStore.setDefaultCompany(company.id)
    // Show success message
  } catch (error) {
    console.error('Failed to set default company:', error)
    // Show error message
  }
}

async function handleFormSubmit(data: Partial<Company>) {
  formLoading.value = true
  try {
    if (editingCompany.value) {
      await companyStore.updateCompany(editingCompany.value.id, data)
    } else {
      await companyStore.createCompany(data)
    }
    closeForm()
    // Show success message
  } catch (error) {
    console.error('Failed to save company:', error)
    // Show error message
  } finally {
    formLoading.value = false
  }
}

async function confirmDelete() {
  if (!deletingCompany.value) return
  
  deleteLoading.value = true
  try {
    await companyStore.deleteCompany(deletingCompany.value.id)
    showDeleteModal.value = false
    deletingCompany.value = null
    // Show success message
  } catch (error) {
    console.error('Failed to delete company:', error)
    // Show error message
  } finally {
    deleteLoading.value = false
  }
}

function closeForm() {
  showCreateForm.value = false
  showEditForm.value = false
  editingCompany.value = null
}

// Initialize
onMounted(async () => {
  await companyStore.fetchCompanies()
  await companyStore.fetchDefaultCompany()
})
</script>