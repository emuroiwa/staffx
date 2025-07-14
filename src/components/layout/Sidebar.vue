<template>
  <aside class="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">GM</span>
        </div>
        <span class="text-xl font-semibold text-gray-900">GM58 HR</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 overflow-y-auto">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/dashboard' }"
          >
            <DashboardIcon class="w-5 h-5 mr-3" />
            Dashboard
          </router-link>
        </li>

        <!-- Employee Management -->
        <li>
          <div>
            <!-- Main Employee Menu -->
            <button
              @click="toggleEmployeeMenu"
              class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              :class="{ 
                'bg-blue-50 text-blue-700': isEmployeeModuleActive,
                'font-medium': isEmployeeModuleActive 
              }"
            >
              <UsersIcon class="w-5 h-5 mr-3" />
              Staff
              <ChevronDownIcon 
                class="w-4 h-4 ml-auto transition-transform duration-200"
                :class="{ 'transform rotate-180': showEmployeeMenu }"
              />
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
              <ul v-show="showEmployeeMenu" class="mt-2 ml-8 space-y-1">
                <li>
                  <router-link
                    to="/employees"
                    class="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === '/employees' }"
                  >
                    <UserIcon class="w-4 h-4 mr-3" />
                    Employees
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/positions"
                    class="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === '/positions' }"
                  >
                    <BriefcaseIcon class="w-4 h-4 mr-3" />
                    Positions
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/departments"
                    class="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === '/departments' }"
                  >
                    <BuildingOfficeIcon class="w-4 h-4 mr-3" />
                    Departments
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/organogram"
                    class="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === '/organogram' }"
                  >
                    <ChartBarIcon class="w-4 h-4 mr-3" />
                    Organogram
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>

        <!-- Payroll -->
        <li>
          <router-link
            to="/payroll"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/payroll') }"
          >
            <CurrencyDollarIcon class="w-5 h-5 mr-3" />
            Payroll
          </router-link>
        </li>

        <!-- Reports -->
        <li>
          <router-link
            to="/reports"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/reports') }"
          >
            <DocumentChartBarIcon class="w-5 h-5 mr-3" />
            Reports
          </router-link>
        </li>

        <!-- Settings -->
        <li>
          <router-link
            to="/settings"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/settings') }"
          >
            <CogIcon class="w-5 h-5 mr-3" />
            Settings
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Profile Section -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <UserIcon class="w-5 h-5 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user?.role }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  UsersIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  CogIcon
} from '@heroicons/vue/24/outline'
import { 
  ChartBarIcon as DashboardIcon 
} from '@heroicons/vue/24/solid'

const route = useRoute()
const authStore = useAuthStore()

const showEmployeeMenu = ref(false)

const user = computed(() => authStore.user)

const isEmployeeModuleActive = computed(() => {
  return ['/employees', '/positions', '/departments', '/organogram'].some(path => 
    route.path.startsWith(path)
  )
})

const toggleEmployeeMenu = () => {
  showEmployeeMenu.value = !showEmployeeMenu.value
}

// Auto-expand employee menu if we're on an employee-related page
watch(() => route.path, (newPath) => {
  if (isEmployeeModuleActive.value) {
    showEmployeeMenu.value = true
  }
}, { immediate: true })
</script>