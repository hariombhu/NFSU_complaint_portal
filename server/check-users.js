const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Connecting to MongoDB...\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const checkUsers = async () => {
    try {
        console.log('🔍 Checking database users...\n');

        const users = await User.find({});

        console.log(`Total users in database: ${users.length}\n`);

        if (users.length === 0) {
            console.log('❌ NO USERS FOUND!');
            console.log('   The database is empty.');
            console.log('   Run: node seeders/seed.js\n');
        } else {
            console.log('📋 Users in database:\n');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                if (user.role === 'student') {
                    console.log(`   Student ID: ${user.studentId}`);
                }
                if (user.role === 'department') {
                    console.log(`   Department: ${user.department}`);
                }
                console.log('');
            });

            // Find admin specifically
            const admin = await User.findOne({ email: 'admin@nfsu.ac.in' });
            console.log('═══════════════════════════════════════');
            if (admin) {
                console.log('✅ ADMIN USER EXISTS!');
                console.log('   Email: admin@nfsu.ac.in');
                console.log('   Name: ' + admin.name);
                console.log('   Role: ' + admin.role);
            } else {
                console.log('❌ ADMIN USER NOT FOUND!');
                console.log('   Run: node seeders/seed.js');
            }
            console.log('═══════════════════════════════════════');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkUsers();
