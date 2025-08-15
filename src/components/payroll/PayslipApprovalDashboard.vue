<template>
  <div class="payslip-approval-dashboard">
    <div class="dashboard-header">
      <h2>Payslip Approvals</h2>
      <div class="header-actions">
        <button 
          @click="refreshData" 
          class="btn btn-secondary"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
        <button 
          @click="showBulkApprovalModal = true" 
          class="btn btn-primary"
          :disabled="selectedApprovals.length === 0"
        >
          <i class="fas fa-check-double"></i>
          Bulk Approve ({{ selectedApprovals.length }})
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card pending">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.pending || 0 }}</h3>
          <p>Pending Approvals</p>
        </div>
      </div>
      
      <div class="stat-card approved">
        <div class="stat-icon">
          <i class="fas fa-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.approved || 0 }}</h3>
          <p>Approved (30 days)</p>
        </div>
      </div>
      
      <div class="stat-card rejected">
        <div class="stat-icon">
          <i class="fas fa-times"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.rejected || 0 }}</h3>
          <p>Rejected (30 days)</p>
        </div>
      </div>
      
      <div class="stat-card avg-time">
        <div class="stat-icon">
          <i class="fas fa-stopwatch"></i>
        </div>
        <div class="stat-content">
          <h3>{{ Math.round(statistics.average_approval_time || 0) }}h</h3>
          <p>Avg. Approval Time</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filters.status" @change="loadApprovals">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Approval Level:</label>
        <select v-model="filters.approval_level" @change="loadApprovals">
          <option value="">All Levels</option>
          <option value="first_level">First Level</option>
          <option value="second_level">Second Level</option>
          <option value="final">Final</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Date From:</label>
        <input 
          type="date" 
          v-model="filters.date_from" 
          @change="loadApprovals"
        >
      </div>
      
      <div class="filter-group">
        <label>Date To:</label>
        <input 
          type="date" 
          v-model="filters.date_to" 
          @change="loadApprovals"
        >
      </div>
    </div>

    <!-- Approvals Table -->
    <div class="approvals-table-container">
      <table class="approvals-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                v-model="selectAll" 
                @change="toggleSelectAll"
              >
            </th>
            <th>Employee</th>
            <th>Payroll</th>
            <th>Level</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="approval in approvals.data" 
            :key="approval.uuid"
            :class="{ 'expired': isExpired(approval) }"
          >
            <td>
              <input 
                type="checkbox" 
                v-model="selectedApprovals" 
                :value="approval.uuid"
                :disabled="!canApprove(approval)"
              >
            </td>
            <td>
              <div class="employee-info">
                <strong>{{ approval.employee.display_name }}</strong>
                <div class="employee-id">{{ approval.employee.employee_id }}</div>
              </div>
            </td>
            <td>
              <div class="payroll-info">
                <strong>{{ approval.payroll.payroll_number }}</strong>
                <div class="payroll-period">
                  {{ formatDate(approval.payroll.period_start) }} - 
                  {{ formatDate(approval.payroll.period_end) }}
                </div>
                <div class="payroll-amount">
                  ${{ formatNumber(approval.payroll.net_salary) }}
                </div>
              </div>
            </td>
            <td>
              <span class="level-badge" :class="approval.approval_level">
                {{ approval.approval_level_name }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="approval.status">
                {{ approval.status_name }}
              </span>
            </td>
            <td>
              <div class="request-info">
                <div class="requester">{{ approval.requester.name }}</div>
                <div class="request-date">{{ formatDateTime(approval.requested_at) }}</div>
              </div>
            </td>
            <td>
              <div class="expiry-info" :class="{ 'expired': isExpired(approval) }">
                {{ formatDateTime(approval.expires_at) }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  v-if="canApprove(approval)"
                  @click="approveRequest(approval)"
                  class="btn btn-sm btn-success"
                  title="Approve"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  v-if="canReject(approval)"
                  @click="rejectRequest(approval)"
                  class="btn btn-sm btn-danger"
                  title="Reject"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button 
                  @click="viewDetails(approval)"
                  class="btn btn-sm btn-info"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="approvals.data && approvals.data.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No approval requests found</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="approvals.last_page > 1">
      <button 
        @click="loadApprovals(approvals.current_page - 1)"
        :disabled="approvals.current_page === 1"
        class="btn btn-secondary"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ approvals.current_page }} of {{ approvals.last_page }}
      </span>
      
      <button 
        @click="loadApprovals(approvals.current_page + 1)"
        :disabled="approvals.current_page === approvals.last_page"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>

    <!-- Bulk Approval Modal -->
    <div v-if="showBulkApprovalModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Bulk Approve Requests</h3>
          <button @click="showBulkApprovalModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to approve {{ selectedApprovals.length }} requests?</p>
          <div class="form-group">
            <label>Approval Notes:</label>
            <textarea 
              v-model="bulkApprovalNotes" 
              placeholder="Optional notes for bulk approval"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showBulkApprovalModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="performBulkApproval" class="btn btn-primary">
            Approve Selected
          </button>
        </div>
      </div>
    </div>

    <!-- Approval Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Approval Request Details</h3>
          <button @click="showDetailsModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedApproval" class="approval-details">
            <div class="detail-section">
              <h4>Employee Information</h4>
              <p><strong>Name:</strong> {{ selectedApproval.employee.display_name }}</p>
              <p><strong>ID:</strong> {{ selectedApproval.employee.employee_id }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Payroll Information</h4>
              <p><strong>Payroll Number:</strong> {{ selectedApproval.payroll.payroll_number }}</p>
              <p><strong>Period:</strong> {{ formatDate(selectedApproval.payroll.period_start) }} - {{ formatDate(selectedApproval.payroll.period_end) }}</p>
              <p><strong>Net Salary:</strong> ${{ formatNumber(selectedApproval.payroll.net_salary) }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Approval Information</h4>
              <p><strong>Level:</strong> {{ selectedApproval.approval_level_name }}</p>
              <p><strong>Status:</strong> {{ selectedApproval.status_name }}</p>
              <p><strong>Requested By:</strong> {{ selectedApproval.requester.name }}</p>
              <p><strong>Requested At:</strong> {{ formatDateTime(selectedApproval.requested_at) }}</p>
              <p><strong>Expires At:</strong> {{ formatDateTime(selectedApproval.expires_at) }}</p>
            </div>
            
            <div class="detail-section" v-if="selectedApproval.request_notes">
              <h4>Request Notes</h4>
              <p>{{ selectedApproval.request_notes }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showDetailsModal = false" class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useApi } from '@/composables/useApi'

export default {
  name: 'PayslipApprovalDashboard',
  setup() {
    const { showNotification } = useNotifications()
    const { apiCall } = useApi()
    
    const loading = ref(false)
    const approvals = ref({ data: [], current_page: 1, last_page: 1 })
    const statistics = ref({})
    const selectedApprovals = ref([])
    const showBulkApprovalModal = ref(false)
    const showDetailsModal = ref(false)
    const selectedApproval = ref(null)
    const bulkApprovalNotes = ref('')
    
    const filters = reactive({
      status: '',
      approval_level: '',
      date_from: '',
      date_to: ''
    })

    const selectAll = computed({
      get() {
        const approvableItems = approvals.value.data.filter(approval => canApprove(approval))
        return approvableItems.length > 0 && 
               approvableItems.every(approval => selectedApprovals.value.includes(approval.uuid))
      },
      set(value) {
        if (value) {
          selectedApprovals.value = approvals.value.data
            .filter(approval => canApprove(approval))
            .map(approval => approval.uuid)
        } else {
          selectedApprovals.value = []
        }
      }
    })

    const loadApprovals = async (page = 1) => {
      loading.value = true
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: '15'
        })
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
        
        const response = await apiCall(`/api/payslip-approvals/all?${params}`)
        approvals.value = response.data
      } catch (error) {
        showNotification('Failed to load approvals', 'error')
      } finally {
        loading.value = false
      }
    }

    const loadStatistics = async () => {
      try {
        const response = await apiCall('/api/payslip-approvals/statistics')
        statistics.value = response.data
      } catch (error) {
        showNotification('Failed to load statistics', 'error')
      }
    }

    const refreshData = async () => {
      await Promise.all([loadApprovals(), loadStatistics()])
    }

    const canApprove = (approval) => {
      return approval.status === 'pending' && !isExpired(approval)
    }

    const canReject = (approval) => {
      return approval.status === 'pending' && !isExpired(approval)
    }

    const isExpired = (approval) => {
      return new Date(approval.expires_at) < new Date()
    }

    const approveRequest = async (approval) => {
      const notes = prompt('Approval notes (optional):')
      if (notes === null) return

      try {
        await apiCall(`/api/payslip-approvals/${approval.uuid}/approve`, {
          method: 'POST',
          body: { notes }
        })
        showNotification('Request approved successfully', 'success')
        await refreshData()
      } catch (error) {
        showNotification('Failed to approve request', 'error')
      }
    }

    const rejectRequest = async (approval) => {
      const notes = prompt('Rejection reason (required):')
      if (!notes) return

      try {
        await apiCall(`/api/payslip-approvals/${approval.uuid}/reject`, {
          method: 'POST',
          body: { notes }
        })
        showNotification('Request rejected successfully', 'success')
        await refreshData()
      } catch (error) {
        showNotification('Failed to reject request', 'error')
      }
    }

    const performBulkApproval = async () => {
      try {
        await apiCall('/api/payslip-approvals/bulk-approve', {
          method: 'POST',
          body: {
            approval_uuids: selectedApprovals.value,
            notes: bulkApprovalNotes.value
          }
        })
        showNotification('Bulk approval completed successfully', 'success')
        showBulkApprovalModal.value = false
        selectedApprovals.value = []
        bulkApprovalNotes.value = ''
        await refreshData()
      } catch (error) {
        showNotification('Failed to complete bulk approval', 'error')
      }
    }

    const viewDetails = (approval) => {
      selectedApproval.value = approval
      showDetailsModal.value = true
    }

    const toggleSelectAll = () => {
      selectAll.value = !selectAll.value
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString()
    }

    const formatNumber = (number) => {
      return new Intl.NumberFormat().format(number)
    }

    onMounted(() => {
      refreshData()
    })

    return {
      loading,
      approvals,
      statistics,
      selectedApprovals,
      showBulkApprovalModal,
      showDetailsModal,
      selectedApproval,
      bulkApprovalNotes,
      filters,
      selectAll,
      loadApprovals,
      refreshData,
      canApprove,
      canReject,
      isExpired,
      approveRequest,
      rejectRequest,
      performBulkApproval,
      viewDetails,
      toggleSelectAll,
      formatDate,
      formatDateTime,
      formatNumber
    }
  }
}
</script>

