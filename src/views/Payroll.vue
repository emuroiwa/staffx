<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Process and manage employee payroll for this year.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <select
          class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option>This Year</option>
          <option>Last Year</option>
          <option>Custom Range</option>
        </select>
        <button
          @click="processPayroll"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <Play class="w-4 h-4 mr-2 inline" />
          Process Payroll
        </button>
      </div>
    </div>

    <!-- Payroll Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="metric in payrollMetrics" :key="metric.title" class="metric-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ metric.title }}
            </p>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ metric.value }}
            </p>
          </div>
          <div :class="['p-3 rounded-full', metric.iconBg]">
            <component :is="metric.icon" :class="['w-5 h-5', metric.iconColor]" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <span :class="['text-sm font-medium', metric.changeColor]">
              {{ metric.change }}
            </span>
            <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {{ metric.changeText }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Chart and Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Payroll Overview Chart -->
      <div class="lg:col-span-2 card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payroll Overview</h3>
          <select
            class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>

        <!-- Chart Container -->
        <div
          class="h-80 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4"
        >
          <div class="text-center">
            <BarChart3 class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-lg font-medium text-gray-600 dark:text-gray-400">
              Monthly Payroll Trends
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              Chart visualization would appear here
            </p>
          </div>
        </div>

        <!-- Chart Legend -->
        <div class="flex items-center justify-center space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Gross Pay</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Net Pay</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Deductions</span>
          </div>
        </div>
      </div>

      <!-- Payroll Summary -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Current Month</h3>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Gross Payroll</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$324,560</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Total Deductions</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$89,560</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Net Payroll</span>
              <span class="text-lg font-semibold text-green-600 dark:text-green-400">$235,000</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Processing Status</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Processed</span>
              <span class="text-sm font-medium text-green-600 dark:text-green-400">75%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">510 of 678 employees processed</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Runs History -->
    <div class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Payroll Runs</h3>
          <button
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            View All
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Pay Period
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Employees
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Gross Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Net Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Run Date
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="run in payrollRuns"
              :key="run.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ run.payPeriod }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ run.dateRange }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ run.employeeCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatCurrency(run.grossAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatCurrency(run.netAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    run.status === 'Completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : run.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : run.status === 'Draft'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  ]"
                >
                  {{ run.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(run.runDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewPayrollDetails(run)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="downloadPayrollReport(run)"
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Download Report"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                  <button
                    v-if="run.status === 'Draft'"
                    @click="editPayroll(run)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upcoming Payroll Schedule -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Payroll -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Upcoming Payroll</h3>

        <div class="space-y-4">
          <div
            v-for="upcoming in upcomingPayroll"
            :key="upcoming.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ upcoming.period }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ upcoming.dueDate }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ upcoming.employees }} employees
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Est. {{ formatCurrency(upcoming.estimatedAmount) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax & Compliance -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tax & Compliance</h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Federal Tax Withheld</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$45,230</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">State Tax Withheld</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$12,560</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Social Security</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$18,920</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Medicare</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">$4,430</span>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white"
                >Total Tax Liability</span
              >
              <span class="text-lg font-semibold text-red-600 dark:text-red-400">$81,140</span>
            </div>
          </div>

          <button
            class="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Generate Tax Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Play,
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Eye,
  Download,
  Edit
} from 'lucide-vue-next'

// Payroll metrics
const payrollMetrics = ref([
  {
    title: 'Total Payroll',
    value: '$235,000',
    change: '+12%',
    changeText: 'vs last month',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: DollarSign,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Employees Paid',
    value: '510',
    change: '+2',
    changeText: 'new hires',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: Users,
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Avg Salary',
    value: '$4,608',
    change: '+3.2%',
    changeText: 'increase',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: TrendingUp,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: 'Pending Issues',
    value: '3',
    change: '-2',
    changeText: 'resolved',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: AlertTriangle,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  }
])

// Payroll runs history
const payrollRuns = ref([
  {
    id: 1,
    payPeriod: 'June 2025',
    dateRange: 'Jun 1 - Jun 30, 2025',
    employeeCount: 678,
    grossAmount: 324560,
    netAmount: 235000,
    status: 'Processing',
    runDate: '2025-06-28'
  },
  {
    id: 2,
    payPeriod: 'May 2025',
    dateRange: 'May 1 - May 31, 2025',
    employeeCount: 672,
    grossAmount: 318240,
    netAmount: 230500,
    status: 'Completed',
    runDate: '2025-05-31'
  },
  {
    id: 3,
    payPeriod: 'April 2025',
    dateRange: 'Apr 1 - Apr 30, 2025',
    employeeCount: 665,
    grossAmount: 312880,
    netAmount: 227200,
    status: 'Completed',
    runDate: '2025-04-30'
  },
  {
    id: 4,
    payPeriod: 'March 2025',
    dateRange: 'Mar 1 - Mar 31, 2025',
    employeeCount: 658,
    grossAmount: 309120,
    netAmount: 224500,
    status: 'Completed',
    runDate: '2025-03-31'
  }
])

// Upcoming payroll
const upcomingPayroll = ref([
  {
    id: 1,
    period: 'July 2025',
    dueDate: 'Due July 31, 2025',
    employees: 682,
    estimatedAmount: 340000
  },
  {
    id: 2,
    period: 'August 2025',
    dueDate: 'Due August 31, 2025',
    employees: 685,
    estimatedAmount: 342500
  }
])

// Methods
function processPayroll() {
  console.log('Processing payroll...')
  // Implement payroll processing logic
}

function viewPayrollDetails(run) {
  console.log('Viewing payroll details:', run)
  // Implement view payroll details
}

function downloadPayrollReport(run) {
  console.log('Downloading payroll report:', run)
  // Implement download report functionality
}

function editPayroll(run) {
  console.log('Editing payroll:', run)
  // Implement edit payroll functionality
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
