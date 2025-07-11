<template>
  <div id="app" class="min-h-screen bg-content-light dark:bg-content-dark">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

let resizeHandler = null

onMounted(() => {
  // Initialize theme and auth on app mount
  themeStore.initializeTheme()
  authStore.initializeAuth()

  // Add resize handler for responsive design
  resizeHandler = () => {
    if (window.innerWidth >= 1024) {
      // Reset mobile sidebar state on desktop
      themeStore.hideMobileSidebar?.()
    }
  }

  window.addEventListener('resize', resizeHandler)

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = e => {
    // Only update if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      themeStore.setTheme(e.matches ? 'dark' : 'light')
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  // Cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style>
/* Global styles are handled in tailwind.css */
/* Ensure the app takes full height */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Prevent flash of unstyled content */
.loading {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.loaded {
  opacity: 1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Firefox scrollbar */
html {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175) rgb(243 244 246);
}

.dark html {
  scrollbar-color: rgb(75 85 99) rgb(31 41 55);
}
</style>
