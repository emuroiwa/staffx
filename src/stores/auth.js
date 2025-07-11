import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)

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

  // Actions
  function setUser(userData) {
    user.value = { ...user.value, ...userData }
  }

  function login(credentials) {
    loading.value = true
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials validation
        if (credentials.email === 'demo@staffx.com' && credentials.password === 'demo123') {
          isAuthenticated.value = true
          user.value = {
            id: 1,
            name: 'Demo User',
            email: 'demo@staffx.com',
            role: 'Admin',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            company: 'Demo Company'
          }

          // Store auth state
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(user.value))

          loading.value = false
          resolve(user.value)
        } else {
          loading.value = false
          reject(new Error('Invalid email or password'))
        }
      }, 1000)
    })
  }

  function register(userData) {
    loading.value = true
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate successful registration
        const newUser = {
          id: Date.now(),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: 'Admin',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          company: userData.company
        }

        isAuthenticated.value = true
        user.value = newUser

        // Store auth state
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(user.value))

        loading.value = false
        resolve(user.value)
      }, 1500)
    })
  }

  function forgotPassword() {
    loading.value = true
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate successful email send
        loading.value = false
        resolve({ message: 'Password reset email sent' })
      }, 1000)
    })
  }

  function resetPassword() {
    loading.value = true
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate successful password reset
        loading.value = false
        resolve({ message: 'Password reset successfully' })
      }, 1000)
    })
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false

    // Clear stored auth data
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  function updateProfile(profileData) {
    user.value = { ...user.value, ...profileData }
    // Store updated user data
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function initializeAuth() {
    // Check if user was previously authenticated
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedUser = localStorage.getItem('user')

    if (storedAuth === 'true' && storedUser) {
      try {
        isAuthenticated.value = true
        user.value = JSON.parse(storedUser)
      } catch {
        // Clear invalid stored data
        logout()
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
