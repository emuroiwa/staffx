<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Employee</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Step {{ currentStep }} of {{ totalSteps }}</p>
        </div>
        <button
          @click="$emit('close')"
          data-testid="close-btn"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center text-sm font-medium"
            :class="getStepClass(index + 1)"
          >
            <span 
              class="flex items-center justify-center w-8 h-8 rounded-full mr-2"
              :class="getStepCircleClass(index + 1)"
            >
              <CheckIcon v-if="index + 1 < currentStep" class="w-4 h-4" />
              <span v-else>{{ index + 1 }}</span>
            </span>
            {{ step.title }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleNext">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="text-center mb-6">
              <UserPlusIcon class="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h4>
              <p class="text-gray-500 dark:text-gray-400">Let's start with the employee's basic details</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.first_name"
                  type="text"
                  id="first_name"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.first_name }"
                />
                <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name[0] }}</p>
              </div>

              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.last_name"
                  type="text"
                  id="last_name"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.last_name }"
                />
                <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name[0] }}</p>
              </div>

              <div>
                <label for="employee_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.employee_id"
                  type="text"
                  id="employee_id"
                  required
                  placeholder="e.g., EMP001"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.employee_id }"
                />
                <p v-if="errors.employee_id" class="mt-1 text-sm text-red-600">{{ errors.employee_id[0] }}</p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>

              <div>
                <label for="dob" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input
                  v-model="form.dob"
                  type="date"
                  id="dob"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea
                v-model="form.address"
                id="address"
                rows="3"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="Full address..."
              ></textarea>
            </div>
          </div>

          <!-- Step 2: Employment Details -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="text-center mb-6">
              <BriefcaseIcon class="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Employment Details</h4>
              <p class="text-gray-500 dark:text-gray-400">Set up the employee's role and department</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="department_uuid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.department_uuid"
                  id="department_uuid"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.department_uuid }"
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <p v-if="errors.department_uuid" class="mt-1 text-sm text-red-600">{{ errors.department_uuid[0] }}</p>
              </div>

              <div>
                <label for="position_uuid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.position_uuid"
                  id="position_uuid"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.position_uuid }"
                >
                  <option value="">Select Position</option>
                  <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                    {{ pos.name }}
                  </option>
                </select>
                <p v-if="errors.position_uuid" class="mt-1 text-sm text-red-600">{{ errors.position_uuid[0] }}</p>
              </div>

              <div>
                <label for="manager_uuid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
                <select
                  v-model="form.manager_uuid"
                  id="manager_uuid"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                >
                  <option value="">No Manager</option>
                  <option v-for="manager in potentialManagers" :key="manager.uuid" :value="manager.uuid">
                    {{ manager.first_name }} {{ manager.last_name }} ({{ manager.employee_id }})
                  </option>
                </select>
              </div>

              <div>
                <label for="employment_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.employment_type"
                  id="employment_type"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.status"
                  id="status"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :class="{ 'border-red-300': errors.status }"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
                <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status[0] }}</p>
              </div>

              <div>
                <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.start_date"
                  type="date"
                  id="start_date"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>

              <div>
                <label for="hire_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hire Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.hire_date"
                  type="date"
                  id="hire_date"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            <!-- Employment Flags -->
            <div class="space-y-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">Employment Flags</h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label class="flex items-center">
                  <input
                    v-model="form.is_director"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Director</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.is_independent_contractor"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Independent Contractor</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.is_uif_exempt"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">UIF Exempt</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 3: Compensation & Benefits -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="text-center mb-6">
              <CurrencyDollarIcon class="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Compensation & Benefits</h4>
              <p class="text-gray-500 dark:text-gray-400">Configure salary and payment details</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="salary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ selectedCurrencySymbol }}</span>
                  </div>
                  <input
                    v-model="form.salary"
                    type="number"
                    id="salary"
                    required
                    min="0"
                    step="0.01"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                    :class="{ 'border-red-300': errors.salary }"
                  />
                </div>
                <p v-if="errors.salary" class="mt-1 text-sm text-red-600">{{ errors.salary[0] }}</p>
              </div>

              <div>
                <label for="currency_uuid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                <select
                  v-model="form.currency_uuid"
                  id="currency_uuid"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                >
                  <option value="">Select Currency</option>
                  <option v-for="currency in currencies" :key="currency.uuid" :value="currency.uuid">
                    {{ currency.display_name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="pay_frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pay Frequency</label>
                <select
                  v-model="form.pay_frequency"
                  id="pay_frequency"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi_weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label for="tax_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Number</label>
                <input
                  v-model="form.tax_number"
                  type="text"
                  id="tax_number"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            <!-- Bank Details -->
            <div class="space-y-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">Bank Details</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="bank_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                  <input
                    v-model="form.bank_details.bank_name"
                    type="text"
                    id="bank_name"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label for="account_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                  <input
                    v-model="form.bank_details.account_number"
                    type="text"
                    id="account_number"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label for="routing_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Routing Number</label>
                  <input
                    v-model="form.bank_details.routing_number"
                    type="text"
                    id="routing_number"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label for="account_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                  <select
                    v-model="form.bank_details.account_type"
                    id="account_type"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Additional Information -->
          <div v-if="currentStep === 4" class="space-y-6">
            <div class="text-center mb-6">
              <DocumentTextIcon class="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h4>
              <p class="text-gray-500 dark:text-gray-400">Complete the employee profile</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="national_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">National ID</label>
                <input
                  v-model="form.national_id"
                  type="text"
                  id="national_id"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>

              <div>
                <label for="passport_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport Number</label>
                <input
                  v-model="form.passport_number"
                  type="text"
                  id="passport_number"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>

              <div>
                <label for="emergency_contact_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  v-model="form.emergency_contact_name"
                  type="text"
                  id="emergency_contact_name"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>

              <div>
                <label for="emergency_contact_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  v-model="form.emergency_contact_phone"
                  type="tel"
                  id="emergency_contact_phone"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            <!-- Benefits -->
            <div class="space-y-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">Benefits</h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label class="flex items-center">
                  <input
                    v-model="form.benefits.health_insurance"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Health Insurance</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.benefits.dental_insurance"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Dental Insurance</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.benefits.retirement_plan"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Retirement Plan</span>
                </label>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea
                v-model="form.notes"
                id="notes"
                rows="4"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200"
                placeholder="Additional notes about the employee..."
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          v-if="currentStep > 1"
          @click="goToPreviousStep"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Previous
        </button>
        <div v-else></div>

        <div class="flex items-center space-x-3">
          <button
            @click="$emit('close')"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            v-if="currentStep < totalSteps"
            @click="goToNextStep"
            type="button"
            class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
            :disabled="!canProceed"
          >
            Next
            <ArrowRightIcon class="w-4 h-4 ml-2" />
          </button>
          <button
            v-else
            @click="submitForm"
            type="button"
            class="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
            :disabled="submitting"
          >
            <span v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Create Employee
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'
import { useCurrencyStore } from '@/stores/currency'
import { useTheme } from '@/composables/useTheme'
import {
  XMarkIcon,
  CheckIcon,
  UserPlusIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'created'])

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()
const currencyStore = useCurrencyStore()
const { isDark } = useTheme()

// Component state
const currentStep = ref(1)
const totalSteps = 4
const submitting = ref(false)
const errors = ref({})

// Reference data
const departments = ref([])
const positions = ref([])
const potentialManagers = ref([])
const currencies = computed(() => currencyStore.activeCurrencies)

// Steps configuration
const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Employment' },
  { id: 3, title: 'Compensation' },
  { id: 4, title: 'Additional' }
]

