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
  company_id: number
  user_id?: number | null
  employee_id: string
  first_name: string
  last_name: string
  email?: string | null
  phone?: string | null
  department?: string | null
  position?: string | null
  employment_type?: 'full_time' | 'part_time' | 'contract' | null
  salary?: number | null
  currency_uuid?: string | null
  currency?: Currency | null
  formatted_salary?: string
  hire_date?: string | null
  termination_date?: string | null
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  updated_at: string
  user?: any
  company?: Company
  payrolls?: Payroll[]
}

export interface Payroll {
  id: number
  company_id: number
  employee_id: number
  pay_period_start: string
  pay_period_end: string
  gross_pay: number
  net_pay: number
  tax_deductions?: number | null
  other_deductions?: number | null
  overtime_hours?: number | null
  overtime_pay?: number | null
  status: 'draft' | 'processed' | 'paid'
  notes?: string | null
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