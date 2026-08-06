# backend/app/routes/interactions.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.post import Post
from app.models.like import Like
from app.models.bookmark import Bookmark
from app.models.comment import Comment

interactions_bp = Blueprint("interactions", __name__)


@interactions_bp.route("/posts/<int:post_id>/like", methods=["POST"])
@jwt_required()
def toggle_like(post_id):
    user_id = get_jwt_identity()
    Post.query.get_or_404(post_id)

    existing = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        liked = False
    else:
        db.session.add(Like(user_id=user_id, post_id=post_id))
        db.session.commit()
        liked = True

    count = Like.query.filter_by(post_id=post_id).count()
    return jsonify({"liked": liked, "like_count": count})


@interactions_bp.route("/posts/<int:post_id>/bookmark", methods=["POST"])
@jwt_required()
def toggle_bookmark(post_id):
    user_id = get_jwt_identity()
    Post.query.get_or_404(post_id)

    existing = Bookmark.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        bookmarked = False
    else:
        db.session.add(Bookmark(user_id=user_id, post_id=post_id))
        db.session.commit()
        bookmarked = True

    return jsonify({"bookmarked": bookmarked})


@interactions_bp.route("/posts/<int:post_id>/status", methods=["GET"])
@jwt_required(optional=True)
def interaction_status(post_id):
    """Tells the frontend if the current user already liked/bookmarked this post."""
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"liked": False, "bookmarked": False})

    liked = Like.query.filter_by(user_id=user_id, post_id=post_id).first() is not None
    bookmarked = Bookmark.query.filter_by(user_id=user_id, post_id=post_id).first() is not None
    return jsonify({"liked": liked, "bookmarked": bookmarked})


@interactions_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    Post.query.get_or_404(post_id)
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.desc()).all()
    return jsonify([c.to_dict() for c in comments])


@interactions_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    Post.query.get_or_404(post_id)
    data = request.get_json()

    if not data.get("content", "").strip():
        return jsonify({"error": "Comment cannot be empty"}), 400

    comment = Comment(content=data["content"], post_id=post_id, user_id=user_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201