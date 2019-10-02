const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: false,
    lowercase: true
  },
  password: {
      type: String,
      required: true,
      select: false
  },
  phone: Number,
  status: Number
}, {
  timestamps: true
});

module.exports = model('User', UserSchema);
