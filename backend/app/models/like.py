# backend/app/models/like.py
from datetime import datetime
from app.extensions import db

class Like(db.Model):
    __tablename__ = "likes"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    post = db.relationship("Post", back_populates="likes")