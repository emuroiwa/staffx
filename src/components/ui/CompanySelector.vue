<template>
  <div class="relative">
    <!-- Company Info Display -->
    <div class="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg border">
      <!-- Company Logo/Icon -->
      <div class="flex-shrink-0">
        <div v-if="company?.logo_path" class="w-8 h-8 rounded-lg overflow-hidden">
          <img 
            :src="logoUrl" 
            :alt="`${company.name} logo`"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white text-sm font-semibold">
            {{ companyInitials }}
          </span>
        </div>
      </div>

      <!-- Company Details -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h3 class="text-sm font-semibold text-gray-900 truncate">
            {{ companyName }}
          </h3>
          
          <!-- Status Indicators -->
          <div class="flex items-center space-x-1">
            <!-- Active Status -->
            <div 
              v-if="isActive"
              class="w-2 h-2 bg-green-400 rounded-full"
              title="Company Active"
            ></div>
            <div 
              v-else
              class="w-2 h-2 bg-red-400 rounded-full"
              title="Company Inactive"
            ></div>
            
            <!-- Subscription Status -->
            <div 
              v-if="hasActiveSubscription"
              class="w-2 h-2 bg-blue-400 rounded-full"
              title="Active Subscription"
            ></div>
            <div 
              v-else
              class="w-2 h-2 bg-yellow-400 rounded-full"
              title="Subscription Expired"
            ></div>
          </div>
        </div>
        
        <p class="text-xs text-gray-500 truncate">
          {{ company?.email || 'No email set' }}
        </p>
      </div>

      <!-- Settings Link -->
      <button
        @click="$router.push('/company/settings')"
        class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Company Settings"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
    </div>

    <!-- Subscription Warning -->
    <div 
      v-if="!hasActiveSubscription && isActive"
      class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <span class="text-xs text-yellow-800">
          Subscription expired. Some features may be limited.
        </span>
      </div>
    </div>

    <!-- Inactive Company Warning -->
    <div 
      v-if="!isActive"
      class="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-xs text-red-800">
          Company account is inactive. Contact support.
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div 
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCompanyStore } from '@/stores/company'

const companyStore = useCompanyStore()

// Computed properties
const company = computed(() => companyStore.company)
const loading = computed(() => companyStore.loading)
const companyName = computed(() => companyStore.companyName)
const hasActiveSubscription = computed(() => companyStore.hasActiveSubscription)
const isActive = computed(() => companyStore.isActive)

const companyInitials = computed(() => {
  if (!company.value?.name) return 'C'
  return company.value.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const logoUrl = computed(() => {
  if (!company.value?.logo_path) return null
  // Assuming logo_path is relative to the storage public URL
  return `/storage/${company.value.logo_path}`
})
</script>