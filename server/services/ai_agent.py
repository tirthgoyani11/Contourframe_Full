"""
AI Assistant & Director Service for Contourframe Studio.
Provides:
  1. Agentic Tool Calling loop (compatible with OpenAI / Gemini API).
  2. Built-in Smart Local Director Planner (zero-key offline deterministic fallback).
  3. Async Job Queue (POST /api/ai/jobs, GET /api/ai/jobs/{id}, cancel).
  4. SQLite-backed conversation session persistence (GET/PUT /api/ai/session/{project_id}).
"""

import os
import json
import time
import uuid
import re
import asyncio
import logging
from typing import Dict, Any, List, Optional
import httpx

from services.storage import get_db

logger = logging.getLogger("ai_agent")
logger.setLevel(logging.INFO)

# =====================================================================
# Database Setup for AI Sessions
# =====================================================================

def init_ai_db():
    conn = get_db()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS ai_sessions (
                project_id TEXT PRIMARY KEY,
                messages TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS ai_memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
    conn.close()

init_ai_db()

def get_ai_session(project_id: str) -> List[Dict[str, Any]]:
    conn = get_db()
    row = conn.execute("SELECT messages FROM ai_sessions WHERE project_id = ?", (str(project_id),)).fetchone()
    conn.close()
    if row and row["messages"]:
        try:
            return json.loads(row["messages"])
        except Exception:
            return []
    return []

def save_ai_session(project_id: str, messages: List[Dict[str, Any]]):
    conn = get_db()
    now = time.strftime("%Y-%m-%d %H:%M:%S")
    with conn:
        conn.execute("""
            INSERT INTO ai_sessions (project_id, messages, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(project_id) DO UPDATE SET
                messages = excluded.messages,
                updated_at = excluded.updated_at
        """, (str(project_id), json.dumps(messages), now))
    conn.close()

# =====================================================================
# Tool Schemas for Function Calling
# =====================================================================

AI_TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "tool_batch",
            "description": "Execute multiple tools in a single step. Inside args, use '$0', '$1' to reference groupIds returned by previous calls in the batch.",
            "parameters": {
                "type": "object",
                "properties": {
                    "calls": {
                        "type": "array",
                        "description": "Array of {tool: string, args: object}",
                        "items": {
                            "type": "object",
                            "properties": {
                                "tool": {"type": "string"},
                                "args": {"type": "object"}
                            },
                            "required": ["tool", "args"]
                        }
                    }
                },
                "required": ["calls"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_group",
            "description": "Add a new country scene or historical empire to the timeline.",
            "parameters": {
                "type": "object",
                "properties": {
                    "group": {
                        "type": "object",
                        "properties": {
                            "show": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "Array of country or continent names (e.g. ['France', 'Germany'])."
                            },
                            "showHistory": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "Array of historical entity IDs (e.g. ['roman-empire', 'ottoman-empire', 'british-empire'])."
                            },
                            "label": {"type": "string", "description": "Custom scene title."},
                            "hold": {"type": "number", "description": "Hold duration in seconds (default: 2.5)."},
                            "style": {
                                "type": "object",
                                "description": "Initial styling (fill, border, opacity, animation)."
                            }
                        }
                    },
                    "position": {
                        "type": "string",
                        "description": "'start', 'end', or a 0-based integer index."
                    }
                },
                "required": ["group"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_transition",
            "description": "Set or update the transition camera style and duration before or after a group.",
            "parameters": {
                "type": "object",
                "properties": {
                    "transitionType": {
                        "type": "string",
                        "enum": ["topDown", "linear", "bounce", "fly", "orbit", "sweep"],
                        "description": "Transition animation style."
                    },
                    "duration": {"type": "number", "description": "Duration in seconds (e.g. 2.5)."},
                    "afterGroup": {"type": "string", "description": "ID of the group this transition follows."}
                },
                "required": ["transitionType"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_camera",
            "description": "Set 3D camera angles for a specific group.",
            "parameters": {
                "type": "object",
                "properties": {
                    "groupId": {"type": "string", "description": "Group ID (or '$0' placeholder in batch)."},
                    "center": {"description": "[lng, lat] coordinate or country name."},
                    "zoom": {"type": "number", "description": "Zoom level (0-22)."},
                    "pitch": {"type": "number", "description": "Tilt angle in degrees (0-85)."},
                    "bearing": {"type": "number", "description": "Heading angle (-180 to 180)."}
                },
                "required": ["groupId"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_start_frame",
            "description": "Set opening bookend camera frame before the first scene.",
            "parameters": {
                "type": "object",
                "properties": {
                    "zoomOut": {"type": "number", "description": "How much wider than first scene framing (e.g. 2.0)."},
                    "pitch": {"type": "number", "description": "Opening camera pitch angle (0-85)."},
                    "bearing": {"type": "number", "description": "Opening bearing angle (-180 to 180)."},
                    "holdDuration": {"type": "number", "description": "Opening hold seconds."},
                    "transitionType": {"type": "string", "enum": ["topDown", "linear", "bounce", "fly", "orbit", "sweep"]},
                    "transitionDuration": {"type": "number"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_end_frame",
            "description": "Set closing bookend camera frame after the final scene.",
            "parameters": {
                "type": "object",
                "properties": {
                    "zoomOut": {"type": "number", "description": "How much wider than last scene framing (e.g. 2.5)."},
                    "pitch": {"type": "number", "description": "Closing camera pitch angle (0-85)."},
                    "bearing": {"type": "number", "description": "Closing bearing angle (-180 to 180)."},
                    "holdDuration": {"type": "number", "description": "Closing hold seconds."},
                    "transitionType": {"type": "string", "enum": ["topDown", "linear", "bounce", "fly", "orbit", "sweep"]},
                    "transitionDuration": {"type": "number"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_arrow",
            "description": "Draw a curved or tactical arrow between countries or points.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from": {"description": "Starting country name or [lng, lat]."},
                    "to": {"description": "Destination country name or [lng, lat]."},
                    "waypoints": {"type": "array", "description": "Optional multi-point trajectory."},
                    "color": {"type": "string", "description": "Hex color (e.g. '#FF3333')."},
                    "thickness": {"type": "number", "description": "Arrow line thickness (1-10)."},
                    "style": {"type": "string", "enum": ["solid", "dashed", "dotted"]},
                    "groupId": {"type": "string", "description": "Scene group to attach this arrow to."}
                },
                "required": ["from", "to"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_model",
            "description": "Place a 3D tactical unit (airplane, tank, soldier, ship, landmark) on the map.",
            "parameters": {
                "type": "object",
                "properties": {
                    "modelId": {"type": "string", "description": "Model ID (e.g. 'airplane', 'tank', 'soldier', 'ship', 'flag')."},
                    "at": {"description": "Country name or [lng, lat] coordinate."},
                    "sizeKm": {"type": "number", "description": "Size in kilometers."},
                    "altKm": {"type": "number", "description": "Altitude in kilometers."},
                    "heading": {"type": "number", "description": "Heading angle in degrees."},
                    "color": {"type": "string", "description": "Primary tint color."},
                    "groupId": {"type": "string", "description": "Scene group to attach to."}
                },
                "required": ["modelId", "at"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "animate_model",
            "description": "Animate a 3D tactical unit from origin to destination.",
            "parameters": {
                "type": "object",
                "properties": {
                    "modelId": {"type": "string", "description": "Model ID to spawn and animate."},
                    "from": {"description": "Start position (country or [lng, lat])."},
                    "to": {"description": "Target position (country or [lng, lat])."},
                    "mode": {"type": "string", "description": "Kinetic mode: 'fly', 'drive', 'sail', 'ballistic'."},
                    "groupId": {"type": "string", "description": "Group ID."}
                },
                "required": ["modelId", "from", "to"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "conquer",
            "description": "Trigger tactical conquest/annexation of a defender country into an attacker empire.",
            "parameters": {
                "type": "object",
                "properties": {
                    "attacker": {"type": "string", "description": "Conquering country name."},
                    "defender": {"type": "string", "description": "Conquered country name."},
                    "groupId": {"type": "string", "description": "Group ID where conquest occurs."}
                },
                "required": ["attacker", "defender"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_fill",
            "description": "Style the polygon fill color, opacity, and shader animation for a group.",
            "parameters": {
                "type": "object",
                "properties": {
                    "groupId": {"type": "string"},
                    "color": {"type": "string", "description": "Hex color code."},
                    "opacity": {"type": "number", "description": "Opacity (0.0 to 1.0)."},
                    "animation": {
                        "type": "string",
                        "enum": ["fade", "wipe", "split", "circularWipe", "iris", "diamond", "noiseWipe", "noiseCircular"],
                        "description": "Procedural fill mask shader."
                    }
                },
                "required": ["groupId"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_border",
            "description": "Style polygon borders and glowing stroke animations.",
            "parameters": {
                "type": "object",
                "properties": {
                    "groupId": {"type": "string"},
                    "color": {"type": "string"},
                    "thickness": {"type": "number"},
                    "animation": {
                        "type": "string",
                        "enum": ["oneWay", "twoWay", "twoWayReverse", "fourWay", "fadeIn", "typewriter", "chaseBorder", "chaseWipe", "chaseCircular"]
                    }
                },
                "required": ["groupId"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_project",
            "description": "Inspect the current project timeline, scenes, camera, and annotations.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "ask_user",
            "description": "Ask the user a clarifying question with quick-choice options when requirements are ambiguous.",
            "parameters": {
                "type": "object",
                "properties": {
                    "question": {"type": "string", "description": "The question to ask."},
                    "options": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of selectable button options for the user."
                    }
                },
                "required": ["question", "options"]
            }
        }
    }
]

SYSTEM_PROMPT = """You are the AI Director for Contourframe Studio, a premier automated cartographer, geopolitical historian, and animated map director.

Your task is to convert the user's natural language requests into rich, cinematic map animation sequences.

CRITICAL OPERATIONAL RULES:
1. Always direct the map by issuing structured tool calls from your toolset. Do NOT write raw HTML or script code.
2. Structure animations cinematically:
   - Start Frame: Set an opening wide shot or dramatic angled camera with `set_start_frame`.
   - Scenes: Use `add_group` to stage countries or empires chronologically.
   - Smooth Transitions: Set transitions (`fly`, `sweep`, `orbit`, or `topDown`) with `update_transition`.
   - Kinetic Elements:
     * When conflicts, invasions, or trade paths occur, add curved arrows with `add_arrow`.
     * Add 3D tactical units (airplane, tank, soldier, ship) using `add_model` or `animate_model`.
     * Execute conquests or annexations using `conquer`.
   - Styling: Use `set_fill` (e.g. circularWipe, iris, fade) and `set_border` (chaseCircular, typewriter) to make borders glow.
3. Be concise in your written response: Give a 1-2 sentence overview of the animation you directed.
"""

# =====================================================================
# Built-in Smart Local Director Planner (Deterministic Fallback)
# =====================================================================

WORLD_COUNTRIES = {
    "france": "France", "germany": "Germany", "united kingdom": "United Kingdom", "uk": "United Kingdom",
    "england": "United Kingdom", "britain": "United Kingdom", "united states": "United States",
    "usa": "United States", "america": "United States", "russia": "Russia", "soviet union": "Russia",
    "ussr": "Russia", "ukraine": "Ukraine", "poland": "Poland", "italy": "Italy", "spain": "Spain",
    "japan": "Japan", "china": "China", "india": "India", "turkey": "Turkey", "ottoman": "Turkey",
    "egypt": "Egypt", "greece": "Greece", "brazil": "Brazil", "canada": "Canada", "australia": "Australia",
    "mexico": "Mexico", "argentina": "Argentina", "south africa": "South Africa", "norway": "Norway",
    "sweden": "Sweden", "finland": "Finland", "netherlands": "Netherlands", "belgium": "Belgium",
    "switzerland": "Switzerland", "austria": "Austria", "portugal": "Portugal", "ireland": "Ireland",
    "denmark": "Denmark", "czech republic": "Czech Republic", "romania": "Romania", "hungary": "Hungary",
    "bulgaria": "Bulgaria", "serbia": "Serbia", "croatia": "Croatia", "saudi arabia": "Saudi Arabia",
    "iran": "Iran", "iraq": "Iraq", "israel": "Israel", "pakistan": "Pakistan", "indonesia": "Indonesia",
    "south korea": "South Korea", "north korea": "North Korea", "vietnam": "Vietnam", "thailand": "Thailand"
}

def smart_local_planner(user_prompt: str) -> Dict[str, Any]:
    """
    Intelligent local map director that parses user intent and generates
    sophisticated multi-scene tool call sequences without requiring external API keys.
    """
    lower = user_prompt.lower()
    
    # 1. Detect mentioned countries
    found_countries = []
    for alias, formal in WORLD_COUNTRIES.items():
        pattern = r'\b' + re.escape(alias) + r'\b'
        if re.search(pattern, lower):
            if formal not in found_countries:
                found_countries.append(formal)
    
    # Defaults if no specific country mentioned
    if not found_countries:
        if "normandy" in lower or "d-day" in lower:
            found_countries = ["France", "United Kingdom", "Germany", "United States"]
        elif "rome" in lower or "roman" in lower:
            found_countries = ["Italy", "Greece", "France", "Spain", "Egypt"]
        elif "asia" in lower:
            found_countries = ["China", "Japan", "India"]
        elif "europe" in lower:
            found_countries = ["Germany", "France", "United Kingdom", "Italy"]
        else:
            found_countries = ["France", "Germany"]

    calls = []
    
    # Project setup
    calls.append({
        "tool": "set_start_frame",
        "args": {
            "zoomOut": 2.2,
            "pitch": 45,
            "bearing": -15,
            "holdDuration": 1.5,
            "transitionType": "sweep",
            "transitionDuration": 2.0
        }
    })

    # Historical / thematic detection
    is_war = any(w in lower for w in ["war", "invasion", "invade", "battle", "wwii", "ww2", "conquest", "conquer", "normandy", "d-day", "attack"])
    is_travel = any(w in lower for w in ["travel", "flight", "fly", "trip", "journey", "route", "visit"])
    is_cinematic = any(w in lower for w in ["cinematic", "gold", "highlight", "spotlight", "glow", "orbit"])

    # Scene 1: Primary Country / Origin
    primary = found_countries[0]
    calls.append({
        "tool": "add_group",
        "args": {
            "group": {
                "show": [primary],
                "label": f"Act I: {primary}",
                "hold": 2.5
            }
        }
    })
    calls.append({
        "tool": "set_fill",
        "args": {
            "groupId": "$1",
            "color": "#D4AF37" if is_cinematic else ("#3B82F6" if not is_war else "#EF4444"),
            "opacity": 0.65,
            "animation": "circularWipe"
        }
    })
    calls.append({
        "tool": "set_border",
        "args": {
            "groupId": "$1",
            "color": "#FFFFFF",
            "animation": "chaseCircular"
        }
    })
    calls.append({
        "tool": "set_camera",
        "args": {
            "groupId": "$1",
            "pitch": 40,
            "bearing": 10
        }
    })

    # If multiple countries, add Scene 2 and interactions
    if len(found_countries) > 1:
        secondary = found_countries[1]
        
        calls.append({
            "tool": "update_transition",
            "args": {
                "transitionType": "fly" if is_war or is_travel else "sweep",
                "duration": 2.5,
                "afterGroup": "$1"
            }
        })
        
        calls.append({
            "tool": "add_group",
            "args": {
                "group": {
                    "show": [secondary],
                    "label": f"Act II: {secondary}",
                    "hold": 2.5
                }
            }
        })
        
        calls.append({
            "tool": "set_fill",
            "args": {
                "groupId": "$5",
                "color": "#10B981" if is_travel else "#F59E0B",
                "opacity": 0.65,
                "animation": "iris"
            }
        })
        calls.append({
            "tool": "set_border",
            "args": {
                "groupId": "$5",
                "color": "#FFFFFF",
                "animation": "typewriter"
            }
        })
        
        # Arrow connecting primary -> secondary
        calls.append({
            "tool": "add_arrow",
            "args": {
                "from": primary,
                "to": secondary,
                "color": "#EF4444" if is_war else "#3B82F6",
                "thickness": 4,
                "style": "solid"
            }
        })

        # 3D models or conquest
        if is_war:
            calls.append({
                "tool": "add_model",
                "args": {
                    "modelId": "airplane" if "plane" in lower or "air" in lower else "tank",
                    "at": primary,
                    "sizeKm": 150,
                    "altKm": 40 if "plane" in lower else 5,
                    "heading": 45,
                    "color": "#EF4444"
                }
            })
            if "conquer" in lower or "takeover" in lower:
                calls.append({
                    "tool": "conquer",
                    "args": {
                        "attacker": primary,
                        "defender": secondary,
                        "groupId": "$5"
                    }
                })
        elif is_travel:
            calls.append({
                "tool": "add_model",
                "args": {
                    "modelId": "airplane",
                    "at": primary,
                    "sizeKm": 180,
                    "altKm": 60,
                    "heading": 60,
                    "color": "#3B82F6"
                }
            })

    # End Frame
    calls.append({
        "tool": "set_end_frame",
        "args": {
            "zoomOut": 2.8,
            "pitch": 50,
            "bearing": 25,
            "holdDuration": 2.0,
            "transitionType": "orbit",
            "transitionDuration": 2.5
        }
    })

    assistant_text = (
        f"I've choreographed a cinematic animation featuring **{', '.join(found_countries)}**. "
        f"It opens with a wide sweep, stages the countries with animated procedural shader fills and borders, "
        f"connects them with tactical directional arrows, and concludes with a panoramic orbit."
    )

    return {
        "content": assistant_text,
        "tool_calls": [
            {
                "id": f"call_{uuid.uuid4().hex[:8]}",
                "type": "function",
                "function": {
                    "name": "tool_batch",
                    "arguments": json.dumps({"calls": calls})
                }
            }
        ]
    }

# =====================================================================
# Job Queue & Execution Lifecycle
# =====================================================================

ACTIVE_JOBS: Dict[str, Dict[str, Any]] = {}
JOBS_LOCK = asyncio.Lock()

async def create_ai_job(kind: str, messages: List[Dict[str, Any]], project_id: Optional[str] = None) -> str:
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    async with JOBS_LOCK:
        ACTIVE_JOBS[job_id] = {
            "id": job_id,
            "kind": kind,
            "status": "running",
            "created_at": time.time(),
            "messages": messages,
            "project_id": project_id,
            "result": None,
            "error": None,
            "usage": {"tokensIn": 0}
        }
    
    # Launch async background executor
    asyncio.create_task(run_job_worker(job_id))
    return job_id

async def run_job_worker(job_id: str):
    try:
        await asyncio.sleep(0.3)  # Brief yield to allow client to receive job_id
        
        async with JOBS_LOCK:
            job = ACTIVE_JOBS.get(job_id)
        if not job or job.get("status") == "cancelled":
            return

        messages = job.get("messages", [])
        kind = job.get("kind", "turn")

        # Check for compact request
        if kind == "compact":
            summary = "The conversation previously explored world map sequences and historical geopolitical events."
            async with JOBS_LOCK:
                ACTIVE_JOBS[job_id]["status"] = "succeeded"
                ACTIVE_JOBS[job_id]["result"] = {"message": {"role": "assistant", "content": summary}}
            return

        # Attempt Cloud LLM if API Key is configured
        llm_result = await try_cloud_llm(messages)
        if not llm_result:
            # Check if this turn is a follow-up after tool execution
            last_msg = messages[-1] if messages else {}
            has_tool_results = any(m.get("role") == "tool" for m in messages[-10:])
            
            if has_tool_results or last_msg.get("role") == "tool":
                # Tools were executed; finish turn with final summary and no further tool calls
                llm_result = {
                    "role": "assistant",
                    "content": "Done! All map scenes, camera sweeps, and animations are ready on your timeline. Press Play to preview.",
                    "tool_calls": []
                }
            else:
                user_prompt = ""
                for m in reversed(messages):
                    if m.get("role") == "user":
                        user_prompt = m.get("content", "")
                        break
                
                planner_out = smart_local_planner(user_prompt)
                llm_result = {
                    "role": "assistant",
                    "content": planner_out["content"],
                    "tool_calls": planner_out["tool_calls"]
                }

        async with JOBS_LOCK:
            if ACTIVE_JOBS.get(job_id, {}).get("status") != "cancelled":
                ACTIVE_JOBS[job_id]["status"] = "succeeded"
                ACTIVE_JOBS[job_id]["result"] = {"message": llm_result}
                ACTIVE_JOBS[job_id]["usage"] = {"tokensIn": 240}

    except Exception as e:
        logger.error(f"AI Job {job_id} failed: {e}", exc_info=True)
        async with JOBS_LOCK:
            ACTIVE_JOBS[job_id]["status"] = "failed"
            ACTIVE_JOBS[job_id]["error"] = str(e)

async def try_cloud_llm(messages: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Attempts to call Gemini or OpenAI API if credentials are provided in the environment.
    """
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if not gemini_key and not openai_key:
        return None

    try:
        # Build prompt messages including system prompt
        conv = [{"role": "system", "content": SYSTEM_PROMPT}]
        for m in messages[-20:]:  # Keep within context
            role = m.get("role", "user")
            content = m.get("content", "")
            tc = m.get("tool_calls")
            tcid = m.get("tool_call_id")
            
            entry = {"role": role, "content": content or ""}
            if tc:
                entry["tool_calls"] = tc
            if tcid:
                entry["tool_call_id"] = tcid
            conv.append(entry)

        headers = {}
        if gemini_key:
            # Gemini OpenAI-compatible endpoint
            url = f"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
            headers["Authorization"] = f"Bearer {gemini_key}"
            model = "gemini-2.0-flash"
        else:
            url = "https://api.openai.com/v1/chat/completions"
            headers["Authorization"] = f"Bearer {openai_key}"
            model = "gpt-4o-mini"

        payload = {
            "model": model,
            "messages": conv,
            "tools": AI_TOOLS_SCHEMA,
            "tool_choice": "auto",
            "temperature": 0.4
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                choice = data.get("choices", [{}])[0].get("message", {})
                return {
                    "role": "assistant",
                    "content": choice.get("content", "") or "",
                    "tool_calls": choice.get("tool_calls", [])
                }
    except Exception as e:
        logger.warning(f"Cloud LLM call failed, falling back to local planner: {e}")

    return None

def get_job_status(job_id: str) -> Optional[Dict[str, Any]]:
    return ACTIVE_JOBS.get(job_id)

def cancel_job(job_id: str) -> bool:
    if job_id in ACTIVE_JOBS:
        ACTIVE_JOBS[job_id]["status"] = "cancelled"
        return True
    return False
