require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected DB');

        const email = `debug${Date.now()}@test.com`;

        console.log('Creating user...');
        const user = await User.create({
            name: 'Debug User',
            email: email,
            password: 'password123',
            role: 'user'
        });
        console.log('User created:', user._id);

        console.log('Generating token...');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log('Token generated:', token);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
