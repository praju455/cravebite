import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { pool } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new ApiError(401, 'Please authenticate'));
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number; isAdmin: boolean };
    const result = await pool.query('SELECT user_id, name, email, is_admin FROM users WHERE user_id = $1', [decoded.id]);
    if (result.rows.length === 0) return next(new ApiError(401, 'User no longer exists'));
    req.user = result.rows[0];
    next();
  } catch (error) {
    return next(new ApiError(401, 'Please authenticate'));
  }
});

export const adminOnly = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.is_admin) return next(new ApiError(403, 'Admin access required'));
  next();
});
