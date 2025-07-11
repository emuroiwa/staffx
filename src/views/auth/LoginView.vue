<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleLogin" class="space-y-6">
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
            autocomplete="current-password"
            required
            class="form-input pl-10 pr-10"
            placeholder="Enter your password"
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

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="form.remember"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>

        <router-link
          to="/auth/forgot-password"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Forgot your password?
        </router-link>
      </div>

      <!-- Error Message -->
      <div
        v-if="loginError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div class="flex items-center">
          <AlertCircle class="h-5 w-5 text-red-400 mr-2" />
          <p class="text-sm text-red-800 dark:text-red-200">{{ loginError }}</p>
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
        <LogIn v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>

      <!-- Demo Credentials -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <div class="flex items-start">
          <Info class="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Demo Credentials
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Email:</strong> demo@staffx.com<br />
              <strong>Password:</strong> demo123
            </p>
          </div>
        </div>
      </div>
    </form>

    <!-- Sign Up Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link
          to="/auth/register"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Sign up for free
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Info } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')
const errors = reactive({
  email: '',
  password: ''
})

// Validation
function validateForm() {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  return true
}

// Handle login
async function handleLogin() {
  if (!validateForm()) return

  loading.value = true
  loginError.value = ''

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember
    })

    // Redirect to dashboard on success
    router.push('/dashboard')
  } catch (error) {
    loginError.value = error.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
