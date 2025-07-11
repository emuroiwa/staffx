import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  return {
    isDark: themeStore.isDark,
    theme: themeStore.theme,
    sidebarCollapsed: themeStore.sidebarCollapsed,
    sidebarWidth: themeStore.sidebarWidth,
    showMobileSidebar: themeStore.showMobileSidebar,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    toggleSidebar: themeStore.toggleSidebar,
    setSidebarCollapsed: themeStore.setSidebarCollapsed,
    toggleMobileSidebar: themeStore.toggleMobileSidebar,
    setMobileSidebar: themeStore.setMobileSidebar,
    hideMobileSidebar: themeStore.hideMobileSidebar,
    initializeTheme: themeStore.initializeTheme
  }
}
