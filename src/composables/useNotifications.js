import { useNotificationStore } from '@/stores/notification'

export function useNotifications() {
  const notificationStore = useNotificationStore()
  
  const showNotification = (message, type = 'info', duration = 5000) => {
    return notificationStore.addNotification({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type,
      duration
    })
  }
  
  const removeNotification = (id) => {
    notificationStore.removeNotification(id)
  }
  
  const clearNotifications = () => {
    notificationStore.clearAllNotifications()
  }
  
  return {
    notifications: notificationStore.activeNotifications,
    showNotification,
    removeNotification,
    clearNotifications,
    // Convenience methods
    success: (message, duration) => showNotification(message, 'success', duration),
    error: (message, duration) => showNotification(message, 'error', duration),
    warning: (message, duration) => showNotification(message, 'warning', duration),
    info: (message, duration) => showNotification(message, 'info', duration)
  }
}