import { ref } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const error = ref(null)

export function useApi() {
  const get = async (url, config = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(url, config)
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const post = async (url, data, config = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post(url, data, config)
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const put = async (url, data, config = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(url, data, config)
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const patch = async (url, data, config = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.patch(url, data, config)
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const deleteRequest = async (url, config = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.delete(url, config)
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: deleteRequest
  }
}