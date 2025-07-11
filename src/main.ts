import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Initialize auth state from localStorage
const initializeApp = async () => {
  const authStore = useAuthStore()
  await authStore.initializeAuth()
  
  // Mount app after auth initialization
  app.mount('#app')
}

initializeApp()
