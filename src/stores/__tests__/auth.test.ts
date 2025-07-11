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
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
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
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        created_at: '2024-01-01T00:00:00.000000Z',
        updated_at: '2024-01-01T00:00:00.000000Z',
      }

      expect(authStore.userDisplayName).toBe('John Doe')
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
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Example Corp',
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
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const authStore = useAuthStore()
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'mock-token',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Example Corp',
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
      expect(result).toEqual(mockResponse.data.user)
    })
  })

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const authStore = useAuthStore()
      
      // Set initial authenticated state
      authStore.isAuthenticated = true
      authStore.user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
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