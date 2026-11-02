#!/bin/bash
set -e

echo "Configuring system settings..."

# Set git to use main as default branch
git config --global init.defaultBranch main

# Enable colored output for common commands
git config --global color.ui auto

# Set vim as default editor
git config --global core.editor vim

# Configure git to cache credentials for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# BOLT OPTIMIZATION: Reduce process forks by reading .bashrc once and using internal regex matching.
# This avoids 11+ grep calls, significantly improving performance on warm runs.
BASHRC_FILE="$HOME/.bashrc"
touch "$BASHRC_FILE"
# Read file into variable, preserving newlines
BASHRC_CONTENT=$(cat "$BASHRC_FILE")
NL=$'\n'

# Create useful aliases
if [[ ! "$BASHRC_CONTENT" =~ "# Custom aliases" ]]; then
    echo "" >> "$BASHRC_FILE"
    echo "# Custom aliases" >> "$BASHRC_FILE"
    # Update local content to reflect changes
    BASHRC_CONTENT+="${NL}${NL}# Custom aliases"
fi

# List of aliases to ensure
ALIASES=(
    "ll='ls -alF'"
    "la='ls -A'"
    "l='ls -CF'"
    "..='cd ..'"
    "...='cd ../..'"
    "gs='git status'"
    "ga='git add'"
    "gc='git commit'"
    "gp='git push'"
    "gl='git log --oneline --graph --decorate'"
)

for alias_str in "${ALIASES[@]}"; do
    # Extract alias name (everything before '=')
    name="${alias_str%%=*}"
    # Escape dots for regex matching (e.g., '..' -> '\.\.')
    escaped_name="${name//./\\.}"
    # Match alias at start of file or after a newline
    pattern="(^|$NL)[[:space:]]*alias[[:space:]]+$escaped_name="

    if [[ ! "$BASHRC_CONTENT" =~ $pattern ]]; then
        echo "alias $alias_str" >> "$BASHRC_FILE"
    fi
done

# Set up SSH directory with proper permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh
[ -f ~/.ssh/config ] || touch ~/.ssh/config
chmod 600 ~/.ssh/config

echo "✓ System configuration complete"
