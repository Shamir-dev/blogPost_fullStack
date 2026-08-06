# backend/app/models/category.py
from app.extensions import db

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    icon = db.Column(db.String(50), default="")

    posts = db.relationship("Post", back_populates="category")

    def to_dict(self, include_count=False):
        data = {"id": self.id, "name": self.name, "slug": self.slug, "icon": self.icon}
        if include_count:
            data["post_count"] = len(self.posts)
        return data