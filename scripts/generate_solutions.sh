#!/usr/bin/env bash
set -euo pipefail

DOMAIN="$(tr -d '\r\n' < CNAME)"
TARGET="${GITHUB_PAGES_TARGET:-<org-or-user>.github.io}"
OUT_DIR="generated"
mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/solutions.md" <<MD
# Domain solutions for ${DOMAIN}

## 1) Apex on GitHub Pages
- Keep CNAME as ${DOMAIN}
- Configure DNS A records to:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

## 2) www + apex redirect
- Set CNAME to www.${DOMAIN}
- Set www CNAME to ${TARGET}
- Redirect apex ${DOMAIN} to https://www.${DOMAIN}

## 3) Cloudflare flattening
- Keep CNAME as ${DOMAIN}
- Use CNAME flattening for apex to ${TARGET}
- Start with DNS-only until SSL validates
MD

cat > "$OUT_DIR/solutions.json" <<JSON
{
  "domain": "${DOMAIN}",
  "target": "${TARGET}",
  "solutions": [
    {"id": "apex-pages", "name": "Apex GitHub Pages A-records"},
    {"id": "www-redirect", "name": "www subdomain + apex redirect"},
    {"id": "cloudflare-flat", "name": "Cloudflare CNAME flattening"}
  ]
}
JSON

echo "Generated $OUT_DIR/solutions.md and $OUT_DIR/solutions.json"
