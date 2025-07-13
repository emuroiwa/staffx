import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PositionList from '@/pages/positions/PositionList.vue'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'

// Mock the stores
vi.mock('@/stores/employee')
vi.mock('@/stores/notification')
vi.mock('lodash-es', () => ({
  debounce: vi.fn((fn) => fn)
}))

describe('PositionList', () => {
  let wrapper: any
  let employeeStore: any
  let notificationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Mock employee store
    employeeStore = {
      fetchPositions: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Software Engineer',
            description: 'Develops software applications',
            is_active: true,
            employees_count: 5,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'UX Designer',
            description: 'Designs user experiences',
            is_active: true,
            employees_count: 2,
            created_at: '2024-01-02T00:00:00Z'
          },
          {
            id: '3',
            name: 'Project Manager',
            description: null,
            is_active: false,
            employees_count: 0,
            created_at: '2024-01-03T00:00:00Z'
          }
        ]
      }),
      deletePosition: vi.fn().mockResolvedValue({})
    }

    // Mock notification store
    notificationStore = {
      addNotification: vi.fn()
    }

    vi.mocked(useEmployeeStore).mockReturnValue(employeeStore)
    vi.mocked(useNotificationStore).mockReturnValue(notificationStore)

    wrapper = mount(PositionList, {
      global: {
        plugins: [createPinia()],
        stubs: {
          'PositionCreateModal': true,
          'PositionDetailModal': true
        }
      }
    })
  })

  it('renders position list page correctly', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('h1').text()).toBe('Positions')
    expect(wrapper.text()).toContain('Manage organizational positions and roles')
    expect(wrapper.find('button:contains("Add Position")').exists()).toBe(true)
  })

  it('displays statistics cards with correct computed values', async () => {
    await wrapper.vm.$nextTick()
    
    // Total positions should be 3
    expect(wrapper.vm.positions).toHaveLength(3)
    
    // Active positions should be 2
    expect(wrapper.vm.activePositions).toBe(2)
    
    // Filled positions should be 2 (positions with employees_count > 0)
    expect(wrapper.vm.filledPositions).toBe(2)
  })

  it('displays position cards when positions exist', async () => {
    await wrapper.vm.$nextTick()
    
    // Should display position cards in grid
    const positionCards = wrapper.findAll('.grid .bg-white')
    expect(positionCards.length).toBeGreaterThan(0)
    
    // Should show position names
    expect(wrapper.text()).toContain('Software Engineer')
    expect(wrapper.text()).toContain('UX Designer')
    expect(wrapper.text()).toContain('Project Manager')
  })

  it('shows search and filter controls', async () => {
    await wrapper.vm.$nextTick()
    
    // Should have search input
    const searchInput = wrapper.find('input[placeholder="Search positions..."]')
    expect(searchInput.exists()).toBe(true)
    
    // Should have status filter
    const statusSelect = wrapper.find('select')
    expect(statusSelect.exists()).toBe(true)
  })

  it('handles search functionality', async () => {
    await wrapper.vm.$nextTick()
    
    const searchInput = wrapper.find('input[placeholder="Search positions..."]')
    await searchInput.setValue('Engineer')
    
    expect(wrapper.vm.filters.search).toBe('Engineer')
  })

  it('handles status filter changes', async () => {
    await wrapper.vm.$nextTick()
    
    const statusSelect = wrapper.find('select')
    await statusSelect.setValue('active')
    
    expect(wrapper.vm.filters.status).toBe('active')
    expect(employeeStore.fetchPositions).toHaveBeenCalled()
  })

  it('opens create modal when add button is clicked', async () => {
    await wrapper.vm.$nextTick()
    
    const addBtn = wrapper.find('button:contains("Add Position")')
    await addBtn.trigger('click')
    
    expect(wrapper.vm.showCreateModal).toBe(true)
  })

  it('handles position deletion with confirmation', async () => {
    // Mock window.confirm
    window.confirm = vi.fn().mockReturnValue(true)
    
    await wrapper.vm.deletePosition({ id: '1', name: 'Software Engineer' })
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Software Engineer"?')
    expect(employeeStore.deletePosition).toHaveBeenCalledWith('1')
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Position deleted successfully'
    })
  })

  it('cancels deletion when user declines confirmation', async () => {
    // Mock window.confirm to return false
    window.confirm = vi.fn().mockReturnValue(false)
    
    await wrapper.vm.deletePosition({ id: '1', name: 'Software Engineer' })
    
    expect(window.confirm).toHaveBeenCalled()
    expect(employeeStore.deletePosition).not.toHaveBeenCalled()
  })

  it('handles create modal events correctly', async () => {
    await wrapper.vm.handlePositionCreated()
    
    expect(wrapper.vm.showCreateModal).toBe(false)
    expect(employeeStore.fetchPositions).toHaveBeenCalled()
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Position created successfully'
    })
  })

  it('handles detail modal events correctly', async () => {
    await wrapper.vm.handlePositionUpdated()
    
    expect(wrapper.vm.showDetailModal).toBe(false)
    expect(employeeStore.fetchPositions).toHaveBeenCalled()
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Position updated successfully'
    })
  })

  it('opens detail modal when view button is clicked', async () => {
    const testPosition = { id: '1', name: 'Test Position' }
    
    await wrapper.vm.viewPosition(testPosition)
    
    expect(wrapper.vm.selectedPosition).toBe(testPosition)
    expect(wrapper.vm.showDetailModal).toBe(true)
  })

  it('opens detail modal when edit button is clicked', async () => {
    const testPosition = { id: '1', name: 'Test Position' }
    
    await wrapper.vm.editPosition(testPosition)
    
    expect(wrapper.vm.selectedPosition).toBe(testPosition)
    expect(wrapper.vm.showDetailModal).toBe(true)
  })

  it('returns correct status badge class', () => {
    expect(wrapper.vm.getStatusBadgeClass(true)).toBe('bg-green-100 text-green-800')
    expect(wrapper.vm.getStatusBadgeClass(false)).toBe('bg-gray-100 text-gray-800')
  })

  it('formats date correctly', () => {
    const testDate = '2024-01-01T00:00:00Z'
    const formatted = wrapper.vm.formatDate(testDate)
    expect(formatted).toBe('1/1/2024')
    
    expect(wrapper.vm.formatDate(null)).toBe('N/A')
    expect(wrapper.vm.formatDate('')).toBe('N/A')
  })

  it('shows empty state when no positions exist', async () => {
    // Mock empty positions
    employeeStore.fetchPositions = vi.fn().mockResolvedValue({ data: [] })
    
    wrapper = mount(PositionList, {
      global: {
        plugins: [createPinia()],
        stubs: {
          'PositionCreateModal': true,
          'PositionDetailModal': true
        }
      }
    })
    
    await wrapper.vm.fetchPositions()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('No positions found')
    expect(wrapper.text()).toContain('Get started by adding a new position.')
  })

  it('shows loading state while fetching data', async () => {
    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error')
    employeeStore.fetchPositions = vi.fn().mockRejectedValue(error)
    
    await wrapper.vm.fetchPositions()
    
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Failed to fetch positions'
    })
  })

  it('handles deletion errors gracefully', async () => {
    window.confirm = vi.fn().mockReturnValue(true)
    const error = new Error('Delete failed')
    employeeStore.deletePosition = vi.fn().mockRejectedValue(error)
    
    await wrapper.vm.deletePosition({ id: '1', name: 'Test Position' })
    
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Failed to delete position'
    })
  })

  it('fetches positions on component mount', () => {
    expect(employeeStore.fetchPositions).toHaveBeenCalled()
  })

  it('debounces search input', async () => {
    const searchInput = wrapper.find('input[placeholder="Search positions..."]')
    
    await searchInput.trigger('input')
    
    // Should call debouncedSearch
    expect(wrapper.vm.filters.page).toBe(1)
  })
})