# Revenue Tooling Setup (GitHub-Driven)

This repository now includes a production-oriented setup pattern to automate revenue tooling checks through GitHub Actions.

## What was added

- `scripts/configure-revenue-tools.sh`: One-command bootstrap to configure repo secrets and variables via GitHub CLI.
- `.github/workflows/revenue-ops.yml`: Scheduled + on-demand workflow for provider health and reconciliation stubs.

## 1) Authenticate GitHub CLI

```bash
gh auth login
```

## 2) Export configuration values locally

Set only the providers you actually use.

```bash
# Sensitive secrets
export STRIPE_API_KEY="sk_live_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
export PADDLE_API_KEY="pdl_live_..."
export GUMROAD_ACCESS_TOKEN="..."
export SHOPIFY_ADMIN_API_TOKEN="..."
export HUBSPOT_API_KEY="..."
export POSTHOG_API_KEY="..."
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Non-sensitive variables
export BILLING_PROVIDER="stripe"
export BILLING_ENVIRONMENT="production"
export CRM_PROVIDER="hubspot"
export ANALYTICS_PROVIDER="posthog"
export DEFAULT_CURRENCY="USD"
export REVENUE_ALERT_THRESHOLD="1000"
```

## 3) Apply configuration to your target repository

```bash
./scripts/configure-revenue-tools.sh <owner/repo>
```

Example:

```bash
./scripts/configure-revenue-tools.sh cashpilotthrive-hue/my-saas-repo
```

## 4) Run automation

In GitHub, go to **Actions → Revenue Ops Automation → Run workflow** and choose `production` or `staging`.

## Professional methodology baked into this setup

- **Least privilege by default**: workflow uses read-only repository permissions.
- **Idempotent config**: setup script only applies values present in your shell.
- **Controlled execution**: hourly schedule + manual dispatch for operational flexibility.
- **Environment separation**: workflow uses environment-scoped execution.
- **Progressive integration**: provider checks are optional and activate only if secrets are configured.

## Recommended next steps

- Add your own reconciliation script in `settlement-reconciliation` job.
- Add alerting action for failed health checks.
- Store audit artifacts (daily summaries) using workflow artifacts.
