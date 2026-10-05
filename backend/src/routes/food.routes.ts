import { Router } from 'express';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  toggleFoodAvailability,
} from '../controllers/food.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);

// Admin-only operations
router.post('/', protect, authorize('ADMIN'), createFood);
router.put('/:id', protect, authorize('ADMIN'), updateFood);
router.delete('/:id', protect, authorize('ADMIN'), deleteFood);
router.patch('/:id/toggle', protect, authorize('ADMIN'), toggleFoodAvailability);

export default router;
