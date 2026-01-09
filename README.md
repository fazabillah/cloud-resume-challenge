# Cloud Resume Challenge

Full-stack serverless portfolio implementing the [Cloud Resume Challenge](https://cloudresumechallenge.dev/) on **AWS** and **Azure**.

## Live Demos

| Cloud | Domain | Stack |
|-------|--------|-------|
| **AWS** | [fazabillah.com](https://fazabillah.com) | S3 + CloudFront + Route 53 + Lambda + DynamoDB |
| **Azure** | [fazabillah.my](https://fazabillah.my) | Azure Storage + Cloudflare + Functions + CosmosDB |

## Challenge Checklist

| # | Requirement | AWS | Azure |
|---|-------------|-----|-------|
| 1 | HTML Resume | React SPA | React SPA |
| 2 | CSS Styling | Bootstrap | Bootstrap |
| 3 | Static Website | S3 | Azure Storage |
| 4 | HTTPS | CloudFront + ACM | Cloudflare SSL |
| 5 | DNS | Route 53 (fazabillah.com) | Cloudflare (fazabillah.my) |
| 6 | JavaScript | React + Vite | React + Vite |
| 7 | Database | DynamoDB | CosmosDB |
| 8 | API | API Gateway + Lambda | Azure Functions |
| 9 | Python | Lambda (Python 3.12) | Azure Functions |
| 10 | Tests | pytest | pytest |
| 11 | Infrastructure as Code | CloudFormation + SAM | Terraform |
| 12 | CI/CD | GitHub Actions | GitHub Actions |
| 13 | Blog Post | - | - |

## Architecture

```
                    ┌─────────────────────────────────────────────────┐
                    │                   Browser                        │
                    └─────────────────────┬───────────────────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐
│         AWS             │  │         Azure           │  │    Cloudflare    │
├─────────────────────────┤  ├─────────────────────────┤  ├──────────────────┤
│ Route 53 → CloudFront   │  │ Azure CDN / Front Door  │  │   DNS + CDN      │
│     ↓                   │  │     ↓                   │  │                  │
│ S3 (React SPA)          │  │ Storage (React SPA)     │  │                  │
│     ↓                   │  │     ↓                   │  │                  │
│ API Gateway → Lambda    │  │ Azure Functions         │  │                  │
│     ↓                   │  │     ↓                   │  │                  │
│ DynamoDB                │  │ CosmosDB                │  │                  │
└─────────────────────────┘  └─────────────────────────┘  └──────────────────┘
```

## Project Structure

```
cloud-resume-challenge/
├── frontend/          # React SPA (Vite + React Router)
├── backend/           # Content CMS (Markdown → JSON)
├── api/               # Local mock API (FastAPI)
├── aws/               # AWS infra (CloudFormation + SAM + Ansible)
└── azure/             # Azure infra (Terraform + Functions)
```

## Quick Start

```bash
# Frontend dev
cd frontend && npm install && npm run dev

# Content rendering
cd backend && pip install -r requirements.txt && invoke render-all

# AWS deployment
cd aws && ./bin/deploy && ./bin/upload

# Azure deployment
cd azure/terraform-backend && terraform apply
cd azure/terraform-frontend && terraform apply
```

## Documentation

| Directory | Description | README |
|-----------|-------------|--------|
| `frontend/` | React 19 SPA with Vite, routing, components | [frontend/README.md](frontend/README.md) |
| `backend/` | Markdown CMS, YAML frontmatter → JSON | [backend/README.md](backend/README.md) |
| `api/` | Local FastAPI mock for development | [api/README.md](api/README.md) |
| `aws/` | CloudFormation, SAM, Ansible playbooks | [aws/README.md](aws/README.md) |
| `azure/` | Terraform, Azure Functions, Cloudflare | [azure/README.md](azure/README.md) |

## Tech Stack

**Frontend**: React 19, Vite, React Router 7, Bootstrap 4.5

**Backend**: Python 3.12, FastAPI (local), AWS Lambda, Azure Functions

**Infrastructure**:
- AWS: CloudFormation, SAM, S3, CloudFront, Route 53, ACM, DynamoDB, API Gateway
- Azure: Terraform, Azure Storage, Azure CDN, Azure Functions, CosmosDB
- Cloudflare: DNS, CDN, SSL

**DevOps**: GitHub Actions, Ansible, Ansible Vault

## Cost

- **AWS** (Free Tier + $0.50/mo Route 53): ~$6/year
- **Azure** (Free Tier): ~$0/year
- **Domain**: ~$12/year

---

Built by [Faza Billah](https://fazabillah.com)
