import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const seedSuperAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            await User.create({
                name: process.env.ADMIN_NAME || 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('Super Admin initialized securely from environment configuration.');
        } else {
            existingAdmin.role = 'admin';
            existingAdmin.password = hashedPassword;
            existingAdmin.isVerified = true;
            await existingAdmin.save();
        }
    } catch (err) {
        console.error('Error auto-seeding admin:', err.message);
    }
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ' + conn.connection.host);
        await seedSuperAdmin();
    } catch (error) {
        console.error('MongoDB Connection Error: ' + error.message);
    }
};

export default connectDB;
