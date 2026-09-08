import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODELS: list = [
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-flash-latest"
    ]
    PORT: int = int(os.getenv("AI_PORT", 8000))
    HOST: str = os.getenv("AI_HOST", "0.0.0.0")

config = Config()
