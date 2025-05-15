const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, full_name, age, gender, username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        full_name,
        age: parseInt(age),
        gender: gender.toLowerCase(),
        username,
        hashed_password: hashedPassword
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_change_this_in_production',
      { expiresIn: '24h' }
    );

    // Update user with token
    await prisma.user.update({
      where: { id: user.id },
      data: { jwt_token: token }
    });

    // Return user data without password
    const { hashed_password, ...userData } = user;
    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already in use' });
    }
    
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_change_this_in_production',
      { expiresIn: '24h' }
    );

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { jwt_token: token }
    });

    // Return user data without password
    const { hashed_password, ...userData } = user;
    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret_change_this_in_production'
    );

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const { hashed_password, ...userData } = user;
    res.status(200).json(userData);

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router;