<template>
  <div class="overtime-management">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 class="mb-0">Overtime Management</h5>
        <small class="text-muted">Manage overtime requests and approvals</small>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-secondary btn-sm"
          @click="refreshRequests"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
        <button 
          v-if="canRequestOvertime"
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#overtimeRequestModal"
          @click="openRequestModal"
        >
          <i class="fas fa-plus"></i>
          Request Overtime
        </button>
      </div>
    </div>

    <!-- Filters and Stats -->
    <div class="card mb-4">
      <div class="card-body">
        <!-- Quick Stats -->
        <div class="row mb-3">
          <div class="col-md-3">
            <div class="text-center p-3 bg-warning bg-opacity-10 rounded">
              <div class="display-6 text-warning fw-bold">{{ pendingCount }}</div>
              <small class="text-muted">Pending</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center p-3 bg-success bg-opacity-10 rounded">
              <div class="display-6 text-success fw-bold">{{ approvedCount }}</div>
              <small class="text-muted">Approved</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center p-3 bg-danger bg-opacity-10 rounded">
              <div class="display-6 text-danger fw-bold">{{ rejectedCount }}</div>
              <small class="text-muted">Rejected</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center p-3 bg-info bg-opacity-10 rounded">
              <div class="display-6 text-info fw-bold">{{ totalHours.toFixed(1) }}</div>
              <small class="text-muted">Total Hours</small>
            </div>
          </div>
        </div>

        <!-- Filters -->
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
        </div>
      </div>
    </div>

    <!-- Overtime Requests Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="overtimeRequests.length === 0" class="text-center py-4">
          <i class="fas fa-clock fa-3x text-muted mb-3"></i>
          <h6 class="text-muted">No overtime requests found</h6>
          <p class="text-muted">No overtime requests match the current filters.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in overtimeRequests" :key="request.uuid">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2">
                      <div class="avatar-title bg-primary text-white rounded-circle">
                        {{ getEmployeeInitials(request.employee_uuid) }}
                      </div>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ getEmployeeName(request.employee_uuid) }}</div>
                      <small class="text-muted">{{ getEmployeeId(request.employee_uuid) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ formatDate(request.date) }}</div>
                  <small class="text-muted">{{ formatDayOfWeek(request.date) }}</small>
                </td>
                <td>
                  <div class="fw-semibold">{{ request.requested_hours }}h</div>
                  <small class="text-muted" v-if="request.status === 'approved'">
                    Cost: ${{ calculateCost(request).toFixed(2) }}
                  </small>
                </td>
                <td>
                  <div class="text-truncate" style="max-width: 200px;" :title="request.reason">
                    {{ request.reason }}
                  </div>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'bg-warning': request.status === 'pending',
                      'bg-success': request.status === 'approved',
                      'bg-danger': request.status === 'rejected'
                    }"
                  >
                    {{ request.status }}
                  </span>
                </td>
                <td>
                  <div>{{ formatDateTime(request.created_at) }}</div>
                  <small class="text-muted">by {{ request.requested_by }}</small>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      @click="viewRequest(request)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <button 
                      v-if="canEditRequest(request)"
                      class="btn btn-sm btn-outline-secondary"
                      @click="editRequest(request)"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    
                    <button 
                      v-if="canApprove && request.status === 'pending'"
                      class="btn btn-sm btn-outline-success"
                      @click="reviewRequest(request, 'approve')"
                      title="Approve"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    
                    <button 
                      v-if="canApprove && request.status === 'pending'"
                      class="btn btn-sm btn-outline-danger"
                      @click="reviewRequest(request, 'reject')"
                      title="Reject"
                    >
                      <i class="fas fa-times"></i>
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

    <!-- Overtime Request Modal -->
    <OvertimeRequestModal 
      :overtime-request="selectedRequest"
      :can-select-employee="canSelectEmployee"
      :is-reviewing="isReviewing"
      @request-submitted="handleRequestSubmitted"
      @request-updated="handleRequestUpdated"
      @request-reviewed="handleRequestReviewed"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { usePayrollStore } from '@/stores/payroll'
import { useEmployeeStore } from '@/stores/employee'
import { useAuthStore } from '@/stores/auth'
import type { OvertimeRequest, Employee } from '@/types/company'
import OvertimeRequestModal from './OvertimeRequestModal.vue'

