const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  price: { type: Number, required: true, min: 0 },
  stock: {
    type: Number, default: 0, min: 0,
    validate: { validator: Number.isInteger, message: 'Stock must be an integer' }
  }
}, { timestamps: true, strict: 'throw' });

module.exports = mongoose.model('Product', productSchema);
