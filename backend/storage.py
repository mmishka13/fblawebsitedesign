import json
from pathlib import Path
from typing import Any, Dict, List, Optional


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def _load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return default


def _save_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def users_path() -> Path:
    return DATA_DIR / "users.json"


def sessions_path() -> Path:
    return DATA_DIR / "sessions.json"


def resources_path() -> Path:
    return DATA_DIR / "resources.json"


def dashboard_path() -> Path:
    return DATA_DIR / "dashboard.json"


def load_users() -> List[Dict[str, Any]]:
    return _load_json(users_path(), default=[])


def save_users(users: List[Dict[str, Any]]) -> None:
    _save_json(users_path(), users)


def load_sessions() -> List[Dict[str, Any]]:
    return _load_json(sessions_path(), default=[])


def save_sessions(sessions: List[Dict[str, Any]]) -> None:
    _save_json(sessions_path(), sessions)


def load_resources() -> List[Dict[str, Any]]:
    return _load_json(resources_path(), default=[])


def save_resources(resources: List[Dict[str, Any]]) -> None:
    _save_json(resources_path(), resources)


def load_dashboard() -> Dict[str, Any]:
    return _load_json(dashboard_path(), default={})


def save_dashboard(dashboard: Dict[str, Any]) -> None:
    _save_json(dashboard_path(), dashboard)


def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    users = load_users()
    for user in users:
        if user.get("email") == email:
            return user
    return None


def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    users = load_users()
    for user in users:
        if user.get("id") == user_id:
            return user
    return None

