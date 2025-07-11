<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700"></div>
      <div class="absolute inset-0 bg-black/10"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
        <!-- Logo -->
        <div class="mb-8">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Building2 class="w-7 h-7 text-white" />
            </div>
            <span class="text-3xl font-bold">StaffX</span>
          </div>
        </div>

        <!-- Tagline -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">Modern HR Management</h1>
          <p class="text-xl opacity-90 max-w-md leading-relaxed">
            Streamline your workforce management with powerful tools for employee tracking, payroll,
            and analytics.
          </p>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 gap-6 max-w-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users class="w-4 h-4" />
            </div>
            <span class="text-lg">Employee Management</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard class="w-4 h-4" />
            </div>
            <span class="text-lg">Payroll Processing</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 class="w-4 h-4" />
            </div>
            <span class="text-lg">Analytics & Reports</span>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-32 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>

    <!-- Right Side - Auth Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8">
      <!-- Mobile Logo -->
      <div class="lg:hidden mb-8 text-center">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Building2 class="w-6 h-6 text-white" />
          </div>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">StaffX</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Modern HR Management System</p>
      </div>

      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6">
        <button @click="themeStore.toggleTheme" class="nav-button" aria-label="Toggle theme">
          <Sun v-if="themeStore.isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Auth Form Container -->
      <div class="mx-auto w-full max-w-md">
        <router-view />
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">© 2024 StaffX. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { Building2, Users, CreditCard, BarChart3, Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>
