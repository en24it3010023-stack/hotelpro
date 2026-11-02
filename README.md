# 🏨 HotelPro (Roomly) — Luxury Hotel Management System

> **A modern, full-stack, production-ready MERN Hospitality Management & Reservation Engine.**
> Built with MongoDB, Express.js, React.js (Vite), Node.js, and Tailwind CSS.

---

## 🌟 Executive Overview

**HotelPro (also referred to as Roomly)** is an enterprise-grade luxury hospitality management platform crafted for five-star hotels, boutique oceanfront resorts, royal heritage palaces, and luxury travelers. 

It provides an end-to-end operational suite spanning:
- **Public Sanctuary Portal**: Interactive landing page, hero booking widget, search with live filters, hotel & suite showcases, verified stay reviews, and special offers.
- **Reservation & Double-Booking Protection Engine**: Atomic inventory conflict prevention, dynamic pricing calculator (taxes, resort fees, promo codes), and instant booking confirmation.
- **Payment Abstraction Layer**: Seamless support for **Instant Demo Mode** (zero-card testing), **Stripe Sandbox**, and **Razorpay** with server-side signature verification and immutable transaction logging.
- **Four Dedicated Role Dashboards**:
  1. 🏖️ **Guest Dashboard**: Upcoming reservations, past stay records, printable tax invoices, cancellation & refund workflows, in-room service requests, and stay-verified reviews.
  2. 🛎️ **Staff Front Desk**: Daily arrivals & departures, 1-click guest check-in (assigns clean room & keycard), 1-click check-out (marks room dirty and triggers turnover), physical room status board, and housekeeping task management.
  3. 👔 **Hotel Manager Dashboard**: Assigned property profile, policies, seasonal base rates, suite category creation, physical room number allocation, and full reservation yield.
  4. 👑 **Administrator Command Center**: Platform-wide metrics, gross booking revenue charts, user directory & role management, hotel listing moderation, payment & refund ledger, and security audit logs.

---

## 🏗️ Architecture & Technology Stack

