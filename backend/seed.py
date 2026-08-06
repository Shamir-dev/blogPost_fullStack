# backend/seed.py
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.post import Post
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    alex = User(username="alexjohnson", email="alex@example.com",
                password_hash=generate_password_hash("password123"),
                avatar_url="https://i.pravatar.cc/40?img=1", is_verified=True)
    sarah = User(username="sarahchen", email="sarah@example.com",
                 password_hash=generate_password_hash("password123"),
                 avatar_url="https://i.pravatar.cc/40?img=5", is_verified=True)
    db.session.add_all([alex, sarah])
    db.session.commit()

    # Categories
    cat_names = [
        ("Science & Tech", "science-tech"),
        ("AI & Innovation", "ai-innovation"),
        ("Philosophy", "philosophy"),
        ("Biology & Medicine", "biology-medicine"),
        ("Physics & Maths", "physics-maths"),
        ("Career & Growth", "career-growth"),
    ]
    categories = [Category(name=n, slug=s) for n, s in cat_names]
    db.session.add_all(categories)
    db.session.commit()

    # Posts
    posts = [
        Post(
            title="Understanding Large Language Models: From Transformer to Real-World Applications",
            content="Full markdown content here...",
            excerpt="A deep dive into how LLMs work under the hood, the transformer architecture, training process, and their real-world use cases.",
            cover_image="https://picsum.photos/seed/llm/600/400",
            read_time="12 min read",
            author_id=alex.id,
            category_id=categories[1].id,  # AI & Innovation
        ),
        Post(
            title="CRISPR Gene Editing: Revolutionizing Modern Medicine",
            content="Full markdown content here...",
            excerpt="Exploring the science behind CRISPR, its breakthroughs, ethical considerations, and future potential in human health.",
            cover_image="https://picsum.photos/seed/crispr/600/400",
            read_time="8 min read",
            author_id=sarah.id,
            category_id=categories[3].id,  # Biology & Medicine
        ),
    ]
    db.session.add_all(posts)
    db.session.commit()

    print(f"Seeded {User.query.count()} users, {Category.query.count()} categories, {Post.query.count()} posts.")