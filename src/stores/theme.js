import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)
  const sidebarCollapsed = ref(false)

  // Getters
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))
  const sidebarWidth = computed(() => (sidebarCollapsed.value ? 'w-16' : 'w-64'))

  // Actions
  function toggleTheme() {
    isDark.value = !isDark.value
    updateHtmlClass()
    localStorage.setItem('theme', theme.value)
  }

  function setTheme(newTheme) {
    isDark.value = newTheme === 'dark'
    updateHtmlClass()
    localStorage.setItem('theme', newTheme)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  }

  function setSidebarCollapsed(collapsed) {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('sidebarCollapsed', collapsed.toString())
  }

  function updateHtmlClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function initializeTheme() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const savedSidebarState = localStorage.getItem('sidebarCollapsed')

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }

    if (savedSidebarState) {
      sidebarCollapsed.value = savedSidebarState === 'true'
    }

    updateHtmlClass()
  }

  return {
    // State
    isDark,
    sidebarCollapsed,

    // Getters
    theme,
    sidebarWidth,

    // Actions
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    initializeTheme
  }
})
