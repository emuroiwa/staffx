<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edit Template' : 'Create Template' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ isEdit ? 'Update payroll template settings' : 'Create a new payroll template for your company' }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.code"
            :disabled="isEdit"
            type="text"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            placeholder="e.g., TRANSPORT"
          >
          <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code[0] }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.type"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
          >
            <option value="">Select Type</option>
            <option value="allowance">Allowance</option>
            <option value="deduction">Deduction</option>
            <option value="employer_contribution">Employer Contribution</option>
          </select>
          <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type[0] }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
          placeholder="e.g., Transport Allowance"
        >
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
          placeholder="Brief description of this template"
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
      </div>

      <!-- Calculation Method -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Calculation Method <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.calculation_method"
          @change="resetCalculationFields"
          required
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
        >
          <option value="">Select Method</option>
          <option value="fixed_amount">Fixed Amount</option>
          <option value="percentage_of_salary">Percentage of Gross Salary</option>
          <option value="percentage_of_basic">Percentage of Basic Salary</option>
          <option value="formula">Formula Based</option>
        </select>
        <p v-if="errors.calculation_method" class="mt-1 text-sm text-red-600">{{ errors.calculation_method[0] }}</p>
      </div>

      <!-- Calculation Fields -->
      <div v-if="form.calculation_method">
        <div v-if="form.calculation_method === 'fixed_amount'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ form.type === 'employer_contribution' ? 'Employer Amount' : 'Amount' }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="0.00"
            >
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
          </div>
          <!-- Employee matching amount for employer contributions -->
          <div v-if="form.type === 'employer_contribution' && form.has_employee_match">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee Matching Amount
            </label>
            <input
              v-model.number="form.employee_match_amount"
              type="number"
              step="0.01"
              min="0"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="0.00"
            >
            <p v-if="errors.employee_match_amount" class="mt-1 text-sm text-red-600">{{ errors.employee_match_amount[0] }}</p>
          </div>
        </div>

        <div v-else-if="form.calculation_method.includes('percentage')" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ form.type === 'employer_contribution' ? 'Employer Percentage' : 'Percentage' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.default_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 pr-8"
                placeholder="0.00"
              >
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
            </div>
            <p v-if="errors.default_percentage" class="mt-1 text-sm text-red-600">{{ errors.default_percentage[0] }}</p>
          </div>
          <!-- Employee matching percentage for employer contributions -->
          <div v-if="form.type === 'employer_contribution' && form.has_employee_match">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee Matching Percentage
            </label>
            <div class="relative">
              <input
                v-model.number="form.employee_match_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 pr-8"
                placeholder="0.00"
              >
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
            </div>
            <p v-if="errors.employee_match_percentage" class="mt-1 text-sm text-red-600">{{ errors.employee_match_percentage[0] }}</p>
          </div>
        </div>

        <div v-else-if="form.calculation_method === 'formula'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formula Expression <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.formula_expression"
            rows="3"
            required
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 font-mono text-sm"
            placeholder="e.g., {basic_salary} * 0.1 + {years_of_service} * 100"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Available variables: {basic_salary}, {gross_salary}, {years_of_service}
          </p>
          <p v-if="errors.formula_expression" class="mt-1 text-sm text-red-600">{{ errors.formula_expression[0] }}</p>
        </div>
      </div>

      <!-- Employer Contribution Configuration -->
      <div v-if="form.type === 'employer_contribution'" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-medium text-blue-900 dark:text-blue-100">
            Employer Contribution Configuration
          </h4>
          <div class="flex space-x-2">
            <button
              @click="applyUifTemplate"
              type="button"
              class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              UIF Template
            </button>
            <button
              @click="applyPensionTemplate"
              type="button"
              class="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Pension Template
            </button>
          </div>
        </div>
        
        <div class="space-y-4">
          <!-- Contribution Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contribution Type
            </label>
            <select
              v-model="form.contribution_type"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            >
              <option value="pension">Pension Contribution</option>
              <option value="medical_aid">Medical Aid Contribution</option>
              <option value="provident_fund">Provident Fund</option>
              <option value="group_life">Group Life Insurance</option>
              <option value="disability">Disability Insurance</option>
              <option value="training_levy">Training Levy</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.contribution_type" class="mt-1 text-sm text-red-600">{{ errors.contribution_type[0] }}</p>
          </div>

          <!-- Employee Matching Option -->
          <div class="flex items-center space-x-3">
            <input
              v-model="form.has_employee_match"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            >
            <label class="text-sm text-gray-700 dark:text-gray-300">
              Employee also contributes (matching contribution)
            </label>
          </div>

          <!-- Matching Logic -->
          <div v-if="form.has_employee_match" class="ml-7 space-y-3">
            <div class="flex items-center space-x-3">
              <input
                v-model="form.match_logic"
                type="radio"
                value="equal"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              >
              <label class="text-sm text-gray-700 dark:text-gray-300">
                Equal contribution (1:1 matching)
              </label>
            </div>
            <div class="flex items-center space-x-3">
              <input
                v-model="form.match_logic"
                type="radio"
                value="percentage"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              >
              <label class="text-sm text-gray-700 dark:text-gray-300">
                Percentage-based matching
              </label>
            </div>
            <div class="flex items-center space-x-3">
              <input
                v-model="form.match_logic"
                type="radio"
                value="custom"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              >
              <label class="text-sm text-gray-700 dark:text-gray-300">
                Custom amounts (set above)
              </label>
            </div>
          </div>

          <!-- Calculation Preview -->
          <div v-if="form.calculation_method" class="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h5 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              💰 Calculation Preview (Test Salary: R10,000)
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Employer Contribution</div>
                <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {{ formatCurrency(calculationPreview.employer_amount) }}
                </div>
              </div>
              <div v-if="form.has_employee_match" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Employee Contribution</div>
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(calculationPreview.employee_amount) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Contribution</div>
                <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                  {{ formatCurrency(calculationPreview.total_amount) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Employer Contribution Info -->
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  Employer Contribution Benefits
                </h3>
                <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                  <ul class="list-disc list-inside space-y-1">
                    <li>Tax-deductible for the company</li>
                    <li>Employee benefit that doesn't count as taxable income</li>
                    <li>Helps attract and retain top talent</li>
                    <li>Automatic calculation and tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Constraints -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Amount
          </label>
          <input
            v-model.number="form.minimum_amount"
            type="number"
            step="0.01"
            min="0"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            placeholder="0.00"
          >
          <p v-if="errors.minimum_amount" class="mt-1 text-sm text-red-600">{{ errors.minimum_amount[0] }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Amount
          </label>
          <input
            v-model.number="form.maximum_amount"
            type="number"
            step="0.01"
            min="0"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
            placeholder="0.00"
          >
          <p v-if="errors.maximum_amount" class="mt-1 text-sm text-red-600">{{ errors.maximum_amount[0] }}</p>
        </div>
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Only show taxable and pensionable for allowances -->
        <div v-if="form.type === 'allowance'" class="flex items-center">
          <input
            v-model="form.is_taxable"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Taxable
          </label>
        </div>

        <div v-if="form.type === 'allowance'" class="flex items-center">
          <input
            v-model="form.is_pensionable"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Pensionable
          </label>
        </div>

        <!-- Show explanation for deductions -->
        <div v-if="form.type === 'deduction'" class="col-span-2">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Deduction Settings
                </h3>
                <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Deductions are automatically set as non-taxable and non-pensionable as they reduce taxable income.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Show explanation for employer contributions -->
        <div v-if="form.type === 'employer_contribution'" class="col-span-2">
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  Employer Contribution Settings
                </h3>
                <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Employer contributions are tax-deductible for the company and typically not taxable income for employees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.requires_approval"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          >
          <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Requires Approval
          </label>
        </div>
      </div>

        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          {{ isEdit ? 'Update Template' : 'Create Template' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useEmployerContributions } from '@/composables/useEmployerContributions'
import { formatCurrency } from '@/utils/currency'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PayrollTemplateModal',
  components: {
    XMarkIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    template: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { post, put } = useApi()
    const { showNotification } = useNotifications()
    const { previewCalculation, generateUifStyleTemplate } = useEmployerContributions()

    const loading = ref(false)
    const errors = ref({})

    const form = reactive({
      code: '',
      name: '',
      description: '',
      type: '',
      calculation_method: '',
      amount: null,
      default_percentage: null,
      formula_expression: '',
      minimum_amount: null,
      maximum_amount: null,
      is_taxable: true,
      is_pensionable: true,
      requires_approval: false,
      // Employer contribution fields
      contribution_type: 'other',
      has_employee_match: false,
      match_logic: 'equal',
      employee_match_amount: null,
      employee_match_percentage: null
    })

    const isEdit = computed(() => !!props.template)

    const calculationPreview = computed(() => {
      if (form.type === 'employer_contribution' && form.calculation_method) {
        return previewCalculation(form, 10000)
      }
      return {
        employer_amount: 0,
        employee_amount: 0,
        total_amount: 0
      }
    })

    const resetForm = () => {
      Object.keys(form).forEach(key => {
        if (typeof form[key] === 'boolean') {
          if (key === 'is_taxable' || key === 'is_pensionable') {
            form[key] = true // Default for allowances
          } else {
            form[key] = false
          }
        } else {
          form[key] = ''
        }
      })
      form.amount = null
      form.default_percentage = null
      form.minimum_amount = null
      form.maximum_amount = null
      errors.value = {}
    }

    // Watch for type changes to set appropriate defaults
    const updateTypeDefaults = () => {
      if (form.type === 'deduction') {
        form.is_taxable = false
        form.is_pensionable = false
      } else if (form.type === 'allowance') {
        form.is_taxable = true
        form.is_pensionable = true
      } else if (form.type === 'employer_contribution') {
        form.is_taxable = false
        form.is_pensionable = false
        form.contribution_type = 'other'
        form.has_employee_match = false
        form.match_logic = 'equal'
      }
    }

    const populateForm = (template) => {
      if (!template) return

      Object.keys(form).forEach(key => {
        if (template[key] !== undefined) {
          form[key] = template[key]
        }
      })
    }

    const resetCalculationFields = () => {
      form.amount = null
      form.default_percentage = null
      form.formula_expression = ''
      form.employee_match_amount = null
      form.employee_match_percentage = null
    }

    const submitForm = async () => {
      try {
        loading.value = true
        errors.value = {}

        const endpoint = isEdit.value
          ? `/payroll-templates/${props.template.uuid}`
          : '/payroll-templates'

        const method = isEdit.value ? put : post

        // Clean up form data based on calculation method and type
        const formData = { ...form }
        
        if (formData.calculation_method !== 'fixed_amount') {
          formData.amount = null
        }
        if (!formData.calculation_method.includes('percentage')) {
          formData.default_percentage = null
        }
        if (formData.calculation_method !== 'formula') {
          formData.formula_expression = ''
        }

        // Ensure deductions and employer contributions are never taxable or pensionable
        if (formData.type === 'deduction' || formData.type === 'employer_contribution') {
          formData.is_taxable = false
          formData.is_pensionable = false
        }

        // Clean up employer contribution fields when not applicable
        if (formData.type !== 'employer_contribution') {
          formData.contribution_type = null
          formData.has_employee_match = false
          formData.match_logic = null
          formData.employee_match_amount = null
          formData.employee_match_percentage = null
        }

        // Clean up employee match fields when not applicable
        if (!formData.has_employee_match) {
          formData.employee_match_amount = null
          formData.employee_match_percentage = null
        }

        await method(endpoint, formData)
        emit('saved')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors || {}
        } else {
          showNotification(
            error.response?.data?.message || 'Error saving template',
            'error'
          )
        }
      } finally {
        loading.value = false
      }
    }

    // Template application functions
    const applyUifTemplate = () => {
      const template = generateUifStyleTemplate('UIF', 'Unemployment Insurance Fund', 1.0, 14802)
      Object.keys(template).forEach(key => {
        if (form.hasOwnProperty(key)) {
          form[key] = template[key]
        }
      })
      showNotification('UIF template applied successfully', 'success')
    }

    const applyPensionTemplate = () => {
      // Basic pension template
      form.calculation_method = 'percentage_of_salary'
      form.default_percentage = 5.0
      form.contribution_type = 'pension'
      form.has_employee_match = true
      form.match_logic = 'equal'
      form.employee_match_percentage = 5.0
      form.is_taxable = false
      form.is_pensionable = false
      showNotification('Pension template applied successfully', 'success')
    }

    // Watch for template changes
    watch(() => props.template, (newTemplate) => {
      if (newTemplate) {
        populateForm(newTemplate)
      } else {
        resetForm()
      }
    }, { immediate: true })

    // Reset form when modal opens/closes
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen && !props.template) {
        resetForm()
      }
    })

    // Watch for type changes to update defaults
    watch(() => form.type, () => {
      updateTypeDefaults()
    })

    return {
      loading,
      errors,
      form,
      isEdit,
      calculationPreview,
      resetCalculationFields,
      submitForm,
      updateTypeDefaults,
      formatCurrency,
      applyUifTemplate,
      applyPensionTemplate
    }
  }
}
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}

.btn-secondary {
  @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700;
}
</style>