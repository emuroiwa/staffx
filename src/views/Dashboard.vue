<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Good Morning, {{ authStore.user?.name?.split(' ')[0] }}!
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your team today.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <select class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
          Export Report
        </button>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="metric in metrics"
        :key="metric.title"
        class="metric-card"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ metric.title }}
            </p>
            <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {{ metric.value }}
            </p>
          </div>
          <div :class="[
            'p-3 rounded-full',
            metric.iconBg
          ]">
            <component :is="metric.icon" :class="[
              'w-6 h-6',
              metric.iconColor
            ]" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="[
            'text-sm font-medium',
            metric.changeColor
          ]">
            {{ metric.change }}
          </span>
          <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
            {{ metric.changeText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Employee Overview Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Employee Overview
          </h3>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            View Details
          </button>
        </div>
        
        <!-- Simple Chart Placeholder -->
        <div class="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-400">Chart Visualization</p>
          </div>
        </div>
        
        <!-- Chart Legend -->
        <div class="mt-4 flex items-center justify-center space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Full-Time</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Part-Time</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Contract</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            View All
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              activity.iconBg
            ]">
              <component :is="activity.icon" :class="[
                'w-4 h-4',
                activity.iconColor
              ]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Positions & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Open Positions -->
      <div class="lg:col-span-2 card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Open Positions
          </h3>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Manage Positions
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="position in openPositions"
            :key="position.id"
            class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ position.title }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ position.department }}
                </p>
              </div>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                position.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                position.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              ]">
                {{ position.urgency }} priority
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ position.applicants }} applicants
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ position.timeOpen }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        
        <div class="space-y-3">
          <button
            v-for="action in quickActions"
            :key="action.name"
            @click="handleQuickAction(action.name)"
            class="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center',
              action.iconBg
            ]">
              <component :is="action.icon" :class="[
                'w-4 h-4',
                action.iconColor
              ]" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ action.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ action.description }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Users,
  UserPlus,
  CreditCard,
  TrendingUp,
  BarChart3,
  UserCheck,
  Calendar,
  FileText,
  Settings,
  MessageSquare,
  Clock
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Dashboard metrics
const metrics = ref([
  {
    title: 'Total Employees',
    value: '678',
    change: '+14%',
    changeText: 'vs last month',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: Users,
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Job Applications',
    value: '80%',
    change: '-5%',
    changeText: 'vs last month',
    changeColor: 'text-red-600 dark:text-red-400',
    icon: UserPlus,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Pending Approvals',
    value: '30',
    change: '+18',
    changeText: 'new this week',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: Clock,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    title: 'Payroll',
    value: '75%',
    change: '+25%',
    changeText: 'completion rate',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: CreditCard,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
])

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    title: 'New employee onboarding completed for John Doe',
    time: '2 hours ago',
    icon: UserCheck,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 2,
    title: 'Monthly team meeting scheduled',
    time: '4 hours ago',
    icon: Calendar,
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 3,
    title: 'Payroll processing initiated',
    time: '6 hours ago',
    icon: CreditCard,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 4,
    title: 'New job posting published',
    time: '1 day ago',
    icon: FileText,
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
])

// Open positions
const openPositions = ref([
  {
    id: 1,
    title: 'UX/UI Designer',
    department: 'Design',
    urgency: 'high',
    applicants: 12,
    timeOpen: '2 weeks'
  },
  {
    id: 2,
    title: 'Backend Developer',
    department: 'Engineering',
    urgency: 'medium',
    applicants: 8,
    timeOpen: '1 week'
  },
  {
    id: 3,
    title: 'HR Specialist',
    department: 'Human Resources',
    urgency: 'low',
    applicants: 15,
    timeOpen: '3 weeks'
  },
  {
    id: 4,
    title: 'Marketing Manager',
    department: 'Marketing',
    urgency: 'medium',
    applicants: 6,
    timeOpen: '4 days'
  }
])

// Quick actions
const quickActions = ref([
  {
    name: 'add-employee',
    title: 'Add Employee',
    description: 'Create new employee profile',
    icon: UserPlus,
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'process-payroll',
    title: 'Process Payroll',
    description: 'Run monthly payroll',
    icon: CreditCard,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'schedule-meeting',
    title: 'Schedule Meeting',
    description: 'Plan team meetings',
    icon: Calendar,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'send-announcement',
    title: 'Send Announcement',
    description: 'Company-wide message',
    icon: MessageSquare,
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
])

// Methods
function handleQuickAction(actionName) {
  switch (actionName) {
    case 'add-employee':
      router.push('/employees?action=add')
      break
    case 'process-payroll':
      router.push('/payroll')
      break
    case 'schedule-meeting':
      // Open calendar or meeting scheduler
      console.log('Schedule meeting')
      break
    case 'send-announcement':
      // Open announcement composer
      console.log('Send announcement')
      break
    default:
      console.log('Unknown action:', actionName)
  }
}
</script>