import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

describe('Notification Store', () => {
  let store: ReturnType<typeof useNotificationStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useNotificationStore()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should have empty notifications array initially', () => {
      expect(store.notifications).toEqual([])
      expect(store.activeNotifications).toEqual([])
    })
  })

  describe('addNotification', () => {
    it('should add notification with default values', () => {
      const id = store.addNotification({
        title: 'Test Title',
        message: 'Test Message'
      })

      expect(store.notifications).toHaveLength(1)
      
      const notification = store.notifications[0]
      expect(notification.id).toBe(id)
      expect(notification.type).toBe('info')
      expect(notification.title).toBe('Test Title')
      expect(notification.message).toBe('Test Message')
      expect(notification.duration).toBe(5000)
      expect(notification.timestamp).toBeInstanceOf(Date)
    })

    it('should add notification with custom values', () => {
      const customNotification = {
        type: 'error' as const,
        title: 'Error Title',
        message: 'Error Message',
        duration: 8000
      }

      const id = store.addNotification(customNotification)

      const notification = store.notifications[0]
      expect(notification.type).toBe('error')
      expect(notification.title).toBe('Error Title')
      expect(notification.message).toBe('Error Message')
      expect(notification.duration).toBe(8000)
    })

    it('should auto-remove notification after duration', () => {
      store.addNotification({
        title: 'Auto Remove',
        duration: 3000
      })

      expect(store.notifications).toHaveLength(1)

      // Fast-forward time
      vi.advanceTimersByTime(3000)

      expect(store.notifications).toHaveLength(0)
    })

    it('should not auto-remove notification with duration 0', () => {
      store.addNotification({
        title: 'Persistent',
        duration: 0
      })

      expect(store.notifications).toHaveLength(1)

      // Fast-forward time
      vi.advanceTimersByTime(10000)

      expect(store.notifications).toHaveLength(1)
    })

    it('should generate unique IDs for notifications', () => {
      const id1 = store.addNotification({ title: 'First' })
      const id2 = store.addNotification({ title: 'Second' })

      expect(id1).not.toBe(id2)
      expect(store.notifications).toHaveLength(2)
    })
  })

  describe('removeNotification', () => {
    it('should remove notification by ID', () => {
      const id1 = store.addNotification({ title: 'First' })
      const id2 = store.addNotification({ title: 'Second' })

      expect(store.notifications).toHaveLength(2)

      store.removeNotification(id1)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0].title).toBe('Second')
    })

    it('should handle removal of non-existent notification', () => {
      store.addNotification({ title: 'Test' })
      
      expect(store.notifications).toHaveLength(1)

      store.removeNotification(99999) // Non-existent ID

      expect(store.notifications).toHaveLength(1)
    })
  })

  describe('clearAllNotifications', () => {
    it('should remove all notifications', () => {
      store.addNotification({ title: 'First' })
      store.addNotification({ title: 'Second' })
      store.addNotification({ title: 'Third' })

      expect(store.notifications).toHaveLength(3)

      store.clearAllNotifications()

      expect(store.notifications).toHaveLength(0)
    })
  })

  describe('Convenience Methods', () => {
    describe('success', () => {
      it('should add success notification', () => {
        const id = store.success('Success Title', 'Success Message')

        const notification = store.notifications[0]
        expect(notification.type).toBe('success')
        expect(notification.title).toBe('Success Title')
        expect(notification.message).toBe('Success Message')
        expect(notification.duration).toBe(5000)
      })

      it('should use custom duration for success notification', () => {
        store.success('Success Title', 'Success Message', 3000)

        const notification = store.notifications[0]
        expect(notification.duration).toBe(3000)
      })
    })

    describe('error', () => {
      it('should add error notification', () => {
        const id = store.error('Error Title', 'Error Message')

        const notification = store.notifications[0]
        expect(notification.type).toBe('error')
        expect(notification.title).toBe('Error Title')
        expect(notification.message).toBe('Error Message')
        expect(notification.duration).toBe(8000)
      })

      it('should use custom duration for error notification', () => {
        store.error('Error Title', 'Error Message', 10000)

        const notification = store.notifications[0]
        expect(notification.duration).toBe(10000)
      })
    })

    describe('warning', () => {
      it('should add warning notification', () => {
        const id = store.warning('Warning Title', 'Warning Message')

        const notification = store.notifications[0]
        expect(notification.type).toBe('warning')
        expect(notification.title).toBe('Warning Title')
        expect(notification.message).toBe('Warning Message')
        expect(notification.duration).toBe(6000)
      })
    })

    describe('info', () => {
      it('should add info notification', () => {
        const id = store.info('Info Title', 'Info Message')

        const notification = store.notifications[0]
        expect(notification.type).toBe('info')
        expect(notification.title).toBe('Info Title')
        expect(notification.message).toBe('Info Message')
        expect(notification.duration).toBe(5000)
      })
    })
  })

  describe('Multiple Notifications', () => {
    it('should handle multiple notifications with different types', () => {
      store.success('Success', 'Success message')
      store.error('Error', 'Error message')
      store.warning('Warning', 'Warning message')
      store.info('Info', 'Info message')

      expect(store.notifications).toHaveLength(4)
      
      const types = store.notifications.map(n => n.type)
      expect(types).toContain('success')
      expect(types).toContain('error')
      expect(types).toContain('warning')
      expect(types).toContain('info')
    })

    it('should auto-remove multiple notifications independently', () => {
      // Add notifications with different durations
      store.addNotification({ title: 'Short', duration: 1000 })
      store.addNotification({ title: 'Medium', duration: 2000 })
      store.addNotification({ title: 'Long', duration: 3000 })

      expect(store.notifications).toHaveLength(3)

      // After 1 second
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(2)
      expect(store.notifications.map(n => n.title)).toEqual(['Medium', 'Long'])

      // After 2 seconds total
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0].title).toBe('Long')

      // After 3 seconds total
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle notification with empty title and message', () => {
      const id = store.addNotification({})

      const notification = store.notifications[0]
      expect(notification.title).toBe('')
      expect(notification.message).toBe('')
      expect(notification.type).toBe('info')
    })

    it('should handle very short duration', () => {
      store.addNotification({
        title: 'Quick',
        duration: 1
      })

      expect(store.notifications).toHaveLength(1)

      vi.advanceTimersByTime(1)

      expect(store.notifications).toHaveLength(0)
    })

    it('should return notification ID from convenience methods', () => {
      const successId = store.success('Success', 'Message')
      const errorId = store.error('Error', 'Message')
      const warningId = store.warning('Warning', 'Message')
      const infoId = store.info('Info', 'Message')

      expect(typeof successId).toBe('number')
      expect(typeof errorId).toBe('number')
      expect(typeof warningId).toBe('number')
      expect(typeof infoId).toBe('number')

      // All IDs should be different
      const ids = [successId, errorId, warningId, infoId]
      const uniqueIds = [...new Set(ids)]
      expect(uniqueIds).toHaveLength(4)
    })
  })
})