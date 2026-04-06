from dataclasses import dataclass, field
import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = BASE_DIR / "medbridge.db"
UPLOADS_DIR = BASE_DIR / "uploads"


@dataclass
class Settings:
    app_name: str = "medbridge-backend"
    api_prefix: str = "/api"
    database_url: str = os.getenv("MEDBRIDGE_DATABASE_URL", f"sqlite:///{DATABASE_PATH.as_posix()}")
    uploads_dir: str = os.getenv("MEDBRIDGE_UPLOADS_DIR", str(UPLOADS_DIR))
    cors_origins: list[str] = field(
        default_factory=lambda: [
            origin.strip()
            for origin in os.getenv(
                "MEDBRIDGE_CORS_ORIGINS",
                "http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006,http://127.0.0.1:19006",
            ).split(",")
            if origin.strip()
        ]
    )


settings = Settings()
