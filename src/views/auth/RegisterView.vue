<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Join thousands of companies using StaffX</p>
    </div>

    <!-- Register Form -->
    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- Name Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            First name
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            autocomplete="given-name"
            required
            class="form-input"
            placeholder="John"
            :class="{ 'border-red-500 dark:border-red-500': errors.firstName }"
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label
            for="lastName"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Last name
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            autocomplete="family-name"
            required
            class="form-input"
            placeholder="Doe"
            :class="{ 'border-red-500 dark:border-red-500': errors.lastName }"
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.lastName }}
          </p>
        </div>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            class="form-input pl-10"
            placeholder="john@company.com"
            :class="{ 'border-red-500 dark:border-red-500': errors.email }"
          />
        </div>
        <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.email }}
        </p>
      </div>

      <!-- Company Field -->
      <div>
        <label
          for="company"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Company name
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="company"
            v-model="form.company"
            type="text"
            autocomplete="organization"
            required
            class="form-input pl-10"
            placeholder="Acme Corporation"
            :class="{ 'border-red-500 dark:border-red-500': errors.company }"
          />
        </div>
        <p v-if="errors.company" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.company }}
        </p>
      </div>

      <!-- Country Field -->
      <div>
        <label
          for="country"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Country
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe class="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="country"
            v-model="form.countryUuid"
            required
            class="form-input pl-10"
            :class="{ 'border-red-500 dark:border-red-500': errors.countryUuid }"
          >
            <option value="">Select your country</option>
            <option
              v-for="country in countries"
              :key="country.uuid"
              :value="country.uuid"
            >
              {{ country.name }}
              <span v-if="!country.is_supported_for_payroll" class="text-gray-500">(Limited payroll support)</span>
            </option>
          </select>
        </div>
        <p v-if="errors.countryUuid" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.countryUuid }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            class="form-input pl-10 pr-10"
            placeholder="Create a strong password"
            :class="{ 'border-red-500 dark:border-red-500': errors.password }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Eye
              v-if="showPassword"
              class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            />
            <EyeOff
              v-else
              class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Confirm password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            class="form-input pl-10 pr-10"
            placeholder="Confirm your password"
            :class="{ 'border-red-500 dark:border-red-500': errors.confirmPassword }"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Eye
              v-if="showConfirmPassword"
              class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            />
            <EyeOff
              v-else
              class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Terms and Privacy -->
      <div class="flex items-start">
        <input
          id="terms"
          v-model="form.acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-1"
          :class="{ 'border-red-500 dark:border-red-500': errors.acceptTerms }"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the
          <a
            href="#"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Terms of Service
          </a>
          and
          <a
            href="#"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      <p v-if="errors.acceptTerms" class="text-sm text-red-600 dark:text-red-400">
        {{ errors.acceptTerms }}
      </p>

      <!-- Error Message -->
      <div
        v-if="registerError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div class="flex items-center">
          <AlertCircle class="h-5 w-5 text-red-400 mr-2" />
          <p class="text-sm text-red-800 dark:text-red-200">{{ registerError }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full btn-primary flex justify-center items-center py-3 text-base font-medium"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        <div v-if="loading" class="loading-spinner w-5 h-5 mr-2"></div>
        <UserPlus v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <!-- Sign In Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <router-link
          to="/auth/login"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Sign in here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import { Mail, Lock, Building2, Globe, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { get } = useApi()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  countryUuid: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Countries data
const countries = ref([])

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const registerError = ref('')
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  countryUuid: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

// Validation
function validateForm() {
  // Reset errors
  Object.keys(errors).forEach(key => (errors[key] = ''))

  let isValid = true

  if (!form.firstName) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.company) {
    errors.company = 'Company name is required'
    isValid = false
  }

  if (!form.countryUuid) {
    errors.countryUuid = 'Country is required'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

// Load countries
async function loadCountries() {
  try {
    const response = await get('/countries')
    // Extract data from API response structure
    const countriesData = response.data.data || response.data
    // Ensure boolean conversion for payroll support
    countries.value = countriesData.map(country => ({
      ...country,
      is_supported_for_payroll: Boolean(country.is_supported_for_payroll)
    }))
    console.log('Countries loaded:', countries.value)
  } catch (error) {
    console.error('Failed to load countries:', error)
  }
}

// Handle registration
async function handleRegister() {
  if (!validateForm()) return

  loading.value = true
  registerError.value = ''
  
  // Clear any previous server-side validation errors
  Object.keys(errors).forEach(key => (errors[key] = ''))

  try {
    const result = await authStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      company: form.company,
      countryUuid: form.countryUuid,
      password: form.password
    })

    // Redirect based on user role
    if (result.user.role === 'holding_company_admin') {
      router.push('/companies')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    // Handle validation errors from backend
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const validationErrors = error.response.data.errors
      
      // Map backend validation errors to form fields
      Object.keys(validationErrors).forEach(field => {
        // Map backend field names to frontend field names
        const fieldMap = {
          'first_name': 'firstName',
          'last_name': 'lastName',
          'email': 'email',
          'company': 'company',
          'country_uuid': 'countryUuid',
          'password': 'password'
        }
        
        const frontendField = fieldMap[field] || field
        if (errors.hasOwnProperty(frontendField)) {
          errors[frontendField] = validationErrors[field][0] // Take first error message
        }
      })
      
      // If there are validation errors, don't show general error
      registerError.value = ''
    } else {
      // Handle other types of errors
      registerError.value = error.response?.data?.message || error.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

// Load countries on mount
onMounted(() => {
  loadCountries()
})
</script>
