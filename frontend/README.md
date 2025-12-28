# Frontend

React 19 SPA built with Vite and React Router for the Cloud Resume Challenge.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool (Rolldown bundler)
- **React Router 7** - Client-side routing
- **Bootstrap 4.5** - CSS framework

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Router configuration
│   ├── pages/                # Page components
│   │   ├── Resume.jsx        # / - Main resume
│   │   ├── Projects.jsx      # /projects
│   │   ├── ProjectDetail.jsx # /projects/:id
│   │   ├── Blog.jsx          # /blog
│   │   └── BlogPostDetail.jsx# /blog/:slug
│   ├── components/
│   │   ├── sections/         # Resume sections
│   │   ├── cards/            # Reusable cards
│   │   ├── common/           # Shared components
│   │   ├── SideNav.jsx       # Sidebar navigation
│   │   ├── TopNav.jsx        # Top navigation
│   │   └── ViewCounter.jsx   # API-connected counter
│   ├── hooks/
│   │   └── useViewCounter.js # View counter API hook
│   ├── data/                 # JSON data files
│   │   ├── blogData.json     # Generated from backend/
│   │   └── projectsData.json # Generated from backend/
│   ├── layouts/
│   │   └── MainLayout.jsx    # Page wrapper
│   ├── styles/               # CSS files
│   └── constants/            # App constants
├── public/                   # Static assets
└── dist/                     # Build output
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Resume | Main resume page |
| `/projects` | Projects | Project portfolio |
| `/projects/:id` | ProjectDetail | Single project |
| `/blog` | Blog | Blog listing |
| `/blog/:slug` | BlogPostDetail | Single post |

## Data Flow

```
backend/data/*.md → invoke render-all → frontend/src/data/*.json → React components
```

Content is authored in markdown (see [backend/](../backend/)), rendered to JSON, then consumed by React.

## View Counter

The `ViewCounter` component calls the production API (AWS/Azure) or local mock:

```jsx
// src/hooks/useViewCounter.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

Set `VITE_API_URL` in `.env` for production:

```env
VITE_API_URL=https://xxx.execute-api.region.amazonaws.com/prod/count
```

## Build & Deploy

```bash
npm run build    # Creates dist/
```

Deploy `dist/` to S3 (AWS) or Azure Storage:

```bash
# AWS
cd ../aws && ./bin/upload

# Azure
az storage blob upload-batch -d '$web' -s dist/ --account-name <storage>
```

## Development

```bash
npm run dev      # Start dev server
npm run lint     # ESLint check
```

Local API mock: see [api/](../api/)
