<div align="center">
  <img src="./public/images/hotel-property/logo.png" alt="InnFlow Logo" width="120" />
  <h1>InnFlow (Cozy Inn)</h1>
  <p><strong>A Premium Boutique Hotel Management & Booking Platform</strong></p>

  <p>
    <a href="https://github.com/keshavsharma05/innflow"><img src="https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github" alt="GitHub Repository" /></a>
    <a href="https://thecozyinn.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-000000?style=flat-square&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Express-5.0-lightgrey?style=flat-square&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
  </p>
</div>

<br />

## 📖 Overview

**InnFlow** is a modern, full-stack SaaS solution built specifically for boutique hotels and luxury accommodations. Designed with a meticulous focus on UI/UX, it delivers a stunning guest experience alongside a powerful, secure administration dashboard for property owners.

It seamlessly blends high-performance web animations (GSAP, Lenis) with robust backend architecture (Node.js, Express, MongoDB) to handle real-time inventory, secure JWT authentication, dynamic cart management, and cutting-edge QR code contactless check-ins.

---

## ✨ Key Features

### Guest Experience
* **Cinematic Interface:** Smooth scroll physics via `Lenis` and micro-interactions powered by `GSAP` create a highly tactile, premium feel.
* **Real-time Availability:** Smart date-range querying to prevent overbooking and double-booking.
* **Dynamic Cart System:** Users can combine multiple room categories into a single reservation seamlessly.
* **Guest Dashboard:** A comprehensive profile panel for tracking active reservations, viewing past stays, and downloading contactless entry passes.
* **Contactless QR Check-in:** Automated QR code generation for secure, frictionless arrivals.

### Administration & Operations
* **Secure Admin Portal:** Role-based access control with JWT middleware protecting sensitive operational routes.
* **Inventory Management:** Full CRUD capabilities for room categories, pricing, and dynamic metadata.
* **Reservation Lifecycle:** Real-time booking manipulation (Confirm, Check-In, Check-Out, Cancel).
* **QR Scanner Kiosk:** Built-in hardware-agnostic QR scanning using `html5-qrcode` to instantly verify guest arrivals directly from a tablet or webcam.
* **Automated Cron Jobs:** Background tasks via `node-cron` handle automatic state transitions (e.g., auto-canceling expired holds or archiving completed stays).

---

## 🏗 Architecture & Tech Stack

InnFlow is built on the **MERN** stack, decoupled into a distinct API backend and a Vite-powered React frontend.

### Frontend (Client)
* **Framework:** React 19 + Vite
* **Routing:** React Router v7
* **State Management:** React Context API (`AuthContext`, `HotelContext`)
* **Styling:** Modular Vanilla CSS tailored for custom design tokens and fluid typography.
* **Animation:** GSAP (GreenSock) & Lenis (Smooth Scroll)
* **Utilities:** `react-icons`, `html5-qrcode`

### Backend (API)
* **Environment:** Node.js + Express 5
* **Database:** MongoDB Atlas + Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcrypt (password hashing)
* **Task Scheduling:** `node-cron`
* **Security & Utils:** CORS, Dotenv, `qrcode`

---

## 📂 Project Structure

```text
innflow/
├── public/                 # Static assets, branding, and images
├── server/                 # Backend Node.js Environment
│   ├── config/             # DB connection logic
│   ├── controllers/        # Request handlers (auth, booking, rooms)
│   ├── models/             # Mongoose schemas (User, Room, Booking)
│   ├── routes/             # Express API routers
│   ├── cronJobs.js         # Automated background tasks
│   ├── index.js            # Entry point & Express configuration
│   └── seed.js             # Initial database seeding script
└── src/                    # Frontend React Environment
    ├── app/                # Main Application Logic
    │   ├── admin/          # Admin dashboard & QR Scanner
    │   ├── components/     # Reusable UI components (RoomCard, LoadingSpinner)
    │   └── pages/          # Primary views (Booking, Profile, Success)
    ├── data/               # Static configuration & initial state
    ├── marketing/          # Public-facing landing pages
    ├── services/           # API integration, Context Providers
    └── styles/             # Global CSS and design tokens
```

---

## 🔌 API Overview

The backend exposes a RESTful JSON API. All protected routes require a valid `Bearer <Token>` header.

### Authentication
* `POST /api/auth/verify-otp` - Authenticates guests via Phone/OTP.
* `POST /api/auth/admin-login` - Authenticates administrators.
* `GET /api/auth/me` - Validates session and returns profile data.

### Rooms & Inventory
* `GET /api/rooms/:hotelId` - Retrieves all configured room types.
* `GET /api/bookings/availability/:hotelId` - Queries room availability based on `checkIn` and `checkOut` queries.

### Bookings
* `POST /api/bookings` - Creates a new reservation (decrements availability).
* `GET /api/bookings?phone=123` - Retrieves reservations for a specific user.
* `PATCH /api/bookings/:id` - Updates booking status (Admin only).
* `POST /api/bookings/scan-qr` - Verifies a QR string and checks in a guest.

---

## ⚙️ Local Development

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/keshavsharma05/innflow.git
cd innflow
```

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USER=admin
ADMIN_PASS=123
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 4. Seed the Database
Populate the database with initial room configurations:
```bash
cd server
npm run seed
```

### 5. Run the Application
Start both the backend server and the frontend Vite development server.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🔒 Security & Deployment

* **CORS Protection:** Configured to accept requests strictly from designated frontend origins.
* **Payload Limits:** Express JSON payload is capped at `10kb` to prevent DoS attacks.
* **Stateless Auth:** Completely relies on JWTs; no server-side sessions to manage, allowing for easy horizontal scaling.
* **Error Handling:** Custom middleware catches and strips sensitive stack traces before responding to the client.

**Deployment Strategy:**
* **Frontend:** Deployed to Vercel (or similar CDN) utilizing Vite's optimized build output.
* **Backend:** Deployed to Render (or Heroku) running the Node.js Express server.
* **Database:** Hosted on MongoDB Atlas.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
