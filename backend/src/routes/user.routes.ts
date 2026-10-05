import { Router } from 'express';
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // All user routes require authentication

router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/addresses/:addressId/default', setDefaultAddress);

export default router;
