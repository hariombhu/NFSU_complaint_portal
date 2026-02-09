const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a department name'],
            unique: true,
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
        description: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        statistics: {
            totalComplaints: {
                type: Number,
                default: 0,
            },
            resolvedComplaints: {
                type: Number,
                default: 0,
            },
            pendingComplaints: {
                type: Number,
                default: 0,
            },
            avgResolutionTime: {
                type: Number,
                default: 0, // in hours
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Department', departmentSchema);
