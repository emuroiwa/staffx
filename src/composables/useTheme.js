import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  return {
    isDark: themeStore.isDark,
    theme: themeStore.theme,
    sidebarCollapsed: themeStore.sidebarCollapsed,
    sidebarWidth: themeStore.sidebarWidth,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    toggleSidebar: themeStore.toggleSidebar,
    setSidebarCollapsed: themeStore.setSidebarCollapsed,
    initializeTheme: themeStore.initializeTheme
  }
}
