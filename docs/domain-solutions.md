# aime.io domain solutions

This repo includes **multiple usable deployment solutions** for `aime.io` and automates testing + deployment.

## Solution 1: Apex domain on GitHub Pages (recommended)
- Keep `CNAME` set to `aime.io`.
- At DNS provider, point apex records to GitHub Pages IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Enable HTTPS in GitHub Pages settings.

## Solution 2: `www` subdomain + redirect apex
- Set `CNAME` to `www.aime.io`.
- DNS:
  - `www` CNAME -> `<org-or-user>.github.io`
  - apex (`aime.io`) URL redirect -> `https://www.aime.io`

## Solution 3: Cloudflare proxied setup
- Keep `CNAME` as `aime.io`.
- In Cloudflare DNS:
  - apex CNAME flattening -> `<org-or-user>.github.io`
  - Proxy status: DNS only while validating SSL, then optionally proxied.

## Automation (real-time)
Workflow: `.github/workflows/domain-realtime.yml`
- Runs on push, PR, manual dispatch, and every 5 minutes.
- Generates multiple provider snippets.
- Executes `./scripts/test_domain.sh`.
- Generates solution outputs via `./scripts/generate_solutions.sh`.
- Publishes a live status payload (`site/status.json`) and solution files to GitHub Pages.
