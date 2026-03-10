const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'apple'],
    default: 'local',
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  appleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function requiredPassword() {
      return this.provider === 'local';
    },
  },
  skinType: {
    type: String,
    required: false,
  },
  skinQuiz: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);