```
HOTELPRO (ROOMLY) ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│                    REACT 18 + VITE CLIENT                   │
│  Tailwind CSS • Lucide Icons • React Router 6 • Axios Client │
│       AuthContext (JWT + Roles) • Toast Notification System │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API Calls (/api/...)
┌──────────────────────────────▼──────────────────────────────┐
│                    EXPRESS.JS + NODE.JS                     │
│  Helmet • CORS • Rate Limiter • Cookie Parser • JWT Auth    │
│  Role Guards (Guest / Staff / Manager / Admin) • Multer     │
└──────────────────────────────┬──────────────────────────────┘
                               │  Mongoose ODM
┌──────────────────────────────▼──────────────────────────────┐
│                      MONGODB DATABASE                       │
│  Atlas URI OR Automatic Zero-Config Embedded Mongo Engine   │
│  14 Interrelated Schemas with Indexes & Cascade Safeguards  │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technologies & Libraries |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Date-fns, React Router 6, Axios |
| **Backend** | Node.js (v20+), Express.js, Helmet, CORS, Express-Rate-Limit, Cookie-Parser, Multer |
| **Authentication** | BCrypt.js (10 salt rounds), JWT Bearer Tokens, Role-Based Access Control (RBAC) |
| **Database** | MongoDB / Mongoose ODM (Dual mode: MongoDB Atlas / Local URI + Auto Embedded Fallback) |
| **Payments** | Payment Abstraction: Instant Demo Sandbox, Stripe API, Razorpay API |
| **Email Service** | Nodemailer with automatic development console fallback simulation |
| **Testing** | Vitest, Unit & Integration test suite |

---

## 📁 Repository Structure

```
hotelpro/
├── client/                              # Modern React + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                   # API Proxy (/api -> http://localhost:5001)
│   ├── tailwind.config.js               # Luxury gold & navy hospitality theme
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                     # App entry point with Context Providers
│       ├── App.jsx                      # App routes & role-guarded layouts
│       ├── index.css                    # Tailwind directives & glassmorphic styling
│       ├── api/
│       │   └── axiosClient.js           # Centralized Axios with Bearer JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx          # User state, JWT storage, demo logins
│       │   ├── ThemeContext.jsx         # Dark / Light theme toggle
│       │   └── ToastContext.jsx         # Global animated toast notifications
│       ├── components/
│       │   ├── common/                  # Navbar, Footer, StatusBadge, RatingStars,
│       │   │                            # ProtectedRoute, RoleGuard, Modal, Pagination,
│       │   │                            # NotificationBell, SkeletonLoader, ErrorBoundary
│       │   ├── hotel/                   # HotelCard, RoomCard, SearchBar, PriceFilter,
│       │   │                            # AmenitiesList, BookingForm
│       │   └── dashboard/               # DashboardLayout, DashboardSidebar, StatCard,
│       │                                # DashboardHeader, DataTable
│       └── pages/
│           ├── Home.jsx                 # Landing page (Hero, destinations, flagship hotels)
│           ├── ExploreHotels.jsx        # Search results with live filters & sorting
│           ├── HotelDetails.jsx         # Multi-photo gallery, suite cards, policies, reviews
│           ├── AboutUs.jsx              # Brand heritage & leadership story
│           ├── ContactUs.jsx            # 24/7 VIP Concierge contact & inquiry form
│           ├── Offers.jsx               # Curated voucher codes (SUMMER25, WELCOME10, etc.)
│           ├── PrivacyPolicy.jsx        # Data privacy & escrow safeguards
│           ├── TermsConditions.jsx      # Booking & stay policies
│           ├── auth/                    # Login (with 1-click Demo buttons), Register,
│           │                            # ForgotPassword, ResetPassword
│           ├── guest/                   # GuestDashboard, MyBookings, BookingDetails (Invoice),
│           │                            # SavedHotels, GuestProfile, GuestServiceRequests
│           ├── staff/                   # StaffDashboard, CheckInOutDesk, RoomStatusManager,
│           │                            # HousekeepingTasks
│           ├── manager/                 # ManagerDashboard, ManageHotels, ManageRooms,
│           │                            # ManagerBookings
│           └── admin/                   # AdminDashboard (Charts), UserManagement,
│                                        # HotelApprovals, PaymentMonitoring, AuditLogs
│
├── server/                              # Node.js + Express REST API Backend
│   ├── package.json
│   ├── server.js                        # App setup, security middleware, auto-seed boot
│   ├── .env.example                     # Sample environment configuration
│   ├── config/
│   │   ├── db.js                        # Dual-mode Mongoose connection manager
│   │   └── payment.js                   # Razorpay & Stripe gateway initialization
│   ├── models/                          # 14 Mongoose Schemas:
│   │   ├── User.js                      # User model with role RBAC & bcrypt hashing
│   │   ├── Hotel.js                     # Hotel properties with amenities & star ratings
│   │   ├── RoomCategory.js              # Suite categories (Deluxe, Presidential, Villa)
│   │   ├── Room.js                      # Physical rooms with occupancy & housekeeping state
│   │   ├── Booking.js                   # Reservations with double-booking prevention index
│   │   ├── Payment.js                   # Payment transaction ledger
│   │   ├── Review.js                    # Verified stay guest reviews & manager responses
│   │   ├── Service.js                   # Catalog of hotel services
│   │   ├── ServiceRequest.js            # In-room dining, housekeeping & concierge requests
│   │   ├── Notification.js              # In-app notifications
│   │   ├── CheckInOut.js                # Official check-in and check-out logs
│   │   ├── StaffAssignment.js           # Housekeeping and maintenance tasks
│   │   ├── RefundRequest.js             # Guest refund claims
│   │   ├── Invoice.js                   # Official printable tax invoice statements
│   │   └── AdminLog.js                  # Electronic audit trail logs
│   ├── middleware/                      # Auth protect, role authorize, upload, error handler
│   ├── controllers/                     # REST controllers for every resource
│   ├── routes/                          # REST route modules
│   ├── services/                        # Email (Nodemailer), Payment, Invoice generators
│   ├── utils/                           # dateUtils, priceCalculator, logger
│   ├── seed/                            # seedData.js (5 luxury hotels, rooms, demo users)
│   └── tests/                           # Vitest backend tests
│
├── package.json                         # Root package scripts (dev, test, seed, build)
└── README.md                            # Comprehensive documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- *(Optional)* A running MongoDB Atlas URI or local MongoDB instance. If omitted, the server **automatically starts its embedded MongoDB engine (`mongodb-memory-server`)**, guaranteeing 100% out-of-the-box operation without requiring any external database setup!

### 1. Clone or Open the Workspace
```bash
cd /Users/ayushsingh/.gemini/antigravity/scratch/hotelpro
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies in one go
npm run install:all
```

### 3. Run Automated Unit Tests
```bash
npm test
```
*Executes the Vitest suite testing date calculations, price computations (taxes, fees, promo discounts), and cancellation refund rules.*

### 4. Seed the Database
```bash
npm run seed
```
*Populates 5 luxury flagship hotels (Miami Beach, Jaipur, New York, Bora Bora, Zermatt), room tiers, physical rooms with keycards, verified reviews, and demo accounts.*

### 5. Launch Development Servers
You can run the backend and frontend in separate terminals:

**Terminal 1 (Backend API Server):**
```bash
npm run server
# Starts backend at http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Starts Vite frontend at http://localhost:5173
```

