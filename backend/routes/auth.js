const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to create JWT token
const createToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: { id: userId } },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, name, email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Use provided name or construct from firstName/lastName
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
    
    user = new User({ 
      firstName: firstName || '',
      lastName: lastName || '',
      name: fullName, 
      email, 
      password 
    });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = await createToken(user._id);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name, 
        email: user.email,
        skinType: user.skinType,
        hairType: user.hairType,
        scalpType: user.scalpType,
        fashionType: user.fashionType,
        skinProfile: user.skinProfile,
        hairProfile: user.hairProfile,
        fashionProfile: user.fashionProfile,
        createdAt: user.createdAt
      } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = await createToken(user._id);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name, 
        email: user.email,
        skinType: user.skinType,
        hairType: user.hairType,
        scalpType: user.scalpType,
        fashionType: user.fashionType,
        skinProfile: user.skinProfile,
        hairProfile: user.hairProfile,
        fashionProfile: user.fashionProfile,
        createdAt: user.createdAt
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Profile endpoints
// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile (partial update)
router.put('/me', auth, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent password updates via this route
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Skin Care Quiz Results
router.post('/quiz/skin', auth, async (req, res) => {
  try {
    const { skinType, skinProfile, skinQuiz } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skinType: skinType || '',
        skinProfile: skinProfile || {},
        skinQuiz: skinQuiz || {},
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log(`Skin care quiz saved for user ${user.email}`);
    res.json({ 
      message: 'Skin care profile saved successfully', 
      user: {
        id: user._id,
        email: user.email,
        skinType: user.skinType,
        skinProfile: user.skinProfile
      }
    });
  } catch (err) {
    console.error('Save skin quiz error:', err);
    res.status(500).json({ message: 'Server error saving skin care profile' });
  }
});

// Save Hair Care Quiz Results
router.post('/quiz/hair', auth, async (req, res) => {
  try {
    const { hairType, scalpType, hairProfile, hairQuiz } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        hairType: hairType || '',
        scalpType: scalpType || '',
        hairProfile: hairProfile || {},
        hairQuiz: hairQuiz || {},
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log(`Hair care quiz saved for user ${user.email}`);
    res.json({ 
      message: 'Hair care profile saved successfully', 
      user: {
        id: user._id,
        email: user.email,
        hairType: user.hairType,
        scalpType: user.scalpType,
        hairProfile: user.hairProfile
      }
    });
  } catch (err) {
    console.error('Save hair quiz error:', err);
    res.status(500).json({ message: 'Server error saving hair care profile' });
  }
});

// Save Fashion Care Quiz Results
router.post('/quiz/fashion', auth, async (req, res) => {
  try {
    const { fashionType, fashionProfile, fashionQuiz } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fashionType: fashionType || '',
        fashionProfile: fashionProfile || {},
        fashionQuiz: fashionQuiz || {},
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log(`Fashion care quiz saved for user ${user.email}`);
    res.json({ 
      message: 'Fashion care profile saved successfully', 
      user: {
        id: user._id,
        email: user.email,
        fashionType: user.fashionType,
        fashionProfile: user.fashionProfile
      }
    });
  } catch (err) {
    console.error('Save fashion quiz error:', err);
    res.status(500).json({ message: 'Server error saving fashion care profile' });
  }
});

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, googleId, profileImage } = req.body;
    
    if (!email || !googleId) {
      return res.status(400).json({ message: 'Email and Google ID are required' });
    }

    // Check if user exists by email or googleId
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (user) {
      // User exists - log them in
      console.log(`Google login: Existing user ${user.email}`);
      
      // Update google ID and profile image if not already set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profileImage && profileImage) {
        user.profileImage = profileImage;
      }
      user.updatedAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        name: name || email.split('@')[0],
        firstName: name ? name.split(' ')[0] : '',
        lastName: name ? name.split(' ').slice(1).join(' ') : '',
        email,
        googleId,
        profileImage,
        // Password not required for Google users
      });
      await user.save();
      console.log(`Google login: New user created ${user.email}`);
    }

    // Create JWT token
    const token = await createToken(user._id);
    
    // Return user data
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        googleId: user.googleId,
        skinType: user.skinType,
        hairType: user.hairType,
        scalpType: user.scalpType,
        fashionType: user.fashionType,
        skinProfile: user.skinProfile,
        hairProfile: user.hairProfile,
        fashionProfile: user.fashionProfile,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

module.exports = router;