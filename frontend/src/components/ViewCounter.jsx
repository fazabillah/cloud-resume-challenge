import { useViewCounter } from '../hooks/useViewCounter'

function ViewCounter() {
  const { count, loading, error } = useViewCounter()

  // Don't show anything while loading or if error
  if (loading || error) {
    return null
  }

  // Don't show if count is null/undefined
  if (count === null || count === undefined) {
    return null
  }

  return (
    <div className="view-counter mt-4">
      <div className="d-flex align-items-center">
        <i className="fas fa-eye text-primary mr-2" style={{ fontSize: '1.2rem' }}></i>
        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
          Visitor Count: <strong className="text-primary">{count.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  )
}

export default ViewCounter
