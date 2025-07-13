<template>
  <div class="space-y-6">
    <div class="text-center">
      <h4 class="text-xl font-semibold text-gray-900">Edit Employee</h4>
      <p class="text-gray-500">Update employee information</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
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
          />
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
          />
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
          />
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
      </div>

      <!-- Employment Details -->
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
          >
            <option value="">Select Department</option>
            <option value="dept1">Engineering</option>
            <option value="dept2">Marketing</option>
          </select>
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
          >
            <option value="">Select Position</option>
            <option value="pos1">Software Engineer</option>
            <option value="pos2">Marketing Manager</option>
          </select>
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
          class="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          Update Employee
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated', 'cancelled'])

const form = reactive({
  first_name: props.employee.first_name || '',
  last_name: props.employee.last_name || '',
  email: props.employee.email || '',
  phone: props.employee.phone || '',
  department_uuid: props.employee.department_uuid || '',
  position_uuid: props.employee.position_uuid || ''
})

const handleSubmit = () => {
  // Simulate update
  emit('updated', { ...props.employee, ...form })
}
</script>