import { ref, watch } from 'vue'

export function useDebouncedRef(sourceRef, delay = 300, callback = null) {
  const debouncedValue = ref(sourceRef.value)
  let timeoutId = null
  
  const debouncedFunction = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      debouncedValue.value = sourceRef.value
      if (callback && typeof callback === 'function') {
        callback()
      }
    }, delay)
  }
  
  watch(sourceRef, debouncedFunction, { immediate: false })
  
  return debouncedFunction
}