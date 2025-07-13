import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EmployeeCreateModal from '@/components/employee/EmployeeCreateModal.vue'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'

// Mock the stores
vi.mock('@/stores/employee')
vi.mock('@/stores/notification')

describe('EmployeeCreateModal', () => {
  let wrapper: any
  let employeeStore: any
  let notificationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    employeeStore = {
      fetchDepartments: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Design' }
        ]
      }),
      fetchPositions: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Software Engineer' },
          { id: '2', name: 'Designer' }
        ]
      }),
      fetchPotentialManagers: vi.fn().mockResolvedValue({
        data: [
          { uuid: '1', first_name: 'John', last_name: 'Manager', employee_id: 'EMP001' }
        ]
      }),
      createEmployee: vi.fn().mockResolvedValue({
        uuid: '123',
        first_name: 'Test',
        last_name: 'Employee'
      })
    }

    notificationStore = {
      addNotification: vi.fn()
    }

    vi.mocked(useEmployeeStore).mockReturnValue(employeeStore)
    vi.mocked(useNotificationStore).mockReturnValue(notificationStore)

    wrapper = mount(EmployeeCreateModal, {
      global: {
        plugins: [createPinia()]
      }
    })
  })

  it('renders modal with correct title', () => {
    expect(wrapper.find('h3').text()).toBe('Add New Employee')
    expect(wrapper.find('p').text()).toContain('Step 1 of 4')
  })

  it('shows progress bar with correct initial progress', () => {
    const progressBar = wrapper.find('.bg-blue-600')
    expect(progressBar.attributes('style')).toContain('width: 25%')
  })

  it('displays step 1 content initially', () => {
    expect(wrapper.find('h4').text()).toBe('Basic Information')
    expect(wrapper.find('input[id="first_name"]').exists()).toBe(true)
    expect(wrapper.find('input[id="last_name"]').exists()).toBe(true)
    expect(wrapper.find('input[id="email"]').exists()).toBe(true)
  })

  it('validates required fields before proceeding to next step', async () => {
    const nextBtn = wrapper.find('button:contains("Next")')
    expect(nextBtn.attributes('disabled')).toBeDefined()
    
    // Fill required fields
    await wrapper.find('input[id="first_name"]').setValue('John')
    await wrapper.find('input[id="last_name"]').setValue('Doe')
    await wrapper.find('input[id="employee_id"]').setValue('EMP123')
    await wrapper.find('input[id="email"]').setValue('john.doe@example.com')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.canProceed).toBe(true)
  })

  it('progresses through steps correctly', async () => {
    // Fill step 1 required fields
    wrapper.vm.form.first_name = 'John'
    wrapper.vm.form.last_name = 'Doe'
    wrapper.vm.form.employee_id = 'EMP123'
    wrapper.vm.form.email = 'john.doe@example.com'
    
    await wrapper.vm.goToNextStep()
    expect(wrapper.vm.currentStep).toBe(2)
    
    // Should show step 2 content
    expect(wrapper.find('h4').text()).toBe('Employment Details')
    expect(wrapper.find('select[id="department_uuid"]').exists()).toBe(true)
  })

  it('can go back to previous step', async () => {
    wrapper.vm.currentStep = 2
    await wrapper.vm.$nextTick()
    
    const prevBtn = wrapper.find('button:contains("Previous")')
    await prevBtn.trigger('click')
    
    expect(wrapper.vm.currentStep).toBe(1)
  })

  it('shows different content for each step', async () => {
    // Step 2
    wrapper.vm.currentStep = 2
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h4').text()).toBe('Employment Details')
    
    // Step 3
    wrapper.vm.currentStep = 3
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h4').text()).toBe('Compensation & Benefits')
    
    // Step 4
    wrapper.vm.currentStep = 4
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h4').text()).toBe('Additional Information')
  })

  it('shows create button on final step', async () => {
    wrapper.vm.currentStep = 4
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('button:contains("Create Employee")').exists()).toBe(true)
    expect(wrapper.find('button:contains("Next")').exists()).toBe(false)
  })

  it('handles form submission correctly', async () => {
    wrapper.vm.form.first_name = 'John'
    wrapper.vm.form.last_name = 'Doe'
    wrapper.vm.form.email = 'john.doe@example.com'
    wrapper.vm.form.employee_id = 'EMP123'
    wrapper.vm.form.department_uuid = '1'
    wrapper.vm.form.position_uuid = '1'
    wrapper.vm.form.salary = '75000'
    
    await wrapper.vm.submitForm()
    
    expect(employeeStore.createEmployee).toHaveBeenCalledWith(wrapper.vm.form)
  })

  it('emits created event on successful submission', async () => {
    wrapper.vm.form.first_name = 'John'
    wrapper.vm.form.last_name = 'Doe'
    wrapper.vm.form.email = 'john.doe@example.com'
    
    await wrapper.vm.submitForm()
    
    expect(wrapper.emitted('created')).toBeTruthy()
  })

  it('handles validation errors correctly', async () => {
    const validationError = {
      response: {
        status: 422,
        data: {
          errors: {
            first_name: ['First name is required'],
            email: ['Email is invalid']
          }
        }
      }
    }
    
    employeeStore.createEmployee = vi.fn().mockRejectedValue(validationError)
    
    await wrapper.vm.submitForm()
    
    expect(wrapper.vm.errors.first_name).toEqual(['First name is required'])
    expect(wrapper.vm.errors.email).toEqual(['Email is invalid'])
    expect(wrapper.vm.currentStep).toBe(1) // Should go back to step with errors
  })

  it('sets default dates on mount', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(wrapper.vm.form.start_date).toBe(today)
    expect(wrapper.vm.form.hire_date).toBe(today)
  })

  it('fetches reference data on mount', () => {
    expect(employeeStore.fetchDepartments).toHaveBeenCalled()
    expect(employeeStore.fetchPositions).toHaveBeenCalled()
  })

  it('emits close event when close button is clicked', async () => {
    const closeBtn = wrapper.find('button[data-testid="close-btn"]')
    await closeBtn.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('validates step-specific requirements', () => {
    // Step 1 validation
    wrapper.vm.currentStep = 1
    wrapper.vm.form.first_name = 'John'
    wrapper.vm.form.last_name = 'Doe'
    wrapper.vm.form.employee_id = 'EMP123'
    wrapper.vm.form.email = 'john@example.com'
    expect(wrapper.vm.canProceed).toBe(true)
    
    // Step 2 validation
    wrapper.vm.currentStep = 2
    wrapper.vm.form.department_uuid = ''
    expect(wrapper.vm.canProceed).toBe(false)
    
    wrapper.vm.form.department_uuid = '1'
    wrapper.vm.form.position_uuid = '1'
    wrapper.vm.form.employment_type = 'full_time'
    wrapper.vm.form.start_date = '2025-01-01'
    wrapper.vm.form.hire_date = '2025-01-01'
    expect(wrapper.vm.canProceed).toBe(true)
    
    // Step 3 validation
    wrapper.vm.currentStep = 3
    wrapper.vm.form.salary = ''
    expect(wrapper.vm.canProceed).toBe(false)
    
    wrapper.vm.form.salary = '75000'
    expect(wrapper.vm.canProceed).toBe(true)
    
    // Step 4 validation (always true)
    wrapper.vm.currentStep = 4
    expect(wrapper.vm.canProceed).toBe(true)
  })
})