# StudyVerse — Learn on Your Terms

A full-stack EdTech platform where instructors create and publish courses, students enroll and learn at their own pace, and an admin manages the ecosystem. Built with the MERN stack (MongoDB, Express, React, Node.js) with Cloudinary media storage and email notifications.

> **Note:** Payments currently run through a **demo enrollment flow** (no real charge). Razorpay SDK is installed and reserved for the real payment gateway integration.

---

## Features

### Authentication & Roles
- Signup with email **OTP verification**, login, logout
- **JWT-based auth** with bcrypt password hashing
- **3 roles with route-level protection** — Student, Instructor, Admin
- Forgot / reset password (email link), change password
- Rate limiting on auth endpoints (login + OTP)

### Students
- Browse courses by category, search courses, view course details + reviews
- Enroll in courses, watch lectures, mark course progress
- Wishlist, purchase history, "My Learning" resume
- Write, edit, and delete reviews & ratings

### Instructors
- 3-step course builder: info/thumbnail → sections & lectures → publish
- **Direct browser → Cloudinary video upload** with signed signatures and upload progress bar
- Instructor dashboard with per-course stats (students, revenue, ratings)

### Admin
- Dedicated admin panel: platform stats, manage instructors (approval) & students (block/unblock), manage categories
- Admin seeded via `node seedAdmin.js`

### Platform
- Enrollment confirmation emails, OTP & password emails (Nodemailer)
- Contact form → DB, review slider on homepage
- Fully responsive UI with Tailwind CSS

---

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | React 18, Redux Toolkit, React Router v6, React Hook Form, Tailwind CSS, Chart.js |
| Backend  | Node.js, Express 5, JWT, bcrypt, express-rate-limit |
| Database | MongoDB (Mongoose) |
| Media    | Cloudinary (images + videos, signed direct uploads) |
| Email    | Nodemailer (SMTP) |

---

## Folder Structure

```
├── server/                  # Express backend
│   ├── config/              # DB & Cloudinary connections
│   ├── controllers/         # Route handlers (Auth, Course, Profile, Admin, ...)
│   ├── mail/                # Email templates
│   ├── middlewares/         # auth, isStudent, isInstructor, isAdmin
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # helpers (mailSender, imageUploader)
│   ├── test/                # backend unit tests
│   ├── seedAdmin.js         # creates the default admin account
│   └── index.js             # server entry
├── src/                     # React frontend
│   ├── components/          # common + feature components
│   ├── pages/               # route pages (incl. admin/)
│   ├── services/            # API endpoints + axios calls
│   ├── slices/              # Redux slices
│   ├── utils/               # shared helpers
│   └── App.js               # routes + layout
├── public/                  # static assets
└── package.json             # root scripts (run client+server together)
```

---

## Roles & Demo Credentials

| Role       | Credentials                | How to access |
| ---------- | -------------------------- | ------------- |
| Admin      | `admin@studyverse.in` / `Admin@123` | seed first, then login with **Admin** tab selected |

To create the admin account:

```bash
cd server
node seedAdmin.js
```

Instructors and students are created through the normal signup flow (choose role on `/signup`).

---

## Getting Started

### Prerequisites
- Node.js **v18+** (v22 recommended)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account
- SMTP credentials for emails (e.g. Gmail app password)

### 1. Clone & install

```bash
git clone <repo-url>
cd StudyVerse
npm install
cd server && npm install
```

### 2. Environment variables

Copy the examples and fill in your values.

**Root** (React app):
```bash
cp .env.example .env
```

**Server**:
```bash
cd server
cp .env.example .env
```

| Server var | Description |
| ---------- | ----------- |
| `PORT` | API port (default `4000`) |
| `DB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials |
| `FOLDER_NAME` | Cloudinary folder for uploads |
| `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` | SMTP settings (Gmail works) |
| `CLIENT_URL` | Allowed frontend origin for CORS (default `http://localhost:3000`) |

| Frontend var | Description |
| ------------ | ----------- |
| `REACT_APP_BASE_URL` | Backend base URL, e.g. `http://localhost:4000/api/v1` |

### 3. Run

Run client + server together:

```bash
npm run dev
```

Or separately:

```bash
npm start        # React on http://localhost:3000
cd server
npm run dev      # Express API on http://localhost:4000
```

---

## API Overview

All endpoints are mounted under `/api/v1`. Protected routes require `Authorization: Bearer <token>`.

### Auth (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| POST | `/sendotp` | Public | Send email OTP |
| POST | `/signup` | Public | Register a user |
| POST | `/login` | Public | Login |
| POST | `/reset-password-token` | Public | Send reset link |
| POST | `/reset-password` | Public | Set new password |
| POST | `/changepassword` | Auth | Change password |

### Courses (`/api/v1/course`)
| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/getAllCourses` | Public | All published courses |
| GET | `/searchCourses` | Public | Search courses |
| POST | `/getCourseDetails` | Public | Course details (+ user-specific) |
| GET | `/videoUploadSignature` | Instructor | Signed params for direct Cloudinary upload |
| POST | `/createCourse`, `/editCourse`, `/deleteCourse` | Instructor | Manage courses |
| POST | `/addSection`, `/updateSection`, `/deleteSection` | Instructor | Manage sections |
| POST | `/addSubSection`, `/updateSubSection`, `/deleteSubSection` | Instructor | Manage lectures |
| POST | `/getFullCourseDetails` | Auth | Full course (for enrolled users) |
| POST | `/updateCourseProgress` | Student | Mark lecture progress |
| POST | `/demoEnroll` | Student | Demo enrollment (no payment) |
| GET | `/showAllCategories` | Public | Categories |
| POST | `/getCategoryPageDetails` | Public | Category page data |
| POST | `/createRating` | Student | Create review |
| PUT | `/updateReview` | Student | Edit review |
| DELETE | `/deleteReview` | Student | Delete review |
| GET | `/getReviews`, `/getAverageRating` | Public | Reviews |

### Profile (`/api/v1/profile`)
| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/getUserDetails` | Auth | User profile |
| PUT | `/updateProfile` | Auth | Update profile |
| PUT | `/updateDisplayPicture` | Auth | Update avatar (Cloudinary) |
| DELETE | `/deleteProfile` | Auth | Delete account |
| GET | `/getEnrolledCourses` | Auth | Enrolled courses |
| GET | `/getPurchaseHistory` | Auth | Purchase history |
| GET | `/instructorDashboard` | Instructor | Per-course stats |

### Admin (`/api/v1/admin`) — Admin only
`GET /stats`, `GET/PUT /instructors`, `GET/PUT /students`, `GET/POST/PUT/DELETE /categories`

### Wishlist (`/api/v1/wishlist`) — Auth
`POST /add`, `DELETE /remove`, `GET /getAll`

### Contact (`/api/v1/contact`)
`POST /createContact`

---

## Testing

Frontend (Jest — pure utility tests):

```bash
npm test -- --watchAll=false
```

Backend (Node's built-in test runner):

```bash
cd server
npm test
```

---

## Deployment

- **Frontend**: build with `npm run build`, then host the `build/` folder (Netlify, Vercel, S3/CloudFront, etc.)
- **Backend**: Node/Express on Render, Railway, or any Node host — set `CLIENT_URL` to your frontend domain and update CORS
- **Database**: MongoDB Atlas
- Set `REACT_APP_BASE_URL` at build time to the deployed API URL

---

## Roadmap / Future Improvements

- **HLS streaming** via Cloudinary for smoother lecture playback
- Catalog **pagination, sorting, and filters**
- Lecture **quizzes** with score tracking
- Notifications for enrollments and progress
