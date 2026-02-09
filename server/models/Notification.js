const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                'status_update',
                'new_complaint',
                'escalation',
                'feedback_request',
                'assignment',
            ],
            default: 'status_update',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
