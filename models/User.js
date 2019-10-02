const mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    status: String
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = Bcrypt.hashSync(this.password, 10);
  next();
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
