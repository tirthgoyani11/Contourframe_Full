"""
SQLite storage service for Contourframe Studio.
Handles projects, history snapshots, and compiled videos.
"""
import sqlite3
import json
import os
import datetime
from typing import Optional, List, Dict, Any

# Keep the original environment variable as a fallback for existing installations.
DB_PATH = os.environ.get("CONTOURFRAME_DB") or os.environ.get("AMM_STUDIO_DB") or os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "projects.db")

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                data TEXT NOT NULL,
                thumbnail TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                name TEXT,
                data TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                filename TEXT NOT NULL,
                resolution TEXT NOT NULL,
                fps INTEGER NOT NULL,
                file_size INTEGER NOT NULL,
                download_url TEXT NOT NULL,
                share_token TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS shares (
                token TEXT PRIMARY KEY,
                project_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS ai_sessions (
                project_id TEXT PRIMARY KEY,
                messages TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

    conn.close()

def create_project(name: str, data: Optional[str] = None) -> Dict[str, Any]:
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    if not data:
        # Default empty project matching version 1 schema
        default_state = {
            "version": 1,
            "projectName": name,
            "mode": "basic",
            "startCamera": {
                "mode": "anchor",
                "center": [0, 20],
                "zoom": 2.5,
                "pitch": 0,
                "bearing": 0,
                "transitionType": "topDown",
                "transitionDuration": 2.0,
                "holdDuration": 0.0,
                "keepFirstFrame": False
            },
            "endCamera": None,
            "editorCamera": {"center": [0, 20], "zoom": 2.5, "pitch": 0, "bearing": 0},
            "mapStyle": "satellite",
            "customMapColors": {},
            "customLayerVisible": {},
            "sun3d": {"yuk": 63, "don": 315},
            "selectedItemId": None,
            "selectedCountryIndex": 0,
            "sequenceItems": [],
            "nextId": 1,
            "uiState": {
                "collapsedSections": {},
                "selectedSection": "identity",
                "clipboard": {},
                "lastSelectedCountryIdx": {}
            },
            "history": None
        }
        data = json.dumps(default_state)
    
    conn = get_db()
    with conn:
        cursor = conn.execute(
            "INSERT INTO projects (name, data, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (name, data, now, now)
        )
        pid = cursor.lastrowid
    conn.close()
    return {"id": pid, "name": name}

def list_projects() -> List[Dict[str, Any]]:
    conn = get_db()
    rows = conn.execute("SELECT id, name, thumbnail, created_at, updated_at FROM projects ORDER BY updated_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_project(pid: int) -> Optional[Dict[str, Any]]:
    conn = get_db()
    row = conn.execute("SELECT id, name, data, thumbnail, updated_at FROM projects WHERE id = ?", (pid,)).fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)

def update_project(pid: int, name: Optional[str] = None, data: Optional[str] = None, thumbnail: Optional[str] = None) -> bool:
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    conn = get_db()
    with conn:
        if name and data and thumbnail:
            cursor = conn.execute(
                "UPDATE projects SET name = ?, data = ?, thumbnail = ?, updated_at = ? WHERE id = ?",
                (name, data, thumbnail, now, pid)
            )
        elif name and data:
            cursor = conn.execute(
                "UPDATE projects SET name = ?, data = ?, updated_at = ? WHERE id = ?",
                (name, data, now, pid)
            )
        elif data and thumbnail:
            cursor = conn.execute(
                "UPDATE projects SET data = ?, thumbnail = ?, updated_at = ? WHERE id = ?",
                (data, thumbnail, now, pid)
            )
        elif data:
            cursor = conn.execute(
                "UPDATE projects SET data = ?, updated_at = ? WHERE id = ?",
                (data, now, pid)
            )
        elif name:
            cursor = conn.execute(
                "UPDATE projects SET name = ?, updated_at = ? WHERE id = ?",
                (name, now, pid)
            )
        elif thumbnail:
            cursor = conn.execute(
                "UPDATE projects SET thumbnail = ?, updated_at = ? WHERE id = ?",
                (thumbnail, now, pid)
            )
        else:
            conn.close()
            return True
        success = cursor.rowcount > 0
    conn.close()
    return success

def delete_project(pid: int) -> bool:
    conn = get_db()
    with conn:
        cursor = conn.execute("DELETE FROM projects WHERE id = ?", (pid,))
        success = cursor.rowcount > 0
    conn.close()
    return success

def create_snapshot(pid: int, name: Optional[str] = None) -> Optional[int]:
    proj = get_project(pid)
    if not proj:
        return None
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    snap_name = name or f"Snapshot {now[:19].replace('T', ' ')}"
    conn = get_db()
    with conn:
        cursor = conn.execute(
            "INSERT INTO snapshots (project_id, name, data, created_at) VALUES (?, ?, ?, ?)",
            (pid, snap_name, proj["data"], now)
        )
        # Enforce max 50 snapshots
        conn.execute("""
            DELETE FROM snapshots WHERE id IN (
                SELECT id FROM snapshots WHERE project_id = ? ORDER BY created_at DESC LIMIT -1 OFFSET 50
            )
        """, (pid,))
        snap_id = cursor.lastrowid
    conn.close()
    return snap_id

def list_snapshots(pid: int) -> List[Dict[str, Any]]:
    conn = get_db()
    rows = conn.execute(
        "SELECT id, name, created_at FROM snapshots WHERE project_id = ? ORDER BY created_at DESC",
        (pid,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_snapshot(snap_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db()
    row = conn.execute("SELECT id, project_id, name, data, created_at FROM snapshots WHERE id = ?", (snap_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)

def record_video(project_id: int, title: str, filename: str, resolution: str, fps: int, file_size: int, download_url: str) -> int:
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    share_token = f"v_{os.urandom(4).hex()}"
    conn = get_db()
    with conn:
        cursor = conn.execute(
            """INSERT INTO videos (project_id, title, filename, resolution, fps, file_size, download_url, share_token, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (project_id, title, filename, resolution, fps, file_size, download_url, share_token, now)
        )
        vid_id = cursor.lastrowid
    conn.close()
    return vid_id

def list_videos(project_id: int) -> List[Dict[str, Any]]:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM videos WHERE project_id = ? ORDER BY created_at DESC",
        (project_id,)
    ).fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        d["available"] = True
        d["share_url"] = f"/v/{d['share_token']}"
        res.append(d)
    return res

def delete_video(vid_id: int) -> Optional[str]:
    conn = get_db()
    row = conn.execute("SELECT filename FROM videos WHERE id = ?", (vid_id,)).fetchone()
    if not row:
        conn.close()
        return None
    fname = row["filename"]
    with conn:
        conn.execute("DELETE FROM videos WHERE id = ?", (vid_id,))
    conn.close()
    return fname
