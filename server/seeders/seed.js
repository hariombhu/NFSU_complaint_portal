const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const Complaint = require('../models/Complaint');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const departments = [
    {
        name: 'Canteen',
        description: 'Handles canteen-related complaints and food service issues',
        email: 'canteen@nfsu.ac.in',
    },
    {
        name: 'Academic',
        description: 'Manages academic-related complaints and course issues',
        email: 'academic@nfsu.ac.in',
    },
    {
        name: 'Maintenance',
        description: 'Handles infrastructure and maintenance complaints',
        email: 'maintenance@nfsu.ac.in',
    },
    {
        name: 'Auditorium',
        description: 'Manages auditorium facilities and event-related issues',
        email: 'auditorium@nfsu.ac.in',
    },
    {
        name: 'Administration',
        description: 'Handles administrative and general complaints',
        email: 'admin@nfsu.ac.in',
    },
    {
        name: 'Sports',
        description: 'Manages sports facilities and equipment complaints',
        email: 'sports@nfsu.ac.in',
    },
    {
        name: 'Others',
        description: 'Handles miscellaneous complaints',
        email: 'others@nfsu.ac.in',
    },
];

const users = [
    // Admin
    {
        name: 'Admin User',
        email: 'admin@nfsu.ac.in',
        password: 'admin123',
        role: 'admin',
    },
    // Department users
    {
        name: 'Canteen Manager',
        email: 'canteen@nfsu.ac.in',
        password: 'canteen123',
        role: 'department',
        department: 'Canteen',
    },
    {
        name: 'Academic Head',
        email: 'academic@nfsu.ac.in',
        password: 'academic123',
        role: 'department',
        department: 'Academic',
    },
    {
        name: 'Maintenance Head',
        email: 'maintenance@nfsu.ac.in',
        password: 'maintenance123',
        role: 'department',
        department: 'Maintenance',
    },
    {
        name: 'Auditorium Manager',
        email: 'auditorium@nfsu.ac.in',
        password: 'auditorium123',
        role: 'department',
        department: 'Auditorium',
    },
    {
        name: 'Administration Head',
        email: 'administration@nfsu.ac.in',
        password: 'admin-dept123',
        role: 'department',
        department: 'Administration',
    },
    {
        name: 'Sports Coordinator',
        email: 'sports@nfsu.ac.in',
        password: 'sports123',
        role: 'department',
        department: 'Sports',
    },
    // Sample students
    {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@nfsu.ac.in',
        password: 'student123',
        role: 'student',
        studentId: 'NFSU2024001',
    },
    {
        name: 'Priya Patel',
        email: 'priya.patel@nfsu.ac.in',
        password: 'student123',
        role: 'student',
        studentId: 'NFSU2024002',
    },
    {
        name: 'Amit Kumar',
        email: 'amit.kumar@nfsu.ac.in',
        password: 'student123',
        role: 'student',
        studentId: 'NFSU2024003',
    },
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Complaint.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Insert departments
        await Department.insertMany(departments);
        console.log('✅ Departments created');

        // Insert users ONE BY ONE to trigger password hashing
        console.log('👥 Creating users...');
        for (const userData of users) {
            const user = new User(userData);
            await user.save(); // This triggers the pre-save hook to hash password
            console.log(`   ✅ Created: ${user.email}`);
        }
        console.log('✅ All users created');

        console.log('');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🎉 Database seeded successfully!');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        console.log('📝 Sample Login Credentials:');
        console.log('');
        console.log('👨‍💼 ADMIN:');
        console.log('   Email: admin@nfsu.ac.in');
        console.log('   Password: admin123');
        console.log('');
        console.log('🏢 DEPARTMENT (Canteen):');
        console.log('   Email: canteen@nfsu.ac.in');
        console.log('   Password: canteen123');
        console.log('');
        console.log('🏢 DEPARTMENT (Academic):');
        console.log('   Email: academic@nfsu.ac.in');
        console.log('   Password: academic123');
        console.log('');
        console.log('🎓 STUDENT:');
        console.log('   Email: rahul.sharma@nfsu.ac.in');
        console.log('   Password: student123');
        console.log('   Student ID: NFSU2024001');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
