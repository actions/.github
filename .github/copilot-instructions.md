# Copilot Instructions

## Project Overview

This is a `.github` organization repository that provides default community health files, GitHub Actions workflows, and Linux system setup scripts for the `cashpilotthrive-hue` organization.

## Repository Structure

- `setup.sh` / `install.sh` — Main setup and quick-install entry points
- `scripts/` — Modular shell scripts for packages, dev tools, dotfiles, and system config
- `dotfiles/` — Shell, editor, and terminal configuration files
- `config/` — Package lists and other configuration data
- `.github/workflows/` — CI/CD and automation workflows

## Coding Conventions

- All shell scripts use `#!/bin/bash` and `set -e`
- Variables are quoted: `"$VAR"` not `$VAR`
- Scripts support multiple package managers: apt (Debian/Ubuntu), dnf (Fedora), pacman (Arch)
- Idempotent operations — scripts check before acting (e.g., `command -v` before installing)
- Colored output uses ANSI escape codes via variables (`$RED`, `$GREEN`, `$YELLOW`, `$NC`)

## Workflow Conventions

- Workflows use `permissions: contents: read` (least privilege)
- Use `actions/checkout@v3` for repository checkout
- Keep workflow `on:` triggers explicit and minimal

## Testing

- Shell script syntax is validated with `bash -n`
- Repository structure is validated in CI (directories, required files)
- Full installation testing requires a real Linux system and is not run in CI

## Security

- Never commit secrets or credentials
- Workflow permissions should follow least privilege
- Review third-party actions before use
