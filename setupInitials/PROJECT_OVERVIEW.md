# blogPost (DevInsights) — Project Overview

A full-stack blog platform built with React (Vite) + Flask + SQLAlchemy + SQLite.

---

## 1. Tech Stack & Concepts Used

### Frontend
| Concept | Where used |
|---|---|
| **React (Vite)** | Base framework, fast dev server + build tool |
| **React Router v6** | Client-side routing — `<Routes>`, `<Route>`, `<Outlet>`, `useParams`, `useNavigate`, `useSearchParams`, nested/protected routes |
| **Tailwind CSS v4** | Utility-first styling via `@tailwindcss/vite` plugin; `@custom-variant dark` for class-based dark mode |
| **Context API** | `AuthContext` (user/token/login/logout), `ThemeContext` (dark/light) — app-wide state without prop drilling |
| **Custom Hooks** | `usePosts`, `usePost`, `useCategories`, `useAuth`, `useTheme` — encapsulate data-fetching + loading/error state |
| **Axios + Interceptors** | Centralized API client (`api/axios.js`) auto-attaches JWT to every request |
| **Controlled Components** | All forms (login, register, write post, settings) use React state for inputs |
| **Optimistic UI Updates** | Like/bookmark buttons update instantly, roll back on API failure |
| **Protected/Role-based Routing** | `ProtectedRoute` (auth required), `AdminRoute` (admin-only) as route guard wrappers |
| **Pagination (Load More)** | `usePosts` hook tracks `page`/`hasMore`, backend returns `{ posts, has_more, total }` |
| **File Upload (FormData)** | Cover images + avatars uploaded via `multipart/form-data` to Flask, served back as static files |
| **Lucide React** | Icon library throughout the UI |

### Backend
| Concept | Where used |
|---|---|
| **Flask (Application Factory pattern)** | `create_app()` in `app/__init__.py` — allows multiple configs (dev/prod) |
| **Flask Blueprints** | Each resource (`posts`, `auth`, `users`, `categories`, `interactions`, `collections`, `admin`, `uploads`) is a separate blueprint, registered with its own URL prefix |
| **SQLAlchemy ORM** | Models define tables as Python classes; relationships (`db.relationship`, `backref`, `secondary=`) model foreign keys and many-to-many joins |
| **Flask-Migrate (Alembic)** | Version-controlled schema migrations (`db migrate` / `db upgrade`) instead of `db.create_all()` |
| **Flask-JWT-Extended** | Stateless authentication — `create_access_token`, `@jwt_required()`, `@jwt_required(optional=True)`, `get_jwt_identity()` |
| **Flask-CORS** | Allows the Vite dev server (port 5173) to call the Flask API (port 5000) cross-origin |
| **Password Hashing** | `werkzeug.security.generate_password_hash` / `check_password_hash` — passwords never stored in plaintext |
| **RESTful API Design** | Resource-based URLs (`/api/posts/:id`), correct HTTP verbs (GET/POST/PUT/PATCH/DELETE), status codes (200/201/400/401/403/404/409) |
| **Decorator-based Authorization** | Custom `admin_required` decorator wraps `@jwt_required()` + role check |
| **File Uploads** | `werkzeug.utils.secure_filename`, UUID-based filenames, `send_from_directory` to serve them |
| **Many-to-Many Relationships** | `Collection` ↔ `Post` via `collection_posts` association table (`secondary=`) |
| **Self-referential Relationship** | `Follow` model (`follower_id`/`following_id`, both FKs to `users.id`) |

### Database Schema (SQLite)
```
User ──┬── Post (author_id)
       ├── Comment (user_id)
       ├── Like (user_id) ──┐
       ├── Bookmark (user_id) ──┼── Post
       ├── Follow (follower_id/following_id, self-referential)
       ├── Collection (user_id) ──┼── Post (via collection_posts)
       └── PasswordResetRequest (user_id)

Post ──┬── Category (category_id)
       ├── Comment (1→many)
       ├── Like (1→many)
       ├── Bookmark (1→many)
       └── Collection (many↔many via collection_posts)
```

---

## 2. Application Flow

### 2.1 Auth Flow
```
Register/Login (POST /api/auth/register|login)
   → Flask validates, hashes password, issues JWT
   → Frontend stores JWT in localStorage
   → AuthContext fetches /api/auth/me on load to restore session
   → axios interceptor attaches "Authorization: Bearer <token>" to every request
   → ProtectedRoute / AdminRoute guard frontend routes
   → @jwt_required() / admin_required guard backend routes
```

### 2.2 Content Flow
```
WritePost.jsx (form) → POST/PUT /api/posts
   → Post saved with status: "published" | "draft"
   → Home.jsx fetches via usePosts(sort, category) → GET /api/posts?sort=&category=&page=
   → PostGridCard renders each post → click → PostView.jsx → GET /api/posts/:id
   → PostActions (like/bookmark) → POST /api/posts/:id/like|bookmark (optimistic update)
   → CommentList → GET/POST /api/posts/:id/comments
```

### 2.3 Password Reset Flow (admin-mediated, no email service)
```
User → ForgotPassword.jsx → POST /api/auth/request-reset
   → Creates a PasswordResetRequest (status: "pending")
Admin → AdminDashboard "Pending Resets" tab → GET /api/admin/password-resets
   → Clicks Resolve → POST /api/admin/password-resets/:id/resolve
   → Backend generates a random temp password, hashes + saves it, marks request "resolved"
   → Temp password shown ONCE on the admin's screen (never stored in plaintext)
   → Admin manually relays it to the user (email/chat/etc. — no SMTP integration)
   → User logs in with temp password → changes it via Settings → PATCH /api/users/me/password
```

