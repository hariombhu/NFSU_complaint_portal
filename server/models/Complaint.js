const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                'Canteen',
                'Academic',
                'Maintenance',
                'Auditorium',
                'Administration',
                'Sports',
                'Others',
            ],
        },
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'resolved', 'escalated'],
            default: 'pending',
        },
        assignedDepartment: {
            type: String,
            enum: [
                'Canteen',
                'Academic',
                'Maintenance',
                'Auditorium',
                'Administration',
                'Sports',
                'Others',
            ],
        },
        attachments: [
            {
                filename: String,
                originalName: String,
                path: String,
                mimetype: String,
                size: Number,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        anonymous: {
            type: Boolean,
            default: false,
        },
        resolvedAt: {
            type: Date,
        },
        resolutionRemarks: {
            type: String,
            maxlength: [1000, 'Resolution remarks cannot exceed 1000 characters'],
        },
        feedback: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                maxlength: [500, 'Feedback comment cannot exceed 500 characters'],
            },
            submittedAt: Date,
        },
        escalationDate: {
            type: Date,
        },
        statusHistory: [
            {
                status: String,
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                remarks: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Auto-assign department based on category
complaintSchema.pre('save', function (next) {
    if (this.isNew && !this.assignedDepartment) {
        this.assignedDepartment = this.category;
    }
    next();
});

// Generate unique complaint ID
complaintSchema.pre('save', async function (next) {
    if (this.isNew && !this.complaintId) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Count today's complaints
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await this.constructor.countDocuments({
            createdAt: { $gte: today },
        });

        const sequence = String(count + 1).padStart(4, '0');
        this.complaintId = `NFSU${year}${month}${sequence}`;
    }
    next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
