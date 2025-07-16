<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
      <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ garnishment ? 'Edit Garnishment' : 'Create Garnishment' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">Basic Information</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Garnishment Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Child Support - Case #12345"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code *
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., CS-12345"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Garnishment Type *
              </label>
              <select
                v-model="form.garnishment_type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @change="onGarnishmentTypeChange"
              >
                <option value="">Select Type</option>
                <option v-for="(label, value) in garnishmentTypes" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Order
              </label>
              <input
                v-model.number="form.priority_order"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="1 = Highest Priority"
              />
            </div>
          </div>

          <!-- Legal Information -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">Legal Information</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Court Order Number
              </label>
              <input
                v-model="form.court_order_number"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Court order or reference number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Garnishment Authority
              </label>
              <input
                v-model="form.garnishment_authority"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Family Court, IRS, etc."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Legal Reference
              </label>
              <textarea
                v-model="form.legal_reference"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Legal statute or case reference"
              />
            </div>
          </div>

          <!-- Calculation Method -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">Calculation Method</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calculation Method *
              </label>
              <select
                v-model="form.calculation_method"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @change="onCalculationMethodChange"
              >
                <option value="">Select Method</option>
                <option v-for="(label, value) in calculationMethods" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </div>

            <div v-if="['fixed_amount', 'manual'].includes(form.calculation_method)">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div v-if="['percentage_of_salary', 'percentage_of_basic'].includes(form.calculation_method)">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Percentage *
              </label>
              <input
                v-model.number="form.percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div v-if="form.calculation_method === 'formula'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formula Expression *
              </label>
              <textarea
                v-model="form.formula_expression"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., ({basic_salary} * 0.25) + 50"
              />
              <p class="text-sm text-gray-500 mt-1">
                Available variables: {basic_salary}, {gross_salary}, {years_of_service}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Percentage (of disposable income)
              </label>
              <input
                v-model.number="form.maximum_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Leave blank for legal defaults"
              />
            </div>
          </div>

          <!-- Dates and Total Amount -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">Duration & Amount</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                v-model="form.garnishment_start_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                v-model="form.garnishment_end_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Amount to Garnish
              </label>
              <input
                v-model.number="form.total_amount_to_garnish"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Leave blank for ongoing garnishment"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">Contact Information</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name
              </label>
              <input
                v-model="form.contact_information.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                v-model="form.contact_information.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="form.contact_information.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Email address"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                v-model="form.contact_information.address"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Mailing address"
              />
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="form.calculation_method" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Calculation Preview</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">Calculated Amount</p>
              <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {{ formatCurrency(preview.calculated_amount) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">Maximum Allowable</p>
              <p class="text-lg font-semibold text-green-600 dark:text-green-400">
                {{ formatCurrency(preview.maximum_allowable) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">% of Disposable Income</p>
              <p class="text-lg font-semibold text-purple-600 dark:text-purple-400">
                {{ preview.percentage_of_disposable?.toFixed(2) || 0 }}%
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="calculatePreview"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Recalculate Preview
          </button>
        </div>

        <!-- Notes -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Additional notes or instructions"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Saving...' : (garnishment ? 'Update' : 'Create') }} Garnishment
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  garnishment: {
    type: Object,
    default: null
  },
  employeeUuid: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const { get, post, put } = useApi()
const { showNotification } = useNotifications()

const loading = ref(false)
const garnishmentTypes = ref({})
const calculationMethods = ref({})
const preview = ref({
  calculated_amount: 0,
  maximum_allowable: 0,
  percentage_of_disposable: 0
})

const form = reactive({
  name: '',
  code: '',
  garnishment_type: '',
  calculation_method: '',
  amount: null,
  percentage: null,
  formula_expression: '',
  court_order_number: '',
  garnishment_authority: '',
  maximum_percentage: null,
  priority_order: null,
  garnishment_start_date: '',
  garnishment_end_date: '',
  total_amount_to_garnish: null,
  contact_information: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  legal_reference: '',
  notes: ''
})

const fetchOptions = async () => {
  try {
    const response = await get('/garnishments/options')
    garnishmentTypes.value = response.data.data.garnishment_types
    calculationMethods.value = response.data.data.calculation_methods
  } catch (error) {
    showNotification('Error fetching options', 'error')
  }
}

const calculatePreview = async () => {
  if (!form.calculation_method || !form.garnishment_type) return

  try {
    const response = await post(`/employees/${props.employeeUuid}/garnishments/calculate-preview`, {
      calculation_method: form.calculation_method,
      amount: form.amount,
      percentage: form.percentage,
      formula_expression: form.formula_expression,
      garnishment_type: form.garnishment_type,
      maximum_percentage: form.maximum_percentage
    })
    
    preview.value = response.data.data
  } catch (error) {
    showNotification('Error calculating preview', 'error')
  }
}

const onGarnishmentTypeChange = () => {
  calculatePreview()
}

const onCalculationMethodChange = () => {
  // Reset form fields based on calculation method
  form.amount = null
  form.percentage = null
  form.formula_expression = ''
  calculatePreview()
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    code: '',
    garnishment_type: '',
    calculation_method: '',
    amount: null,
    percentage: null,
    formula_expression: '',
    court_order_number: '',
    garnishment_authority: '',
    maximum_percentage: null,
    priority_order: null,
    garnishment_start_date: '',
    garnishment_end_date: '',
    total_amount_to_garnish: null,
    contact_information: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    legal_reference: '',
    notes: ''
  })
  
  preview.value = {
    calculated_amount: 0,
    maximum_allowable: 0,
    percentage_of_disposable: 0
  }
}

const populateForm = () => {
  if (props.garnishment) {
    Object.assign(form, {
      name: props.garnishment.name || '',
      code: props.garnishment.code || '',
      garnishment_type: props.garnishment.garnishment_type || '',
      calculation_method: props.garnishment.calculation_method || '',
      amount: props.garnishment.amount || null,
      percentage: props.garnishment.percentage || null,
      formula_expression: props.garnishment.formula_expression || '',
      court_order_number: props.garnishment.court_order_number || '',
      garnishment_authority: props.garnishment.garnishment_authority || '',
      maximum_percentage: props.garnishment.maximum_percentage || null,
      priority_order: props.garnishment.priority_order || null,
      garnishment_start_date: props.garnishment.garnishment_start_date || '',
      garnishment_end_date: props.garnishment.garnishment_end_date || '',
      total_amount_to_garnish: props.garnishment.total_amount_to_garnish || null,
      contact_information: props.garnishment.contact_information || {
        name: '',
        phone: '',
        email: '',
        address: ''
      },
      legal_reference: props.garnishment.legal_reference || '',
      notes: props.garnishment.notes || ''
    })
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    const payload = { ...form }
    
    let response
    if (props.garnishment) {
      response = await put(`/garnishments/${props.garnishment.uuid}`, payload)
    } else {
      response = await post(`/employees/${props.employeeUuid}/garnishments`, payload)
    }
    
    showNotification(
      props.garnishment ? 'Garnishment updated successfully' : 'Garnishment created successfully',
      'success'
    )
    
    emit('saved', response.data.data)
    closeModal()
  } catch (error) {
    showNotification(
      error.response?.data?.message || 'Error saving garnishment',
      'error'
    )
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

// Watch for form changes to recalculate preview
watch([
  () => form.calculation_method,
  () => form.amount,
  () => form.percentage,
  () => form.formula_expression,
  () => form.garnishment_type,
  () => form.maximum_percentage
], () => {
  if (form.calculation_method && form.garnishment_type) {
    calculatePreview()
  }
}, { deep: true })

onMounted(() => {
  fetchOptions()
  if (props.garnishment) {
    populateForm()
  }
})

// Watch for prop changes
watch(() => props.garnishment, () => {
  if (props.garnishment) {
    populateForm()
  } else {
    resetForm()
  }
}, { deep: true })
</script>