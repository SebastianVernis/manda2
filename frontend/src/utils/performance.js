// Performance utilities for optimization

// Debounce function for search inputs and API calls
export const debounce = (func, wait, immediate) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memoization utility for expensive calculations
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map()
  
  return (...args) => {
    const key = getKey(...args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    // Clean cache if it gets too large
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

// Async component loader with retry logic
export const loadComponent = async (importFunction, retries = 3) => {
  let lastError
  
  for (let i = 0; i < retries; i++) {
    try {
      return await importFunction()
    } catch (error) {
      lastError = error
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
  
  throw lastError
}

// Virtual scrolling helper for large lists
export class VirtualList {
  constructor(options = {}) {
    this.itemHeight = options.itemHeight || 50
    this.containerHeight = options.containerHeight || 400
    this.overscan = options.overscan || 5
    this.items = options.items || []
  }

  getVisibleRange(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight),
      this.items.length - 1
    )

    return {
      startIndex: Math.max(0, startIndex - this.overscan),
      endIndex: Math.min(endIndex + this.overscan, this.items.length - 1)
    }
  }

  getTotalHeight() {
    return this.items.length * this.itemHeight
  }

  getItemStyle(index) {
    return {
      position: 'absolute',
      top: index * this.itemHeight,
      height: this.itemHeight,
      width: '100%'
    }
  }
}

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const {
    width = 300,
    height = 200,
    quality = 80,
    format = 'webp'
  } = options

  // If using a service like Cloudinary or similar
  if (src.includes('cloudinary.com') || src.includes('imagekit.io')) {
    return `${src}?w=${width}&h=${height}&q=${quality}&f=${format}&fit=crop`
  }

  // For local images, return as-is (could implement local optimization)
  return src
}

// Bundle analysis helper (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return

  const scripts = document.querySelectorAll('script[src]')
  const styles = document.querySelectorAll('link[rel="stylesheet"]')
  
  console.group('Bundle Analysis')
  console.log(`Scripts loaded: ${scripts.length}`)
  console.log(`Stylesheets loaded: ${styles.length}`)
  
  // Log performance metrics
  if (window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0]
    console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`)
    console.log(`Page Load Time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`)
  }
  console.groupEnd()
}

// Memory cleanup utility
export const cleanupMemory = () => {
  // Clear React Query cache older than 5 minutes
  const queryCache = window.queryClient?.getQueryCache()
  if (queryCache) {
    const queries = queryCache.getAll()
    const cutoff = Date.now() - 5 * 60 * 1000 // 5 minutes
    
    queries.forEach(query => {
      if (query.state.dataUpdatedAt < cutoff) {
        queryCache.remove(query)
      }
    })
  }

  // Suggest garbage collection (Chrome DevTools)
  if (window.gc && process.env.NODE_ENV === 'development') {
    window.gc()
  }
}

// Performance monitoring
export const performanceMonitor = {
  marks: new Map(),
  
  mark(name) {
    this.marks.set(name, performance.now())
  },
  
  measure(name, startMark) {
    const start = this.marks.get(startMark)
    if (start) {
      const duration = performance.now() - start
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return duration
    }
    return null
  },
  
  measureComponent(name, renderFn) {
    this.mark(`${name}-start`)
    const result = renderFn()
    this.measure(`${name} render`, `${name}-start`)
    return result
  }
}