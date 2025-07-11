<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full" :class="status === 'success' ? 'bg-green-100 dark:bg-green-900' : status === 'error' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'">
          <CheckCircle v-if="status === 'success'" class="h-8 w-8 text-green-600 dark:text-green-400" />
          <AlertCircle v-else-if="status === 'error'" class="h-8 w-8 text-red-600 dark:text-red-400" />
          <Mail v-else class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ getTitle() }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ getMessage() }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <LogIn class="w-4 h-4 mr-2" />
          Continue to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle, AlertCircle, Mail, LogIn } from 'lucide-vue-next'

const route = useRoute()
const status = ref('loading') // loading, success, error
const message = ref('')

onMounted(async () => {
  const { id, hash } = route.params
  
  try {
    const response = await fetch(`/api/auth/email/verify/${id}/${hash}?${route.query.signature ? 'signature=' + route.query.signature : ''}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (data.success) {
      status.value = 'success'
      message.value = data.message
    } else {
      status.value = 'error'
      message.value = data.message || 'Email verification failed'
    }
  } catch (error) {
    status.value = 'error'
    message.value = 'Failed to verify email. Please try again.'
  }
})

function getTitle() {
  switch (status.value) {
    case 'success':
      return 'Email Verified!'
    case 'error':
      return 'Verification Failed'
    default:
      return 'Verifying Email...'
  }
}

function getMessage() {
  if (message.value) {
    return message.value
  }
  
  switch (status.value) {
    case 'success':
      return 'Your email has been successfully verified. You can now log in to your account.'
    case 'error':
      return 'There was an issue verifying your email. Please check the link or request a new verification email.'
    default:
      return 'Please wait while we verify your email address.'
  }
}
</script>