---

## 🔑 Demo Accounts for Evaluation

For rapid demonstration, click the **1-Click Quick Demo** buttons on the Login page (`/login`) or use the following pre-seeded credentials:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| 👑 **Administrator** | `admin@hotelpro.com` | `Admin@123` | Executive command center, revenue analytics, user directory, hotel moderation, refund approvals, and audit trail. |
| 👔 **Hotel Manager** | `manager@hotelpro.com` | `Manager@123` | Assigned property profile, suite categories, physical room numbers, base rates, and property reservations. |
| 🛎️ **Front Desk Staff** | `staff@hotelpro.com` | `Staff@123` | Today's arrivals/departures, 1-click guest check-in (keycard issue), 1-click check-out, room status matrix, and housekeeping turnaround. |
| 🏖️ **Guest Traveler** | `guest@hotelpro.com` | `Guest@123` | Reservation search, booking checkout with voucher codes, printable tax invoices, service requests, and stay-verified reviews. |
| 🎒 **Guest 2 (Traveler)** | `traveler@hotelpro.com` | `Guest@123` | Currently checked-in guest at The Grand Azure with active room keycard. |

---

## 💳 Payment Gateway Configuration

The payment engine uses a unified abstraction supporting three modes configured via `PAYMENT_MODE` in `server/.env`:

1. **`PAYMENT_MODE=demo` (Default)**:
   - Safe sandbox testing without entering real credit cards.
   - Generates verified transaction IDs and authentic receipts.
   - Never stores sensitive credentials.
2. **`PAYMENT_MODE=stripe`**:
   - Set `STRIPE_SECRET_KEY=sk_test_...` in `server/.env`.
   - Uses Stripe PaymentIntents with server-side confirmation.
3. **`PAYMENT_MODE=razorpay`**:
   - Set `RAZORPAY_KEY_ID=rzp_test_...` and `RAZORPAY_KEY_SECRET=...` in `server/.env`.
   - Generates orders in smallest currency unit and performs server-side HMAC-SHA256 signature verification.

### Active Promotional Codes
- **`WELCOME10`**: 10% Welcome Discount for new members.
- **`SUMMER25`**: 25% Coastal Escape Special for oceanfront suites.
- **`WEEKEND15`**: 15% Extended Weekend Romance Retreat.
- **`HONEYMOON`**: 20% Luxury Honeymoon Suite Package.

---

## 🛡️ Security & Reliability Implementations

- **Double-Booking Prevention**: Room inventory availability is validated against date overlaps using `$or: [{checkInDate: {$lt: end}, checkOutDate: {$gt: start}}]` with atomic reservation checks before confirmation.
- **Role-Based Authorization**: Protected routes on both frontend (`ProtectedRoute`, `RoleGuard`) and backend (`protect`, `authorize('role')`) prevent horizontal and vertical privilege escalation.
- **Stay-Verified Reviews**: Guests can only submit reviews if they possess a matching non-cancelled booking in the database; compound unique indexes prevent duplicate reviews for the same stay.
- **HTTP Security**: Centralized CORS whitelist, Helmet security headers, rate limiting (300 req/15min), and HTTP-only cookies.
- **Zero Card Data Retention**: Compliant with PCI standards — sensitive CVVs and card numbers are never stored in the database.

---

## 🎓 College Project / Portfolio Defense Guide

When demonstrating this project in an evaluation or presentation:

1. **Guest Workflow**:
   - Open `http://localhost:5173`.
   - Highlight the landing page aesthetic, search widget, and popular destinations.
   - Click "Explore Hotels", filter by city or price range, and open a hotel (e.g. *The Grand Azure Resort*).
   - Show transparent pricing, enter promo code `WELCOME10` (instant 10% deduction), choose "Instant Demo Pay", and submit booking.
   - Open the Guest Dashboard to view the confirmed reservation and click "Print / Download Invoice" to showcase the printable tax statement.
2. **Staff Workflow**:
   - Log in as `staff@hotelpro.com` via the 1-click demo button.
   - Navigate to the **Check-In Desk**: select the guest's booking, allocate a clean physical room, issue an electronic keycard code, and click "Check In".
   - Open the **Room Status Board** to demonstrate live occupancy and toggle room cleaning status from *Dirty* to *Clean*.
3. **Manager Workflow**:
   - Log in as `manager@hotelpro.com`.
   - Demonstrate the room categories manager and add a new physical room number.
4. **Admin Workflow**:
   - Log in as `admin@hotelpro.com`.
   - Showcase the 6-month gross booking revenue chart, user role editor, and immutable electronic audit trail.

---

## 📄 License
This project is released under the **MIT License**. Created with excellence for the hospitality community.
