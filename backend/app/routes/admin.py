# backend/app/routes/admin.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime
from werkzeug.security import generate_password_hash
import secrets
from app.extensions import db
from app.models.user import User
from app.models.post import Post
from app.models.password_reset import PasswordResetRequest

admin_bp = Blueprint("admin", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = User.query.get(get_jwt_identity())
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def get_stats():
    return jsonify({
        "total_users": User.query.count(),
        "total_posts": Post.query.filter_by(status="published").count(),
        "total_drafts": Post.query.filter_by(status="draft").count(),
        "pending_resets": PasswordResetRequest.query.filter_by(status="pending").count(),
    })


@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})


@admin_bp.route("/posts", methods=["GET"])
@admin_required
def get_all_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])


@admin_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@admin_required
def admin_delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"})


@admin_bp.route("/password-resets", methods=["GET"])
@admin_required
def get_password_resets():
    requests_ = PasswordResetRequest.query.filter_by(status="pending").order_by(PasswordResetRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests_])


@admin_bp.route("/password-resets/history", methods=["GET"])
@admin_required
def get_password_reset_history():
    requests_ = PasswordResetRequest.query.filter_by(status="resolved").order_by(PasswordResetRequest.resolved_at.desc()).all()
    return jsonify([r.to_dict() for r in requests_])


@admin_bp.route("/password-resets/<int:request_id>/resolve", methods=["POST"])
@admin_required
def resolve_password_reset(request_id):
    reset_req = PasswordResetRequest.query.get_or_404(request_id)
    new_password = secrets.token_urlsafe(8)

    reset_req.user.password_hash = generate_password_hash(new_password)
    reset_req.status = "resolved"
    reset_req.resolved_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Password reset", "new_password": new_password, "user_email": reset_req.user.email})