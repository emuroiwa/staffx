<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Trial Status Banner -->
    <TrialBanner v-if="authStore.isHoldingCompanyAdmin && showTrialBanner" />
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Dashboard Overview for HCA -->
      <div v-if="authStore.isHoldingCompanyAdmin" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Companies -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Companies</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ companyStore.companyCount }}
                </p>
              </div>
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Companies -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Companies</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ companyStore.activeCompanies.length }}
                </p>
              </div>
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Default Company -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Default Company</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ companyStore.defaultCompany?.name || 'None set' }}
                </p>
              </div>
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Trial Status -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Trial Status</p>
                <p class="text-lg font-semibold" :class="trialStatusColor">
                  {{ trialStatusText }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="trialIconBg">
                <svg class="w-6 h-6" :class="trialIconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Companies List -->
      <CompanyList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'
import CompanyList from '@/components/ui/CompanyList.vue'
import TrialBanner from '@/components/ui/TrialBanner.vue'

// Stores
const authStore = useAuthStore()
const companyStore = useCompanyStore()

// Computed properties for trial status
const showTrialBanner = computed(() => {
  const status = authStore.trialStatus
  return status === 'expiring_soon' || status === 'expired'
})

const trialStatusText = computed(() => {
  const status = authStore.trialStatus
  const daysLeft = authStore.trialDaysLeft
  
  switch (status) {
    case 'active':
      return `${daysLeft} days left`
    case 'expiring_soon':
      return `${daysLeft} days left`
    case 'expired':
      return 'Expired'
    case 'no_trial':
      return 'No trial'
    default:
      return 'Unknown'
  }
})

const trialStatusColor = computed(() => {
  const status = authStore.trialStatus
  
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400'
    case 'expiring_soon':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'expired':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

const trialIconBg = computed(() => {
  const status = authStore.trialStatus
  
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900'
    case 'expiring_soon':
      return 'bg-yellow-100 dark:bg-yellow-900'
    case 'expired':
      return 'bg-red-100 dark:bg-red-900'
    default:
      return 'bg-gray-100 dark:bg-gray-900'
  }
})

const trialIconColor = computed(() => {
  const status = authStore.trialStatus
  
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400'
    case 'expiring_soon':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'expired':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

// Initialize data on mount
onMounted(async () => {
  if (authStore.isHoldingCompanyAdmin) {
    try {
      await companyStore.fetchDefaultCompany()
    } catch (error) {
      // Default company might not be set yet, which is okay
      console.log('No default company set')
    }
  }
})
</script>