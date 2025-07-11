<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <div
        class="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4"
      >
        <KeyRound class="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Forgot your password?</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        No worries! Enter your email and we'll send you a reset link.
      </p>
    </div>

    <!-- Success Message -->
    <div
      v-if="emailSent"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <div class="flex items-center">
        <CheckCircle class="h-5 w-5 text-green-400 mr-2" />
        <div>
          <p class="text-sm font-medium text-green-800 dark:text-green-200">
            Email sent successfully!
          </p>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">
            Check your inbox for password reset instructions.
          </p>
        </div>
      </div>
    </div>

    <!-- Forgot Password Form -->
    <form v-if="!emailSent" @submit.prevent="handleForgotPassword" class="space-y-6">
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
            placeholder="Enter your email address"
            :class="{ 'border-red-500 dark:border-red-500': errors.email }"
          />
        </div>
        <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.email }}
        </p>
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
        :disabled="loading"
        class="w-full btn-primary flex justify-center items-center py-3 text-base font-medium"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        <div v-if="loading" class="loading-spinner w-5 h-5 mr-2"></div>
        <Send v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Sending...' : 'Send reset link' }}
      </button>
    </form>

    <!-- Success Actions -->
    <div v-if="emailSent" class="space-y-4">
      <button
        @click="resendEmail"
        :disabled="loading || cooldown > 0"
        class="w-full btn-secondary flex justify-center items-center py-3 text-base font-medium"
        :class="{ 'opacity-50 cursor-not-allowed': loading || cooldown > 0 }"
      >
        <div v-if="loading" class="loading-spinner w-5 h-5 mr-2"></div>
        <RotateCcw v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email' }}
      </button>

      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <div class="flex items-start">
          <Info class="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Didn't receive the email?
            </p>
            <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Try resending after a few minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Login -->
    <div class="text-center">
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
import { ref, reactive, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  KeyRound,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  RotateCcw
} from 'lucide-vue-next'

const authStore = useAuthStore()

// Form state
const form = reactive({
  email: ''
})

const loading = ref(false)
const emailSent = ref(false)
const resetError = ref('')
const cooldown = ref(0)
const errors = reactive({
  email: ''
})

let cooldownInterval = null

// Validation
function validateForm() {
  errors.email = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  return true
}

// Start cooldown timer
function startCooldown() {
  cooldown.value = 60
  cooldownInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

// Handle forgot password
async function handleForgotPassword() {
  if (!validateForm()) return

  loading.value = true
  resetError.value = ''

  try {
    await authStore.forgotPassword(form.email)
    emailSent.value = true
    startCooldown()
  } catch (error) {
    resetError.value = error.message || 'Failed to send reset email. Please try again.'
  } finally {
    loading.value = false
  }
}

// Resend email
async function resendEmail() {
  if (cooldown.value > 0) return

  loading.value = true
  resetError.value = ''

  try {
    await authStore.forgotPassword(form.email)
    startCooldown()
  } catch (error) {
    resetError.value = error.message || 'Failed to resend email. Please try again.'
  } finally {
    loading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
