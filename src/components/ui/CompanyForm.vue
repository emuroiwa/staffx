<template>
  <div class="max-w-4xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Company' : 'Create New Company' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ isEditing ? 'Update company information' : 'Add a new company to your portfolio' }}
          </p>
        </div>
        
        <button
          type="button"
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Company Name -->
          <div class="md:col-span-2">
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter company name"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="company@example.com"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              id="website"
              v-model="form.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://company.com"
            />
          </div>

          <!-- Tax ID -->
          <div>
            <label for="tax_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax ID
            </label>
            <input
              id="tax_id"
              v-model="form.tax_id"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="12-3456789"
            />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Address -->
          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Street Address
            </label>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter street address"
            ></textarea>
          </div>

          <!-- City -->
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="City"
            />
          </div>

          <!-- State -->
          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State/Province
            </label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="State or Province"
            />
          </div>

          <!-- Postal Code -->
          <div>
            <label for="postal_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Postal Code
            </label>
            <input
              id="postal_code"
              v-model="form.postal_code"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="12345"
            />
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <input
              id="country"
              v-model="form.country"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Active Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Company is active
              </span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Inactive companies cannot access the system
            </p>
          </div>

          <!-- Subscription Expiry -->
          <div>
            <label for="subscription_expires_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subscription Expires
            </label>
            <input
              id="subscription_expires_at"
              v-model="form.subscription_expires_at"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty for no expiry
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          :disabled="loading || !form.name"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
        >
          <svg 
            v-if="loading" 
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isEditing ? 'Update Company' : 'Create Company' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Company } from '@/types/company'

interface Props {
  company?: Company | null
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<Company>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  company: null,
  loading: false
})

const emit = defineEmits<Emits>()

// Computed
const isEditing = computed(() => !!props.company)

// Form data
const form = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  tax_id: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_active: true,
  subscription_expires_at: ''
})

// Initialize form with company data if editing
function initializeForm() {
  if (props.company) {
    Object.assign(form, {
      name: props.company.name || '',
      email: props.company.email || '',
      phone: props.company.phone || '',
      website: props.company.website || '',
      tax_id: props.company.tax_id || '',
      address: props.company.address || '',
      city: props.company.city || '',
      state: props.company.state || '',
      postal_code: props.company.postal_code || '',
      country: props.company.country || '',
      is_active: props.company.is_active ?? true,
      subscription_expires_at: props.company.subscription_expires_at 
        ? new Date(props.company.subscription_expires_at).toISOString().split('T')[0]
        : ''
    })
  }
}

// Methods
function handleSubmit() {
  const submitData = { ...form }
  
  // Convert empty strings to null for optional fields
  Object.keys(submitData).forEach(key => {
    if (submitData[key] === '') {
      submitData[key] = null
    }
  })
  
  emit('submit', submitData)
}

// Watch for company changes
watch(() => props.company, initializeForm, { immediate: true })

onMounted(initializeForm)
</script>