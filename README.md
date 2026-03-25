# Portfolio CMS + Admin Panel + Analytics System

A full-stack Portfolio with CMS, CRM, Visitor Analytics, Lead Management, and Email System.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express (ES Modules) |
| Database | MySQL (Aiven cloud or self-hosted) |
| Email | Nodemailer + Gmail SMTP |
| Auth | JWT (jsonwebtoken) |
| File Upload | Multer (local storage) |
| Analytics | Custom + geoip-lite |
| Animations | Framer Motion |
| Charts | Chart.js + react-chartjs-2 |

---

## Project Structure

```
portfolio-system/
├── backend/
│   ├── src/
│   │   ├── config/         # DB config
│   │   ├── middleware/      # Auth, upload, error handler
│   │   ├── routes/          # All API routes
│   │   ├── services/        # Email, Analytics services
│   │   └── utils/           # Logger
│   ├── scripts/
│   │   └── setupDatabase.js # DB setup + seed
│   ├── uploads/             # File storage (gitignored)
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── public/      # PublicLayout, LeadPopup
    │   │   └── admin/       # AdminLayout
    │   ├── context/         # AuthContext, SettingsContext
    │   ├── pages/
    │   │   ├── public/      # Home, About, Projects, Contact, Resume, Blog
    │   │   └── admin/       # Dashboard, Projects, Skills, Experience,
    │   │                    # Leads, Messages, Visitors, Blog, Resume,
    │   │                    # Settings, Profile
    │   ├── styles/          # Global CSS (Tailwind)
    │   └── utils/           # api.js, analytics.js
    ├── .env.example
    └── package.json
```

---

## Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo>
cd portfolio-system
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and Gmail App Password
npm install
node scripts/setupDatabase.js    # Creates all tables + default admin
npm run dev                       # Starts on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
npm install
npm run dev                       # Starts on port 5173
```

### 4. Access

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Portfolio (public) |
| http://localhost:5173/admin | Admin login |
| http://localhost:5000/health | Backend health check |

**Default Admin Credentials:**
- Email: `admin@portfolio.com`
- Password: `Admin@123`

> ⚠️ Change the password immediately after first login!

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MySQL (Aiven)
DB_HOST=your-host.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=portfolio
DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Gmail SMTP
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Admin
ADMIN_EMAIL=your@gmail.com
ADMIN_NAME=Your Name

# URLs (for email links)
PORTFOLIO_URL=https://yourportfolio.com
RESUME_URL=https://yourportfolio.com/resume
```

### How to get Gmail App Password
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Search "App Passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=My Portfolio
```

---

## Features

### Public Portfolio
- **Home**: Hero section, featured projects, skills
- **About**: Bio, work experience timeline, skills
- **Projects**: Filterable project grid with tech stack
- **Contact**: Form with email notification + auto-reply
- **Resume**: View and download PDF resume
- **Blog**: Posts with tags, search

### Admin Panel (`/admin`)
- **Dashboard**: Real-time analytics, charts, recent activity
- **Projects**: Full CRUD, image upload, publish/draft
- **Skills**: Manage with proficiency bars
- **Experience**: Timeline management
- **Leads**: Lead pipeline (New → Contacted → Replied → Closed)
- **Messages**: View + reply via Gmail SMTP
- **Visitors**: IP, location, device, browser tracking
- **Blog**: Create/edit posts with HTML content
- **Resume**: Upload + manage PDF versions
- **Settings**: Site config, SEO, social links
- **Profile**: Name, email, avatar, password

### Analytics Tracked
- IP Address, Country, State, City (via geoip-lite)
- Browser, OS, Device type
- Pages visited, time on page
- Traffic source (Google, LinkedIn, Direct, etc.)
- Resume downloads
- Project clicks (view, live demo, GitHub)
- UTM parameters

### Lead Capture
- Popup after configurable delay (default 25s)
- Fields: Name, Email, Phone, Company, Message, Reason
- Status pipeline management
- Admin notes per lead

### Email System
- Contact notification to admin
- Auto-reply to visitor (configurable)
- Admin reply from panel → sent via Gmail SMTP
- Email logs stored in DB

---

## Deployment on Vercel

### Backend
```bash
cd backend
vercel --prod
# Set all .env variables in Vercel dashboard
```

### Frontend
```bash
cd frontend
# Update .env: VITE_API_URL=https://your-backend.vercel.app
vercel --prod
```

---

## Database Schema

Tables: `admins`, `login_logs`, `projects`, `project_images`, `skills`, `experience`, `resumes`, `blogs`, `settings`, `social_links`, `visitors`, `visitor_sessions`, `page_views`, `visitor_events`, `resume_downloads`, `project_clicks`, `leads`, `lead_notes`, `contact_messages`, `message_replies`, `email_logs`

---

## API Routes

### Public
```
GET  /api/projects          - All published projects
GET  /api/projects/:id      - Single project
GET  /api/skills            - All skills
GET  /api/experience        - Work experience
GET  /api/resume/active     - Active resume
GET  /api/blog              - Blog posts
GET  /api/blog/:slug        - Single blog post
GET  /api/settings/public   - Public settings
GET  /api/settings/social-links - Social links
POST /api/contact           - Submit contact form
POST /api/leads             - Submit lead form
POST /api/analytics/track   - Track visitor
POST /api/analytics/pageview - Track page view
POST /api/analytics/event   - Track event
```

### Admin (requires JWT)
```
POST /api/auth/login        - Admin login
GET  /api/auth/me           - Current admin
PUT  /api/auth/profile      - Update profile
PUT  /api/auth/password     - Change password

GET  /api/dashboard/stats          - Analytics overview
GET  /api/dashboard/visitors-chart - 30-day chart
GET  /api/dashboard/countries      - Top countries
GET  /api/dashboard/devices        - Device breakdown
GET  /api/dashboard/top-pages      - Most visited pages
GET  /api/dashboard/traffic-sources - Traffic sources

GET/POST/PUT/DELETE /api/projects/admin/all
GET/POST/PUT/DELETE /api/skills/admin/all
GET/POST/PUT/DELETE /api/experience/admin/all
GET/POST/PUT/DELETE /api/blog/admin/all
GET/DELETE          /api/contact
POST                /api/contact/:id/reply
GET/PATCH/DELETE    /api/leads
GET                 /api/visitors
GET                 /api/settings
PUT                 /api/settings
```

---

## Security Notes

1. Change `JWT_SECRET` to a random 64+ character string
2. Change default admin password immediately
3. Use environment variables — never commit `.env`
4. Enable SSL for MySQL connection (`DB_SSL=true`)
5. The uploads folder is served statically — consider using S3 for production

---

## Customization

1. **Edit hero content**: Admin → Settings → Home
2. **Add your bio**: Admin → Settings → About
3. **Add projects**: Admin → Projects → Add Project
4. **Add skills**: Admin → Skills → Add Skill
5. **Upload resume**: Admin → Resume → Upload
6. **Configure email**: Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`
7. **Set contact info**: Admin → Settings → Contact
8. **Add social links**: Admin → Settings → Social Links
#   P o r t f o l i o  
 