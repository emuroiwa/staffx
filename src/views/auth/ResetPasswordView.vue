<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <div
        class="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4"
      >
        <ShieldCheck class="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Enter your new password below</p>
    </div>

    <!-- Success Message -->
    <div
      v-if="passwordReset"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <div class="flex items-center">
        <CheckCircle class="h-5 w-5 text-green-400 mr-2" />
        <div>
          <p class="text-sm font-medium text-green-800 dark:text-green-200">
            Password reset successfully!
          </p>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">
            You can now sign in with your new password.
          </p>
        </div>
      </div>
    </div>

    <!-- Reset Password Form -->
    <form v-if="!passwordReset" @submit.prevent="handleResetPassword" class="space-y-6">
      <!-- Password Field -->
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          New password
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
            placeholder="Enter your new password"
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
          Confirm new password
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
            placeholder="Confirm your new password"
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

      <!-- Password Requirements -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Password requirements:
        </h4>
        <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center">
            <CheckCircle v-if="passwordRequirements.length" class="w-4 h-4 text-green-500 mr-2" />
            <XCircle v-else class="w-4 h-4 text-gray-400 mr-2" />
            At least 8 characters long
          </li>
          <li class="flex items-center">
            <CheckCircle
              v-if="passwordRequirements.uppercase"
              class="w-4 h-4 text-green-500 mr-2"
            />
            <XCircle v-else class="w-4 h-4 text-gray-400 mr-2" />
            One uppercase letter
          </li>
          <li class="flex items-center">
            <CheckCircle
              v-if="passwordRequirements.lowercase"
              class="w-4 h-4 text-green-500 mr-2"
            />
            <XCircle v-else class="w-4 h-4 text-gray-400 mr-2" />
            One lowercase letter
          </li>
          <li class="flex items-center">
            <CheckCircle v-if="passwordRequirements.number" class="w-4 h-4 text-green-500 mr-2" />
            <XCircle v-else class="w-4 h-4 text-gray-400 mr-2" />
            One number
          </li>
        </ul>
      </div>

      <!-- Error Message -->
      <div
        v-if="resetError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div class="flex items-center">
          <AlertCircle class="h-5 w-5 text-red-400 mr-2" />
          <p class="text-sm text-red-800 dark:text-red-200">{{ resetError }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading || !isPasswordValid"
        class="w-full btn-primary flex justify-center items-center py-3 text-base font-medium"
        :class="{ 'opacity-50 cursor-not-allowed': loading || !isPasswordValid }"
      >
        <div v-if="loading" class="loading-spinner w-5 h-5 mr-2"></div>
        <Key v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>

    <!-- Success Actions -->
    <div v-if="passwordReset" class="space-y-4">
      <router-link
        to="/auth/login"
        class="w-full btn-primary flex justify-center items-center py-3 text-base font-medium"
      >
        <LogIn class="w-5 h-5 mr-2" />
        Sign in now
      </router-link>
    </div>

    <!-- Back to Login -->
    <div v-if="!passwordReset" class="text-center">
      <router-link
        to="/auth/login"
        class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        Back to sign in
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  LogIn
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Get token from URL
const token = route.query.token

// Redirect if no token
if (!token) {
  router.push('/auth/forgot-password')
}

// Form state
const form = reactive({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const passwordReset = ref(false)
const resetError = ref('')
const errors = reactive({
  password: '',
  confirmPassword: ''
})

// Password requirements validation
const passwordRequirements = computed(() => ({
  length: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password),
  number: /\d/.test(form.password)
}))

const isPasswordValid = computed(() => {
  return Object.values(passwordRequirements.value).every(req => req)
})

// Watch for password changes to clear errors
watch(
  () => form.password,
  () => {
    if (errors.password) errors.password = ''
  }
)

watch(
  () => form.confirmPassword,
  () => {
    if (errors.confirmPassword) errors.confirmPassword = ''
  }
)

// Validation
function validateForm() {
  errors.password = ''
  errors.confirmPassword = ''

  let isValid = true

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (!isPasswordValid.value) {
    errors.password = 'Password does not meet requirements'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

// Handle reset password
async function handleResetPassword() {
  if (!validateForm()) return

  loading.value = true
  resetError.value = ''

  try {
    await authStore.resetPassword({
      token: token,
      password: form.password
    })

    passwordReset.value = true
  } catch (error) {
    resetError.value = error.message || 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
