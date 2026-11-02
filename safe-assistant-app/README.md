# Safe Omni Assistant (ChatGPT-style)

This project is a **safe** AI assistant demo app that provides a broad set of modern assistant capabilities while explicitly blocking fraud and cyber-abuse use cases.

## Included capabilities

- Chat endpoint (`/chat`)
- Safety moderation (`/moderate`)
- Tool execution (`/tools/run`)
- User memory (`/memory`)
- File upload metadata (`/files`)
- Audit trail (`/audit`)
- Front-end demo controls for chat + memory + feature toggles (tools/vision/voice/memory)

## Quickstart

```bash
cd safe-assistant-app/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Then open the static UI in another terminal:

```bash
cd safe-assistant-app/frontend
python -m http.server 4173
```

Browse to `http://localhost:4173`.

## Notes

- This is a local demo with in-memory storage (non-persistent).
- Replace in-memory stores with a database and managed object storage for production.
- Add proper authentication + role-based authorization for real deployments.
