require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
    { title: 'iPhone 15 Pro', price: 999, description: 'Latest iPhone with Titanium build.', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop' },
    { title: 'MacBook Air M3', price: 1299, description: 'Powerful and portable laptop.', image: 'https://images.unsplash.com/photo-1517336714460-d1508b82aae1?q=80&w=800&auto=format&fit=crop' },
    { title: 'Sony WH-1000XM5', price: 349, description: 'Industry leading noise cancellation.', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop' },
    { title: 'Kindle Paperwhite', price: 139, description: 'The best e-reader for book lovers.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Logitech MX Master 3S', price: 99, description: 'Ultimate productivity mouse.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop' },
    { title: 'Apple Watch Series 9', price: 399, description: 'Advanced health features.', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop' },
    { title: 'Nintendo Switch OLED', price: 349, description: 'Amazing gaming on the go.', image: 'https://images.unsplash.com/photo-1578303372216-f12a5c364e62?q=80&w=800&auto=format&fit=crop' },
    { title: 'iPad Pro 12.9', price: 1099, description: 'The power of M2 chip.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' },
    { title: 'Samsung S24 Ultra', price: 1199, description: 'The AI phone experience.', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop' },
    { title: 'DJI Mini 4 Pro', price: 759, description: 'Professional drone for everyone.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop' }
];

const seed = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-marketplace';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany();
        await Product.deleteMany();

        const testUser = new User({ email: 'test@test.com', password: '123456', role: 'user' });
        const adminUser = new User({ email: 'admin@test.com', password: 'password', role: 'admin' });
        await testUser.save();
        await adminUser.save();

        await Product.insertMany(products);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
