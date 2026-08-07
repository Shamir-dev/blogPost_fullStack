# backend/app/routes/users.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.post import Post
from app.models.bookmark import Bookmark
from app.models.follow import Follow

users_bp = Blueprint("users", __name__)


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    followers_count = Follow.query.filter_by(following_id=user_id).count()
    following_count = Follow.query.filter_by(follower_id=user_id).count()
    posts_count = Post.query.filter_by(author_id=user_id, status="published").count()

    data = user.to_dict()
    data.update({
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count,
    })
    return jsonify(data)


@users_bp.route("/me/articles", methods=["GET"])
@jwt_required()
def get_my_articles():
    user_id = get_jwt_identity()
    posts = Post.query.filter_by(author_id=user_id, status="published").order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])


@users_bp.route("/me/drafts", methods=["GET"])
@jwt_required()
def get_my_drafts():
    user_id = get_jwt_identity()
    posts = Post.query.filter_by(author_id=user_id, status="draft").order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])


@users_bp.route("/me/bookmarks", methods=["GET"])
@jwt_required()
def get_my_bookmarks():
    user_id = get_jwt_identity()
    bookmarks = Bookmark.query.filter_by(user_id=user_id).all()
    posts = [b.post.to_dict() for b in bookmarks]
    return jsonify(posts)


@users_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_my_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if "avatar_url" in data:
        user.avatar_url = data["avatar_url"]
    if "bio" in data:
        user.bio = data["bio"]

    db.session.commit()
    return jsonify(user.to_dict())


@users_bp.route("/<int:user_id>/follow", methods=["POST"])
@jwt_required()
def toggle_follow(user_id):
    follower_id = get_jwt_identity()
    if follower_id == user_id:
        return jsonify({"error": "Cannot follow yourself"}), 400

    User.query.get_or_404(user_id)

    existing = Follow.query.filter_by(follower_id=follower_id, following_id=user_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        following = False
    else:
        db.session.add(Follow(follower_id=follower_id, following_id=user_id))
        db.session.commit()
        following = True

    return jsonify({"following": following})


@users_bp.route("/<int:user_id>/followers", methods=["GET"])
def get_followers(user_id):
    User.query.get_or_404(user_id)
    followers = db.session.query(User).join(Follow, Follow.follower_id == User.id).filter(Follow.following_id == user_id).all()
    return jsonify([u.to_dict() for u in followers])


@users_bp.route("/<int:user_id>/following", methods=["GET"])
def get_following(user_id):
    User.query.get_or_404(user_id)
    following = db.session.query(User).join(Follow, Follow.following_id == User.id).filter(Follow.follower_id == user_id).all()
    return jsonify([u.to_dict() for u in following])


# backend/app/routes/users.py — Added this route (to let user reset password)# self service in setting
@users_bp.route("/me/password", methods=["PATCH"])
@jwt_required()
def change_my_password():
    from werkzeug.security import generate_password_hash, check_password_hash
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not check_password_hash(user.password_hash, data.get("current_password", "")):
        return jsonify({"error": "Current password is incorrect"}), 401

    new_password = data.get("new_password", "")
    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password updated"})