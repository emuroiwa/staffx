<template>
  <div
    :class="[
      'fixed left-0 top-0 h-full bg-sidebar-light dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
      'lg:block',
      showMobileSidebar ? 'block' : 'hidden lg:block',
      themeStore.sidebarCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo Section -->
    <div
      class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700"
    >
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
          :src="authStore.user?.avatar || '/default-avatar.png'"
          :alt="authStore.user?.name"
          class="w-8 h-8 rounded-full object-cover"
        />
        <transition name="fade">
          <div v-if="!themeStore.sidebarCollapsed" class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.role }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <!-- Dashboard -->
      <router-link to="/dashboard" v-slot="{ isActive }" class="block">
        <div
          @click="themeStore.hideMobileSidebar"
          :class="['sidebar-item group', isActive ? 'active' : 'text-gray-700 dark:text-gray-300']"
          :title="themeStore.sidebarCollapsed ? 'Dashboard' : ''"
        >
          <Home :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']" />
          <transition name="fade">
            <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
              Dashboard
            </span>
          </transition>
        </div>
      </router-link>

      <!-- Employee Management -->
      <div>
        <!-- Main Employee Menu -->
        <button
          @click="toggleEmployeeMenu"
          :class="[
            'sidebar-item w-full group',
            isEmployeeModuleActive ? 'active' : 'text-gray-700 dark:text-gray-300'
          ]"
          :title="themeStore.sidebarCollapsed ? 'Employee Management' : ''"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <Users :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']" />
              <transition name="fade">
                <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
                  Staff Management
                </span>
              </transition>
            </div>
            <transition name="fade">
              <ChevronDown 
                v-if="!themeStore.sidebarCollapsed"
                :class="['w-4 h-4 transition-transform duration-200', { 'transform rotate-180': showEmployeeMenu }]"
              />
            </transition>
          </div>
        </button>

        <!-- Employee Submenu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-show="showEmployeeMenu && !themeStore.sidebarCollapsed" class="mt-2 ml-6 space-y-1">
            <router-link to="/employees" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <UserIcon class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Employees</span>
              </div>
            </router-link>
            <router-link to="/positions" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <Briefcase class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Positions</span>
              </div>
            </router-link>
            <router-link to="/departments" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <Building class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Departments</span>
              </div>
            </router-link>
            <router-link to="/organogram" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <BarChart3 class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Organogram</span>
              </div>
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Payroll Management -->
      <div>
        <!-- Main Payroll Menu -->
        <button
          @click="togglePayrollMenu"
          :class="[
            'sidebar-item w-full group',
            isPayrollModuleActive ? 'active' : 'text-gray-700 dark:text-gray-300'
          ]"
          :title="themeStore.sidebarCollapsed ? 'Payroll Management' : ''"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <CreditCard :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']" />
              <transition name="fade">
                <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
                  Payroll Management
                </span>
              </transition>
            </div>
            <transition name="fade">
              <ChevronDown 
                v-if="!themeStore.sidebarCollapsed"
                :class="['w-4 h-4 transition-transform duration-200', { 'transform rotate-180': showPayrollMenu }]"
              />
            </transition>
          </div>
        </button>

        <!-- Payroll Submenu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-show="showPayrollMenu && !themeStore.sidebarCollapsed" class="mt-2 ml-6 space-y-1">
            <router-link to="/payroll" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <Calculator class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Payroll Processing</span>
              </div>
            </router-link>
            <router-link to="/payroll/templates" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <FileText class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Payroll Templates</span>
              </div>
            </router-link>
            <router-link to="/payroll/employees" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <DollarSign class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Employee Payroll</span>
              </div>
            </router-link>
            <router-link to="/payroll/employee-items" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <UserIcon class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Employee Items</span>
              </div>
            </router-link>
            <router-link to="/payroll/garnishments" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <Scale class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Garnishments</span>
              </div>
            </router-link>
            <router-link to="/payroll/statutory-deductions" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <Shield class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Statutory Deductions</span>
              </div>
            </router-link>
            <router-link to="/payroll/reports" v-slot="{ isActive }" class="block">
              <div
                @click="themeStore.hideMobileSidebar"
                :class="['sidebar-item text-sm group', isActive ? 'active' : 'text-gray-600 dark:text-gray-400']"
              >
                <BarChart3 class="w-4 h-4 flex-shrink-0 mr-3" />
                <span class="text-sm">Payroll Reports</span>
              </div>
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Reports -->
      <router-link to="/reports" v-slot="{ isActive }" class="block">
        <div
          @click="themeStore.hideMobileSidebar"
          :class="['sidebar-item group', isActive ? 'active' : 'text-gray-700 dark:text-gray-300']"
          :title="themeStore.sidebarCollapsed ? 'Reports' : ''"
        >
          <FileText :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']" />
          <transition name="fade">
            <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
              Reports
            </span>
          </transition>
        </div>
      </router-link>

      <!-- Settings -->
      <router-link to="/settings" v-slot="{ isActive }" class="block">
        <div
          @click="themeStore.hideMobileSidebar"
          :class="['sidebar-item group', isActive ? 'active' : 'text-gray-700 dark:text-gray-300']"
          :title="themeStore.sidebarCollapsed ? 'Settings' : ''"
        >
          <Settings :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']" />
          <transition name="fade">
            <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
              Settings
            </span>
          </transition>
        </div>
      </router-link>
    </nav>

    <!-- Bottom Section -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="themeStore.toggleTheme"
        :class="[
          'sidebar-item w-full text-gray-700 dark:text-gray-300',
          themeStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="themeStore.sidebarCollapsed ? 'Toggle Theme' : ''"
      >
        <Sun
          v-if="themeStore.isDark"
          :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? '' : 'mr-3']"
        />
        <Moon
          v-else
          :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? '' : 'mr-3']"
        />
        <transition name="fade">
          <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium">
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
        <LogOut :class="['w-5 h-5 flex-shrink-0', themeStore.sidebarCollapsed ? '' : 'mr-3']" />
        <transition name="fade">
          <span v-if="!themeStore.sidebarCollapsed" class="text-sm font-medium"> Logout </span>
        </transition>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { 
  Building2, 
  Home, 
  Users, 
  CreditCard, 
  Sun, 
  Moon, 
  LogOut,
  ChevronDown,
  User as UserIcon,
  Briefcase,
  Building,
  BarChart3,
  FileText,
  Settings,
  Calculator,
  DollarSign,
  Scale,
  Shield
} from 'lucide-vue-next'

const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const showMobileSidebar = computed(() => themeStore.showMobileSidebar)
const showEmployeeMenu = ref(false)
const showPayrollMenu = ref(false)

const isEmployeeModuleActive = computed(() => {
  return ['/employees', '/positions', '/departments', '/organogram'].some(path => 
    route.path.startsWith(path)
  )
})

const isPayrollModuleActive = computed(() => {
  return ['/payroll'].some(path => 
    route.path.startsWith(path)
  )
})

const toggleEmployeeMenu = () => {
  showEmployeeMenu.value = !showEmployeeMenu.value
}

const togglePayrollMenu = () => {
  showPayrollMenu.value = !showPayrollMenu.value
}

// Auto-expand menus if we're on related pages
watch(() => route.path, () => {
  if (isEmployeeModuleActive.value) {
    showEmployeeMenu.value = true
  }
  if (isPayrollModuleActive.value) {
    showPayrollMenu.value = true
  }
}, { immediate: true })

// Collapse menus when sidebar is collapsed
watch(() => themeStore.sidebarCollapsed, (collapsed) => {
  if (collapsed) {
    showEmployeeMenu.value = false
    showPayrollMenu.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-item {
  @apply flex items-center px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.sidebar-item.active {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300;
}
</style>
