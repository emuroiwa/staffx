import { vi } from 'vitest'

// Mock global DOM APIs that might not be available in test environment
// Ensure URL constructor exists and add missing methods
if (typeof window.URL === 'undefined') {
  global.URL = URL
}

// Add missing URL static methods if they don't exist
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn()
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn()
}

Object.defineProperty(window, 'confirm', {
  value: vi.fn().mockReturnValue(true),
  writable: true
})

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  writable: true
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})