# GitHub Actions CI/CD

Automated pipelines for AWS and Azure deployments.

## Workflows

| Workflow | Trigger | Actions |
|----------|---------|---------|
| [backend-aws.yaml](workflows/backend-aws.yaml) | `aws/src/**`, `aws/tests/**` | pytest → SAM deploy |
| [backend-azure.yaml](workflows/backend-azure.yaml) | `azure/function/**`, `azure/tests/**` | pytest → Azure Functions deploy |
| [frontend-aws.yaml](workflows/frontend-aws.yaml) | `frontend/**`, `backend/data/**` | Build → S3 → CloudFront invalidate |
| [frontend-azure.yaml](workflows/frontend-azure.yaml) | `frontend/**`, `backend/data/**` | Build → Blob Storage → Cloudflare purge |

## Pipeline Flow

```
Backend (AWS/Azure):
  PR/Push → Test (pytest) → Deploy (master only)

Frontend (AWS/Azure):
  Push (master) → Build (Vite) → Deploy → Cache Invalidate
```

## Required Secrets

Configure in **Settings → Secrets and variables → Actions**:

### AWS

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_API_ENDPOINT` | API Gateway endpoint URL |
| `AWS_S3_BUCKET` | S3 bucket name for frontend |
| `AWS_CLOUDFRONT_ID` | CloudFront distribution ID |

### Azure

| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Service principal JSON (`az ad sp create-for-rbac`) |
| `AZURE_FUNCTION_APP_NAME` | Azure Function App name |
| `AZURE_API_ENDPOINT` | Azure Functions endpoint URL |
| `AZURE_STORAGE_ACCOUNT` | Storage account name for `$web` container |

### Cloudflare

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_ZONE_ID` | Zone ID from Cloudflare dashboard |
| `CLOUDFLARE_API_TOKEN` | API token with cache purge permissions |

## Manual Trigger

All workflows support `workflow_dispatch` for manual runs:

```bash
gh workflow run backend-aws.yaml
gh workflow run frontend-aws.yaml
```

Or via GitHub UI: **Actions → Select workflow → Run workflow**
