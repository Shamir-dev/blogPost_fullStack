# backend/app/routes/posts.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.post import Post
from app.models.category import Category
from app.models.follow import Follow

posts_bp = Blueprint("posts", __name__)


@posts_bp.route("/search", methods=["GET"])
def search_posts():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify([])
    posts = Post.query.filter(
        Post.status == "published",
        Post.title.ilike(f"%{q}%")
    ).order_by(Post.created_at.desc()).limit(20).all()
    return jsonify([p.to_dict() for p in posts])


# backend/app/routes/posts.py —
@posts_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def get_posts():
    sort = request.args.get("sort", "recent")
    category_slug = request.args.get("category")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 6, type=int)

    query = Post.query.filter_by(status="published")

    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)

    if sort == "following":
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"posts": [], "has_more": False})
        followed_ids = [f.following_id for f in Follow.query.filter_by(follower_id=user_id).all()]
        query = query.filter(Post.author_id.in_(followed_ids))
        all_posts = query.order_by(Post.created_at.desc()).all()
    elif sort == "popular":
        all_posts = query.all()
        all_posts.sort(key=lambda p: len(p.likes), reverse=True)
    elif sort == "trending":
        all_posts = query.all()
        all_posts.sort(key=lambda p: (len(p.likes) + len(p.comments)), reverse=True)
    else:
        all_posts = query.order_by(Post.created_at.desc()).all()

    start = (page - 1) * per_page
    end = start + per_page
    page_posts = all_posts[start:end]
    has_more = end < len(all_posts)

    return jsonify({
        "posts": [p.to_dict() for p in page_posts],
        "has_more": has_more,
        "total": len(all_posts),
    })

@posts_bp.route("/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.view_count += 1
    db.session.commit()

    data = post.to_dict()
    data["content"] = post.content
    return jsonify(data)


@posts_bp.route("", methods=["POST"])
def create_post():
    data = request.get_json()

    required = ["title", "content", "author_id", "category_id"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    post = Post(
        title=data["title"],
        content=data["content"],
        excerpt=data.get("excerpt", data["content"][:150]),
        cover_image=data.get("cover_image", ""),
        status=data.get("status", "published"),
        read_time=data.get("read_time", "5 min read"),
        author_id=data["author_id"],
        category_id=data["category_id"],
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


@posts_bp.route("/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()

    for field in ["title", "content", "excerpt", "cover_image", "status", "read_time", "category_id"]:
        if field in data:
            setattr(post, field, data[field])

    db.session.commit()
    return jsonify(post.to_dict())


@posts_bp.route("/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200