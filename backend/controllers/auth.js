const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
        res.status(201).send({ user, token });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === 11000) {
            return res.status(400).send({ error: 'Email already exists' });
        }
        res.status(400).send({ error: error.message || 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Failed to fetch user' });
    }
};
