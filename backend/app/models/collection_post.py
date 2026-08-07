# backend/app/models/collection_post.py
from datetime import datetime
from app.extensions import db

class CollectionPost(db.Model):
    __tablename__ = "collection_posts"

    collection_id = db.Column(db.Integer, db.ForeignKey("collections.id"), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)