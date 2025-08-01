import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import authService from '../../services/auth'

// Mock the auth service
vi.mock('../../services/auth')

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const authStore = useAuthStore()

      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.loading).toBe(false)
    })
  })

  describe('getters', () => {
    it('should return correct user initials', () => {
      const authStore = useAuthStore()
      
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee',
        company: 'Example Corp',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      expect(authStore.userInitials).toBe('JD')
    })

    it('should return U for unknown user', () => {
      const authStore = useAuthStore()
      expect(authStore.userInitials).toBe('U')
    })

    it('should return correct display name', () => {
      const authStore = useAuthStore()
      
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee',
        company: 'Example Corp',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      expect(authStore.userDisplayName).toBe('John Doe')
    })

    it('should identify holding company admin correctly', () => {
      const authStore = useAuthStore()
      
      // Test HCA user
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'holding_company_admin',
        trial_expires_at: '2024-12-31T23:59:59.000Z',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      expect(authStore.isHoldingCompanyAdmin).toBe(true)

      // Test non-HCA user
      authStore.user.role = 'admin'
      expect(authStore.isHoldingCompanyAdmin).toBe(false)
    })

    it('should handle subscription status (now managed at company level)', () => {
      const authStore = useAuthStore()
      
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'holding_company_admin',
        company_id: 1,
        default_company_id: 1,
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      // Subscription status is now managed at company level via API
      // These methods return null for backward compatibility
      expect(authStore.hasActiveTrial).toBeNull()
      expect(authStore.trialDaysLeft).toBe(0)
      expect(authStore.trialStatus).toBeNull()

      // Test non-HCA user
      authStore.user.role = 'admin'
      expect(authStore.trialStatus).toBeNull()
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const authStore = useAuthStore()
      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-token',
          user: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
          },
        },
      }

      vi.mocked(authService.login).mockResolvedValueOnce(mockResponse)

      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = await authStore.login(credentials)

      expect(authService.login).toHaveBeenCalledWith(credentials)
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.user).toEqual(mockResponse.data.user)
      expect(localStorage.getItem('authToken')).toBe('mock-token')
      expect(result).toEqual(mockResponse.data.user)
    })

    it('should handle login error', async () => {
      const authStore = useAuthStore()
      const mockError = new Error('Invalid credentials')

      vi.mocked(authService.login).mockRejectedValueOnce(mockError)

      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      }

      await expect(authStore.login(credentials)).rejects.toThrow('Invalid credentials')
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
    })

    it('should handle email verification error', async () => {
      const authStore = useAuthStore()
      const mockError = {
        response: {
          data: {
            message: 'Email not verified. Please check your email for a verification link.',
            requires_verification: true,
          },
        },
      }

      vi.mocked(authService.login).mockRejectedValueOnce(mockError)

      const credentials = {
        email: 'unverified@example.com',
        password: 'password123',
      }

      try {
        await authStore.login(credentials)
      } catch (error: any) {
        expect(error.requiresVerification).toBe(true)
        expect(error.message).toBe('Email not verified. Please check your email for a verification link.')
        expect(localStorage.getItem('unverifiedEmail')).toBe('unverified@example.com')
      }

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
    })

    it('should handle subscription expired error for HCA user', async () => {
      const authStore = useAuthStore()
      const mockError = {
        response: {
          data: {
            message: 'Your subscription has expired. Please upgrade to continue using the system.',
            subscription_expired: true,
          },
        },
      }

      vi.mocked(authService.login).mockRejectedValueOnce(mockError)

      const credentials = {
        email: 'hca@example.com',
        password: 'password123',
      }

      try {
        await authStore.login(credentials)
      } catch (error: any) {
        expect(error.subscriptionExpired).toBe(true)
        expect(error.message).toBe('Your subscription has expired. Please upgrade to continue using the system.')
      }

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
    })

    it('should handle subscription expired error for regular user', async () => {
      const authStore = useAuthStore()
      const mockError = {
        response: {
          data: {
            message: 'Your company\'s subscription has expired. Please contact your administrator.',
            subscription_expired: true,
          },
        },
      }

      vi.mocked(authService.login).mockRejectedValueOnce(mockError)

      const credentials = {
        email: 'employee@example.com',
        password: 'password123',
      }

      try {
        await authStore.login(credentials)
      } catch (error: any) {
        expect(error.subscriptionExpired).toBe(true)
        expect(error.message).toBe('Your company\'s subscription has expired. Please contact your administrator.')
      }

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
    })
  })

  describe('register', () => {
    it('should register user successfully with company creation', async () => {
      const authStore = useAuthStore()
      
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'mock-token',
          user: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'holding_company_admin',
            company_uuid: '987fcdeb-51a2-43d1-9c67-123456789abc',
            default_company_uuid: '987fcdeb-51a2-43d1-9c67-123456789abc',
            company_id: 1,
            default_company_id: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
          },
          company: {
            uuid: '987fcdeb-51a2-43d1-9c67-123456789abc',
            id: 1,
            name: 'Example Corp',
            slug: 'example-corp',
            created_by_uuid: '123e4567-e89b-12d3-a456-426614174000',
            created_by: 1,
            is_active: true,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
          },
        },
      }

      vi.mocked(authService.register).mockResolvedValueOnce(mockResponse)

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        password: 'password123',
      }

      const result = await authStore.register(userData)

      expect(authService.register).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        password: 'password123',
        password_confirmation: 'password123',
      })
      expect(authStore.isAuthenticated).toBe(true)
      expect(result.user).toEqual(mockResponse.data.user)
      expect(result.company).toEqual(mockResponse.data.company)
      expect(result.user.role).toBe('holding_company_admin')
      expect(result.user.default_company_id).toBe(1)
      expect(result.company.name).toBe('Example Corp')
    })
  })

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const authStore = useAuthStore()
      
      // Set initial authenticated state
      authStore.isAuthenticated = true
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        company: 'Example Corp',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }
      localStorage.setItem('authToken', 'mock-token')

      vi.mocked(authService.logout).mockResolvedValueOnce({
        success: true,
        message: 'Logout successful',
      })

      await authStore.logout()

      expect(authService.logout).toHaveBeenCalled()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('authToken')).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const authStore = useAuthStore()
      
      // Set initial user
      authStore.user = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Old Company',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      const mockResponse = {
        success: true,
        data: {
          user: {
            id: 1,
            name: 'Jane Smith',
            email: 'john@example.com',
            company: 'New Company',
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
          },
        },
      }

      vi.mocked(authService.updateProfile).mockResolvedValueOnce(mockResponse)

      const updateData = {
        name: 'Jane Smith',
        company: 'New Company',
      }

      const result = await authStore.updateProfile(updateData)

      expect(authService.updateProfile).toHaveBeenCalledWith(updateData)
      expect(authStore.user).toEqual(mockResponse.data.user)
      expect(result).toEqual(mockResponse.data.user)
    })
  })

  describe('initializeAuth', () => {
    it('should initialize auth from localStorage', async () => {
      const authStore = useAuthStore()
      const mockUser = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('isAuthenticated', 'true')

      vi.mocked(authService.getMe).mockResolvedValueOnce({
        success: true,
        data: { user: mockUser },
      })

      await authStore.initializeAuth()

      expect(authService.getMe).toHaveBeenCalled()
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.user).toEqual(mockUser)
    })

    it('should clear auth if token is invalid', async () => {
      const authStore = useAuthStore()

      localStorage.setItem('authToken', 'invalid-token')
      localStorage.setItem('user', JSON.stringify({ name: 'John' }))
      localStorage.setItem('isAuthenticated', 'true')

      vi.mocked(authService.getMe).mockRejectedValueOnce(new Error('Unauthorized'))

      await authStore.initializeAuth()

      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('authToken')).toBeNull()
    })
  })
})