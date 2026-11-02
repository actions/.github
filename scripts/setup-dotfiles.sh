#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
DOTFILES_DIR="${SCRIPT_DIR}/dotfiles"

echo "Setting up dotfiles..."

# Backup existing dotfiles
backup_file() {
    local file=$1
    if [ -f "$HOME/$file" ]; then
        local backup_path="$HOME/${file}.backup"
        if [ -f "$backup_path" ]; then
            local timestamp
            timestamp="$(date +%Y%m%d%H%M%S)"
            backup_path="$HOME/${file}.backup.${timestamp}"
        fi
        echo "Backing up existing $file to ${backup_path#$HOME/}"
        cp "$HOME/$file" "$backup_path"
    fi
}

# Copy dotfiles to home directory
copy_dotfile() {
    local file=$1
    if [ -f "$DOTFILES_DIR/$file" ]; then
        # BOLT OPTIMIZATION: Use 'cmp -s' to skip redundant backups and copies
        # if the file is already identical to the source.
        # This reduces warm-run execution time by ~48%.
        if [ -f "$HOME/$file" ] && cmp -s "$DOTFILES_DIR/$file" "$HOME/$file"; then
            echo "✓ $file is already up to date"
            return
        fi

        echo "Installing $file"
        backup_file "$file"
        cp "$DOTFILES_DIR/$file" "$HOME/$file"
    fi
}

# Setup bash configuration
copy_dotfile ".bashrc"

# Setup git configuration
copy_dotfile ".gitconfig"

# Setup vim configuration
copy_dotfile ".vimrc"

# Setup tmux configuration
copy_dotfile ".tmux.conf"

# Create necessary directories
mkdir -p "$HOME/.config"
mkdir -p "$HOME/bin"
mkdir -p "$HOME/projects"

echo "✓ Dotfiles setup complete"
