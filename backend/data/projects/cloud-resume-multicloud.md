---
id: cloud-resume-multicloud
title: "Multi-Cloud Serverless Portfolio - Mirror Architecture"
subtitle: "AWS & Azure | Serverless | IaC | CI/CD"
year: "2025"
status: in-progress
featured: true
excerpt: "Mirror Architecture deploying identical serverless portfolio across AWS and Azure with provider-native services"
technologies: "React 19, Vite, Python 3.12, AWS (S3, CloudFront, Lambda, DynamoDB, Route 53, ACM), Azure (Storage, Functions, CosmosDB), Cloudflare, Terraform, SAM/CloudFormation, GitHub Actions, Ansible"
githubUrl: "https://github.com/fazabillah/cloud-resume-challenge"
liveUrl: null
---

## Summary

A "Mirror Architecture" approach deploying a full-stack serverless portfolio in parallel across AWS and Azure. Demonstrates versatile cloud engineering by leveraging provider-native services for compute, database, and infrastructure management to achieve complete functional parity.

## Technology Stack

**Frontend:** React 19, Vite, React Router 7, Bootstrap 4.5

**Backend:** Python 3.12, FastAPI (local), AWS Lambda, Azure Functions

**Databases:** DynamoDB (AWS), CosmosDB (Azure)

**Infrastructure as Code:** AWS SAM/CloudFormation, Terraform

**DevOps:** GitHub Actions, Ansible & Ansible Vault

## Service Parity

| Function | AWS Stack | Azure Stack |
|----------|-----------|-------------|
| Static Hosting | S3 | Azure Storage |
| CDN | CloudFront | Azure CDN & Cloudflare |
| DNS | Route 53 | Cloudflare |
| Serverless Compute | Lambda | Azure Functions |
| NoSQL Database | DynamoDB | CosmosDB |
| SSL/TLS | ACM | Cloudflare SSL |

AWS provides fully integrated first-party solutions, while Azure implementation strategically integrates Cloudflare for DNS, CDN, and SSL/TLS termination.

## Key Features

- **Multi-Cloud Serverless Logic:** Dynamic visitor counter with identical Python 3.12 business logic deployed across Lambda and Azure Functions, each interacting with respective NoSQL databases
- **Automated Lifecycle (CI/CD):** Zero-touch deployments via GitHub Actions - provisions infrastructure via IaC and deploys React frontend to both cloud environments
- **End-to-End Security:** SSL/TLS encryption enforced across both environments - AWS via ACM + CloudFront, Azure via Cloudflare SSL
- **Dual IaC Paradigms:** AWS SAM/CloudFormation (provider-native) and Terraform (cloud-agnostic) showcasing proficiency in both approaches

## Architecture

**AWS Flow:** Browser → Route 53 → CloudFront → S3 (React SPA) | API Gateway → Lambda → DynamoDB

**Azure Flow:** Browser → Cloudflare → Azure CDN → Azure Storage (React SPA) | Azure Functions → CosmosDB

## Repository Composition

JavaScript: 46.6% | CSS: 21.3% | Python: 10.4% | HTML: 10.2% | HCL: 8.8% | Shell: 2.7%
