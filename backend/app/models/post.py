# backend/app/models/post.py
from datetime import datetime
from app.extensions import db

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)  # markdown
    excerpt = db.Column(db.String(300), default="")
    cover_image = db.Column(db.String(255), default="")
    status = db.Column(db.String(20), default="published")  # 'draft' | 'published'
    read_time = db.Column(db.String(20), default="5 min read")
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    author = db.relationship("User", back_populates="posts")
    category = db.relationship("Category", back_populates="posts")
    comments = db.relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = db.relationship("Like", back_populates="post", cascade="all, delete-orphan")
    bookmarks = db.relationship("Bookmark", back_populates="post", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "excerpt": self.excerpt,
            "cover_image": self.cover_image,
            "status": self.status,
            "read_time": self.read_time,
            "view_count": self.view_count,
            "created_at": self.created_at.isoformat(),
            "author": self.author.to_dict(),
            "category": self.category.to_dict(),
            "like_count": len(self.likes),
            "comment_count": len(self.comments),
        }