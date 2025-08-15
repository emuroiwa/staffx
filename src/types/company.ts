export interface Company {
  uuid: string
  id?: number // Backward compatibility
  created_by_uuid: string
  created_by?: number // Backward compatibility
  name: string
  slug: string
  domain?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  website?: string
  tax_id?: string
  logo_path?: string | null
  subscription_expires_at?: string | null
  is_active: boolean
  settings?: CompanySettings
  created_at: string
  updated_at: string
  creator?: User
  users?: User[]
  employees?: Employee[]
}

export interface CompanyStats {
  total_employees: number
  active_employees: number
  total_users: number
  departments: number
  recent_payrolls: number
  company_status: {
    is_active: boolean
    has_active_subscription: boolean
    subscription_expires_at?: string | null
  }
}

export interface User {
  uuid: string
  id?: number // Backward compatibility
  name: string
  email: string
  role: 'holding_company_admin' | 'admin' | 'manager' | 'hr' | 'employee'
  company_uuid?: string
  default_company_uuid?: string
  company_id?: number // Backward compatibility
  default_company_id?: number // Backward compatibility
  trial_expires_at?: string | null // Will be deprecated in favor of company-level subscription
  avatar?: string
  created_at: string
  updated_at: string
}

export interface CompanySettings {
  // General settings
  default_currency?: string
  timezone?: string
  date_format?: string
  
  // Payroll settings
  pay_frequency?: 'weekly' | 'bi_weekly' | 'monthly' | 'semi_monthly'
  pay_period_start_day?: number
  default_work_hours?: number
  overtime_threshold_hours?: number
  default_overtime_multiplier?: number
  require_overtime_approval?: boolean
  enable_time_tracking?: boolean
  
  // Employee settings
  auto_generate_employee_id?: boolean
  employee_id_prefix?: string
  require_manager_approval?: boolean
  
  // Notification settings
  email_notifications?: boolean
  payroll_reminder_days?: number
  
  // Security settings
  require_two_factor?: boolean
  password_expiry_days?: number
  session_timeout_minutes?: number
  
  // Appearance settings
  brand_color?: string
  theme?: 'light' | 'dark' | 'auto'
  
  // Integration settings
  integrations?: {
    [key: string]: any
  }
}

export interface Currency {
  uuid: string
  code: string
  name: string
  symbol: string
  display_name: string
  exchange_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  uuid?: string
  company_id: number
  company_uuid?: string
  user_id?: number | null
  user_uuid?: string | null
  employee_id: string
  first_name: string
  last_name: string
  email?: string | null
  phone?: string | null
  department?: string | null
  position?: string | null
  employment_type?: 'salaried' | 'hourly' | 'contract' | null
  salary?: number | null // For salaried: monthly salary, for hourly: hourly rate
  hourly_rate?: number | null // Alias for salary when employment_type is hourly
  currency_uuid?: string | null
  currency?: Currency | null
  formatted_salary?: string
  hire_date?: string | null
  start_date?: string | null
  termination_date?: string | null
  status: 'active' | 'inactive' | 'terminated'
  work_schedule?: WorkSchedule | null
  overtime_eligible?: boolean
  overtime_rate_multiplier?: number
  pay_frequency?: 'weekly' | 'bi_weekly' | 'monthly' | 'semi_monthly'
  created_at: string
  updated_at: string
  user?: any
  company?: Company
  payrolls?: Payroll[]
  work_hours?: WorkHours[]
}

export interface Payroll {
  id: number
  uuid?: string
  company_id: number
  company_uuid?: string
  employee_id: number
  employee_uuid?: string
  pay_period_start: string
  pay_period_end: string
  payroll_period_start?: string
  payroll_period_end?: string
  employment_type?: string
  basic_salary?: number
  gross_pay: number
  gross_salary?: number
  net_pay: number
  net_salary?: number
  total_allowances?: number
  total_deductions?: number
  total_statutory_deductions?: number
  total_garnishments?: number
  total_employer_contributions?: number
  disposable_income?: number
  tax_deductions?: number | null
  other_deductions?: number | null
  overtime_hours?: number | null
  overtime_pay?: number | null
  status: 'draft' | 'approved' | 'processed' | 'paid'
  notes?: string | null
  calculation_details?: PayrollCalculationDetails
  payroll_items?: PayrollItems
  calculation_date?: string
  errors?: string[]
  created_at: string
  updated_at: string
  employee?: Employee
  company?: Company
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Enhanced payroll calculation types
export interface PayrollCalculationDetails {
  employment_type: string
  period_days: number
  // For hourly employees
  hourly_rate?: number
  total_hours?: number
  regular_hours?: number
  overtime_hours?: number
  overtime_multiplier?: number
  regular_pay?: number
  overtime_pay?: number
  working_days?: number
  // For salaried employees
  monthly_salary?: number
  days_in_month?: number
  days_in_period?: number
  is_partial_month?: boolean
  proration_factor?: number
}

export interface PayrollItems {
  allowances: {
    company: PayrollItem[]
    employee: PayrollItem[]
  }
  deductions: {
    company: PayrollItem[]
    statutory: PayrollItem[]
    employee: PayrollItem[]
    garnishments: PayrollItem[]
  }
  employer_contributions: {
    company: PayrollItem[]
  }
}

export interface PayrollItem {
  uuid?: string
  template_uuid?: string
  item_uuid?: string
  code: string
  name: string
  type: 'allowance' | 'deduction' | 'employer_contribution'
  amount: number
  calculation_method?: string
  calculation_details?: any
}

export interface WorkSchedule {
  id?: number
  uuid?: string
  employee_uuid: string
  name: string
  monday_hours?: number
  tuesday_hours?: number
  wednesday_hours?: number
  thursday_hours?: number
  friday_hours?: number
  saturday_hours?: number
  sunday_hours?: number
  weekly_hours: number
  is_active: boolean
  effective_from: string
  effective_to?: string | null
  created_at?: string
  updated_at?: string
}

export interface WorkHours {
  id?: number
  uuid?: string
  employee_uuid: string
  date: string
  clock_in?: string | null
  clock_out?: string | null
  break_duration?: number // in minutes
  total_hours: number
  regular_hours: number
  overtime_hours: number
  status: 'pending' | 'approved' | 'rejected'
  notes?: string | null
  approved_by?: string | null
  approved_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface OvertimeRequest {
  id?: number
  uuid?: string
  employee_uuid: string
  date: string
  requested_hours: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requested_by: string
  reviewed_by?: string | null
  reviewed_at?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
  employee?: Employee
}

export interface TimeEntry {
  id?: number
  uuid?: string
  employee_uuid: string
  date: string
  start_time: string
  end_time?: string | null
  break_start?: string | null
  break_end?: string | null
  total_hours?: number
  description?: string
  project?: string
  task?: string
  status: 'active' | 'completed' | 'approved'
  created_at?: string
  updated_at?: string
}