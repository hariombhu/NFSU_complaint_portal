const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// Ensure uploads directory exists (absolute path)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
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
    // Check by extension only — mimetype strings like "image/jpeg" cause false negatives
    const allowedExt = /\.(jpeg|jpg|png|gif|webp|pdf|doc|docx)$/i;
    if (allowedExt.test(path.extname(file.originalname))) {
        return cb(null, true);
    }
    cb(new Error('Only images (JPG, PNG) and documents (PDF, DOC, DOCX) are allowed'));
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