### 2.4 Collections Flow
```
Collections.jsx → create/delete collections (CRUD)
PostActions → SaveToCollectionButton → lists user's collections → POST /api/collections/:id/posts/:postId
CollectionDetail.jsx → GET /api/collections/:id → shows all posts inside
```

---

## 3. Folder Structure

```
blogPost_fullStack/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # app factory, blueprint registration
│   │   ├── config.py            # env-based config (SECRET_KEY, DB URI, upload folder)
│   │   ├── extensions.py        # db, migrate, cors, jwt instances
│   │   ├── models/               # one file per SQLAlchemy model
│   │   ├── routes/               # one blueprint per resource
│   │   └── utils/
│   ├── migrations/                # Alembic version history
│   ├── instance/
│   │   └── devinsights.db         # SQLite file (gitignored)
│   ├── uploads/                   # user-uploaded images (gitignored)
│   ├── seed.py                    # sample data script
│   ├── run.py                     # entry point
│   ├── requirements.txt
│   └── .env                       # secrets (gitignored)
│
└── frontend/
    ├── src/
    │   ├── api/                   # axios request functions, one file per resource
    │   ├── components/            # grouped by domain: layout, feed, post, comments, auth, user, category, ui
    │   ├── context/                # AuthContext, ThemeContext
    │   ├── hooks/                  # data-fetching hooks
    │   ├── pages/                  # route-level views
    │   ├── App.jsx                 # route definitions
    │   └── main.jsx                # entry point, provider wrapping
    ├── index.html
    ├── vite.config.js              # includes @tailwindcss/vite plugin
    └── package.json
```

---

## 4. API Surface (Full)

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `GET /me`, `POST /request-reset` |
| Posts | `GET /api/posts` (paginated, sort/category), `GET/PUT/DELETE /api/posts/:id`, `POST /api/posts`, `GET /api/posts/search?q=` |
| Categories | `GET /api/categories` |
| Interactions | `POST /api/posts/:id/like`, `/bookmark`, `GET /:id/status`, `GET/POST /:id/comments` |
| Users | `GET /api/users/:id`, `/me/articles`, `/me/drafts`, `/me/bookmarks`, `PATCH /me`, `PATCH /me/password`, `POST /:id/follow`, `GET /:id/followers`, `/following` |
| Collections | `GET/POST /api/collections`, `GET/DELETE /:id`, `POST/DELETE /:id/posts/:postId` |
| Uploads | `POST /api/uploads/image` |
| Admin | `GET /api/admin/stats`, `/users`, `/posts`, `/password-resets`, `/password-resets/history`, `DELETE /users/:id`, `/posts/:id`, `POST /password-resets/:id/resolve` |

---

## 5. Deployment Structure (Recommended)

This project currently runs as two separate dev servers locally. For deployment, the recommended split:

### Backend (Flask API)
- **Host options:** Render, Railway, Fly.io, or a VPS (DigitalOcean/AWS EC2)
- **Database:** Migrate from SQLite → **PostgreSQL** for production (SQLite is fine for dev/demo only — it doesn't handle concurrent writes well)
- **WSGI server:** Use **Gunicorn** (not Flask's built-in dev server) behind Nginx as a reverse proxy
- **Environment variables:** `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL` set via host's env config, never committed
- **File uploads:** Move from local `uploads/` folder to **cloud object storage** (S3, Cloudflare R2, or Cloudinary) — local disk storage doesn't persist across container restarts on most PaaS platforms
- **CORS:** Update `origins` in `cors.init_app()` to the deployed frontend's real domain instead of `localhost:5173`

### Frontend (React/Vite)
- **Host options:** Vercel, Netlify, or Cloudflare Pages (all have generous free tiers, ideal for Vite static builds)
- **Build command:** `npm run build` → outputs static files to `dist/`
- **Environment variable:** Replace hardcoded `http://localhost:5000/api` in `api/axios.js` with an env var (`import.meta.env.VITE_API_URL`) so it points to the deployed backend URL

### Suggested Production Architecture
```
┌─────────────────┐        ┌──────────────────────┐        ┌─────────────┐
│  Vercel/Netlify  │──────▶│  Render/Railway (Flask)│──────▶│ PostgreSQL  │
│  (React static)  │  API  │  + Gunicorn + Nginx    │        │  (managed)  │
└─────────────────┘  calls └──────────────────────┘        └─────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  S3 / Cloudinary │
                              │  (image uploads) │
                              └─────────────────┘
```

### Pre-deployment Checklist
- [ ] Switch `DEBUG = True` → `False` in production config
- [ ] Set strong, unique `SECRET_KEY` / `JWT_SECRET_KEY` (not the dev placeholders)
- [ ] Migrate SQLite → PostgreSQL, re-run migrations against the new DB
- [ ] Move uploads to cloud storage
- [ ] Set real CORS origin (not `localhost`)
- [ ] Add HTTPS (most PaaS platforms handle this automatically)
- [ ] Set frontend's API base URL via environment variable, not hardcoded
- [ ] Consider adding rate limiting (Flask-Limiter) on auth endpoints before going public

---

## 6. Notable Design Decisions

- **JWT in localStorage** (not httpOnly cookies) — simpler for a portfolio project; production apps would typically use httpOnly cookies + refresh tokens to reduce XSS risk
- **No email service integrated** — password reset is admin-mediated by design for this build; swapping in SendGrid/Mailgun would automate the "admin resolves → user receives" step
- **SQLite for dev** — zero-config, file-based; intentionally swapped for Postgres at deploy time
- **DiceBear avatars** — generated, license-free avatar images (no real photos, avoids stock-photo/licensing concerns)
