const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

/**
 * Auto-escalation utility
 * Runs daily to check for complaints that need escalation
 */
const startAutoEscalation = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('🔍 Running auto-escalation check...');

            const escalationDays = parseInt(process.env.ESCALATION_DAYS) || 7;
            const escalationDate = new Date();
            escalationDate.setDate(escalationDate.getDate() - escalationDays);

            // Find complaints that need escalation
            const complaintsToEscalate = await Complaint.find({
                status: { $in: ['pending', 'in-progress'] },
                createdAt: { $lte: escalationDate },
                escalationDate: { $exists: false },
            });

            if (complaintsToEscalate.length === 0) {
                console.log('✅ No complaints to escalate');
                return;
            }

            // Escalate complaints
            for (const complaint of complaintsToEscalate) {
                complaint.status = 'escalated';
                complaint.escalationDate = new Date();

                complaint.statusHistory.push({
                    status: 'escalated',
                    remarks: `Auto-escalated after ${escalationDays} days without resolution`,
                });

                await complaint.save();

                // Create notification for student
                await Notification.create({
                    userId: complaint.studentId,
                    complaintId: complaint._id,
                    message: `Your complaint has been escalated due to delayed resolution`,
                    type: 'escalation',
                });

                console.log(`📢 Escalated complaint: ${complaint.complaintId}`);
            }

            console.log(
                `✅ Auto-escalation complete. Escalated ${complaintsToEscalate.length} complaints`
            );
        } catch (error) {
            console.error('❌ Auto-escalation error:', error.message);
        }
    });

    console.log('⏰ Auto-escalation scheduler started');
};

module.exports = { startAutoEscalation };
