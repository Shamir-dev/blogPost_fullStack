// README.md 
# blogPost

A full-stack blog platform where developers can write, read, and discuss technical articles — built as a portfolio project.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios, Lucide Icons
**Backend:** Flask, SQLAlchemy, Flask-Migrate (Alembic), Flask-JWT-Extended, Flask-CORS
**Database:** SQLite (dev)

## Features

- JWT authentication (register/login)
- Create, edit, delete, and draft articles (Markdown content)
- Cover image upload
- Like, bookmark, and comment on posts
- Follow other authors + a personalized "Following" feed
- Category browsing and full-text search
- Custom collections (save posts into user-created folders)
- Popular / Recent / Trending sorting with pagination
- Dark mode, collapsible sidebar, responsive layout

## Project Structure

blogPost_fullStack/
├── backend/ # Flask API
│ ├── app/
│ │ ├── models/ # SQLAlchemy models
│ │ ├── routes/ # Blueprints (auth, posts, users, etc.)
│ │ └── config.py
│ ├── migrations/
│ ├── uploads/ # user-uploaded images (gitignored)
│ └── run.py
└── frontend/ # React app
└── src/
├── api/ # axios request functions
├── components/ # reusable UI, grouped by domain
├── context/ # Auth + Theme providers
├── hooks/ # data-fetching hooks
└── pages/ # route-level views
## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# create .env (see .env.example)

flask --app run.py db upgrade
python seed.py               # optional: seed sample data
python run.py                # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # runs on http://localhost:5173
```

## Environment Variables (`backend/.env`)



## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register`, `/login` | Auth |
| GET | `/api/posts` | Paginated feed with sort/category filters |
| GET/POST/PUT/DELETE | `/api/posts/:id` | Post CRUD |
| GET/POST | `/api/posts/:id/comments` | Comments |
| POST | `/api/posts/:id/like`, `/bookmark` | Toggle interactions |
| GET/POST/DELETE | `/api/collections` | Collections CRUD |
| POST | `/api/users/:id/follow` | Follow/unfollow |
| GET | `/api/posts/search?q=` | Search |

## Screenshots

*(add screenshots here)*

## License

MIT