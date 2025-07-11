<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 overflow-hidden">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-start justify-between">
        <!-- Company Info -->
        <div class="flex items-center space-x-4 flex-1">
          <!-- Logo/Avatar -->
          <div class="flex-shrink-0">
            <div v-if="company.logo_path" class="w-12 h-12 rounded-lg overflow-hidden">
              <img 
                :src="logoUrl" 
                :alt="`${company.name} logo`"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg font-semibold">
                {{ companyInitials }}
              </span>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ company.name }}
              </h3>
              
              <!-- Default Badge -->
              <span 
                v-if="isDefault"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Default
              </span>
              
              <!-- Status Badge -->
              <span 
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  company.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                {{ company.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ company.email || 'No email set' }}
            </p>
            
            <!-- Stats -->
            <div class="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span v-if="company.users">{{ company.users.length }} users</span>
              <span v-if="company.employees">{{ company.employees.length }} employees</span>
              <span v-if="company.city || company.country">
                {{ [company.city, company.country].filter(Boolean).join(', ') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Menu -->
        <div class="flex-shrink-0 relative" v-if="showActions">
          <button
            @click="showMenu = !showMenu"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
            @click.stop
          >
            <button
              @click="handleView"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>View Details</span>
            </button>

            <button
              @click="handleEdit"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Edit</span>
            </button>

            <button
              v-if="!isDefault && canSetDefault"
              @click="handleSetDefault"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Set as Default</span>
            </button>

            <hr class="my-1 border-gray-200 dark:border-gray-600">

            <button
              @click="handleDelete"
              class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Subscription Status -->
      <div v-if="company.subscription_expires_at" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Subscription</span>
          <span 
            :class="[
              'text-sm font-medium',
              subscriptionDaysLeft > 7 
                ? 'text-green-600 dark:text-green-400'
                : subscriptionDaysLeft > 0
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            ]"
          >
            {{ subscriptionStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- Click Outside to close menu -->
    <div 
      v-if="showMenu"
      @click="showMenu = false"
      class="fixed inset-0 z-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Company } from '@/types/company'

interface Props {
  company: Company
  isDefault?: boolean
  showActions?: boolean
  canSetDefault?: boolean
}

interface Emits {
  (e: 'view', company: Company): void
  (e: 'edit', company: Company): void
  (e: 'delete', company: Company): void
  (e: 'setDefault', company: Company): void
}

const props = withDefaults(defineProps<Props>(), {
  isDefault: false,
  showActions: true,
  canSetDefault: false
})

const emit = defineEmits<Emits>()

// Local state
const showMenu = ref(false)

// Computed properties
const companyInitials = computed(() => {
  if (!props.company.name) return 'C'
  return props.company.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const logoUrl = computed(() => {
  if (!props.company.logo_path) return null
  return `/storage/${props.company.logo_path}`
})

const subscriptionDaysLeft = computed(() => {
  if (!props.company.subscription_expires_at) return 0
  const expiryDate = new Date(props.company.subscription_expires_at)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const subscriptionStatus = computed(() => {
  if (!props.company.subscription_expires_at) return 'No expiry'
  
  const daysLeft = subscriptionDaysLeft.value
  if (daysLeft > 30) {
    return `${daysLeft} days left`
  } else if (daysLeft > 0) {
    return `Expires in ${daysLeft} days`
  } else {
    return 'Expired'
  }
})

// Methods
function handleView() {
  showMenu.value = false
  emit('view', props.company)
}

function handleEdit() {
  showMenu.value = false
  emit('edit', props.company)
}

function handleDelete() {
  showMenu.value = false
  emit('delete', props.company)
}

function handleSetDefault() {
  showMenu.value = false
  emit('setDefault', props.company)
}
</script>