require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
    console.error('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

const promote = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-marketplace';
        await mongoose.connect(MONGODB_URI);

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error(`User with email ${email} not found.`);
        } else {
            console.log(`Success! ${email} is now an admin.`);
        }
        process.exit();
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

promote();
