<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pay Run Management</h1>
        <p class="text-gray-600 mt-1">Manage payroll processing cycles and calculations</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <PlusIcon class="w-4 h-4" />
        Create Pay Run
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <DocumentIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pay Runs</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.total_pay_runs || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.closed_pay_runs || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">{{ inProgressCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Errors</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.error_pay_runs || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-md p-2">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="calculated">Calculated</option>
            <option value="approved">Approved</option>
            <option value="processed">Processed</option>
            <option value="finalized">Finalized</option>
            <option value="closed">Closed</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pay Frequency</label>
          <select v-model="filters.pay_frequency" class="w-full border border-gray-300 rounded-md p-2">
            <option value="">All Frequencies</option>
            <option value="weekly">Weekly</option>
            <option value="bi_weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name or number..."
            class="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        
        <div class="flex items-end">
          <button
            @click="loadPayRuns"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Pay Runs Table -->
    <div class="bg-white rounded-lg border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Run
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gross
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Net
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payRun in payRuns.data" :key="payRun.uuid" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ payRun.name }}</div>
                  <div class="text-sm text-gray-500">{{ payRun.pay_run_number }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(payRun.pay_period_start) }} - {{ formatDate(payRun.pay_period_end) }}
                </div>
                <div class="text-sm text-gray-500">
                  Pay Date: {{ formatDate(payRun.pay_date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payRun.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusLabel(payRun.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ payRun.employee_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(payRun.total_gross_salary) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(payRun.total_net_salary) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewPayRun(payRun)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    v-if="canCalculate(payRun)"
                    @click="calculatePayRun(payRun)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Calculate
                  </button>
                  <button
                    v-if="canApprove(payRun)"
                    @click="approvePayRun(payRun)"
                    class="text-purple-600 hover:text-purple-900"
                  >
                    Approve
                  </button>
                  <button
                    v-if="canProcess(payRun)"
                    @click="processPayRun(payRun)"
                    class="text-orange-600 hover:text-orange-900"
                  >
                    Process
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing {{ payRuns.from || 0 }} to {{ payRuns.to || 0 }} of {{ payRuns.total || 0 }} results
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(payRuns.current_page - 1)"
              :disabled="!payRuns.prev_page_url"
              class="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="changePage(payRuns.current_page + 1)"
              :disabled="!payRuns.next_page_url"
              class="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <PayRunModal
      v-if="showModal"
      :payRun="selectedPayRun"
      @close="closeModal"
      @saved="handlePayRunSaved"
    />

    <!-- Detail Modal -->
    <PayRunDetailModal
      v-if="showDetailModal"
      :payRun="selectedPayRun"
      @close="closeDetailModal"
      @updated="handlePayRunUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  PlusIcon,
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import PayRunModal from '@/components/payroll/PayRunModal.vue'
import PayRunDetailModal from '@/components/payroll/PayRunDetailModal.vue'
import api from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const { showSuccess, showError } = useNotifications()

// Reactive data
const payRuns = ref({})
const statistics = ref({})
const loading = ref(false)
const showModal = ref(false)
const showDetailModal = ref(false)
const selectedPayRun = ref(null)

const filters = ref({
  status: '',
  pay_frequency: '',
  search: '',
  page: 1
})

// Computed properties
const inProgressCount = computed(() => {
  return (statistics.value.calculated_pay_runs || 0) + 
         (statistics.value.approved_pay_runs || 0) + 
         (statistics.value.processed_pay_runs || 0)
})

// Methods
const loadPayRuns = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })

    const response = await api.get(`/pay-runs?${params}`)
    payRuns.value = response.data.data
  } catch (error) {
    showError('Failed to load pay runs')
    console.error('Error loading pay runs:', error)
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await api.get('/pay-runs/statistics')
    statistics.value = response.data.data
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

const openCreateModal = () => {
  selectedPayRun.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPayRun.value = null
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedPayRun.value = null
}

const viewPayRun = (payRun) => {
  selectedPayRun.value = payRun
  showDetailModal.value = true
}

const calculatePayRun = async (payRun) => {
  if (!confirm('Calculate payroll for all employees in this pay run?')) return

  try {
    await api.post(`/pay-runs/${payRun.uuid}/calculate`)
    showSuccess('Pay run calculation started')
    loadPayRuns()
  } catch (error) {
    showError('Failed to calculate pay run')
    console.error('Error calculating pay run:', error)
  }
}

const approvePayRun = async (payRun) => {
  if (!confirm('Approve this pay run for processing?')) return

  try {
    await api.post(`/pay-runs/${payRun.uuid}/approve`)
    showSuccess('Pay run approved successfully')
    loadPayRuns()
  } catch (error) {
    showError('Failed to approve pay run')
    console.error('Error approving pay run:', error)
  }
}

const processPayRun = async (payRun) => {
  if (!confirm('Process this pay run? This will generate payslips and payment files.')) return

  try {
    await api.post(`/pay-runs/${payRun.uuid}/process`)
    showSuccess('Pay run processing started')
    loadPayRuns()
  } catch (error) {
    showError('Failed to process pay run')
    console.error('Error processing pay run:', error)
  }
}

const handlePayRunSaved = () => {
  closeModal()
  loadPayRuns()
  loadStatistics()
}

const handlePayRunUpdated = () => {
  closeDetailModal()
  loadPayRuns()
  loadStatistics()
}

const changePage = (page) => {
  if (page < 1 || page > payRuns.value.last_page) return
  filters.value.page = page
  loadPayRuns()
}

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    calculating: 'bg-blue-100 text-blue-800',
    calculated: 'bg-green-100 text-green-800',
    approved: 'bg-purple-100 text-purple-800',
    processing: 'bg-orange-100 text-orange-800',
    processed: 'bg-indigo-100 text-indigo-800',
    finalized: 'bg-teal-100 text-teal-800',
    closed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    calculating: 'Calculating',
    calculated: 'Calculated',
    approved: 'Approved',
    processing: 'Processing',
    processed: 'Processed',
    finalized: 'Finalized',
    closed: 'Closed',
    error: 'Error'
  }
  return labels[status] || status
}

const canCalculate = (payRun) => {
  return payRun.status === 'draft' || payRun.status === 'error'
}

const canApprove = (payRun) => {
  return payRun.status === 'calculated'
}

const canProcess = (payRun) => {
  return payRun.status === 'approved'
}

// Lifecycle
onMounted(() => {
  loadPayRuns()
  loadStatistics()
})
</script>