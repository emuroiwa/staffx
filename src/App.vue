<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  // Initialize theme on app mount
  themeStore.initializeTheme()
})
</script>

<style>
/* Global styles are handled in tailwind.css */
#app {
  min-height: 100vh;
}
</style>
