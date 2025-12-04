import BackButton from './BackButton'

/**
 * Reusable "Not Found" section component
 * Displays a consistent not found message with a back button
 *
 * @param {Object} props
 * @param {Function} props.onBack - Callback function when back button is clicked
 * @param {string} props.backLabel - Label for the back button
 * @param {string} props.title - Title for the not found message
 * @param {string} props.message - Description message
 */
function NotFoundSection({ onBack, backLabel = "← Back", title = "Not Found", message = "The item you're looking for doesn't exist." }) {
  return (
    <div className="container-fluid p-0">
      <section className="resume-section">
        <div className="resume-section-content">
          <BackButton onClick={onBack} label={backLabel} />
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </section>
    </div>
  )
}

export default NotFoundSection
