import { useState, useEffect, useRef } from 'react'

// Hook para lazy loading de componentes basado en visibilidad
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsIntersecting(true)
          setIsLoaded(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    const currentTarget = targetRef.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [isLoaded, options])

  return [targetRef, isIntersecting, isLoaded]
}

// Hook para precargar recursos críticos
export const usePreload = (resources = []) => {
  useEffect(() => {
    resources.forEach(resource => {
      if (resource.type === 'image') {
        const img = new Image()
        img.src = resource.src
      } else if (resource.type === 'script') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'script'
        link.href = resource.src
        document.head.appendChild(link)
      }
    })
  }, [resources])
}

// Hook para lazy loading de imágenes
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [targetRef, isIntersecting] = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setImageSrc(placeholder)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [isIntersecting, src, placeholder])

  return [targetRef, imageSrc, isLoaded]
}

// Hook para optimizar re-renders con memoization
export const useOptimizedMemo = (factory, deps, options = {}) => {
  const { maxAge = 5000 } = options
  const cacheRef = useRef(new Map())
  
  const key = JSON.stringify(deps)
  const cached = cacheRef.current.get(key)
  
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.value
  }
  
  const value = factory()
  cacheRef.current.set(key, { value, timestamp: Date.now() })
  
  // Limpiar cache viejo
  if (cacheRef.current.size > 10) {
    const entries = Array.from(cacheRef.current.entries())
    const oldEntries = entries.filter(([, entry]) => 
      Date.now() - entry.timestamp > maxAge
    )
    oldEntries.forEach(([key]) => cacheRef.current.delete(key))
  }
  
  return value
}