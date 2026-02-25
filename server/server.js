const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { startAutoEscalation } = require('./utils/autoEscalation');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (absolute path — works regardless of cwd)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NFSU Complaint Portal API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to NFSU Complaint & Grievance Management Portal API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            complaints: '/api/complaints',
            notifications: '/api/notifications',
            departments: '/api/departments',
            analytics: '/api/analytics',
            users: '/api/users',
        },
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start auto-escalation scheduler
startAutoEscalation();

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════════════════════');
    console.log(`🎓 NFSU Complaint Portal Server`);
    console.log(`📡 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log('🚀 ═══════════════════════════════════════════════════════════');
    console.log('');
});

// Handle port already in use — prevents nodemon crash loop
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.`);
        console.error(`   Run: netstat -ano | findstr :${PORT} → then taskkill /PID <pid> /F\n`);
        process.exit(1);
    } else {
        throw err;
    }
});

// Graceful shutdown — frees port so next restart doesn't conflict
const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received — shutting down gracefully...`);
    server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
    });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

