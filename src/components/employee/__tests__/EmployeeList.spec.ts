import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EmployeeList from '@/pages/employees/EmployeeList.vue'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'

// Mock the stores
vi.mock('@/stores/employee')
vi.mock('@/stores/notification')
vi.mock('lodash-es', () => ({
  debounce: vi.fn((fn) => fn)
}))

describe('EmployeeList', () => {
  let wrapper: any
  let employeeStore: any
  let notificationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Mock employee store
    employeeStore = {
      fetchEmployees: vi.fn().mockResolvedValue({
        data: [
          {
            uuid: '1',
            employee_id: 'EMP001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            display_name: 'John Doe',
            position: { name: 'Software Engineer' },
            department: { name: 'Engineering' },
            status: 'active',
            formatted_salary: '$75,000 USD'
          },
          {
            uuid: '2',
            employee_id: 'EMP002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            display_name: 'Jane Smith',
            position: { name: 'Designer' },
            department: { name: 'Design' },
            status: 'active',
            formatted_salary: '$70,000 USD'
          }
        ],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 2,
        from: 1,
        to: 2
      }),
      fetchStatistics: vi.fn().mockResolvedValue({
        total_employees: 2,
        active_employees: 2,
        directors: 0,
        total_payroll: 145000
      }),
      fetchDepartments: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Design' }
        ]
      }),
      deleteEmployee: vi.fn().mockResolvedValue({}),
      exportEmployees: vi.fn().mockResolvedValue({})
    }

    // Mock notification store
    notificationStore = {
      addNotification: vi.fn()
    }

    vi.mocked(useEmployeeStore).mockReturnValue(employeeStore)
    vi.mocked(useNotificationStore).mockReturnValue(notificationStore)

    wrapper = mount(EmployeeList, {
      global: {
        plugins: [createPinia()],
        stubs: {
          'EmployeeCreateModal': true,
          'EmployeeDetailModal': true
        }
      }
    })
  })

  it('renders employee list correctly', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('h1').text()).toBe('Employees')
    expect(wrapper.find('[data-testid="add-employee-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="export-btn"]').exists()).toBe(true)
  })

  it('displays statistics cards', async () => {
    await wrapper.vm.$nextTick()
    
    // Should display statistics cards
    const statsCards = wrapper.findAll('.grid .bg-white')
    expect(statsCards.length).toBeGreaterThan(0)
  })

  it('shows employee table when employees exist', async () => {
    await wrapper.vm.$nextTick()
    
    // Should show table
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('displays search and filter inputs', async () => {
    await wrapper.vm.$nextTick()
    
    // Should have search input
    const searchInput = wrapper.find('input[placeholder="Search employees..."]')
    expect(searchInput.exists()).toBe(true)
    
    // Should have filter selects
    const statusSelect = wrapper.find('select')
    expect(statusSelect.exists()).toBe(true)
  })

  it('calls export function when export button is clicked', async () => {
    await wrapper.vm.$nextTick()
    
    const exportBtn = wrapper.find('[data-testid="export-btn"]')
    await exportBtn.trigger('click')
    
    expect(employeeStore.exportEmployees).toHaveBeenCalled()
  })

  it('opens create modal when add button is clicked', async () => {
    await wrapper.vm.$nextTick()
    
    const addBtn = wrapper.find('[data-testid="add-employee-btn"]')
    await addBtn.trigger('click')
    
    expect(wrapper.vm.showCreateModal).toBe(true)
  })

  it('updates search query when typing in search input', async () => {
    await wrapper.vm.$nextTick()
    
    const searchInput = wrapper.find('input[placeholder="Search employees..."]')
    await searchInput.setValue('John')
    
    expect(wrapper.vm.filters.search).toBe('John')
  })

  it('handles employee deletion correctly', async () => {
    // Mock window.confirm
    window.confirm = vi.fn().mockReturnValue(true)
    
    await wrapper.vm.deleteEmployee({ uuid: '1', display_name: 'John Doe' })
    
    expect(employeeStore.deleteEmployee).toHaveBeenCalledWith('1')
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Employee deleted successfully'
    })
  })

  it('handles employee creation success', async () => {
    await wrapper.vm.handleEmployeeCreated()
    
    expect(wrapper.vm.showCreateModal).toBe(false)
    expect(employeeStore.fetchEmployees).toHaveBeenCalled()
    expect(employeeStore.fetchStatistics).toHaveBeenCalled()
    expect(notificationStore.addNotification).toHaveBeenCalledWith({
      type: 'success',
      title: 'Success',
      message: 'Employee created successfully'
    })
  })

  it('generates correct initials', () => {
    const initials = wrapper.vm.getInitials('John', 'Doe')
    expect(initials).toBe('JD')
    
    const initialsPartial = wrapper.vm.getInitials('Jane', '')
    expect(initialsPartial).toBe('J')
  })

  it('formats status correctly', () => {
    expect(wrapper.vm.formatStatus('active')).toBe('Active')
    expect(wrapper.vm.formatStatus('inactive')).toBe('Inactive')
  })

  it('returns correct status badge class', () => {
    expect(wrapper.vm.getStatusBadgeClass('active')).toBe('bg-green-100 text-green-800')
    expect(wrapper.vm.getStatusBadgeClass('inactive')).toBe('bg-yellow-100 text-yellow-800')
    expect(wrapper.vm.getStatusBadgeClass('terminated')).toBe('bg-red-100 text-red-800')
  })

  it('fetches data on mount', () => {
    expect(employeeStore.fetchEmployees).toHaveBeenCalled()
    expect(employeeStore.fetchStatistics).toHaveBeenCalled()
    expect(employeeStore.fetchDepartments).toHaveBeenCalled()
  })
})