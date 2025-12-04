import { useParams, useNavigate } from 'react-router-dom'
import projectsData from '../data/projectsData.json'
import BackButton from '../components/common/BackButton'
import NotFoundSection from '../components/common/NotFoundSection'
import useBodyClass from '../hooks/useBodyClass'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Remove 'has-sidebar' class for full-width layout
  useBodyClass('has-sidebar', false)

  // Find project by id from all categories
  const project = projectsData.categories
    .flatMap(cat => cat.projects)
    .find(p => p.id === id)

  if (!project) {
    return (
      <NotFoundSection
        onBack={() => navigate('/projects')}
        backLabel="← Back to Projects"
        title="Project Not Found"
        message="The project you're looking for doesn't exist."
      />
    )
  }

  return (
    <div className="container-fluid p-0">
      <section className="resume-section">
        <div className="resume-section-content">
          <BackButton onClick={() => navigate('/projects')} label="← Back to Projects" />
          <h1 className="mb-3">{project.title}</h1>
          <div className="subheading mb-3">{project.subtitle}</div>
          <p className="lead mb-4">{project.summary}</p>

          {project.highlights && project.highlights.length > 0 && (
            <>
              <h3 className="mb-3">Key Features</h3>
              <ul className="mb-4">
                {project.highlights.map((highlight, index) => (
                  <li key={index}>
                    <strong>{highlight.label}:</strong> {highlight.description}
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.architecture && (
            <>
              <h3 className="mb-3">Architecture</h3>
              <p className="mb-4">{project.architecture}</p>
            </>
          )}

          {project.challenges && (
            <>
              <h3 className="mb-3">Challenges</h3>
              <p className="mb-4">{project.challenges}</p>
            </>
          )}

          {project.learnings && (
            <>
              <h3 className="mb-3">Key Learnings</h3>
              <p className="mb-4">{project.learnings}</p>
            </>
          )}

          {project.technologies && (
            <>
              <h3 className="mb-3">Technologies Used</h3>
              <p className="mb-4">{project.technologies}</p>
            </>
          )}

          {(project.githubUrl || project.liveUrl) && (
            <div className="project-links mt-5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mr-2"
                >
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Live
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectDetail
