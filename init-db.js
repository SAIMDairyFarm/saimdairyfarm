const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

console.log('MongoDB URI:', process.env.MONGODB_URI);

const initializeDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        // Connect to MongoDB with additional options
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
        });
        console.log('MongoDB connected successfully');
        console.log('Database name:', mongoose.connection.name);

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@farm.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            // Create default admin user
            console.log('Creating admin user...');
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
                console.log(`Creating user: ${userData.email}`);
                await User.create(userData);
                console.log(`Created user: ${userData.email} / ${userData.password.substring(0, userData.password.length - 3)}***`);
            } else {
                console.log(`User ${userData.email} already exists`);
            }
        }

        console.log('\nDatabase initialized successfully!');
        console.log('\nYou can now login with:');
        console.log('Admin: admin@farm.com / admin123');
        console.log('Manager: manager@farm.com / manager123');
        console.log('Worker: worker@farm.com / worker123');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        console.error('Error details:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('This usually indicates a network connectivity issue.');
            console.error('Please check:');
            console.error('1. Your internet connection');
            console.error('2. MongoDB Atlas cluster status');
            console.error('3. IP whitelist settings in MongoDB Atlas');
            console.error('4. Firewall/antivirus settings');
        }
        await mongoose.connection.close();
        process.exit(1);
    }
};

initializeDatabase();