// Form data
const form = reactive({
  first_name: '',
  last_name: '',
  employee_id: '',
  email: '',
  phone: '',
  address: '',
  dob: '',
  department_uuid: '',
  position_uuid: '',
  manager_uuid: '',
  employment_type: 'full_time',
  status: 'active',
  start_date: '',
  hire_date: '',
  is_director: false,
  is_independent_contractor: false,
  is_uif_exempt: false,
  salary: '',
  currency_uuid: '',
  pay_frequency: 'monthly',
  tax_number: '',
  national_id: '',
  passport_number: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  bank_details: {
    bank_name: '',
    account_number: '',
    routing_number: '',
    account_type: 'checking'
  },
  benefits: {
    health_insurance: false,
    dental_insurance: false,
    retirement_plan: false
  },
  notes: ''
})

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.first_name && form.last_name && form.employee_id && form.email
    case 2:
      return form.department_uuid && form.position_uuid && form.employment_type && form.status && form.start_date && form.hire_date
    case 3:
      return form.salary
    case 4:
      return true
    default:
      return false
  }
})

const selectedCurrencySymbol = computed(() => {
  if (form.currency_uuid) {
    const currency = currencyStore.getCurrencyByUuid(form.currency_uuid)
    return currency?.symbol || '$'
  }
  return '$'
})

// Methods
const getStepClass = (stepNumber) => {
  if (stepNumber < currentStep.value) {
    return 'text-green-600'
  } else if (stepNumber === currentStep.value) {
    return 'text-blue-600'
  } else {
    return 'text-gray-400'
  }
}

const getStepCircleClass = (stepNumber) => {
  if (stepNumber < currentStep.value) {
    return 'bg-green-600 text-white'
  } else if (stepNumber === currentStep.value) {
    return 'bg-blue-600 text-white'
  } else {
    return 'bg-gray-200 text-gray-600'
  }
}

const goToNextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
    if (currentStep.value === 3) {
      // Load potential managers when reaching employment step
      fetchPotentialManagers()
    }
  }
}

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const fetchDepartments = async () => {
  try {
    const response = await employeeStore.fetchDepartments()
    departments.value = response.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  }
}

const fetchPositions = async () => {
  try {
    const response = await employeeStore.fetchPositions()
    positions.value = response.data
  } catch (error) {
    console.error('Failed to fetch positions:', error)
  }
}

const fetchPotentialManagers = async () => {
  try {
    const response = await employeeStore.fetchPotentialManagers()
    potentialManagers.value = response.data
  } catch (error) {
    console.error('Failed to fetch potential managers:', error)
  }
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await employeeStore.createEmployee(form)
    emit('created')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
      // Go back to the step with errors
      if (errors.value.first_name || errors.value.last_name || errors.value.employee_id || errors.value.email) {
        currentStep.value = 1
      } else if (errors.value.department_uuid || errors.value.position_uuid || errors.value.status || errors.value.employment_type) {
        currentStep.value = 2
      } else if (errors.value.salary) {
        currentStep.value = 3
      }
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create employee. Please try again.'
      })
    }
  } finally {
    submitting.value = false
  }
}

// Set default dates
const setDefaultDates = () => {
  const today = new Date().toISOString().split('T')[0]
  form.start_date = today
  form.hire_date = today
}

// Lifecycle
onMounted(() => {
  fetchDepartments()
  fetchPositions()
  fetchCurrencies()
  setDefaultDates()
  setDefaultCurrency()
})

const fetchCurrencies = async () => {
  try {
    await currencyStore.fetchCurrencies()
  } catch (error) {
    console.error('Failed to fetch currencies:', error)
  }
}

const setDefaultCurrency = () => {
  // Set USD as default if available
  const usdCurrency = currencyStore.getCurrencyByCode('USD')
  if (usdCurrency) {
    form.currency_uuid = usdCurrency.uuid
  }
}
</script>