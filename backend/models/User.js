const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  
  // Skincare Profile
  skinType: {
    type: String,
    required: false,
  },
  skinProfile: {
    type: Object,
    default: null,
  },
  skinQuiz: {
    type: Object,
    required: false,
  },

  // Hair Care Profile
  hairType: {
    type: String,
    required: false,
  },
  scalpType: {
    type: String,
    required: false,
  },
  hairProfile: {
    type: Object,
    default: null,
  },
  hairQuiz: {
    type: Object,
    required: false,
  },

  // Fashion Care Profile
  fashionType: {
    type: String,
    required: false,
  },
  fashionProfile: {
    type: Object,
    default: null,
  },
  fashionQuiz: {
    type: Object,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);