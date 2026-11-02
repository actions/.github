# Personal Linux System Setup

This repository contains scripts and configurations for setting up a personal Linux development environment.

## Features

- 🚀 Automated package installation
- 🛠️ Development tools configuration
- ⚙️ System dotfiles (bash, git, vim)
- 🔒 Security hardening
- 📦 Package manager support (apt, dnf, pacman)

## Quick Start

```bash
# Clone this repository
git clone https://github.com/cashpilotthrive-hue/.github.git
cd .github

# Run the main setup script
chmod +x setup.sh
./setup.sh
```

## What Gets Installed

### Essential Packages
- curl, wget, git
- build-essential / Development Tools
- vim/neovim, tmux
- htop, tree, ncdu

### Development Tools
- Node.js & npm
- Python 3 & pip
- Docker & Docker Compose
- GitHub CLI (gh)

### Optional Tools
- Terraform
- kubectl


## Revenue Tooling Automation

Use `scripts/configure-revenue-tools.sh` to provision revenue/CRM/analytics secrets and variables in a target GitHub repository, then run `.github/workflows/revenue-ops.yml` for scheduled health checks and reconciliation scaffolding. See `REVENUE_TOOLING_SETUP.md`.

## Customization

Edit `config/packages.txt` to add or remove packages.
Modify dotfiles in the `dotfiles/` directory to customize your environment.

## Structure

```
.
├── setup.sh                        # Main setup script
├── install.sh                      # Quick one-line installer
├── scripts/                        # Individual setup scripts
│   ├── install-packages.sh
│   ├── install-devtools.sh
│   ├── setup-dotfiles.sh
│   ├── configure-system.sh
│   └── configure-revenue-tools.sh
├── dotfiles/                       # Configuration files
│   ├── .bashrc
│   ├── .gitconfig
│   ├── .vimrc
│   └── .tmux.conf
├── config/                         # Configuration data
│   └── packages.txt
└── .github/                        # GitHub configuration
    ├── workflows/
    │   ├── test-setup.yml
    │   └── revenue-ops.yml
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── config.yml
    ├── copilot-instructions.md
    ├── dependabot.yml
    ├── FUNDING.yml
    └── pull_request_template.md
```

## Requirements

- Ubuntu 20.04+ / Debian 11+ / Fedora 35+ / Arch Linux
- sudo privileges
- Internet connection

## License

MIT License - Feel free to use and modify for your personal needs.
