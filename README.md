# NFSU Centralized Complaint & Grievance Management Portal

A production-ready, full-stack web platform for National Forensic Sciences University (NFSU) to manage student complaints through a centralized, transparent, and role-based system.

## 🎯 Problem Statement

Students currently rely on informal platforms like WhatsApp groups to raise complaints, leading to:
- No structured complaint registration
- Difficulty identifying the right authority
- No tracking mechanism
- Delays, miscommunication, and unresolved issues

## 💡 Solution

A comprehensive web application that provides:
- **Structured complaint registration** with unique tracking IDs
- **Role-based dashboards** for Students, Departments, and Admins
- **Real-time tracking** from submission to resolution
- **Automated escalation** for unresolved complaints
- **Analytics and reporting** for system-wide insights

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2.0) with Vite
- **Tailwind CSS** for styling
- **React Router** (with v7 future flags)
- **Framer Motion** for premium animations
- **Three.js & Postprocessing** for WebGL backgrounds (Hyperspeed)
- **Axios** for API calls
- **Recharts** for analytics visualization
- **Lucide React** for icons

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (local with MongoDB Compass)
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Node-Cron** for auto-escalation

### Database
- **MongoDB** with Mongoose ODM
- Local MongoDB Compass connection (optimized for 127.0.0.1)

---

## ✨ Key Features & Recent Enhancements

### 🎨 Premium UI/UX
- **Hyperspeed Background**: Dynamic WebGL-based road animation for a high-tech feel.
- **Dark Glassmorphism**: Complete redesign of the Student Dashboard and Complaint Details with frosted glass effects and high-contrast typography.
- **Parallel Loading**: WebGL assets initialize concurrently with data fetching to eliminate wait times.
- **Zero-Flash Start**: Inline styles prevent white flashes during initial load for a seamless dark-theme experience.

### 🎓 Student Features
- Submit complaints with file attachments (up to 5MB)
- Track complaint status in real-time
- View detailed complaint history
- Anonymous complaint option
- Provide feedback after resolution
- Dashboard with complaint statistics

### 🏢 Department Features
- View complaints assigned to department
- Update complaint status (Pending → In Progress → Resolved)
- Add resolution remarks
- Department-specific analytics
- Priority-based filtering

### 🛡️ Admin Features
- System-wide analytics dashboard
- Visual charts (category distribution, status breakdown)
- User management (create department/student accounts)
- Complaint assignment and monitoring
- Escalation management
- Performance metrics tracking

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed locally
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/hariombhu/NFSU_complaint_portal
cd NFSU_complaint_portal
```

### Step 2: Install Dependencies

#### Install root dependencies
```bash
npm install
```

#### Install server dependencies
```bash
cd server
npm install
cd ..
```

#### Install client dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Set Up MongoDB

1. Start MongoDB service (Administrator/Sudo required):
   ```powershell
   # Windows (PowerShell Run as Admin)
   Start-Service MongoDB
   ```
2. Open MongoDB Compass and connect to: `mongodb://127.0.0.1:27017`

### Step 4: Configure Environment Variables

The `.env` file is located in `server/.env`:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nfsu_complaint_portal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=24h
MAX_FILE_SIZE=5242880
ESCALATION_DAYS=7
```

### Step 5: Run the Application

#### Run both servers concurrently (from root)
```bash
npm run dev
```

### Step 6: Access the Application

- **Frontend**: [http://localhost:5000](http://localhost:5000)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)

---

## 🔐 Sample Login Credentials

### Admin
- **Email**: `admin@nfsu.ac.in` | **Password**: `admin123`

### Department (Canteen)
- **Email**: `canteen@nfsu.ac.in` | **Password**: `canteen123`

### Student
- **Email**: `rahul.sharma@nfsu.ac.in` | **Password**: `student123` | **ID**: `NFSU2024001`

---

## 🎨 UI/UX Highlights

- **Hyperspeed Engine**: Optimized WebGL rendering for low-end devices.
- **Glass-Dark Theme**: Luxury aesthetic using `backdrop-blur-xl` and translucent overlays.
- **Smooth Transitions**: `AnimatePresence` for seamless page navigation.
- **Accessibility**: High-contrast text on dark backgrounds for readability.

---

## 🔒 Security Features

✅ Password hashing with bcrypt  
✅ JWT-based authentication  
✅ Role-based access control (RBAC)  
✅ File upload validation  
✅ Environment variable protection  

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current profile

### Complaints
- `GET /api/complaints` - List complaints (role-specific)
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints/:id` - view detailed status
- `PUT /api/complaints/:id/status` - Update status (Staff only)

---

## 👥 Contributors

Developed for NFSU by the Development Team

---

## 📄 License

MIT License

---

**Built with ❤️ for NFSU Community**
