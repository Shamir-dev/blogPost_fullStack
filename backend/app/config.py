import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'devinsights.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevConfig(Config):
    DEBUG = True

class ProdConfig(Config):
    DEBUG = False