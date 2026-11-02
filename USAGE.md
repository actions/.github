# Usage Guide

This guide provides detailed instructions for using the Personal Linux System Setup.

## Prerequisites

Before running the setup script, ensure you have:

- A clean Linux installation (Ubuntu, Debian, Fedora, or Arch Linux)
- Sudo privileges on your system
- Active internet connection
- At least 2GB of free disk space

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/cashpilotthrive-hue/.github.git
cd .github
```

### 2. Review Configuration

Before running the setup, review and customize:

- `config/packages.txt` - List of packages to install
- `dotfiles/.gitconfig` - Update your name and email
- `dotfiles/.bashrc` - Customize aliases and environment variables

### 3. Run the Setup

Execute the main setup script:

```bash
chmod +x setup.sh
./setup.sh
```

The script will:
1. Update system packages
2. Install essential tools
3. Install development tools
4. Configure dotfiles
5. Apply system settings

### 4. Post-Installation

After the setup completes:

```bash
# Reload bash configuration
source ~/.bashrc

# Verify installations
node --version
python3 --version
docker --version
gh --version

# Test Docker (requires logout/login for group changes)
docker run hello-world
```

## Individual Scripts

You can also run individual setup scripts:

### Install Packages Only

```bash
./scripts/install-packages.sh apt  # for Ubuntu/Debian
./scripts/install-packages.sh dnf  # for Fedora
./scripts/install-packages.sh pacman  # for Arch Linux
```

### Install Development Tools Only

```bash
./scripts/install-devtools.sh apt
```

### Setup Dotfiles Only

```bash
./scripts/setup-dotfiles.sh
```

### Configure System Settings Only

```bash
./scripts/configure-system.sh
```

## Customization

### Adding More Packages

Edit `config/packages.txt` and add one package per line:

```
# Your custom packages
htop
neofetch
ripgrep
```

### Customizing Dotfiles

The dotfiles are located in the `dotfiles/` directory:

- `.bashrc` - Bash configuration, aliases, and functions
- `.gitconfig` - Git configuration and aliases
- `.vimrc` - Vim editor configuration
- `.tmux.conf` - Tmux terminal multiplexer configuration

Edit these files before running the setup, or edit them in your home directory after installation.

### Modifying Installation Scripts

Each script in the `scripts/` directory can be modified to suit your needs:

- `install-packages.sh` - Core system packages
- `install-devtools.sh` - Development tools (Node, Python, Docker, etc.)
- `setup-dotfiles.sh` - Dotfile installation logic
- `configure-system.sh` - System configuration and settings

## Troubleshooting

### Script Fails with Permission Error

Ensure you have sudo privileges:

```bash
sudo -v
```

### Package Not Found

Update your package manager cache:

```bash
# Ubuntu/Debian
sudo apt update

# Fedora
sudo dnf check-update

# Arch Linux
sudo pacman -Sy
```

### Docker Permission Denied

After installing Docker, you need to logout and login again for group changes to take effect:

```bash
# Or restart your terminal session
newgrp docker
```

### Dotfile Conflicts

The setup script automatically backs up existing dotfiles with a `.backup` extension. To restore:

```bash
cp ~/.bashrc.backup ~/.bashrc
```

## Advanced Usage

### Selective Installation

You can comment out sections in the main `setup.sh` script to skip certain steps:

```bash
# Edit setup.sh and comment out unwanted steps
vim setup.sh
```

### Running on Multiple Machines

To use these dotfiles across multiple machines:

1. Fork this repository
2. Customize the dotfiles for your preferences
3. Clone on each machine and run the setup

### Keeping Dotfiles in Sync

After initial setup, you can update dotfiles by pulling changes:

```bash
cd ~/.github
git pull
./scripts/setup-dotfiles.sh
```

## Security Considerations

- Review all scripts before running them with sudo
- The setup script requires internet access to download packages
- Docker installation adds your user to the docker group (potential security implications)
- All downloaded scripts are from official sources

## Uninstallation

To remove installed packages:

```bash
# Ubuntu/Debian
sudo apt remove <package-name>

# To restore original dotfiles
cp ~/.bashrc.backup ~/.bashrc
cp ~/.gitconfig.backup ~/.gitconfig
# ... repeat for other dotfiles
```

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Ensure your system meets the prerequisites
3. Verify internet connectivity
4. Check the GitHub Actions workflow results for CI test status

## Next Steps

After installation, consider:

- Setting up SSH keys for GitHub: `ssh-keygen -t ed25519`
- Configuring your development environment
- Installing additional language-specific tools
- Setting up your favorite IDE or editor
