# backend/app/routes/posts.py
from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.post import Post
from app.models.category import Category

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("", methods=["GET"])
def get_posts():
    sort = request.args.get("sort", "recent")  # popular | recent | trending
    category_slug = request.args.get("category")

    query = Post.query.filter_by(status="published")

    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)

    if sort == "popular":
        # naive popularity = like count; refined later with a real score
        posts = query.all()
        posts.sort(key=lambda p: len(p.likes), reverse=True)
    elif sort == "trending":
        posts = query.all()
        posts.sort(key=lambda p: (len(p.likes) + len(p.comments)), reverse=True)
    else:  # recent
        posts = query.order_by(Post.created_at.desc()).all()

    return jsonify([p.to_dict() for p in posts])


@posts_bp.route("/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.view_count += 1
    db.session.commit()

    data = post.to_dict()
    data["content"] = post.content  # full body only on detail view
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