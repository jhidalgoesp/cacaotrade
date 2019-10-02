const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs");

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

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

module.exports = model('User', UserSchema);
