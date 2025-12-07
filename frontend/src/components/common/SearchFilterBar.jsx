import { useState } from 'react'

function SearchFilterBar({
  searchTerm,
  onSearchChange,
  selectedFilters,
  availableFilters,
  onFilterToggle,
  onClearFilters,
  filterType = 'category',
  placeholder = 'Search...'
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true)

  const hasActiveFilters = searchTerm || selectedFilters.length > 0

  return (
    <div className="search-filter-toolbar">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          aria-label={`Search by ${filterType}`}
        />
      </div>

      {/* Filter Label & Toggle */}
      {availableFilters.length > 0 && (
        <>
          <div className="mb-2">
            <button
              className="btn btn-sm btn-link text-muted p-0"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              <i className="fas fa-filter mr-2"></i>
              Filter by {filterType}
              <i className={`fas fa-chevron-${isFilterExpanded ? 'up' : 'down'} ml-2`}></i>
            </button>
          </div>

          {/* Filter Pills */}
          {isFilterExpanded && (
            <div className="filter-pills">
              {availableFilters.map(filter => (
                <span
                  key={filter.id}
                  className={`badge badge-pill filter-pill ${
                    selectedFilters.includes(filter.id) ? 'active' : 'badge-secondary'
                  }`}
                  onClick={() => onFilterToggle(filter.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onFilterToggle(filter.id)
                    }
                  }}
                >
                  {filter.icon && <i className={`${filter.icon} mr-1`}></i>}
                  {filter.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* Toolbar Actions */}
      {hasActiveFilters && (
        <div className="toolbar-actions">
          <span className="active-filters-count">
            {selectedFilters.length > 0 && `${selectedFilters.length} ${filterType}${selectedFilters.length > 1 ? 's' : ''} selected`}
            {searchTerm && selectedFilters.length > 0 && ' • '}
            {searchTerm && 'Search active'}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClearFilters}
          >
            <i className="fas fa-times mr-1"></i> Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchFilterBar
