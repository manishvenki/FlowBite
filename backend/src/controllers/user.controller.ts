import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', null, 404);
      return;
    }

    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    sendSuccess(res, 'Profile updated successfully', user);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update profile', null, 400);
  }
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', null, 404);
      return;
    }

    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (!street || !city || !state || !zipCode) {
      sendError(res, 'Street, city, state, and zipCode are required', null, 400);
      return;
    }

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label: label || 'Home',
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    sendSuccess(res, 'Address added successfully', user.addresses);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to add address', null, 400);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', null, 404);
      return;
    }

    const addressId = (Array.isArray(req.params.addressId) ? req.params.addressId[0] : req.params.addressId) as string;
    const address = user.addresses.find((addr: any) => addr._id?.toString() === addressId);
    if (!address) {
      sendError(res, 'Address not found', null, 404);
      return;
    }

    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;

    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = addr._id?.toString() === addressId;
      });
    }

    await user.save();
    sendSuccess(res, 'Address updated successfully', user.addresses);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update address', null, 400);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', null, 404);
      return;
    }

    const addressId = (Array.isArray(req.params.addressId) ? req.params.addressId[0] : req.params.addressId) as string;
    const initialCount = user.addresses.length;
    const wasDefault = user.addresses.find((addr: any) => addr._id?.toString() === addressId)?.isDefault;

    user.addresses = user.addresses.filter((addr: any) => addr._id?.toString() !== addressId);

    if (user.addresses.length === initialCount) {
      sendError(res, 'Address not found', null, 404);
      return;
    }

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    sendSuccess(res, 'Address deleted successfully', user.addresses);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete address', null, 400);
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', null, 404);
      return;
    }

    const addressId = (Array.isArray(req.params.addressId) ? req.params.addressId[0] : req.params.addressId) as string;
    let found = false;
    user.addresses.forEach((addr: any) => {
      if (addr._id?.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      sendError(res, 'Address not found', null, 404);
      return;
    }

    await user.save();
    sendSuccess(res, 'Default address updated successfully', user.addresses);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to set default address', null, 400);
  }
};
