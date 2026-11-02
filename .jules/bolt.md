## 2025-05-14 - Reliable package status check on Ubuntu 24.04
**Learning:** On Ubuntu 24.04 (Noble), `dpkg-query -W` may return exit code 0 even for packages in 'not-installed' status if they were previously uninstalled but not purged.
**Action:** Use `dpkg-query -W -f='${Status}' $pkg 2>/dev/null | grep -q 'ok installed'` for reliable idempotency checks in `apt`-based systems.

## 2026-03-27 - Idempotency check for dotfile setup
**Learning:** Using `cmp -s` to skip redundant backups and copies in `setup-dotfiles.sh` significantly improves warm-run performance.
**Action:** Always use `cmp -s` before copying configuration files that are already expected to exist.

## 2026-04-10 - Memory-efficient file size detection in FastAPI
**Learning:** Reading an entire UploadFile into memory just to determine its size is a major bottleneck and OOM risk. While 'file.size' exists in newer Starlette versions, it may return 'None' or be absent in others.
**Action:** Use 'await file.seek(0, 2)' followed by 'await file.tell()' for a robust, memory-efficient size check that doesn't load the file content.

## 2026-03-27 - Batching GitHub CLI calls for performance
**Learning:** Executing `gh secret set` and `gh variable set` individually for multiple items is slow due to repeated process forks and network round-trips. GitHub CLI (v2.30.0+) supports batching via the `-f` flag using a dotenv-formatted file.
**Action:** Use `gh secret set -f .env` and `gh variable set -f .env` to apply multiple configurations in a single command. Ensure temporary files are secured with `chmod 600` and cleaned up with `trap`.

## 2026-03-27 - FastAPI event loop blocking by sync I/O
**Learning:** Route handlers performing synchronous I/O (like seek and tell on UploadFile.file) should be defined as 'def' rather than 'async def'. This allows FastAPI to run them in a thread pool, preventing the main event loop from being blocked and significantly improving concurrency and responsiveness.
**Action:** Always prefer 'def' for endpoints that use synchronous file operations or other blocking calls.
