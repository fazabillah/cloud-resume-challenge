# Frontend Technical Specification

- Create a static website that serves an HTML resume.
- Read [React+Vite Guide](./REACT_VITE_GUIDE.md) to understand how React + Vite works on my project structure

## Resume Format Generation

Using my existing [Cloud Engineer Resume](./docs/resume_faza_cloudengineer.pdf).

Generate my Resume with GenAI to HTML Format.
Prompt to GenAI:
```
Convert this Resume format to HTML.
Please don't use a CSS framework.
Please use the lease amount of CSS tags.
```

Document provided to LLM:
![](./docs/resume_faza_cloudengineer.pdf)

This is [Generated Output](./docs/20251123_resume_faza.html).

HTML and CSS using template from Using template from [startbootstrap-resume](https://github.com/StartBootstrap/startbootstrap-resume)

## HTML Adjustments

- UTF8, main language English.
- Mobile styling include viewport meta tag width=device-width.
- Stylesheet afte we satisfy with HTML markup.
- Simplify HTML markup CSS selector to be as minimal as possible.
- For the HTML page, use tabs 2 spaces.

## Serve Static Website Locally

- Purpose is so we can start using stylesheet externally from out HTML page in a Cloud Developer Environment (CDE). THis is not necessary with local development.

Assuming we have node install we'll use the simple web-server http-server
```sh
npm i http-server -g
```

https://www.npmjs.com/package/http-server

### Server Website

http-server will serve public folder by default where the command is run.

```sh
cd frontend
http-server
```

## Image Size Consideration

- Ensure size is small, less than 100kb

## Update HTML to React Vite
- Use AI assistance to transform HTML and CSS file created previously to work in React Vite style.

## API ViewCounter

A Python FastAPI backend that tracks resume page views with persistent storage.

### Features
- RESTful API with three endpoints (get, increment, reset)
- JSON-based persistence for local development
- CORS-enabled for React frontend integration
- Designed for serverless migration (AWS Lambda + DynamoDB)
