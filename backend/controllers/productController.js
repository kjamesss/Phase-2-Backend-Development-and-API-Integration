const Product = require('../models/Product');
module.exports = require('./crudController')(Product, 'Product');
