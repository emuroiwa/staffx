<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Statutory Deduction Management
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Configure employer-paid statutory deductions and taxable benefits
            </p>
          </div>
          <button
            @click="openAddConfigModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Configuration
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              v-model="filters.active"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            >
              <option value="">All Configurations</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div class="flex-1 min-w-64">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search configurations..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>
          </div>

          <div class="flex items-end">
            <button
              @click="loadConfigurations"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <StatutoryDeductionConfigList
        :configurations="configurations"
        :loading="loading"
        @edit="openEditConfigModal"
        @delete="handleDeleteConfiguration"
        @toggle-status="handleToggleStatus"
        @preview="openPreviewModal"
      />
    </div>

    <!-- Add/Edit Configuration Modal -->
    <StatutoryDeductionConfigModal
      :is-open="isConfigModalOpen"
      :configuration="selectedConfiguration"
      :available-templates="availableTemplates"
      @close="closeConfigModal"
      @save="handleSaveConfiguration"
    />

    <!-- Preview Modal -->
    <StatutoryDeductionPreviewModal
      :is-open="isPreviewModalOpen"
      :configuration="selectedConfiguration"
      @close="closePreviewModal"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { PlusIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import StatutoryDeductionConfigList from '@/components/payroll/StatutoryDeductionConfigList.vue'
import StatutoryDeductionConfigModal from '@/components/payroll/StatutoryDeductionConfigModal.vue'
import StatutoryDeductionPreviewModal from '@/components/payroll/StatutoryDeductionPreviewModal.vue'
import statutoryDeductionService from '@/services/statutoryDeductionService'

export default {
  name: 'StatutoryDeductionManagement',
  components: {
    StatutoryDeductionConfigList,
    StatutoryDeductionConfigModal,
    StatutoryDeductionPreviewModal,
    PlusIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
  },
  setup() {
    const { showNotification } = useNotifications()
    
    // Reactive data
    const configurations = ref([])
    const availableTemplates = ref([])
    const loading = ref(false)
    const searchTerm = ref('')
    const filters = ref({
      active: ''
    })
    
    // Modal states
    const isConfigModalOpen = ref(false)
    const isPreviewModalOpen = ref(false)
    const selectedConfiguration = ref(null)
    
    // Computed properties
    const filteredConfigurations = computed(() => {
      let filtered = configurations.value
      
      // Filter by search term
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(config => 
          config.statutory_deduction_template?.name.toLowerCase().includes(term) ||
          config.statutory_deduction_template?.code.toLowerCase().includes(term)
        )
      }
      
      return filtered
    })
    
    // Methods
    const loadConfigurations = async () => {
      try {
        loading.value = true
        const params = {}
        
        if (filters.value.active) {
          params.active = filters.value.active
        }
        
        const response = await statutoryDeductionService.getConfigurations(params)
        configurations.value = response.data.data || []
      } catch (error) {
        console.error('Error loading configurations:', error)
        showNotification('Failed to load configurations', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const loadAvailableTemplates = async () => {
      try {
        const response = await statutoryDeductionService.getAvailableTemplates()
        availableTemplates.value = response.data || []
      } catch (error) {
        console.error('Error loading templates:', error)
        showNotification('Failed to load available templates', 'error')
      }
    }
    
    const openAddConfigModal = () => {
      selectedConfiguration.value = null
      isConfigModalOpen.value = true
    }
    
    const openEditConfigModal = (configuration) => {
      selectedConfiguration.value = configuration
      isConfigModalOpen.value = true
    }
    
    const closeConfigModal = () => {
      isConfigModalOpen.value = false
      selectedConfiguration.value = null
    }
    
    const handleSaveConfiguration = async (configData) => {
      try {
        if (selectedConfiguration.value) {
          // Update existing configuration
          await statutoryDeductionService.updateConfiguration(selectedConfiguration.value.uuid, configData)
          showNotification('Configuration updated successfully', 'success')
        } else {
          // Create new configuration
          await statutoryDeductionService.createConfiguration(configData)
          showNotification('Configuration created successfully', 'success')
        }
        
        closeConfigModal()
        await loadConfigurations()
      } catch (error) {
        console.error('Error saving configuration:', error)
        showNotification('Failed to save configuration', 'error')
      }
    }
    
    const handleDeleteConfiguration = async (configuration) => {
      if (confirm(`Are you sure you want to delete the configuration for ${configuration.statutory_deduction_template?.name}?`)) {
        try {
          await statutoryDeductionService.deleteConfiguration(configuration.uuid)
          showNotification('Configuration deleted successfully', 'success')
          await loadConfigurations()
        } catch (error) {
          console.error('Error deleting configuration:', error)
          showNotification('Failed to delete configuration', 'error')
        }
      }
    }
    
    const handleToggleStatus = async (configuration) => {
      try {
        await statutoryDeductionService.toggleStatus(configuration.uuid)
        showNotification(`Configuration ${configuration.is_active ? 'deactivated' : 'activated'} successfully`, 'success')
        await loadConfigurations()
      } catch (error) {
        console.error('Error toggling status:', error)
        showNotification('Failed to toggle configuration status', 'error')
      }
    }
    
    const openPreviewModal = (configuration) => {
      selectedConfiguration.value = configuration
      isPreviewModalOpen.value = true
    }
    
    const closePreviewModal = () => {
      isPreviewModalOpen.value = false
      selectedConfiguration.value = null
    }
    
    // Watch for filter changes
    watch([filters, searchTerm], () => {
      // Debounce search
      if (searchTerm.value) {
        setTimeout(() => {
          loadConfigurations()
        }, 300)
      } else {
        loadConfigurations()
      }
    }, { deep: true })
    
    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        loadConfigurations(),
        loadAvailableTemplates()
      ])
    })
    
    return {
      configurations: filteredConfigurations,
      availableTemplates,
      loading,
      searchTerm,
      filters,
      isConfigModalOpen,
      isPreviewModalOpen,
      selectedConfiguration,
      loadConfigurations,
      openAddConfigModal,
      openEditConfigModal,
      closeConfigModal,
      handleSaveConfiguration,
      handleDeleteConfiguration,
      handleToggleStatus,
      openPreviewModal,
      closePreviewModal
    }
  }
}
</script>