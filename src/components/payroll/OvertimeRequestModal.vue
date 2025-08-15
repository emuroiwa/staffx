<template>
  <div class="modal fade" id="overtimeRequestModal" tabindex="-1" aria-labelledby="overtimeRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="overtimeRequestModalLabel">
            {{ isEditing ? 'Edit Overtime Request' : 'Request Overtime' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <!-- Employee Selection (if manager/admin) -->
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
                  v-for="employee in eligibleEmployees" 
                  :key="employee.uuid" 
                  :value="employee.uuid"
                >
                  {{ employee.first_name }} {{ employee.last_name }} - {{ employee.employee_id }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.employee_uuid">
                {{ errors.employee_uuid }}
              </div>
            </div>
          </div>

          <!-- Date and Hours -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="date" class="form-label">Date</label>
              <input 
                v-model="form.date" 
                type="date" 
                id="date" 
                class="form-control"
                :class="{ 'is-invalid': errors.date }"
                :min="minDate"
                :max="maxDate"
                required
              >
              <div class="invalid-feedback" v-if="errors.date">
                {{ errors.date }}
              </div>
            </div>
            <div class="col-md-6">
              <label for="requestedHours" class="form-label">Requested Overtime Hours</label>
              <input 
                v-model.number="form.requested_hours" 
                type="number" 
                id="requestedHours" 
                class="form-control"
                :class="{ 'is-invalid': errors.requested_hours }"
                step="0.25"
                min="0.25"
                max="12"
                required
              >
              <div class="invalid-feedback" v-if="errors.requested_hours">
                {{ errors.requested_hours }}
              </div>
              <div class="form-text">
                Maximum 12 hours of overtime per day
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div class="row mb-3">
            <div class="col-12">
              <label for="reason" class="form-label">Reason for Overtime</label>
              <textarea 
                v-model="form.reason" 
                id="reason" 
                class="form-control" 
                rows="3"
                :class="{ 'is-invalid': errors.reason }"
                placeholder="Please provide a detailed explanation for the overtime request..."
                required
              ></textarea>
              <div class="invalid-feedback" v-if="errors.reason">
                {{ errors.reason }}
              </div>
            </div>
          </div>

          <!-- Estimated Cost (if employee selected) -->
          <div class="alert alert-info" v-if="selectedEmployee && form.requested_hours > 0">
            <h6 class="alert-heading">Estimated Overtime Cost</h6>
            <div class="row">
              <div class="col-md-4">
                <small class="text-muted">Hourly Rate:</small><br>
                <strong>${{ selectedEmployee.salary?.toFixed(2) || '0.00' }}</strong>
              </div>
              <div class="col-md-4">
                <small class="text-muted">Overtime Rate:</small><br>
                <strong>${{ overtimeRate.toFixed(2) }}</strong>
              </div>
              <div class="col-md-4">
                <small class="text-muted">Total Cost:</small><br>
                <strong class="text-primary">${{ estimatedCost.toFixed(2) }}</strong>
              </div>
            </div>
          </div>

          <!-- Status and Review (if editing approved/rejected request) -->
          <div v-if="isEditing && overtimeRequest?.status !== 'pending'" class="alert" :class="statusAlertClass">
            <h6 class="alert-heading">Request Status</h6>
            <div class="row">
              <div class="col-md-6">
                <small class="text-muted">Status:</small><br>
                <strong>{{ overtimeRequest.status.charAt(0).toUpperCase() + overtimeRequest.status.slice(1) }}</strong>
              </div>
              <div class="col-md-6" v-if="overtimeRequest.reviewed_at">
                <small class="text-muted">Reviewed At:</small><br>
                <strong>{{ formatDateTime(overtimeRequest.reviewed_at) }}</strong>
              </div>
              <div class="col-12" v-if="overtimeRequest.notes">
                <small class="text-muted">Review Notes:</small><br>
                <p class="mb-0">{{ overtimeRequest.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Manager Review Section (if reviewing) -->
          <div v-if="isReviewing" class="card border-warning">
            <div class="card-header bg-warning bg-opacity-10">
              <h6 class="mb-0">Manager Review</h6>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Decision</label>
                  <div class="btn-group w-100" role="group">
                    <input 
                      type="radio" 
                      class="btn-check" 
                      id="approve" 
                      v-model="reviewDecision" 
                      value="approved"
                    >
                    <label class="btn btn-outline-success" for="approve">Approve</label>
                    
                    <input 
                      type="radio" 
                      class="btn-check" 
                      id="reject" 
                      v-model="reviewDecision" 
                      value="rejected"
                    >
                    <label class="btn btn-outline-danger" for="reject">Reject</label>
                  </div>
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col-12">
                  <label for="reviewNotes" class="form-label">Review Notes</label>
                  <textarea 
                    v-model="reviewNotes" 
                    id="reviewNotes" 
                    class="form-control" 
                    rows="3"
                    placeholder="Optional notes about your decision..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          
          <button 
            v-if="isReviewing"
            type="button" 
            class="btn"
            :class="reviewDecision === 'approved' ? 'btn-success' : 'btn-danger'"
            @click="submitReview"
            :disabled="loading || !reviewDecision"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ reviewDecision === 'approved' ? 'Approve Request' : 'Reject Request' }}
          </button>
          
          <button 
            v-else
            type="button" 
            class="btn btn-primary" 
            @click="submitRequest"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditing ? 'Update Request' : 'Submit Request' }}
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
import type { OvertimeRequest, Employee } from '@/types/company'

export default defineComponent({
  name: 'OvertimeRequestModal',
  props: {
    overtimeRequest: {
      type: Object as () => OvertimeRequest | null,
      default: null
    },
    employeeUuid: {
      type: String,
      default: ''
    },
    canSelectEmployee: {
      type: Boolean,
      default: false
    },
    isReviewing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['request-submitted', 'request-updated', 'request-reviewed'],
  setup(props, { emit }) {
    const payrollStore = usePayrollStore()
    const employeeStore = useEmployeeStore()

    const loading = ref(false)
    const errors = ref<Record<string, string>>({})
    
    // Review state
    const reviewDecision = ref<'approved' | 'rejected' | ''>('')
    const reviewNotes = ref('')

    const form = ref<Partial<OvertimeRequest>>({
      employee_uuid: props.employeeUuid || '',
      date: new Date().toISOString().split('T')[0],
      requested_hours: 0,
      reason: '',
      status: 'pending'
    })

    const employees = computed(() => employeeStore.employees)
    
    // Only show hourly employees eligible for overtime
    const eligibleEmployees = computed(() => 
      employees.value.filter(emp => 
        emp.employment_type === 'hourly' && 
        emp.overtime_eligible && 
        emp.status === 'active'
      )
    )

    const selectedEmployee = computed(() => 
      employees.value.find(emp => emp.uuid === form.value.employee_uuid)
    )

    const isEditing = computed(() => !!props.overtimeRequest)

    const isFormValid = computed(() => {
      return form.value.employee_uuid && 
             form.value.date && 
             form.value.requested_hours > 0 && 
             form.value.reason?.trim()
    })

    const minDate = computed(() => {
      // Allow requests up to 7 days in the past
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString().split('T')[0]
    })

    const maxDate = computed(() => {
      // Allow requests up to 30 days in the future
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })

    const overtimeRate = computed(() => {
      if (!selectedEmployee.value) return 0
      const hourlyRate = selectedEmployee.value.salary || 0
      const multiplier = selectedEmployee.value.overtime_rate_multiplier || 1.5
      return hourlyRate * multiplier
    })

    const estimatedCost = computed(() => {
      return overtimeRate.value * (form.value.requested_hours || 0)
    })

    const statusAlertClass = computed(() => {
      switch (props.overtimeRequest?.status) {
        case 'approved':
          return 'alert-success'
        case 'rejected':
          return 'alert-danger'
        default:
          return 'alert-warning'
      }
    })

    function formatDateTime(dateTime: string): string {
      return new Date(dateTime).toLocaleString()
    }

    function resetForm() {
      form.value = {
        employee_uuid: props.employeeUuid || '',
        date: new Date().toISOString().split('T')[0],
        requested_hours: 0,
        reason: '',
        status: 'pending'
      }
      reviewDecision.value = ''
      reviewNotes.value = ''
      errors.value = {}
    }

    function loadOvertimeRequest() {
      if (props.overtimeRequest) {
        form.value = { ...props.overtimeRequest }
      }
    }

    async function submitRequest() {
      loading.value = true
      errors.value = {}

      try {
        if (isEditing.value && props.overtimeRequest?.uuid) {
          const updated = await payrollStore.updateOvertimeRequest(props.overtimeRequest.uuid, form.value)
          emit('request-updated', updated)
        } else {
          const created = await payrollStore.submitOvertimeRequest(form.value)
          emit('request-submitted', created)
        }

        // Hide modal
        const modal = document.getElementById('overtimeRequestModal')
        const bootstrapModal = bootstrap.Modal.getInstance(modal)
        bootstrapModal?.hide()

        resetForm()
      } catch (error: any) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors
        } else {
          console.error('Error submitting overtime request:', error)
        }
      } finally {
        loading.value = false
      }
    }

    async function submitReview() {
      if (!props.overtimeRequest?.uuid || !reviewDecision.value) return

      loading.value = true

      try {
        const approved = reviewDecision.value === 'approved'
        const updated = await payrollStore.approveOvertimeRequest(
          props.overtimeRequest.uuid, 
          approved, 
          reviewNotes.value
        )
        
        emit('request-reviewed', updated)

        // Hide modal
        const modal = document.getElementById('overtimeRequestModal')
        const bootstrapModal = bootstrap.Modal.getInstance(modal)
        bootstrapModal?.hide()

        resetForm()
      } catch (error: any) {
        console.error('Error reviewing overtime request:', error)
      } finally {
        loading.value = false
      }
    }

    // Load employees on mount
    onMounted(async () => {
      if (props.canSelectEmployee) {
        await employeeStore.fetchEmployees()
      }
      loadOvertimeRequest()
    })

    // Watch for prop changes
    watch(() => props.overtimeRequest, loadOvertimeRequest)

    return {
      form,
      loading,
      errors,
      reviewDecision,
      reviewNotes,
      employees,
      eligibleEmployees,
      selectedEmployee,
      isEditing,
      isFormValid,
      minDate,
      maxDate,
      overtimeRate,
      estimatedCost,
      statusAlertClass,
      formatDateTime,
      submitRequest,
      submitReview,
      resetForm
    }
  }
})
</script>

<style scoped>
.btn-check:checked + .btn-outline-success {
  background-color: var(--bs-success);
  border-color: var(--bs-success);
  color: #fff;
}

.btn-check:checked + .btn-outline-danger {
  background-color: var(--bs-danger);
  border-color: var(--bs-danger);
  color: #fff;
}

.alert-heading {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.card-header {
  padding: 0.75rem 1rem;
}
</style>