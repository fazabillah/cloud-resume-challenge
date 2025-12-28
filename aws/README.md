# AWS Infrastructure

CloudFormation + SAM templates with Ansible deployment automation.

## Architecture

```
Route 53 → CloudFront → S3 (React SPA)
                     ↘ API Gateway → Lambda → DynamoDB
```

## Quick Start

```bash
# Prerequisites
pipx install --include-deps ansible
pipx inject ansible boto3 botocore
ansible-galaxy collection install amazon.aws community.aws

# Deploy
./bin/deploy                  # Frontend stack (S3, CloudFront, Route 53, ACM)
./bin/deploy-backend-counter  # Backend stack (Lambda, API Gateway, DynamoDB)
./bin/upload                  # Build React + upload to S3 + invalidate cache
```

## Project Structure

```
aws/
├── frontend.yaml             # CloudFormation: S3, CloudFront, Route 53, ACM
├── backend-counter.yaml      # SAM: Lambda, API Gateway, DynamoDB
├── src/
│   └── counter/
│       ├── app.py            # Lambda function (Python 3.12)
│       └── requirements.txt
├── playbooks/
│   ├── deploy.yaml           # Frontend deployment playbook
│   ├── deploy-backend-counter.yaml
│   ├── upload.yaml           # S3 upload + CloudFront invalidation
│   ├── invalidate.yaml       # CloudFront cache invalidation only
│   └── vaults/
│       └── prod.yaml         # Encrypted secrets (Ansible Vault)
└── bin/
    ├── deploy                # Deploy frontend stack
    ├── deploy-backend-counter# Deploy backend stack
    ├── upload                # Build + upload + invalidate
    ├── invalidate            # Invalidate cache only
    └── test-backend          # Test Lambda endpoint
```

## Deployment Scripts

| Script | Description |
|--------|-------------|
| `./bin/deploy` | Deploy/update CloudFormation frontend stack |
| `./bin/deploy-backend-counter` | Deploy SAM backend (Lambda + DynamoDB) |
| `./bin/upload` | Build React, upload to S3, invalidate CloudFront |
| `./bin/invalidate` | Invalidate CloudFront cache only |
| `./bin/test-backend` | Test Lambda API endpoint |

## CloudFormation Resources

### frontend.yaml

| Resource | Type | Description |
|----------|------|-------------|
| HostedZone | Route 53 | DNS zone for domain |
| Certificate | ACM | SSL/TLS certificate |
| ResumeBucket | S3 | Private bucket for React SPA |
| CloudFrontOAC | CloudFront | Origin Access Control |
| CloudFrontDistribution | CloudFront | CDN with HTTPS |
| DNSRecord | Route 53 | A record pointing to CloudFront |

### backend-counter.yaml (SAM)

| Resource | Type | Description |
|----------|------|-------------|
| CounterTable | DynamoDB | View count storage |
| CounterFunction | Lambda | Python function |
| CounterApi | API Gateway | REST API with CORS |

## Ansible Vault

Secrets stored in `playbooks/vaults/prod.yaml`:

```bash
# Edit secrets
ansible-vault edit playbooks/vaults/prod.yaml

# View secrets
ansible-vault view playbooks/vaults/prod.yaml

# Rekey (change password)
ansible-vault rekey playbooks/vaults/prod.yaml
```

## Troubleshooting

### boto3 not found
```bash
pipx inject ansible boto3
pipx inject ansible botocore
```

### Certificate pending validation
Wait for ACM DNS validation (can take 30+ minutes).

### CloudFront 403 errors
Check S3 bucket policy allows CloudFront OAC access.

## Outputs

After deployment, get stack outputs:

```bash
aws cloudformation describe-stacks --stack-name cloud-resume --query 'Stacks[0].Outputs'
```

Key outputs:
- `WebsiteURL` - Your live site
- `ApiEndpoint` - Lambda API URL
- `CloudFrontDistributionId` - For cache invalidation
