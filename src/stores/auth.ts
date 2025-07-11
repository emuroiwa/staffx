import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth'
import type { LoginCredentials, User } from '@/services/auth'

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
  
  const hasActiveTrial = computed(() => {
    if (!user.value?.trial_expires_at) return false
    return new Date(user.value.trial_expires_at) > new Date()
  })
  
  const trialDaysLeft = computed(() => {
    if (!user.value?.trial_expires_at) return 0
    const expiryDate = new Date(user.value.trial_expires_at)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })
  
  const trialStatus = computed(() => {
    if (!isHoldingCompanyAdmin.value) return null
    if (!user.value?.trial_expires_at) return 'no_trial'
    
    const daysLeft = trialDaysLeft.value
    if (daysLeft > 7) return 'active'
    if (daysLeft > 0) return 'expiring_soon'
    return 'expired'
  })

  // Actions
  function setUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
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

      return user.value
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
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
    password: string
  }) {
    loading.value = true
    try {
      const response = await authService.register({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        company: userData.company,
        password: userData.password,
        password_confirmation: userData.password,
      })

      isAuthenticated.value = true
      user.value = response.data.user

      // Store auth state
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))

      return user.value
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
    initializeAuth
  }
})
