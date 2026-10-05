import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { registerUserService, loginUserService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      sendError(res, 'Please provide name, email, password, and phone', null, 400);
      return;
    }

    if (password.length < 6) {
      sendError(res, 'Password must be at least 6 characters long', null, 400);
      return;
    }

    const { user, token } = await registerUserService({
      name,
      email,
      password,
      phone,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
    });

    sendSuccess(
      res,
      'User registered successfully',
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
        },
        token,
      },
      201
    );
  } catch (error: any) {
    sendError(res, error.message || 'Registration failed', null, 400);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Please provide email and password', null, 400);
      return;
    }

    const { user, token } = await loginUserService(email, password);

    sendSuccess(
      res,
      'Login successful',
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
        },
        token,
      },
      200
    );
  } catch (error: any) {
    sendError(res, error.message || 'Login failed', null, 401);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not found in session', null, 401);
      return;
    }

    sendSuccess(res, 'Current user profile retrieved', {
      user: req.user,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user', null, 500);
  }
};
