#!/bin/bash
# Quick install script for personal Linux system setup
# Usage: curl -fsSL https://raw.githubusercontent.com/cashpilotthrive-hue/.github/main/install.sh | bash

set -e

REPO_URL="https://github.com/cashpilotthrive-hue/.github.git"
INSTALL_DIR="$HOME/.personal-linux-setup"

echo "================================"
echo "Personal Linux System Setup"
echo "Quick Install Script"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first:"
    echo "  Ubuntu/Debian: sudo apt install git"
    echo "  Fedora: sudo dnf install git"
    echo "  Arch: sudo pacman -S git"
    exit 1
fi

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    echo "Directory $INSTALL_DIR already exists. Updating..."
    cd "$INSTALL_DIR"
    if ! git pull --ff-only; then
        echo "Warning: Could not fast-forward update. Local changes may exist."
        echo "Please manually resolve conflicts or run: git reset --hard origin/main"
    fi
else
    echo "Cloning repository to $INSTALL_DIR..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Make scripts executable
chmod +x setup.sh

# Only attempt to chmod scripts if the directory exists and contains .sh files
if [ -d "scripts" ]; then
    # Ensure unmatched globs expand to nothing instead of the literal pattern
    shopt -s nullglob
    script_files=(scripts/*.sh)
    if ((${#script_files[@]})); then
        chmod +x "${script_files[@]}"
    fi
    shopt -u nullglob
fi

echo ""
echo "Repository cloned successfully!"
echo ""
echo "To complete the setup, run:"
echo "  cd $INSTALL_DIR"
echo "  ./setup.sh"
echo ""
echo "Or to review first:"
echo "  cd $INSTALL_DIR"
echo "  cat README.md"
echo "  cat USAGE.md"
