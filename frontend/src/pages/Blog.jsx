import { Link } from 'react-router-dom'
import SocialIcons from '../components/SocialIcons'
import BlogCard from '../components/cards/BlogCard'
import SearchFilterBar from '../components/common/SearchFilterBar'
import EmptyState from '../components/common/EmptyState'
import blogData from '../data/blogData.json'
import useSearchAndFilter from '../hooks/useSearchAndFilter'

function Blog() {
  const hasPosts = blogData.posts && blogData.posts.length > 0

  // Use search and filter hook
  const {
    searchTerm,
    setSearchTerm,
    selectedFilters: selectedTags,
    availableFilters: availableTags,
    filteredData: filteredPosts,
    handleFilterToggle: handleTagToggle,
    handleClearFilters,
  } = useSearchAndFilter(blogData.posts || [], {
    searchFields: ['title', 'excerpt', 'tags'],
    extractFilters: (posts) => {
      const tagSet = new Set()
      posts.forEach(post => {
        post.tags?.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort().map(tag => ({ id: tag, label: tag }))
    },
    matchFilter: (post, selectedTags) =>
      post.tags?.some(tag => selectedTags.includes(tag))
  })

  return (
    <div className="container-fluid p-0">
      <section className="resume-section" id="blog">
        <div className="resume-section-content">
          <h1 className="mb-5">
            <span className="text-primary">Blog</span>
          </h1>

          {hasPosts ? (
            <>
              {/* Search & Filter Toolbar */}
              <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                selectedFilters={selectedTags}
                availableFilters={availableTags}
                onFilterToggle={handleTagToggle}
                onClearFilters={handleClearFilters}
                filterType="tag"
                placeholder="Search posts by title, topic, or tag..."
              />

              {/* Filtered Posts List */}
              {filteredPosts.length > 0 ? (
                <div className="mt-5">
                  {filteredPosts.map(post => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="link-unstyled"
                    >
                      <BlogCard post={post} />
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fas fa-search"
                  message="No blog posts found"
                  suggestion="Try different search terms or clear filters"
                  onClearFilters={handleClearFilters}
                />
              )}
            </>
          ) : (
            <div className="coming-soon-banner text-center">
              <i className="fas fa-pen-fancy fa-5x mb-4 text-primary"></i>
              <h2 className="mb-4">Coming Soon</h2>
              <p className="lead mb-4">I will be sharing about my learning journey and reflection related to:</p>
              <ul className="list-unstyled mt-4">
                {blogData.comingSoonTopics.map(topic => (
                  <li key={topic.id} className="mb-2">
                    <i className={`${topic.icon} mr-2`}></i>
                    {topic.title}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <p className="mb-3">Follow me for updates:</p>
                <SocialIcons />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog
