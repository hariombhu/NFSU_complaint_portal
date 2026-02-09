const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Department = require('../models/Department');

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private (Student)
 */
exports.createComplaint = async (req, res) => {
    try {
        const { category, title, description, priority, anonymous } = req.body;

        // Create complaint data
        const complaintData = {
            studentId: req.user._id,
            category,
            title,
            description,
            priority: priority || 'medium',
            anonymous: anonymous || false,
            assignedDepartment: category, // Auto-assign to matching department
        };

        // Handle file attachments if present
        if (req.files && req.files.length > 0) {
            complaintData.attachments = req.files.map((file) => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
            }));
        }

        const complaint = await Complaint.create(complaintData);

        // Update department statistics
        await Department.findOneAndUpdate(
            { name: category },
            {
                $inc: {
                    'statistics.totalComplaints': 1,
                    'statistics.pendingComplaints': 1,
                },
            }
        );

        // Create notification for department users
        const departmentUsers = await User.find({
            role: 'department',
            department: category,
        });

        const notifications = departmentUsers.map((user) => ({
            userId: user._id,
            complaintId: complaint._id,
            message: `New complaint: ${title}`,
            type: 'new_complaint',
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get all complaints (with filters)
 * @route   GET /api/complaints
 * @access  Private
 */
exports.getComplaints = async (req, res) => {
    try {
        const { status, category, priority, search } = req.query;
        let query = {};

        // Filter by role
        if (req.user.role === 'student') {
            query.studentId = req.user._id;
        } else if (req.user.role === 'department') {
            query.assignedDepartment = req.user.department;
        }
        // Admin can see all complaints

        // Apply filters
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { complaintId: { $regex: search, $options: 'i' } },
            ];
        }

        const complaints = await Complaint.find(query)
            .populate('studentId', 'name email studentId')
            .sort({ createdAt: -1 })
            .lean();

        // Hide student info for anonymous complaints
        complaints.forEach((complaint) => {
            if (complaint.anonymous && req.user.role !== 'admin') {
                complaint.studentId = {
                    name: 'Anonymous',
                    email: '***',
                    studentId: '***',
                };
            }
        });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('studentId', 'name email studentId')
            .populate('statusHistory.changedBy', 'name role');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Check authorization
        if (
            req.user.role === 'student' &&
            complaint.studentId._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint',
            });
        }

        if (
            req.user.role === 'department' &&
            complaint.assignedDepartment !== req.user.department
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint',
            });
        }

        // Hide student info for anonymous complaints
        if (complaint.anonymous && req.user.role !== 'admin') {
            complaint.studentId = {
                name: 'Anonymous',
                email: '***',
                studentId: '***',
            };
        }

        res.status(200).json({
            success: true,
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Update complaint status
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Department/Admin)
 */
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status, resolutionRemarks } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Check authorization for department users
        if (
            req.user.role === 'department' &&
            complaint.assignedDepartment !== req.user.department
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this complaint',
            });
        }

        const oldStatus = complaint.status;
        complaint.status = status;

        if (resolutionRemarks) {
            complaint.resolutionRemarks = resolutionRemarks;
        }

        if (status === 'resolved') {
            complaint.resolvedAt = new Date();

            // Update department statistics
            await Department.findOneAndUpdate(
                { name: complaint.assignedDepartment },
                {
                    $inc: {
                        'statistics.resolvedComplaints': 1,
                        'statistics.pendingComplaints': -1,
                    },
                }
            );
        }

        // Add to status history
        complaint.statusHistory.push({
            status,
            changedBy: req.user._id,
            remarks: resolutionRemarks,
        });

        await complaint.save();

        // Create notification for student
        await Notification.create({
            userId: complaint.studentId,
            complaintId: complaint._id,
            message: `Your complaint status updated: ${oldStatus} → ${status}`,
            type: 'status_update',
        });

        res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Submit feedback for resolved complaint
 * @route   PUT /api/complaints/:id/feedback
 * @access  Private (Student - own complaints)
 */
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Verify it's the student's own complaint
        if (complaint.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to provide feedback for this complaint',
            });
        }

        // Only allow feedback for resolved complaints
        if (complaint.status !== 'resolved') {
            return res.status(400).json({
                success: false,
                message: 'Can only provide feedback for resolved complaints',
            });
        }

        complaint.feedback = {
            rating,
            comment,
            submittedAt: new Date(),
        };

        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * @desc    Get complaint statistics
 * @route   GET /api/complaints/stats/dashboard
 * @access  Private
 */
exports.getComplaintStats = async (req, res) => {
    try {
        let matchQuery = {};

        // Filter by role
        if (req.user.role === 'student') {
            matchQuery.studentId = req.user._id;
        } else if (req.user.role === 'department') {
            matchQuery.assignedDepartment = req.user.department;
        }

        const stats = await Complaint.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
                    },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
                    },
                    escalated: {
                        $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] },
                    },
                },
            },
        ]);

        const categoryStats = await Complaint.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                escalated: 0,
            },
            categoryStats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
