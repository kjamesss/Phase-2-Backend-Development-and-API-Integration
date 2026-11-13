const mongoose = require('mongoose');
const { HttpError } = require('./errorHandler');

function validateId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(new HttpError(400, 'Invalid resource ID'));
  }
  next();
}

function validateBody(allowed, required = []) {
  return (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) || !Object.keys(body).length) {
      return next(new HttpError(400, 'A non-empty JSON object is required'));
    }
    if (Object.keys(body).some(key => !allowed.includes(key))) {
      return next(new HttpError(400, 'Request contains unsupported fields'));
    }
    if (required.some(key => body[key] === undefined || body[key] === null)) {
      return next(new HttpError(400, `Required fields: ${required.join(', ')}`));
    }
    for (const [key, value] of Object.entries(body)) {
      if (['price', 'stock'].includes(key)) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          return next(new HttpError(400, `${key} must be a finite number`));
        }
      } else if (typeof value !== 'string') {
        return next(new HttpError(400, `${key} must be a string`));
      }
    }
    if (body.password && (body.password.length < 8 || body.password.length > 128)) {
      return next(new HttpError(400, 'Password must contain 8 to 128 characters'));
    }
    if (body.password === '') return next(new HttpError(400, 'Password cannot be empty'));
    next();
  };
}

module.exports = { validateId, validateBody };
