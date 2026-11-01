/**
 * Centralized error handling middleware.
 */
export function errorHandler(err, req, res, next) {
  console.error('Unhandled API Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(status).json({
    error: err.name || 'INTERNAL_ERROR',
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    timestamp: new Date().toISOString(),
  });
}
