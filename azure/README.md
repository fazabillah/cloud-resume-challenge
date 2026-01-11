# Azure Infrastructure

Terraform-managed Azure infrastructure with Cloudflare CDN.

**Live**: [fazabillah.my](https://fazabillah.my)

## Architecture

```
                        ┌─────────────────┐
                        │    Browser      │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                   1    │   Cloudflare    │  DNS + CDN + SSL
                        │ (fazabillah.my) │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                                     │
              ▼                                     ▼
     ┌─────────────────┐                   ┌─────────────────┐
  2a │  Azure Storage  │                2b │ Azure Functions │
     │   ($web blob)   │                   │   /view_counter │
     └─────────────────┘                   └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                        3  │    CosmosDB     │
                                           │  (view counter) │
                                           └─────────────────┘
```

Cloudflare proxies everything. Static files (2a) from Azure Storage, API calls (2b-3) hit Azure Functions.

## Why Terraform (not ARM templates)

ARM templates are JSON hell. Terraform with HCL is so much cleaner.

Benefits over ARM:
- **Readable syntax** - HCL looks like actual config, not serialized data
- **State management** - knows what exists, what changed, what to destroy
- **Multi-cloud** - same concepts work for AWS, GCP, everything. Skills transfer
- **Plan before apply** - see exactly what will change before it happens

Downside is you manage state files. Local state is fine for solo projects but for teams you'd use remote backend (Azure Storage, S3, etc).

## Why Cloudflare over Azure CDN

Azure has its own CDN. Went with Cloudflare instead because:

- **Free tier is generous** - unlimited bandwidth, SSL, DDoS protection
- **Already using it for DNS** - bought domain through Cloudflare, so CDN is one click
- **Better DX** - dashboard is cleaner, cache purge is faster, no Azure portal clicking
- **Proxied DNS** - hides origin, adds WAF features for free

Azure CDN would work fine. But Cloudflare was simpler.

## Prerequisites

```bash
# Terraform
brew install terraform  # or download from terraform.io

# Azure CLI
brew install azure-cli
az login

# Cloudflare credentials (for terraform-frontend)
# Option 1: direnv (recommended)
brew install direnv

# Option 2: export manually before terraform commands
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ZONE_ID="your-zone-id"
```

Get Cloudflare API token from dashboard: My Profile → API Tokens → Create Token → Edit zone DNS template.

## Quick start

```bash
# Backend first (Functions + CosmosDB)
cd terraform-backend
terraform init
terraform plan      # review whats gonna happen
terraform apply     # type 'yes' to confirm

# Frontend (Cloudflare DNS pointing to Azure Storage)
cd ../terraform-frontend
terraform init
terraform plan
terraform apply
```

Takes 5-10 minutes. CosmosDB provisioning is the slow part.

## Project structure

```
azure/
├── terraform-backend/      # Azure Functions + CosmosDB
│   ├── main.tf            # Resource definitions
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   └── terraform.tfvars   # Variable values (gitignored)
├── terraform-frontend/     # Cloudflare DNS
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars   # (gitignored)
├── function/              # Azure Functions code
│   └── view_counter/
│       └── __init__.py
├── tests/
│   ├── conftest.py
│   ├── test_view_counter.py
│   └── requirements-dev.txt
└── .envrc                 # Cloudflare env vars (gitignored)
```

## Environment variables

Using direnv to auto-load Cloudflare creds:

```bash
# Create .envrc in azure/ directory
cat > .envrc << 'EOF'
export CLOUDFLARE_API_TOKEN="your-token-here"
export CLOUDFLARE_ZONE_ID="your-zone-id-here"
EOF

# Allow direnv to load it
direnv allow .
```

Now terraform commands in this folder auto-load the creds. No more exporting manually.

## Resources

### terraform-backend

| Resource | Service | Purpose |
|----------|---------|---------|
| Resource Group | Azure | Container for everything |
| Storage Account | Azure Storage | Function app storage + static site hosting |
| Function App | Azure Functions | Python serverless API |
| CosmosDB Account | Azure CosmosDB | NoSQL database |
| App Service Plan | Azure | Consumption plan (pay per execution) |

### terraform-frontend

| Resource | Service | Purpose |
|----------|---------|---------|
| DNS Zone | Cloudflare | Already exists, just manages records |
| A/CNAME Records | Cloudflare | Points to Azure Storage static site |
| SSL | Cloudflare | Free cert, auto-renewed |

## Deployment

### Backend (Functions + CosmosDB)

```bash
cd terraform-backend
terraform plan    # preview
terraform apply   # deploy
```

### Frontend (Cloudflare DNS)

```bash
cd terraform-frontend
terraform plan
terraform apply
```

### Upload React build

```bash
# Build frontend
cd ../frontend && npm run build

# Upload to Azure Storage $web container
az storage blob upload-batch \
  -d '$web' \
  -s dist/ \
  --account-name <storage-account-name> \
  --overwrite
```

Replace `<storage-account-name>` with output from terraform.

## Tests

```bash
pip install -r tests/requirements-dev.txt
pytest tests/ -v
```

## CI/CD

GitHub Actions in `.github/workflows/`:

| Workflow | Trigger | What happens |
|----------|---------|--------------|
| `backend-azure.yaml` | Push to `azure/function/**`, `azure/tests/**` | Test → Deploy Function |
| `frontend-azure.yaml` | Push to `frontend/**`, `backend/data/**` | Build → Azure Storage → Cloudflare cache purge |

Required GitHub secrets:
- `AZURE_CREDENTIALS` - service principal JSON
- `AZURE_STORAGE_ACCOUNT`
- `AZURE_FUNCTION_APP_NAME`
- `AZURE_API_ENDPOINT`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_API_TOKEN`

## Outputs

### Backend

```bash
cd terraform-backend && terraform output
```

```
function_api_endpoint = "https://func-xxx.azurewebsites.net/api/view_counter"
cosmosdb_endpoint     = "https://cosmos-xxx.documents.azure.com:443/"
storage_account_name  = "stxxx"
```

### Frontend

```bash
cd terraform-frontend && terraform output
```

```
website_url = "https://fazabillah.my"
www_url     = "https://www.fazabillah.my"
```

## Terraform state

State files are local by default (`.tfstate`). This is fine for personal projects.

For teams or if you want backup, use remote backend:

```hcl
# Add to main.tf
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatexxxx"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

Then `terraform init` to migrate.

**Warning**: `.tfstate` files contain sensitive data. Never commit them. They're gitignored.

## Cost

Almost free on consumption tier:

- **Azure Functions**: Free tier covers 1M requests/month
- **CosmosDB**: Serverless, pennies for low traffic
- **Azure Storage**: ~$0.02/month
- **Cloudflare**: Free tier

Total: under $1/month for a portfolio site.

## Troubleshooting

### Terraform provider errors

```bash
terraform init -upgrade
```

Upgrades providers to latest compatible versions.

### Cloudflare API errors

Check `.envrc` has valid token:
```bash
echo $CLOUDFLARE_API_TOKEN
```

Token needs "Edit zone DNS" permission on your zone.

### Function not responding

```bash
# Check logs
az functionapp log stream --name <function-app-name> --resource-group <rg>

# Restart the function
az functionapp restart --name <function-app-name> --resource-group <rg>
```

### CosmosDB connection errors

Check connection string in Function App settings:
```bash
az functionapp config appsettings list --name <func-name> --resource-group <rg>
```

Should have `COSMOS_CONNECTION_STRING` or similar.

### State file corruption

If terraform state gets messed up:
```bash
# Import existing resource (if it exists in Azure but not in state)
terraform import azurerm_resource_group.main /subscriptions/<sub>/resourceGroups/<name>

# Or start fresh (destroys everything!)
terraform destroy
rm terraform.tfstate*
terraform apply
```

### CORS issues

Function app needs CORS configured for your domain. Check:
```bash
az functionapp cors show --name <func-name> --resource-group <rg>
```

Should include `https://fazabillah.my` and `https://www.fazabillah.my`.
