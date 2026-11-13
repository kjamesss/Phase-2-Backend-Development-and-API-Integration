const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true, strict: 'throw' });

userSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.password; delete ret.__v; return ret; }
});

module.exports = mongoose.model('User', userSchema);
