import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
} from '../controllers/restaurant.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin-only operations
router.post('/', protect, authorize('ADMIN'), createRestaurant);
router.put('/:id', protect, authorize('ADMIN'), updateRestaurant);
router.patch('/:id/toggle', protect, authorize('ADMIN'), toggleRestaurantStatus);

export default router;
