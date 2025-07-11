<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Manage your application preferences and account settings</p>
      </div>
    </div>

    <!-- Appearance Settings -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Customize how StaffX looks and feels</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Theme Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme
          </label>
          <div class="grid grid-cols-3 gap-3">
            <label
              v-for="theme in themes"
              :key="theme.value"
              :class="[
                'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none',
                settings.theme === theme.value
                  ? 'border-primary-600 ring-2 ring-primary-600'
                  : 'border-gray-300 dark:border-gray-600'
              ]"
            >
              <input
                v-model="settings.theme"
                :value="theme.value"
                type="radio"
                class="sr-only"
                @change="updateSettings"
              />
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <component :is="theme.icon" class="h-5 w-5 mb-2 text-gray-700 dark:text-gray-300" />
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    {{ theme.label }}
                  </span>
                  <span class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {{ theme.description }}
                  </span>
                </span>
              </span>
              <CheckCircle
                v-if="settings.theme === theme.value"
                class="h-5 w-5 text-primary-600"
              />
            </label>
          </div>
        </div>

        <!-- Language Selection -->
        <div>
          <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            v-model="settings.language"
            @change="updateSettings"
            class="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <!-- Sidebar Behavior -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sidebar Behavior
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="settings.sidebarCollapsed"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Collapse sidebar by default</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.sidebarAutoHide"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Auto-hide sidebar on mobile</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Choose what notifications you want to receive</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Email Notifications -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Email Notifications</h3>
          <div class="space-y-3">
            <label
              v-for="notification in emailNotifications"
              :key="notification.key"
              class="flex items-start"
            >
              <input
                v-model="settings.notifications.email[notification.key]"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-0.5"
              />
              <div class="ml-3">
                <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">{{ notification.label }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ notification.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Push Notifications -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Push Notifications</h3>
          <div class="space-y-3">
            <label
              v-for="notification in pushNotifications"
              :key="notification.key"
              class="flex items-start"
            >
              <input
                v-model="settings.notifications.push[notification.key]"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-0.5"
              />
              <div class="ml-3">
                <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">{{ notification.label }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ notification.description }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Data & Privacy -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Data & Privacy</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Control your data and privacy preferences</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Data Export -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">Export Data</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Download a copy of your data</p>
          </div>
          <button
            type="button"
            @click="exportData"
            :disabled="exportLoading"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {{ exportLoading ? 'Exporting...' : 'Export Data' }}
          </button>
        </div>

        <!-- Activity Tracking -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">Activity Tracking</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Allow us to track your usage for analytics</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.privacy.allowTracking"
              type="checkbox"
              @change="updateSettings"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <!-- Session Timeout -->
        <div>
          <label for="sessionTimeout" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <select
            id="sessionTimeout"
            v-model="settings.privacy.sessionTimeout"
            @change="updateSettings"
            class="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="15">15 minutes</option>
            <option :value="30">30 minutes</option>
            <option :value="60">1 hour</option>
            <option :value="120">2 hours</option>
            <option :value="480">8 hours</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Advanced</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Advanced configuration options</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Performance Settings -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance</h3>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="settings.advanced.enableAnimations"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable animations</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.advanced.preloadData"
                type="checkbox"
                @change="updateSettings"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Preload data for faster navigation</span>
            </label>
          </div>
        </div>

        <!-- Debug Mode -->
        <div class="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <AlertTriangle class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Debug Mode</h3>
              <div class="mt-2">
                <label class="flex items-center">
                  <input
                    v-model="settings.advanced.debugMode"
                    type="checkbox"
                    @change="updateSettings"
                    class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span class="ml-3 text-sm text-yellow-700 dark:text-yellow-300">
                    Enable debug mode (shows additional logging in console)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Reset Settings -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Reset Settings</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Reset all settings to their default values</p>
            </div>
            <button
              type="button"
              @click="showResetModal = true"
              class="px-4 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed top-4 right-4 z-50">
      <div
        :class="[
          'px-4 py-3 rounded-md shadow-lg',
          messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        {{ message }}
      </div>
    </div>
  </div>

  <!-- Reset Confirmation Modal -->
  <div v-if="showResetModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showResetModal = false"></div>
      
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Reset Settings</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to reset all settings to their default values? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="resetSettings"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Reset Settings
          </button>
          <button
            type="button"
            @click="showResetModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { CheckCircle, Sun, Moon, Monitor, AlertTriangle } from 'lucide-vue-next'