<style scoped>
.payslip-approval-dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 4px solid;
}

.stat-card.pending {
  border-left-color: #ffc107;
}

.stat-card.approved {
  border-left-color: #28a745;
}

.stat-card.rejected {
  border-left-color: #dc3545;
}

.stat-card.avg-time {
  border-left-color: #17a2b8;
}

.stat-icon {
  font-size: 24px;
  color: #666;
}

.stat-content h3 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-content p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.filters-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.approvals-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.approvals-table {
  width: 100%;
  border-collapse: collapse;
}

.approvals-table th,
.approvals-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.approvals-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.approvals-table tr:hover {
  background: #f8f9fa;
}

.approvals-table tr.expired {
  background: #fff3cd;
}

.employee-info .employee-id {
  font-size: 12px;
  color: #666;
}

.payroll-info {
  font-size: 14px;
}

.payroll-period {
  font-size: 12px;
  color: #666;
}

.payroll-amount {
  font-weight: 600;
  color: #28a745;
}

.level-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.level-badge.first_level {
  background: #e3f2fd;
  color: #1976d2;
}

.level-badge.second_level {
  background: #fff3e0;
  color: #f57c00;
}

.level-badge.final {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.cancelled {
  background: #e2e3e5;
  color: #495057;
}

.request-info .requester {
  font-weight: 500;
}

.request-info .request-date {
  font-size: 12px;
  color: #666;
}

.expiry-info.expired {
  color: #dc3545;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 10px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.approval-details {
  display: grid;
  gap: 20px;
}

.detail-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.detail-section p {
  margin: 5px 0;
  color: #666;
}

.fa-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>