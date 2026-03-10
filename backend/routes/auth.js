const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const appleSigninAuth = require('apple-signin-auth');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, provider: 'local' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = await createToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
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

    if (user.provider === 'google' || user.provider === 'apple') {
      return res.status(400).json({ message: `Use ${user.provider} sign-in for this account` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = await createToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Apple Sign-In
router.post('/apple', async (req, res) => {
  try {
    const { idToken, name, email } = req.body;

    if (!process.env.APPLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Apple Sign-In is not configured on server' });
    }

    if (!idToken) {
      return res.status(400).json({ message: 'Apple idToken is required' });
    }

    const payload = await appleSigninAuth.verifyIdToken(idToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    if (!payload || !payload.sub) {
      return res.status(400).json({ message: 'Invalid Apple token payload' });
    }

    const appleId = payload.sub;
    const tokenEmail = payload.email;

    let user = await User.findOne({ appleId });
    if (!user && (email || tokenEmail)) {
      user = await User.findOne({ email: (email || tokenEmail).toLowerCase() });
    }

    const resolvedEmail = (email || tokenEmail || (user && user.email) || '').toLowerCase();
    const resolvedName = name || (user && user.name) || (resolvedEmail ? resolvedEmail.split('@')[0] : 'Apple User');

    if (!user) {
      if (!resolvedEmail) {
        return res.status(400).json({ message: 'Apple email is required on first sign-in' });
      }

      user = new User({
        name: resolvedName,
        email: resolvedEmail,
        provider: 'apple',
        appleId,
      });
      await user.save();
    } else {
      user.provider = 'apple';
      user.appleId = user.appleId || appleId;
      if (!user.name && resolvedName) {
        user.name = resolvedName;
      }
      await user.save();
    }

    const token = await createToken(user._id);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Apple auth error:', err);
    return res.status(401).json({ message: 'Apple authentication failed' });
  }
});

// Google Sign-In
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google Sign-In is not configured on server' });
    }

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        provider: 'google',
        googleId: payload.sub,
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = payload.sub;
      }
      user.provider = 'google';
      if (!user.name && name) {
        user.name = name;
      }
      await user.save();
    }

    const token = await createToken(user._id);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ message: 'Google authentication failed' });
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

module.exports = router;