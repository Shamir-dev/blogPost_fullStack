# # backend/app/routes/categories.py
# from flask import Blueprint, jsonify
# from app.models.category import Category

# categories_bp = Blueprint("categories", __name__)
# @categories_bp.route("", methods=["GET"])
# def get_categories():
#     categories = Category.query.all()
#     return jsonify([c.to_dict(include_count=True) for c in categories])

# backend/app/routes/categories.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from app.extensions import db
from app.models.category import Category
from app.models.user import User

categories_bp = Blueprint("categories", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = User.query.get(get_jwt_identity())
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


def slugify(name):
    return name.strip().lower().replace(" & ", "-").replace(" ", "-")


@categories_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict(include_count=True) for c in categories])


@categories_bp.route("", methods=["POST"])
@admin_required
def create_category():
    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Category name is required"}), 400

    slug = slugify(name)
    if Category.query.filter_by(slug=slug).first():
        return jsonify({"error": "A category with this name already exists"}), 409

    category = Category(name=name, slug=slug, icon=data.get("icon", ""))
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@categories_bp.route("/<int:category_id>", methods=["PUT"])
@admin_required
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()

    if "name" in data and data["name"].strip():
        category.name = data["name"].strip()
        category.slug = slugify(data["name"])
    if "icon" in data:
        category.icon = data["icon"]

    db.session.commit()
    return jsonify(category.to_dict())


@categories_bp.route("/<int:category_id>", methods=["DELETE"])
@admin_required
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    if len(category.posts) > 0:
        return jsonify({"error": f"Cannot delete — {len(category.posts)} post(s) still use this category"}), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"})