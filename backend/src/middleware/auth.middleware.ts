import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    sendError(res, 'Not authorized to access this route, no token provided', null, 401);
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'biteflow_super_secret_jwt_key_2026_olive_sand'
    ) as { id: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      sendError(res, 'User no longer exists', null, 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'Not authorized, invalid token', error, 401);
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(
        res,
        `User role '${req.user?.role}' is not authorized to access this route`,
        null,
        403
      );
      return;
    }
    next();
  };
};