export default defineComponent({
  name: 'OvertimeManagement',
  components: {
    OvertimeRequestModal
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
    const authStore = useAuthStore()

    const loading = ref(false)
    const selectedRequest = ref<OvertimeRequest | null>(null)
    const isReviewing = ref(false)

    const filters = ref({
      employee_uuid: props.employeeUuid || '',
      status: '',
      start_date: '',
      end_date: ''
    })

    const pagination = ref({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    })

    const overtimeRequests = computed(() => payrollStore.overtimeRequests)
    const employees = computed(() => employeeStore.employees)

    // Stats
    const pendingCount = computed(() => 
      overtimeRequests.value.filter(req => req.status === 'pending').length
    )
    const approvedCount = computed(() => 
      overtimeRequests.value.filter(req => req.status === 'approved').length
    )
    const rejectedCount = computed(() => 
      overtimeRequests.value.filter(req => req.status === 'rejected').length
    )
    const totalHours = computed(() => 
      overtimeRequests.value
        .filter(req => req.status === 'approved')
        .reduce((sum, req) => sum + req.requested_hours, 0)
    )

    const canRequestOvertime = computed(() => {
      // Employee can request their own overtime if they're hourly and overtime eligible
      if (props.employeeUuid) {
        const employee = employees.value.find(emp => emp.uuid === props.employeeUuid)
        return employee?.employment_type === 'hourly' && employee?.overtime_eligible
      }
      // Managers/admins can request for any eligible employee
      return props.canSelectEmployee
    })

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

    function formatDateTime(dateTime: string): string {
      return new Date(dateTime).toLocaleString()
    }

    function calculateCost(request: OvertimeRequest): number {
      const employee = employees.value.find(emp => emp.uuid === request.employee_uuid)
      if (!employee) return 0
      
      const hourlyRate = employee.salary || 0
      const multiplier = employee.overtime_rate_multiplier || 1.5
      return request.requested_hours * hourlyRate * multiplier
    }

    function canEditRequest(request: OvertimeRequest): boolean {
      // Only pending requests can be edited, and only by the requester or admin
      return request.status === 'pending' && 
             (request.requested_by === authStore.user?.name || props.canApprove)
    }

    async function loadOvertimeRequests(page = 1) {
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

        await payrollStore.fetchOvertimeRequests(filters.value.employee_uuid)
        
        // Simulated pagination - in real app this would come from API
        pagination.value = {
          current_page: page,
          last_page: Math.ceil(overtimeRequests.value.length / 15),
          per_page: 15,
          total: overtimeRequests.value.length,
          from: (page - 1) * 15 + 1,
          to: Math.min(page * 15, overtimeRequests.value.length)
        }
      } catch (error) {
        console.error('Failed to load overtime requests:', error)
      } finally {
        loading.value = false
      }
    }

    function loadPage(page: number) {
      if (page >= 1 && page <= pagination.value.last_page) {
        loadOvertimeRequests(page)
      }
    }

    function applyFilters() {
      loadOvertimeRequests(1)
    }

    function refreshRequests() {
      loadOvertimeRequests(pagination.value.current_page)
    }

    function openRequestModal() {
      selectedRequest.value = null
      isReviewing.value = false
    }

    function viewRequest(request: OvertimeRequest) {
      selectedRequest.value = request
      isReviewing.value = false
      const modal = new bootstrap.Modal(document.getElementById('overtimeRequestModal'))
      modal.show()
    }

    function editRequest(request: OvertimeRequest) {
      selectedRequest.value = request
      isReviewing.value = false
      const modal = new bootstrap.Modal(document.getElementById('overtimeRequestModal'))
      modal.show()
    }

    function reviewRequest(request: OvertimeRequest, action: 'approve' | 'reject') {
      selectedRequest.value = request
      isReviewing.value = true
      const modal = new bootstrap.Modal(document.getElementById('overtimeRequestModal'))
      modal.show()
    }

    function handleRequestSubmitted() {
      refreshRequests()
    }

    function handleRequestUpdated() {
      refreshRequests()
    }

    function handleRequestReviewed() {
      refreshRequests()
    }

    // Load data on mount
    onMounted(async () => {
      await employeeStore.fetchEmployees()
      await loadOvertimeRequests()
    })

    return {
      loading,
      selectedRequest,
      isReviewing,
      filters,
      pagination,
      overtimeRequests,
      employees,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalHours,
      canRequestOvertime,
      visiblePages,
      getEmployeeName,
      getEmployeeId,
      getEmployeeInitials,
      formatDate,
      formatDayOfWeek,
      formatDateTime,
      calculateCost,
      canEditRequest,
      loadPage,
      applyFilters,
      refreshRequests,
      openRequestModal,
      viewRequest,
      editRequest,
      reviewRequest,
      handleRequestSubmitted,
      handleRequestUpdated,
      handleRequestReviewed
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

.display-6 {
  font-size: 1.75rem;
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

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>