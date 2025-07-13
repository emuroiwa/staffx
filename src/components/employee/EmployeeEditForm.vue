<template>
  <div class="space-y-6">
    <div class="text-center">
      <h4 class="text-xl font-semibold text-gray-900">Edit Employee</h4>
      <p class="text-gray-500">Update employee information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h5 class="text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.first_name"
              type="text"
              id="first_name"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.first_name }"
            />
            <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name[0] }}</p>
          </div>

          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.last_name"
              type="text"
              id="last_name"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.last_name }"
            />
            <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name[0] }}</p>
          </div>

          <div>
            <label for="employee_id" class="block text-sm font-medium text-gray-700 mb-1">
              Employee ID <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.employee_id"
              type="text"
              id="employee_id"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.employee_id }"
            />
            <p v-if="errors.employee_id" class="mt-1 text-sm text-red-600">{{ errors.employee_id[0] }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
              id="phone"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              v-model="form.dob"
              type="date"
              id="dob"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            v-model="form.address"
            id="address"
            rows="2"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full address..."
          ></textarea>
        </div>
      </div>

      <!-- Employment Details -->
      <div class="space-y-4">
        <h5 class="text-md font-semibold text-gray-900 border-b pb-2">Employment Details</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="department_uuid" class="block text-sm font-medium text-gray-700 mb-1">
              Department <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.department_uuid"
              id="department_uuid"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.department_uuid }"
            >
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <p v-if="errors.department_uuid" class="mt-1 text-sm text-red-600">{{ errors.department_uuid[0] }}</p>
          </div>

          <div>
            <label for="position_uuid" class="block text-sm font-medium text-gray-700 mb-1">
              Position <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.position_uuid"
              id="position_uuid"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.position_uuid }"
            >
              <option value="">Select Position</option>
              <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                {{ pos.name }}
              </option>
            </select>
            <p v-if="errors.position_uuid" class="mt-1 text-sm text-red-600">{{ errors.position_uuid[0] }}</p>
          </div>

          <div>
            <label for="employment_type" class="block text-sm font-medium text-gray-700 mb-1">
              Employment Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.employment_type"
              id="employment_type"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              id="status"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.status }"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status[0] }}</p>
          </div>

          <div>
            <label for="start_date" class="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.start_date"
              type="date"
              id="start_date"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="hire_date" class="block text-sm font-medium text-gray-700 mb-1">
              Hire Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.hire_date"
              type="date"
              id="hire_date"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Compensation -->
      <div class="space-y-4">
        <h5 class="text-md font-semibold text-gray-900 border-b pb-2">Compensation</h5>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="salary" class="block text-sm font-medium text-gray-700 mb-1">
              Salary <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.salary"
              type="number"
              id="salary"
              required
              min="0"
              step="0.01"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.salary }"
            />
            <p v-if="errors.salary" class="mt-1 text-sm text-red-600">{{ errors.salary[0] }}</p>
          </div>

          <div>
            <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              v-model="form.currency"
              id="currency"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>

          <div>
            <label for="pay_frequency" class="block text-sm font-medium text-gray-700 mb-1">Pay Frequency</label>
            <select
              v-model="form.pay_frequency"
              id="pay_frequency"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancelled')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ submitting ? 'Updating...' : 'Update Employee' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated', 'cancelled'])

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()

const submitting = ref(false)
const errors = ref({})
const departments = ref([])
const positions = ref([])

const form = reactive({
  first_name: props.employee.first_name || '',
  last_name: props.employee.last_name || '',
  employee_id: props.employee.employee_id || '',
  email: props.employee.email || '',
  phone: props.employee.phone || '',
  address: props.employee.address || '',
  dob: props.employee.dob || '',
  department_uuid: props.employee.department_uuid || '',
  position_uuid: props.employee.position_uuid || '',
  status: props.employee.status || 'active',
  employment_type: props.employee.employment_type || 'full_time',
  start_date: props.employee.start_date || '',
  hire_date: props.employee.hire_date || '',
  salary: props.employee.salary || '',
  currency: props.employee.currency || 'USD',
  pay_frequency: props.employee.pay_frequency || 'monthly'
})

const fetchDepartments = async () => {
  try {
    const response = await employeeStore.fetchDepartments()
    departments.value = response.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  }
}

const fetchPositions = async () => {
  try {
    const response = await employeeStore.fetchPositions()
    positions.value = response.data
  } catch (error) {
    console.error('Failed to fetch positions:', error)
  }
}

const handleSubmit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await employeeStore.updateEmployee(props.employee.uuid, form)
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: 'Employee updated successfully'
    })
    emit('updated')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update employee. Please try again.'
      })
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchDepartments()
  fetchPositions()
})
</script>