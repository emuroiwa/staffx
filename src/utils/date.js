/**
 * Format a date string or Date object into a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type ('short', 'medium', 'long', 'datetime')
 * @param {string} locale - The locale for formatting (default: en-ZA)
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'medium', locale = 'en-ZA') {
  if (!date) {
    return ''
  }
  
  let dateObj
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return ''
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  try {
    const options = getDateFormatOptions(format)
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  } catch (error) {
    // Fallback formatting
    return dateObj.toLocaleDateString()
  }
}

/**
 * Get date format options based on format type
 * @param {string} format - The format type
 * @returns {object} Intl.DateTimeFormat options
 */
function getDateFormatOptions(format) {
  const options = {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    }
  }
  
  return options[format] || options.medium
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 * @param {string|Date} date - The date to format
 * @returns {string} ISO date string
 */
export function formatDateISO(date) {
  if (!date) {
    return ''
  }
  
  let dateObj
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return ''
  }
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return dateObj.toISOString().split('T')[0]
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - The date to compare
 * @param {string|Date} baseDate - The base date to compare against (default: now)
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, baseDate = new Date()) {
  if (!date) {
    return ''
  }
  
  let dateObj
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return ''
  }
  
  let baseDateObj
  if (typeof baseDate === 'string') {
    baseDateObj = new Date(baseDate)
  } else if (baseDate instanceof Date) {
    baseDateObj = baseDate
  } else {
    baseDateObj = new Date()
  }
  
  if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
    return ''
  }
  
  const diffMs = dateObj.getTime() - baseDateObj.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (Math.abs(diffDays) >= 1) {
    if (diffDays > 0) {
      return diffDays === 1 ? 'in 1 day' : `in ${diffDays} days`
    } else {
      return diffDays === -1 ? '1 day ago' : `${Math.abs(diffDays)} days ago`
    }
  } else if (Math.abs(diffHours) >= 1) {
    if (diffHours > 0) {
      return diffHours === 1 ? 'in 1 hour' : `in ${diffHours} hours`
    } else {
      return diffHours === -1 ? '1 hour ago' : `${Math.abs(diffHours)} hours ago`
    }
  } else if (Math.abs(diffMinutes) >= 1) {
    if (diffMinutes > 0) {
      return diffMinutes === 1 ? 'in 1 minute' : `in ${diffMinutes} minutes`
    } else {
      return diffMinutes === -1 ? '1 minute ago' : `${Math.abs(diffMinutes)} minutes ago`
    }
  } else {
    return 'just now'
  }
}

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @param {string|Date} baseDate - The base date to compare against (default: now)
 * @returns {boolean} True if date is in the past
 */
export function isDateInPast(date, baseDate = new Date()) {
  if (!date) {
    return false
  }
  
  let dateObj
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return false
  }
  
  let baseDateObj
  if (typeof baseDate === 'string') {
    baseDateObj = new Date(baseDate)
  } else if (baseDate instanceof Date) {
    baseDateObj = baseDate
  } else {
    baseDateObj = new Date()
  }
  
  if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
    return false
  }
  
  return dateObj.getTime() < baseDateObj.getTime()
}

/**
 * Check if a date is in the future
 * @param {string|Date} date - The date to check
 * @param {string|Date} baseDate - The base date to compare against (default: now)
 * @returns {boolean} True if date is in the future
 */
export function isDateInFuture(date, baseDate = new Date()) {
  if (!date) {
    return false
  }
  
  return !isDateInPast(date, baseDate) && !isSameDay(date, baseDate)
}

/**
 * Check if two dates are the same day
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false
  }
  
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2
  
  if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
    return false
  }
  
  return (
    dateObj1.getFullYear() === dateObj2.getFullYear() &&
    dateObj1.getMonth() === dateObj2.getMonth() &&
    dateObj1.getDate() === dateObj2.getDate()
  )
}