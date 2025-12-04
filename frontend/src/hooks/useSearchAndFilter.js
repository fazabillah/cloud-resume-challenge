import { useState, useMemo } from 'react'

/**
 * Custom hook for search and filter functionality
 * Provides state management and filtering logic for lists with search and category/tag filtering
 *
 * @param {Array} data - Array of items to filter
 * @param {Object} config - Configuration object
 * @param {string} config.filterKey - Key name for filter property ('categories', 'tags', etc.)
 * @param {Array} config.searchFields - Array of field names to search in
 * @param {Function} config.extractFilters - Function to extract available filters from data
 * @param {Function} config.matchFilter - Function to check if item matches selected filters
 *
 * @returns {Object} { searchTerm, setSearchTerm, selectedFilters, availableFilters, filteredData, handleFilterToggle, handleClearFilters }
 */
export function useSearchAndFilter(data, config) {
  const {
    searchFields = ['title', 'excerpt'],
    extractFilters,
    matchFilter,
  } = config

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])

  // Extract available filters from data
  const availableFilters = useMemo(() => {
    if (extractFilters) {
      return extractFilters(data)
    }
    return []
  }, [data, extractFilters])

  // Filter data based on search term and selected filters
  const filteredData = useMemo(() => {
    let filtered = data || []

    // Apply filter selection
    if (selectedFilters.length > 0 && matchFilter) {
      filtered = filtered.filter(item => matchFilter(item, selectedFilters))
    }

    // Apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower)
          } else if (Array.isArray(value)) {
            return value.some(v => v.toLowerCase().includes(searchLower))
          }
          return false
        })
      })
    }

    return filtered
  }, [data, searchTerm, selectedFilters, searchFields, matchFilter])

  const handleFilterToggle = (filterId) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedFilters([])
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    availableFilters,
    filteredData,
    handleFilterToggle,
    handleClearFilters,
  }
}

export default useSearchAndFilter
