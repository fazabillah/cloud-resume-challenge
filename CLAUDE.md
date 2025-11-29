# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cloud Resume Challenge** portfolio website for Faza Muhammad Billah, showcasing cloud engineering capabilities and career transition from project engineering to DevOps/Cloud Engineering. The project uses React 19 with Vite and React Router for a modern SPA (Single Page Application) architecture.

## Working Directory

**IMPORTANT**: All npm commands must be run from the `frontend/` directory, not the project root.

```bash
cd frontend
```

## Development Commands

### Setup
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite dev server with Hot Module Replacement (HMR). Default URL: http://localhost:5173

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` directory using Vite with rolldown bundler.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality. Configuration in `eslint.config.js`.

## Project Structure

```
cloud-resume-challlenge-main/
├── frontend/                           # Main application directory
│   ├── src/                           # React source code
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Main React Router component
│   │   ├── index.css                  # Global styles
│   │   ├── components/                # Reusable React components
│   │   │   ├── TopNav.jsx             # Navigation bar
│   │   │   ├── SideNav.jsx            # Sidebar navigation
│   │   │   └── SocialIcons.jsx        # Social media links
│   │   ├── layouts/                   # Layout wrappers
│   │   │   └── MainLayout.jsx         # Main layout with nav
│   │   ├── pages/                     # Page components (routed)
│   │   │   ├── Resume.jsx             # Resume page (/, /resume)
│   │   │   ├── Projects.jsx           # Projects page (/projects)
│   │   │   └── Blog.jsx               # Blog page (/blog)
│   │   └── styles/                    # Stylesheets
│   │       └── style.css              # Bootstrap + custom styles (10,389 lines)
│   ├── public/                        # Static assets
│   │   ├── assets/
│   │   │   └── images/                # Profile photos, etc.
│   │   └── vite.svg                   # (unused, can be removed)
│   ├── docs/                          # Resume documents (archived exports)
│   ├── package.json                   # Dependencies and scripts
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # Vite template entry
│   └── README.md                      # (deprecated template README)
└── README.md                          # Root project readme
```

## Technology Stack

- **Frontend Framework**: React 19.2.0 with React Router 7.9.6
- **Build Tool**: Vite (rolldown-vite 7.2.5) - Rust-based bundler
- **CSS Framework**: Bootstrap 4.5.0
- **Icons**: Font Awesome 5.13.0
- **Routing**: React Router DOM for client-side navigation
- **Development**: ESLint with React hooks support

## Architecture

### React Router SPA (Single Page Application)

This project is a modern client-side rendered SPA using React Router:

1. **Main Entry Point**: `src/main.jsx` mounts the React app at `#root` in `index.html`
2. **Router Setup** (`src/App.jsx`): Configures React Router with the following routes:
   - `/` - Resume page (default route)
   - `/projects` - Projects portfolio
   - `/blog` - Blog page (template ready)
3. **Layout System** (`src/layouts/MainLayout.jsx`): Persistent layout with navigation around routed pages
4. **Page Components** (`src/pages/`): Each route renders a React component with content
5. **Shared Components** (`src/components/`): Navigation, sidebar, and social icons used across pages

### Key Architectural Points

- **No Backend**: Pure frontend SPA with no API integration or database
- **Client-side Routing**: React Router handles all navigation without page reloads
- **Dynamic Content**: Portfolio content is defined in React components, not static HTML
- **Responsive Design**: Bootstrap-based grid system with custom CSS for responsive layout
- **Component Reusability**: Shared nav, sidebar, and layout components across all pages

### Portfolio Content Structure

The application showcases:
- 9+ years project engineering experience (Oil & Gas → Cloud/DevOps transition)
- Multi-cloud skills (AWS: S3, CloudFront, Lambda, API Gateway, DynamoDB, Route 53, ACM; Azure: Storage, Functions, Cosmos DB, Front Door)
- DevOps and Infrastructure as Code expertise (Docker, Kubernetes, Terraform, CloudFormation, Bicep, Ansible)
- Generative AI projects (RAG systems, LangChain, Pinecone, Groq API)
- Data analytics and machine learning capabilities

## Testing

**No testing framework is currently configured.** To add tests:
- Consider Vitest (recommended for Vite projects)
- Or Jest with React Testing Library

## Deployment

**No CI/CD or deployment automation is configured.** The project is designed for cloud deployment:

### Intended Deployment (Cloud Resume Challenge)
- **AWS**: S3 static hosting + CloudFront CDN + Route 53 + ACM
- **Azure**: Static Web Apps or Storage Account + Front Door CDN

To deploy, manually upload the contents of `dist/` (after running `npm run build`) to your cloud storage service.

## Important Notes

### File Organization
- All portfolio content lives in `src/pages/` as React components
- React components are routed via `src/App.jsx` using React Router
- Static assets (images) are in `public/assets/images/`
- The root `index.html` is the Vite template that mounts the React app (not the resume content)
- Build output goes to `dist/` directory after running `npm run build`

### Styling
- Main stylesheet is `src/styles/style.css` (10,389 lines)
- Contains Bootstrap 4.5 customizations and portfolio-specific styles
- Bootstrap 4.5 is loaded via CDN in HTML `<head>` tags
- Font Awesome 5.13.0 is loaded via CDN for icon support

### Vite Configuration
- Minimal configuration in `vite.config.js`
- Uses `@vitejs/plugin-react` for JSX support and Fast Refresh
- rolldown-vite is aliased as the bundler for improved performance
- SPA mode: all routes are client-side, no server routing needed