const themeStore = useThemeStore()

// State
const showResetModal = ref(false)
const exportLoading = ref(false)
const message = ref('')
const messageType = ref('success')

// Settings object
const settings = ref({
  theme: 'system',
  language: 'en',
  sidebarCollapsed: false,
  sidebarAutoHide: true,
  notifications: {
    email: {
      newEmployee: true,
      payrollReminder: true,
      systemUpdates: false,
      securityAlerts: true
    },
    push: {
      newEmployee: false,
      payrollReminder: true,
      systemUpdates: false,
      securityAlerts: true
    }
  },
  privacy: {
    allowTracking: true,
    sessionTimeout: 60
  },
  advanced: {
    enableAnimations: true,
    preloadData: true,
    debugMode: false
  }
})

// Theme options
const themes = [
  {
    value: 'light',
    label: 'Light',
    description: 'Light theme',
    icon: Sun
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dark theme',
    icon: Moon
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow system',
    icon: Monitor
  }
]

// Notification options
const emailNotifications = [
  {
    key: 'newEmployee',
    label: 'New Employee',
    description: 'When a new employee is added to the system'
  },
  {
    key: 'payrollReminder',
    label: 'Payroll Reminders',
    description: 'Monthly payroll processing reminders'
  },
  {
    key: 'systemUpdates',
    label: 'System Updates',
    description: 'Updates about new features and improvements'
  },
  {
    key: 'securityAlerts',
    label: 'Security Alerts',
    description: 'Important security notifications'
  }
]

const pushNotifications = [
  {
    key: 'newEmployee',
    label: 'New Employee',
    description: 'Real-time notifications for new employees'
  },
  {
    key: 'payrollReminder',
    label: 'Payroll Reminders',
    description: 'Browser notifications for payroll deadlines'
  },
  {
    key: 'systemUpdates',
    label: 'System Updates',
    description: 'Notifications about system maintenance'
  },
  {
    key: 'securityAlerts',
    label: 'Security Alerts',
    description: 'Immediate security alerts'
  }
]

// Methods
const loadSettings = () => {
  const savedSettings = localStorage.getItem('staffx-settings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      settings.value = { ...settings.value, ...parsed }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

const saveSettings = () => {
  try {
    localStorage.setItem('staffx-settings', JSON.stringify(settings.value))
    showMessage('Settings saved successfully!')
  } catch (error) {
    console.error('Failed to save settings:', error)
    showMessage('Failed to save settings', 'error')
  }
}

const updateSettings = () => {
  saveSettings()
  
  // Apply theme change immediately
  if (settings.value.theme !== themeStore.currentTheme) {
    themeStore.setTheme(settings.value.theme)
  }
  
  // Apply sidebar settings
  if (settings.value.sidebarCollapsed !== themeStore.sidebarCollapsed) {
    if (settings.value.sidebarCollapsed) {
      themeStore.collapseSidebar()
    } else {
      themeStore.expandSidebar()
    }
  }
}

const resetSettings = () => {
  settings.value = {
    theme: 'system',
    language: 'en',
    sidebarCollapsed: false,
    sidebarAutoHide: true,
    notifications: {
      email: {
        newEmployee: true,
        payrollReminder: true,
        systemUpdates: false,
        securityAlerts: true
      },
      push: {
        newEmployee: false,
        payrollReminder: true,
        systemUpdates: false,
        securityAlerts: true
      }
    },
    privacy: {
      allowTracking: true,
      sessionTimeout: 60
    },
    advanced: {
      enableAnimations: true,
      preloadData: true,
      debugMode: false
    }
  }
  
  localStorage.removeItem('staffx-settings')
  showResetModal.value = false
  showMessage('Settings reset to defaults!')
  
  // Apply changes immediately
  updateSettings()
}

const exportData = async () => {
  exportLoading.value = true
  try {
    // TODO: Implement actual data export
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    showMessage('Data export completed!')
  } catch (error) {
    showMessage('Failed to export data', 'error')
  } finally {
    exportLoading.value = false
  }
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Watch for theme changes
watch(() => settings.value.theme, (newTheme) => {
  themeStore.setTheme(newTheme)
})

// Initialize settings on mount
onMounted(() => {
  loadSettings()
  // Sync with current theme store state
  settings.value.theme = themeStore.currentTheme
  settings.value.sidebarCollapsed = themeStore.sidebarCollapsed
})
</script>