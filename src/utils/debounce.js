/**
 * Simple debounce utility function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to wait
 * @param {boolean} immediate - Whether to execute immediately on the leading edge
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    
    const callNow = immediate && !timeout
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func.apply(this, args)
  }
}