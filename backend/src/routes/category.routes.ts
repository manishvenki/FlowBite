import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '../controllers/category.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCategories);

// Admin-only operations
router.post('/', protect, authorize('ADMIN'), createCategory);
router.put('/:id', protect, authorize('ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN'), deleteCategory);
router.patch('/:id/toggle', protect, authorize('ADMIN'), toggleCategoryStatus);

export default router;
