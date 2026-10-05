import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'biteflow_super_secret_jwt_key_2026_olive_sand',
    { expiresIn: '30d' }
  );
};

export const registerUserService = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'USER' | 'ADMIN';
}): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists with this email address');
  }

  const user = await User.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password,
    phone: userData.phone,
    role: userData.role || 'USER',
    addresses: [],
  });

  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};

export const loginUserService = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id.toString(), user.role);
  // remove password before returning
  user.password = undefined;
  return { user, token };
};
