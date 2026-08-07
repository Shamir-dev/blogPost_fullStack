# backend/app/routes/collections.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.collection import Collection
from app.models.post import Post

collections_bp = Blueprint("collections", __name__)


@collections_bp.route("", methods=["GET"])
@jwt_required()
def get_my_collections():
    user_id = get_jwt_identity()
    collections = Collection.query.filter_by(user_id=user_id).all()
    return jsonify([c.to_dict(include_count=True) for c in collections])


@collections_bp.route("", methods=["POST"])
@jwt_required()
def create_collection():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data.get("name", "").strip():
        return jsonify({"error": "Collection name is required"}), 400

    collection = Collection(name=data["name"], user_id=user_id)
    db.session.add(collection)
    db.session.commit()
    return jsonify(collection.to_dict()), 201


@collections_bp.route("/<int:collection_id>", methods=["GET"])
@jwt_required()
def get_collection(collection_id):
    user_id = get_jwt_identity()
    collection = Collection.query.get_or_404(collection_id)
    if str(collection.user_id) != str(user_id):
        return jsonify({"error": "Not authorized"}), 403

    return jsonify({
        "id": collection.id,
        "name": collection.name,
        "posts": [p.to_dict() for p in collection.posts],
    })


@collections_bp.route("/<int:collection_id>/posts/<int:post_id>", methods=["POST"])
@jwt_required()
def add_post_to_collection(collection_id, post_id):
    user_id = get_jwt_identity()
    collection = Collection.query.get_or_404(collection_id)
    if str(collection.user_id) != str(user_id):
        return jsonify({"error": "Not authorized"}), 403

    post = Post.query.get_or_404(post_id)
    if post not in collection.posts:
        collection.posts.append(post)
        db.session.commit()

    return jsonify({"message": "Added"}), 200


@collections_bp.route("/<int:collection_id>/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def remove_post_from_collection(collection_id, post_id):
    user_id = get_jwt_identity()
    collection = Collection.query.get_or_404(collection_id)
    if str(collection.user_id) != str(user_id):
        return jsonify({"error": "Not authorized"}), 403

    post = Post.query.get_or_404(post_id)
    if post in collection.posts:
        collection.posts.remove(post)
        db.session.commit()

    return jsonify({"message": "Removed"}), 200


@collections_bp.route("/<int:collection_id>", methods=["DELETE"])
@jwt_required()
def delete_collection(collection_id):
    user_id = get_jwt_identity()
    collection = Collection.query.get_or_404(collection_id)
    if str(collection.user_id) != str(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(collection)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200