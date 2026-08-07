# backend/app/__init__.py
from flask import Flask, send_from_directory
from app.config import DevConfig
from app.extensions import db, migrate, cors, jwt
from app.models import user, category, post, comment, like, bookmark, follow, collection, collection_post

def create_app(config_class=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    jwt.init_app(app)


    from app.routes.posts import posts_bp
    from app.routes.categories import categories_bp
    from app.routes.auth import auth_bp
    from app.routes.interactions import interactions_bp
    from app.routes.users import users_bp
    from app.routes.uploads import uploads_bp
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(interactions_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(uploads_bp, url_prefix="/api/uploads")

    @app.route("/uploads/<filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app