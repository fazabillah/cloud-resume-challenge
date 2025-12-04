import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/cards/ProjectCard'
import SearchFilterBar from '../components/common/SearchFilterBar'
import EmptyState from '../components/common/EmptyState'
import projectsData from '../data/projectsData.json'
import useSearchAndFilter from '../hooks/useSearchAndFilter'

function Projects() {
  // Flatten all projects with category info
  const allProjects = useMemo(() =>
    projectsData.categories.flatMap(cat =>
      (cat.projects || []).map(proj => ({
        ...proj,
        categoryId: cat.id,
        categoryLabel: cat.label
      }))
    ), []
  )

  // Use search and filter hook
  const {
    searchTerm,
    setSearchTerm,
    selectedFilters: selectedCategories,
    availableFilters: availableCategories,
    filteredData: filteredProjects,
    handleFilterToggle: handleCategoryToggle,
    handleClearFilters,
  } = useSearchAndFilter(allProjects, {
    searchFields: ['title', 'subtitle', 'excerpt', 'technologies'],
    extractFilters: () => projectsData.categories.map(cat => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon
    })),
    matchFilter: (project, selectedCategories) =>
      selectedCategories.includes(project.categoryId)
  })

  return (
    <div className="container-fluid p-0">
      <section className="resume-section" id="projects">
        <div className="resume-section-content">
          <h1 className="mb-5">
            <span className="text-primary">Projects</span>
          </h1>

          {/* Search & Filter Toolbar */}
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            selectedFilters={selectedCategories}
            availableFilters={availableCategories}
            onFilterToggle={handleCategoryToggle}
            onClearFilters={handleClearFilters}
            filterType="category"
            placeholder="Search projects by name, tech, or description..."
          />

          {/* Projects List */}
          {filteredProjects.length > 0 ? (
            <div className="mt-5">
              {filteredProjects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="link-unstyled"
                >
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fas fa-project-diagram"
              message="No projects found"
              suggestion="Try adjusting your filters or search terms"
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects
