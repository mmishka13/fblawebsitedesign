from pathlib import Path
import hashlib
import uuid
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from . import storage
from .models import (
    UserCreate,
    UserPublic,
    LoginRequest,
    TokenResponse,
    Session,
    SessionCreate,
    Resource,
    DashboardData,
    AIChatRequest,
    AIChatResponse,
)


app = FastAPI(
    title="Student Language Learning Hub API",
    description="File-based backend for the FBLA language learning hub.",
    version="0.1.0",
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed


def seed_demo_data() -> None:
    if not storage.users_path().exists():
        demo_user = {
            "id": "u-demo",
            "name": "Demo Student",
            "email": "student@example.com",
            "password_hash": hash_password("password123"),
            "native_language": "English",
            "target_languages": ["Spanish", "Japanese"],
            "proficiency": "beginner",
            "interests": ["travel", "anime", "music"],
            "bio": "Curious learner exploring new languages.",
            "role": "student",
        }
        storage.save_users([demo_user])

    if not storage.sessions_path().exists():
        demo_sessions: List[dict] = [
            {
                "id": "s-1",
                "title": "Spanish Conversation Cafe",
                "language": "Spanish",
                "session_type": "Conversation Practice",
                "tutor_name": "María López",
                "description": "Casual small-group conversation focused on travel phrases.",
                "date": "2026-03-15",
                "start_time": "17:00",
                "end_time": "18:00",
                "difficulty": "beginner",
                "max_participants": 12,
                "meeting_link": "https://meet.example.com/spanish-cafe",
                "platform": "Google Meet",
                "attendees": ["u-demo"],
                "waitlist": [],
            },
            {
                "id": "s-2",
                "title": "Japanese Hiragana Speed Run",
                "language": "Japanese",
                "session_type": "Grammar Workshop",
                "tutor_name": "Kenji Sato",
                "description": "Fast-paced workshop to master hiragana with mini games.",
                "date": "2026-03-18",
                "start_time": "19:00",
                "end_time": "20:00",
                "difficulty": "beginner",
                "max_participants": 15,
                "meeting_link": "https://zoom.example.com/jp-hiragana",
                "platform": "Zoom",
                "attendees": [],
                "waitlist": [],
            },
        ]
        storage.save_sessions(demo_sessions)

    if not storage.resources_path().exists():
        demo_resources = [
            {
                "id": "r-1",
                "title": "Spanish Travel Phrasebook",
                "language": "Spanish",
                "difficulty": "beginner",
                "category": "lessons",
                "description": "Interactive phrases for airports, cafes, and homestays.",
                "url": "https://example.com/resources/spanish-travel",
            },
            {
                "id": "r-2",
                "title": "Japanese Anime Dialogue Breakdown",
                "language": "Japanese",
                "difficulty": "intermediate",
                "category": "videos",
                "description": "Short anime clip with line-by-line translation and notes.",
                "url": "https://example.com/resources/japanese-anime",
            },
        ]
        storage.save_resources(demo_resources)


@app.on_event("startup")
async def on_startup() -> None:
    seed_demo_data()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/auth/signup", response_model=UserPublic)
def signup(payload: UserCreate) -> UserPublic:
    existing = storage.find_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    users = storage.load_users()
    user_id = f"u-{uuid.uuid4().hex[:10]}"
    user_data = {
        "id": user_id,
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "native_language": payload.native_language,
        "target_languages": payload.target_languages,
        "proficiency": payload.proficiency,
        "interests": payload.interests,
        "bio": payload.bio,
        "role": "student",
    }
    users.append(user_data)
    storage.save_users(users)

    return UserPublic(**{k: v for k, v in user_data.items() if k != "password_hash"})


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    user = storage.find_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = f"demo-{user['id']}"
    public = UserPublic(**{k: v for k, v in user.items() if k != "password_hash"})
    return TokenResponse(access_token=token, user=public)


def get_demo_user() -> UserPublic:
    users = storage.load_users()
    if not users:
        raise HTTPException(status_code=400, detail="No users in system")
    user = users[0]
    return UserPublic(**{k: v for k, v in user.items() if k != "password_hash"})


@app.get("/api/dashboard", response_model=DashboardData)
def get_dashboard(language: Optional[str] = None, user: UserPublic = Depends(get_demo_user)) -> DashboardData:
    sessions_raw = storage.load_sessions()
    sessions = [Session(**s) for s in sessions_raw]

    active_language = language or (user.target_languages[0] if user.target_languages else "Spanish")
    upcoming = [
        s for s in sessions if s.language.lower() == active_language.lower()
    ]

    progress = {
        "lessons_completed": 8,
        "quizzes_completed": 4,
        "vocabulary_learned": 120,
        "activity_streak": 5,
    }

    return DashboardData(
        language=active_language,
        progress=progress,  # type: ignore[arg-type]
        upcoming_sessions=upcoming,
        recent_ai_conversations=12,
        pronunciation_exercises_completed=7,
        weekly_goal_practice_speaking=3,
        weekly_goal_lessons=2,
    )


@app.get("/api/sessions", response_model=List[Session])
def list_sessions(
    language: Optional[str] = None,
    difficulty: Optional[str] = None,
    tutor: Optional[str] = None,
    session_type: Optional[str] = None,
) -> List[Session]:
    sessions_raw = storage.load_sessions()
    results = []
    for s in sessions_raw:
        if language and s.get("language", "").lower() != language.lower():
            continue
        if difficulty and s.get("difficulty", "").lower() != difficulty.lower():
            continue
        if tutor and tutor.lower() not in s.get("tutor_name", "").lower():
            continue
        if session_type and s.get("session_type", "").lower() != session_type.lower():
            continue
        results.append(Session(**s))
    return results


@app.post("/api/sessions", response_model=Session)
def create_session(payload: SessionCreate) -> Session:
    sessions = storage.load_sessions()
    session_id = f"s-{uuid.uuid4().hex[:10]}"
    data = payload.dict()
    data.update({"id": session_id, "attendees": [], "waitlist": []})
    sessions.append(data)
    storage.save_sessions(sessions)
    return Session(**data)


@app.post("/api/sessions/{session_id}/join", response_model=Session)
def join_session(session_id: str, user: UserPublic = Depends(get_demo_user)) -> Session:
    sessions = storage.load_sessions()
    for s in sessions:
        if s.get("id") == session_id:
            attendees = s.setdefault("attendees", [])
            waitlist = s.setdefault("waitlist", [])
            if user.id in attendees or user.id in waitlist:
                break
            if len(attendees) < s.get("max_participants", 10):
                attendees.append(user.id)
            else:
                waitlist.append(user.id)
            storage.save_sessions(sessions)
            return Session(**s)
    raise HTTPException(status_code=404, detail="Session not found")


@app.get("/api/resources", response_model=List[Resource])
def list_resources(
    language: Optional[str] = None,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
) -> List[Resource]:
    resources_raw = storage.load_resources()
    results = []
    for r in resources_raw:
        if language and r.get("language", "").lower() != language.lower():
            continue
        if difficulty and r.get("difficulty", "").lower() != difficulty.lower():
            continue
        if category and r.get("category", "").lower() != category.lower():
            continue
        results.append(Resource(**r))
    return results


@app.post("/api/ai/chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest) -> AIChatResponse:
    language = payload.language.lower()
    base_tip = "Try replying in full sentences and focus on clarity over speed."
    if language == "spanish":
        tip = "Notice how question marks are used at both the beginning (¿) and end (?) of questions."
    elif language == "japanese":
        tip = "Pay attention to the particle at the end of each phrase (は, を, に) to understand its role."
    else:
        tip = base_tip

    reply = (
        "This is a demo AI tutor response. "
        "Imagine a friendly tutor reacting to what you just typed, asking a follow-up question, "
        "and gently correcting any mistakes."
    )
    return AIChatResponse(reply=reply, tip=tip)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

