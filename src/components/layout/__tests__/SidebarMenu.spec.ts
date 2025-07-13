import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import SidebarMenu from '@/components/layout/SidebarMenu.vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

// Mock the stores
vi.mock('@/stores/theme')
vi.mock('@/stores/auth')

describe('SidebarMenu', () => {
  let wrapper: any
  let router: any
  let themeStore: any
  let authStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    
    // Create router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/employees', component: { template: '<div>Employees</div>' } },
        { path: '/positions', component: { template: '<div>Positions</div>' } },
        { path: '/departments', component: { template: '<div>Departments</div>' } },
        { path: '/organogram', component: { template: '<div>Organogram</div>' } },
        { path: '/payroll', component: { template: '<div>Payroll</div>' } },
        { path: '/reports', component: { template: '<div>Reports</div>' } },
        { path: '/settings', component: { template: '<div>Settings</div>' } }
      ]
    })

    // Mock theme store
    themeStore = {
      sidebarCollapsed: false,
      showMobileSidebar: false,
      isDark: false,
      toggleTheme: vi.fn(),
      hideMobileSidebar: vi.fn()
    }

    // Mock auth store
    authStore = {
      user: {
        name: 'John Doe',
        role: 'Admin',
        avatar: '/test-avatar.jpg'
      },
      logout: vi.fn()
    }

    vi.mocked(useThemeStore).mockReturnValue(themeStore)
    vi.mocked(useAuthStore).mockReturnValue(authStore)

    router.push('/')
    await router.isReady()

    wrapper = mount(SidebarMenu, {
      global: {
        plugins: [router, createPinia()]
      }
    })
  })

  it('renders sidebar with correct brand name', () => {
    expect(wrapper.find('span').text()).toBe('GM58 HR')
  })

  it('displays user information', () => {
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Admin')
    
    const avatar = wrapper.find('img')
    expect(avatar.attributes('src')).toBe('/test-avatar.jpg')
    expect(avatar.attributes('alt')).toBe('John Doe')
  })

  it('shows all navigation items', () => {
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Employee Management')
    expect(wrapper.text()).toContain('Payroll')
    expect(wrapper.text()).toContain('Reports')
    expect(wrapper.text()).toContain('Settings')
  })

  it('displays employee submenu items when expanded', async () => {
    // Initially collapsed, submenu should not be visible
    expect(wrapper.find('[data-testid="employee-submenu"]').exists()).toBe(false)
    
    // Click to expand employee menu
    const employeeMenuBtn = wrapper.find('button:contains("Employee Management")')
    await employeeMenuBtn.trigger('click')
    
    expect(wrapper.vm.showEmployeeMenu).toBe(true)
    
    // Should show submenu items
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Employees')
    expect(wrapper.text()).toContain('Positions')
    expect(wrapper.text()).toContain('Departments')
    expect(wrapper.text()).toContain('Organogram')
  })

  it('toggles employee menu when clicked', async () => {
    const employeeMenuBtn = wrapper.find('button:contains("Employee Management")')
    
    expect(wrapper.vm.showEmployeeMenu).toBe(false)
    
    await employeeMenuBtn.trigger('click')
    expect(wrapper.vm.showEmployeeMenu).toBe(true)
    
    await employeeMenuBtn.trigger('click')
    expect(wrapper.vm.showEmployeeMenu).toBe(false)
  })

  it('auto-expands employee menu when on employee-related route', async () => {
    await router.push('/employees')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.showEmployeeMenu).toBe(true)
  })

  it('shows correct active state for current route', async () => {
    await router.push('/dashboard')
    await wrapper.vm.$nextTick()
    
    const dashboardLink = wrapper.find('a[href="/dashboard"]')
    expect(dashboardLink.classes()).toContain('active')
  })

  it('collapses employee menu when sidebar is collapsed', async () => {
    wrapper.vm.showEmployeeMenu = true
    themeStore.sidebarCollapsed = true
    
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showEmployeeMenu).toBe(false)
  })

  it('hides mobile sidebar when navigation item is clicked', async () => {
    const dashboardLink = wrapper.find('a[href="/dashboard"]')
    await dashboardLink.trigger('click')
    
    expect(themeStore.hideMobileSidebar).toHaveBeenCalled()
  })

  it('calls theme toggle when theme button is clicked', async () => {
    const themeBtn = wrapper.find('button:contains("Light Mode")')
    await themeBtn.trigger('click')
    
    expect(themeStore.toggleTheme).toHaveBeenCalled()
  })

  it('shows correct theme button text', () => {
    // When isDark is false
    expect(wrapper.text()).toContain('Dark Mode')
    
    // When isDark is true
    themeStore.isDark = true
    wrapper = mount(SidebarMenu, {
      global: {
        plugins: [router, createPinia()]
      }
    })
    expect(wrapper.text()).toContain('Light Mode')
  })

  it('calls logout when logout button is clicked', async () => {
    const logoutBtn = wrapper.find('button:contains("Logout")')
    await logoutBtn.trigger('click')
    
    expect(authStore.logout).toHaveBeenCalled()
  })

  it('applies correct CSS classes when sidebar is collapsed', async () => {
    themeStore.sidebarCollapsed = true
    
    wrapper = mount(SidebarMenu, {
      global: {
        plugins: [router, createPinia()]
      }
    })
    
    expect(wrapper.find('.w-16').exists()).toBe(true)
    expect(wrapper.find('.w-64').exists()).toBe(false)
  })

  it('applies correct CSS classes when sidebar is expanded', () => {
    themeStore.sidebarCollapsed = false
    
    expect(wrapper.find('.w-64').exists()).toBe(true)
    expect(wrapper.find('.w-16').exists()).toBe(false)
  })

  it('shows mobile sidebar when showMobileSidebar is true', async () => {
    themeStore.showMobileSidebar = true
    
    wrapper = mount(SidebarMenu, {
      global: {
        plugins: [router, createPinia()]
      }
    })
    
    expect(wrapper.classes()).toContain('block')
  })

  it('hides submenu content when sidebar is collapsed', async () => {
    wrapper.vm.showEmployeeMenu = true
    themeStore.sidebarCollapsed = true
    
    await wrapper.vm.$nextTick()
    
    const submenu = wrapper.find('[data-testid="employee-submenu"]')
    expect(submenu.exists()).toBe(false)
  })

  it('handles missing user avatar gracefully', async () => {
    authStore.user.avatar = null
    
    wrapper = mount(SidebarMenu, {
      global: {
        plugins: [router, createPinia()]
      }
    })
    
    const avatar = wrapper.find('img')
    expect(avatar.attributes('src')).toBe('/default-avatar.png')
  })

  it('updates employee module active state correctly', async () => {
    // Not on employee module
    await router.push('/dashboard')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEmployeeModuleActive).toBe(false)
    
    // On employee list page
    await router.push('/employees')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEmployeeModuleActive).toBe(true)
    
    // On positions page
    await router.push('/positions')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEmployeeModuleActive).toBe(true)
    
    // On departments page
    await router.push('/departments')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEmployeeModuleActive).toBe(true)
    
    // On organogram page
    await router.push('/organogram')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEmployeeModuleActive).toBe(true)
  })
})