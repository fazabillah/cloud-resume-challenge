# React + Vite Complete Guide: Understanding Your Project Structure

A comprehensive guide for learning React and Vite fundamentals through your Cloud Resume Challenge project.

---

## Table of Contents

1. [Quick Overview](#quick-overview)
2. [How Your App Starts](#how-your-app-starts)
3. [Complete File Connection Map](#complete-file-connection-map)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [React Concepts Explained](#react-concepts-explained)
7. [Vite's Role](#vites-role)
8. [Folder Structure Explained](#folder-structure-explained)

---

## Quick Overview

Your project is a **Single Page Application (SPA)** built with:
- **React 19** - JavaScript library for building UIs with components
- **Vite** - Fast build tool that bundles and serves your code
- **React Router** - Library for client-side navigation (no page reloads)
- **Bootstrap 4** - CSS framework for styling

### Key Principle
Everything is a **component** - reusable pieces of UI that React can display, hide, or update without reloading the page.

---

## How Your App Starts

### Step 1: Browser Opens Your Site

```
User visits: http://localhost:5173
     ↓
Browser loads: frontend/index.html
     ↓
index.html contains:
  • <div id="root"></div>  (empty container)
  • <script src="/src/main.jsx">  (tells Vite where to load React)
     ↓
Vite development server processes the script
     ↓
Browser downloads JavaScript bundle
     ↓
React starts!
```

### Step 2: React Boots Up (main.jsx)

**File: `frontend/src/main.jsx`**

This is your React entry point. It does 3 things:

```javascript
// 1. Import React tools
import { createRoot } from 'react-dom/client'

// 2. Import your app
import App from './App.jsx'

// 3. Mount React into the DOM
createRoot(document.getElementById('root')).render(
  <App />
)
```

**What happens:**
1. `createRoot()` finds the `<div id="root">` from index.html
2. `.render()` inserts your `<App>` component into it
3. Everything inside `<App>` now appears on the screen

### Step 3: Router Takes Over (App.jsx)

**File: `frontend/src/App.jsx`**

This component sets up navigation:

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Resume />} />
      <Route path="projects" element={<Projects />} />
      <Route path="blog" element={<Blog />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Key Ideas:**
- `<BrowserRouter>` - Enables URL routing
- `path="/"` - This route handles the homepage
- `<MainLayout />` - Wrapper component shown on all pages
- Nested routes (Resume, Projects, Blog) - Different pages

### Step 4: Layout Wrapper (MainLayout.jsx)

**File: `frontend/src/layouts/MainLayout.jsx`**

This component persists across all pages:

```javascript
function MainLayout() {
  return (
    <>
      <TopNav />     {/* Navigation bar - always visible */}
      <Outlet />     {/* Page content changes here based on URL */}
    </>
  )
}
```

**What is `<Outlet />`?**
- It's a placeholder for the current page
- If URL is `/`, it shows `<Resume />`
- If URL is `/projects`, it shows `<Projects />`
- `<TopNav />` stays the same - this is why layout doesn't reload

---

## Complete File Connection Map

### Visual Hierarchy

```
index.html (HTML template)
    ↓
main.jsx (React starts here)
    ├─→ App.jsx (Router setup)
    │     ├─→ MainLayout.jsx (Wrapper on ALL pages)
    │     │     ├─→ TopNav.jsx (Navigation bar)
    │     │     └─→ <Outlet /> (Page content)
    │     │           ├─→ Resume.jsx (when URL is /)
    │     │           ├─→ Projects.jsx (when URL is /projects)
    │     │           ├─→ Blog.jsx (when URL is /blog)
    │     │           ├─→ ProjectDetail.jsx (when URL is /projects/:id)
    │     │           └─→ BlogPostDetail.jsx (when URL is /blog/:slug)
    │
    └─→ styles/style.css (Global styles for entire app)
```

### All File Locations

```
frontend/
├── index.html                          ← Browser starts here
├── src/
│   ├── main.jsx                        ← React entry point
│   ├── App.jsx                         ← Router setup
│   ├── styles/
│   │   └── style.css                   ← Global styles (10,389 lines)
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx              ← Wrapper for all pages
│   │
│   ├── components/
│   │   ├── TopNav.jsx                  ← Top navigation (all pages)
│   │   ├── SideNav.jsx                 ← Left sidebar (Resume page only)
│   │   ├── SocialIcons.jsx             ← Social media links
│   │   │
│   │   ├── sections/                   ← Reusable sections
│   │   │   ├── AboutSection.jsx
│   │   │   └── SkillsSection.jsx
│   │   │
│   │   ├── cards/                      ← Card components (reusable)
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── PortfolioProjectCard.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── ExperienceCard.jsx
│   │   │   ├── CertificationList.jsx
│   │   │   └── EducationCard.jsx
│   │   │
│   │   └── common/                     ← Utility components
│   │       ├── SearchFilterBar.jsx
│   │       ├── EmptyState.jsx
│   │       ├── BackButton.jsx
│   │       ├── SectionHeader.jsx
│   │       └── ComingSoonBanner.jsx
│   │
│   ├── pages/                          ← Full page components (routed)
│   │   ├── Resume.jsx                  ← Homepage (/)
│   │   ├── Projects.jsx                ← /projects
│   │   ├── ProjectDetail.jsx           ← /projects/:id
│   │   ├── Blog.jsx                    ← /blog
│   │   └── BlogPostDetail.jsx          ← /blog/:slug
│   │
│   ├── data/                           ← All project data (JSON & JS)
│   │   ├── resumeData.js               ← JS exports (personal info, etc)
│   │   ├── skillsData.json
│   │   ├── projectsData.json
│   │   ├── experienceData.json
│   │   ├── certificationsData.json
│   │   ├── educationData.json
│   │   ├── blogData.json
│   │   ├── socialLinksData.json
│   │   └── navigationData.json
│   │
│   └── hooks/
│       └── useDataSource.js            ← Custom React hook
│
├── package.json                        ← Dependencies & scripts
├── vite.config.js                      ← Vite configuration
└── public/
    └── assets/
        └── images/                     ← Profile photos, icons, etc.
```

---

## Component Architecture

### What is a Component?

A component is a reusable JavaScript function that returns HTML-like code (JSX):

```javascript
function MyComponent() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a component</p>
    </div>
  )
}

export default MyComponent
```

**Key Points:**
- Looks like HTML, but it's JavaScript
- Can be used multiple times
- Can receive **props** (data) from parent components
- Can have **state** (data that changes)

### Component Types in Your Project

#### 1. **Page Components** (show entire pages)
- `Resume.jsx` - Homepage with all resume sections
- `Projects.jsx` - Projects list with search/filter
- `Blog.jsx` - Blog posts list
- `ProjectDetail.jsx` - Single project details
- `BlogPostDetail.jsx` - Single blog post

**Where they're used:** In routes (App.jsx)

#### 2. **Layout Components** (wrappers)
- `MainLayout.jsx` - Wraps all pages with navigation

**Where they're used:** Wraps other components

#### 3. **Section Components** (parts of pages)
- `AboutSection.jsx` - About section
- `SkillsSection.jsx` - Skills section

**Where they're used:** Inside `Resume.jsx`

#### 4. **Card Components** (reusable UI blocks)
- `ProjectCard.jsx` - Displays one project
- `BlogCard.jsx` - Displays one blog post
- `ExperienceCard.jsx` - Displays one job
- `EducationCard.jsx` - Displays one education entry

**Where they're used:** Inside page components, looped through arrays

#### 5. **Common Components** (utility components)
- `SearchFilterBar.jsx` - Search and filter UI
- `EmptyState.jsx` - "No results" message
- `BackButton.jsx` - Back navigation
- `SocialIcons.jsx` - Social media links

**Where they're used:** Anywhere they're needed

#### 6. **Navigation Components**
- `TopNav.jsx` - Top navigation bar
- `SideNav.jsx` - Left sidebar (Resume page only)

**Where they're used:** In layouts or pages

### Component Tree for Resume Page

```
Resume.jsx (the page)
  ├── SideNav.jsx
  │   └── data/resumeData.js (receives navItems prop)
  │
  ├── AboutSection.jsx
  │   └── data/resumeData.js (receives personalInfo, aboutContent props)
  │
  ├── SkillsSection.jsx
  │   └── data/skillsData.json (receives skillsData prop)
  │
  ├── PortfolioProjectCard.jsx (loops through categories)
  │   └── data/projectsData.json (receives project prop)
  │
  ├── ExperienceCard.jsx (loops through experiences)
  │   └── data/experienceData.json (receives experience prop)
  │
  ├── CertificationList.jsx
  │   └── data/certificationsData.json (receives certifications prop)
  │
  └── EducationCard.jsx (loops through education)
      └── data/educationData.json (receives education prop)
```

### Component Tree for Projects Page

```
Projects.jsx (the page)
  ├── SearchFilterBar.jsx (for search and category filtering)
  │
  ├── ProjectCard.jsx (loops through filtered projects)
  │   └── projects from data/projectsData.json
  │
  └── EmptyState.jsx (shown when no results)
```

---

## Data Flow

### How Data Moves Through Your App

#### Pattern 1: Parent → Child (Props)

```javascript
// Parent component
function Resume() {
  const personalInfo = { name: "Faza", email: "..." }

  return (
    <AboutSection personalInfo={personalInfo} />
                  └─ passing data as prop
  )
}

// Child component receives it
function AboutSection({ personalInfo }) {
  return (
    <div>
      <h2>{personalInfo.name}</h2>  ← using the prop
    </div>
  )
}
```

**Key Idea:** Parent passes data down via props. Child receives it via function parameters.

#### Pattern 2: Looping Over Data

```javascript
// Projects.jsx
import projectsData from '../data/projectsData.json'

function Projects() {
  return (
    <div>
      {projectsData.categories.map(category => (
        <ProjectCard key={category.id} project={category} />
      ))}
    </div>
  )
}
```

**What's happening:**
1. Import `projectsData.json`
2. `.map()` loops through each category
3. For each category, create a `<ProjectCard />`
4. Pass category as a prop

#### Pattern 3: Dynamic Routes (URL Parameters)

```javascript
// URL: /projects/cloud-resume-aws
//              └─ :id parameter

function ProjectDetail() {
  const { id } = useParams()  // Gets "cloud-resume-aws"

  // Find matching project in projectsData.json
  const project = projectsData.find(p => p.id === id)

  return (
    <div>
      <h1>{project.title}</h1>
    </div>
  )
}
```

**Key Idea:** URL contains data. Extract it with `useParams()`. Use it to find the right data.

#### Pattern 4: State (Data That Changes)

```javascript
// Projects.jsx
function Projects() {
  const [searchTerm, setSearchTerm] = useState('')

  // When user types in search box
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)  // Update state
    // Component re-renders with new searchTerm
  }

  return (
    <input onChange={handleSearch} />  {/* triggers update */}
  )
}
```

**Key Idea:** State is data that can change. When it changes, React re-renders the component.

---

## React Concepts Explained

### 1. JSX (JavaScript + HTML)

JSX looks like HTML but it's JavaScript:

```javascript
// This is JSX:
const greeting = <h1>Hello, {name}</h1>

// Browsers don't understand JSX, so Vite transforms it to:
const greeting = React.createElement('h1', null, `Hello, ${name}`)
```

**Key Points:**
- `{}` = Insert JavaScript here
- Must have one root element
- Use `className` instead of `class`
- Use `onClick` instead of `onclick`

### 2. Props (Passing Data to Components)

Props are like function parameters:

```javascript
// Define a component that receives props
function Greeting({ firstName, lastName }) {
  return <h1>Hello, {firstName} {lastName}!</h1>
}

// Use it and pass data
<Greeting firstName="Faza" lastName="Billah" />
```

**Key Points:**
- Props flow one way: Parent → Child
- Props are read-only (child can't change them)
- Every component can receive different props

### 3. State (Data That Changes)

State is data inside a component that can change:

```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Key Points:**
- `useState(0)` creates a state variable starting at 0
- `count` = current value
- `setCount()` = function to update it
- When state changes, component re-renders

### 4. Hooks (React Functions)

Hooks are functions that "hook into" React features. Common ones:

#### `useState()` - State Management
```javascript
const [count, setCount] = useState(0)
```

#### `useEffect()` - Side Effects (API calls, DOM manipulation)
```javascript
useEffect(() => {
  document.body.classList.add('has-sidebar')
  return () => {
    document.body.classList.remove('has-sidebar')
  }
}, [])  // [] means run once on mount
```

#### `useParams()` - Get URL Parameters
```javascript
const { id } = useParams()  // Get :id from URL
```

#### `useMemo()` - Cache Expensive Calculations
```javascript
const filteredProjects = useMemo(() => {
  return projects.filter(p => p.matches(searchTerm))
}, [searchTerm])  // Re-calculate only when searchTerm changes
```

### 5. Conditional Rendering

Show or hide content based on conditions:

```javascript
function Blog() {
  const hasPosts = blogData.posts.length > 0

  return (
    <>
      {hasPosts ? (
        <BlogCard />
      ) : (
        <ComingSoonBanner />
      )}
    </>
  )
}
```

### 6. Lists and Keys

When looping through arrays, always use a `key`:

```javascript
{projects.map(project => (
  <ProjectCard
    key={project.id}  // ← Unique identifier
    project={project}
  />
))}
```

**Why keys matter:**
- Help React identify which items changed
- Improve performance
- Always use stable IDs, not array indexes

---

## Vite's Role

### What Vite Does

Vite is a **build tool** - it processes your code and makes it ready for browsers.

### Development Mode (`npm run dev`)

```
Your code
  ↓
Vite dev server (localhost:5173)
  ├─ Reads index.html
  ├─ Sees <script src="/src/main.jsx">
  ├─ Transforms JSX → JavaScript on-the-fly
  ├─ Injects Hot Module Replacement (HMR)
  ├─ Sends to browser
  └─ Browser displays your app

When you edit a file:
  ├─ Vite detects change
  ├─ Re-compiles only that file
  ├─ Browser updates instantly (no full reload!)
  └─ You see changes immediately
```

### Production Mode (`npm run build`)

```
Your code
  ↓
Vite builds (npm run build)
  ├─ Bundles all files together
  ├─ Minifies code (removes spaces, shortens names)
  ├─ Optimizes images
  ├─ Creates dist/ folder
  └─ Output is ready to upload to cloud

dist/ folder contains:
  ├─ index.html (with script references)
  ├─ assets/
  │   ├─ index-a1b2c3.js (hashed for caching)
  │   ├─ style-x9y8z7.css
  │   └─ images/
```

### Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],  // Enables JSX support
})
```

**What it does:**
- `plugins: [react()]` tells Vite how to handle JSX files
- Enables Fast Refresh (instant updates while coding)

---

## Folder Structure Explained

### `frontend/src/` - Your App Code

**`main.jsx`** - Entry point where React starts
```javascript
createRoot(document.getElementById('root')).render(<App />)
```

**`App.jsx`** - Router and top-level component
```javascript
<BrowserRouter>
  <Routes>
    {/* define all routes here */}
  </Routes>
</BrowserRouter>
```

**`layouts/`** - Wrapper components
- `MainLayout.jsx` - Contains `<TopNav />` and `<Outlet />`

**`components/`** - Reusable pieces
- `TopNav.jsx` - Navigation bar
- `SideNav.jsx` - Left sidebar
- `sections/` - Major sections (About, Skills)
- `cards/` - Card components for displaying items
- `common/` - Utility components (Search, Filter, etc.)

**`pages/`** - Full page components
- `Resume.jsx` - Home page
- `Projects.jsx` - Projects listing
- `Blog.jsx` - Blog listing
- `ProjectDetail.jsx` - Single project
- `BlogPostDetail.jsx` - Single blog post

**`data/`** - All content and configuration
- `.json` files - Data in JSON format
- `.js` files - JavaScript exports (can have logic)

**`styles/`** - CSS
- `style.css` - All global styles (very large file)

**`hooks/`** - Custom React hooks
- `useDataSource.js` - Custom hook for data

### `frontend/public/` - Static Assets

Files that don't change - images, icons, etc.

```
public/
└── assets/
    ├── images/
    │   ├── profile.jpg
    │   └── (other images)
    └── (other static files)
```

**How to reference in JSX:**
```javascript
<img src="/assets/images/profile.jpg" alt="Profile" />
```

### `frontend/index.html` - HTML Template

```html
<!doctype html>
<html>
  <head>
    <link rel="icon" href="/assets/img/favicon.ico" />
    <title>Faza Muhammad Billah - Cloud Engineer</title>
    <!-- External libraries (Font Awesome, Google Fonts) -->
  </head>
  <body>
    <div id="root"></div>  <!-- React mounts here -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## How Everything Works Together: Complete Example

### User Clicks "Projects" Link

```
1. User sees TopNav.jsx
   ├─ TopNav has: <NavLink to="/projects">Projects</NavLink>
   └─ User clicks it

2. React Router updates URL to /projects
   ├─ <Route path="projects" element={<Projects />} />
   └─ Matches this route

3. MainLayout.jsx stays the same
   ├─ <TopNav /> doesn't re-render
   └─ <Outlet /> changes content

4. <Outlet /> now shows <Projects />
   ├─ Imports projectsData.json
   ├─ Renders SearchFilterBar
   ├─ Loops through projects and renders ProjectCard
   └─ Page appears (no full reload!)

5. User types in search box
   ├─ SearchFilterBar updates searchTerm state
   ├─ Projects.jsx re-calculates filteredProjects
   ├─ ProjectCard components re-render with filtered data
   └─ User sees filtered results instantly
```

### User Clicks on a Project

```
1. User sees ProjectCard inside Projects.jsx
   ├─ ProjectCard is wrapped in: <Link to={`/projects/${project.id}`}>
   └─ User clicks it

2. React Router updates URL to /projects/cloud-resume-aws
   ├─ <Route path="projects/:id" element={<ProjectDetail />} />
   └─ Matches this route

3. <Outlet /> now shows <ProjectDetail />
   ├─ useParams() extracts "cloud-resume-aws" from URL
   ├─ Finds matching project in projectsData.json
   ├─ Renders full project details
   └─ User sees project page

4. User clicks "Back" button
   ├─ <Link to="/projects"> takes them back
   ├─ URL changes to /projects
   ├─ <Outlet /> shows <Projects /> again
```

---

## Key Takeaways

### React Fundamentals
- **Components** are reusable UI building blocks
- **Props** pass data from parent to child (one way)
- **State** is data inside a component that can change
- **JSX** is HTML-like syntax that gets transformed to JavaScript
- **Hooks** are functions that add React features

### Your Project Structure
- **Pages** are full-screen components shown by routes
- **Components** are reusable pieces inside pages
- **Layouts** wrap pages with persistent elements (TopNav)
- **Data** is in JSON/JS files, imported into components
- **Styles** are in CSS files referenced globally

### React Router
- **Routes** map URLs to components
- **Links** navigate without page reloads
- **Outlet** is a placeholder for child routes
- **useParams()** extracts data from URLs

### Vite
- **Dev mode** gives you instant updates (HMR)
- **Build mode** creates optimized code for production
- **React plugin** enables JSX transformation

---

## Quick Reference: Common Patterns

### Import a Component
```javascript
import MyComponent from './MyComponent'
```

### Import JSON Data
```javascript
import projectsData from '../data/projectsData.json'
```

### Use State
```javascript
const [count, setCount] = useState(0)
```

### Loop Through Array
```javascript
{array.map(item => (
  <Card key={item.id} item={item} />
))}
```

### Conditional Rendering
```javascript
{condition ? <ComponentA /> : <ComponentB />}
```

### Get URL Parameter
```javascript
const { id } = useParams()
```

### Navigate Programmatically
```javascript
<Link to="/projects">Go to Projects</Link>
```

### Use Effect (Side Effects)
```javascript
useEffect(() => {
  // Code runs after component renders
  return () => {
    // Cleanup code (optional)
  }
}, [dependencies])
```

---

## Resources to Learn More

- **React Docs:** https://react.dev
- **Vite Docs:** https://vite.dev
- **React Router Docs:** https://reactrouter.com
- **JavaScript ES6+:** Learn about `import/export`, arrow functions, destructuring

---

**Last Updated:** November 29, 2025

**Author's Note:** This guide is designed for beginners learning React and Vite. Your Cloud Resume Challenge project is a great example of modern web development. Good luck with your learning journey!
