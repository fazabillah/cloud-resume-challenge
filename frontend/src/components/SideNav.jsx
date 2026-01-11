import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DOM_IDS } from '../constants/domIds'
import { UI_TEXT } from '../constants/text'

function SideNav({ profileImage = '/assets/images/profile.jpg', brandText, navItems = [], showProfile = true }) {
  useEffect(() => {
    // Handle Bootstrap collapse functionality for mobile
    const handleToggle = () => {
      const navbarCollapse = document.getElementById(DOM_IDS.navbarSupportedContent)
      if (navbarCollapse) {
        navbarCollapse.classList.toggle('show')
      }
    }

    const toggler = document.querySelector('.navbar-toggler')
    if (toggler) {
      toggler.addEventListener('click', handleToggle)
    }

    // Smooth scroll for hash links
    const handleHashClick = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const targetId = href.slice(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
          // Close mobile menu after click
          const navbarCollapse = document.getElementById(DOM_IDS.navbarSupportedContent)
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show')
          }
        }
      }
    }

    const scrollLinks = document.querySelectorAll('.js-scroll-trigger')
    scrollLinks.forEach(link => {
      link.addEventListener('click', handleHashClick)
    })

    return () => {
      if (toggler) {
        toggler.removeEventListener('click', handleToggle)
      }
      scrollLinks.forEach(link => {
        link.removeEventListener('click', handleHashClick)
      })
    }
  }, [])

  const renderNavItem = (item, index) => {
    if (item.type === 'category') {
      return (
        <li key={index} className="nav-item nav-category">
          <span className="nav-category-title">
            {item.icon && <i className={item.icon}></i>} {item.label}
          </span>
        </li>
      )
    }

    if (item.type === 'coming-soon') {
      return (
        <li key={index} className="nav-item nav-sub-item">
          <span className="nav-link coming-soon-link">Coming soon...</span>
        </li>
      )
    }

    if (item.type === 'sub-item') {
      return (
        <li key={index} className="nav-item nav-sub-item">
          <a className="nav-link js-scroll-trigger" href={item.href}>
            {item.label}
          </a>
        </li>
      )
    }

    // Regular nav item
    return (
      <li key={index} className="nav-item">
        <a className="nav-link js-scroll-trigger" href={item.href}>
          {item.label}
        </a>
      </li>
    )
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id={DOM_IDS.sideNav}>
      <Link className="navbar-brand" to="/">
        <span className="d-block d-lg-none">{brandText || UI_TEXT.brand.fullName}</span>
        {showProfile && (
          <span className="d-none d-lg-block">
            <img
              className="img-fluid img-profile rounded-circle mx-auto mb-2"
              src={profileImage}
              alt={UI_TEXT.brand.fullName}
            />
          </span>
        )}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target={`#${DOM_IDS.navbarSupportedContent}`}
        aria-controls={DOM_IDS.navbarSupportedContent}
        aria-expanded="false"
        aria-label={UI_TEXT.aria.toggleNavigation}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id={DOM_IDS.navbarSupportedContent}>
        <ul className="navbar-nav">
          {navItems.map((item, index) => renderNavItem(item, index))}
        </ul>
      </div>
    </nav>
  )
}

export default SideNav
