import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),

  getters: {
    activeNotifications: (state) => state.notifications
  },

  actions: {
    addNotification(notification) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        type: notification.type || 'info', // info, success, warning, error
        title: notification.title || '',
        message: notification.message || '',
        duration: notification.duration !== undefined ? notification.duration : 5000,
        timestamp: new Date()
      }

      this.notifications.push(newNotification)

      // Auto-remove notification after duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }

      return id
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearAllNotifications() {
      this.notifications = []
    },

    // Convenience methods for different notification types
    success(title, message, duration = 5000) {
      return this.addNotification({
        type: 'success',
        title,
        message,
        duration
      })
    },

    error(title, message, duration = 8000) {
      return this.addNotification({
        type: 'error',
        title,
        message,
        duration
      })
    },

    warning(title, message, duration = 6000) {
      return this.addNotification({
        type: 'warning',
        title,
        message,
        duration
      })
    },

    info(title, message, duration = 5000) {
      return this.addNotification({
        type: 'info',
        title,
        message,
        duration
      })
    }
  }
})