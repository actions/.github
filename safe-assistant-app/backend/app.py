from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Safe Omni Assistant API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory stores for demo purposes.
CHAT_HISTORY: list[dict[str, Any]] = []
MEMORIES: dict[str, list[str]] = {}
FILES: dict[str, dict[str, Any]] = {}
AUDIT_LOG: list[dict[str, Any]] = []


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: str


class ChatRequest(BaseModel):
    user_id: str
    messages: list[ChatMessage]
    tools_enabled: bool = True
    vision_enabled: bool = True
    voice_enabled: bool = True
    memory_enabled: bool = True


class ChatResponse(BaseModel):
    response_id: str
    content: str
    tool_calls: list[dict[str, Any]]
    timestamp: datetime


class MemoryUpsertRequest(BaseModel):
    user_id: str
    note: str


class ModerationRequest(BaseModel):
    content: str


class ModerationResponse(BaseModel):
    flagged: bool
    categories: list[str]


class ToolRunRequest(BaseModel):
    name: str
    args: dict[str, Any] = Field(default_factory=dict)


SAFE_BLOCKLIST = {
    "credit card fraud",
    "phishing kit",
    "malware",
    "ransomware",
    "credential stuffing",
    "identity theft",
    "wire fraud",
}


def append_audit(event: str, detail: dict[str, Any]) -> None:
    AUDIT_LOG.append(
        {
            "id": str(uuid.uuid4()),
            "event": event,
            "detail": detail,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _moderate_content(lowered_content: str) -> ModerationResponse:
    """Internal helper to check content against blocklist using pre-lowered string."""
    hits = [term for term in SAFE_BLOCKLIST if term in lowered_content]
    return ModerationResponse(flagged=bool(hits), categories=hits)


@app.post("/moderate", response_model=ModerationResponse)
def moderate(payload: ModerationRequest) -> ModerationResponse:
    return _moderate_content(payload.content.lower())


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    latest_user_message = next(
        (m.content for m in reversed(payload.messages) if m.role == "user"), ""
    )

    # BOLT OPTIMIZATION: Reuse a single pre-lowered user message for moderation
    # and tool checks to avoid redundant string allocations and .lower() calls.
    lowered_user_message = latest_user_message.lower()

    moderation = _moderate_content(lowered_user_message)
    if moderation.flagged:
        append_audit(
            "chat.blocked",
            {"user_id": payload.user_id, "categories": moderation.categories},
        )
        raise HTTPException(
            status_code=400,
            detail="Request contains unsafe content and was blocked by moderation.",
        )

    memory_snippet = ""
    if payload.memory_enabled and payload.user_id in MEMORIES:
        memory_snippet = f"\nMemory context: {' | '.join(MEMORIES[payload.user_id][-3:])}"

    tool_calls: list[dict[str, Any]] = []
    if payload.tools_enabled and "time" in lowered_user_message:
        tool_calls.append(
            {
                "tool": "get_current_time",
                "result": datetime.now(timezone.utc).isoformat(),
            }
        )

    content = (
        "Safe Omni Assistant response:\n"
        f"- You said: {latest_user_message}\n"
        f"- Vision enabled: {payload.vision_enabled}\n"
        f"- Voice enabled: {payload.voice_enabled}\n"
        f"- Tools enabled: {payload.tools_enabled}"
        f"{memory_snippet}"
    )

    response = ChatResponse(
        response_id=str(uuid.uuid4()),
        content=content,
        tool_calls=tool_calls,
        timestamp=datetime.now(timezone.utc),
    )

    CHAT_HISTORY.append({"request": payload.model_dump(), "response": response.model_dump()})
    append_audit("chat.completed", {"user_id": payload.user_id})
    return response


@app.post("/memory")
def upsert_memory(payload: MemoryUpsertRequest) -> dict[str, Any]:
    MEMORIES.setdefault(payload.user_id, []).append(payload.note)
    append_audit("memory.upserted", payload.model_dump())
    return {"ok": True, "count": len(MEMORIES[payload.user_id])}


@app.get("/memory/{user_id}")
def get_memory(user_id: str) -> dict[str, Any]:
    return {"user_id": user_id, "notes": MEMORIES.get(user_id, [])}


@app.post("/files")
def upload_file(file: UploadFile = File(...)) -> dict[str, Any]:
    fid = str(uuid.uuid4())
    # BOLT OPTIMIZATION: Avoid reading the entire file into memory just to get its size.
    # We use the underlying file object's seek and tell for a robust, memory-efficient
    # way to determine file size that works across all FastAPI/Starlette versions.
    # Note: Starlette's UploadFile.seek only accepts one argument (offset).
    file.file.seek(0, 2)  # Seek to the end of the file
    size = file.file.tell()
    file.file.seek(0)  # Reset to the beginning
    meta = {"id": fid, "name": file.filename, "size": size}
    FILES[fid] = meta
    append_audit("file.uploaded", meta)
    return meta


@app.get("/audit")
def get_audit() -> list[dict[str, Any]]:
    return AUDIT_LOG


@app.post("/tools/run")
def run_tool(payload: ToolRunRequest) -> dict[str, Any]:
    if payload.name == "get_current_time":
        result = {"timestamp": datetime.now(timezone.utc).isoformat()}
    elif payload.name == "summarize_text":
        text = str(payload.args.get("text", ""))
        result = {
            "summary": text[:120] + ("..." if len(text) > 120 else ""),
            "chars": len(text),
        }
    else:
        raise HTTPException(status_code=404, detail=f"Unknown tool: {payload.name}")

    append_audit("tool.ran", {"name": payload.name})
    return {"tool": payload.name, "result": result}
