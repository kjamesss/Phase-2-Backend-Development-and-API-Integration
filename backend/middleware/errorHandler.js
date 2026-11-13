class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function notFound(req, res, next) {
  next(new HttpError(404, 'Route not found'));
}

function errorHandler(err, req, res, next) { // Express identifies error middleware by four parameters.
  if (res.headersSent) return next(err);
  if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request body too large' });
  if (['ValidationError', 'CastError', 'StrictModeError'].includes(err.name)) {
    return res.status(400).json({ message: 'Validation failed', details: err.message });
  }
  const status = err.status || 500;
  if (status >= 500) console.error('Request failed:', err.name);
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : err.message });
}

module.exports = { HttpError, notFound, errorHandler };
