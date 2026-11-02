#!/usr/bin/env bash

set -euo pipefail

REPO="${1:-}"

if [[ -z "$REPO" ]]; then
  echo "Usage: $0 <owner/repo>"
  echo "Example: $0 cashpilotthrive-hue/my-saas-repo"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is required. Install gh and authenticate first."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh is not authenticated. Run: gh auth login"
  exit 1
fi

# Create temporary files for batching
SECRETS_FILE=$(mktemp)
VARS_FILE=$(mktemp)
chmod 600 "$SECRETS_FILE" "$VARS_FILE"

# Ensure cleanup on exit
trap 'rm -f "$SECRETS_FILE" "$VARS_FILE"' EXIT

add_to_batch() {
  local name="$1"
  local type="$2" # "secret" or "var"
  local value="${!name:-}"

  if [[ -n "$value" ]]; then
    # Escape double quotes for .env format
    local escaped_value="${value//\"/\\\"}"
    if [[ "$type" == "secret" ]]; then
      printf '%s="%s"\n' "$name" "$escaped_value" >> "$SECRETS_FILE"
      echo "+ Batched secret: $name"
    else
      printf '%s="%s"\n' "$name" "$escaped_value" >> "$VARS_FILE"
      echo "+ Batched variable: $name"
    fi
  else
    echo "- Skipped $type: $name (env var not provided)"
  fi
}

echo "Configuring revenue tooling for $REPO"

echo "Batching provider secrets (if available in your shell environment)..."
add_to_batch STRIPE_API_KEY secret
add_to_batch STRIPE_WEBHOOK_SECRET secret
add_to_batch PADDLE_API_KEY secret
add_to_batch GUMROAD_ACCESS_TOKEN secret
add_to_batch SHOPIFY_ADMIN_API_TOKEN secret
add_to_batch HUBSPOT_API_KEY secret
add_to_batch POSTHOG_API_KEY secret
add_to_batch SLACK_WEBHOOK_URL secret

echo "Batching non-sensitive configuration variables..."
add_to_batch BILLING_PROVIDER var
add_to_batch BILLING_ENVIRONMENT var
add_to_batch CRM_PROVIDER var
add_to_batch ANALYTICS_PROVIDER var
add_to_batch DEFAULT_CURRENCY var
add_to_batch REVENUE_ALERT_THRESHOLD var

# BOLT OPTIMIZATION: Batch GitHub CLI calls using the -f flag to reduce process forks.
# This reduces the number of 'gh' calls from N to 2, significantly improving performance.
if [[ -s "$SECRETS_FILE" ]]; then
  echo "Applying batched secrets..."
  gh secret set --repo "$REPO" -f "$SECRETS_FILE"
  echo "✓ Secrets applied successfully"
fi

if [[ -s "$VARS_FILE" ]]; then
  echo "Applying batched variables..."
  gh variable set --repo "$REPO" -f "$VARS_FILE"
  echo "✓ Variables applied successfully"
fi

echo "Done."
echo "Next: run the workflow '.github/workflows/revenue-ops.yml' from the Actions tab."
