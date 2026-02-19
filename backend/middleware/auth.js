const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No Authorization header found');
            throw new Error('No token');
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            console.log('Token missing after Bearer split');
            throw new Error('No token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log('User not found for token ID:', decoded.id);
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        console.log('Auth middleware error:', e.message);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
