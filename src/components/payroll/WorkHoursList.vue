<template>
  <div class="work-hours-list">
    <!-- Header with filters and actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 class="mb-0">Work Hours</h5>
        <small class="text-muted">Track and manage employee work hours</small>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-secondary btn-sm"
          @click="refreshWorkHours"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
        <button 
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#workHoursTrackingModal"
          @click="openCreateModal"
        >
          <i class="fas fa-plus"></i>
          Add Work Hours
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label for="filterEmployee" class="form-label">Employee</label>
            <select 
              v-model="filters.employee_uuid" 
              id="filterEmployee" 
              class="form-select form-select-sm"
              @change="applyFilters"
            >
              <option value="">All Employees</option>
              <option 
                v-for="employee in employees" 
                :key="employee.uuid" 
                :value="employee.uuid"
              >
                {{ employee.first_name }} {{ employee.last_name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="filterStartDate" class="form-label">Start Date</label>
            <input 
              v-model="filters.start_date" 
              type="date" 
              id="filterStartDate" 
              class="form-control form-control-sm"
              @change="applyFilters"
            >
          </div>
          <div class="col-md-3">
            <label for="filterEndDate" class="form-label">End Date</label>
            <input 
              v-model="filters.end_date" 
              type="date" 
              id="filterEndDate" 
              class="form-control form-control-sm"
              @change="applyFilters"
            >
          </div>
          <div class="col-md-3">
            <label for="filterStatus" class="form-label">Status</label>
            <select 
              v-model="filters.status" 
              id="filterStatus" 
              class="form-select form-select-sm"
              @change="applyFilters"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Work Hours Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="workHours.length === 0" class="text-center py-4">
          <i class="fas fa-clock fa-3x text-muted mb-3"></i>
          <h6 class="text-muted">No work hours found</h6>
          <p class="text-muted">No work hours match the current filters.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Clock In/Out</th>
                <th>Total Hours</th>
                <th>Regular</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="workHour in workHours" :key="workHour.uuid">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2">
                      <div class="avatar-title bg-primary text-white rounded-circle">
                        {{ getEmployeeInitials(workHour.employee_uuid) }}
                      </div>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ getEmployeeName(workHour.employee_uuid) }}</div>
                      <small class="text-muted">{{ getEmployeeId(workHour.employee_uuid) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ formatDate(workHour.date) }}</div>
                  <small class="text-muted">{{ formatDayOfWeek(workHour.date) }}</small>
                </td>
                <td>
                  <div v-if="workHour.clock_in && workHour.clock_out">
                    <div>{{ formatTime(workHour.clock_in) }} - {{ formatTime(workHour.clock_out) }}</div>
                    <small class="text-muted" v-if="workHour.break_duration">
                      Break: {{ workHour.break_duration }}min
                    </small>
                  </div>
                  <div v-else>
                    <span class="badge bg-secondary">Manual Entry</span>
                  </div>
                </td>
                <td>
                  <div class="fw-semibold">{{ workHour.total_hours }}h</div>
                </td>
                <td>
                  <div>{{ workHour.regular_hours }}h</div>
                </td>
                <td>
                  <div>
                    <span v-if="workHour.overtime_hours > 0" class="text-warning fw-semibold">
                      {{ workHour.overtime_hours }}h
                    </span>
                    <span v-else class="text-muted">0h</span>
                  </div>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'bg-warning': workHour.status === 'pending',
                      'bg-success': workHour.status === 'approved',
                      'bg-danger': workHour.status === 'rejected'
                    }"
                  >
                    {{ workHour.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      @click="editWorkHours(workHour)"
                      :disabled="workHour.status === 'approved'"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="canApprove && workHour.status === 'pending'"
                      class="btn btn-sm btn-outline-success"
                      @click="approveWorkHours(workHour)"
                      title="Approve"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button 
                      v-if="canApprove && workHour.status === 'pending'"
                      class="btn btn-sm btn-outline-danger"
                      @click="rejectWorkHours(workHour)"
                      title="Reject"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-secondary"
                      @click="viewDetails(workHour)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <button class="page-link" @click="loadPage(pagination.current_page - 1)">Previous</button>
              </li>
              <li 
                v-for="page in visiblePages" 
                :key="page" 
                class="page-item" 
                :class="{ active: page === pagination.current_page }"
              >
                <button class="page-link" @click="loadPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                <button class="page-link" @click="loadPage(pagination.current_page + 1)">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Work Hours Tracking Modal -->
    <WorkHoursTrackingModal 
      :work-hours="selectedWorkHours"
      :can-select-employee="canSelectEmployee"
      @work-hours-saved="handleWorkHoursSaved"
      @work-hours-updated="handleWorkHoursUpdated"
    />

    <!-- Work Hours Detail Modal -->
    <WorkHoursDetailModal 
      :work-hours="selectedWorkHours"
      @close="selectedWorkHours = null"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { usePayrollStore } from '@/stores/payroll'
import { useEmployeeStore } from '@/stores/employee'
import type { WorkHours, Employee } from '@/types/company'
import WorkHoursTrackingModal from './WorkHoursTrackingModal.vue'
import WorkHoursDetailModal from './WorkHoursDetailModal.vue'

export default defineComponent({
  name: 'WorkHoursList',
  components: {
    WorkHoursTrackingModal,
    WorkHoursDetailModal
  },
  props: {
    employeeUuid: {
      type: String,
      default: ''
    },
    canSelectEmployee: {
      type: Boolean,
      default: true
    },
    canApprove: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const payrollStore = usePayrollStore()
    const employeeStore = useEmployeeStore()

    const loading = ref(false)
    const selectedWorkHours = ref<WorkHours | null>(null)

    const filters = ref({
      employee_uuid: props.employeeUuid || '',
      start_date: '',
      end_date: '',
      status: ''
    })

    const pagination = ref({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    })

    const workHours = computed(() => payrollStore.workHours)
    const employees = computed(() => employeeStore.employees)

    const visiblePages = computed(() => {
      const current = pagination.value.current_page
      const last = pagination.value.last_page
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
        range.push(i)
      }

      if (current - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (current + delta < last - 1) {
        rangeWithDots.push('...', last)
      } else if (last > 1) {
        rangeWithDots.push(last)
      }

      return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i)
    })

    function getEmployeeName(employeeUuid: string): string {
      const employee = employees.value.find(emp => emp.uuid === employeeUuid)
      return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee'
    }

    function getEmployeeId(employeeUuid: string): string {
      const employee = employees.value.find(emp => emp.uuid === employeeUuid)
      return employee ? employee.employee_id : ''
    }

    function getEmployeeInitials(employeeUuid: string): string {
      const employee = employees.value.find(emp => emp.uuid === employeeUuid)
      if (!employee) return 'UK'
      return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase()
    }

    function formatDate(date: string): string {
      return new Date(date).toLocaleDateString()
    }

    function formatDayOfWeek(date: string): string {
      return new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }

    function formatTime(time: string): string {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    }

    async function loadWorkHours(page = 1) {
      loading.value = true
      try {
        const params = {
          page,
          ...filters.value
        }
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key]
        })

        // This would typically call an API endpoint
        // For now, we'll simulate the call
        console.log('Loading work hours with params:', params)
        
        // Simulated response - in real app this would come from API
        pagination.value = {
          current_page: page,
          last_page: 3,
          per_page: 15,
          total: 45,
          from: (page - 1) * 15 + 1,
          to: Math.min(page * 15, 45)
        }
      } catch (error) {
        console.error('Failed to load work hours:', error)
      } finally {
        loading.value = false
      }
    }

    function loadPage(page: number) {
      if (page >= 1 && page <= pagination.value.last_page) {
        loadWorkHours(page)
      }
    }

    function applyFilters() {
      loadWorkHours(1)
    }

    function refreshWorkHours() {
      loadWorkHours(pagination.value.current_page)
    }

    function openCreateModal() {
      selectedWorkHours.value = null
    }

    function editWorkHours(workHour: WorkHours) {
      selectedWorkHours.value = workHour
      const modal = new bootstrap.Modal(document.getElementById('workHoursTrackingModal'))
      modal.show()
    }

    function viewDetails(workHour: WorkHours) {
      selectedWorkHours.value = workHour
      const modal = new bootstrap.Modal(document.getElementById('workHoursDetailModal'))
      modal.show()
    }

    async function approveWorkHours(workHour: WorkHours) {
      if (!workHour.uuid) return
      
      try {
        await payrollStore.approveWorkHours(workHour.uuid)
        refreshWorkHours()
      } catch (error) {
        console.error('Failed to approve work hours:', error)
      }
    }

    async function rejectWorkHours(workHour: WorkHours) {
      if (!workHour.uuid) return
      
      try {
        await payrollStore.updateWorkHours(workHour.uuid, { status: 'rejected' })
        refreshWorkHours()
      } catch (error) {
        console.error('Failed to reject work hours:', error)
      }
    }

    function handleWorkHoursSaved() {
      refreshWorkHours()
    }

    function handleWorkHoursUpdated() {
      refreshWorkHours()
    }

    // Load data on mount
    onMounted(async () => {
      await employeeStore.fetchEmployees()
      await loadWorkHours()
    })

    // Watch for prop changes
    watch(() => props.employeeUuid, (newValue) => {
      filters.value.employee_uuid = newValue
      applyFilters()
    })

    return {
      loading,
      selectedWorkHours,
      filters,
      pagination,
      workHours,
      employees,
      visiblePages,
      getEmployeeName,
      getEmployeeId,
      getEmployeeInitials,
      formatDate,
      formatDayOfWeek,
      formatTime,
      loadPage,
      applyFilters,
      refreshWorkHours,
      openCreateModal,
      editWorkHours,
      viewDetails,
      approveWorkHours,
      rejectWorkHours,
      handleWorkHoursSaved,
      handleWorkHoursUpdated
    }
  }
})
</script>

<style scoped>
.avatar-sm {
  width: 32px;
  height: 32px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.btn-group .btn {
  border-radius: 0.25rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>