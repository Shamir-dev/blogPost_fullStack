# backend/app/routes/categories.py
from flask import Blueprint, jsonify
from app.models.category import Category

categories_bp = Blueprint("categories", __name__)

@categories_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict(include_count=True) for c in categories])