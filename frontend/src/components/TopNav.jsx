import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { DOM_IDS } from '../constants/domIds'
import { UI_TEXT } from '../constants/text'

function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav id={DOM_IDS.topNav}>
      <Link to="/" className="brand">
        {UI_TEXT.brand.firstName} <span>{UI_TEXT.brand.lastName}</span>
      </Link>
      <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id={DOM_IDS.topNavLinks}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
          >
            {UI_TEXT.nav.resume}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
          >
            {UI_TEXT.nav.project}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blog"
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMenu}
          >
            {UI_TEXT.nav.blog}
          </NavLink>
        </li>
      </ul>
      <button
        className="hamburger"
        id={DOM_IDS.hamburger}
        onClick={toggleMenu}
        aria-label={UI_TEXT.aria.toggleNavigation}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}

export default TopNav
