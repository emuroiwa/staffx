<template>
  <div 
    :class="[
      'fixed left-0 top-0 h-full bg-sidebar-light dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
      themeStore.sidebarCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Building2 class="w-5 h-5 text-white" />
        </div>
        <transition name="fade">
          <span 
            v-if="!themeStore.sidebarCollapsed" 
            class="text-xl font-bold text-gray-900 dark:text-white"
          >
            StaffX
          </span>
        </transition>
      </div>
    </div>

    <!-- User Info Section -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <img 
          :src="authStore.user?.avatar" 
          :alt="authStore.user?.name"
          class="w-8 h-8 rounded-full object-cover"
        />
        <transition name="fade">
          <div v-if="!themeStore.sidebarCollapsed" class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.company }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        v-slot="{ isActive }"
        class="block"
      >
        <div 
          :class="[
            'sidebar-item group',
            isActive ? 'active' : 'text-gray-700 dark:text-gray-300'
          ]"
          :title="themeStore.sidebarCollapsed ? item.title : ''"
        >
          <component 
            :is="item.icon" 
            :class="[
              'w-5 h-5 flex-shrink-0',
              themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3'
            ]"
          />
          <transition name="fade">
            <span 
              v-if="!themeStore.sidebarCollapsed"
              class="text-sm font-medium"
            >
              {{ item.title }}
            </span>
          </transition>
        </div>
      </router-link>
    </nav>

    <!-- Settings Section -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="themeStore.toggleTheme"
        :class="[
          'sidebar-item w-full text-gray-700 dark:text-gray-300',
          themeStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="themeStore.sidebarCollapsed ? 'Toggle Theme' : ''"
      >
        <Sun v-if="themeStore.isDark" :class="[
          'w-5 h-5 flex-shrink-0',
          themeStore.sidebarCollapsed ? '' : 'mr-3'
        ]" />
        <Moon v-else :class="[
          'w-5 h-5 flex-shrink-0',
          themeStore.sidebarCollapsed ? '' : 'mr-3'
        ]" />
        <transition name="fade">
          <span 
            v-if="!themeStore.sidebarCollapsed"
            class="text-sm font-medium"
          >
            {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </transition>
      </button>

      <button
        @click="authStore.logout"
        :class="[
          'sidebar-item w-full text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400',
          themeStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="themeStore.sidebarCollapsed ? 'Logout' : ''"
      >
        <LogOut :class="[
          'w-5 h-5 flex-shrink-0',
          themeStore.sidebarCollapsed ? '' : 'mr-3'
        ]" />
        <transition name="fade">
          <span 
            v-if="!themeStore.sidebarCollapsed"
            class="text-sm font-medium"
          >
            Logout
          </span>
        </transition>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { 
  Building2, 
  Home, 
  Users, 
  CreditCard, 
  Sun, 
  Moon, 
  LogOut 
} from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const menuItems = computed(() => [
  {
    name: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home
  },
  {
    name: 'employees',
    title: 'Employees',
    path: '/employees',
    icon: Users
  },
  {
    name: 'payroll',
    title: 'Payroll',
    path: '/payroll',
    icon: CreditCard
  }
])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>