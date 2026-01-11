# Backend (Content CMS)

Python-based content management that converts Markdown to JSON.

## Why Markdown CMS

Couldve used a headless CMS like Contentful or Strapi. But for a portfolio site thats overkill. Markdown files in git give me:

- **Version control** - content changes are commits. Can rollback, diff, branch
- **No external service** - no database, no API keys, no monthly limits
- **Portable** - its just text files. Move anywhere
- **Simple editing** - write in any editor, no web dashboard needed

The tradeoff is no rich editor or live preview. But I write in VS Code anyway so thats fine.

## Why Python Invoke

Invoke is a simple task runner. Like Make but Python.

Considered alternatives:
- **Make** - works but Makefiles are ugly and I already use Python
- **npm scripts** - would add Node dependency to a Python project
- **Just** - cool but overkill, Invoke is enough

Invoke lets me define tasks in Python which I already know. One command to render, deploy, or whatever.

## Quick start

```bash
pip install -r requirements.txt
invoke render-all
```

Outputs JSON to `frontend/src/data/`.

## Commands

```bash
invoke render-blog      # Blog posts only
invoke render-projects  # Projects only
invoke render-all       # Everything
invoke --list           # Show all commands
```

## Project structure

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
├── tasks.py            # Invoke tasks
└── requirements.txt
```

## Data flow

```
backend/data/blog/*.md     → invoke render-blog     → frontend/src/data/blogData.json
backend/data/projects/*.md → invoke render-projects → frontend/src/data/projectsData.json
```

The renderer:
1. Reads all `.md` files in a folder
2. Parses YAML frontmatter (title, date, tags, etc)
3. Converts markdown body to HTML
4. Outputs sorted JSON array

## Markdown format

### Blog post

```markdown
---
slug: my-post-slug
title: "Post Title"
excerpt: "Brief description for cards"
author: "Your Name"
publishedDate: "Dec 2025"
readTime: "5 min read"
tags:
  - Cloud
  - AWS
coverImage: null
---

# Introduction

Post content here...

## Code example

```python
print("Hello")
` ` `
```

### Project

```markdown
---
id: project-id
title: "Project Title"
subtitle: "Short tagline"
year: "2025"
status: completed
featured: true
excerpt: "Brief description"
technologies: "React, AWS, Python"
githubUrl: "https://github.com/..."
liveUrl: "https://..."
---

## Summary

Project description...
```

## Code highlighting

Uses Pygments with `codehilite` extension. Code blocks get syntax highlighting.

Generate CSS for your theme:

```bash
pygmentize -S monokai -f html -a .codehilite > ../frontend/src/styles/pygments.css
```

Themes: monokai, github-dark, dracula, etc. See pygments.org/styles.

## Dependencies

- `markdown` - converts markdown to HTML
- `pyyaml` - parses YAML frontmatter
- `invoke` - task runner
- `pygments` - syntax highlighting

## Workflow

1. Write/edit `.md` files in `data/blog/` or `data/projects/`
2. Run `invoke render-all`
3. Commit the updated JSON in `frontend/src/data/`
4. Deploy frontend

The JSON files are committed intentionally. This way frontend builds dont need Python.

## Troubleshooting

### YAML parse error

Check your frontmatter syntax. Common issues:
- Missing quotes around titles with special characters
- Tabs instead of spaces for indentation
- Missing `---` delimiters

### Code not highlighted

Make sure the language is specified after the triple backticks:

````markdown
```python
code here
```
````

Not just:

````markdown
```
code here
```
````

### Unicode errors

Make sure files are UTF-8 encoded. Most editors do this by default.
