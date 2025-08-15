<template>
  <div class="modal fade" id="workHoursTrackingModal" tabindex="-1" aria-labelledby="workHoursTrackingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="workHoursTrackingModalLabel">
            {{ isEditing ? 'Edit Work Hours' : 'Track Work Hours' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <!-- Employee Selection (if admin/manager) -->
          <div class="row mb-3" v-if="canSelectEmployee">
            <div class="col-md-6">
              <label for="employee" class="form-label">Employee</label>
              <select 
                v-model="form.employee_uuid" 
                id="employee" 
                class="form-select"
                :class="{ 'is-invalid': errors.employee_uuid }"
                required
              >
                <option value="">Select Employee</option>
                <option 
                  v-for="employee in employees" 
                  :key="employee.uuid" 
                  :value="employee.uuid"
                >
                  {{ employee.first_name }} {{ employee.last_name }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.employee_uuid">
                {{ errors.employee_uuid }}
              </div>
            </div>
          </div>

          <!-- Date and Time Entry -->
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="date" class="form-label">Date</label>
              <input 
                v-model="form.date" 
                type="date" 
                id="date" 
                class="form-control"
                :class="{ 'is-invalid': errors.date }"
                required
              >
              <div class="invalid-feedback" v-if="errors.date">
                {{ errors.date }}
              </div>
            </div>
            <div class="col-md-4">
              <label for="clockIn" class="form-label">Clock In</label>
              <input 
                v-model="form.clock_in" 
                type="time" 
                id="clockIn" 
                class="form-control"
                :class="{ 'is-invalid': errors.clock_in }"
              >
              <div class="invalid-feedback" v-if="errors.clock_in">
                {{ errors.clock_in }}
              </div>
            </div>
            <div class="col-md-4">
              <label for="clockOut" class="form-label">Clock Out</label>
              <input 
                v-model="form.clock_out" 
                type="time" 
                id="clockOut" 
                class="form-control"
                :class="{ 'is-invalid': errors.clock_out }"
              >
              <div class="invalid-feedback" v-if="errors.clock_out">
                {{ errors.clock_out }}
              </div>
            </div>
          </div>

          <!-- Break Duration -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="breakDuration" class="form-label">Break Duration (minutes)</label>
              <input 
                v-model.number="form.break_duration" 
                type="number" 
                id="breakDuration" 
                class="form-control"
                :class="{ 'is-invalid': errors.break_duration }"
                min="0"
                max="480"
              >
              <div class="invalid-feedback" v-if="errors.break_duration">
                {{ errors.break_duration }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Total Hours</label>
              <div class="form-control-plaintext">
                {{ calculateTotalHours() }} hours
              </div>
            </div>
          </div>

          <!-- Manual Hours Entry (alternative to clock in/out) -->
          <div class="row mb-3">
            <div class="col-12">
              <div class="form-check">
                <input 
                  v-model="useManualEntry" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="useManualEntry"
                >
                <label class="form-check-label" for="useManualEntry">
                  Enter hours manually instead of clock times
                </label>
              </div>
            </div>
          </div>

          <div class="row mb-3" v-if="useManualEntry">
            <div class="col-md-4">
              <label for="regularHours" class="form-label">Regular Hours</label>
              <input 
                v-model.number="form.regular_hours" 
                type="number" 
                id="regularHours" 
                class="form-control"
                :class="{ 'is-invalid': errors.regular_hours }"
                step="0.25"
                min="0"
                max="24"
              >
              <div class="invalid-feedback" v-if="errors.regular_hours">
                {{ errors.regular_hours }}
              </div>
            </div>
            <div class="col-md-4">
              <label for="overtimeHours" class="form-label">Overtime Hours</label>
              <input 
                v-model.number="form.overtime_hours" 
                type="number" 
                id="overtimeHours" 
                class="form-control"
                :class="{ 'is-invalid': errors.overtime_hours }"
                step="0.25"
                min="0"
                max="24"
              >
              <div class="invalid-feedback" v-if="errors.overtime_hours">
                {{ errors.overtime_hours }}
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Total Hours</label>
              <div class="form-control-plaintext">
                {{ (form.regular_hours || 0) + (form.overtime_hours || 0) }} hours
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="row mb-3">
            <div class="col-12">
              <label for="notes" class="form-label">Notes</label>
              <textarea 
                v-model="form.notes" 
                id="notes" 
                class="form-control" 
                rows="3"
                placeholder="Optional notes about the work performed..."
              ></textarea>
            </div>
          </div>

          <!-- Hours Breakdown (for hourly employees) -->
          <div class="alert alert-info" v-if="selectedEmployee && selectedEmployee.employment_type === 'hourly'">
            <h6 class="alert-heading">Hours Breakdown</h6>
            <div class="row">
              <div class="col-md-4">
                <small class="text-muted">Regular Hours:</small><br>
                <strong>{{ calculatedRegularHours }} hours</strong>
              </div>
              <div class="col-md-4">
                <small class="text-muted">Overtime Hours:</small><br>
                <strong>{{ calculatedOvertimeHours }} hours</strong>
              </div>
              <div class="col-md-4">
                <small class="text-muted">Estimated Pay:</small><br>
                <strong>${{ estimatedPay.toFixed(2) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="submitWorkHours"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditing ? 'Update Hours' : 'Submit Hours' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { usePayrollStore } from '@/stores/payroll'
import { useEmployeeStore } from '@/stores/employee'
import type { WorkHours, Employee } from '@/types/company'

export default defineComponent({
  name: 'WorkHoursTrackingModal',
  props: {
    workHours: {
      type: Object as () => WorkHours | null,
      default: null
    },
    employeeUuid: {
      type: String,
      default: ''
    },
    canSelectEmployee: {
      type: Boolean,
      default: false
    }
  },
  emits: ['work-hours-saved', 'work-hours-updated'],
  setup(props, { emit }) {
    const payrollStore = usePayrollStore()
    const employeeStore = useEmployeeStore()

    const loading = ref(false)
    const useManualEntry = ref(false)
    const errors = ref<Record<string, string>>({})

    const form = ref<Partial<WorkHours>>({
      employee_uuid: props.employeeUuid || '',
      date: new Date().toISOString().split('T')[0],
      clock_in: '',
      clock_out: '',
      break_duration: 30,
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      status: 'pending',
      notes: ''
    })

    const employees = computed(() => employeeStore.employees)
    const selectedEmployee = computed(() => 
      employees.value.find(emp => emp.uuid === form.value.employee_uuid)
    )

    const isEditing = computed(() => !!props.workHours)

    const isFormValid = computed(() => {
      return form.value.employee_uuid && 
             form.value.date && 
             (form.value.total_hours > 0 || calculateTotalHours() > 0)
    })

    const calculatedRegularHours = computed(() => {
      if (useManualEntry.value) {
        return form.value.regular_hours || 0
      }
      const total = calculateTotalHours()
      return Math.min(total, 8) // Assuming 8 hours is regular
    })

    const calculatedOvertimeHours = computed(() => {
      if (useManualEntry.value) {
        return form.value.overtime_hours || 0
      }
      const total = calculateTotalHours()
      return Math.max(0, total - 8) // Hours beyond 8 are overtime
    })

    const estimatedPay = computed(() => {
      if (!selectedEmployee.value || selectedEmployee.value.employment_type !== 'hourly') {
        return 0
      }
      const hourlyRate = selectedEmployee.value.salary || 0
      const regular = calculatedRegularHours.value * hourlyRate
      const overtime = calculatedOvertimeHours.value * hourlyRate * 1.5 // 1.5x multiplier
      return regular + overtime
    })

    function calculateTotalHours(): number {
      if (!form.value.clock_in || !form.value.clock_out) {
        return 0
      }

      const clockIn = new Date(`2000-01-01T${form.value.clock_in}:00`)
      const clockOut = new Date(`2000-01-01T${form.value.clock_out}:00`)
      
      if (clockOut <= clockIn) {
        return 0
      }

      const diff = clockOut.getTime() - clockIn.getTime()
      const hours = diff / (1000 * 60 * 60)
      const breakHours = (form.value.break_duration || 0) / 60
      
      return Math.max(0, hours - breakHours)
    }

    function resetForm() {
      form.value = {
        employee_uuid: props.employeeUuid || '',
        date: new Date().toISOString().split('T')[0],
        clock_in: '',
        clock_out: '',
        break_duration: 30,
        total_hours: 0,
        regular_hours: 0,
        overtime_hours: 0,
        status: 'pending',
        notes: ''
      }
      useManualEntry.value = false
      errors.value = {}
    }

    function loadWorkHours() {
      if (props.workHours) {
        form.value = { ...props.workHours }
        useManualEntry.value = !props.workHours.clock_in || !props.workHours.clock_out
      }
    }

    async function submitWorkHours() {
      loading.value = true
      errors.value = {}

      try {
        // Calculate total hours
        if (useManualEntry.value) {
          form.value.total_hours = (form.value.regular_hours || 0) + (form.value.overtime_hours || 0)
        } else {
          const totalHours = calculateTotalHours()
          form.value.total_hours = totalHours
          form.value.regular_hours = Math.min(totalHours, 8)
          form.value.overtime_hours = Math.max(0, totalHours - 8)
        }

        if (isEditing.value && props.workHours?.uuid) {
          const updated = await payrollStore.updateWorkHours(props.workHours.uuid, form.value)
          emit('work-hours-updated', updated)
        } else {
          const created = await payrollStore.submitWorkHours(form.value)
          emit('work-hours-saved', created)
        }

        // Hide modal
        const modal = document.getElementById('workHoursTrackingModal')
        const bootstrapModal = bootstrap.Modal.getInstance(modal)
        bootstrapModal?.hide()

        resetForm()
      } catch (error: any) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors
        } else {
          console.error('Error submitting work hours:', error)
        }
      } finally {
        loading.value = false
      }
    }

    // Watch for changes to recalculate hours
    watch([() => form.value.clock_in, () => form.value.clock_out, () => form.value.break_duration], () => {
      if (!useManualEntry.value && form.value.clock_in && form.value.clock_out) {
        const totalHours = calculateTotalHours()
        form.value.total_hours = totalHours
      }
    })

    // Load employees on mount
    onMounted(async () => {
      if (props.canSelectEmployee) {
        await employeeStore.fetchEmployees()
      }
      loadWorkHours()
    })

    // Watch for prop changes
    watch(() => props.workHours, loadWorkHours)

    return {
      form,
      loading,
      useManualEntry,
      errors,
      employees,
      selectedEmployee,
      isEditing,
      isFormValid,
      calculatedRegularHours,
      calculatedOvertimeHours,
      estimatedPay,
      calculateTotalHours,
      submitWorkHours,
      resetForm
    }
  }
})
</script>

<style scoped>
.form-control-plaintext {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b8daff;
}
</style>