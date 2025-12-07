import { useState, useEffect, useRef } from 'react'
import { API_CONFIG } from '../constants/config'

/**
 * Custom hook for view counter with auto-increment
 *
 * Increments counter on component mount by calling POST /api/counter/increment
 *
 * @returns {Object} { count, loading, error }
 */
export function useViewCounter() {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasIncremented = useRef(false)

  useEffect(() => {
    if (hasIncremented.current) return
    hasIncremented.current = true
    const incrementCounter = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_CONFIG.counterApiUrl, {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setCount(data.count)
      } catch (err) {
        setError(err.message || 'Failed to increment counter')
        console.error('View counter error:', err)
        // Set a fallback count so UI doesn't break
        setCount(null)
      } finally {
        setLoading(false)
      }
    }

    incrementCounter()
  }, []) // Empty deps - only run on mount

  return { count, loading, error }
}

export default useViewCounter
