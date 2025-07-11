import { describe, it, expect, vi, beforeEach } from 'vitest'
import authService from '../auth'
import api from '../api'

// Mock the api module
vi.mock('../api')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockResponse = {
        data: {
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
        },
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = await authService.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse.data)
      expect(result.success).toBe(true)
      expect(result.data.user.email).toBe('john@example.com')
    })

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid credentials',
          },
          status: 401,
        },
      }

      vi.mocked(api.post).mockRejectedValueOnce(mockError)

      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      }

      await expect(authService.login(credentials)).rejects.toEqual(mockError)
    })
  })

  describe('register', () => {
    it('should register new user', async () => {
      const mockResponse = {
        data: {
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
        },
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Example Corp',
        password: 'password123',
        password_confirmation: 'password123',
      }

      const result = await authService.register(userData)

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
      expect(result.success).toBe(true)
    })
  })

  describe('logout', () => {
    it('should logout user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logout successful',
        },
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const result = await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getMe', () => {
    it('should get authenticated user', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              company: 'Example Corp',
              created_at: '2024-01-01T00:00:00.000000Z',
              updated_at: '2024-01-01T00:00:00.000000Z',
            },
          },
        },
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await authService.getMe()

      expect(api.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockResponse = {
        data: {
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
        },
      }

      vi.mocked(api.put).mockResolvedValueOnce(mockResponse)

      const updateData = {
        name: 'Jane Smith',
        company: 'New Company',
      }

      const result = await authService.updateProfile(updateData)

      expect(api.put).toHaveBeenCalledWith('/auth/profile', updateData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset link sent to your email',
        },
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const data = { email: 'john@example.com' }
      const result = await authService.forgotPassword(data)

      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', data)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset successfully',
        },
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const data = {
        email: 'john@example.com',
        token: 'reset-token',
        password: 'newpassword123',
        password_confirmation: 'newpassword123',
      }

      const result = await authService.resetPassword(data)

      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', data)
      expect(result).toEqual(mockResponse.data)
    })
  })
})