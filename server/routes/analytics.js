const express = require('express');
const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Get analytics dashboard data
 * @route   GET /api/analytics/dashboard
 * @access  Private (Admin only)
 */
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    try {
        // Total complaints by status
        const statusStats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Total complaints by category/department
        const categoryStats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
                    },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Complaints by priority
        const priorityStats = await Complaint.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Recent complaints
        const recentComplaints = await Complaint.find()
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('complaintId title status category priority createdAt');

        // Complaints over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const complaintsOverTime = await Complaint.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Total counts
        const totalComplaints = await Complaint.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalDepartments = await Department.countDocuments();

        // Average resolution time (in hours)
        const resolvedComplaints = await Complaint.find({
            status: 'resolved',
            resolvedAt: { $exists: true },
        }).select('createdAt resolvedAt');

        let avgResolutionTime = 0;
        if (resolvedComplaints.length > 0) {
            const totalTime = resolvedComplaints.reduce((sum, complaint) => {
                const diff = complaint.resolvedAt - complaint.createdAt;
                return sum + diff;
            }, 0);
            avgResolutionTime = totalTime / resolvedComplaints.length / (1000 * 60 * 60); // Convert to hours
        }

        res.status(200).json({
            success: true,
            analytics: {
                overview: {
                    totalComplaints,
                    totalStudents,
                    totalDepartments,
                    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
                },
                statusStats,
                categoryStats,
                priorityStats,
                recentComplaints,
                complaintsOverTime,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @desc    Get department-specific analytics
 * @route   GET /api/analytics/department/:department
 * @access  Private (Department/Admin)
 */
router.get(
    '/department/:department',
    protect,
    authorize('department', 'admin'),
    async (req, res) => {
        try {
            const { department } = req.params;

            // Verify department user can only access their own data
            if (req.user.role === 'department' && req.user.department !== department) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this department',
                });
            }

            const stats = await Complaint.aggregate([
                { $match: { assignedDepartment: department } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);

            const recentComplaints = await Complaint.find({
                assignedDepartment: department,
            })
                .populate('studentId', 'name email')
                .sort({ createdAt: -1 })
                .limit(10);

            res.status(200).json({
                success: true,
                department,
                stats,
                recentComplaints,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

module.exports = router;
