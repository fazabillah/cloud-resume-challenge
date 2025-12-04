import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import blogData from '../data/blogData.json'
import BackButton from '../components/common/BackButton'
import NotFoundSection from '../components/common/NotFoundSection'
import useBodyClass from '../hooks/useBodyClass'

function BlogPostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  // Remove 'has-sidebar' class for full-width layout
  useBodyClass('has-sidebar', false)

  // Load markdown file dynamically
  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch(`/src/data/blog-posts/${slug}.md`)
        if (response.ok) {
          const text = await response.text()
          setContent(text)
        } else {
          setContent('')
        }
      } catch (error) {
        console.error('Error loading markdown file:', error)
        setContent('')
      } finally {
        setLoading(false)
      }
    }

    loadMarkdown()
  }, [slug])

  const post = blogData.posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <NotFoundSection
        onBack={() => navigate('/blog')}
        backLabel="← Back to Blog"
        title="Post Not Found"
        message="The blog post you're looking for doesn't exist."
      />
    )
  }

  return (
    <div className="container-fluid p-0">
      <section className="resume-section">
        <div className="resume-section-content">
          <BackButton onClick={() => navigate('/blog')} label="← Back to Blog" />

          <h1 className="mb-3">{post.title}</h1>
          {post.author && (
            <div className="post-author text-muted mb-3">By {post.author}</div>
          )}
          <div className="post-meta text-muted mb-4">
            {post.publishedDate}
            {post.readTime && ` • ${post.readTime}`}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="badge badge-secondary mr-2">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="img-fluid mb-4 img-responsive"
            />
          )}

          {loading ? (
            <p>Loading post content...</p>
          ) : (
            <div className="post-content markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogPostDetail
