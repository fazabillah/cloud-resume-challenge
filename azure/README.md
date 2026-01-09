# Azure Infrastructure

Terraform-managed Azure infrastructure with Cloudflare CDN for the Cloud Resume Challenge.

**Live**: [fazabillah.my](https://fazabillah.my)

## Architecture

```
Cloudflare (DNS + CDN) → Azure Storage (React SPA)
                       ↘ Azure Functions → CosmosDB (View Counter)
```

## Quick Start

```bash
# Prerequisites
brew install terraform    # or your package manager
az login                  # Azure CLI login

# Backend (Functions + CosmosDB)
cd terraform-backend
terraform init
terraform plan
terraform apply

# Frontend (Cloudflare DNS)
cd ../terraform-frontend
terraform init
terraform plan
terraform apply
```

## Project Structure

```
azure/
├── terraform-backend/      # Azure Functions + CosmosDB
│   ├── *.tf               # Terraform config (gitignored)
│   ├── terraform.tfvars   # Variables (gitignored)
│   └── terraform.tfstate  # State file
├── terraform-frontend/     # Cloudflare DNS + CDN
│   ├── *.tf               # Terraform config (gitignored)
│   ├── terraform.tfvars   # Variables (gitignored)
│   └── terraform.tfstate  # State file
├── function/              # Azure Functions code
│   └── local.settings.json
├── tests/
│   ├── conftest.py           # pytest fixtures
│   ├── test_view_counter.py  # Function unit tests
│   └── requirements-dev.txt  # Test dependencies
└── .envrc                 # Cloudflare env vars (direnv)
```

## Resources

### terraform-backend

| Resource | Service | Description |
|----------|---------|-------------|
| Resource Group | Azure | Container for all resources |
| Storage Account | Azure Storage | Function app storage |
| Function App | Azure Functions | Python serverless API |
| CosmosDB | Azure CosmosDB | NoSQL database for view counter |
| App Service Plan | Azure | Consumption plan (serverless) |

### terraform-frontend

| Resource | Service | Description |
|----------|---------|-------------|
| Zone | Cloudflare | DNS zone for domain |
| DNS Records | Cloudflare | A/CNAME records |
| SSL/TLS | Cloudflare | Free SSL certificate |

## Environment Variables

Using [direnv](https://direnv.net/) for Cloudflare credentials:

```bash
# .envrc (gitignored)
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ZONE_ID="your-zone-id"
```

Enable:
```bash
direnv allow .
```

## Deployment

### Backend

```bash
cd terraform-backend
terraform plan    # Preview changes
terraform apply   # Deploy
```

### Frontend

```bash
cd terraform-frontend
terraform plan
terraform apply
```

### Upload React Build

```bash
# Build frontend
cd ../frontend && npm run build

# Upload to Azure Storage
az storage blob upload-batch \
  -d '$web' \
  -s dist/ \
  --account-name <storage-account-name> \
  --overwrite
```

## Tests

```bash
pip install -r tests/requirements-dev.txt
pytest tests/ -v
```

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `backend-azure.yaml` | Push to `azure/function/**`, `azure/tests/**` | Run tests → Deploy Function |
| `frontend-azure.yaml` | Push to `frontend/**`, `backend/data/**` | Build React → Azure Storage → Cloudflare purge |

Required secrets: `AZURE_CREDENTIALS`, `AZURE_STORAGE_ACCOUNT`, `AZURE_FUNCTION_APP_NAME`, `AZURE_API_ENDPOINT`, `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN`

## Outputs

### Backend
```
function_api_endpoint = "https://func-faza-counter-xxx.azurewebsites.net/api/view_counter"
cosmosdb_endpoint     = "https://cosmos-faza-counter-xxx.documents.azure.com:443/"
```

### Frontend
```
website_url = "https://fazabillah.my"
www_url     = "https://www.fazabillah.my"
```

## Terraform State

State files are local (not committed). For team use, configure remote backend:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "tfstate"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
```

## Cost

- **Azure Functions**: Free tier (1M requests/month)
- **CosmosDB**: ~$0 (serverless, minimal RU)
- **Azure Storage**: ~$0.02/month
- **Cloudflare**: Free tier

## Troubleshooting

### Terraform provider issues
```bash
terraform init -upgrade
```

### Cloudflare API errors
Check `.envrc` has valid `CLOUDFLARE_API_TOKEN`.

### Function not responding
```bash
az functionapp restart --name <function-app-name> --resource-group <rg>
```
