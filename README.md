# QuickCourt – Local Sports Facility Booking Platform

QuickCourt is a modern full-stack local sports facility booking platform. It enables sports enthusiasts to discover local sports venues, view courts, select available hourly time slots, simulate payments, and manage reservations seamlessly. It also provides dedicated management portals for Facility Owners and Platform Administrators.

---

## 🚀 Key Features

### 👤 1. User Features
- **Hero & Discovery Landing Page:** Modern sports-tech design highlighting categories (Badminton, Football, Cricket, Tennis, Basketball, Table Tennis) and popular venues.
- **Authentication & Demo OTP:** Email/Password registration with simulated 6-digit OTP verification code shown on screen during development mode.
- **Venue Search & Filters:** Real-time search by venue name, location (e.g. Bodakdev, Satellite, Sindhu Bhavan Road), sport category, price range, minimum rating, and sorting options.
- **Court & Slot Selection:** Dynamic hourly slot generation based on operating hours. Prevents double-booking and visually disables booked/blocked slots.
- **Simulated Payment:** Checkout flow supporting UPI, Card, and Cash simulation with instant confirmation.
- **My Bookings & Cancellations:** Track booking statuses (`Confirmed`, `Cancelled`, `Completed`), cancel future bookings with automatic slot release, and submit facility reviews.

### 🏢 2. Facility Owner Features
- **Analytics Dashboard:** Real-time statistics (total bookings, active courts, total facilities, simulated earnings) and visual charts.
- **Facility Management:** Submit new venues (starts in `Pending` state for admin review), edit facility details, or remove facilities. View admin rejection notes if rejected.
- **Court Management:** Add, edit, activate/deactivate courts, and set hourly rates and operating hours.
- **Block Time Slots:** Block court slots for maintenance or private events to prevent user bookings.
- **Bookings Management:** View all user reservations across owned facilities with court and status filters.

### 🛡️ 3. Admin Features
- **Platform Oversight Dashboard:** Total users, facility owners, pending approvals count, active courts, total platform earnings, and registration trends.
- **Facility Approval Queue:** Review pending venue submissions with images and details. Approve to publish or reject with custom feedback.
- **User Management & Moderation:** Search registered users, filter by role or status, and ban/unban user accounts. Banned users are restricted from accessing the application.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, JavaScript (ES6+), React Router v6, Bootstrap 5, Bootstrap Icons, Axios, Custom CSS (Dark Navy `#0b132b` & Emerald `#10b981` theme).
- **Backend:** Python, Flask, Flask-CORS, Werkzeug (Password Hashing).
- **Database:** SQLite3 (`backend/instance/quickcourt.db`).

---

## 📁 Project Structure

```text
QuickCourt/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── VenueCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── FilterPanel.jsx
│       │   ├── SportCard.jsx
│       │   ├── BookingCard.jsx
│       │   ├── CourtCard.jsx
│       │   ├── TimeSlotGrid.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── LoadingSpinner.jsx
│       │   └── ToastMessage.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── OTPVerification.jsx
│       │   ├── Venues.jsx
│       │   ├── VenueDetails.jsx
│       │   ├── Booking.jsx
│       │   ├── Payment.jsx
│       │   ├── BookingSuccess.jsx
│       │   ├── MyBookings.jsx
│       │   ├── Profile.jsx
│       │   ├── OwnerDashboard.jsx
│       │   ├── OwnerFacilities.jsx
│       │   ├── AddFacility.jsx
│       │   ├── EditFacility.jsx
│       │   ├── OwnerCourts.jsx
│       │   ├── AddCourt.jsx
│       │   ├── OwnerBookings.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminFacilities.jsx
│       │   └── AdminUsers.jsx
│       ├── services/
│       │   └── api.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── config.py
│   ├── seed.py
│   ├── requirements.txt
│   └── instance/
│       └── quickcourt.db
│
├── README.md
└── .gitignore
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@quickcourt.com` | `Admin@123` | Platform oversight, facility approvals, user ban/unban |
| **Facility Owner** | `owner@quickcourt.com` | `Owner@123` | Manage venues, courts, block slots, view owner earnings |
| **User** | `user@quickcourt.com` | `User@123` | Search venues, book slots, simulated payment, write reviews |

*Note: The login page includes 1-click preset buttons to quickly populate these demo credentials.*

---

## ⚙️ Setup and Run Instructions

### 1. Backend Setup (Flask + SQLite)

Navigating to the `backend/` directory:

```bash
cd backend
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Initialize & seed demo data into SQLite database:

```bash
python seed.py
```

Start the Flask API server:

```bash
python app.py
```

*The Flask server runs at `http://127.0.0.1:5000`.*

---

### 2. Frontend Setup (React + Vite)

In a separate terminal, navigate to the `frontend/` directory:

```bash
cd frontend
```

Install npm dependencies:

```bash
npm install
```

Start Vite development server:

```bash
npm run dev
```

*Open your browser at `http://localhost:5173`.*

---

## 🔗 Backend REST API Endpoints Overview

- **Auth:**
  - `POST /api/auth/signup` - Register user & return demo OTP
  - `POST /api/auth/verify-otp` - Verify 6-digit OTP code
  - `POST /api/auth/login` - Authenticate & start session
  - `POST /api/auth/logout` - Clear session
  - `GET /api/auth/me` - Get current user profile
- **Venues & Courts:**
  - `GET /api/venues` - List approved venues with search & filter params
  - `GET /api/venues/<id>` - Venue details with courts and reviews
  - `GET /api/courts/<facility_id>` - Courts for facility
  - `GET /api/slots/<court_id>?date=YYYY-MM-DD` - Operating time slots & availability status
- **Bookings & Payments:**
  - `POST /api/bookings` - Create slot booking
  - `GET /api/bookings` - User's booking history
  - `PUT /api/bookings/<id>/cancel` - Cancel booking & release slot
  - `POST /api/reviews` - Submit review for completed booking
- **Owner Portal:**
  - `GET /api/owner/dashboard` - Owner metrics & analytics
  - `GET / POST / PUT / DELETE /api/owner/facilities` - Manage facilities
  - `GET / POST / PUT / DELETE /api/owner/courts` - Manage courts
  - `POST /api/owner/block-slot` - Block slot for maintenance
  - `GET /api/owner/bookings` - View facility reservations
- **Admin Portal:**
  - `GET /api/admin/dashboard` - System analytics
  - `GET /api/admin/facilities/pending` - Pending facility queue
  - `PUT /api/admin/facilities/<id>/approve` - Approve venue
  - `PUT /api/admin/facilities/<id>/reject` - Reject venue with note
  - `GET /api/admin/users` - List users
  - `PUT /api/admin/users/<id>/ban` - Ban user
  - `PUT /api/admin/users/<id>/unban` - Unban user