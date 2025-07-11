import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)
  const currentTheme = ref('system') // 'light', 'dark', or 'system'
  const sidebarCollapsed = ref(false)
  const showMobileSidebar = ref(false)

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
    currentTheme.value = newTheme
    
    if (newTheme === 'system') {
      // Follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    } else {
      isDark.value = newTheme === 'dark'
    }
    
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

  function collapseSidebar() {
    sidebarCollapsed.value = true
    localStorage.setItem('sidebarCollapsed', 'true')
  }

  function expandSidebar() {
    sidebarCollapsed.value = false
    localStorage.setItem('sidebarCollapsed', 'false')
  }

  function toggleMobileSidebar() {
    showMobileSidebar.value = !showMobileSidebar.value
  }

  function setMobileSidebar(show) {
    showMobileSidebar.value = show
  }

  function hideMobileSidebar() {
    showMobileSidebar.value = false
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
      // Default to system preference
      setTheme('system')
    }

    if (savedSidebarState) {
      sidebarCollapsed.value = savedSidebarState === 'true'
    }

    updateHtmlClass()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (currentTheme.value === 'system') {
        isDark.value = e.matches
        updateHtmlClass()
      }
    })
  }

  return {
    // State
    isDark,
    currentTheme,
    sidebarCollapsed,
    showMobileSidebar,

    // Getters
    theme,
    sidebarWidth,

    // Actions
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    collapseSidebar,
    expandSidebar,
    toggleMobileSidebar,
    setMobileSidebar,
    hideMobileSidebar,
    initializeTheme
  }
})
