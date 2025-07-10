<template>
  <header 
    :class="[
      'fixed top-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 transition-all duration-300',
      themeStore.sidebarCollapsed ? 'left-16' : 'left-64'
    ]"
  >
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left Section: Menu Toggle & Breadcrumb -->
      <div class="flex items-center space-x-4">
        <button
          @click="themeStore.toggleSidebar"
          class="nav-button lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu class="w-5 h-5" />
        </button>
        
        <button
          @click="themeStore.toggleSidebar"
          class="nav-button hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Breadcrumb -->
        <nav class="hidden sm:flex items-center space-x-2 text-sm">
          <span class="text-gray-500 dark:text-gray-400">StaffX</span>
          <ChevronRight class="w-4 h-4 text-gray-400" />
          <span class="font-medium text-gray-900 dark:text-white">
            {{ currentPageTitle }}
          </span>
        </nav>
      </div>

      <!-- Center Section: Search -->
      <div class="flex-1 max-w-lg mx-8 hidden md:block">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employees, departments..."
            class="search-input"
            @keydown.enter="handleSearch"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Right Section: Actions & User Menu -->
      <div class="flex items-center space-x-3">
        <!-- Mobile Search Toggle -->
        <button
          @click="showMobileSearch = !showMobileSearch"
          class="nav-button md:hidden"
          aria-label="Toggle search"
        >
          <Search class="w-5 h-5" />
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="nav-button relative"
            aria-label="Notifications"
          >
            <Bell class="w-5 h-5" />
            <span 
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <transition name="dropdown">
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              @click.stop
            >
              <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <p class="text-sm text-gray-900 dark:text-white">{{ notification.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
                </div>
              </div>
              <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View all notifications
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Add Employee Button -->
        <button
          @click="handleAddEmployee"
          class="hidden sm:inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Employee
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="User menu"
          >
            <img
              :src="authStore.user?.avatar"
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          <!-- User Dropdown -->
          <transition name="dropdown">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              @click.stop
            >
              <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              
              <button
                v-for="item in userMenuItems"
                :key="item.name"
                @click="item.action"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <component :is="item.icon" class="w-4 h-4" />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <transition name="slide-down">
      <div
        v-if="showMobileSearch"
        class="md:hidden px-4 py-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employees, departments..."
            class="search-input"
            @keydown.enter="handleSearch"
          />
        </div>
      </div>
    </transition>
  </header>

  <!-- Click outside to close dropdowns -->
  <div
    v-if="showNotifications || showUserMenu"
    @click="closeAllDropdowns"
    class="fixed inset-0 z-20"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()

// Reactive state
const searchQuery = ref('')
const showMobileSearch = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notificationCount = ref(3)

// Computed properties
const currentPageTitle = computed(() => {
  return route.meta?.title || 'Dashboard'
})

// Sample notifications
const notifications = ref([
  { id: 1, title: 'New employee onboarding completed', time: '2 hours ago' },
  { id: 2, title: 'Payroll processing reminder', time: '4 hours ago' },
  { id: 3, title: 'Department meeting scheduled', time: '1 day ago' }
])

// User menu items
const userMenuItems = [
  {
    name: 'profile',
    label: 'Profile',
    icon: User,
    action: () => handleUserAction('profile')
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: Settings,
    action: () => handleUserAction('settings')
  },
  {
    name: 'logout',
    label: 'Logout',
    icon: LogOut,
    action: () => authStore.logout()
  }
]

// Methods
function handleSearch() {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implement search logic here
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function handleAddEmployee() {
  router.push('/employees?action=add')
}

function handleUserAction(action) {
  showUserMenu.value = false
  console.log('User action:', action)
  // Implement user actions here
}

function closeAllDropdowns() {
  showNotifications.value = false
  showUserMenu.value = false
}

// Handle click outside
function handleClickOutside(event) {
  // This will be handled by the overlay div
}

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns()
      showMobileSearch.value = false
    }
  })
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>