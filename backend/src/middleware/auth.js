import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware protecting admin publishing and mutation operations.
 * Checks for `x-admin-key` header or Authorization Bearer token matching ADMIN_API_KEY.
 */
export function requireAdminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return res.status(500).json({
      error: 'CONFIG_ERROR',
      message: 'ADMIN_API_KEY is not configured on the server.',
    });
  }

  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization;
  const bearerKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const providedKey = headerKey || bearerKey;

  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or missing admin authorization key.',
    });
  }

  next();
}
