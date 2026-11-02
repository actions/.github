#!/bin/bash
set -e

PKG_MANAGER=${1:-apt}

echo "Installing development tools..."

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    case "$PKG_MANAGER" in
        apt)
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        dnf)
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo dnf install -y nodejs
            ;;
        pacman)
            sudo pacman -S --noconfirm nodejs npm
            ;;
    esac
else
    echo "Node.js already installed: $(node --version)"
fi

# Install Python 3 and pip
if ! command -v python3 &> /dev/null; then
    echo "Installing Python 3..."
    case "$PKG_MANAGER" in
        apt)
            sudo apt-get install -y python3 python3-pip python3-venv
            ;;
        dnf)
            sudo dnf install -y python3 python3-pip
            ;;
        pacman)
            sudo pacman -S --noconfirm python python-pip
            ;;
    esac
else
    echo "Python 3 already installed: $(python3 --version)"
fi

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    case "$PKG_MANAGER" in
        apt)
            curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
            sudo sh /tmp/get-docker.sh
            sudo usermod -aG docker $USER
            rm /tmp/get-docker.sh
            ;;
        dnf)
            sudo dnf install -y docker
            sudo systemctl start docker
            sudo systemctl enable docker
            sudo usermod -aG docker $USER
            ;;
        pacman)
            sudo pacman -S --noconfirm docker
            sudo systemctl start docker
            sudo systemctl enable docker
            sudo usermod -aG docker $USER
            ;;
    esac
else
    echo "Docker already installed: $(docker --version)"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    # Fetch the latest stable version from GitHub API
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/' || echo "v2.24.5")
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed: $(docker-compose --version)"
fi

# Install GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "Installing GitHub CLI..."
    case "$PKG_MANAGER" in
        apt)
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y gh
            ;;
        dnf)
            sudo dnf install -y 'dnf-command(config-manager)'
            sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
            sudo dnf install -y gh
            ;;
        pacman)
            sudo pacman -S --noconfirm github-cli
            ;;
    esac
else
    echo "GitHub CLI already installed: $(gh --version | head -n1)"
fi

echo "✓ Development tools installed successfully"

# Important notice about Docker group
if command -v docker &> /dev/null; then
    echo ""
    echo "NOTE: You were added to the 'docker' group."
    echo "      To use Docker without sudo, please log out and log back in,"
    echo "      or run: newgrp docker"
fi
