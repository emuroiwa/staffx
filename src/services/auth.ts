import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  company: string
  country_uuid: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  name: string
  company?: string
}

export interface User {
  uuid: string
  id?: number // Kept for backward compatibility with existing foreign keys
  name: string
  email: string
  role: string
  company_uuid?: string
  default_company_uuid?: string
  company_id?: number // Backward compatibility
  default_company_id?: number // Backward compatibility
  company?: string // Backward compatibility
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
    company?: any
  }
}

export interface EmailVerificationError {
  success: false
  message: string
  requires_verification: true
}

export interface SubscriptionExpiredError {
  success: false
  message: string
  subscription_expired: true
}

export interface UserResponse {
  success: boolean
  data: {
    user: User
  }
}

export interface MessageResponse {
  success: boolean
  message: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData)
    return response.data
  }

  async logout(): Promise<MessageResponse> {
    const response = await api.post('/auth/logout')
    return response.data
  }

  async getMe(): Promise<UserResponse> {
    const response = await api.get('/auth/me')
    return response.data
  }

  async refresh(): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh')
    return response.data
  }

  async updateProfile(data: UpdateProfileData): Promise<UserResponse> {
    const response = await api.put('/auth/profile', data)
    return response.data
  }

  async forgotPassword(data: ForgotPasswordData): Promise<MessageResponse> {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
  }

  async resetPassword(data: ResetPasswordData): Promise<MessageResponse> {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  }

  async resendEmailVerification(): Promise<MessageResponse> {
    const response = await api.post('/auth/email/resend')
    return response.data
  }
}

export default new AuthService()