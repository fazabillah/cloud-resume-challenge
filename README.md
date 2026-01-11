# Cloud Resume Challenge

Full-stack serverless portfolio implementing the [Cloud Resume Challenge](https://cloudresumechallenge.dev/) on AWS and Azure.

## About this project

The Cloud Resume Challenge is a hands-on project for people breaking into cloud. You build a resume website, but the real point is learning cloud services by actually using them. Not just reading docs or watching tutorials.

I went further and deployed to both AWS and Azure. Same frontend, different backends. Wanted to compare the two ecosystems and understand what makes each one tick.

This repo has everything: React frontend, Python content CMS, AWS infrastructure (CloudFormation + SAM), Azure infrastructure (Terraform), and CI/CD pipelines. Its probably overengineered for a resume site but thats the point. Show I can build real infrastructure.

## Live demos

| Cloud | Domain | Stack |
|-------|--------|-------|
| AWS | [fazabillah.com](https://fazabillah.com) | S3 + CloudFront + Route 53 + Lambda + DynamoDB |
| Azure | [fazabillah.my](https://fazabillah.my) | Azure Storage + Cloudflare + Functions + CosmosDB |

## Architecture

```
                              BROWSER
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
        ┌─────────────────┐             ┌─────────────────┐
        │      AWS        │             │     AZURE       │
        └────────┬────────┘             └────────┬────────┘
                 │                               │
    ┌────────────┼────────────┐     ┌────────────┼────────────┐
    │            │            │     │            │            │
    ▼            ▼            ▼     ▼            ▼            ▼
 Route 53   CloudFront     S3    Cloudflare  Az Storage   Az Funcs
  (DNS)      (CDN)      (files)   (CDN+DNS)   (files)     (API)
                 │                               │
                 ▼                               ▼
          API Gateway                      CosmosDB
                 │
                 ▼
             Lambda
                 │
                 ▼
            DynamoDB
```

Both stacks serve the same React SPA. View counter API hits the respective serverless backend.

## Challenge checklist

| # | Requirement | AWS | Azure |
|---|-------------|-----|-------|
| 1 | HTML Resume | React SPA | React SPA |
| 2 | CSS Styling | Bootstrap | Bootstrap |
| 3 | Static Website | S3 | Azure Storage |
| 4 | HTTPS | CloudFront + ACM | Cloudflare SSL |
| 5 | DNS | Route 53 | Cloudflare |
| 6 | JavaScript | React + Vite | React + Vite |
| 7 | Database | DynamoDB | CosmosDB |
| 8 | API | API Gateway + Lambda | Azure Functions |
| 9 | Python | Lambda (Python 3.12) | Azure Functions |
| 10 | Tests | pytest | pytest |
| 11 | Infrastructure as Code | CloudFormation + SAM | Terraform |
| 12 | CI/CD | GitHub Actions | GitHub Actions |

## Design decisions

| Decision | Why |
|----------|-----|
| Multi-cloud (AWS + Azure) | Learn both ecosystems. Most jobs use one but understanding both shows versatility |
| CloudFormation for AWS | Native to AWS, no extra dependencies. SAM extends it nicely for Lambda |
| Terraform for Azure | ARM templates are painful. HCL is readable and skills transfer to other clouds |
| Ansible for deployment | Handles secrets (Vault), idempotent runs, and I can reuse playbooks |
| React instead of static HTML | Overkill? Yes. But shows I can work with modern frontend tooling |
| Serverless over containers | Cheaper for low traffic, less to manage, scales to zero |

See each subdirectory README for more detail on specific choices.

## What I learned

The IaC journey was the hardest part. Started with CloudFormation for AWS, then added SAM for Lambda stuff. For Azure I used Terraform for simplicity and learning of using Terraform.

Ansible came in when I needed to manage secrets and orchestrate deploys. Could've used bash scripts but Ansible Vault solved the credentials problem cleanly.

Main takeaways:
- CloudFormation is verbose but reliable. Native AWS integration is nice
- Terraform is cleaner syntax, better for multi-cloud, but you manage state files
- SAM is just CloudFormation with Lambda shortcuts. Don't overthink it
- Ansible fills a different gap than Terraform. Use both together

## Project structure

```
cloud-resume-challenge/
├── .github/           # GitHub Actions CI/CD workflows
├── frontend/          # React SPA (Vite + React Router)
├── backend/           # Content CMS (Markdown → JSON)
├── api/               # Local mock API (FastAPI)
├── aws/               # AWS infra (CloudFormation + SAM + Ansible)
├── azure/             # Azure infra (Terraform + Functions)
└── guide/             # Detailed how-to guides
```

## Prerequisites

Before you start you need:

- **Node.js 20+** - for building the React frontend
- **Python 3.12+** - for content CMS and Lambda functions
- **AWS CLI** - configured with credentials (`aws configure`)
- **Azure CLI** - if deploying to Azure (`az login`)
- **Terraform** - for Azure infrastructure
- **Ansible** - for AWS deployments (`pipx install ansible`)

Optional:
- **direnv** - auto-load env vars for Terraform

## Quick start

```bash
# Frontend dev (runs on localhost:5173)
cd frontend && npm install && npm run dev

# Content rendering (markdown to JSON)
cd backend && pip install -r requirements.txt && invoke render-all

# AWS deployment
cd aws && ./bin/deploy && ./bin/upload

# Azure deployment
cd azure/terraform-backend && terraform init && terraform apply
cd azure/terraform-frontend && terraform init && terraform apply
```

## Documentation

| Directory | What it does | Docs |
|-----------|--------------|------|
| `frontend/` | React 19 SPA, routing, components | [frontend/README.md](frontend/README.md) |
| `backend/` | Markdown CMS, renders to JSON | [backend/README.md](backend/README.md) |
| `api/` | Local FastAPI mock for dev | [api/README.md](api/README.md) |
| `aws/` | CloudFormation, SAM, Ansible | [aws/README.md](aws/README.md) |
| `azure/` | Terraform, Functions, Cloudflare | [azure/README.md](azure/README.md) |
| `.github/` | CI/CD pipelines | [.github/WORKFLOWS.md](.github/WORKFLOWS.md) |

## Tech stack

**Frontend**: React 19, Vite, React Router 7, Bootstrap 4.5

**Backend**: Python 3.12, FastAPI (local), AWS Lambda, Azure Functions

**Infrastructure**:
- AWS: CloudFormation, SAM, S3, CloudFront, Route 53, ACM, DynamoDB, API Gateway
- Azure: Terraform, Azure Storage, Cloudflare, Azure Functions, CosmosDB

**DevOps**: GitHub Actions, Ansible, Ansible Vault

## Cost

Runs almost free on both clouds:

- **AWS** (Free Tier + Route 53): ~$6/year
- **Azure** (Free Tier): ~$5/year
- **Domain**: ~$12/year

Total: around $25/year

---

Built by [Faza Billah](https://fazabillah.com)
