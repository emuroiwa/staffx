import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref({
    id: 1,
    name: 'Taylor Swift',
    email: 'taylor.swift@staffx.com',
    role: 'Admin',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    company: 'Vertex Global'
  })

  const isAuthenticated = ref(true)
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

  function login() {
    loading.value = true
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        isAuthenticated.value = true
        loading.value = false
        resolve(user.value)
      }, 1000)
    })
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('authToken')
  }

  function updateProfile(profileData) {
    user.value = { ...user.value, ...profileData }
    // Here you would typically make an API call to update the user profile
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
    logout,
    updateProfile
  }
})
