const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const initializeDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@farm.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            // Create default admin user
            await User.create({
                name: 'Admin',
                email: 'admin@farm.com',
                password: 'admin123',
                role: 'admin',
                contactNumber: '+1234567890'
            });
            console.log('Default admin user created successfully');
            console.log('Email: admin@farm.com');
            console.log('Password: admin123');
        }

        // Create additional sample users
        const sampleUsers = [
            {
                name: 'Farm Manager',
                email: 'manager@farm.com',
                password: 'manager123',
                role: 'manager',
                contactNumber: '+1234567891'
            },
            {
                name: 'Farm Worker',
                email: 'worker@farm.com',
                password: 'worker123',
                role: 'worker',
                contactNumber: '+1234567892'
            }
        ];

        for (const userData of sampleUsers) {
            const existing = await User.findOne({ email: userData.email });
            if (!existing) {
                await User.create(userData);
                console.log(`Created user: ${userData.email} / ${userData.password.substring(0, userData.password.length - 3)}***`);
            }
        }

        console.log('\nDatabase initialized successfully!');
        console.log('\nYou can now login with:');
        console.log('Admin: admin@farm.com / admin123');
        console.log('Manager: manager@farm.com / manager123');
        console.log('Worker: worker@farm.com / worker123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDatabase();
