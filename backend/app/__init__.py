# backend/app/__init__.py
from flask import Flask
from app.config import DevConfig
from app.extensions import db, migrate, cors, jwt

def create_app(config_class=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    jwt.init_app(app)

    from app.models import user, category, post, comment, like, bookmark, follow

    from app.routes.posts import posts_bp
    from app.routes.categories import categories_bp
    from app.routes.auth import auth_bp
    from app.routes.interactions import interactions_bp
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(interactions_bp, url_prefix="/api")

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app