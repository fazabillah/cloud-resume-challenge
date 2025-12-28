# Backend (Content CMS)

Python-based content management system that converts Markdown files with YAML frontmatter to JSON for the React frontend.

## Quick Start

```bash
pip install -r requirements.txt
invoke render-all    # Render blog + projects
```

## Commands

```bash
invoke render-blog      # Render blog posts only
invoke render-projects  # Render projects only
invoke render-all       # Render everything
invoke --list           # Show all commands
```

## Project Structure

```
backend/
├── data/
│   ├── blog/           # Blog markdown files
│   │   └── *.md
│   └── projects/       # Project markdown files
│       └── *.md
├── lib/
│   ├── __init__.py
│   └── render_items.py # Markdown → JSON processor
├── tasks.py            # Invoke CLI tasks
└── requirements.txt
```

## Data Flow

```
backend/data/blog/*.md     → invoke render-blog     → frontend/src/data/blogData.json
backend/data/projects/*.md → invoke render-projects → frontend/src/data/projectsData.json
```

## Markdown Format

### Blog Post

```markdown
---
slug: my-post-slug
title: "Post Title"
excerpt: "Brief description for cards"
author: "Author Name"
publishedDate: "Dec 2025"
readTime: "5 min read"
tags:
  - Tag1
  - Tag2
coverImage: null
---

# Introduction

Blog content in markdown...

## Code Example

```python
print("Hello World")
` ` `
```

### Project

```markdown
---
id: project-slug
title: "Project Title"
subtitle: "Short tagline"
year: "2025"
status: completed
featured: true
excerpt: "Brief description for cards"
technologies: "React, AWS, Python"
githubUrl: "https://github.com/..."
liveUrl: "https://..."
---

## Summary

Project description...

## Key Features

- Feature 1
- Feature 2
```

## Code Highlighting

Uses [Pygments](https://pygments.org/) with `codehilite` extension.

Generate CSS theme:

```bash
pygmentize -S monokai -f html -a .codehilite > ../frontend/src/styles/pygments.css
```

## Dependencies

- `markdown` - Markdown to HTML
- `pyyaml` - YAML frontmatter parsing
- `invoke` - Task runner
- `pygments` - Syntax highlighting

## Workflow

1. Create/edit `.md` files in `data/blog/` or `data/projects/`
2. Run `invoke render-all`
3. Commit updated JSON in `frontend/src/data/`
4. Deploy frontend
