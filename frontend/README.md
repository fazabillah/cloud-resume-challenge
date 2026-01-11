# Frontend

React 19 SPA built with Vite and React Router.

## Why React + Vite

Is React overkill for a resume site? Probably. Could've done static HTML. But I wanted to show I can work with modern frontend tooling, and React is what most jobs ask for.

Chose Vite over Create React App because CRA is basically dead. Vite is faster (instant HMR), simpler config, and the default for new React projects now.

## Why Bootstrap 4.5

Nothing fancy. Bootstrap is familiar, works, and I didnt want to spend time on CSS frameworks. The resume looks clean enough. Recruiters care about the infrastructure not the design.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview prod build locally
```

## Tech stack

- **React 19** - UI library
- **Vite** - Build tool with Rolldown bundler
- **React Router 7** - Client-side routing
- **Bootstrap 4.5** - CSS framework

## Project structure

```
frontend/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Router config
│   ├── pages/                # Page components
│   │   ├── Resume.jsx        # / - Main resume
│   │   ├── Projects.jsx      # /projects
│   │   ├── ProjectDetail.jsx # /projects/:id
│   │   ├── Blog.jsx          # /blog
│   │   └── BlogPostDetail.jsx# /blog/:slug
│   ├── components/
│   │   ├── sections/         # Resume sections
│   │   ├── cards/            # Reusable cards
│   │   ├── common/           # Shared stuff
│   │   ├── SideNav.jsx       # Sidebar nav
│   │   ├── TopNav.jsx        # Top nav
│   │   └── ViewCounter.jsx   # API-connected counter
│   ├── hooks/
│   │   └── useViewCounter.js # View counter hook
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

| Path | Component | What it shows |
|------|-----------|---------------|
| `/` | Resume | Main resume page |
| `/projects` | Projects | Project portfolio |
| `/projects/:id` | ProjectDetail | Single project |
| `/blog` | Blog | Blog listing |
| `/blog/:slug` | BlogPostDetail | Single post |

## Data flow

```
backend/data/*.md → invoke render-all → frontend/src/data/*.json → React
```

Content is written in markdown (in `backend/`), rendered to JSON, then React reads the JSON. This way content updates dont need code changes.

See [backend/README.md](../backend/README.md) for the CMS setup.

## View counter

The `ViewCounter` component fetches from a serverless API. Works with AWS Lambda, Azure Functions, or the local mock.

```jsx
// src/hooks/useViewCounter.js
const API_URL = import.meta.env.VITE_COUNTER_API_URL || 'http://localhost:8000';
```

For local dev, run the mock API in `api/` folder. For production, set the env var:

```bash
# .env.local
VITE_COUNTER_API_URL=https://xxx.execute-api.region.amazonaws.com/prod/count
```

## Build and deploy

```bash
npm run build    # Creates dist/
```

Then upload `dist/` to your cloud:

```bash
# AWS (via Ansible)
cd ../aws && ./bin/upload

# Azure (via az CLI)
az storage blob upload-batch -d '$web' -s dist/ --account-name <storage>
```

## Development

```bash
npm run dev      # Start dev server with HMR
npm run lint     # ESLint check
```

For local API testing, run the mock server:

```bash
cd ../api
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Then the frontend will talk to `localhost:8000`.

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_COUNTER_API_URL` | View counter API endpoint | `http://localhost:8000` |
| `VITE_API_URL` | Future APIs (not used yet) | - |

Set these in `.env.local` (gitignored) or pass during build:

```bash
VITE_COUNTER_API_URL=https://api.example.com npm run build
```
