<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Payroll Reports
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Generate and view payroll reports and analytics
        </p>
      </div>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Payroll Summary Report -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart3 class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Payroll Summary
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Overall payroll statistics
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          View summary of processed payrolls, total costs, and employee counts.
        </p>
        <button class="w-full btn btn-primary">
          Generate Report
        </button>
      </div>

      <!-- Employee Earnings Report -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Employee Earnings
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Individual employee reports
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Detailed breakdown of earnings, deductions, and net pay by employee.
        </p>
        <button class="w-full btn btn-primary">
          Generate Report
        </button>
      </div>

      <!-- Tax & Statutory Report -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Receipt class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Tax & Statutory
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Compliance reports
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          PAYE, UIF, and other statutory deduction reports for compliance.
        </p>
        <button class="w-full btn btn-primary">
          Generate Report
        </button>
      </div>

      <!-- Department Cost Report -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Building class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Department Costs
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Cost center analysis
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Payroll costs broken down by department and cost centers.
        </p>
        <button class="w-full btn btn-primary">
          Generate Report
        </button>
      </div>

      <!-- Payslip Archive -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Payslip Archive
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Historical payslips
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Access and download historical payslips for all employees.
        </p>
        <button class="w-full btn btn-primary">
          View Archive
        </button>
      </div>

      <!-- Variance Report -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Variance Analysis
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Period comparisons
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Compare payroll costs across different periods and identify variances.
        </p>
        <button class="w-full btn btn-primary">
          Generate Report
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Quick Statistics
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            0
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Processed Payrolls
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            R 0
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total Gross Pay
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            R 0
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total Deductions
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            R 0
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total Net Pay
          </div>
        </div>
      </div>
    </div>

    <!-- Coming Soon Notice -->
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Reports Coming Soon
          </h3>
          <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              Advanced reporting features are currently under development. 
              These will include interactive charts, export functionality, and automated report scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  BarChart3, 
  Users, 
  Receipt, 
  Building, 
  FileText, 
  TrendingUp 
} from 'lucide-vue-next'
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}
</style>