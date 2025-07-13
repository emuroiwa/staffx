<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Organogram</h1>
            <p class="mt-1 text-sm text-gray-500">Organizational structure and reporting relationships</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="expandAll"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Expand All
            </button>
            <button
              @click="collapseAll"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <MinusIcon class="w-4 h-4 mr-2" />
              Collapse All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Organogram Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="text-center py-12">
          <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Organogram Coming Soon</h3>
          <p class="mt-1 text-sm text-gray-500">
            The organizational chart will be displayed here showing the complete company structure.
          </p>
          <div class="mt-6">
            <div class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500">
              <UserIcon class="w-4 h-4 mr-2" />
              Interactive org chart with employee details
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Employees</p>
              <p class="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BuildingOfficeIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Departments</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex-shrink-0">
            <StarIcon class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Management Levels</p>
            <p class="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChartBarIcon,
  PlusIcon,
  MinusIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

const expandAll = () => {
  console.log('Expanding all nodes')
}

const collapseAll = () => {
  console.log('Collapsing all nodes')
}
</script>