<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-300 font-medium text-sm">
              {{ getInitials(employee?.first_name, employee?.last_name) }}
            </span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ employee?.display_name }} - Payroll Management
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ employee?.employee_id }} • {{ employee?.position?.name }} • {{ employee?.formatted_salary }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left Panel - Payroll Items -->
        <div class="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h4 class="text-md font-medium text-gray-900 dark:text-white">Payroll Items</h4>
              <button
                @click="openAddItemModal"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <!-- Filters -->
            <div class="mt-4 flex space-x-4">
              <select
                v-model="itemFilters.type"
                class="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
              >
                <option value="">All Types</option>
                <option value="allowance">Allowances</option>
                <option value="deduction">Deductions</option>
                <option value="employer_contribution">Employer Contributions</option>
              </select>
              <select
                v-model="itemFilters.status"
                class="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending_approval">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto">
            <div v-if="loading" class="p-6">
              <div class="animate-pulse space-y-4">
                <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>

            <div v-else-if="filteredPayrollItems.length === 0" class="p-6 text-center">
              <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payroll items</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add allowances or deductions to build this employee's payslip.
              </p>
            </div>

            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="item in filteredPayrollItems"
                :key="item?.uuid || item?.id || Math.random()"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ item?.name || 'Unknown Item' }}
                      </h5>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="getTypeBadgeClass(item?.type)"
                      >
                        {{ item?.type || 'unknown' }}
                      </span>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="getStatusBadgeClass(item?.status)"
                      >
                        {{ item?.status || 'unknown' }}
                      </span>
                    </div>
                    <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ item?.code || 'N/A' }}</span>
                      <span>{{ getCalculationMethodLabel(item?.calculation_method) }}</span>
                      <span class="font-medium">{{ formatCurrency(item?.calculated_amount || getItemAmount(item)) }}</span>
                    </div>
                    <div v-if="item?.effective_from || item?.effective_to" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span v-if="item?.effective_from">From: {{ formatDate(item.effective_from) }}</span>
                      <span v-if="item?.effective_to"> • To: {{ formatDate(item.effective_to) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editPayrollItem(item)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      :disabled="!item?.uuid"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="item?.status === 'pending_approval'"
                      @click="approveItem(item)"
                      class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      :disabled="!item?.uuid"
                    >
                      <CheckIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="item?.status === 'active'"
                      @click="suspendItem(item)"
                      class="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                      :disabled="!item?.uuid"
                    >
                      <PauseIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deletePayrollItem(item)"
                      class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      :disabled="!item?.uuid"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Payslip Preview -->
        <div class="w-1/2 flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h4 class="text-md font-medium text-gray-900 dark:text-white">Payslip Preview</h4>
              <div class="flex space-x-2">
                <button
                  @click="refreshPreview"
                  :disabled="loadingPreview"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <ArrowPathIcon class="w-4 h-4 mr-1" :class="{ 'animate-spin': loadingPreview }" />
                  Refresh
                </button>
                <button
                  @click="generatePayslip"
                  :disabled="!canGeneratePayslip"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DocumentTextIcon class="w-4 h-4 mr-1" />
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loadingPreview" class="space-y-4">
              <div class="animate-pulse space-y-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>

            <div v-else class="space-y-6">
              <!-- Basic Salary -->
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Basic Salary</h5>
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(employee?.salary || 0) }}
                </div>
              </div>

              <!-- Allowances -->
              <div v-if="allowances.length > 0">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Allowances</h5>
                <div class="space-y-2">
                  <div
                    v-for="allowance in allowances"
                    :key="allowance.uuid"
                    class="flex justify-between items-center py-2 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"
                  >
                    <span class="text-sm text-green-800 dark:text-green-200">{{ allowance.name }}</span>
                    <span class="text-sm font-medium text-green-600 dark:text-green-400">
                      +{{ formatCurrency(allowance.calculated_amount || getItemAmount(allowance)) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-green-800 dark:text-green-200">Total Allowances</span>
                    <span class="text-sm font-bold text-green-600 dark:text-green-400">
                      +{{ formatCurrency(totalAllowances) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Employer Contributions -->
              <div v-if="employerContributions.length > 0" class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h5 class="text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">Employer Contributions</h5>
                <div class="space-y-2">
                  <div
                    v-for="contribution in employerContributions"
                    :key="contribution.uuid"
                    class="flex justify-between items-center py-2 px-3 bg-white dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded"
                  >
                    <div class="flex-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-purple-800 dark:text-purple-200">{{ contribution.name }}</span>
                        <span class="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                          {{ contribution.contribution_type }}
                        </span>
                      </div>
                      <div v-if="contribution.has_employee_match" class="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        Employee matches: {{ formatCurrency(contribution.employee_amount || 0) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {{ formatCurrency(contribution.calculated_amount || getItemAmount(contribution)) }}
                      </div>
                      <div v-if="contribution.has_employee_match" class="text-xs text-purple-500 dark:text-purple-400">
                        Total: {{ formatCurrency((contribution.calculated_amount || getItemAmount(contribution)) + (contribution.employee_amount || 0)) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-purple-800 dark:text-purple-200">Total Employer Contributions</span>
                    <span class="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {{ formatCurrency(totalEmployerContributions) }}
                    </span>
                  </div>
                  <div v-if="totalEmployeeMatchContributions > 0" class="flex justify-between items-center mt-1">
                    <span class="text-xs text-purple-600 dark:text-purple-400">Employee Match Contributions</span>
                    <span class="text-xs font-medium text-purple-500 dark:text-purple-400">
                      {{ formatCurrency(totalEmployeeMatchContributions) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Gross Salary -->
              <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Gross Salary</span>
                  <span class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(grossSalary) }}
                  </span>
                </div>
              </div>

              <!-- Statutory Deductions -->
              <div>
                <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Statutory Deductions</h5>
                <div v-if="statutoryDeductions.length > 0" class="space-y-3">
                  <div
                    v-for="deduction in statutoryDeductions"
                    :key="deduction.code"
                    class="border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <!-- Deduction Header -->
                    <div 
                      @click="toggleDeductionDetails(deduction.code)"
                      class="flex justify-between items-center py-2 px-3 bg-red-50 dark:bg-red-900/20 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-red-800 dark:text-red-200">{{ deduction.name }}</span>
                        <button class="text-red-600 dark:text-red-400 text-xs">
                          {{ expandedDeductions.includes(deduction.code) ? 'Hide Details' : 'Show Details' }}
                        </button>
                      </div>
                      <span class="text-sm font-medium text-red-600 dark:text-red-400">
                        -{{ formatCurrency(deduction.employee_amount || 0) }}
                      </span>
                    </div>

                    <!-- Detailed Breakdown -->
                    <div 
                      v-if="expandedDeductions.includes(deduction.code) && deduction.calculation_details"
                      class="px-3 pb-3 bg-white dark:bg-gray-800 border-t border-red-200 dark:border-red-800"
                    >
                      <!-- Progressive Bracket Details (PAYE) -->
                      <div v-if="deduction.calculation_details.method === 'progressive_bracket'" class="mt-2 space-y-2">
                        <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Calculation Breakdown:</div>
                        
                        <!-- Tax Brackets -->
                        <div 
                          v-for="(calc, index) in deduction.calculation_details.bracket_calculations"
                          :key="index"
                          class="text-xs"
                        >
                          <div v-if="calc.bracket" class="flex justify-between py-1 px-2 bg-gray-50 dark:bg-gray-700 rounded mb-1">
                            <span class="text-gray-600 dark:text-gray-400">
                              {{ formatCurrency(calc.bracket.min) }} - 
                              {{ calc.bracket.max ? formatCurrency(calc.bracket.max) : 'Unlimited' }} 
                              @ {{ (calc.bracket.rate * 100).toFixed(1) }}%
                            </span>
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ formatCurrency(calc.tax_amount || 0) }}
                            </span>
                          </div>
                          
                          <!-- Rebates -->
                          <div v-else-if="calc.type === 'rebate'" class="flex justify-between py-1 px-2 bg-green-50 dark:bg-green-900/20 rounded mb-1">
                            <span class="text-green-600 dark:text-green-400">
                              {{ calc.rebate_type.charAt(0).toUpperCase() + calc.rebate_type.slice(1) }} Rebate
                            </span>
                            <span class="font-medium text-green-600 dark:text-green-400">
                              {{ formatCurrency(calc.amount || 0) }}
                            </span>
                          </div>
                        </div>
                        
                        <div class="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                          <div class="flex justify-between text-xs font-medium">
                            <span class="text-gray-700 dark:text-gray-300">Salary Used:</span>
                            <span class="text-gray-900 dark:text-white">{{ formatCurrency(deduction.calculation_details.salary_used || 0) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Percentage-based Details (UIF, SDL) -->
                      <div v-else-if="deduction.calculation_details.method === 'percentage'" class="mt-2 space-y-2">
                        <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Calculation Breakdown:</div>
                        
                        <div class="text-xs space-y-1">
                          <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Salary Used:</span>
                            <span class="text-gray-900 dark:text-white">{{ formatCurrency(deduction.calculation_details.salary_used || 0) }}</span>
                          </div>
                          <div v-if="deduction.calculation_details.employee_rate" class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Employee Rate:</span>
                            <span class="text-gray-900 dark:text-white">{{ (parseFloat(deduction.calculation_details.employee_rate) * 100).toFixed(2) }}%</span>
                          </div>
                          <div v-if="deduction.calculation_details.employer_rate" class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Employer Rate:</span>
                            <span class="text-gray-900 dark:text-white">{{ (parseFloat(deduction.calculation_details.employer_rate) * 100).toFixed(2) }}%</span>
                          </div>
                        </div>
                      </div>

                      <!-- General calculation method display -->
                      <div v-else class="mt-2">
                        <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Calculation Method:</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400 capitalize">{{ deduction.calculation_details.method?.replace('_', ' ') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="py-2 px-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                  <span class="text-sm text-gray-600 dark:text-gray-400">No statutory deductions configured</span>
                </div>
              </div>

              <!-- Other Deductions -->
              <div v-if="deductions.length > 0">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Other Deductions</h5>
                <div class="space-y-2">
                  <div
                    v-for="deduction in deductions"
                    :key="deduction.uuid"
                    class="flex justify-between items-center py-2 px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded"
                  >
                    <span class="text-sm text-red-800 dark:text-red-200">{{ deduction.name }}</span>
                    <span class="text-sm font-medium text-red-600 dark:text-red-400">
                      -{{ formatCurrency(deduction.calculated_amount || getItemAmount(deduction)) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-red-800 dark:text-red-200">Total Deductions</span>
                    <span class="text-sm font-bold text-red-600 dark:text-red-400">
                      -{{ formatCurrency(totalDeductions) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Net Salary -->
              <div class="bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900 dark:text-white">Net Salary</span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(netSalary) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Payroll Item Modal -->
    <EmployeePayrollItemModal
      :is-open="payrollItemModalOpen"
      :employee="employee"
      :item="selectedPayrollItem"
      @close="closePayrollItemModal"
      @saved="handlePayrollItemSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useCurrency } from '@/composables/useCurrency'
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  PauseIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'
import EmployeePayrollItemModal from './EmployeePayrollItemModal.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { get, post, delete: del } = useApi()
const { showNotification } = useNotifications()
const { formatCurrency } = useCurrency()

// State
const loading = ref(false)
const loadingPreview = ref(false)
const payrollItems = ref([])
const statutoryDeductions = ref([])
const expandedDeductions = ref([])
const payrollItemModalOpen = ref(false)
const selectedPayrollItem = ref(null)

const itemFilters = reactive({
  type: '',
  status: ''
})

// Computed
const filteredPayrollItems = computed(() => {
  if (!Array.isArray(payrollItems.value)) {
    return []
  }
  
  let filtered = payrollItems.value.filter(item => item && (item.uuid || item.id))

  if (itemFilters.type) {
    filtered = filtered.filter(item => item?.type === itemFilters.type)
  }

  if (itemFilters.status) {
    filtered = filtered.filter(item => item?.status === itemFilters.status)
  }

  return filtered
})

const allowances = computed(() => {
  if (!Array.isArray(payrollItems.value)) {
    return []
  }
  return payrollItems.value.filter(item => 
    item && item.type === 'allowance' && item.status === 'active'
  )
})

const deductions = computed(() => {
  if (!Array.isArray(payrollItems.value)) {
    return []
  }
  return payrollItems.value.filter(item => 
    item && item.type === 'deduction' && item.status === 'active'
  )
})

const employerContributions = computed(() => {
  if (!Array.isArray(payrollItems.value)) {
    return []
  }
  return payrollItems.value.filter(item => 
    item && item.type === 'employer_contribution' && item.status === 'active'
  )
})

const totalAllowances = computed(() => {
  return allowances.value.reduce((sum, item) => {
    const amount = item.calculated_amount || getItemAmount(item)
    return sum + (parseFloat(amount) || 0)
  }, 0)
})

const totalDeductions = computed(() => {
  const payrollDeductions = deductions.value.reduce((sum, item) => {
    const amount = item.calculated_amount || getItemAmount(item)
    return sum + (parseFloat(amount) || 0)
  }, 0)
  
  const statutoryDeductionsTotal = statutoryDeductions.value.reduce((sum, item) => {
    return sum + (parseFloat(item.employee_amount) || 0)
  }, 0)
  
  return payrollDeductions + statutoryDeductionsTotal
})

const totalEmployerContributions = computed(() => {
  return employerContributions.value.reduce((sum, item) => {
    const amount = item.calculated_amount || getItemAmount(item)
    return sum + (parseFloat(amount) || 0)
  }, 0)
})

const totalEmployeeMatchContributions = computed(() => {
  return employerContributions.value.reduce((sum, item) => {
    if (item.has_employee_match) {
      const amount = item.employee_amount || 0
      return sum + (parseFloat(amount) || 0)
    }
    return sum
  }, 0)
})

const grossSalary = computed(() => {
  const basicSalary = parseFloat(props.employee?.salary) || 0
  return basicSalary + totalAllowances.value
})

const netSalary = computed(() => {
  return grossSalary.value - totalDeductions.value
})

const canGeneratePayslip = computed(() => {
  return props.employee && (allowances.value.length > 0 || deductions.value.length > 0)
})


// Methods
const loadPayrollItems = async () => {
  if (!props.employee?.uuid) return

  try {
    loading.value = true
    const response = await get('/employee-payroll-items', {
      params: {
        employee_uuid: props.employee.uuid
      }
    })
    
    // Laravel ResourceCollection returns data in 'data' field
    payrollItems.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load payroll items:', error)
    showNotification('Failed to load payroll items', 'error')
    payrollItems.value = []
  } finally {
    loading.value = false
  }
}

const loadStatutoryDeductions = async () => {
  if (!props.employee?.uuid) return

  try {
    loadingPreview.value = true
    const response = await post('/payroll/calculate-statutory-deductions', {
      employee_uuid: props.employee.uuid,
      gross_salary: parseFloat(grossSalary.value) || 0
    })
    statutoryDeductions.value = response.data.data.deductions?.deductions || []
  } catch (error) {
    console.error('Failed to load statutory deductions:', error)
    statutoryDeductions.value = []
  } finally {
    loadingPreview.value = false
  }
}

const refreshPreview = async () => {
  await Promise.all([loadPayrollItems(), loadStatutoryDeductions()])
}

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getTypeBadgeClass = (type) => {
  const classes = {
    allowance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    deduction: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    employer_contribution: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspended: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getCalculationMethodLabel = (method) => {
  const labels = {
    fixed_amount: 'Fixed',
    percentage_of_salary: '% of Salary',
    percentage_of_basic: '% of Basic',
    formula: 'Formula',
    manual: 'Manual'
  }
  return labels[method] || method
}


const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-ZA')
}

const getItemAmount = (item) => {
  if (!item) return 0
  
  // If already calculated and not zero, return that value
  if (item.calculated_amount !== undefined && item.calculated_amount !== null && parseFloat(item.calculated_amount) !== 0) {
    return parseFloat(item.calculated_amount) || 0
  }
  
  // Calculate based on method
  const basicSalary = parseFloat(props.employee?.salary) || 0
  // For percentage_of_salary, we need gross salary but avoid circular reference
  // Use basic salary for now since we're in the middle of calculating allowances
  const grossSalaryForCalculation = basicSalary
  
  // If item is not active, return 0 (matches backend behavior)
  if (item.status !== 'active') {
    return 0
  }
  
  switch (item.calculation_method) {
    case 'fixed_amount':
    case 'manual':
      return parseFloat(item.amount) || 0
    case 'percentage_of_salary':
      return (grossSalaryForCalculation * (parseFloat(item.percentage) || 0)) / 100
    case 'percentage_of_basic':
      return (basicSalary * (parseFloat(item.percentage) || 0)) / 100
    default:
      return parseFloat(item.amount) || 0
  }
}

const openAddItemModal = () => {
  selectedPayrollItem.value = null
  payrollItemModalOpen.value = true
}

const editPayrollItem = (item) => {
  if (!item?.uuid) return
  selectedPayrollItem.value = item
  payrollItemModalOpen.value = true
}

const closePayrollItemModal = () => {
  payrollItemModalOpen.value = false
  selectedPayrollItem.value = null
}

const handlePayrollItemSaved = () => {
  refreshPreview()
  emit('saved')
}

const approveItem = async (item) => {
  if (!item?.uuid) return
  
  try {
    await post(`/employee-payroll-items/${item.uuid}/approve`)
    showNotification('Payroll item approved successfully', 'success')
    refreshPreview()
  } catch (error) {
    showNotification('Failed to approve payroll item', 'error')
  }
}

const suspendItem = async (item) => {
  if (!item?.uuid) return
  
  try {
    await post(`/employee-payroll-items/${item.uuid}/suspend`)
    showNotification('Payroll item suspended successfully', 'success')
    refreshPreview()
  } catch (error) {
    showNotification('Failed to suspend payroll item', 'error')
  }
}

const deletePayrollItem = async (item) => {
  if (!item?.uuid) return
  if (!confirm('Are you sure you want to delete this payroll item?')) return

  try {
    await del(`/employee-payroll-items/${item.uuid}`)
    showNotification('Payroll item deleted successfully', 'success')
    refreshPreview()
  } catch (error) {
    showNotification('Failed to delete payroll item', 'error')
  }
}

const toggleDeductionDetails = (deductionCode) => {
  const index = expandedDeductions.value.indexOf(deductionCode)
  if (index > -1) {
    expandedDeductions.value.splice(index, 1)
  } else {
    expandedDeductions.value.push(deductionCode)
  }
}

const generatePayslip = async () => {
  try {
    await post('/payroll/generate-payslip', {
      employee_uuid: props.employee.uuid,
      payroll_items: payrollItems.value.filter(item => item.status === 'active'),
      statutory_deductions: statutoryDeductions.value
    })
    
    showNotification('Payslip generated successfully', 'success')
    // Handle payslip download or display
  } catch (error) {
    showNotification('Failed to generate payslip', 'error')
  }
}

// Watchers
watch(() => props.employee, (newEmployee) => {
  if (newEmployee?.uuid && props.isOpen) {
    refreshPreview()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.employee?.uuid) {
    refreshPreview()
  }
})

// Calculate amounts when payroll items change
watch(payrollItems, async () => {
  // Ensure payrollItems is an array
  if (!Array.isArray(payrollItems.value)) {
    return
  }
  
  // Optionally fetch precise calculations from backend for active items
  for (const item of payrollItems.value) {
    if (item.status === 'active' && item.uuid) {
      try {
        const response = await post(`/employee-payroll-items/${item.uuid}/calculate-preview`, {
          employee_basic_salary: parseFloat(props.employee?.salary) || 0,
          gross_salary: parseFloat(grossSalary.value) || 0
        })
        item.calculated_amount = parseFloat(response.data.calculated_amount) || 0
      } catch (error) {
        console.error('Failed to calculate amount for item:', item.code)
        // Fallback to client-side calculation (getItemAmount handles this)
      }
    }
  }
  
  // Reload statutory deductions with new gross salary
  loadStatutoryDeductions()
}, { deep: true })
</script>