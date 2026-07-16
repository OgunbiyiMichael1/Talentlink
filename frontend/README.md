# TalentLink 🌿
### Where Talent Owners and Talent Finders Meet

TalentLink is a full-stack professional networking and job board platform that connects candidates with employers. Built as a portfolio project to demonstrate full-stack development skills.

🔗 **Live Demo:** [talentlink-topaz.vercel.app](https://talentlink-topaz.vercel.app)

---

## 🚀 Features

### For Candidates
- Register and build a professional profile
- Upload profile picture and resume (PDF)
- Browse and search job listings by title, location and type
- Apply to jobs with one click
- Track application status in real time (Pending → Interviewing → Offered)
- Receive email notifications when status changes
- Connect with employers and other professionals
- Share posts on the social feed
- Like and comment on posts

### For Employers
- Register company profile with logo and bio
- Post, edit and close job listings
- View all applicants for each job
- Update applicant status with dropdown
- Receive email notifications when candidates apply
- Connect with candidates and professionals
- Browse the social feed

### Platform Features
- JWT authentication stored via Bearer token
- Dark mode support (system preference + manual toggle)
- Fully responsive — works on mobile and desktop
- Search for people, jobs and skills globally
- Public profiles with posts, connections count and contact info
- Email notifications via Resend
- File uploads via Cloudinary
- Real-time profile picture lightbox

---

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, Tailwind CSS v4
- Vanilla JavaScript
- Three.js (3D hero animation)

### Backend
- Node.js + Express.js
- PostgreSQL (Supabase)
- JWT Authentication
- Multer + Cloudinary (file uploads)
- Resend (email notifications)
- Bcrypt (password hashing)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Supabase

---

## 📁 Project Structure
talentlink/
├── backend/
│   ├── config/          # Database, Cloudinary, Multer config
│   ├── controller/      # Route handlers
│   ├── middleware/      # Auth and role middleware
│   ├── routes/          # API routes
│   ├── utils/           # Email templates
│   └── server.js        # Entry point
└── frontend/
├── assets/          # CSS, images
├── js/              # JavaScript files
└── *.html           # Pages

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/:id | Get user profile |
| PATCH | /api/users/:id | Update user profile |
| DELETE | /api/users/:id | Delete account |
| GET | /api/users/search | Global search |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs (with search) |
| GET | /api/jobs/:id | Get single job |
| POST | /api/jobs | Create job (employer only) |
| PATCH | /api/jobs/:id | Update job |
| PATCH | /api/jobs/:id/close | Toggle job status |
| DELETE | /api/jobs/:id | Delete job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications | Apply to job |
| GET | /api/applications/candidate/:userId | Candidate applications |
| GET | /api/applications/job/:jobId | Job applicants |
| PATCH | /api/applications/:id/status | Update status |
| DELETE | /api/applications/:id | Withdraw application |

### Social
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Get all posts |
| POST | /api/posts | Create post |
| DELETE | /api/posts/:id | Delete post |
| POST | /api/comments | Add comment |
| POST | /api/likes | Like post |
| DELETE | /api/likes | Unlike post |
| POST | /api/connections | Send connection request |
| PATCH | /api/connections/:id | Accept/reject request |

---

## ⚙️ Running Locally

### Prerequisites
- Node.js
- PostgreSQL database (Supabase)
- Cloudinary account
- Resend account

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
PORT=5000
DATABASE_URL=your_supabase_session_pooler_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key

```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run watch
```

Open `frontend/index.html` with Live Server.

---

## 🗄️ Database Schema

9 tables: `users`, `candidate_profiles`, `employer_profiles`, `jobs`, `job_applications`, `connections`, `posts`, `comments`, `post_likes`

---

## 👨‍💻 Built By

**Ogunbiyi Michael** — Junior Full-Stack Developer

- GitHub: [github.com/OgunbiyiMichael1](https://github.com/OgunbiyiMichael1)
- Live Project: [talentlink-topaz.vercel.app](https://talentlink-topaz.vercel.app)

---

*Built with Node.js, Express, PostgreSQL, Tailwind CSS and Vanilla JavaScript*