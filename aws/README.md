# AWS Infrastructure

CloudFormation + SAM templates with Ansible deployment automation.

**Live**: [fazabillah.com](https://fazabillah.com)

## Architecture

```
                        ┌─────────────────┐
                        │    Browser      │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                   1    │   Route 53      │  DNS lookup
                        │  (fazabillah.com)│
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                   2    │   CloudFront    │  CDN + HTTPS
                        │   (edge cache)  │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                                     │
              ▼                                     ▼
     ┌─────────────────┐                   ┌─────────────────┐
  3a │       S3        │                3b │  API Gateway    │
     │  (React build)  │                   │   GET /count    │
     └─────────────────┘                   └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                        4  │     Lambda      │
                                           │  (Python 3.12)  │
                                           └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                        5  │    DynamoDB     │
                                           │  (view counter) │
                                           └─────────────────┘
```

Static files (3a) and API calls (3b-5) go through the same CloudFront distribution but hit different origins.

## Why CloudFormation + SAM

Could've used Terraform. Chose CloudFormation because:

- **Native to AWS** - no extra tooling to install or state files to manage
- **Better AWS integration** - rollback on failure, drift detection, change sets work well
- **SAM for Lambda** - adds shortcuts for serverless stuff without learning new syntax

The downside is CloudFormation is verbose and AWS-only. For multi-cloud you'd want Terraform. But for this project staying native felt cleaner.

SAM specifically helps because defining a Lambda + API Gateway + DynamoDB in raw CloudFormation is painful. SAM's `AWS::Serverless::Function` does it in like 15 lines.

## Why Ansible for deployment

Ansible sits on top of CloudFormation. It handles:

- **Secrets** - Ansible Vault encrypts AWS credentials. No plaintext keys in repo
- **Orchestration** - deploys CloudFormation, builds frontend, uploads to S3, invalidates cache in sequence
- **Idempotent** - run playbooks repeatedly without breaking things

Couldve used bash scripts but they get messy fast. Ansible playbooks are readable and I can reuse them across projects.

## Prerequisites

Install these first:

```bash
# Ansible via pipx (keeps it isolated)
pipx install --include-deps ansible
pipx inject ansible boto3 botocore

# AWS collections for Ansible
ansible-galaxy collection install amazon.aws community.aws

# AWS CLI
brew install awscli  # or your package manager
aws configure        # enter your access key + secret
```

Make sure `aws sts get-caller-identity` returns your account. If not, credentials are wrong.

## Quick start

```bash
# 1. Deploy frontend infra (S3, CloudFront, Route 53, ACM cert)
./bin/deploy

# 2. Deploy backend (Lambda + API Gateway + DynamoDB)
./bin/deploy-backend-counter

# 3. Build React and upload to S3
./bin/upload

# 4. Test the API
./bin/test-backend
```

First deploy takes 10-15 minutes. ACM certificate validation is the slow part.

## Project structure

```
aws/
├── frontend.yaml             # CloudFormation: S3, CloudFront, Route 53, ACM
├── backend-counter.yaml      # SAM: Lambda, API Gateway, DynamoDB
├── src/
│   └── counter/
│       ├── app.py            # Lambda function (Python 3.12)
│       └── requirements.txt
├── tests/
│   ├── conftest.py           # pytest fixtures
│   ├── test_counter.py       # Lambda unit tests
│   └── requirements-dev.txt
├── playbooks/
│   ├── deploy.yaml           # Frontend deployment playbook
│   ├── deploy-backend-counter.yaml
│   ├── upload.yaml           # S3 upload + CloudFront invalidation
│   ├── invalidate.yaml       # Cache invalidation only
│   └── vaults/
│       └── prod.yaml         # Encrypted secrets (Ansible Vault)
└── bin/
    ├── deploy                # Deploy frontend stack
    ├── deploy-backend-counter
    ├── upload                # Build + upload + invalidate
    ├── invalidate            # Invalidate cache only
    └── test-backend          # Test Lambda endpoint
```

## Deployment scripts

| Script | What it does |
|--------|--------------|
| `./bin/deploy` | Creates/updates CloudFormation frontend stack |
| `./bin/deploy-backend-counter` | Deploys SAM backend (Lambda + DynamoDB) |
| `./bin/upload` | Builds React, syncs to S3, invalidates CloudFront |
| `./bin/invalidate` | Just invalidates CloudFront cache |
| `./bin/test-backend` | Curls the Lambda API to verify its working |

## Tests

```bash
pip install -r tests/requirements-dev.txt
pytest tests/ -v
```

Uses moto to mock AWS services. No real AWS calls during tests.

## CI/CD

GitHub Actions in `.github/workflows/`:

| Workflow | Trigger | What happens |
|----------|---------|--------------|
| `backend-aws.yaml` | Push to `aws/src/**`, `aws/tests/**` | Run tests → SAM deploy |
| `frontend-aws.yaml` | Push to `frontend/**`, `backend/data/**` | Build → S3 upload → CloudFront invalidate |

Required secrets in GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_ID`
- `AWS_API_ENDPOINT`

## CloudFormation resources

### frontend.yaml

| Resource | Type | Purpose |
|----------|------|---------|
| HostedZone | Route 53 | DNS zone for domain |
| Certificate | ACM | SSL/TLS cert (auto-validated via DNS) |
| ResumeBucket | S3 | Private bucket for React build |
| CloudFrontOAC | CloudFront | Origin Access Control for S3 |
| CloudFrontDistribution | CloudFront | CDN with HTTPS |
| DNSRecord | Route 53 | A record pointing to CloudFront |

### backend-counter.yaml (SAM)

| Resource | Type | Purpose |
|----------|------|---------|
| CounterTable | DynamoDB | Stores view count |
| CounterFunction | Lambda | Python handler |
| CounterApi | API Gateway | REST API with CORS |

## Ansible Vault

Secrets live in `playbooks/vaults/prod.yaml`. Encrypted at rest.

```bash
# Edit secrets (opens in $EDITOR)
ansible-vault edit playbooks/vaults/prod.yaml

# View without editing
ansible-vault view playbooks/vaults/prod.yaml

# Change password
ansible-vault rekey playbooks/vaults/prod.yaml
```

The vault password is prompted when running playbooks. Or set `ANSIBLE_VAULT_PASSWORD_FILE` to automate.

## Troubleshooting

### boto3 not found

```bash
pipx inject ansible boto3
pipx inject ansible botocore
```

Ansible needs boto3 in its environment. If you installed via pip instead of pipx, just `pip install boto3`.

### Certificate pending validation

ACM validates via DNS. After stack creates the cert, it adds a CNAME to Route 53 automatically. Can take 5-30 minutes. Sometimes longer.

Check status:
```bash
aws acm describe-certificate --certificate-arn <arn> --query 'Certificate.Status'
```

If stuck on PENDING_VALIDATION for over an hour, the DNS record might not be propagating. Check Route 53 has the validation CNAME.

### CloudFront 403 errors

Usually means S3 bucket policy doesnt allow CloudFront OAC access. The template should set this up but sometimes updates dont propagate.

Fix: redeploy the stack or manually check the S3 bucket policy includes CloudFront's service principal.

### Lambda cold starts

First request after idle might be slow (1-2 seconds). Normal for Lambda. If it bothers you, enable provisioned concurrency but thats overkill for a portfolio site.

### CloudFront still serving old content

Cache takes time to expire. Force it:
```bash
./bin/invalidate
```

Or wait. Default TTL is 24 hours for most files.

### Stack rollback failed

If CloudFormation gets stuck in ROLLBACK_FAILED:
```bash
aws cloudformation delete-stack --stack-name cloud-resume
```

Then redeploy. Usually happens if you manually deleted a resource that CloudFormation was tracking.

## Outputs

After deployment:
```bash
aws cloudformation describe-stacks --stack-name cloud-resume --query 'Stacks[0].Outputs'
```

Key outputs:
- `WebsiteURL` - live site URL
- `ApiEndpoint` - Lambda API URL
- `CloudFrontDistributionId` - for cache invalidation
