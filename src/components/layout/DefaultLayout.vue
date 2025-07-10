<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Sidebar -->
    <SidebarMenu />

    <!-- Top Navigation -->
    <TopNav />

    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div
        v-if="showMobileSidebar"
        @click="closeMobileSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      ></div>
    </transition>

    <!-- Main Content Area -->
    <main
      :class="[
        'transition-all duration-300 ease-in-out',
        'lg:' + (themeStore.sidebarCollapsed ? 'ml-16' : 'ml-64'),
        'ml-0',
        'pt-16',
        'min-h-screen'
      ]"
    >
      <!-- Page Content -->
      <div class="p-4 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <!-- Loading Spinner -->
    <transition name="fade">
      <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3 shadow-lg">
          <div class="loading-spinner w-6 h-6"></div>
          <span class="text-gray-900 dark:text-white font-medium">Loading...</span>
        </div>
      </div>
    </transition>

    <!-- Toast Notifications -->
    <teleport to="body">
      <div class="fixed top-20 right-4 lg:right-6 z-50 space-y-2 max-w-sm">
        <transition-group name="toast" tag="div">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 transform transition-all duration-300',
              {
                'border-green-200 dark:border-green-800': toast.type === 'success',
                'border-red-200 dark:border-red-800': toast.type === 'error',
                'border-yellow-200 dark:border-yellow-800': toast.type === 'warning',
                'border-blue-200 dark:border-blue-800': toast.type === 'info'
              }
            ]"
          >
            <div class="flex items-start">
              <div
                :class="[
                  'flex-shrink-0 w-5 h-5 mt-0.5 mr-3',
                  {
                    'text-green-500': toast.type === 'success',
                    'text-red-500': toast.type === 'error',
                    'text-yellow-500': toast.type === 'warning',
                    'text-blue-500': toast.type === 'info'
                  }
                ]"
              >
                <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
                <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
                <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
                <Info v-else class="w-5 h-5" />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ toast.message }}
                </p>
              </div>

              <button
                @click="removeToast(toast.id)"
                class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import SidebarMenu from './SidebarMenu.vue'
import TopNav from './TopNav.vue'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const route = useRoute()
const themeStore = useThemeStore()

// Reactive state
const loading = ref(false)
const showMobileSidebar = ref(false)
const toasts = ref([])
let toastIdCounter = 0

// Methods
function closeMobileSidebar() {
  showMobileSidebar.value = false
}

function addToast(toast) {
  const id = ++toastIdCounter
  const newToast = {
    id,
    type: 'info',
    title: '',
    message: '',
    duration: 4000,
    ...toast
  }

  toasts.value.push(newToast)

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id)
  }, newToast.duration)
}

function removeToast(id) {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Global event listeners for toast notifications
function setupGlobalToasts() {
  // You can emit these events from anywhere in your app
  window.addEventListener('show-toast', event => {
    addToast(event.detail)
  })
}

// Handle responsive sidebar
function handleResize() {
  if (window.innerWidth >= 1024) {
    showMobileSidebar.value = false
  }
}

// Watch for route changes to hide mobile sidebar
watch(
  () => route.path,
  () => {
    if (showMobileSidebar.value) {
      showMobileSidebar.value = false
    }
  }
)

// Loading state management
function setLoading(state) {
  loading.value = state
}

// Expose methods for child components
defineExpose({
  addToast,
  setLoading,
  showMobileSidebar,
  closeMobileSidebar
})

// Initialize on mount
onMounted(() => {
  // Setup global toast system
  setupGlobalToasts()

  // Add resize listener
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Toast transitions */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
