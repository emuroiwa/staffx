<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEdit ? 'Edit Pay Run' : 'Create New Pay Run' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <form @submit.prevent="save" class="p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pay Run Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md p-3"
              placeholder="e.g., March 2024 Monthly Payroll"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full border border-gray-300 rounded-md p-3"
              placeholder="Optional description"
            />
          </div>
        </div>

        <!-- Pay Period -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Period Start Date *</label>
            <input
              v-model="form.pay_period_start"
              type="date"
              required
              class="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Period End Date *</label>
            <input
              v-model="form.pay_period_end"
              type="date"
              required
              class="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pay Date</label>
            <input
              v-model="form.pay_date"
              type="date"
              class="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
        </div>

        <!-- Pay Frequencies -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pay Frequencies *</label>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <label v-for="frequency in availableFrequencies" :key="frequency.value" 
                   class="flex items-center space-x-2">
              <input
                v-model="form.pay_frequencies"
                :value="frequency.value"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">{{ frequency.label }}</span>
            </label>
          </div>
        </div>

        <!-- Employee Selection -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Employee Selection *</label>
          
          <div class="space-y-3">
            <label class="flex items-center space-x-2">
              <input
                v-model="form.employee_selection.method"
                value="all"
                type="radio"
                class="text-blue-600"
              />
              <span>Include all active employees</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input
                v-model="form.employee_selection.method"
                value="criteria"
                type="radio"
                class="text-blue-600"
              />
              <span>Select by criteria</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input
                v-model="form.employee_selection.method"
                value="specific"
                type="radio"
                class="text-blue-600"
              />
              <span>Select specific employees</span>
            </label>
          </div>

          <!-- Criteria Selection -->
          <div v-if="form.employee_selection.method === 'criteria'" class="ml-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <select v-model="form.employee_selection.criteria.departments" multiple
                        class="w-full border border-gray-300 rounded-md p-3">
                  <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Positions</label>
                <select v-model="form.employee_selection.criteria.positions" multiple
                        class="w-full border border-gray-300 rounded-md p-3">
                  <option v-for="pos in positions" :key="pos.uuid" :value="pos.uuid">
                    {{ pos.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                <select v-model="form.employee_selection.criteria.employment_status" multiple
                        class="w-full border border-gray-300 rounded-md p-3">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pay Frequencies</label>
                <select v-model="form.employee_selection.criteria.pay_frequencies" multiple
                        class="w-full border border-gray-300 rounded-md p-3">
                  <option v-for="freq in availableFrequencies" :key="freq.value" :value="freq.value">
                    {{ freq.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Specific Employee Selection -->
          <div v-if="form.employee_selection.method === 'specific'" class="ml-6">
            <div class="mb-4">
              <input
                v-model="employeeSearch"
                type="text"
                placeholder="Search employees..."
                class="w-full border border-gray-300 rounded-md p-3"
                @input="searchEmployees"
              />
            </div>
            
            <div class="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
              <div v-for="employee in filteredEmployees" :key="employee.uuid" 
                   class="p-3 border-b border-gray-200 last:border-b-0">
                <label class="flex items-center space-x-3">
                  <input
                    v-model="form.employee_selection.employee_uuids"
                    :value="employee.uuid"
                    type="checkbox"
                    class="rounded border-gray-300"
                  />
                  <div>
                    <div class="font-medium">{{ employee.first_name }} {{ employee.last_name }}</div>
                    <div class="text-sm text-gray-500">
                      {{ employee.employee_id }} - {{ employee.position?.name }}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Processing Options -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Processing Options</label>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center space-x-2">
              <input
                v-model="form.processing_options.include_garnishments"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">Include garnishments</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input
                v-model="form.processing_options.include_statutory_deductions"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">Include statutory deductions</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input
                v-model="form.processing_options.prorate_new_employees"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">Prorate for new employees</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input
                v-model="form.processing_options.exclude_terminated"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">Exclude terminated employees</span>
            </label>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full border border-gray-300 rounded-md p-3"
            placeholder="Optional notes about this pay run..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEdit ? 'Update Pay Run' : 'Create Pay Run') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import api from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  payRun: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { showSuccess, showError } = useNotifications()

// Reactive data
const saving = ref(false)
const employees = ref([])
const departments = ref([])
const positions = ref([])
const employeeSearch = ref('')
const filteredEmployees = ref([])

const availableFrequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
]

const form = ref({
  name: '',
  description: '',
  pay_period_start: '',
  pay_period_end: '',
  pay_date: '',
  pay_frequencies: ['monthly'],
  employee_selection: {
    method: 'all',
    criteria: {
      departments: [],
      positions: [],
      employment_status: ['active'],
      pay_frequencies: []
    },
    employee_uuids: []
  },
  processing_options: {
    include_garnishments: true,
    include_statutory_deductions: true,
    prorate_new_employees: true,
    exclude_terminated: true
  },
  notes: ''
})

// Computed properties
const isEdit = computed(() => !!props.payRun)

// Methods
const loadData = async () => {
  try {
    const [employeesRes, departmentsRes, positionsRes] = await Promise.all([
      api.get('/employees'),
      api.get('/departments'),
      api.get('/positions')
    ])
    
    employees.value = employeesRes.data.data || employeesRes.data
    departments.value = departmentsRes.data.data || departmentsRes.data
    positions.value = positionsRes.data.data || positionsRes.data
    filteredEmployees.value = employees.value
  } catch (error) {
    showError('Failed to load form data')
    console.error('Error loading form data:', error)
  }
}

const searchEmployees = () => {
  if (!employeeSearch.value) {
    filteredEmployees.value = employees.value
    return
  }
  
  const search = employeeSearch.value.toLowerCase()
  filteredEmployees.value = employees.value.filter(emp => 
    emp.first_name?.toLowerCase().includes(search) ||
    emp.last_name?.toLowerCase().includes(search) ||
    emp.employee_id?.toLowerCase().includes(search)
  )
}

const save = async () => {
  saving.value = true
  
  try {
    const url = isEdit.value ? `/pay-runs/${props.payRun.uuid}` : '/pay-runs'
    const method = isEdit.value ? 'put' : 'post'
    
    const response = await api[method](url, form.value)
    
    showSuccess(`Pay run ${isEdit.value ? 'updated' : 'created'} successfully`)
    emit('saved', response.data.data) // Pass the saved pay run data
  } catch (error) {
    showError(`Failed to ${isEdit.value ? 'update' : 'create'} pay run`)
    console.error('Error saving pay run:', error)
  } finally {
    saving.value = false
  }
}

// Watchers
watch(() => props.payRun, (newPayRun) => {
  if (newPayRun) {
    Object.assign(form.value, {
      name: newPayRun.name || '',
      description: newPayRun.description || '',
      pay_period_start: newPayRun.pay_period_start || '',
      pay_period_end: newPayRun.pay_period_end || '',
      pay_date: newPayRun.pay_date || '',
      pay_frequencies: newPayRun.pay_frequencies || ['monthly'],
      processing_options: newPayRun.processing_options || form.value.processing_options,
      notes: newPayRun.notes || ''
    })
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadData()
})
</script>