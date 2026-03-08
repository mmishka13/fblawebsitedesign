from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)
    native_language: Optional[str] = None
    target_languages: List[str] = []
    proficiency: Optional[str] = None
    interests: List[str] = []
    bio: Optional[str] = None


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    native_language: Optional[str] = None
    target_languages: List[str] = []
    proficiency: Optional[str] = None
    interests: List[str] = []
    bio: Optional[str] = None
    role: str = "student"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class SessionBase(BaseModel):
    title: str
    language: str
    session_type: str
    tutor_name: str
    description: str
    date: str
    start_time: str
    end_time: str
    difficulty: str
    max_participants: int = 10
    meeting_link: Optional[str] = None
    platform: Optional[str] = None


class Session(SessionBase):
    id: str
    attendees: List[str] = []
    waitlist: List[str] = []


class SessionCreate(SessionBase):
    pass


class Resource(BaseModel):
    id: str
    title: str
    language: str
    difficulty: str
    category: str
    description: str
    url: Optional[str] = None


class DashboardProgress(BaseModel):
    lessons_completed: int = 0
    quizzes_completed: int = 0
    vocabulary_learned: int = 0
    activity_streak: int = 0


class DashboardData(BaseModel):
    language: str
    progress: DashboardProgress
    upcoming_sessions: List[Session] = []
    recent_ai_conversations: int = 0
    pronunciation_exercises_completed: int = 0
    weekly_goal_practice_speaking: int = 0
    weekly_goal_lessons: int = 0


class AIChatRequest(BaseModel):
    language: str
    message: str


class AIChatResponse(BaseModel):
    reply: str
    tip: str

