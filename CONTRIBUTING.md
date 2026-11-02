# Contributing

Thank you for your interest in contributing to this project! This guide explains how to get involved.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

```bash
git clone https://github.com/<your-username>/.github.git
cd .github
```

### Validate Scripts

Before submitting changes to shell scripts, verify syntax:

```bash
bash -n setup.sh
for script in scripts/*.sh; do
  bash -n "$script"
done
```

## Pull Request Guidelines

- Keep changes focused and small
- Write clear commit messages
- Update documentation if your change affects usage
- Ensure all shell scripts pass syntax validation (`bash -n`)
- Test on at least one supported distribution (Ubuntu, Fedora, or Arch Linux)

## Reporting Issues

- Use the issue templates provided
- Include your Linux distribution and version
- Provide steps to reproduce the problem
- Attach relevant log output

## Code Style

- Use `#!/bin/bash` shebang for all scripts
- Include `set -e` at the top of scripts for fail-fast behavior
- Use lowercase for local variables, uppercase for exported/environment variables
- Quote all variable expansions (`"$VAR"` not `$VAR`)
- Add comments for non-obvious logic

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
