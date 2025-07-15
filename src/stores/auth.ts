import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth'
import type { LoginCredentials, User } from '@/services/auth'
import { useCurrencyStore } from './currency'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Getters
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  const userDisplayName = computed(() => user.value?.name || 'Unknown User')

  const isHoldingCompanyAdmin = computed(() => user.value?.role === 'holding_company_admin')
  
  // Note: Subscription status will be fetched from company data via API
  // These computed properties are kept for backward compatibility but will return null
  const hasActiveTrial = computed(() => {
    // Subscription status is now managed at company level
    return null
  })
  
  const trialDaysLeft = computed(() => {
    // Will be fetched from company subscription data
    return 0
  })
  
  const trialStatus = computed(() => {
    // Will be fetched from company subscription data
    return null
  })

  // Actions
  function setUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  // Initialize currency data from login response
  async function initializeCurrencyData(loginData: any) {
    const currencyStore = useCurrencyStore()
    
    try {
      // Fetch all available currencies first
      await currencyStore.fetchCurrencies()
      
      // Initialize user and company currency from login data
      currencyStore.initializeCurrency(loginData.user, loginData.company)
    } catch (error) {
      console.error('Failed to initialize currency data:', error)
      // Continue with login even if currency initialization fails
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      
      isAuthenticated.value = true
      user.value = response.data.user

      // Store auth state
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))

      // Initialize currency data after successful login
      await initializeCurrencyData(response.data)

      return user.value
    } catch (error: any) {
      isAuthenticated.value = false
      user.value = null
      
      // Check if it's an email verification error
      if (error.response?.data?.requires_verification) {
        // Store the email for potential resend verification
        localStorage.setItem('unverifiedEmail', credentials.email)
        const verificationError = new Error(error.response.data.message)
        ;(verificationError as any).requiresVerification = true
        throw verificationError
      }
      
      // Check if it's a subscription expired error
      if (error.response?.data?.subscription_expired) {
        const subscriptionError = new Error(error.response.data.message)
        ;(subscriptionError as any).subscriptionExpired = true
        throw subscriptionError
      }
      
      throw error
    } finally {
      loading.value = false
    }
  }

  async function register(userData: {
    firstName: string
    lastName: string
    email: string
    company: string
    countryUuid: string
    password: string
  }) {
    loading.value = true
    try {
      const response = await authService.register({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        company: userData.company,
        country_uuid: userData.countryUuid,
        password: userData.password,
        password_confirmation: userData.password,
      })

      isAuthenticated.value = true
      user.value = response.data.user

      // Store auth state
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))

      return {
        user: user.value,
        company: response.data.company
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string) {
    loading.value = true
    try {
      const response = await authService.forgotPassword({ email })
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(data: {
    email: string
    token: string
    password: string
    passwordConfirmation: string
  }) {
    loading.value = true
    try {
      const response = await authService.resetPassword({
        email: data.email,
        token: data.token,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      })
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local state
      user.value = null
      isAuthenticated.value = false

      // Clear currency data
      const currencyStore = useCurrencyStore()
      currencyStore.clearUserData()

      // Clear stored auth data
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')

      // Redirect to login page
      window.location.href = '/auth/login'
    }
  }

  async function updateProfile(profileData: { name: string; company?: string }) {
    loading.value = true
    try {
      const response = await authService.updateProfile(profileData)
      user.value = response.data.user

      // Store updated user data
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return user.value
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function resendEmailVerification() {
    loading.value = true
    try {
      const response = await authService.resendEmailVerification()
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function initializeAuth() {
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedToken = localStorage.getItem('authToken')

    if (storedAuth === 'true' && storedToken) {
      try {
        const response = await authService.getMe()
        isAuthenticated.value = true
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(user.value))
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Token is invalid, clear auth but don't redirect
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,

    // Getters
    userInitials,
    userDisplayName,
    isHoldingCompanyAdmin,
    hasActiveTrial,
    trialDaysLeft,
    trialStatus,

    // Actions
    setUser,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    resendEmailVerification,
    initializeAuth
  }
})
