const express = require('express');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            departments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  Private (Admin only)
 */
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const department = await Department.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            department,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private (Admin only)
 */
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            department,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
