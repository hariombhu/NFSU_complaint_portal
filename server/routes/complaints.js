const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaintStatus,
    submitFeedback,
    getComplaintStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and documents are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
    },
    fileFilter: fileFilter,
});

// Routes
router
    .route('/')
    .get(protect, getComplaints)
    .post(protect, authorize('student'), upload.array('attachments', 5), createComplaint);

router.get('/stats/dashboard', protect, getComplaintStats);

router.route('/:id')
    .get(protect, getComplaint);

router.put(
    '/:id/status',
    protect,
    authorize('department', 'admin'),
    updateComplaintStatus
);

router.put(
    '/:id/feedback',
    protect,
    authorize('student'),
    submitFeedback
);

module.exports = router;
