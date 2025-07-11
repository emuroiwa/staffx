<template>
  <div 
    v-if="shouldShow"
    :class="[
      'border-l-4 p-4 mb-6 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-r-lg',
      bannerClasses
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg 
            class="w-5 h-5" 
            :class="iconClasses"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="iconPath"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium" :class="textClasses">
            {{ bannerMessage }}
          </p>
          <p class="text-xs mt-1" :class="subTextClasses">
            {{ bannerSubMessage }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Upgrade Button -->
        <button
          @click="handleUpgrade"
          class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200"
          :class="buttonClasses"
        >
          Upgrade Now
        </button>
        
        <!-- Dismiss Button -->
        <button
          @click="dismiss"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Store
const authStore = useAuthStore()

// Local state
const dismissed = ref(false)

// Computed properties
const shouldShow = computed(() => {
  return !dismissed.value && (authStore.trialStatus === 'expiring_soon' || authStore.trialStatus === 'expired')
})

const isExpired = computed(() => authStore.trialStatus === 'expired')
const daysLeft = computed(() => authStore.trialDaysLeft)

const bannerClasses = computed(() => {
  if (isExpired.value) {
    return 'bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-500'
  }
  return 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-500'
})

const iconClasses = computed(() => {
  if (isExpired.value) {
    return 'text-red-400 dark:text-red-300'
  }
  return 'text-yellow-400 dark:text-yellow-300'
})

const textClasses = computed(() => {
  if (isExpired.value) {
    return 'text-red-800 dark:text-red-200'
  }
  return 'text-yellow-800 dark:text-yellow-200'
})

const subTextClasses = computed(() => {
  if (isExpired.value) {
    return 'text-red-600 dark:text-red-300'
  }
  return 'text-yellow-600 dark:text-yellow-300'
})

const buttonClasses = computed(() => {
  if (isExpired.value) {
    return 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
  }
  return 'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'
})

const iconPath = computed(() => {
  if (isExpired.value) {
    return 'M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z'
  }
  return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
})

const bannerMessage = computed(() => {
  if (isExpired.value) {
    return 'Your trial has expired'
  }
  return `Your trial expires in ${daysLeft.value} ${daysLeft.value === 1 ? 'day' : 'days'}`
})

const bannerSubMessage = computed(() => {
  if (isExpired.value) {
    return 'Upgrade now to continue using all features without interruption.'
  }
  return 'Upgrade to a paid plan to ensure uninterrupted access to all features.'
})

// Methods
function handleUpgrade() {
  // Navigate to upgrade/billing page
  console.log('Navigate to upgrade page')
}

function dismiss() {
  dismissed.value = true
}
</script>