function ProjectCard({ project }) {
  const formatStatus = (status) => {
    if (status === 'completed') return 'Completed'
    if (status === 'in-progress') return 'In Progress'
    if (project.comingSoon) return 'Coming Soon'
    return ''
  }

  return (
    <div className="project-card">
      <div className="project-meta text-muted project-meta-mobile">
        {project.year}
        {formatStatus(project.status) && ` • ${formatStatus(project.status)}`}
      </div>
      <h3 className="mb-2 project-title">{project.title}</h3>
      {project.subtitle && (
        <p className="text-muted mb-2 text-sm">
          {project.subtitle}
        </p>
      )}
      {project.excerpt && <p className="lead mb-3">{project.excerpt}</p>}
    </div>
  )
}

export default ProjectCard
