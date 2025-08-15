<template>
  <div class="modal fade" id="workHoursDetailModal" tabindex="-1" aria-labelledby="workHoursDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="workHoursDetailModalLabel">
            Work Hours Details
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body" v-if="workHours">
          <!-- Employee Information -->
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="text-muted mb-2">Employee Information</h6>
              <div class="d-flex align-items-center">
                <div class="avatar-md me-3">
                  <div class="avatar-title bg-primary text-white rounded-circle">
                    {{ employeeInitials }}
                  </div>
                </div>
                <div>
                  <div class="fw-semibold">{{ employeeName }}</div>
                  <small class="text-muted">{{ employeeId }}</small>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h6 class="text-muted mb-2">Date & Status</h6>
              <div>
                <div class="fw-semibold">{{ formatDate(workHours.date) }}</div>
                <span 
                  class="badge mt-1"
                  :class="{
                    'bg-warning': workHours.status === 'pending',
                    'bg-success': workHours.status === 'approved',
                    'bg-danger': workHours.status === 'rejected'
                  }"
                >
                  {{ workHours.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Time Tracking Details -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Time Tracking</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Clock In</label>
                    <div class="fw-semibold">
                      {{ workHours.clock_in ? formatTime(workHours.clock_in) : 'Not recorded' }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Clock Out</label>
                    <div class="fw-semibold">
                      {{ workHours.clock_out ? formatTime(workHours.clock_out) : 'Not recorded' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Break Duration</label>
                    <div class="fw-semibold">
                      {{ workHours.break_duration || 0 }} minutes
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">Work Duration</label>
                    <div class="fw-semibold">
                      {{ calculateWorkDuration() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hours Breakdown -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Hours Breakdown</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <div class="display-6 text-primary fw-bold">{{ workHours.total_hours }}</div>
                    <small class="text-muted">Total Hours</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <div class="display-6 text-success fw-bold">{{ workHours.regular_hours }}</div>
                    <small class="text-muted">Regular Hours</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <div class="display-6 text-warning fw-bold">{{ workHours.overtime_hours }}</div>
                    <small class="text-muted">Overtime Hours</small>
                  </div>
                </div>
              </div>

              <!-- Pay Calculation (for hourly employees) -->
              <div v-if="isHourlyEmployee" class="mt-4">
                <h6 class="text-muted mb-3">Pay Calculation</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td>Regular Pay ({{ workHours.regular_hours }}h × ${{ hourlyRate }})</td>
                        <td class="text-end fw-semibold">${{ regularPay.toFixed(2) }}</td>
                      </tr>
                      <tr v-if="workHours.overtime_hours > 0">
                        <td>Overtime Pay ({{ workHours.overtime_hours }}h × ${{ overtimeRate }})</td>
                        <td class="text-end fw-semibold">${{ overtimePay.toFixed(2) }}</td>
                      </tr>
                      <tr class="table-primary">
                        <td><strong>Total Estimated Pay</strong></td>
                        <td class="text-end"><strong>${{ totalPay.toFixed(2) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="workHours.notes" class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Notes</h6>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ workHours.notes }}</p>
            </div>
          </div>

          <!-- Approval Information -->
          <div v-if="workHours.approved_by || workHours.approved_at" class="card">
            <div class="card-header">
              <h6 class="mb-0">Approval Information</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6" v-if="workHours.approved_by">
                  <label class="form-label text-muted">Approved By</label>
                  <div class="fw-semibold">{{ workHours.approved_by }}</div>
                </div>
                <div class="col-md-6" v-if="workHours.approved_at">
                  <label class="form-label text-muted">Approved At</label>
                  <div class="fw-semibold">{{ formatDateTime(workHours.approved_at) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="mt-4">
            <div class="row text-muted small">
              <div class="col-md-6">
                <strong>Created:</strong> {{ formatDateTime(workHours.created_at) }}
              </div>
              <div class="col-md-6">
                <strong>Updated:</strong> {{ formatDateTime(workHours.updated_at) }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button 
            v-if="canEdit"
            type="button" 
            class="btn btn-primary"
            @click="editWorkHours"
          >
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button 
            v-if="canApprove && workHours?.status === 'pending'"
            type="button" 
            class="btn btn-success"
            @click="approveWorkHours"
          >
            <i class="fas fa-check"></i>
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { usePayrollStore } from '@/stores/payroll'
import type { WorkHours } from '@/types/company'

export default defineComponent({
  name: 'WorkHoursDetailModal',
  props: {
    workHours: {
      type: Object as () => WorkHours | null,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    canApprove: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'approve', 'close'],
  setup(props, { emit }) {
    const employeeStore = useEmployeeStore()
    const payrollStore = usePayrollStore()

    const employee = computed(() => {
      if (!props.workHours?.employee_uuid) return null
      return employeeStore.employees.find(emp => emp.uuid === props.workHours?.employee_uuid)
    })

    const employeeName = computed(() => {
      if (!employee.value) return 'Unknown Employee'
      return `${employee.value.first_name} ${employee.value.last_name}`
    })

    const employeeId = computed(() => employee.value?.employee_id || '')

    const employeeInitials = computed(() => {
      if (!employee.value) return 'UK'
      return `${employee.value.first_name.charAt(0)}${employee.value.last_name.charAt(0)}`.toUpperCase()
    })

    const isHourlyEmployee = computed(() => employee.value?.employment_type === 'hourly')

    const hourlyRate = computed(() => employee.value?.salary || 0)

    const overtimeRate = computed(() => hourlyRate.value * 1.5) // 1.5x multiplier

    const regularPay = computed(() => {
      if (!props.workHours || !isHourlyEmployee.value) return 0
      return props.workHours.regular_hours * hourlyRate.value
    })

    const overtimePay = computed(() => {
      if (!props.workHours || !isHourlyEmployee.value) return 0
      return props.workHours.overtime_hours * overtimeRate.value
    })

    const totalPay = computed(() => regularPay.value + overtimePay.value)

    function formatDate(date: string): string {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    function formatTime(time: string): string {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    function formatDateTime(dateTime: string | undefined): string {
      if (!dateTime) return 'N/A'
      return new Date(dateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    function calculateWorkDuration(): string {
      if (!props.workHours?.clock_in || !props.workHours?.clock_out) {
        return 'Manual entry'
      }

      const clockIn = new Date(`2000-01-01T${props.workHours.clock_in}:00`)
      const clockOut = new Date(`2000-01-01T${props.workHours.clock_out}:00`)
      
      if (clockOut <= clockIn) {
        return 'Invalid time range'
      }

      const diff = clockOut.getTime() - clockIn.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      return `${hours}h ${minutes}m`
    }

    function editWorkHours() {
      emit('edit', props.workHours)
      // Hide this modal
      const modal = document.getElementById('workHoursDetailModal')
      const bootstrapModal = bootstrap.Modal.getInstance(modal)
      bootstrapModal?.hide()
      
      // Show edit modal
      const editModal = new bootstrap.Modal(document.getElementById('workHoursTrackingModal'))
      editModal.show()
    }

    async function approveWorkHours() {
      if (!props.workHours?.uuid) return
      
      try {
        await payrollStore.approveWorkHours(props.workHours.uuid)
        emit('approve', props.workHours)
        
        // Hide modal
        const modal = document.getElementById('workHoursDetailModal')
        const bootstrapModal = bootstrap.Modal.getInstance(modal)
        bootstrapModal?.hide()
      } catch (error) {
        console.error('Failed to approve work hours:', error)
      }
    }

    return {
      employee,
      employeeName,
      employeeId,
      employeeInitials,
      isHourlyEmployee,
      hourlyRate,
      overtimeRate,
      regularPay,
      overtimePay,
      totalPay,
      formatDate,
      formatTime,
      formatDateTime,
      calculateWorkDuration,
      editWorkHours,
      approveWorkHours
    }
  }
})
</script>

<style scoped>
.avatar-md {
  width: 48px;
  height: 48px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.display-6 {
  font-size: 2rem;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.table td {
  padding: 0.5rem;
}
</style>