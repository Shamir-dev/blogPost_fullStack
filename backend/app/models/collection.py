# backend/app/models/collection.py — full file, updated
from datetime import datetime
from app.extensions import db

class Collection(db.Model):
    __tablename__ = "collections"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship("Post", secondary="collection_posts", backref="collections")

    def to_dict(self, include_count=False):
        data = {"id": self.id, "name": self.name, "user_id": self.user_id}
        if include_count:
            data["post_count"] = len(self.posts)
        return data